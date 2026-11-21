import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, ListChecks, RotateCcw } from 'lucide-react';
import Flashcard from '../components/Flashcard';
import { Modal, PageHeader, Paper, ProgressBar, TravelStrip } from '../components/ui';
import Sticker from '../stickers/Sticker';
import { getWord } from '../data/words';
import { useApp } from '../store/AppContext';
import { answeredCount, isDayComplete } from '../lib/daily';
import { formatLong, formatShort, isDateKey } from '../lib/date';
import { pickMessage, PRACTICE_MESSAGES, WORD_MESSAGES } from '../lib/messages';
import { bigConfetti } from '../lib/confetti';
import type { DaySet } from '../lib/types';

function Celebration({ day, onReview }: { day: DaySet; onReview: () => void }) {
  const n = day.wordIds.length;
  return (
    <div className="relative mx-auto max-w-2xl pt-6">
      <Sticker id="star" size={64} rotate={-14} className="anim-float absolute -left-2 top-0 z-10 sm:-left-8" />
      <Sticker id="heart" size={56} rotate={12} className="anim-float absolute -right-1 top-10 z-10 sm:-right-6" style={{ animationDelay: '1s' }} />
      <Paper tape="mustard" tapePos="corners" className="anim-pop px-6 pb-9 pt-12 text-center sm:px-12" style={{ background: '#fff7e6' }}>
        <div className="mb-4 flex justify-center gap-2 text-3xl" aria-hidden>
          <span>⭐</span><span>✨</span><span>⭐</span>
        </div>
        <h2 className="font-display text-4xl tracking-wide sm:text-5xl">
          {n}/{n} WORDS COMPLETED!
        </h2>
        <p className="font-hand mx-auto mt-5 max-w-lg text-3xl leading-snug">
          You did it! Today's hard work is tomorrow's confidence. I'm so proud of you! ♡
        </p>
        <div className="mt-6 flex justify-center gap-6 text-sm font-extrabold">
          <span className="rounded-sm bg-[#c3cfb3] px-3 py-1.5">{day.known.length} known ✨</span>
          <span className="rounded-sm bg-[#ecd59b] px-3 py-1.5">{day.practice.length} to practise 📚</span>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="btn btn-paper" onClick={onReview}>
            <ListChecks size={18} /> See today's words
          </button>
          {day.practice.length > 0 && (
            <Link to="/review" className="btn btn-rose">
              <RotateCcw size={18} /> Practise review words
            </Link>
          )}
          <Link to="/progress" className="btn btn-ink">
            My progress <ArrowRight size={18} />
          </Link>
        </div>
      </Paper>
    </div>
  );
}

