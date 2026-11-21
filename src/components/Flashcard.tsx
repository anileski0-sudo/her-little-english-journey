import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { POS_LABELS } from '../data/words';
import type { Word } from '../lib/types';
import Sticker from '../stickers/Sticker';
import { LANDMARK_IDS } from '../stickers/landmarks';
import { Postmark } from './ui';

function stampFor(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return LANDMARK_IDS[h % LANDMARK_IDS.length];
}

/**
 * A physical-looking flashcard. The word and level are always visible;
 * "Reveal meaning" unfolds the Turkish meaning, examples and synonym.
 */
export default function Flashcard({
  word,
  status,
  position,
  children,
}: {
  word: Word;
  status?: 'known' | 'practice' | null;
  position?: string;
  children?: React.ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => setRevealed(false), [word.id]);

  return (
    <div key={word.id} className="anim-slide relative">
      {/* stacked cards behind for a physical deck feel */}
      <div className="paper absolute inset-x-3 -bottom-2 top-3 -z-10 rotate-[1.5deg]" style={{ background: '#efe2cb' }} />
      <div className="paper absolute inset-x-6 -bottom-4 top-6 -z-20 -rotate-[1.2deg]" style={{ background: '#e8d7bd' }} />
      <article className="paper relative overflow-hidden px-5 pb-6 pt-7 sm:px-10 sm:pb-8 sm:pt-9" style={{ background: '#fffaf1' }} aria-live="polite">
        <span className="washi washi-blue" />
        <span className="ribbon left-6 sm:left-10" aria-hidden />
        {/* index-card rule lines */}
        <div className="pointer-events-none absolute inset-x-0 top-[60px] h-[2px] bg-[rgba(201,113,90,.4)] sm:top-[70px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[64px] opacity-60 sm:top-[74px]" style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 31px, rgba(95,132,163,.16) 31px 32px)' }} />
        {/* postage stamp + postmark */}
        <div className="stamp-wrap absolute right-4 top-4 z-[1] w-[64px] rotate-[4deg] sm:right-7 sm:top-6 sm:w-[84px]" aria-hidden>
          <div className="stamp-color">
            <div className="stamp-inner grid aspect-[4/5] place-items-center" style={{ backgroundColor: '#e9dcc4' }}>
              <Sticker id={stampFor(word.id)} size="78%" />
            </div>
          </div>
        </div>
        <Postmark text={`${word.level} · YDS VOCABULARY ·`} center={word.level} size={80} className="absolute right-12 top-12 z-[2] hidden rotate-[-16deg] opacity-80 sm:right-20 sm:top-16 sm:block" />
        <div className="relative flex items-center gap-3 pl-10 pr-20 text-xs font-extrabold uppercase tracking-widest text-[var(--ink-soft)] sm:pl-14">
          <span>{position}</span>
          {status === 'known' && <span className="rounded-sm bg-[#c3cfb3] px-2 py-1 text-[#2f3a28]">Learned ✓</span>}
          {status === 'practice' && <span className="rounded-sm bg-[#ecd59b] px-2 py-1 text-[#4a3a17]">Practising</span>}
        </div>

        <div className="relative pt-12 text-center sm:pt-14">
          <h2 className="font-display break-words text-5xl leading-tight sm:text-7xl" lang="en">
            {word.en}
          </h2>
          <p className="mt-3 text-base font-extrabold tracking-wide text-[var(--ink-soft)]">
            <span className="rounded-sm px-2 py-0.5" style={{ background: word.level === 'B1' ? '#d9e3cc' : '#f0d9c4' }}>{word.level}</span>
            <span className="mx-2">•</span>
            {POS_LABELS[word.pos] ?? word.pos}
          </p>
        </div>

        <div className="relative mt-6 flex justify-center">
          <button className={`btn ${revealed ? 'btn-ghost' : 'btn-paper'}`} onClick={() => setRevealed((r) => !r)} aria-expanded={revealed}>
            {revealed ? <EyeOff size={18} /> : <Eye size={18} />} {revealed ? 'Hide meaning' : 'Reveal Meaning'}
          </button>
        </div>

        <div className={`relative grid transition-all duration-500 ease-out ${revealed ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="space-y-4 border-t border-dashed border-[rgba(73,55,43,.25)] pt-5 text-center">
              <p className="font-display text-3xl leading-snug text-[#8b4a42] sm:text-4xl" lang="tr">{word.tr}</p>
              <div className="mx-auto max-w-xl rounded-sm bg-[rgba(156,181,200,.18)] px-4 py-3 text-left">
                <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--ink-soft)]">Example</p>
                <p className="mt-1 text-lg font-semibold" lang="en">{word.ex}</p>
                <p className="mt-1 italic text-[var(--ink-soft)]" lang="tr">{word.exTr}</p>
              </div>
              {word.syn && (
                <p className="text-sm font-bold text-[var(--ink-soft)]">
                  Synonym: <span className="font-hand text-2xl text-[var(--ink)]">{word.syn}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {children && <div className="relative mt-7">{children}</div>}
      </article>
    </div>
  );
}
