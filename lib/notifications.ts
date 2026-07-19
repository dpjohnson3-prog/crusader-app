import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Local (device-only) daily reminders. No backend/server push involved —
// see crusaderappspec.md's "Push notifications" line, and the note this
// session that a simple local schedule covers it for v1.

export const MORNING_HOUR = 8;
export const MORNING_MINUTE = 0;
export const EVENING_HOUR = 20;
export const EVENING_MINUTE = 0;

// How many mornings to keep scheduled ahead of time. Local notification
// content is fixed at schedule time, so rotating copy requires scheduling
// distinct one-off notifications in advance rather than a single repeating
// trigger — this batch is refreshed (topped back up to this many days
// ahead) every time the app opens, so as long as the app is opened at
// least this often, the rotation never runs dry.
const MORNING_BATCH_DAYS = 14;

const MORNING_ID_PREFIX = 'crusader-morning-';
const EVENING_ID = 'crusader-evening';

const PROMPT_SHOWN_STORAGE_KEY = 'crusader:notificationPromptShown';

export const MORNING_VARIANTS: string[] = [
  'The charge awaits, knight. Answer today’s call.',
  'Rise. Body, mind, and spirit are waiting on you today.',
  'Another day to suit up. The Charge is ready when you are.',
  'The watch changes. What will you carry into today?',
];

export const EVENING_VARIANTS: string[] = [
  'The day isn’t won yet. A few disciplines still call to you.',
  'Still time before the day closes the gate. Finish the charge.',
  'Not done yet, knight — a little more before the day is yours.',
  'The evening bell hasn’t rung. There’s still ground to cover today.',
];

function dayIndexSince(epochDate: Date, targetDate: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const epochMidnight = new Date(epochDate.getFullYear(), epochDate.getMonth(), epochDate.getDate());
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  return Math.round((targetMidnight.getTime() - epochMidnight.getTime()) / msPerDay);
}

function pickVariant(variants: string[], seed: number): string {
  const index = ((seed % variants.length) + variants.length) % variants.length;
  return variants[index];
}

// The next instant (today or tomorrow) at which `hour:minute` occurs,
// strictly after `from`.
function nextOccurrence(hour: number, minute: number, from: Date = new Date()): Date {
  const next = new Date(from);
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= from.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function hasNotificationPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  return settings.granted;
}

export async function getNotificationPermissionStatus() {
  return Notifications.getPermissionsAsync();
}

export async function requestNotificationPermission() {
  return Notifications.requestPermissionsAsync();
}

export async function hasShownNotificationPrompt(): Promise<boolean> {
  const value = await AsyncStorage.getItem(PROMPT_SHOWN_STORAGE_KEY);
  return value === 'true';
}

export async function markNotificationPromptShown(): Promise<void> {
  await AsyncStorage.setItem(PROMPT_SHOWN_STORAGE_KEY, 'true');
}

// Cancels and re-schedules the next MORNING_BATCH_DAYS mornings, each with a
// deterministically rotated (not random) copy variant. Safe to call
// repeatedly — always re-derives the batch relative to "now".
export async function scheduleMorningNotifications(referenceDate: Date = new Date()): Promise<void> {
  if (!(await hasNotificationPermission())) return;

  for (let i = 0; i < MORNING_BATCH_DAYS; i++) {
    const identifier = `${MORNING_ID_PREFIX}${i}`;
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  for (let i = 0; i < MORNING_BATCH_DAYS; i++) {
    const fireDate = nextOccurrence(MORNING_HOUR, MORNING_MINUTE, new Date(referenceDate.getTime() + i * 86400000));
    const variant = pickVariant(MORNING_VARIANTS, dayIndexSince(referenceDate, fireDate));
    await Notifications.scheduleNotificationAsync({
      identifier: `${MORNING_ID_PREFIX}${i}`,
      content: { title: 'Crusader', body: variant },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireDate },
    });
  }
}

// Cancels any pending evening reminder, then — only if today's disciplines
// aren't all complete — schedules exactly one for the next 8pm. Call this
// whenever completion state changes, since a plain scheduled notification
// can't check live state at fire time; this is the closest local-only
// approximation (see the session notes on this trade-off).
export async function scheduleOrCancelEveningNotification(
  doneCount: number,
  totalDisciplines: number,
  referenceDate: Date = new Date()
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(EVENING_ID);

  if (!(await hasNotificationPermission())) return;
  if (doneCount >= totalDisciplines) return;

  const fireDate = nextOccurrence(EVENING_HOUR, EVENING_MINUTE, referenceDate);
  const variant = pickVariant(EVENING_VARIANTS, dayIndexSince(referenceDate, fireDate));
  await Notifications.scheduleNotificationAsync({
    identifier: EVENING_ID,
    content: { title: 'Crusader', body: variant },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireDate },
  });
}

// expo-notifications behaves inconsistently enough on web (no real local
// notification support) that callers should skip all of this there.
export const notificationsSupported = Platform.OS !== 'web';
