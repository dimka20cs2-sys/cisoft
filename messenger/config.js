// Настройки CISOFT Messenger.
// 1) Вставьте сюда конфиг веб-приложения из консоли Firebase
//    (Project settings → General → Your apps → Web app → SDK setup and configuration → Config).
export const firebaseConfig = {
  apiKey: 'AIzaSyCggyUSObbIwT-UvU23Gi3JrR9pIG5ZtuM',
  authDomain: 'cisoft-msg-4139.firebaseapp.com',
  projectId: 'cisoft-msg-4139',
  storageBucket: 'cisoft-msg-4139.firebasestorage.app',
  messagingSenderId: '321815930958',
  appId: '1:321815930958:web:e21a7c9c0df1816ac43b1f'
};

// 2) Серверы для установления соединения при звонках.
//    STUN помогает в большинстве домашних сетей. Чтобы звонки работали
//    через строгие корпоративные/мобильные сети, добавьте TURN-сервер, например:
//    { urls: 'turn:turn.example.com:3478', username: 'user', credential: 'pass' }
export const iceServers = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }
];

// 3) Локальная разработка: ?emu=1 в адресе или запуск на localhost/127.0.0.1
//    подключает приложение к эмуляторам Firebase (проект demo-cisoft).
const host = location.hostname;
const q = new URLSearchParams(location.search);
export const useEmulators =
  q.get('emu') === '1' ||
  ((host === 'localhost' || host === '127.0.0.1') && q.get('emu') !== '0'); // ?emu=0 — настоящий Firebase с локального сервера

export const emulatorProjectId = 'demo-cisoft';
export const emulatorHosts = {
  auth: 'http://127.0.0.1:9099',
  firestoreHost: '127.0.0.1',
  firestorePort: 8080
};
