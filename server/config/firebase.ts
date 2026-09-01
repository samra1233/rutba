import fs from 'fs';
import path from 'path';
import { App, cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Storage, getStorage } from 'firebase-admin/storage';

let firebaseApp: App | null = null;
let firestoreInstance: Firestore | null = null;
let storageInstance: Storage | null = null;
let initialized = false;

export function initFirebase(): Firestore | null {
  if (initialized) return firestoreInstance;
  initialized = true;

  try {
    const webConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      ? path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : path.join(process.cwd(), 'firebase-service-account.json');

    if (!fs.existsSync(webConfigPath) || !fs.existsSync(serviceAccountPath)) {
      console.warn('Firebase Admin credentials are unavailable; using the local database cache.');
      return null;
    }

    const webConfig = JSON.parse(fs.readFileSync(webConfigPath, 'utf-8'));
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    firebaseApp = getApps().length > 0
      ? getApp()
      : initializeApp({
          credential: cert(serviceAccount),
          projectId: webConfig.projectId,
          storageBucket: webConfig.storageBucket
        });

    firestoreInstance = webConfig.firestoreDatabaseId
      ? getFirestore(firebaseApp, webConfig.firestoreDatabaseId)
      : getFirestore(firebaseApp);
    storageInstance = getStorage(firebaseApp);
    console.log(`Firebase Admin initialized securely (Database: ${webConfig.firestoreDatabaseId || '(default)'}, Project: ${webConfig.projectId})`);
  } catch (error) {
    initialized = false;
    console.error('Failed to initialize Firebase Admin:', error instanceof Error ? error.message : error);
  }

  return firestoreInstance;
}

export function getFirestoreDb(): Firestore | null {
  return firestoreInstance || initFirebase();
}

export function getFirebaseStorage(): Storage | null {
  if (!initialized) initFirebase();
  return storageInstance;
}
