import { describe, expect, it } from 'vitest';
import { WORDS } from '../data/words';
import { ensureDaySet, isDayComplete, pickWords } from './daily';
import { addDays, diffDays, isDateKey, weekKeys } from './date';
import { pickMessage, WORD_MESSAGES } from './messages';
import { computeStats, computeStreak, newlyEarnedBadges } from './stats';
import { DATA_VERSION, emptyData, exportJson, loadData, migrate, parseImport, sanitize, saveData, STORAGE_KEY } from './storage';
import { countdownTo } from '../components/Countdown';

class MemStorage {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
  key() { return null; }
  get length() { return this.m.size; }
}

describe('vocabulary pool', () => {
  it('has at least 500 unique, complete B1/B2 words', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(500);
    expect(new Set(WORDS.map((w) => w.id)).size).toBe(WORDS.length);
    for (const w of WORDS) {
      expect(['B1', 'B2']).toContain(w.level);
      expect(w.tr.length).toBeGreaterThan(1);
      expect(w.ex.length).toBeGreaterThan(10);
      expect(w.exTr.length).toBeGreaterThan(10);
      expect(['n', 'v', 'adj', 'adv', 'prep', 'conj', 'phr']).toContain(w.pos);
    }
  });
});

describe('daily word sets', () => {
  it('creates 30 unique words and keeps them stable for the same day', () => {
    const d = emptyData();
    const { day } = ensureDaySet('2026-11-21', 30, WORDS, d);
    expect(day.wordIds).toHaveLength(30);
    expect(new Set(day.wordIds).size).toBe(30);
    d.days[day.date] = day;
    const again = ensureDaySet('2026-11-21', 30, WORDS, d);
    expect(again.changed).toBe(false);
    expect(again.day.wordIds).toEqual(day.wordIds);
  });

  it('gives a new day fresh words that were not shown before', () => {
    const d = emptyData();
    let date = '2026-11-21';
    const seen = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const { day } = ensureDaySet(date, 30, WORDS, d);
      for (const id of day.wordIds) {
        expect(seen.has(id)).toBe(false);
        seen.add(id);
      }
      d.days[date] = day;
      date = addDays(date, 1);
    }
  });

  it('reuses words in a controlled way once the pool runs out', () => {
    const d = emptyData();
    let date = '2026-01-01';
    const days = Math.ceil(WORDS.length / 30) + 3;
    for (let i = 0; i < days; i++) {
      const { day } = ensureDaySet(date, 30, WORDS, d);
      expect(day.wordIds).toHaveLength(30);
      expect(new Set(day.wordIds).size).toBe(30);
      d.days[date] = day;
      // learn everything except the last 2 words of each day
      day.wordIds.slice(0, 28).forEach((id) => (d.learned[id] ??= date));
      date = addDays(date, 1);
    }
  });

  it('after exhaustion, brings back unlearned words first, then the oldest learned ones', () => {
    const d = emptyData();
    d.days['2026-01-01'] = { date: '2026-01-01', wordIds: WORDS.map((w) => w.id), known: [], practice: [] };
    const unlearned = WORDS.slice(0, 5).map((w) => w.id);
    WORDS.slice(5).forEach((w, i) => (d.learned[w.id] = addDays('2026-01-02', i % 50)));
    const ids = pickWords('2026-06-01', 30, WORDS, d);
    expect(ids).toHaveLength(30);
    expect(new Set(ids.slice(0, 5))).toEqual(new Set(unlearned));
    const learnedDates = ids.slice(5).map((id) => d.learned[id]);
    expect(learnedDates).toEqual([...learnedDates].sort());
    expect(learnedDates.every((x) => x <= '2026-01-04')).toBe(true);
  });

  it('extends today when the goal increases but never removes progress', () => {
    const d = emptyData();
    const { day } = ensureDaySet('2026-11-21', 30, WORDS, d);
    day.known = day.wordIds.slice(0, 5);
    d.days[day.date] = day;
    const bigger = ensureDaySet('2026-11-21', 40, WORDS, d);
    expect(bigger.day.wordIds).toHaveLength(40);
    expect(bigger.day.wordIds.slice(0, 30)).toEqual(day.wordIds);
    expect(bigger.day.known).toEqual(day.known);
    const smaller = ensureDaySet('2026-11-21', 10, WORDS, { ...d, days: { [day.date]: bigger.day } });
    expect(smaller.day.wordIds).toHaveLength(40);
  });

  it('pickWords excludes requested ids', () => {
    const ex = new Set(WORDS.slice(0, 100).map((w) => w.id));
    const ids = pickWords('2026-11-21', 30, WORDS, emptyData(), ex);
    expect(ids.some((id) => ex.has(id))).toBe(false);
  });

  it('detects a completed day', () => {
    expect(isDayComplete({ date: '2026-11-21', wordIds: ['a', 'b'], known: ['a'], practice: ['b'] })).toBe(true);
    expect(isDayComplete({ date: '2026-11-21', wordIds: ['a', 'b'], known: ['a'], practice: [] })).toBe(false);
  });
});

describe('dates', () => {
  it('handles local date keys, week starts and DST', () => {
    expect(isDateKey('2026-02-30')).toBe(false);
    expect(isDateKey('2026-11-21')).toBe(true);
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(diffDays('2026-03-28', '2026-03-30')).toBe(2);
    expect(weekKeys('2026-11-21')[0]).toBe('2026-11-16'); // Monday
    expect(weekKeys('2026-11-22')[6]).toBe('2026-11-22'); // Sunday
  });
});

