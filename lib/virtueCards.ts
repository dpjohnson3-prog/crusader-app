// Virtue Cards — a curated set of scripture + reflection cards, one shown
// per day of the current crusade (selected by day number, not randomly, so
// it's stable if the user reopens the app the same day).
//
// Scripture text is KJV (public domain) and has been checked verbatim
// against a King James reference source — see crusaderappspec.md's note
// on not letting scripture citations drift from a human-reviewed library.
// The one-line reflection prompts are original writing for this app, not
// scripture, and are never presented as a quotation.

import { CRUSADE_LENGTH_DAYS } from './crusade';

export type Virtue = 'courage' | 'humility' | 'perseverance' | 'faith' | 'discipline';

export const VIRTUES: Virtue[] = ['courage', 'humility', 'perseverance', 'faith', 'discipline'];

export const VIRTUE_LABELS: Record<Virtue, string> = {
  courage: 'Courage',
  humility: 'Humility',
  perseverance: 'Perseverance',
  faith: 'Faith',
  discipline: 'Discipline',
};

export interface VirtueCard {
  id: string;
  virtue: Virtue;
  reference: string;
  verse: string;
  reflection: string;
}

export const VIRTUE_CARDS: VirtueCard[] = [
  // Courage
  {
    id: 'courage-1',
    virtue: 'courage',
    reference: 'Joshua 1:9',
    verse:
      'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
    reflection: 'Where is fear asking you to shrink back today?',
  },
  {
    id: 'courage-2',
    virtue: 'courage',
    reference: 'Deuteronomy 31:6',
    verse:
      'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.',
    reflection: "What are you facing that you don't have to face alone?",
  },
  {
    id: 'courage-3',
    virtue: 'courage',
    reference: '1 Corinthians 16:13',
    verse: 'Watch ye, stand fast in the faith, quit you like men, be strong.',
    reflection: 'What would it look like to stand firm today instead of standing down?',
  },
  {
    id: 'courage-4',
    virtue: 'courage',
    reference: 'Psalm 27:14',
    verse: 'Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.',
    reflection: 'What are you waiting on God for right now?',
  },

  // Humility
  {
    id: 'humility-1',
    virtue: 'humility',
    reference: 'Micah 6:8',
    verse:
      'He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?',
    reflection: 'Where have you chosen being right over being kind?',
  },
  {
    id: 'humility-2',
    virtue: 'humility',
    reference: 'James 4:10',
    verse: 'Humble yourselves in the sight of the Lord, and he shall lift you up.',
    reflection: 'What would it cost you to admit you were wrong today?',
  },
  {
    id: 'humility-3',
    virtue: 'humility',
    reference: 'Philippians 2:3',
    verse:
      'Let nothing be done through strife or vainglory; but in lowliness of mind let each esteem other better than themselves.',
    reflection: 'Who could you put ahead of yourself today?',
  },
  {
    id: 'humility-4',
    virtue: 'humility',
    reference: '1 Peter 5:6',
    verse: 'Humble yourselves therefore under the mighty hand of God, that he may exalt you in due time.',
    reflection: "What are you still trying to carry on your own?",
  },

  // Perseverance
  {
    id: 'perseverance-1',
    virtue: 'perseverance',
    reference: 'James 1:12',
    verse:
      'Blessed is the man that endureth temptation: for when he is tried, he shall receive the crown of life, which the Lord hath promised to them that love him.',
    reflection: "What's the thing you're most tempted to quit right now?",
  },
  {
    id: 'perseverance-2',
    virtue: 'perseverance',
    reference: 'Galatians 6:9',
    verse: 'And let us not be weary in well doing: for in due season we shall reap, if we faint not.',
    reflection: 'What good thing have you almost given up on?',
  },
  {
    id: 'perseverance-3',
    virtue: 'perseverance',
    reference: 'Romans 5:3-4',
    verse:
      'And not only so, but we glory in tribulations also: knowing that tribulation worketh patience; and patience, experience; and experience, hope.',
    reflection: "What's a hard season that's actually shaping you?",
  },
  {
    id: 'perseverance-4',
    virtue: 'perseverance',
    reference: 'Hebrews 12:1',
    verse:
      'Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us.',
    reflection: 'What could you lay aside today to run a little lighter?',
  },

  // Faith
  {
    id: 'faith-1',
    virtue: 'faith',
    reference: 'Hebrews 11:1',
    verse: 'Now faith is the substance of things hoped for, the evidence of things not seen.',
    reflection: "What are you hoping for that you can't yet see?",
  },
  {
    id: 'faith-2',
    virtue: 'faith',
    reference: 'Proverbs 3:5-6',
    verse:
      'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
    reflection: 'Where are you leaning on your own understanding instead of trusting?',
  },
  {
    id: 'faith-3',
    virtue: 'faith',
    reference: '2 Corinthians 5:7',
    verse: 'For we walk by faith, not by sight.',
    reflection: 'What decision today calls for faith over certainty?',
  },
  {
    id: 'faith-4',
    virtue: 'faith',
    reference: 'Mark 11:24',
    verse:
      'Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.',
    reflection: "What have you stopped believing could actually change?",
  },

  // Discipline
  {
    id: 'discipline-1',
    virtue: 'discipline',
    reference: '1 Corinthians 9:27',
    verse:
      'But I keep under my body, and bring it into subjection: lest that by any means, when I have preached to others, I myself should be a castaway.',
    reflection: 'Where does your body need to submit to your convictions today?',
  },
  {
    id: 'discipline-2',
    virtue: 'discipline',
    reference: 'Proverbs 25:28',
    verse: 'He that hath no rule over his own spirit is like a city that is broken down, and without walls.',
    reflection: 'What wall could you rebuild today — one habit, one boundary?',
  },
  {
    id: 'discipline-3',
    virtue: 'discipline',
    reference: '2 Timothy 1:7',
    verse: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
    reflection: 'Where are you operating from fear instead of a sound mind?',
  },
  {
    id: 'discipline-4',
    virtue: 'discipline',
    reference: 'Hebrews 12:11',
    verse:
      'Now no chastening for the present seemeth to be joyous, but grievous: nevertheless afterward it yieldeth the peaceable fruit of righteousness unto them which are exercised thereby.',
    reflection: 'What discipline felt painful at first but is bearing fruit now?',
  },
];