export default function DailyWords() {
  const { data, today, ensureDay, markWord, markDayCelebrated, toast } = useApp();
  const [params, setParams] = useSearchParams();
  const requested = params.get('date');
  const date = requested && isDateKey(requested) && data.days[requested] ? requested : today;
  const day = data.days[date];
  const [index, setIndex] = useState(0);
  const [showList, setShowList] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [forceDeck, setForceDeck] = useState(false);

  useEffect(() => {
    if (!data.days[date]) ensureDay(date);
  }, [date, data.days, ensureDay]);

  // Jump to the first unanswered card whenever the day changes.
  useEffect(() => {
    if (!day) return;
    const first = day.wordIds.findIndex((id) => !day.known.includes(id) && !day.practice.includes(id));
    setIndex(first === -1 ? 0 : first);
    setForceDeck(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, !!day]);

  const complete = day ? isDayComplete(day) : false;

  useEffect(() => {
    if (day && complete && !day.celebrated) {
      markDayCelebrated(date);
      bigConfetti();
    }
  }, [complete, day, date, markDayCelebrated]);

  const history = useMemo(
    () => Object.values(data.days).sort((a, b) => b.date.localeCompare(a.date)),
    [data.days],
  );

  if (!day) {
    return <p className="font-hand py-20 text-center text-3xl">Preparing your words…</p>;
  }

  const total = day.wordIds.length;
  const answered = answeredCount(day);
  const wordId = day.wordIds[Math.min(index, total - 1)];
  const word = getWord(wordId);
  const status = day.known.includes(wordId) ? 'known' : day.practice.includes(wordId) ? 'practice' : null;

  const goNext = (from: number, justAnswered?: string) => {
    for (let k = 1; k <= total; k++) {
      const i = (from + k) % total;
      const id = day.wordIds[i];
      if (id !== justAnswered && !day.known.includes(id) && !day.practice.includes(id)) return setIndex(i);
    }
    setIndex(Math.min(from + 1, total - 1));
  };

  const answer = (a: 'known' | 'practice') => {
    markWord(date, wordId, a);
    toast(a === 'known' ? { message: pickMessage(WORD_MESSAGES), tone: 'rose' } : { message: pickMessage(PRACTICE_MESSAGES), tone: 'blue' });
    goNext(index, wordId);
  };

  const showCelebration = complete && !forceDeck;

  return (
    <div>
      <PageHeader
        kicker={date === today ? 'Today' : 'Past day'}
        title="Daily Words"
        subtitle={date === today ? `${total} little words for ${formatLong(date)}` : `Your words from ${formatLong(date)}`}
        stickers={[{ id: 'brandenburg' }, { id: 'amsterdam' }]}
      >
        <div className="mt-5 flex flex-wrap gap-2">
          {date !== today && (
            <button className="btn btn-ink btn-sm" onClick={() => setParams({})}>
              Back to today
            </button>
          )}
          <button className="btn btn-paper btn-sm" onClick={() => setShowHistory(true)}>
            <CalendarDays size={16} /> Previous days
          </button>
          <button className="btn btn-paper btn-sm" onClick={() => setShowList(true)}>
            <ListChecks size={16} /> Word list
          </button>
        </div>
      </PageHeader>

      {/* progress */}
      <Paper className="mx-auto mb-10 max-w-3xl px-5 py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-2xl">{showCelebration ? `${total} of ${total} words` : `Word ${index + 1} of ${total}`}</p>
          <p className="text-sm font-extrabold text-[var(--ink-soft)]">
            {answered}/{total} done · <span className="text-[#5f7a58]">{day.known.length} known</span> · <span className="text-[#9a7a2c]">{day.practice.length} practising</span>
          </p>
        </div>
        <div className="mt-2"><ProgressBar value={(answered / Math.max(1, total)) * 100} label="Daily words progress" /></div>
        {!showCelebration && (
          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Jump to word">
            {day.wordIds.map((id, i) => {
              const st = day.known.includes(id) ? '#9CA98E' : day.practice.includes(id) ? '#D6B56C' : 'rgba(73,55,43,.14)';
              return (
                <button
                  key={id}
                  onClick={() => setIndex(i)}
                  aria-label={`Word ${i + 1}`}
                  aria-current={i === index}
                  className="h-3.5 w-3.5 rounded-full transition-transform hover:scale-125"
                  style={{ background: st, outline: i === index ? '2px solid var(--ink)' : 'none', outlineOffset: 2 }}
                />
              );
            })}
          </div>
        )}
      </Paper>

      {showCelebration ? (
        <Celebration day={day} onReview={() => setShowList(true)} />
      ) : word ? (
        <div className="relative mx-auto max-w-3xl">
          <Sticker id="plane" size={78} rotate={-8} className="absolute -left-14 top-10 z-10 hidden xl:block xl:-left-28" />
          <Sticker id="books" size={80} rotate={8} className="absolute -right-14 bottom-24 z-10 hidden xl:block xl:-right-28" />
          <Flashcard word={word} status={status} position={`${word.level} vocabulary · YDS`}>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className={`btn btn-sage min-h-[56px] text-lg ${status === 'known' ? 'ring-2 ring-[#6F8A6A] ring-offset-2' : ''}`} onClick={() => answer('known')}>
                I know this! ✨
              </button>
              <button className={`btn btn-rose min-h-[56px] text-lg ${status === 'practice' ? 'ring-2 ring-[#C27C74] ring-offset-2' : ''}`} onClick={() => answer('practice')}>
                Practice again 📚
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button className="btn btn-ghost btn-sm" onClick={() => setIndex((i) => (i - 1 + total) % total)} aria-label="Previous word">
                <ArrowLeft size={16} /> Previous
              </button>
              {complete && (
                <button className="btn btn-ghost btn-sm" onClick={() => setForceDeck(false)}>
                  Back to summary
                </button>
              )}
              <button className="btn btn-ghost btn-sm" onClick={() => setIndex((i) => (i + 1) % total)} aria-label="Next word">
                Next <ArrowRight size={16} />
              </button>
            </div>
          </Flashcard>
        </div>
      ) : (
        <p className="text-center">This word could not be loaded.</p>
      )}

      {/* today's list */}
      <Modal open={showList} onClose={() => setShowList(false)} title={date === today ? "Today's words" : `Words · ${formatShort(date)}`} wide>
        <ul className="divide-y divide-dashed divide-[rgba(73,55,43,.2)]">
          {day.wordIds.map((id, i) => {
            const w = getWord(id);
            if (!w) return null;
            const st = day.known.includes(id) ? 'known' : day.practice.includes(id) ? 'practice' : null;
            return (
              <li key={id}>
                <button
                  className="flex w-full items-center gap-3 py-2.5 text-left hover:bg-[rgba(73,55,43,.04)]"
                  onClick={() => {
                    setIndex(i);
                    setForceDeck(true);
                    setShowList(false);
                  }}
                >
                  <span className="w-6 text-right text-xs font-bold text-[var(--ink-soft)]">{i + 1}</span>
                  <span className="flex-1">
                    <span className="font-bold">{w.en}</span>
                    <span className="ml-2 text-sm text-[var(--ink-soft)]">{st ? w.tr : '· · ·'}</span>
                  </span>
                  <span className="text-xs font-extrabold">{st === 'known' ? '✨ known' : st === 'practice' ? '📚 practice' : ''}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Modal>

      {/* history */}
      <Modal open={showHistory} onClose={() => setShowHistory(false)} title="Previous days">
        {history.length <= 1 ? (
          <p className="font-hand text-2xl text-[var(--ink-soft)]">Your earlier days will be collected here, like pages in a diary. ♡</p>
        ) : (
          <ul className="space-y-2">
            {history.map((d) => {
              const a = answeredCount(d);
              return (
                <li key={d.date}>
                  <button
                    className={`flex w-full items-center gap-3 rounded-sm border-[1.5px] px-3 py-2.5 text-left ${d.date === date ? 'border-[var(--ink)] bg-[rgba(73,55,43,.06)]' : 'border-dashed border-[rgba(73,55,43,.25)]'}`}
                    onClick={() => {
                      setParams(d.date === today ? {} : { date: d.date });
                      setShowHistory(false);
                    }}
                  >
                    <span className="flex-1">
                      <span className="block font-bold">{d.date === today ? 'Today' : formatLong(d.date)}</span>
                      <span className="text-xs font-bold text-[var(--ink-soft)]">{d.known.length} known · {d.practice.length} practising</span>
                    </span>
                    <span className="w-24"><ProgressBar value={(a / Math.max(1, d.wordIds.length)) * 100} /></span>
                    <span className="w-12 text-right text-sm font-extrabold">{a}/{d.wordIds.length}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Modal>

      <TravelStrip ids={['alps', 'prague', 'tram']} />
    </div>
  );
}
