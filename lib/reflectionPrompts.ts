// Curated daily reflection prompts for Chronicle. Rotates by date, same
// pattern the spec uses for the scripture rotation. Placeholder content —
// not sourced from crusaderappspec.md (it names the feature but doesn't
// specify prompt copy); revisit before launch.

export const REFLECTION_PROMPTS: string[] = [
  'Which part of you — body, mind, or spirit — needs the most attention today?',
  'Where did you rely on your own strength today instead of leaning on something bigger?',
  "What's one thing you did today that your future self will thank you for?",
  "What's weighing on you right now that you haven't said out loud?",
  'Where did you show discipline today, even in something small?',
  "What's genuinely brought you peace or joy this week?",
  'What would it look like to suit up fully tomorrow — body, mind, and spirit?',
];

export function todaysReflectionPrompt(date: Date = new Date()): string {
  return REFLECTION_PROMPTS[date.getDate() % REFLECTION_PROMPTS.length];
}
