import type { AppData, DaySet, Word } from './types';

/** Small deterministic PRNG so a date always produces the same shuffle. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Picks `count` words for `date`, avoiding words in `exclude`.
 * Priority:
 *  1. words never shown on any previous day and not learned (fresh words)
 *  2. words shown before but never learned (oldest first)
 *  3. learned words, learned longest ago first (controlled repetition once the pool runs out)
 */
export function pickWords(
  date: string,
  count: number,
  pool: Word[],
  data: Pick<AppData, 'days' | 'learned'>,
  exclude: Set<string> = new Set(),
): string[] {
  const rand = mulberry32(hash(date + ':' + exclude.size));
  const lastShown = new Map<string, string>();
  for (const day of Object.values(data.days)) {
    if (day.date === date) continue;
    for (const id of day.wordIds) {
      const prev = lastShown.get(id);
      if (!prev || prev < day.date) lastShown.set(id, day.date);
    }
  }
  const fresh: string[] = [];
  const seen: string[] = [];
  const learned: string[] = [];
  for (const w of pool) {
    if (exclude.has(w.id)) continue;
    if (data.learned[w.id]) learned.push(w.id);
    else if (lastShown.has(w.id)) seen.push(w.id);
    else fresh.push(w.id);
  }
  const byDate = (m: (id: string) => string) => (a: string, b: string) => (m(a) < m(b) ? -1 : m(a) > m(b) ? 1 : 0);
  const ordered = [
    ...shuffle(fresh, rand),
    ...shuffle(seen, rand).sort(byDate((id) => lastShown.get(id) ?? '')),
    ...shuffle(learned, rand).sort(byDate((id) => data.learned[id])),
  ];
  return ordered.slice(0, count);
}

/** Returns the day set for `date`, creating or extending it if needed. `changed` tells whether to persist. */
export function ensureDaySet(
  date: string,
  goal: number,
  pool: Word[],
  data: Pick<AppData, 'days' | 'learned'>,
): { day: DaySet; changed: boolean } {
  const validIds = new Set(pool.map((w) => w.id));
  const existing = data.days[date];
  if (existing) {
    const wordIds = existing.wordIds.filter((id) => validIds.has(id));
    if (wordIds.length >= goal && wordIds.length === existing.wordIds.length) {
      return { day: existing, changed: false };
    }
    const extra = wordIds.length < goal ? pickWords(date, goal - wordIds.length, pool, data, new Set(wordIds)) : [];
    const ids = [...wordIds, ...extra];
    const keep = new Set(ids);
    return {
      day: {
        ...existing,
        wordIds: ids,
        known: existing.known.filter((id) => keep.has(id)),
        practice: existing.practice.filter((id) => keep.has(id)),
        celebrated: extra.length > 0 ? false : existing.celebrated,
      },
      changed: true,
    };
  }
  return {
    day: { date, wordIds: pickWords(date, goal, pool, data), known: [], practice: [], celebrated: false },
    changed: true,
  };
}

export const answeredCount = (d: DaySet) => d.known.length + d.practice.length;
export const isDayComplete = (d: DaySet) => d.wordIds.length > 0 && answeredCount(d) >= d.wordIds.length;
