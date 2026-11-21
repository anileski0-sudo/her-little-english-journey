import { isDateKey } from './date';
import {
  AppData,
  DaySet,
  JournalEntry,
  ReviewItem,
  Settings,
  Topic,
  TOPIC_CATEGORIES,
  TopicCategory,
  TopicStatus,
  Achievement,
  ThemeName,
} from './types';

export const STORAGE_KEY = 'hlej:data';
export const BACKUP_KEY = 'hlej:corrupt-backup';
export const DATA_VERSION = 2;
export const APP_ID = 'her-little-english-journey';

export const DEFAULT_SETTINGS: Settings = {
  examDate: null,
  examTime: '10:15',
  dailyWordGoal: 30,
  dailyStudyGoal: 60,
  theme: 'kraft',
};

export function emptyData(): AppData {
  return {
    version: DATA_VERSION,
    settings: { ...DEFAULT_SETTINGS },
    topics: [],
    days: {},
    learned: {},
    review: [],
    journal: [],
    badges: {},
    achievements: [],
  };
}

/* ------------------------------------------------------------------ */
/* Migrations: each entry upgrades data FROM version n TO n + 1.        */
/* ------------------------------------------------------------------ */
type Raw = Record<string, any>;
const migrations: Record<number, (d: Raw) => Raw> = {
  // v0 → v1: early data had no version field and stored the exam date at the top level.
  0: (d) => {
    const settings = { ...(d.settings ?? {}) };
    if (d.examDate && !settings.examDate) settings.examDate = d.examDate;
    const { examDate: _drop, ...rest } = d;
    return { ...rest, settings, version: 1 };
  },
  // v1 → v2: added achievements log and exam time.
  1: (d) => ({
    ...d,
    achievements: Array.isArray(d.achievements) ? d.achievements : [],
    settings: { examTime: '10:15', ...(d.settings ?? {}) },
    version: 2,
  }),
};

export function migrate(raw: Raw): Raw {
  let d: Raw = { ...raw };
  let v = typeof d.version === 'number' ? d.version : 0;
  if (v > DATA_VERSION) throw new Error('This data was created by a newer version of the site.');
  while (v < DATA_VERSION) {
    const step = migrations[v];
    if (!step) throw new Error(`No migration from version ${v}`);
    d = step(d);
    v = d.version;
  }
  return d;
}

/* ------------------------------------------------------------------ */
/* Sanitising: never trust what comes out of storage or an import file. */
/* ------------------------------------------------------------------ */
const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : '');
const num = (v: unknown, min: number, max: number, fallback: number) => {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
};
const strArr = (v: unknown) =>
  Array.isArray(v) ? Array.from(new Set(v.filter((x) => typeof x === 'string'))) : [];

const STATUSES: TopicStatus[] = ['not-started', 'in-progress', 'completed'];
const THEMES: ThemeName[] = ['kraft', 'rose', 'sage', 'blue'];

function cleanSettings(s: Raw | undefined): Settings {
  const o = s ?? {};
  return {
    examDate: isDateKey(o.examDate) ? o.examDate : null,
    examTime: typeof o.examTime === 'string' && /^\d{2}:\d{2}$/.test(o.examTime) ? o.examTime : '10:15',
    dailyWordGoal: num(o.dailyWordGoal, 5, 100, 30),
    dailyStudyGoal: num(o.dailyStudyGoal, 5, 600, 60),
    theme: THEMES.includes(o.theme) ? o.theme : 'kraft',
  };
}

function cleanTopic(t: Raw): Topic | null {
  if (!t || typeof t !== 'object' || !str(t.id) || !str(t.name).trim()) return null;
  const status: TopicStatus = STATUSES.includes(t.status) ? t.status : 'not-started';
  const category: TopicCategory = (TOPIC_CATEGORIES as readonly string[]).includes(t.category)
    ? t.category
    : 'Other';
  return {
    id: str(t.id, 64),
    name: str(t.name, 200),
    category,
    description: str(t.description, 2000),
    status,
    progress: status === 'completed' ? 100 : num(t.progress, 0, 100, 0),
    date: isDateKey(t.date) ? t.date : '',
    createdAt: str(t.createdAt, 40) || new Date().toISOString(),
    completedAt: isDateKey(t.completedAt) ? t.completedAt : undefined,
  };
}

function cleanDay(key: string, d: Raw): DaySet | null {
  if (!isDateKey(key) || !d || typeof d !== 'object') return null;
  const wordIds = strArr(d.wordIds);
  const set = new Set(wordIds);
  const known = strArr(d.known).filter((w) => set.has(w));
  const knownSet = new Set(known);
  const practice = strArr(d.practice).filter((w) => set.has(w) && !knownSet.has(w));
  return { date: key, wordIds, known, practice, celebrated: !!d.celebrated };
}

function cleanReview(r: Raw): ReviewItem | null {
  if (!r || !str(r.wordId)) return null;
  return {
    wordId: str(r.wordId, 80),
    addedAt: isDateKey(r.addedAt) ? r.addedAt : '',
    reviewCount: num(r.reviewCount, 0, 100000, 0),
    lastReviewed: isDateKey(r.lastReviewed) ? r.lastReviewed : undefined,
  };
}

