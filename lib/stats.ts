// Body/Mind/Spirit stat and XP system.
// Source of truth: crusaderappspec.md ("Core loop" and "Rank ladder" sections).

export const XP_PER_LEVEL = 30;

export type StatCategory = 'body' | 'mind' | 'spirit';

export const STAT_CATEGORIES: StatCategory[] = ['body', 'mind', 'spirit'];

export type StatXp = Record<StatCategory, number>;

export interface RankRung {
  level: number;
  title: string;
}

// Overall level = sum of Body + Mind + Spirit levels.
export const RANK_LADDER: RankRung[] = [
  { level: 1, title: 'Squire' },
  { level: 3, title: 'Man-at-Arms' },
  { level: 6, title: 'Knight' },
  { level: 10, title: 'Knight-Errant' },
  { level: 15, title: 'Templar' },
  { level: 21, title: 'Crusader' },
  { level: 28, title: 'Knight Commander' },
  { level: 36, title: 'Paladin' },
  { level: 45, title: 'Knight of Christ' },
];

export function createInitialXp(): StatXp {
  return { body: 0, mind: 0, spirit: 0 };
}

// Every 30 XP = one stat level. XP 0-29 is level 1, 30-59 is level 2, etc.
export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - xpIntoLevel(xp);
}

export function totalLevel(xp: StatXp): number {
  return STAT_CATEGORIES.reduce((sum, cat) => sum + levelFromXp(xp[cat]), 0);
}

// Highest rung reached at or below the given overall level.
export function currentRank(overallLevel: number): string {
  let title = RANK_LADDER[0].title;
  for (const rung of RANK_LADDER) {
    if (overallLevel >= rung.level) title = rung.title;
  }
  return title;
}

// Applies a signed point delta to one stat, floored at 0 XP
// (mirrors unchecking a discipline reversing its XP award).
export function addXp(xp: StatXp, category: StatCategory, points: number): StatXp {
  const nextValue = Math.max(0, xp[category] + points);
  return { ...xp, [category]: nextValue };
}
