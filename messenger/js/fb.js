import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAuth, connectAuthEmulator } from './fa.js';
import { initializeFirestore, connectFirestoreEmulator } from './fs.js';
import { firebaseConfig, useEmulators, emulatorProjectId, emulatorHosts } from '../config.js';

const cfg = useEmulators
  ? { apiKey: 'demo-key', authDomain: emulatorProjectId + '.firebaseapp.com', projectId: emulatorProjectId }
  : firebaseConfig;

export const configMissing = !useEmulators && String(firebaseConfig.apiKey || '').startsWith('ВСТАВЬТЕ');

export const app = initializeApp(cfg);
export const auth = getAuth(app);
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

if (useEmulators) {
  connectAuthEmulator(auth, emulatorHosts.auth, { disableWarnings: true });
  connectFirestoreEmulator(db, emulatorHosts.firestoreHost, emulatorHosts.firestorePort);
}

export const isEmu = useEmulators;
