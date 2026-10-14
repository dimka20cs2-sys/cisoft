// Звонки 1:1: WebRTC + сигналинг через Firestore (calls/{id}).
import { db, isEmu } from './fb.js';
import {
  doc, collection, setDoc, updateDoc, addDoc, onSnapshot, serverTimestamp, runTransaction
} from './fs.js';
import { iceServers } from '../config.js';
import { state, emit } from './state.js';
import { toast } from './dom.js';
import { sendCallMessage } from './send.js';
import { startRingback, stopTones, playHangup } from './sound.js';
import { callsSupported, getLocalMedia, mediaError, getCameraTrack, listCameras } from './rtc-media.js';

export const TERMINAL = ['ended', 'declined', 'missed', 'cancelled', 'failed'];
const RING_TIMEOUT = 40000;

let current = null;
export function currentCall() { return current; }

class CallSession {
  constructor({ id, chatId, callerId, calleeId, video, role }) {
    Object.assign(this, { id, chatId, callerId, calleeId, video, role });
    this.peerUid = role === 'caller' ? calleeId : callerId;
    this.ref = doc(db, 'calls', id);
    this.status = 'ringing';     // ringing → connecting → active → ended
    this.remoteStream = new MediaStream();
    this.unsubs = []; this.timers = [];
    this.micOn = true; this.camOn = false; this.remoteVideo = false;
    this.connectedAt = 0; this.ended = false; this.note = '';
  }
  update() { emit('call-update', this); }

  createPC() {
    const pc = new RTCPeerConnection({ iceServers });
    this.pc = pc;
    pc.ontrack = (e) => {
      if (!this.remoteStream.getTracks().includes(e.track)) this.remoteStream.addTrack(e.track);
      this.update();
    };
    pc.oniceconnectionstatechange = () => this.onIce(pc.iceConnectionState);
    return pc;
  }

  attachLocal(stream) {
    this.localStream = stream;
    for (const t of stream.getTracks()) this.pc.addTrack(t, stream);
    this.camOn = stream.getVideoTracks().length > 0;
  }

  // Видео-трансивер есть всегда, чтобы включать камеру без повторного согласования
  ensureVideoTransceiver() {
    let t = this.videoTransceiver();
    if (!t) t = this.pc.addTransceiver('video', { direction: 'sendrecv' });
    else if (t.direction !== 'sendrecv') t.direction = 'sendrecv';
  }
  videoTransceiver() { return this.pc.getTransceivers().find((t) => t.receiver.track?.kind === 'video'); }

  watchCandidates(sub) {
    this.unsubs.push(onSnapshot(collection(this.ref, sub), (snap) => {
      for (const ch of snap.docChanges()) {
        if (ch.type === 'added') this.pc.addIceCandidate(ch.doc.data()).catch((e) => console.warn('ice', e));
      }
    }));
  }

  watchDoc() {
    this.unsubs.push(onSnapshot(this.ref, async (snap) => {
      const d = snap.data();
      if (!d || this.ended) return;
      this.remoteVideo = !!(this.role === 'caller' ? d.calleeVideo : d.callerVideo);
      if (this.role === 'caller' && d.answer && !this.pc.currentRemoteDescription) {
        try {
          await this.pc.setRemoteDescription(d.answer);
          this.watchCandidates('calleeCandidates');
        } catch (e) { console.error(e); this.finish('failed'); return; }
      }
      if (d.status === 'accepted' && this.status === 'ringing') {
        this.status = 'connecting'; stopTones();
        this.timers.push(setTimeout(() => { if (!this.connectedAt && !this.ended) this.finish('failed'); }, 30000));
      }
      if (TERMINAL.includes(d.status)) {
        if (d.status === 'declined' && this.role === 'caller') toast('Собеседник отклонил звонок');
        this.cleanup();
        return;
      }
      this.update();
    }));
  }

