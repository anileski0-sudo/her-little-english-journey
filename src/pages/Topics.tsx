import { FormEvent, useMemo, useState } from 'react';
import { CalendarDays, Check, Minus, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { ConfirmDialog, EmptyState, Modal, PageHeader, Paper, ProgressBar, TravelStrip } from '../components/ui';
import { useApp } from '../store/AppContext';
import { formatShort } from '../lib/date';
import { pickMessage, TOPIC_MESSAGES } from '../lib/messages';
import { Topic, TOPIC_CATEGORIES, TopicCategory, TopicStatus } from '../lib/types';

const STATUS_LABEL: Record<TopicStatus, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  completed: 'Completed',
};
const STATUS_STYLE: Record<TopicStatus, { bg: string; chip: string; bar: string }> = {
  'not-started': { bg: '#f8f1e4', chip: 'rgba(73,55,43,.1)', bar: '#A98462' },
  'in-progress': { bg: '#f7ebcf', chip: '#ecd59b', bar: '#D6B56C' },
  completed: { bg: '#e7ecdb', chip: '#c3cfb3', bar: '#8FA67F' },
};
const CATEGORY_COLOR: Record<string, string> = {
  Grammar: '#9CB5C8',
  Vocabulary: '#D9A6A0',
  Reading: '#D6B56C',
  'Sentence Completion': '#B7C4A6',
  'Cloze Test': '#E2B79A',
  Translation: '#C7B2D1',
  Paragraph: '#A9C5C0',
  Restatement: '#E8C79A',
  'Phrasal Verbs': '#D8A9B8',
  Other: '#CDBBA4',
};

type Draft = { name: string; category: TopicCategory; description: string; status: TopicStatus; progress: number; date: string };

