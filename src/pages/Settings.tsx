import { ChangeEvent, useRef, useState } from 'react';
import { Download, Palette, RotateCcw, Save, Upload, CalendarX } from 'lucide-react';
import { ConfirmDialog, PageHeader, Paper } from '../components/ui';
import { useApp } from '../store/AppContext';
import { exportJson, parseImport } from '../lib/storage';
import { formatLong, isDateKey, toKey } from '../lib/date';
import type { AppData, ThemeName } from '../lib/types';

const THEMES: { id: ThemeName; name: string; colors: string[] }[] = [
  { id: 'kraft', name: 'Kraft Paper', colors: ['#ecdcc0', '#a98462', '#d9a6a0'] },
  { id: 'rose', name: 'Dusty Rose', colors: ['#efd9cf', '#d9a6a0', '#b8665e'] },
  { id: 'sage', name: 'Sage Garden', colors: ['#dfe0c8', '#9ca98e', '#6f8a6a'] },
  { id: 'blue', name: 'Seaside Blue', colors: ['#dbe2e2', '#9cb5c8', '#5f84a3'] },
];

export default function Settings() {
  const { data, updateSettings, replaceData, resetAll, toast } = useApp();
  const s = data.settings;
  const [examDate, setExamDate] = useState(s.examDate ?? '');
  const [examTime, setExamTime] = useState(s.examTime);
  const [wordGoal, setWordGoal] = useState(String(s.dailyWordGoal));
  const [studyGoal, setStudyGoal] = useState(String(s.dailyStudyGoal));
  const [error, setError] = useState('');
  const [importError, setImportError] = useState('');
  const [pendingImport, setPendingImport] = useState<AppData | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetChecked, setResetChecked] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const saveGoals = () => {
    setError('');
    if (examDate && !isDateKey(examDate)) return setError('Please choose a valid exam date.');
    if (!/^\d{2}:\d{2}$/.test(examTime)) return setError('Please choose a valid exam time.');
    const wg = Number(wordGoal);
    const sg = Number(studyGoal);
    if (!Number.isInteger(wg) || wg < 5 || wg > 100) return setError('Daily word goal should be a whole number between 5 and 100.');
    if (!Number.isInteger(sg) || sg < 5 || sg > 600) return setError('Daily study goal should be between 5 and 600 minutes.');
    updateSettings({ examDate: examDate || null, examTime, dailyWordGoal: wg, dailyStudyGoal: sg });
    toast({ message: 'Settings saved ♡', tone: 'sage' });
  };

  const doExport = () => {
    try {
      const blob = new Blob([exportJson(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `her-little-english-journey-backup-${toKey()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast({ message: 'Backup downloaded! Keep it somewhere safe. 💌', tone: 'blue' });
    } catch {
      toast({ message: 'Sorry, the backup could not be created.', tone: 'rose' });
    }
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setImportError('This file is too large to be a journal backup.');
    try {
      const text = await file.text();
      setPendingImport(parseImport(text));
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'This file could not be read.');
    }
  };

  return (
    <div>
      <PageHeader kicker="Little adjustments" title="Settings" subtitle="Make this journal truly yours" stickers={[{ id: 'alps' }]} />

      <div className="grid gap-8 lg:grid-cols-2">
        <Paper tape="blue" className="px-6 pb-6 pt-8">
          <h2 className="font-display text-2xl">Exam & daily goals</h2>
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <label className="block">
                <span className="field-label">YDS exam date</span>
                <input type="date" className="field" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
              </label>
              <label className="block">
                <span className="field-label">Start time</span>
                <input type="time" className="field" value={examTime} onChange={(e) => setExamTime(e.target.value)} />
              </label>
            </div>
            {s.examDate && <p className="text-sm text-[var(--ink-soft)]">Currently counting down to <b>{formatLong(s.examDate)}</b>.</p>}
            {examDate && (
              <button className="btn btn-ghost btn-sm" onClick={() => setExamDate('')}>
                <CalendarX size={15} /> Clear date
              </button>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Daily word goal</span>
                <input type="number" inputMode="numeric" min={5} max={100} className="field" value={wordGoal} onChange={(e) => setWordGoal(e.target.value)} />
                <span className="mt-1 block text-xs text-[var(--ink-soft)]">Default: 30 words</span>
              </label>
              <label className="block">
                <span className="field-label">Daily study goal (minutes)</span>
                <input type="number" inputMode="numeric" min={5} max={600} className="field" value={studyGoal} onChange={(e) => setStudyGoal(e.target.value)} />
                <span className="mt-1 block text-xs text-[var(--ink-soft)]">Default: 60 minutes</span>
              </label>
            </div>
            <p className="text-xs text-[var(--ink-soft)]">A bigger word goal adds more words to today's set right away. A smaller one applies from tomorrow, so today's progress is never lost.</p>
            {error && <p className="text-sm font-bold text-[#9C4A3F]">{error}</p>}
            <button className="btn btn-ink" onClick={saveGoals}>
              <Save size={18} /> Save settings
            </button>
          </div>
        </Paper>

        <Paper tape="rose" tapePos="right" className="px-6 pb-6 pt-8">
          <h2 className="font-display flex items-center gap-2 text-2xl"><Palette size={22} /> Theme</h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">Choose the paper color of your journal.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => updateSettings({ theme: t.id })}
                aria-pressed={s.theme === t.id}
                className={`flex items-center gap-3 rounded-sm border-2 p-3 text-left transition ${s.theme === t.id ? 'border-[var(--ink)] bg-[rgba(255,253,248,.7)]' : 'border-dashed border-[rgba(73,55,43,.25)]'}`}
              >
                <span className="flex -space-x-2">
                  {t.colors.map((c) => (
                    <span key={c} className="h-7 w-7 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </span>
                <span className="text-sm font-extrabold">{t.name}</span>
              </button>
            ))}
          </div>
        </Paper>

        <Paper tape="sage" className="px-6 pb-6 pt-8">
          <h2 className="font-display text-2xl">Backup your journal</h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            Your progress is saved only in this browser on this device. Download a backup now and then — and use it to move your journal to another phone or computer.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn btn-sage" onClick={doExport}>
              <Download size={18} /> Export data (JSON)
            </button>
            <button className="btn btn-paper" onClick={() => fileRef.current?.click()}>
              <Upload size={18} /> Import data
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
          </div>
          {importError && <p className="mt-3 text-sm font-bold text-[#9C4A3F]">⚠️ {importError}</p>}
        </Paper>

        <Paper className="px-6 pb-6 pt-8" style={{ background: '#f7e6dc' }}>
          <h2 className="font-display text-2xl">Start fresh</h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">This deletes all topics, words, journal entries, badges and settings from this browser. Export a backup first if you might want them back.</p>
          <button className="btn btn-paper mt-5 text-[#9C4A3F]" onClick={() => { setResetChecked(false); setConfirmReset(true); }}>
            <RotateCcw size={18} /> Reset all progress
          </button>
        </Paper>
      </div>

      <ConfirmDialog
        open={!!pendingImport}
        title="Replace your journal with this backup?"
        text={
          pendingImport
            ? `The backup contains ${pendingImport.topics.length} topics, ${Object.keys(pendingImport.learned).length} learned words and ${pendingImport.journal.length} journal entries. Your current data in this browser will be replaced.`
            : ''
        }
        confirmLabel="Import backup"
        onConfirm={() => {
          if (pendingImport) {
            replaceData(pendingImport);
            setExamDate(pendingImport.settings.examDate ?? '');
            setExamTime(pendingImport.settings.examTime);
            setWordGoal(String(pendingImport.settings.dailyWordGoal));
            setStudyGoal(String(pendingImport.settings.dailyStudyGoal));
            toast({ message: 'Backup imported successfully! ✨', tone: 'sage' });
          }
        }}
        onClose={() => setPendingImport(null)}
      />

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(60,44,33,0.45)] sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && setConfirmReset(false)}>
          <div className="paper anim-pop w-full rounded-t-xl p-6 sm:max-w-lg sm:rounded-sm" role="dialog" aria-modal="true" aria-label="Reset all progress">
            <span className="washi" />
            <h2 className="font-display text-2xl">Reset everything?</h2>
            <p className="mt-2 text-[var(--ink-soft)]">All progress in this browser will be permanently deleted. This cannot be undone.</p>
            <label className="mt-4 flex items-start gap-3 text-sm font-bold">
              <input type="checkbox" className="mt-1 h-5 w-5 accent-[#9C4A3F]" checked={resetChecked} onChange={(e) => setResetChecked(e.target.checked)} />
              I understand that my words, topics, journal and badges will be deleted.
            </label>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button className="btn btn-paper" onClick={() => setConfirmReset(false)}>Keep my progress</button>
              <button
                className="btn btn-ink"
                style={{ background: '#9C4A3F', boxShadow: '0 3px 0 #6E3029' }}
                disabled={!resetChecked}
                onClick={() => {
                  resetAll();
                  setExamDate('');
                  setExamTime('10:15');
                  setWordGoal('30');
                  setStudyGoal('60');
                  setConfirmReset(false);
                  toast({ message: 'A fresh new page. You can do this! ♡', tone: 'rose' });
                }}
              >
                Yes, reset everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
