import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '@/context/Auth';
import type { Discipline } from '@/lib/disciplines';
import { db } from '@/lib/firebase';
import { addXp, createInitialXp, type StatXp } from '@/lib/stats';

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
}

interface GameStateValue {
  xp: StatXp;
  doneIds: Record<string, boolean>;
  toggleDiscipline: (discipline: Discipline) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (text: string) => void;
}

const GameStateContext = createContext<GameStateValue | undefined>(undefined);

function formatEntryDate(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) {
    // Written with serverTimestamp(); the local snapshot briefly sees this
    // as null until the server confirms the write.
    return 'Just now';
  }
  return timestamp.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Backs Body/Mind/Spirit XP, completed disciplines, and journal entries with
// Firestore under users/{uid}, so they persist across app restarts and
// re-logins. Everything here is scoped to the signed-in user (see
// firestore.rules) and holds empty/default state when signed out.
export function GameStateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [xp, setXp] = useState<StatXp>(createInitialXp());
  const [doneIds, setDoneIds] = useState<Record<string, boolean>>({});
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (!uid || !db) {
      setXp(createInitialXp());
      setDoneIds({});
      setJournalEntries([]);
      return;
    }

    const unsubUser = onSnapshot(doc(db, 'users', uid), (snap) => {
      const data = snap.data();
      setXp((data?.xp as StatXp) ?? createInitialXp());
      setDoneIds((data?.doneIds as Record<string, boolean>) ?? {});
    });

    const entriesQuery = query(collection(db, 'users', uid, 'journalEntries'), orderBy('createdAt', 'desc'));
    const unsubEntries = onSnapshot(entriesQuery, (snap) => {
      setJournalEntries(
        snap.docs.map((entrySnap) => ({
          id: entrySnap.id,
          text: entrySnap.data().text as string,
          date: formatEntryDate(entrySnap.data().createdAt as Timestamp | null),
        }))
      );
    });

    return () => {
      unsubUser();
      unsubEntries();
    };
  }, [uid]);

  const toggleDiscipline = (discipline: Discipline) => {
    if (!uid || !db) return;
    const isDone = !!doneIds[discipline.id];
    const delta = isDone ? -discipline.points : discipline.points;
    const nextXp = addXp(xp, discipline.category, delta);
    const nextDoneIds = { ...doneIds, [discipline.id]: !isDone };
    setDoc(doc(db, 'users', uid), { xp: nextXp, doneIds: nextDoneIds }, { merge: true });
  };

  const addJournalEntry = (text: string) => {
    if (!uid || !db) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    addDoc(collection(db, 'users', uid, 'journalEntries'), {
      text: trimmed,
      createdAt: serverTimestamp(),
    });
  };

  const value = useMemo(
    () => ({ xp, doneIds, toggleDiscipline, journalEntries, addJournalEntry }),
    [xp, doneIds, journalEntries]
  );

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return ctx;
}
