import { useEffect, useState } from 'react';
import { CalendarDays, PartyPopper } from 'lucide-react';
import { Postmark } from './ui';
import Sticker from '../stickers/Sticker';
import { useApp } from '../store/AppContext';
import { formatLong, isDateKey, toKey } from '../lib/date';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  passed: boolean;
}

export function countdownTo(examDate: string, examTime: string, now: Date = new Date()): CountdownParts {
  const [y, m, d] = examDate.split('-').map(Number);
  const [hh, mm] = (examTime || '10:15').split(':').map(Number);
  const target = new Date(y, m - 1, d, hh || 0, mm || 0, 0);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, passed: true };
  const totalMin = Math.floor(diff / 60000);
  return { days: Math.floor(totalMin / 1440), hours: Math.floor((totalMin % 1440) / 60), minutes: totalMin % 60, passed: false };
}

function useNow(intervalMs = 20000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}

function DatePicker({ compact = false }: { compact?: boolean }) {
  const { updateSettings } = useApp();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  return (
    <form
      className={`flex flex-col gap-3 ${compact ? '' : 'sm:flex-row sm:items-end'}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (!isDateKey(value)) return setError('Please choose a valid date.');
        if (value < toKey()) return setError('Please choose a date in the future.');
        updateSettings({ examDate: value });
      }}
    >
      <label className="flex-1">
        <span className="field-label">When is your YDS exam?</span>
        <input type="date" className="field" value={value} min={toKey()} onChange={(e) => { setValue(e.target.value); setError(''); }} />
      </label>
      <button className="btn btn-ink" type="submit">
        <CalendarDays size={18} /> Save my date
      </button>
      {error && <p className="text-sm font-bold text-[#9C4A3F]">{error}</p>}
    </form>
  );
}

export default function Countdown() {
  const { data } = useApp();
  const { examDate, examTime } = data.settings;
  const now = useNow();
  const parts = examDate ? countdownTo(examDate, examTime, now) : null;

  return (
    <div className="relative">
      <span className="washi washi-blue washi-left" style={{ zIndex: 5 }} />
      <Sticker id="bigben" size={96} rotate={8} className="absolute -right-2 -top-10 z-10 sm:-right-6 sm:-top-14 sm:!w-[132px]" />
      <div className="ticket-wrap md:-rotate-[0.8deg]">
        <div className="ticket min-h-[230px]">
          {/* stub */}
          <div className="ticket-stub flex flex-col justify-between px-5 py-5 sm:px-7 sm:py-6">
            <Postmark text="YDS · ONE DAY AT A TIME ·" center={examDate ? examDate.slice(0, 4) : "♡"} size={92} className="absolute -right-11 top-1/2 z-[1] hidden -translate-y-1/2 rotate-[-14deg] md:block" />
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] opacity-80">Boarding pass</p>
              <p className="font-display mt-1 text-6xl leading-none sm:text-7xl">YDS</p>
              <p className="font-hand mt-1 text-xl leading-tight">Gate: My Dream ✈</p>
            </div>
            <div className="hidden md:block">
              <div className="barcode" />
              <p className="mt-1 text-[10px] font-extrabold tracking-[0.3em] opacity-70">HLEJ · {examDate ? examDate.replace(/-/g, '') : 'SOON'}</p>
            </div>
          </div>

          {/* main */}
          <div className="relative px-5 pb-6 pt-5 sm:px-9 sm:pt-7">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pr-16 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--ink-soft)] sm:pr-24">
              <span>From: Today</span>
              <span aria-hidden>✈ - - - - -</span>
              <span>To: {examDate ? formatLong(examDate) : 'Exam day'}</span>
            </div>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl">Your YDS Journey</h2>

            {!parts && (
              <div className="mt-3 max-w-lg">
                <p className="font-hand mb-3 text-2xl leading-snug">Pick your exam date and I'll count every day with you. ♡</p>
                <DatePicker />
              </div>
            )}

            {parts && parts.passed && (
              <div className="mt-3">
                <p className="font-display flex items-center gap-2 text-3xl"><PartyPopper /> Exam day has passed!</p>
                <p className="font-hand mt-1 text-2xl">I hope it went wonderfully — I'm proud of you no matter what. ♡</p>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">Set your next exam date in Settings whenever you're ready.</p>
              </div>
            )}

            {parts && !parts.passed && (
              <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <p className="font-display leading-none" aria-live="polite">
                  <span className="text-[5.5rem] text-[#8b4a42] sm:text-[7rem]">{parts.days}</span>
                  <span className="ml-3 text-3xl tracking-wider sm:text-4xl">{parts.days === 1 ? 'DAY' : 'DAYS'}</span>
                  <span className="font-hand mt-2 block text-2xl tracking-normal text-[var(--ink-soft)]">
                    {parts.days === 0 ? "It's almost time — breathe, you are ready. ♡" : 'Every day is a new chance to grow.'}
                  </span>
                </p>
                <div className="flex gap-3">
                  {(
                    [
                      ['days', parts.days, '#D9A6A0'],
                      ['hours', parts.hours, '#D6B56C'],
                      ['min', parts.minutes, '#9CB5C8'],
                    ] as const
                  ).map(([label, v, c], i) => (
                    <div key={label} className="stamp-wrap" style={{ transform: `rotate(${[-3, 2, -1.5][i]}deg)` }}>
                      <div className="stamp-color w-[78px] sm:w-[86px]">
                        <div className="stamp-inner py-2 text-center" style={{ backgroundColor: c }}>
                          <div className="font-display text-3xl leading-tight text-[#3c2a22]">{String(v).padStart(2, '0')}</div>
                          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#3c2a22]/75">{label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { DatePicker };
