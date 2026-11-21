import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { WORDS } from '../data/words';
import { ensureDaySet } from '../lib/daily';
import { toKey, uid } from '../lib/date';
import { bigConfetti, softConfetti } from '../lib/confetti';
import { emptyData, loadData, saveData } from '../lib/storage';
import { BadgeDef, computeStats, newlyEarnedBadges, Stats } from '../lib/stats';
import type { AppData, JournalEntry, Settings, Topic } from '../lib/types';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  tone?: 'rose' | 'sage' | 'blue';
}

interface Ctx {
  data: AppData;
  today: string;
  stats: Stats;
  warning: string | null;
  dismissWarning: () => void;
  // settings
  updateSettings: (patch: Partial<Settings>) => void;
  // topics
  addTopic: (t: Omit<Topic, 'id' | 'createdAt'>) => void;
  updateTopic: (id: string, patch: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  completeTopic: (id: string) => void;
  reopenTopic: (id: string) => void;
  // words
  ensureDay: (date: string) => void;
  markWord: (date: string, wordId: string, answer: 'known' | 'practice') => void;
  markDayCelebrated: (date: string) => void;
  reviewLearned: (wordId: string) => void;
  reviewRemove: (wordId: string) => void;
  reviewAgain: (wordId: string) => void;
  // journal
  saveEntry: (e: Omit<JournalEntry, 'id'> & { id?: string }) => void;
  deleteEntry: (id: string) => void;
  // data
  replaceData: (d: AppData) => void;
  resetAll: () => void;
  // celebrations
  toast: (t: Omit<Toast, 'id'>) => void;
  toasts: Toast[];
  dismissToast: (id: string) => void;
  badgeQueue: BadgeDef[];
  shiftBadge: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

function useToday() {
  const [today, setToday] = useState(() => toKey());
  useEffect(() => {
    const tick = () => setToday((prev) => (prev === toKey() ? prev : toKey()));
    const t = window.setInterval(tick, 30_000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(t);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);
  return today;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = useRef(loadData());
  const [data, setData] = useState<AppData>(initial.current.data);
  const [warning, setWarning] = useState<string | null>(initial.current.warning ?? null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [badgeQueue, setBadgeQueue] = useState<BadgeDef[]>([]);
  const today = useToday();

  // Persist every change.
  useEffect(() => {
    if (!saveData(data)) {
      setWarning((w) => w ?? 'Your progress could not be saved in this browser (storage is full or blocked). Please export a backup from Settings.');
    }
  }, [data]);

  // Keep today's word set ready (also re-runs at midnight and when the goal changes).
  useEffect(() => {
    setData((d) => {
      const { day, changed } = ensureDaySet(today, d.settings.dailyWordGoal, WORDS, d);
      return changed ? { ...d, days: { ...d.days, [today]: day } } : d;
    });
  }, [today, data.settings.dailyWordGoal, !data.days[today]]);

  const stats = useMemo(() => computeStats(data, today), [data, today]);

  // Award badges based on real progress.
  useEffect(() => {
    const earned = newlyEarnedBadges(data, stats);
    if (earned.length === 0) return;
    setData((d) => {
      const badges = { ...d.badges };
      const achievements = [...d.achievements];
      for (const b of earned) {
        if (badges[b.id]) continue;
        badges[b.id] = today;
        achievements.push({ id: uid(), type: 'badge', label: b.name, date: today });
      }
      return { ...d, badges, achievements };
    });
    setBadgeQueue((q) => [...q, ...earned.filter((b) => !q.some((x) => x.id === b.id))]);
    bigConfetti();
  }, [stats, data, today]);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = uid();
    setToasts((list) => [...list.slice(-2), { ...t, id }]);
    window.setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 3800);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts((l) => l.filter((x) => x.id !== id)), []);

  const value: Ctx = useMemo(() => {
    const patchTopic = (id: string, fn: (t: Topic) => Topic) =>
      setData((d) => ({ ...d, topics: d.topics.map((t) => (t.id === id ? fn(t) : t)) }));
    return {
      data,
      today,
      stats,
      warning,
      dismissWarning: () => setWarning(null),
      updateSettings: (patch) => setData((d) => ({ ...d, settings: { ...d.settings, ...patch } })),

      addTopic: (t) =>
        setData((d) => ({
          ...d,
          topics: [{ ...t, id: uid(), createdAt: new Date().toISOString(), completedAt: t.status === 'completed' ? today : undefined, progress: t.status === 'completed' ? 100 : t.progress }, ...d.topics],
        })),
      updateTopic: (id, patch) =>
        patchTopic(id, (t) => {
          const next = { ...t, ...patch };
          if (next.status === 'completed') {
            next.progress = 100;
            next.completedAt = t.completedAt ?? today;
          } else {
            next.completedAt = undefined;
            if (next.progress >= 100) next.progress = 90;
          }
          return next;
        }),
      deleteTopic: (id) => setData((d) => ({ ...d, topics: d.topics.filter((t) => t.id !== id) })),
      completeTopic: (id) => {
        setData((d) => {
          const topic = d.topics.find((t) => t.id === id);
          if (!topic || topic.status === 'completed') return d;
          return {
            ...d,
            topics: d.topics.map((t) => (t.id === id ? { ...t, status: 'completed', progress: 100, completedAt: today } : t)),
            achievements: [...d.achievements, { id: uid(), type: 'topic', label: topic.name, date: today }],
          };
        });
        softConfetti();
      },
      reopenTopic: (id) => patchTopic(id, (t) => ({ ...t, status: 'in-progress', progress: Math.min(t.progress, 90), completedAt: undefined })),

      ensureDay: (date) =>
        setData((d) => {
          const { day, changed } = ensureDaySet(date, d.days[date]?.wordIds.length || d.settings.dailyWordGoal, WORDS, d);
          return changed ? { ...d, days: { ...d.days, [date]: day } } : d;
        }),
      markWord: (date, wordId, answer) =>
        setData((d) => {
          const day = d.days[date];
          if (!day || !day.wordIds.includes(wordId)) return d;
          const known = day.known.filter((w) => w !== wordId);
          const practice = day.practice.filter((w) => w !== wordId);
          const learned = { ...d.learned };
          let review = d.review;
          if (answer === 'known') {
            known.push(wordId);
            if (!learned[wordId]) learned[wordId] = today;
            review = review.filter((r) => r.wordId !== wordId);
          } else {
            practice.push(wordId);
            if (learned[wordId] === today && day.known.includes(wordId)) delete learned[wordId];
            if (!review.some((r) => r.wordId === wordId)) review = [...review, { wordId, addedAt: today, reviewCount: 0 }];
          }
          return { ...d, learned, review, days: { ...d.days, [date]: { ...day, known, practice } } };
        }),
      markDayCelebrated: (date) =>
        setData((d) => {
          const day = d.days[date];
          if (!day || day.celebrated) return d;
          return {
            ...d,
            days: { ...d.days, [date]: { ...day, celebrated: true } },
            achievements: [...d.achievements, { id: uid(), type: 'daily', label: `${day.wordIds.length}/${day.wordIds.length} words`, date: today }],
          };
        }),
      reviewLearned: (wordId) =>
        setData((d) => ({
          ...d,
          review: d.review.filter((r) => r.wordId !== wordId),
          learned: d.learned[wordId] ? d.learned : { ...d.learned, [wordId]: today },
        })),
      reviewRemove: (wordId) => setData((d) => ({ ...d, review: d.review.filter((r) => r.wordId !== wordId) })),
      reviewAgain: (wordId) =>
        setData((d) => ({
          ...d,
          review: d.review.map((r) => (r.wordId === wordId ? { ...r, reviewCount: r.reviewCount + 1, lastReviewed: today } : r)),
        })),

      saveEntry: (e) =>
        setData((d) => {
          if (e.id && d.journal.some((j) => j.id === e.id)) {
            return { ...d, journal: d.journal.map((j) => (j.id === e.id ? ({ ...j, ...e } as JournalEntry) : j)) };
          }
          return { ...d, journal: [{ ...e, id: uid() } as JournalEntry, ...d.journal] };
        }),
      deleteEntry: (id) => setData((d) => ({ ...d, journal: d.journal.filter((j) => j.id !== id) })),

      replaceData: (d) => setData(d),
      resetAll: () => setData({ ...emptyData(), settings: { ...emptyData().settings } }),

      toast,
      toasts,
      dismissToast,
      badgeQueue,
      shiftBadge: () => setBadgeQueue((q) => q.slice(1)),
    };
  }, [data, today, stats, warning, toast, toasts, dismissToast, badgeQueue]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp must be used inside AppProvider');
  return c;
}