function cleanJournal(j: Raw): JournalEntry | null {
  if (!j || !str(j.id) || !isDateKey(j.date)) return null;
  return {
    id: str(j.id, 64),
    date: j.date,
    topics: str(j.topics, 500),
    minutes: num(j.minutes, 0, 1440, 0),
    note: str(j.note, 5000),
    mood: str(j.mood, 8),
  };
}

function cleanAchievement(a: Raw): Achievement | null {
  if (!a || !str(a.id) || !isDateKey(a.date)) return null;
  const type = ['topic', 'badge', 'daily'].includes(a.type) ? a.type : 'topic';
  return { id: str(a.id, 64), type, label: str(a.label, 200), date: a.date };
}

export function sanitize(raw: Raw): AppData {
  const d = migrate(raw);
  const days: Record<string, DaySet> = {};
  if (d.days && typeof d.days === 'object') {
    for (const [k, v] of Object.entries(d.days)) {
      const c = cleanDay(k, v as Raw);
      if (c) days[k] = c;
    }
  }
  const learned: Record<string, string> = {};
  if (d.learned && typeof d.learned === 'object') {
    for (const [k, v] of Object.entries(d.learned)) if (isDateKey(v)) learned[k] = v as string;
  }
  const badges: Record<string, string> = {};
  if (d.badges && typeof d.badges === 'object') {
    for (const [k, v] of Object.entries(d.badges)) if (isDateKey(v)) badges[k] = v as string;
  }
  const seenReview = new Set<string>();
  const review = (Array.isArray(d.review) ? d.review : [])
    .map(cleanReview)
    .filter((r: ReviewItem | null): r is ReviewItem => {
      if (!r || seenReview.has(r.wordId)) return false;
      seenReview.add(r.wordId);
      return true;
    });
  return {
    version: DATA_VERSION,
    settings: cleanSettings(d.settings),
    topics: (Array.isArray(d.topics) ? d.topics : []).map(cleanTopic).filter(Boolean) as Topic[],
    days,
    learned,
    review,
    journal: (Array.isArray(d.journal) ? d.journal : []).map(cleanJournal).filter(Boolean) as JournalEntry[],
    badges,
    achievements: (Array.isArray(d.achievements) ? d.achievements : [])
      .map(cleanAchievement)
      .filter(Boolean) as Achievement[],
  };
}

/* ------------------------------------------------------------------ */
/* localStorage access                                                  */
/* ------------------------------------------------------------------ */
export interface LoadResult {
  data: AppData;
  warning?: string;
}

export function loadData(storage: Storage | undefined = safeStorage()): LoadResult {
  if (!storage) return { data: emptyData(), warning: 'Your browser is blocking storage, so progress cannot be saved.' };
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { data: emptyData(), warning: 'Your browser is blocking storage, so progress cannot be saved.' };
  }
  if (!raw) return { data: emptyData() };
  try {
    return { data: sanitize(JSON.parse(raw)) };
  } catch {
    try {
      storage.setItem(BACKUP_KEY, raw);
    } catch {
      /* ignore */
    }
    return {
      data: emptyData(),
      warning: 'Saved data could not be read, so a fresh journal was started. A backup copy was kept in this browser.',
    };
  }
}

export function saveData(data: AppData, storage: Storage | undefined = safeStorage()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

function safeStorage(): Storage | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}

/* ------------------------------------------------------------------ */
/* Export / import                                                      */
/* ------------------------------------------------------------------ */
export function exportJson(data: AppData): string {
  return JSON.stringify({ app: APP_ID, exportedAt: new Date().toISOString(), data }, null, 2);
}

export function parseImport(text: string): AppData {
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('This file is not valid JSON.');
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('This file does not contain journal data.');
  }
  if (parsed.app !== undefined && parsed.app !== APP_ID) {
    throw new Error('This file belongs to a different app.');
  }
  const body = parsed.app === APP_ID ? parsed.data : parsed;
  if (!body || typeof body !== 'object') throw new Error('The backup file is empty.');
  const checks: [string, (v: unknown) => boolean][] = [
    ['settings', (v) => v === undefined || (typeof v === 'object' && v !== null && !Array.isArray(v))],
    ['topics', (v) => v === undefined || Array.isArray(v)],
    ['journal', (v) => v === undefined || Array.isArray(v)],
    ['review', (v) => v === undefined || Array.isArray(v)],
    ['days', (v) => v === undefined || (typeof v === 'object' && v !== null && !Array.isArray(v))],
    ['learned', (v) => v === undefined || (typeof v === 'object' && v !== null && !Array.isArray(v))],
  ];
  for (const [key, ok] of checks) {
    if (!ok(body[key])) throw new Error(`The "${key}" section of the file is damaged.`);
  }
  const known = ['settings', 'topics', 'journal', 'review', 'days', 'learned'];
  if (!known.some((k) => k in body)) throw new Error('This file does not contain journal data.');
  return sanitize(body);
}
