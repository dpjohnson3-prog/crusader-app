import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { auth, isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  isFirebaseConfigured: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogleIdToken: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Only block on an async check when Firebase is actually configured —
  // otherwise this would stay true forever during server-side static
  // rendering, since the effect below never runs there.
  const [initializing, setInitializing] = useState(() => isFirebaseConfigured && !!auth);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setInitializing(false);
      return;
    }
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      isFirebaseConfigured,
      signUpWithEmail: async (email, password) => {
        if (!auth) throw new Error('Firebase is not configured.');
        await createUserWithEmailAndPassword(auth, email, password);
      },
      signInWithEmail: async (email, password) => {
        if (!auth) throw new Error('Firebase is not configured.');
        await signInWithEmailAndPassword(auth, email, password);
      },
      signInWithGoogleIdToken: async (idToken) => {
        if (!auth) throw new Error('Firebase is not configured.');
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
      },
      signOut: async () => {
        if (!auth) return;
        await firebaseSignOut(auth);
      },
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
