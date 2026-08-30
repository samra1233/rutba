import fs from 'fs';
import path from 'path';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, Firestore } from 'firebase/firestore';

let firestoreInstance: Firestore | null = null;
let firestoreInitialized = false;

export function initFirebase(): Firestore | null {
  if (firestoreInitialized) return firestoreInstance;

  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const firebaseConfig = {
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId
      };

      const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      firestoreInstance = config.firestoreDatabaseId 
        ? getFirestore(firebaseApp, config.firestoreDatabaseId)
        : getFirestore(firebaseApp);

      const dbName = config.firestoreDatabaseId || '(default)';
      console.log(`Firebase Firestore initialized successfully (Database: ${dbName}, Project: ${config.projectId})`);

      // Non-blocking connectivity test
      getDocFromServer(doc(firestoreInstance, 'test', 'connection')).catch(() => {});
      firestoreInitialized = true;
    } else {
      console.warn("firebase-applet-config.json not found, utilizing local fallback database.");
    }
  } catch (e) {
    console.error("Failed to initialize Firebase Firestore:", e);
  }

  return firestoreInstance;
}

export function getFirestoreDb(): Firestore | null {
  return firestoreInstance || initFirebase();
}
