// Daily discipline catalog — 21 disciplines across Body/Mind/Spirit.
// Source of truth: crusaderappspec.md ("Daily disciplines (21 total)").

import type { StatCategory } from './stats';

export interface Discipline {
  id: string;
  category: StatCategory;
  name: string;
  subtitle?: string;
  points: number;
}

export const DISCIPLINES: Discipline[] = [
  // Body
  { id: 'cardio', category: 'body', name: 'Cardio', subtitle: 'run, bike, or get your heart rate up', points: 10 },
  { id: 'strength-training', category: 'body', name: 'Strength training', subtitle: 'lift, resistance, or bodyweight sets', points: 10 },
  { id: 'stretch-mobility', category: 'body', name: 'Stretch or mobility work', points: 6 },
  { id: 'walk-outside', category: 'body', name: 'Walk outside', points: 6 },
  { id: 'sleep-well', category: 'body', name: 'Sleep well', points: 10 },
  { id: 'drink-water', category: 'body', name: 'Drink water', points: 6 },
  { id: 'eat-fuel', category: 'body', name: 'Eat something that fuels you', points: 8 },

  // Mind
  { id: 'journal', category: 'mind', name: 'Journal', points: 10 },
  { id: 'read-worthwhile', category: 'mind', name: 'Read something worthwhile', points: 8 },
  { id: 'learn-skill', category: 'mind', name: 'Learn a skill', points: 8 },
  { id: 'unplug-hour', category: 'mind', name: 'Unplug for an hour', points: 8 },
  { id: 'gratitude-list', category: 'mind', name: 'Gratitude list', subtitle: 'name three things', points: 6 },
  { id: 'mental-stillness', category: 'mind', name: 'Sit in mental stillness', points: 6 },
  { id: 'tackle-avoided', category: 'mind', name: "Tackle something you've been avoiding", points: 10 },

  // Spirit
  { id: 'pray', category: 'spirit', name: 'Pray', points: 12 },
  { id: 'read-scripture', category: 'spirit', name: 'Read scripture', points: 10 },
  { id: 'worship-sing', category: 'spirit', name: 'Worship or sing', points: 8 },
  { id: 'silence-listen', category: 'spirit', name: 'Sit in silence and listen', points: 8 },
  { id: 'serve-someone', category: 'spirit', name: 'Serve someone', points: 10 },
  { id: 'generosity', category: 'spirit', name: 'Practice generosity', points: 8 },
  { id: 'evening-examen', category: 'spirit', name: 'Evening examen', points: 8 },
];

export const TOTAL_DISCIPLINES = DISCIPLINES.length;

export function disciplinesByCategory(category: StatCategory): Discipline[] {
  return DISCIPLINES.filter((d) => d.category === category);
}
