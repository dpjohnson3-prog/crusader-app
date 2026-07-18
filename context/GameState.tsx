import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { addXp, createInitialXp, type StatXp } from '@/lib/stats';
import type { Discipline } from '@/lib/disciplines';

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

// Holds all in-memory app state (stat XP, completed disciplines, journal
// entries) so every tab reads/writes the same data. No persistence yet —
// this resets whenever the app reloads.
export function GameStateProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState<StatXp>(createInitialXp());
  const [doneIds, setDoneIds] = useState<Record<string, boolean>>({});
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const toggleDiscipline = (discipline: Discipline) => {
    const isDone = !!doneIds[discipline.id];
    const delta = isDone ? -discipline.points : discipline.points;
    setXp((prev) => addXp(prev, discipline.category, delta));
    setDoneIds((prev) => ({ ...prev, [discipline.id]: !isDone }));
  };

  const addJournalEntry = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const date = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    setJournalEntries((prev) => [{ id: `${Date.now()}`, date, text: trimmed }, ...prev]);
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
