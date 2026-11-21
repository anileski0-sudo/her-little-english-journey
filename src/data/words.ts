import type { Word } from '../lib/types';
import w1 from './words1';
import w2 from './words2';
import w3 from './words3';
import w4 from './words4';
import w5 from './words5';
import w6 from './words6';

export const POS_LABELS: Record<string, string> = {
  n: 'Noun',
  v: 'Verb',
  adj: 'Adjective',
  adv: 'Adverb',
  prep: 'Preposition',
  conj: 'Conjunction',
  phr: 'Phrasal verb',
};

export function parseWords(...chunks: string[]): Word[] {
  const out: Word[] = [];
  const seen = new Set<string>();
  for (const chunk of chunks) {
    for (const line of chunk.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('//')) continue;
      const [en, pos, level, tr, ex, exTr, syn] = t.split('|').map((s) => (s ?? '').trim());
      if (!en || !tr || !ex || !exTr || (level !== 'B1' && level !== 'B2')) continue;
      const id = en.toLowerCase();
      if (seen.has(id)) continue;
      seen.add(id);
      out.push({ id, en, pos, level, tr, ex, exTr, syn: syn || undefined });
    }
  }
  return out;
}

export const WORDS: Word[] = parseWords(w1, w2, w3, w4, w5, w6);
export const WORD_MAP: Map<string, Word> = new Map(WORDS.map((w) => [w.id, w]));
export const getWord = (id: string) => WORD_MAP.get(id);
