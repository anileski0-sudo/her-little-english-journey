import { FormEvent, useMemo, useState } from 'react';
import { Clock3, Pencil, Plus, Trash2 } from 'lucide-react';
import { BarChart, ConfirmDialog, EmptyState, Modal, PageHeader, Paper, ProgressBar, TravelStrip } from '../components/ui';
import { useApp } from '../store/AppContext';
import { formatLong, formatMinutes, formatShort, isDateKey, lastNDays, weekdayShort, weekKeys } from '../lib/date';
import { minutesByDay } from '../lib/stats';
import { JournalEntry, MOOD_LABELS, MOODS } from '../lib/types';

type Draft = Omit<JournalEntry, 'id'> & { id?: string };

function EntryForm({ initial, onSave, onCancel }: { initial: Draft; onSave: (d: Draft) => void; onCancel: () => void }) {
  const { data } = useApp();
  const [d, setD] = useState<Draft>(initial);
  const [error, setError] = useState('');
  const topicChips = data.topics.filter((t) => t.status !== 'completed').slice(0, 8);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isDateKey(d.date)) return setError('Please choose a date.');
    if (!Number.isFinite(d.minutes) || d.minutes < 0 || d.minutes > 1440) return setError('Study time should be between 0 and 1440 minutes.');
    if (d.minutes === 0 && !d.note.trim() && !d.topics.trim()) return setError('Add a study time, a topic or a little note.');
    onSave({ ...d, minutes: Math.round(d.minutes), topics: d.topics.trim(), note: d.note.trim() });
  };
  const addTopic = (name: string) => {
    const parts = d.topics.split(',').map((s) => s.trim()).filter(Boolean);
    if (!parts.includes(name)) setD({ ...d, topics: [...parts, name].join(', ') });
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Date</span>
          <input type="date" className="field" value={d.date} onChange={(e) => setD({ ...d, date: e.target.value })} />
        </label>
        <label className="block">
          <span className="field-label">Study time (minutes)</span>
          <input type="number" inputMode="numeric" min={0} max={1440} className="field" value={Number.isFinite(d.minutes) ? d.minutes : ''} onChange={(e) => { setD({ ...d, minutes: e.target.value === '' ? 0 : Number(e.target.value) }); setError(''); }} />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {[15, 30, 45, 60, 90, 120].map((m) => (
          <button type="button" key={m} className={`btn btn-sm ${d.minutes === m ? 'btn-ink' : 'btn-paper'}`} onClick={() => setD({ ...d, minutes: m })}>
            {formatMinutes(m)}
          </button>
        ))}
      </div>
      <label className="block">
        <span className="field-label">What did you study?</span>
        <input className="field" value={d.topics} maxLength={500} placeholder="e.g. Tenses, reading passage 3, phrasal verbs" onChange={(e) => setD({ ...d, topics: e.target.value })} />
      </label>
      {topicChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {topicChips.map((t) => (
            <button type="button" key={t.id} className="rounded-full border-[1.5px] border-dashed border-[rgba(73,55,43,.3)] px-3 py-1 text-xs font-extrabold hover:bg-[rgba(73,55,43,.06)]" onClick={() => addTopic(t.name)}>
              + {t.name}
            </button>
          ))}
        </div>
      )}
      <fieldset>
        <legend className="field-label">How did you feel today?</legend>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setD({ ...d, mood: d.mood === m ? '' : m })}
              className={`flex min-h-[44px] items-center gap-1 rounded-full border-[1.5px] px-3 text-sm font-bold ${d.mood === m ? 'border-[var(--ink)] bg-[rgba(217,166,160,.35)]' : 'border-dashed border-[rgba(73,55,43,.25)]'}`}
              aria-pressed={d.mood === m}
            >
              <span className="text-xl">{m}</span> {MOOD_LABELS[m]}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="field-label">Little note</span>
        <textarea className="field paper-lined min-h-[110px] leading-[30px]" value={d.note} maxLength={5000} placeholder="What went well? What was hard? Anything you want to remember…" onChange={(e) => setD({ ...d, note: e.target.value })} />
      </label>
      {error && <p className="text-sm font-bold text-[#9C4A3F]">{error}</p>}
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <button type="button" className="btn btn-paper" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-ink">Save entry</button>
      </div>
    </form>
  );
}

