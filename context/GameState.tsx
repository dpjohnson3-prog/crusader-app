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
import * as Haptics from 'expo-haptics';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { useAuth } from '@/context/Auth';
import {
  computeDaysCompleted,
  computeStreak,
  createInitialCrusade,
  formatDateKey,
  getCrusadeDayNumber,
  isCrusadeComplete,
  type CrusadeState,
} from '@/lib/crusade';
import { TOTAL_DISCIPLINES, type Discipline } from '@/lib/disciplines';
import { db } from '@/lib/firebase';
import { addXp, createInitialXp, currentRank, levelFromXp, totalLevel, type StatCategory, type StatXp } from '@/lib/stats';

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
}

export interface LevelUpEvent {
  category: StatCategory;
  token: number;
}

export interface RankUpEvent {
  rank: string;
  token: number;
}

interface GameStateValue {
  xp: StatXp;
  doneIds: Record<string, boolean>;
  toggleDiscipline: (discipline: Discipline) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (text: string) => void;
  levelUpEvent: LevelUpEvent | null;
  rankUpEvent: RankUpEvent | null;
  // The Crusade — a 40-day campaign layered on the permanent XP/rank system.
  crusadeDayNumber: number;
  crusadeStreak: number;
  crusadeDaysCompleted: number;
  crusadeComplete: boolean;
  crusadeVowMode: boolean;
  setCrusadeVowMode: (enabled: boolean) => void;
  beginNewCrusade: () => void;
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

// Backs Body/Mind/Spirit XP, completed disciplines, journal entries, and the
// current Crusade with Firestore under users/{uid}, so they persist across
// app restarts and re-logins. Everything here is scoped to the signed-in
// user (see firestore.rules) and holds empty/default state when signed out.
//
// `doneIds` is scoped to *today* — it's reset (client-side, based on
// `doneIdsDate`) whenever the stored date doesn't match today, so The
// Charge's checklist starts blank each day while xp stays permanent.
export function GameStateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [xp, setXp] = useState<StatXp>(createInitialXp());
  const [doneIds, setDoneIds] = useState<Record<string, boolean>>({});
  const [doneIdsDate, setDoneIdsDate] = useState<string>('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [crusade, setCrusade] = useState<CrusadeState>(() => createInitialCrusade(formatDateKey(new Date())));
  const [levelUpEvent, setLevelUpEvent] = useState<LevelUpEvent | null>(null);
  const [rankUpEvent, setRankUpEvent] = useState<RankUpEvent | null>(null);
  const eventTokenRef = useRef(0);

  useEffect(() => {
    if (!uid || !db) {
      setXp(createInitialXp());
      setDoneIds({});
      setDoneIdsDate('');
      setJournalEntries([]);
      setCrusade(createInitialCrusade(formatDateKey(new Date())));
      return;
    }

    const unsubUser = onSnapshot(doc(db, 'users', uid), (snap) => {
      const data = snap.data();
      const todayKey = formatDateKey(new Date());
      const rawDoneIds = (data?.doneIds as Record<string, boolean>) ?? {};
      const rawDoneIdsDate = (data?.doneIdsDate as string) ?? '';
      setXp((data?.xp as StatXp) ?? createInitialXp());
      setDoneIds(rawDoneIdsDate === todayKey ? rawDoneIds : {});
      setDoneIdsDate(rawDoneIdsDate);
      setCrusade((data?.crusade as CrusadeState) ?? createInitialCrusade(todayKey));
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
    const todayKey = formatDateKey(new Date());
    // Re-derive today's effective doneIds here too (not just in the snapshot
    // handler) in case the calendar day rolled over while the app was open
    // without a Firestore update in between.
    const currentDoneIds = doneIdsDate === todayKey ? doneIds : {};

    const isDone = !!currentDoneIds[discipline.id];
    const nowDone = !isDone;
    const delta = isDone ? -discipline.points : discipline.points;
    const nextXp = addXp(xp, discipline.category, delta);
    const nextDoneIds = { ...currentDoneIds, [discipline.id]: nowDone };

    const doneCount = Object.values(nextDoneIds).filter(Boolean).length;
    const nextCrusade: CrusadeState = {
      ...crusade,
      dailyLog: {
        ...crusade.dailyLog,
        [todayKey]: { doneCount, allDone: doneCount === TOTAL_DISCIPLINES },
      },
    };

    setDoc(
      doc(db, 'users', uid),
      { xp: nextXp, doneIds: nextDoneIds, doneIdsDate: todayKey, crusade: nextCrusade },
      { merge: true }
    );

    if (nowDone) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const prevLevel = levelFromXp(xp[discipline.category]);
      const nextLevel = levelFromXp(nextXp[discipline.category]);
      if (nextLevel > prevLevel) {
        eventTokenRef.current += 1;
        setLevelUpEvent({ category: discipline.category, token: eventTokenRef.current });
      }

      const prevRank = currentRank(totalLevel(xp));
      const nextRank = currentRank(totalLevel(nextXp));
      if (nextRank !== prevRank) {
        eventTokenRef.current += 1;
        setRankUpEvent({ rank: nextRank, token: eventTokenRef.current });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
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

  const setCrusadeVowMode = (enabled: boolean) => {
    if (!uid || !db) return;
    const nextCrusade: CrusadeState = { ...crusade, vowMode: enabled };
    setDoc(doc(db, 'users', uid), { crusade: nextCrusade }, { merge: true });
  };

  const beginNewCrusade = () => {
    if (!uid || !db) return;
    const nextCrusade = createInitialCrusade(formatDateKey(new Date()), crusade.vowMode);
    setDoc(doc(db, 'users', uid), { crusade: nextCrusade }, { merge: true });
  };

  const value = useMemo(() => {
    const todayKey = formatDateKey(new Date());
    return {
      xp,
      doneIds,
      toggleDiscipline,
      journalEntries,
      addJournalEntry,
      levelUpEvent,
      rankUpEvent,
      crusadeDayNumber: getCrusadeDayNumber(crusade, todayKey),
      crusadeStreak: computeStreak(crusade, todayKey),
      crusadeDaysCompleted: computeDaysCompleted(crusade, todayKey),
      crusadeComplete: isCrusadeComplete(crusade, todayKey),
      crusadeVowMode: crusade.vowMode,
      setCrusadeVowMode,
      beginNewCrusade,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, doneIds, doneIdsDate, journalEntries, levelUpEvent, rankUpEvent, crusade]);

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return ctx;
}
