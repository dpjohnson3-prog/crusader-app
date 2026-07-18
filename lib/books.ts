// The Armory — a curated resource library of book recommendations.
// Descriptions are original writing for this app, not jacket copy or
// reviews. No purchase/download links in this version.

export type BookCategory = 'classic' | 'discipline';

export const BOOK_CATEGORY_LABELS: Record<BookCategory, string> = {
  classic: 'Christian Classics',
  discipline: 'Self-Improvement & Discipline',
};

export interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  description: string;
}

export const BOOK_RECOMMENDATIONS: BookRecommendation[] = [
  // Christian / Catholic classics
  {
    id: 'confessions',
    title: 'Confessions',
    author: 'Augustine of Hippo',
    category: 'classic',
    description:
      "A fourth-century bishop's unflinching autobiography of restlessness, sin, and conversion, written as one long prayer addressed to God.",
  },
  {
    id: 'imitation-of-christ',
    title: 'The Imitation of Christ',
    author: 'Thomas à Kempis',
    category: 'classic',
    description:
      'A quiet, practical guide to humility and inner discipline, given as short meditations rather than a sustained argument — meant to be read a page at a time.',
  },
  {
    id: 'mere-christianity',
    title: 'Mere Christianity',
    author: 'C.S. Lewis',
    category: 'classic',
    description:
      "Adapted from wartime radio talks, Lewis's case for the reasonableness of Christian belief, built from everyday moral experience rather than theology-first argument.",
  },
  {
    id: 'screwtape-letters',
    title: 'The Screwtape Letters',
    author: 'C.S. Lewis',
    category: 'classic',
    description:
      "A senior demon's coaching letters to his nephew on how to quietly derail an ordinary human soul — satire that doubles as a study of temptation from the inside out.",
  },
  {
    id: 'pursuit-of-god',
    title: 'The Pursuit of God',
    author: 'A.W. Tozer',
    category: 'classic',
    description:
      'A short, urgent call away from casual religion and toward actually experiencing God, not just holding correct beliefs about him.',
  },
  {
    id: 'my-utmost',
    title: 'My Utmost for His Highest',
    author: 'Oswald Chambers',
    category: 'classic',
    description:
      "A year of daily devotional readings drawn from Chambers's spoken talks, better read slowly over months than all at once.",
  },

  // Self-improvement / discipline
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'discipline',
    description:
      'A practical framework for building habits through small, compounding changes to your systems and identity, rather than relying on willpower alone.',
  },
  {
    id: 'mans-search-for-meaning',
    title: "Man's Search for Meaning",
    author: 'Viktor Frankl',
    category: 'discipline',
    description:
      "A psychiatrist's account of surviving Nazi concentration camps, and the theory he built from it — that purpose, not comfort, is what makes suffering bearable.",
  },
  {
    id: 'cant-hurt-me',
    title: "Can't Hurt Me",
    author: 'David Goggins',
    category: 'discipline',
    description:
      'A brutally candid memoir from a former Navy SEAL on rebuilding himself through extreme physical and mental discipline after a difficult start in life.',
  },
  {
    id: 'obstacle-is-the-way',
    title: 'The Obstacle Is the Way',
    author: 'Ryan Holiday',
    category: 'discipline',
    description:
      "A modern gloss on Stoic philosophy arguing that obstacles aren't just survivable but usable — the same block that stops you can become the way through.",
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'discipline',
    description:
      'A case for protecting long, undistracted blocks of focused effort in a world engineered for interruption, plus concrete habits for making that possible.',
  },
  {
    id: 'seven-habits',
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen R. Covey',
    category: 'discipline',
    description:
      'A character-first framework for personal effectiveness built around habits like starting with the end in mind and prioritizing what matters over what feels urgent.',
  },
];

export function booksByCategory(category: BookCategory): BookRecommendation[] {
  return BOOK_RECOMMENDATIONS.filter((book) => book.category === category);
}
