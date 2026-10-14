// Операции с чатами и сообщениями в Firestore.
import { db } from './fb.js';
import {
  doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, writeBatch,
  serverTimestamp, increment, deleteField, arrayUnion, arrayRemove
} from './fs.js';
import { state } from './state.js';
import { directChatId } from './util.js';
import { displayName } from './users.js';

export const MAX_TEXT = 4000;

const chatRef = (id) => doc(db, 'chats', id);
const msgCol = (id) => collection(db, 'chats', id, 'messages');

function emptyChat(extra) {
  return { createdAt: serverTimestamp(), updatedAt: serverTimestamp(), lastMessage: null, lastRead: {}, typing: {}, unread: {}, ...extra };
}

// Личный чат: id = отсортированные uid через "_"
export async function openDirect(otherUid) {
  const id = directChatId(state.uid, otherUid);
  const snap = await getDoc(chatRef(id));
  if (!snap.exists()) {
    try {
      await setDoc(chatRef(id), emptyChat({ type: 'direct', members: [state.uid, otherUid].sort() }));
    } catch (e) {
      const again = await getDoc(chatRef(id)); // мог создать собеседник одновременно с нами
      if (!again.exists()) throw e;
    }
  }
  return id;
}

export async function createGroup(title, memberUids) {
  const members = [...new Set([state.uid, ...memberUids])].slice(0, 50);
  const ref = await addDoc(collection(db, 'chats'),
    emptyChat({ type: 'group', title: title.trim().slice(0, 80), ownerId: state.uid, members }));
  await sendSystem(ref.id, `${displayName(state.uid)} создал(а) группу «${title.trim().slice(0, 80)}»`, members);
  return ref.id;
}

function summary(type, text) {
  if (type === 'image') return '📷 Фото' + (text ? ': ' + text : '');
  if (type === 'call') return '📞 Звонок';
  return String(text || '').slice(0, 200);
}

// Общая отправка: сообщение + обновление чата одним пакетом
async function commitMessage(chatId, data, { members, msgId, media } = {}) {
  const chat = state.chats.get(chatId);
  const all = members || chat?.members || [];
  const batch = writeBatch(db);
  const mRef = msgId ? doc(msgCol(chatId), msgId) : doc(msgCol(chatId));
  if (media) batch.set(doc(db, 'chats', chatId, 'media', data.mediaId), { data: media, senderId: state.uid, createdAt: serverTimestamp() });
  batch.set(mRef, { ...data, senderId: state.uid, createdAt: serverTimestamp() });
  const upd = {
    lastMessage: { id: mRef.id, text: summary(data.type, data.text), senderId: state.uid, at: serverTimestamp(), type: data.type },
    updatedAt: serverTimestamp(),
    ['typing.' + state.uid]: deleteField(),
    ['lastRead.' + state.uid]: serverTimestamp()
  };
  for (const uid of all) if (uid !== state.uid) upd['unread.' + uid] = increment(1);
  batch.update(chatRef(chatId), upd);
  await batch.commit();
  return mRef.id;
}

export function sendText(chatId, text, replyTo) {
  const t = String(text).slice(0, MAX_TEXT);
  return commitMessage(chatId, { type: 'text', text: t, replyTo: replyTo || null, edited: false, deleted: false });
}

export function sendImage(chatId, { data, preview, width, height }, caption, replyTo) {
  const mediaId = doc(collection(db, 'chats', chatId, 'media')).id;
  return commitMessage(chatId, {
    type: 'image', text: String(caption || '').slice(0, MAX_TEXT), mediaId, preview,
    width: width || null, height: height || null, replyTo: replyTo || null, edited: false, deleted: false
  }, { media: data });
}

export function sendSystem(chatId, text, members) {
  return commitMessage(chatId, { type: 'system', text, edited: false, deleted: false }, { members });
}

// Сообщение о звонке; id = callId, чтобы не было дублей
export function sendCallMessage(chatId, callId, call) {
  return commitMessage(chatId, { type: 'call', text: '', call, edited: false, deleted: false }, { msgId: callId });
}

async function syncLast(chatId, msgId, text) {
  const chat = state.chats.get(chatId);
  if (chat?.lastMessage?.id === msgId) {
    await updateDoc(chatRef(chatId), { 'lastMessage.text': text }).catch(() => {});
  }
}

export async function editMessage(chatId, msgId, text) {
  const t = String(text).slice(0, MAX_TEXT);
  await updateDoc(doc(msgCol(chatId), msgId), { text: t, edited: true });
  await syncLast(chatId, msgId, t);
}

export async function deleteMessage(chatId, msg) {
  await updateDoc(doc(msgCol(chatId), msg.id), { text: '', deleted: true, preview: null });
  if (msg.mediaId) await deleteDoc(doc(db, 'chats', chatId, 'media', msg.mediaId)).catch(() => {});
  await syncLast(chatId, msg.id, 'Сообщение удалено');
}

export async function loadMedia(chatId, mediaId) {
  const s = await getDoc(doc(db, 'chats', chatId, 'media', mediaId));
  return s.exists() ? s.data().data : null;
}

export function markRead(chatId) {
  return updateDoc(chatRef(chatId), { ['lastRead.' + state.uid]: serverTimestamp(), ['unread.' + state.uid]: 0 }).catch(() => {});
}

export function setTyping(chatId) {
  return updateDoc(chatRef(chatId), { ['typing.' + state.uid]: serverTimestamp() }).catch(() => {});
}

// ---- Группы ----
export async function addMember(chatId, uid) {
  await updateDoc(chatRef(chatId), { members: arrayUnion(uid), updatedAt: serverTimestamp() });
  const chat = state.chats.get(chatId);
  await sendSystem(chatId, `${displayName(state.uid)} добавил(а) ${displayName(uid)}`, [...(chat?.members || []), uid]);
}

export async function removeMember(chatId, uid) {
  await updateDoc(chatRef(chatId), { members: arrayRemove(uid), updatedAt: serverTimestamp() });
  await sendSystem(chatId, `${displayName(state.uid)} удалил(а) ${displayName(uid)}`);
}

export async function leaveGroup(chatId) {
  const chat = state.chats.get(chatId);
  await sendSystem(chatId, `${displayName(state.uid)} покинул(а) группу`).catch(() => {});
  const upd = { members: arrayRemove(state.uid), updatedAt: serverTimestamp() };
  if (chat?.ownerId === state.uid) {
    const next = (chat.members || []).find((u) => u !== state.uid);
    if (next) upd.ownerId = next;
  }
  await updateDoc(chatRef(chatId), upd);
}

export async function renameGroup(chatId, title) {
  await updateDoc(chatRef(chatId), { title: title.trim().slice(0, 80), updatedAt: serverTimestamp() });
}