export default function Journal() {
  const { data, today, saveEntry, deleteEntry } = useApp();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [deleting, setDeleting] = useState<JournalEntry | null>(null);
  const [range, setRange] = useState<'week' | '14'>('week');

  const week = weekKeys(today);
  const weekTotal = minutesByDay(data, week).reduce((a, b) => a + b, 0);
  const weekGoal = data.settings.dailyStudyGoal * 7;
  const chartKeys = range === 'week' ? week : lastNDays(today, 14);
  const chartValues = minutesByDay(data, chartKeys);

  const grouped = useMemo(() => {
    const m = new Map<string, JournalEntry[]>();
    for (const j of [...data.journal].sort((a, b) => b.date.localeCompare(a.date))) {
      if (!m.has(j.date)) m.set(j.date, []);
      m.get(j.date)!.push(j);
    }
    return Array.from(m.entries());
  }, [data.journal]);

  const newDraft: Draft = { date: today, topics: '', minutes: 30, note: '', mood: '' };

  return (
    <div>
      <PageHeader kicker="Dear diary" title="Study Journal" subtitle="Little pages of hard work" stickers={[{ id: 'montstmichel' }, { id: 'parkguell' }]}>
        <button className="btn btn-ink mt-5" onClick={() => setEditing(newDraft)}>
          <Plus size={18} /> New entry
        </button>
      </PageHeader>

      <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Paper tape="mustard" tilt="l" className="px-6 pb-6 pt-8">
          <span className="label-tag">This week</span>
          <p className="font-display mt-3 text-5xl">{formatMinutes(weekTotal)}</p>
          <p className="mt-1 text-sm font-bold text-[var(--ink-soft)]">Weekly goal: {formatMinutes(weekGoal)}</p>
          <div className="mt-3"><ProgressBar value={(weekTotal / Math.max(1, weekGoal)) * 100} color="#D6B56C" label="Weekly study goal" /></div>
          <p className="font-hand mt-3 text-xl">
            {weekTotal >= weekGoal ? 'Weekly goal reached! You are a star ⭐' : weekTotal > 0 ? 'Every minute counts. Keep going! ♡' : 'Log your first study session this week.'}
          </p>
        </Paper>
        <Paper className="paper-grid px-5 pb-5 pt-6 sm:px-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-2xl">Study minutes per day</h2>
            <div className="inline-flex rounded-full bg-[rgba(73,55,43,.08)] p-1">
              <button className={`btn btn-sm ${range === 'week' ? 'btn-ink' : 'btn-ghost'}`} onClick={() => setRange('week')}>This week</button>
              <button className={`btn btn-sm ${range === '14' ? 'btn-ink' : 'btn-ghost'}`} onClick={() => setRange('14')}>14 days</button>
            </div>
          </div>
          <BarChart values={chartValues} labels={chartKeys.map((k) => (range === 'week' ? weekdayShort(k) : formatShort(k).split(' ')[0]))} format={formatMinutes} highlightLast={false} color="#9CB5C8" height={150} />
        </Paper>
      </div>

      {grouped.length === 0 ? (
        <Paper className="paper-lined mx-auto max-w-2xl" tape="rose">
          <EmptyState sticker="coffee" title="Your journal is waiting" text="After each study session, write down what you studied, how long, and how you felt. Your weekly chart will grow from here." action={<button className="btn btn-ink" onClick={() => setEditing(newDraft)}><Plus size={18} /> Write my first entry</button>} />
        </Paper>
      ) : (
        <div className="space-y-10">
          {grouped.map(([date, entries], gi) => (
            <section key={date}>
              <h2 className="font-display mb-4 flex flex-wrap items-baseline gap-3 text-2xl">
                <span className="squiggle">{date === today ? 'Today' : formatLong(date)}</span>
                <span className="text-sm font-extrabold text-[var(--ink-soft)]">{formatMinutes(entries.reduce((s, e) => s + e.minutes, 0))} total</span>
              </h2>
              <ul className="grid gap-6 md:grid-cols-2">
                {entries.map((e, i) => (
                  <Paper as="li" key={e.id} className="paper-lined anim-pop px-5 pb-4 pl-12 pt-5" tape={(gi + i) % 3 === 0 ? 'sage' : undefined} tapePos="right" tilt={(gi + i) % 2 ? 'r' : undefined}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 rounded-sm bg-[rgba(156,181,200,.35)] px-2 py-0.5 text-sm font-extrabold">
                          <Clock3 size={14} /> {formatMinutes(e.minutes)}
                        </span>
                        {e.mood && <span className="text-2xl" title={MOOD_LABELS[e.mood]}>{e.mood}</span>}
                      </div>
                      <div className="flex">
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditing(e)} aria-label="Edit entry"><Pencil size={16} /></button>
                        <button className="btn btn-ghost btn-icon btn-sm text-[#9C4A3F]" onClick={() => setDeleting(e)} aria-label="Delete entry"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    {e.topics && <p className="mt-2 font-extrabold leading-[30px]">{e.topics}</p>}
                    {e.note && <p className="font-hand whitespace-pre-line break-words text-xl leading-[30px]">{e.note}</p>}
                  </Paper>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit entry' : 'New journal entry'} wide>
        {editing && (
          <EntryForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSave={(d) => {
              saveEntry(d);
              setEditing(null);
            }}
          />
        )}
      </Modal>
      <ConfirmDialog open={!!deleting} title="Delete this entry?" text="This journal page will be removed and its study minutes will no longer count. This cannot be undone." confirmLabel="Delete" danger onConfirm={() => deleting && deleteEntry(deleting.id)} onClose={() => setDeleting(null)} />

      <TravelStrip ids={['acropolis', 'liberty']} />
    </div>
  );
}