function TopicForm({ initial, onSave, onCancel }: { initial: Draft; onSave: (d: Draft) => void; onCancel: () => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [error, setError] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!d.name.trim()) return setError('Please give your topic a name.');
    onSave({ ...d, name: d.name.trim(), description: d.description.trim() });
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="field-label">Topic name *</span>
        <input className="field" value={d.name} maxLength={200} placeholder="e.g. Tenses, Relative Clauses, Reading Passages" onChange={(e) => { setD({ ...d, name: e.target.value }); setError(''); }} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Category</span>
          <select className="field" value={d.category} onChange={(e) => setD({ ...d, category: e.target.value as TopicCategory })}>
            {TOPIC_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="field-label">Date</span>
          <input type="date" className="field" value={d.date} onChange={(e) => setD({ ...d, date: e.target.value })} />
        </label>
      </div>
      <label className="block">
        <span className="field-label">Description (optional)</span>
        <textarea className="field min-h-[84px]" value={d.description} maxLength={2000} placeholder="Notes, pages, sources…" onChange={(e) => setD({ ...d, description: e.target.value })} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Status</span>
          <select
            className="field"
            value={d.status}
            onChange={(e) => {
              const status = e.target.value as TopicStatus;
              setD({ ...d, status, progress: status === 'completed' ? 100 : status === 'not-started' ? 0 : Math.max(10, Math.min(d.progress, 90)) });
            }}
          >
            {(Object.keys(STATUS_LABEL) as TopicStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="field-label">Progress: {d.progress}%</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={d.progress}
            className="mt-3 w-full accent-[#C27C74]"
            onChange={(e) => {
              const progress = Number(e.target.value);
              setD({ ...d, progress, status: progress >= 100 ? 'completed' : progress > 0 ? 'in-progress' : d.status === 'completed' ? 'in-progress' : d.status });
            }}
          />
        </label>
      </div>
      {error && <p className="text-sm font-bold text-[#9C4A3F]">{error}</p>}
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <button type="button" className="btn btn-paper" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-ink">Save topic</button>
      </div>
    </form>
  );
}

function TopicCard({ t, index, onEdit, onDelete }: { t: Topic; index: number; onEdit: () => void; onDelete: () => void }) {
  const { completeTopic, reopenTopic, updateTopic, toast } = useApp();
  const style = STATUS_STYLE[t.status];
  const step = (delta: number) => {
    const progress = Math.max(0, Math.min(100, t.progress + delta));
    if (progress >= 100) return complete();
    updateTopic(t.id, { progress, status: progress > 0 ? 'in-progress' : 'not-started' });
  };
  const complete = () => {
    completeTopic(t.id);
    toast({ title: 'Topic completed', message: pickMessage(TOPIC_MESSAGES), tone: 'sage' });
  };
  return (
    <Paper as="li" tape={index % 3 === 0 ? 'kraft' : undefined} tapePos="left" className={`anim-pop flex flex-col px-5 pb-4 pt-5 ${index % 2 ? 'tilt-r' : ''}`} style={{ background: style.bg, animationDelay: `${Math.min(index, 8) * 0.04}s` }}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-sm px-2 py-0.5 text-xs font-extrabold" style={{ background: CATEGORY_COLOR[t.category] }}>{t.category}</span>
        <span className="rounded-sm px-2 py-0.5 text-xs font-extrabold" style={{ background: style.chip }}>{STATUS_LABEL[t.status]}</span>
        {t.date && (
          <span className="ml-auto flex items-center gap-1 text-xs font-bold text-[var(--ink-soft)]">
            <CalendarDays size={13} /> {formatShort(t.date)}
          </span>
        )}
      </div>
      <h3 className={`font-display mt-3 break-words text-2xl leading-tight ${t.status === 'completed' ? 'decoration-[#8FA67F] decoration-2' : ''}`}>{t.name}</h3>
      {t.description && <p className="mt-1 whitespace-pre-line break-words text-sm text-[var(--ink-soft)]">{t.description}</p>}
      <div className="mt-4 flex items-center gap-2">
        {t.status !== 'completed' && (
          <button className="btn btn-ghost btn-icon btn-sm !min-h-[32px] !min-w-[32px]" onClick={() => step(-10)} aria-label="Decrease progress" disabled={t.progress <= 0}>
            <Minus size={16} />
          </button>
        )}
        <div className="flex-1">
          <ProgressBar value={t.progress} color={style.bar} label={`${t.name} progress`} />
        </div>
        {t.status !== 'completed' && (
          <button className="btn btn-ghost btn-icon btn-sm !min-h-[32px] !min-w-[32px]" onClick={() => step(10)} aria-label="Increase progress">
            <Plus size={16} />
          </button>
        )}
        <span className="w-11 text-right text-sm font-extrabold">{t.progress}%</span>
      </div>
      {t.completedAt && <p className="font-hand mt-2 text-lg text-[#5f7a58]">Completed on {formatShort(t.completedAt)} ♡</p>}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-dashed border-[rgba(73,55,43,.2)] pt-3">
        {t.status !== 'completed' ? (
          <button className="btn btn-sage btn-sm" onClick={complete}>
            <Check size={16} /> Mark completed
          </button>
        ) : (
          <button className="btn btn-paper btn-sm" onClick={() => reopenTopic(t.id)}>
            <RotateCcw size={16} /> Make active again
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={onEdit}>
          <Pencil size={15} /> Edit
        </button>
        <button className="btn btn-ghost btn-sm ml-auto text-[#9C4A3F]" onClick={onDelete} aria-label={`Delete ${t.name}`}>
          <Trash2 size={15} />
        </button>
      </div>
    </Paper>
  );
}

export default function Topics() {
  const { data, today, addTopic, updateTopic, deleteTopic } = useApp();
  const [editing, setEditing] = useState<Topic | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Topic | null>(null);
  const [category, setCategory] = useState<string>('All');

  const filtered = useMemo(() => data.topics.filter((t) => category === 'All' || t.category === category), [data.topics, category]);
  const active = filtered.filter((t) => t.status !== 'completed').sort((a, b) => (a.status === b.status ? 0 : a.status === 'in-progress' ? -1 : 1));
  const completed = filtered.filter((t) => t.status === 'completed').sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
  const total = data.topics.length;
  const done = data.topics.filter((t) => t.status === 'completed').length;
  const avg = total ? Math.round(data.topics.reduce((s, t) => s + t.progress, 0) / total) : 0;
  const usedCategories = TOPIC_CATEGORIES.filter((c) => data.topics.some((t) => t.category === c));

  const emptyDraft: Draft = { name: '', category: 'Grammar', description: '', status: 'not-started', progress: 0, date: today };

  return (
    <div>
      <PageHeader kicker="Study agenda" title="My Topics" subtitle="Little chapters of a big journey" stickers={[{ id: 'sagrada' }, { id: 'notredame' }]}>
        <button className="btn btn-ink mt-5" onClick={() => setEditing('new')}>
          <Plus size={18} /> Add a topic
        </button>
      </PageHeader>

      {total > 0 && (
        <Paper tape="mustard" className="mb-8 grid gap-5 px-6 py-6 sm:grid-cols-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink-soft)]">Completed</div>
            <div className="font-display text-4xl">{done} <span className="text-2xl text-[var(--ink-soft)]">/ {total}</span></div>
          </div>
          <div className="sm:col-span-2">
            <div className="flex justify-between text-sm font-extrabold">
              <span>Overall progress</span>
              <span>{avg}%</span>
            </div>
            <div className="mt-2"><ProgressBar value={avg} color="#9CA98E" label="Overall topic progress" /></div>
            <p className="font-hand mt-2 text-xl">{avg >= 100 ? 'Everything completed — incredible!' : avg >= 50 ? 'More than halfway there! ♡' : 'Every topic you finish is a little victory.'}</p>
          </div>
        </Paper>
      )}

      {usedCategories.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          {['All', ...usedCategories].map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={`rounded-full border-[1.5px] px-3 py-1.5 text-sm font-extrabold transition ${category === c ? 'border-[var(--ink)] bg-[var(--ink)] text-[#fbf3e6]' : 'border-dashed border-[rgba(73,55,43,.3)] bg-[rgba(255,253,248,.6)]'}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {total === 0 ? (
        <Paper className="paper-lined">
          <EmptyState
            sticker="pencil"
            title="Your study agenda is empty"
            text="Add the topics you are working on — like Tenses, Reading Passages or Phrasal Verbs — and track them step by step."
            action={<button className="btn btn-ink" onClick={() => setEditing('new')}><Plus size={18} /> Add my first topic</button>}
          />
        </Paper>
      ) : (
        <>
          <h2 className="font-display mb-4 text-3xl"><span className="squiggle">Active topics</span> <span className="text-xl text-[var(--ink-soft)]">({active.length})</span></h2>
          {active.length === 0 ? (
            <p className="font-hand mb-6 text-2xl text-[var(--ink-soft)]">No active topics here — everything is done or you can add a new one! ✨</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {active.map((t, i) => (
                <TopicCard key={t.id} t={t} index={i} onEdit={() => setEditing(t)} onDelete={() => setDeleting(t)} />
              ))}
            </ul>
          )}

          <h2 className="font-display mb-4 mt-12 text-3xl"><span className="squiggle">Completed topics</span> <span className="text-xl text-[var(--ink-soft)]">({completed.length})</span></h2>
          {completed.length === 0 ? (
            <p className="font-hand text-2xl text-[var(--ink-soft)]">Your first completed topic will shine here soon. 🌷</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {completed.map((t, i) => (
                <TopicCard key={t.id} t={t} index={i} onEdit={() => setEditing(t)} onDelete={() => setDeleting(t)} />
              ))}
            </ul>
          )}
        </>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'New topic' : 'Edit topic'}>
        {editing !== null && (
          <TopicForm
            initial={editing === 'new' ? emptyDraft : { name: editing.name, category: editing.category, description: editing.description, status: editing.status, progress: editing.progress, date: editing.date }}
            onCancel={() => setEditing(null)}
            onSave={(d) => {
              if (editing === 'new') addTopic(d);
              else updateTopic(editing.id, d);
              setEditing(null);
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete this topic?"
        text={`"${deleting?.name ?? ''}" will be removed from your agenda. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={() => deleting && deleteTopic(deleting.id)}
        onClose={() => setDeleting(null)}
      />

      <TravelStrip ids={['arc', 'pisa', 'duomo']} />
    </div>
  );
}
