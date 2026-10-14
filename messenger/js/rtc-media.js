// Доступ к микрофону/камере и понятные сообщения об ошибках.

export function callsSupported() {
  return !!(window.RTCPeerConnection && navigator.mediaDevices?.getUserMedia);
}

const AUDIO = { echoCancellation: true, noiseSuppression: true, autoGainControl: true };
export function videoConstraints(deviceId) {
  const v = { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } };
  if (deviceId) v.deviceId = { exact: deviceId }; else v.facingMode = 'user';
  return v;
}

export function mediaError(e, video) {
  const what = video ? 'микрофону и камере' : 'микрофону';
  switch (e?.name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return `Нет доступа к ${what}. Разрешите доступ: значок замка в адресной строке → Разрешения, затем повторите звонок.`;
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return video ? 'Камера или микрофон не найдены. Подключите устройство и попробуйте снова.' : 'Микрофон не найден. Подключите микрофон и попробуйте снова.';
    case 'NotReadableError':
    case 'TrackStartError':
      return 'Микрофон или камера заняты другой программой (например, Zoom или Skype). Закройте её и попробуйте снова.';
    case 'OverconstrainedError':
      return 'Выбранная камера недоступна.';
    case 'SecurityError':
      return 'Звонки работают только на защищённом сайте (https).';
    default:
      return 'Не удалось включить ' + (video ? 'микрофон или камеру' : 'микрофон') + '.';
  }
}

// Получить поток. Если камеры нет — звоним только с микрофоном.
export async function getLocalMedia(video) {
  if (!window.isSecureContext) throw { name: 'SecurityError' };
  try {
    return { stream: await navigator.mediaDevices.getUserMedia({ audio: AUDIO, video: video ? videoConstraints() : false }), videoFailed: false };
  } catch (e) {
    if (video && ['NotFoundError', 'NotReadableError', 'OverconstrainedError', 'DevicesNotFoundError'].includes(e?.name)) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO, video: false });
      return { stream, videoFailed: true };
    }
    throw e;
  }
}

export async function getCameraTrack(deviceId) {
  const s = await navigator.mediaDevices.getUserMedia({ video: videoConstraints(deviceId) });
  return s.getVideoTracks()[0];
}

export async function listCameras() {
  try {
    const all = await navigator.mediaDevices.enumerateDevices();
    return all.filter((d) => d.kind === 'videoinput');
  } catch { return []; }
}
