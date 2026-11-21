import { addDays, lastNDays, weekKeys } from './date';
import { answeredCount, isDayComplete } from './daily';
import type { AppData } from './types';

export interface Stats {
  totalLearned: number;
  topicsTotal: number;
  topicsCompleted: number;
  totalMinutes: number;
  todayMinutes: number;
  weekMinutes: number;
  studyDays: number;
  streak: number;
  bestStreak: number;
  dailyGoalRate: number; // 0-100
  completedWordDays: number;
  journalDays: number;
  completedByCategory: Record<string, number>;
  todayAnswered: number;
  todayKnown: number;
  todayTotal: number;
}

/** Every date on which she did *something*: journal time, answered words or completed a topic. */
export function activeDates(data: AppData): Set<string> {
  const s = new Set<string>();
  for (const j of data.journal) if (j.minutes > 0) s.add(j.date);
  for (const d of Object.values(data.days)) if (answeredCount(d) > 0) s.add(d.date);
  for (const t of data.topics) if (t.completedAt) s.add(t.completedAt);
  for (const d of Object.values(data.learned)) s.add(d);
  return s;
}

export function computeStreak(active: Set<string>, today: string): { current: number; best: number } {
  // Current streak counts back from today; if today has no activity yet, it may still continue from yesterday.
  let cursor = active.has(today) ? today : addDays(today, -1);
  let current = 0;
  while (active.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }
  let best = 0;
  const sorted = Array.from(active).sort();
  let run = 0;
  let prev = '';
  for (const d of sorted) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return { current, best: Math.max(best, current) };
}

export function minutesByDay(data: AppData, keys: string[]): number[] {
  const m = new Map<string, number>();
  for (const j of data.journal) m.set(j.date, (m.get(j.date) ?? 0) + j.minutes);
  return keys.map((k) => m.get(k) ?? 0);
}

export function learnedByDay(data: AppData, keys: string[]): number[] {
  const m = new Map<string, number>();
  for (const d of Object.values(data.learned)) m.set(d, (m.get(d) ?? 0) + 1);
  return keys.map((k) => m.get(k) ?? 0);
}

export function computeStats(data: AppData, today: string): Stats {
  const active = activeDates(data);
  const { current, best } = computeStreak(active, today);
  const week = weekKeys(today);
  const totalMinutes = data.journal.reduce((s, j) => s + j.minutes, 0);
  const days = Object.values(data.days);
  // Goal rate: past days with a word set + today only once it is finished.
  const counted = days.filter((d) => d.date < today || (d.date === today && isDayComplete(d)));
  const completedWordDays = days.filter(isDayComplete).length;
  const completedCounted = counted.filter(isDayComplete).length;
  const completedByCategory: Record<string, number> = {};
  for (const t of data.topics) {
    if (t.status === 'completed') completedByCategory[t.category] = (completedByCategory[t.category] ?? 0) + 1;
  }
  const todaySet = data.days[today];
  return {
    totalLearned: Object.keys(data.learned).length,
    topicsTotal: data.topics.length,
    topicsCompleted: data.topics.filter((t) => t.status === 'completed').length,
    totalMinutes,
    todayMinutes: minutesByDay(data, [today])[0],
    weekMinutes: minutesByDay(data, week).reduce((a, b) => a + b, 0),
    studyDays: active.size,
    streak: current,
    bestStreak: best,
    dailyGoalRate: counted.length ? Math.round((completedCounted / counted.length) * 100) : 0,
    completedWordDays,
    journalDays: new Set(data.journal.filter((j) => j.minutes > 0).map((j) => j.date)).size,
    completedByCategory,
    todayAnswered: todaySet ? answeredCount(todaySet) : 0,
    todayKnown: todaySet ? todaySet.known.length : 0,
    todayTotal: todaySet ? todaySet.wordIds.length : data.settings.dailyWordGoal,
  };
}

/* ------------------------------------------------------------------ */
/* Badges                                                               */
/* ------------------------------------------------------------------ */
export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  check: (s: Stats) => boolean;
  progress: (s: Stats) => [number, number];
}

export const BADGES: BadgeDef[] = [
  { id: 'first-30', name: 'First 30 Words', description: 'Learn your first 30 words', emoji: '🌱', color: '#9CA98E',
    check: (s) => s.totalLearned >= 30, progress: (s) => [s.totalLearned, 30] },
  { id: 'words-100', name: '100 Words Club', description: 'Learn 100 words', emoji: '📗', color: '#9CB5C8',
    check: (s) => s.totalLearned >= 100, progress: (s) => [s.totalLearned, 100] },
  { id: 'words-500', name: '500 Words Club', description: 'Learn 500 words', emoji: '📚', color: '#D6B56C',
    check: (s) => s.totalLearned >= 500, progress: (s) => [s.totalLearned, 500] },
  { id: 'vocab-queen', name: 'Vocabulary Queen', description: 'Finish your daily word set on 20 different days', emoji: '👑', color: '#D9A6A0',
    check: (s) => s.completedWordDays >= 20, progress: (s) => [s.completedWordDays, 20] },
  { id: 'streak-7', name: '7 Day Streak', description: 'Study 7 days in a row', emoji: '🔥', color: '#E0A27A',
    check: (s) => s.bestStreak >= 7, progress: (s) => [s.bestStreak, 7] },
  { id: 'streak-14', name: '14 Day Streak', description: 'Study 14 days in a row', emoji: '🌟', color: '#D6B56C',
    check: (s) => s.bestStreak >= 14, progress: (s) => [s.bestStreak, 14] },
  { id: 'streak-30', name: '30 Day Streak', description: 'Study 30 days in a row', emoji: '🏆', color: '#C9906A',
    check: (s) => s.bestStreak >= 30, progress: (s) => [s.bestStreak, 30] },
  { id: 'grammar-explorer', name: 'Grammar Explorer', description: 'Complete 3 Grammar topics', emoji: '🧭', color: '#9CB5C8',
    check: (s) => (s.completedByCategory['Grammar'] ?? 0) >= 3, progress: (s) => [s.completedByCategory['Grammar'] ?? 0, 3] },
  { id: 'reading-star', name: 'Reading Star', description: 'Complete 3 Reading or Paragraph topics', emoji: '⭐', color: '#D6B56C',
    check: (s) => (s.completedByCategory['Reading'] ?? 0) + (s.completedByCategory['Paragraph'] ?? 0) >= 3,
    progress: (s) => [(s.completedByCategory['Reading'] ?? 0) + (s.completedByCategory['Paragraph'] ?? 0), 3] },
  { id: 'yds-warrior', name: 'YDS Warrior', description: 'Study for a total of 50 hours', emoji: '⚔️', color: '#A98462',
    check: (s) => s.totalMinutes >= 3000, progress: (s) => [Math.floor(s.totalMinutes / 60), 50] },
  { id: 'first-topic', name: 'First Topic Completed', description: 'Complete your very first topic', emoji: '🎀', color: '#D9A6A0',
    check: (s) => s.topicsCompleted >= 1, progress: (s) => [s.topicsCompleted, 1] },
  { id: 'study-superstar', name: 'Study Superstar', description: 'Write journal entries on 20 different days', emoji: '💫', color: '#9CA98E',
    check: (s) => s.journalDays >= 20, progress: (s) => [s.journalDays, 20] },
];

export function newlyEarnedBadges(data: AppData, stats: Stats): BadgeDef[] {
  return BADGES.filter((b) => !data.badges[b.id] && b.check(stats));
}

export { lastNDays, weekKeys };
