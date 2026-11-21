import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Layers, List, RotateCcw, Trash2 } from 'lucide-react';
import Flashcard from '../components/Flashcard';
import { EmptyState, PageHeader, Paper, TravelStrip } from '../components/ui';
import { getWord, POS_LABELS } from '../data/words';
import { useApp } from '../store/AppContext';
import { formatShort } from '../lib/date';
import { pickMessage, WORD_MESSAGES } from '../lib/messages';

export default function Review() {
  const { data, reviewLearned, reviewRemove, reviewAgain, toast } = useApp();
  const [mode, setMode] = useState<'list' | 'cards'>('list');
  const [cursor, setCursor] = useState(0);
  const [sessionDone, setSessionDone] = useState(0);

  const items = useMemo(
    () => data.review.map((r) => ({ ...r, word: getWord(r.wordId) })).filter((r) => r.word),
    [data.review],
  );
  const current = items.length ? items[cursor % items.length] : null;

  const statusText = (count: number, last?: string) =>
    count === 0 ? 'New in review' : `Practised ${count}× ${last ? `· last ${formatShort(last)}` : ''}`;

  return (
    <div>
      <PageHeader kicker="Practice corner" title="Review Words" subtitle="Words that deserve a second hello" stickers={[{ id: 'budapest' }, { id: 'venice' }]}>
        {items.length > 0 && (
          <div className="mt-5 inline-flex rounded-full bg-[rgba(73,55,43,.08)] p-1" role="tablist">
            <button role="tab" aria-selected={mode === 'list'} className={`btn btn-sm ${mode === 'list' ? 'btn-ink' : 'btn-ghost'}`} onClick={() => setMode('list')}>
              <List size={16} /> List
            </button>
            <button role="tab" aria-selected={mode === 'cards'} className={`btn btn-sm ${mode === 'cards' ? 'btn-ink' : 'btn-ghost'}`} onClick={() => { setMode('cards'); setSessionDone(0); }}>
              <Layers size={16} /> Flashcards
            </button>
          </div>
        )}
      </PageHeader>

      {items.length === 0 ? (
        <Paper className="paper-lined mx-auto max-w-2xl" tape="sage">
          <EmptyState
            sticker="star"
            title={sessionDone > 0 ? 'Review list cleared!' : 'Nothing to review right now'}
            text={sessionDone > 0 ? 'You worked through every word. That is wonderful dedication! ♡' : 'When you choose "Practice again" on a daily word, it will wait for you here.'}
            action={<Link to="/words" className="btn btn-rose">Go to daily words</Link>}
          />
        </Paper>
      ) : mode === 'list' ? (
        <>
          <p className="font-hand mb-5 text-2xl text-[var(--ink-soft)]">{items.length} word{items.length === 1 ? '' : 's'} waiting for some practice.</p>
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((r, i) => (
              <Paper as="li" key={r.wordId} tape={i % 4 === 0 ? 'blue' : undefined} tapePos="right" className="anim-pop flex flex-col px-5 pb-4 pt-5" style={{ animationDelay: `${Math.min(i, 9) * 0.03}s`, background: i % 3 === 1 ? '#fbf3e3' : undefined }}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display break-words text-3xl leading-tight" lang="en">{r.word!.en}</h3>
                  <span className="mt-1 shrink-0 rounded-sm px-2 py-0.5 text-xs font-extrabold" style={{ background: r.word!.level === 'B1' ? '#d9e3cc' : '#f0d9c4' }}>
                    {r.word!.level}
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">{POS_LABELS[r.word!.pos]}</p>
                <p className="font-display mt-2 text-xl text-[#8b4a42]" lang="tr">{r.word!.tr}</p>
                <p className="mt-2 text-sm" lang="en">{r.word!.ex}</p>
                <p className="mt-3 text-xs font-extrabold text-[var(--ink-soft)]">↻ {statusText(r.reviewCount, r.lastReviewed)}</p>
                <div className="mt-3 flex gap-2 border-t border-dashed border-[rgba(73,55,43,.2)] pt-3">
                  <button
                    className="btn btn-sage btn-sm"
                    onClick={() => {
                      reviewLearned(r.wordId);
                      toast({ message: pickMessage(WORD_MESSAGES), tone: 'sage' });
                    }}
                  >
                    <Check size={16} /> Learned
                  </button>
                  <button className="btn btn-ghost btn-sm ml-auto text-[#9C4A3F]" onClick={() => reviewRemove(r.wordId)}>
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </Paper>
            ))}
          </ul>
        </>
      ) : (
        current && (
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 text-center text-sm font-extrabold text-[var(--ink-soft)]">
              Card {(cursor % items.length) + 1} of {items.length} · {sessionDone} cleared this session
            </p>
            <Flashcard word={current.word!} position={statusText(current.reviewCount, current.lastReviewed)}>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  className="btn btn-sage min-h-[56px] text-lg"
                  onClick={() => {
                    reviewLearned(current.wordId);
                    setSessionDone((n) => n + 1);
                    toast({ message: pickMessage(WORD_MESSAGES), tone: 'sage' });
                    setCursor((c) => (items.length > 1 ? c % (items.length - 1) : 0));
                  }}
                >
                  Got it now! ✨
                </button>
                <button
                  className="btn btn-rose min-h-[56px] text-lg"
                  onClick={() => {
                    reviewAgain(current.wordId);
                    setCursor((c) => (c + 1) % items.length);
                  }}
                >
                  <RotateCcw size={18} /> Still practising
                </button>
              </div>
            </Flashcard>
          </div>
        )
      )}

      <TravelStrip ids={['buckingham', 'edinburgh']} />
    </div>
  );
}