  onIce(s) {
    if (this.ended) return;
    if (s === 'connected' || s === 'completed') {
      if (!this.connectedAt) this.connectedAt = Date.now();
      this.status = 'active'; this.note = '';
      clearTimeout(this.dropTimer);
    } else if (s === 'disconnected') {
      this.note = 'Связь прервалась, переподключаемся…';
      clearTimeout(this.dropTimer);
      this.dropTimer = setTimeout(() => { if (['disconnected', 'failed'].includes(this.pc.iceConnectionState)) this.finish(this.connectedAt ? 'ended' : 'failed'); }, 15000);
    } else if (s === 'failed') {
      if (!this.connectedAt) toast('Не удалось установить соединение. Возможно, сеть блокирует звонки (нужен TURN-сервер).', 'error');
      this.finish(this.connectedAt ? 'ended' : 'failed');
      return;
    }
    this.update();
  }

  // Завершить звонок своим действием; записать итог и сообщение в чат (только один раз)
  async finish(status) {
    if (this.ended) return;
    if (status === 'ended' && !this.connectedAt && this.status === 'ringing') status = this.role === 'caller' ? 'cancelled' : 'declined';
    const duration = this.connectedAt ? Math.round((Date.now() - this.connectedAt) / 1000) : 0;
    this.cleanup();
    let wrote = false;
    try {
      wrote = await runTransaction(db, async (tx) => {
        const s = await tx.get(this.ref);
        if (!s.exists() || TERMINAL.includes(s.data().status)) return false;
        tx.update(this.ref, { status, endedAt: serverTimestamp(), endedBy: state.uid, duration });
        return true;
      });
    } catch (e) { console.warn('finish', e); }
    if (wrote) {
      sendCallMessage(this.chatId, this.id, { callerId: this.callerId, calleeId: this.calleeId, video: !!this.video, status, duration })
        .catch((e) => console.warn('call msg', e));
    }
  }

  cleanup() {
    if (this.ended) return;
    this.ended = true;
    this.status = 'ended';
    stopTones(); playHangup();
    this.unsubs.forEach((u) => u()); this.unsubs = [];
    this.timers.forEach(clearTimeout); clearTimeout(this.dropTimer);
    this.localStream?.getTracks().forEach((t) => t.stop());
    try { this.pc?.close(); } catch { /* ignore */ }
    if (current === this) { current = null; state.inCall = false; }
    window.removeEventListener('pagehide', this.onUnload);
    this.update();
  }

  // ---- Управление во время звонка ----
  toggleMic() {
    const t = this.localStream?.getAudioTracks()[0];
    if (!t) return;
    t.enabled = !t.enabled; this.micOn = t.enabled; this.update();
  }

  async setCamera(on, deviceId) {
    const tr = this.videoTransceiver();
    if (!tr) return;
    const old = this.localStream.getVideoTracks()[0];
    try {
      if (on) {
        const track = await getCameraTrack(deviceId);
        if (this.ended) { track.stop(); return; }
        await tr.sender.replaceTrack(track);
        if (old) { this.localStream.removeTrack(old); old.stop(); }
        this.localStream.addTrack(track);
        this.cameraId = track.getSettings().deviceId;
      } else {
        await tr.sender.replaceTrack(null);
        if (old) { this.localStream.removeTrack(old); old.stop(); }
      }
      this.camOn = on;
      updateDoc(this.ref, { [this.role === 'caller' ? 'callerVideo' : 'calleeVideo']: on }).catch(() => {});
    } catch (e) { toast(mediaError(e, true), 'error'); }
    this.update();
  }
  toggleCamera() { return this.setCamera(!this.camOn); }

  async switchCamera() {
    const cams = await listCameras();
    if (cams.length < 2) { toast('Другая камера не найдена'); return; }
    const curId = this.localStream.getVideoTracks()[0]?.getSettings().deviceId || this.cameraId;
    const idx = cams.findIndex((c) => c.deviceId === curId);
    await this.setCamera(true, cams[(idx + 1) % cams.length].deviceId);
  }