const CARDS_PER_VIRTUE = 4;

function cardsForVirtue(virtue: Virtue): VirtueCard[] {
  return VIRTUE_CARDS.filter((card) => card.virtue === virtue);
}

// Deterministic by crusade day number — round-robins through the five
// virtues daily, going one card deeper into each virtue every 5 days, so
// the full 20-card set is seen twice over a 40-day crusade.
export function virtueCardForCrusadeDay(dayNumber: number): VirtueCard {
  const cycleLength = VIRTUES.length * CARDS_PER_VIRTUE;
  const dayIndex = (Math.max(1, Math.trunc(dayNumber)) - 1) % cycleLength;
  const virtue = VIRTUES[dayIndex % VIRTUES.length];
  const cardIndex = Math.floor(dayIndex / VIRTUES.length);
  return cardsForVirtue(virtue)[cardIndex];
}

// Every card that would have been shown from day 1 through `dayNumber`
// (capped to the crusade's 40 days), in first-seen order. Purely derived
// from the day number — no separate "seen" state needs to be persisted.
export function virtueCardsSeenThroughDay(dayNumber: number): VirtueCard[] {
  const seenIds = new Set<string>();
  const seen: VirtueCard[] = [];
  const lastDay = Math.min(Math.max(1, Math.trunc(dayNumber)), CRUSADE_LENGTH_DAYS);
  for (let day = 1; day <= lastDay; day++) {
    const card = virtueCardForCrusadeDay(day);
    if (!seenIds.has(card.id)) {
      seenIds.add(card.id);
      seen.push(card);
    }
  }
  return seen;
}
