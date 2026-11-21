import { BookHeart, CalendarCheck, Clock3, Flame, GraduationCap, Target } from 'lucide-react';
import { BarChart, PageHeader, Paper, StampStat } from '../components/ui';
import Sticker from '../stickers/Sticker';
import { LANDMARK_IDS, LANDMARKS } from '../stickers/landmarks';
import { useApp } from '../store/AppContext';
import { formatMinutes, formatShort, lastNDays, weekdayShort } from '../lib/date';
import { BADGES, learnedByDay, minutesByDay } from '../lib/stats';

export const WORDS_PER_STICKER = 20;

export default function Progress() {
  const { data, stats, today } = useApp();
  const last7 = lastNDays(today, 7);
  const last14 = lastNDays(today, 14);
  const unlocked = Math.min(LANDMARK_IDS.length, 1 + Math.floor(stats.totalLearned / WORDS_PER_STICKER));
  const recent = [...data.achievements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  const cards = [
    { icon: BookHeart, label: 'Words learned', value: stats.totalLearned, color: '#e6bfb8' },
    { icon: GraduationCap, label: 'Topics completed', value: stats.topicsCompleted, color: '#c6cfb6' },
    { icon: Clock3, label: 'Total study time', value: formatMinutes(stats.totalMinutes), color: '#c3d3df' },
    { icon: CalendarCheck, label: 'Study days', value: stats.studyDays, color: '#e8d29c' },
    { icon: Target, label: 'Daily goal rate', value: `${stats.dailyGoalRate}%`, color: '#ecc9ad' },
    { icon: Flame, label: 'Streak', value: `${stats.streak} ${stats.streak === 1 ? 'day' : 'days'}`, sub: `best: ${stats.bestStreak}`, color: '#d8c9df' },
  ];

  return (
    <div>
      <PageHeader kicker="Achievements" title="My Progress" subtitle="Look how far you have travelled" stickers={[{ id: 'suitcase' }, { id: 'star' }]} />

      <section className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-6">
        {cards.map(({ icon: Icon, label, value, color, sub }, i) => (
          <StampStat
            key={label}
            icon={<Icon size={17} color="#3c2a22" />}
            label={label}
            value={<>{value}{sub && <span className="font-hand mt-1 block text-lg leading-none">{sub}</span>}</>}
            color={color}
            rotate={[-2, 1.5, -1, 2, -1.5, 1][i]}
            delay={i * 0.05}
          />
        ))}
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <Paper tape="blue" className="paper-grid px-5 pb-5 pt-8 sm:px-7">
          <h2 className="font-display text-2xl">Weekly study time</h2>
          <p className="font-hand mb-3 text-lg text-[var(--ink-soft)]">Minutes from your journal, last 7 days</p>
          <BarChart values={minutesByDay(data, last7)} labels={last7.map(weekdayShort)} format={formatMinutes} color="#9CB5C8" />
        </Paper>
        <Paper tape="rose" tapePos="right" className="paper-grid px-5 pb-5 pt-8 sm:px-7">
          <h2 className="font-display text-2xl">Words learned</h2>
          <p className="font-hand mb-3 text-lg text-[var(--ink-soft)]">"I know this!" words, last 14 days</p>
          <BarChart values={learnedByDay(data, last14)} labels={last14.map((k) => formatShort(k).split(' ')[0])} color="#D9A6A0" />
        </Paper>
      </section>

      <section className="mt-14">
        <h2 className="font-display mb-6 text-3xl"><span className="squiggle">Badges</span> <span className="text-xl text-[var(--ink-soft)]">{Object.keys(data.badges).length}/{BADGES.length}</span></h2>
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {BADGES.map((b, i) => {
            const earned = data.badges[b.id];
            const [cur, max] = b.progress(stats);
            return (
              <li key={b.id} className={`paper flex flex-col items-center px-3 pb-4 pt-5 text-center ${i % 2 ? 'tilt-r' : 'tilt-l'}`} style={{ background: earned ? '#fffaf0' : '#f1e7d6' }}>
                <div
                  className="grid h-20 w-20 place-items-center rounded-full text-4xl"
                  style={
                    earned
                      ? { background: b.color, boxShadow: '0 0 0 5px #fffdf8, 0 6px 14px rgba(73,55,43,.28)' }
                      : { background: 'repeating-linear-gradient(45deg,#e4d6c0 0 6px,#ebdfcc 6px 12px)', boxShadow: '0 0 0 5px #f8f0e3', filter: 'grayscale(.8)', opacity: 0.75 }
                  }
                >
                  {earned ? b.emoji : '🔒'}
                </div>
                <h3 className="font-display mt-3 text-lg leading-tight">{b.name}</h3>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">{b.description}</p>
                <p className="font-hand mt-auto pt-2 text-lg">{earned ? `Earned ${formatShort(earned)} ♡` : `${Math.min(cur, max)} / ${max}`}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14">
        <Paper tape="kraft" tapePos="corners" className="px-5 pb-8 pt-8 sm:px-8" style={{ background: '#e9dcc6', backgroundImage: 'var(--grain), radial-gradient(rgba(73,55,43,.07) 1px, transparent 1.4px)', backgroundSize: 'auto, 16px 16px' }}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="label-tag">Travel passport</span>
              <h2 className="font-display mt-2 text-3xl">My Sticker Collection</h2>
              <p className="font-hand text-xl text-[var(--ink-soft)]">Every {WORDS_PER_STICKER} words you learn unlock a new place. {unlocked}/{LANDMARK_IDS.length} collected!</p>
            </div>
          </div>
          <ul className="grid grid-cols-3 gap-x-3 gap-y-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {LANDMARK_IDS.map((id, i) => {
              const open = i < unlocked;
              return (
                <li key={id} className="flex flex-col items-center text-center">
                  {open ? (
                    <Sticker id={id} size="min(104px, 100%)" rotate={[-6, 4, -3, 7, -5, 3][i % 6]} title={`${LANDMARKS[id].name}, ${LANDMARKS[id].place}`} />
                  ) : (
                    <div className="stamp grid aspect-square w-[min(80px,100%)] place-items-center" style={{ background: '#f4ead8' }}>
                      <span className="font-hand text-center text-base leading-tight text-[var(--ink-soft)]">
                        {(i * WORDS_PER_STICKER) - stats.totalLearned > 0 ? `${i * WORDS_PER_STICKER - stats.totalLearned} words to go` : 'soon'}
                      </span>
                    </div>
                  )}
                  <span className="mt-2 text-[11px] font-extrabold leading-tight">{open ? LANDMARKS[id].place : '???'}</span>
                </li>
              );
            })}
          </ul>
        </Paper>
      </section>

      <section className="mt-14">
        <h2 className="font-display mb-5 text-3xl"><span className="squiggle">Little victories</span></h2>
        {recent.length === 0 ? (
          <p className="font-hand text-2xl text-[var(--ink-soft)]">Completed topics, finished word days and badges will be written here. ✨</p>
        ) : (
          <Paper className="paper-lined px-5 py-4 pl-12">
            <ul>
              {recent.map((a) => (
                <li key={a.id} className="flex items-baseline gap-3 leading-[30px]">
                  <span className="text-lg">{a.type === 'badge' ? '🏅' : a.type === 'daily' ? '📖' : '🎀'}</span>
                  <span className="flex-1 font-semibold">
                    {a.type === 'badge' ? `Badge earned: ${a.label}` : a.type === 'daily' ? `Daily words completed (${a.label})` : `Topic completed: ${a.label}`}
                  </span>
                  <span className="font-hand text-lg text-[var(--ink-soft)]">{formatShort(a.date)}</span>
                </li>
              ))}
            </ul>
          </Paper>
        )}
      </section>
    </div>
  );
}