  hangup() { return this.finish('ended'); }
}

function begin(session) {
  current = session; state.inCall = true;
  session.onUnload = () => {
    if (!session.ended) updateDoc(session.ref, { status: session.connectedAt ? 'ended' : (session.role === 'caller' ? 'cancelled' : 'declined'), endedAt: serverTimestamp() }).catch(() => {});
  };
  window.addEventListener('pagehide', session.onUnload);
  if (isEmu || new URLSearchParams(location.search).get('test') === '1') window.__cisoftCall = session; // для автотестов
}

export async function startCall(chatId, calleeId, video) {
  if (!callsSupported()) { toast('Этот браузер не поддерживает звонки. Используйте свежий Chrome, Edge, Firefox или Safari.', 'error'); return; }
  if (state.inCall) { toast('Вы уже разговариваете'); return; }
  state.inCall = true;
  let media;
  try { media = await getLocalMedia(video); }
  catch (e) { state.inCall = false; toast(mediaError(e, video), 'error'); return; }
  if (media.videoFailed) toast('Камера недоступна — звоним без видео');
  const ref = doc(collection(db, 'calls'));
  const s = new CallSession({ id: ref.id, chatId, callerId: state.uid, calleeId, video, role: 'caller' });
  begin(s);
  const pc = s.createPC();
  s.attachLocal(media.stream);
  s.ensureVideoTransceiver();
  const queue = []; let docReady = false;
  const sendCand = (c) => addDoc(collection(s.ref, 'callerCandidates'), c).catch(() => {});
  pc.onicecandidate = (e) => { if (e.candidate) { const c = e.candidate.toJSON(); docReady ? sendCand(c) : queue.push(c); } };
  s.update();
  try {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await setDoc(s.ref, {
      chatId, callerId: state.uid, calleeId, video: !!video, status: 'ringing',
      offer: { type: offer.type, sdp: offer.sdp }, createdAt: serverTimestamp(),
      callerVideo: s.camOn, calleeVideo: false
    });
  } catch (e) {
    console.error(e); toast('Не удалось начать звонок. Проверьте интернет.', 'error'); s.cleanup(); return;
  }
  docReady = true; queue.splice(0).forEach(sendCand);
  s.watchDoc();
  startRingback();
  s.timers.push(setTimeout(() => { if (s.status === 'ringing' && !s.ended) s.finish('missed'); }, RING_TIMEOUT));
}

// Принять входящий звонок (данные документа calls/{id})
export async function acceptCall(id, d) {
  if (state.inCall) return;
  state.inCall = true;
  const s = new CallSession({ id, chatId: d.chatId, callerId: d.callerId, calleeId: d.calleeId, video: d.video, role: 'callee' });
  begin(s);
  s.update();
  let media;
  try { media = await getLocalMedia(d.video); }
  catch (e) { toast(mediaError(e, d.video), 'error'); s.finish('failed'); return; }
  if (media.videoFailed) toast('Камера недоступна — отвечаем без видео');
  const pc = s.createPC();
  pc.onicecandidate = (e) => { if (e.candidate) addDoc(collection(s.ref, 'calleeCandidates'), e.candidate.toJSON()).catch(() => {}); };
  try {
    await pc.setRemoteDescription(d.offer);
    s.attachLocal(media.stream);
    s.ensureVideoTransceiver();
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await updateDoc(s.ref, { answer: { type: answer.type, sdp: answer.sdp }, status: 'accepted', acceptedAt: serverTimestamp(), calleeVideo: s.camOn });
  } catch (e) {
    console.error(e); toast('Не удалось ответить на звонок.', 'error'); s.finish('failed'); return;
  }
  s.status = 'connecting';
  s.remoteVideo = !!d.callerVideo;
  s.watchCandidates('callerCandidates');
  s.watchDoc();
  s.timers.push(setTimeout(() => { if (!s.connectedAt && !s.ended) s.finish('failed'); }, 30000));
  s.update();
}
