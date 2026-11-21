// All dates are handled in the user's LOCAL time zone as YYYY-MM-DD keys.
const pad = (n: number) => String(n).padStart(2, '0');

export function toKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isDateKey(k: unknown): k is string {
  if (typeof k !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(k)) return false;
  const d = fromKey(k);
  return toKey(d) === k;
}

export function fromKey(k: string): Date {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(k: string, n: number): string {
  const d = fromKey(k);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

/** Whole days from a to b (b - a). Rounding absorbs DST shifts. */
export function diffDays(a: string, b: string): number {
  return Math.round((fromKey(b).getTime() - fromKey(a).getTime()) / 86400000);
}

export function lastNDays(today: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));
}

/** Monday → Sunday of the week containing `today`. */
export function weekKeys(today: string): string[] {
  const dow = (fromKey(today).getDay() + 6) % 7; // 0 = Monday
  const monday = addDays(today, -dow);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function formatLong(k: string): string {
  return fromKey(k).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShort(k: string): string {
  return fromKey(k).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function weekdayShort(k: string): string {
  return fromKey(k).toLocaleDateString('en-GB', { weekday: 'short' });
}

export function formatMinutes(min: number): string {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${r}m`;
  if (r === 0) return `${h}h`;
  return `${h}h ${r}m`;
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
