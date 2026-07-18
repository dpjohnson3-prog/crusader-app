import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
// `@firebase/auth`'s package.json lists the "types" export condition before
// "react-native", so tsc always resolves the generic (browser) .d.ts here —
// it never sees the react-native-specific declaration that has this export,
// even though Metro correctly bundles the react-native build at runtime,
// which does export it. Verified via `tsc --traceResolution`.
// @ts-expect-error -- see comment above; remove once @firebase/auth reorders its exports map.
import { getReactNativePersistence } from '@firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// True once every required env var is filled in (see .env.example). Until
// then we skip initializing Firebase entirely instead of letting it throw
// on bad/missing config.
export const isFirebaseConfigured = Object.values(firebaseConfig).every((value) => !!value);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  if (Platform.OS === 'web') {
    // Web doesn't need AsyncStorage — Firebase Auth handles browser
    // persistence (IndexedDB/localStorage) on its own via getAuth().
    auth = getAuth(app);
  } else {
    try {
      auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
    } catch {
      // initializeAuth throws if it's already been called for this app
      // (e.g. Fast Refresh re-running this module) — reuse the existing instance.
      auth = getAuth(app);
    }
  }

  db = getFirestore(app);
}

export { app, auth, db };
