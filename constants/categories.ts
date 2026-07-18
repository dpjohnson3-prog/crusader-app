import type { StatCategory } from '@/lib/stats';

export const CATEGORY_LABELS: Record<StatCategory, string> = {
  body: 'Body',
  mind: 'Mind',
  spirit: 'Spirit',
};

// From the spec's visual design system — stat accent colors.
export const CATEGORY_COLORS: Record<StatCategory, string> = {
  body: '#FF6E5A',
  mind: '#5FD8FF',
  spirit: '#C9A6FF',
};