describe('countdown', () => {
  it('counts days, hours and minutes and never goes negative', () => {
    const now = new Date(2026, 10, 21, 10, 0, 0);
    expect(countdownTo('2026-11-24', '10:15', now)).toEqual({ days: 3, hours: 0, minutes: 15, passed: false });
    expect(countdownTo('2026-11-20', '10:15', now)).toEqual({ days: 0, hours: 0, minutes: 0, passed: true });
  });
});

describe('streaks and badges', () => {
  it('computes current and best streak', () => {
    const active = new Set(['2026-11-15', '2026-11-16', '2026-11-19', '2026-11-20', '2026-11-21']);
    expect(computeStreak(active, '2026-11-21')).toEqual({ current: 3, best: 3 });
    // today not studied yet → streak continues from yesterday
    expect(computeStreak(new Set(['2026-11-20', '2026-11-19']), '2026-11-21').current).toBe(2);
    expect(computeStreak(new Set(['2026-11-18']), '2026-11-21').current).toBe(0);
  });

  it('awards badges only from real progress', () => {
    const d = emptyData();
    const today = '2026-11-21';
    expect(newlyEarnedBadges(d, computeStats(d, today))).toHaveLength(0);
    WORDS.slice(0, 30).forEach((w) => (d.learned[w.id] = today));
    d.topics.push({ id: 't', name: 'Tenses', category: 'Grammar', description: '', status: 'completed', progress: 100, date: today, createdAt: '', completedAt: today });
    const ids = newlyEarnedBadges(d, computeStats(d, today)).map((b) => b.id);
    expect(ids).toContain('first-30');
    expect(ids).toContain('first-topic');
    expect(ids).not.toContain('words-100');
    d.badges['first-30'] = today;
    expect(newlyEarnedBadges(d, computeStats(d, today)).map((b) => b.id)).not.toContain('first-30');
  });
});

describe('motivation messages', () => {
  it('does not repeat recent messages', () => {
    const picks: string[] = [];
    for (let i = 0; i < 60; i++) picks.push(pickMessage(WORD_MESSAGES));
    for (let i = 1; i < picks.length; i++) {
      const window = picks.slice(Math.max(0, i - 6), i);
      expect(window).not.toContain(picks[i]);
    }
  });
});

describe('storage, migration and import', () => {
  it('saves and loads data (survives refresh)', () => {
    const s = new MemStorage() as unknown as Storage;
    const d = emptyData();
    d.topics.push({ id: 'x', name: 'Reading', category: 'Reading', description: '', status: 'in-progress', progress: 40, date: '2026-11-21', createdAt: 'now' });
    d.learned['abandon'] = '2026-11-21';
    expect(saveData(d, s)).toBe(true);
    const back = loadData(s);
    expect(back.warning).toBeUndefined();
    expect(back.data.topics[0].name).toBe('Reading');
    expect(back.data.learned['abandon']).toBe('2026-11-21');
  });

  it('recovers from corrupt storage with a backup', () => {
    const s = new MemStorage();
    s.setItem(STORAGE_KEY, '{not json');
    const r = loadData(s as unknown as Storage);
    expect(r.warning).toBeTruthy();
    expect(s.getItem('hlej:corrupt-backup')).toBe('{not json');
  });

  it('migrates old unversioned data', () => {
    const old = { examDate: '2027-03-21', topics: [], journal: [] };
    const m = migrate(old);
    expect(m.version).toBe(DATA_VERSION);
    expect(sanitize(old).settings.examDate).toBe('2027-03-21');
  });

  it('exports and re-imports data losslessly', () => {
    const d = emptyData();
    d.settings.dailyWordGoal = 25;
    d.journal.push({ id: 'j', date: '2026-11-20', topics: 'Tenses', minutes: 45, note: 'Good day', mood: '😊' });
    d.review.push({ wordId: 'adapt', addedAt: '2026-11-20', reviewCount: 2 });
    const back = parseImport(exportJson(d));
    expect(back).toEqual(sanitize(d));
  });

  it('rejects invalid import files', () => {
    expect(() => parseImport('hello')).toThrow(/valid JSON/);
    expect(() => parseImport('[1,2]')).toThrow();
    expect(() => parseImport('{"app":"other","data":{}}')).toThrow(/different app/);
    expect(() => parseImport('{"topics":"oops"}')).toThrow(/topics/);
    expect(() => parseImport('{"foo":1}')).toThrow();
  });

  it('cleans dangerous or broken values', () => {
    const r = sanitize({
      version: DATA_VERSION,
      settings: { dailyWordGoal: 9999, theme: 'neon', examDate: 'tomorrow' },
      topics: [{ id: '1', name: '  ', status: 'x' }, { id: '2', name: 'Ok', status: 'completed', progress: 3 }],
      review: [{ wordId: 'a' }, { wordId: 'a' }],
      days: { 'bad-key': {}, '2026-11-21': { wordIds: ['a', 'b'], known: ['a', 'z'], practice: ['a', 'b'] } },
    });
    expect(r.settings.dailyWordGoal).toBe(100);
    expect(r.settings.theme).toBe('kraft');
    expect(r.settings.examDate).toBeNull();
    expect(r.topics).toHaveLength(1);
    expect(r.topics[0].progress).toBe(100);
    expect(r.review).toHaveLength(1);
    expect(Object.keys(r.days)).toEqual(['2026-11-21']);
    expect(r.days['2026-11-21'].known).toEqual(['a']);
    expect(r.days['2026-11-21'].practice).toEqual(['b']);
  });
});
