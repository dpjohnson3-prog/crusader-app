// "The Crusade" — a fixed 40-day campaign layered on top of the permanent
// XP/rank system. Days completed and streaks are scoped to the current
// crusade and reset when a new one begins; XP and rank never do.

export const CRUSADE_LENGTH_DAYS = 40;

export interface CrusadeDayLog {
  doneCount: number;
  allDone: boolean;
}

export interface CrusadeState {
  /** Local date (YYYY-MM-DD) the current crusade began. */
  startDate: string;
  /** When true, a day only counts toward the streak if all 21 disciplines were done. */
  vowMode: boolean;
  dailyLog: Record<string, CrusadeDayLog>;
}

export function createInitialCrusade(todayKey: string, vowMode = false): CrusadeState {
  return { startDate: todayKey, vowMode, dailyLog: {} };
}

// Local (not UTC) date key, so "today" matches the user's own calendar day.
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function daysBetween(startKey: string, endKey: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((parseDateKey(endKey).getTime() - parseDateKey(startKey).getTime()) / msPerDay);
}

// 1-based day number within the crusade. Not capped at 40 — callers use
// isCrusadeComplete to decide when to show the completion screen.
export function getCrusadeDayNumber(crusade: CrusadeState, todayKey: string): number {
  return daysBetween(crusade.startDate, todayKey) + 1;
}

export function isCrusadeComplete(crusade: CrusadeState, todayKey: string): boolean {
  return getCrusadeDayNumber(crusade, todayKey) > CRUSADE_LENGTH_DAYS;
}

function dayQualifies(log: CrusadeDayLog | undefined, vowMode: boolean): boolean {
  if (!log) return false;
  return vowMode ? log.allDone : log.doneCount > 0;
}

// Current streak of consecutive qualifying days, walking backward from
// `asOfKey` (usually today). If `asOfKey` itself hasn't qualified yet, that
// doesn't break the streak — it's just not counted until it does.
export function computeStreak(crusade: CrusadeState, asOfKey: string): number {
  const start = parseDateKey(crusade.startDate);
  let cursor = parseDateKey(asOfKey);
  let streak = 0;
  let isFirst = true;

  while (cursor.getTime() >= start.getTime()) {
    const qualifies = dayQualifies(crusade.dailyLog[formatDateKey(cursor)], crusade.vowMode);
    if (qualifies) {
      streak += 1;
    } else if (isFirst) {
      // Reference day (today) not completed yet — skip without breaking.
    } else {
      break;
    }
    isFirst = false;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// Count of qualifying days within the crusade's 40-day window, through
// `throughKey` (capped to the crusade's own last day).
export function computeDaysCompleted(crusade: CrusadeState, throughKey: string): number {
  const start = parseDateKey(crusade.startDate);
  const lastDay = addDays(start, CRUSADE_LENGTH_DAYS - 1);
  const throughDate = parseDateKey(throughKey);
  const end = throughDate.getTime() < lastDay.getTime() ? throughDate : lastDay;

  let count = 0;
  for (let cursor = start; cursor.getTime() <= end.getTime(); cursor = addDays(cursor, 1)) {
    if (dayQualifies(crusade.dailyLog[formatDateKey(cursor)], crusade.vowMode)) {
      count += 1;
    }
  }
  return count;
}
