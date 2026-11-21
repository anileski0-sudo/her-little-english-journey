import { Link } from 'react-router-dom';
import { ArrowRight, BookHeart, Clock3, Flame, GraduationCap, Sparkles, Trophy } from 'lucide-react';
import Countdown from '../components/Countdown';
import { BarChart, Paper, Postmark, ProgressBar, StampStat, TravelStrip } from '../components/ui';
import Sticker from '../stickers/Sticker';
import { useApp } from '../store/AppContext';
import { formatLong, formatMinutes, weekdayShort, weekKeys } from '../lib/date';
import { messageOfTheDay } from '../lib/messages';
import { minutesByDay } from '../lib/stats';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Still up studying? Get some rest soon';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const { data, stats, today } = useApp();
  const week = weekKeys(today);
  const weekMinutes = minutesByDay(data, week);
  const wordPct = stats.todayTotal ? (stats.todayAnswered / stats.todayTotal) * 100 : 0;
  const topicPct = stats.topicsTotal ? (stats.topicsCompleted / stats.topicsTotal) * 100 : 0;
  const studyPct = (stats.todayMinutes / data.settings.dailyStudyGoal) * 100;
  const wordsDone = stats.todayAnswered >= stats.todayTotal && stats.todayTotal > 0;

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* HERO — the cover of an old travel journal with a postcard pasted on it */}
      <section className="paper anim-pop relative overflow-hidden rounded-md px-5 pb-10 pt-8 sm:px-10 sm:py-12" style={{ background: '#c39b70', backgroundImage: 'var(--speckle), var(--grain), var(--fibers), radial-gradient(ellipse at 75% 35%, rgba(255,240,215,.5), transparent 60%), radial-gradient(ellipse at 0% 100%, rgba(90,60,30,.25), transparent 60%)' }}>
        <div className="pointer-events-none absolute inset-3 rounded border-2 border-dashed border-[rgba(255,248,235,.6)] sm:inset-4" />
        {/* stitched corner protectors */}
        <span className="pointer-events-none absolute left-0 top-0 h-16 w-16 bg-[#8a5a3c]" style={{ clipPath: 'polygon(0 0,100% 0,0 100%)' }} />
        <span className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 bg-[#8a5a3c]" style={{ clipPath: 'polygon(100% 0,100% 100%,0 100%)' }} />
        <div className="relative grid items-center gap-10 md:grid-cols-[1.15fr_1fr]">
          <div>
            <span className="luggage-tag">{formatLong(today)}</span>
            <p className="font-hand mt-5 text-2xl text-[#4f3a2b] sm:text-[1.7rem]">{greeting()} ☀️</p>
            <h1 className="font-display mt-1 text-[2.6rem] leading-[1.02] text-[#33251c] [text-shadow:0_1px_0_rgba(255,240,220,.45)] sm:text-6xl lg:text-7xl">
              Hello, my lovely
              <br />
              <span className="italic text-[#7a3f38]">English learner!</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg font-bold text-[#3f2f24]">Every little step you take today brings you closer to your dreams.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/words" className="btn btn-ink">
                Let's study today <Sparkles size={18} />
              </Link>
              <Link to="/wall" className="btn btn-paper" style={{ background: 'rgba(255,250,240,.8)' }}>
                A little note for you ♡
              </Link>
            </div>
          </div>

          {/* pasted postcard */}
          <div className="relative mx-auto w-full max-w-[270px] min-[400px]:max-w-[320px] sm:max-w-[420px] lg:max-w-[460px]">
            <div className="paper relative rotate-[2.5deg] p-3 sm:p-4" style={{ background: '#fffaf0' }}>
              <span className="washi washi-mustard washi-corner-l" />
              <div className="relative aspect-[5/4] overflow-hidden rounded-[2px]" style={{ background: 'linear-gradient(180deg,#cfe0ea 0%,#e9eef0 55%,#f4e8d5 100%)' }}>
                <div className="absolute inset-x-0 bottom-0 h-[22%]" style={{ background: '#a9b896' }} />
                <div className="absolute left-[8%] top-[10%] h-6 w-14 rounded-full bg-white/80 sm:h-8 sm:w-20" />
                <div className="absolute right-[22%] top-[24%] h-5 w-10 rounded-full bg-white/70 sm:w-14" />
                <p className="font-hand absolute bottom-2 left-3 z-10 text-xl text-[#3c2a22] sm:text-2xl">Greetings from Paris ♡</p>
                <Sticker id="eiffel" size="62%" rotate={-3} className="absolute left-[19%] top-[6%]" />
              </div>
              <div className="stamp-wrap absolute -right-3 -top-4 w-[62px] rotate-[6deg] sm:w-[74px]">
                <div className="stamp-color"><div className="stamp-inner grid aspect-[4/5] place-items-center" style={{ backgroundColor: '#d9a6a0' }}><span className="text-2xl">♡</span></div></div>
              </div>
              <Postmark text="PARIS · LONDON · ROMA ·" center="YDS" size={86} className="absolute -right-8 top-6 rotate-[-12deg]" />
            </div>
            <Sticker id="plane" size="30%" rotate={-12} className="anim-float absolute -left-6 -top-8 sm:-left-12" />
            <Sticker id="book" size="27%" rotate={-12} className="absolute -bottom-8 -left-4 sm:-left-10" />
            <Sticker id="flowers" size="25%" rotate={10} className="absolute -bottom-9 right-[4%]" />
            <Sticker id="star" size="13%" rotate={14} className="anim-float absolute -right-3 bottom-[34%]" style={{ animationDelay: '1.2s' }} />
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <div className="anim-pop" style={{ animationDelay: '.08s' }}>
        <Countdown />
      </div>

      {/* QUICK STATS — a row of postage stamps */}
      <section aria-label="Today at a glance" className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-6">
        {[
          { icon: <BookHeart size={17} color="#3c2a22" />, label: 'Words learned', value: stats.totalLearned, color: '#e6bfb8' },
          { icon: <GraduationCap size={17} color="#3c2a22" />, label: 'Topics done', value: stats.topicsCompleted, color: '#c6cfb6' },
          { icon: <Clock3 size={17} color="#3c2a22" />, label: 'Studied today', value: formatMinutes(stats.todayMinutes), color: '#c3d3df' },
          { icon: <Flame size={17} color="#3c2a22" />, label: 'Day streak', value: stats.streak, color: '#e8d29c' },
        ].map((s, i) => (
          <StampStat key={s.label} {...s} rotate={[-2, 1.5, -1, 2.2][i]} delay={0.1 + i * 0.05} />
        ))}
      </section>

      {/* THREE SCRAPBOOK NOTES */}
      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Paper tape="rose" tilt="l" className="paper-lined flex flex-col px-6 pb-6 pt-8 pl-12">
          <Sticker id="books" size={74} rotate={10} className="absolute -right-3 -top-6" />
          <span className="label-tag self-start">Daily words</span>
          <h3 className="font-display mt-2 pr-12 text-3xl">Today's Vocabulary</h3>
          <p className="font-display mt-4 text-4xl">
            {stats.todayAnswered} <span className="text-2xl text-[var(--ink-soft)]">/ {stats.todayTotal} words</span>
          </p>
          <div className="mt-3">
            <ProgressBar value={wordPct} label="Today's words" />
          </div>
          <p className="font-hand mt-3 text-xl">
            {wordsDone ? 'All done for today! You are amazing ♡' : stats.todayAnswered === 0 ? 'Thirty little words are waiting for you.' : `${stats.todayKnown} known so far — keep going!`}
          </p>
          <Link to="/words" className="btn btn-rose mt-auto self-start" style={{ marginTop: 20 }}>
            {wordsDone ? 'See today\'s words' : 'Continue learning'} <ArrowRight size={18} />
          </Link>
        </Paper>

        <Paper tape="sage" tapePos="right" tilt="r" className="flex flex-col px-6 pb-6 pt-8" style={{ background: '#f1ecd9' }}>
          <Sticker id="pencil" size={70} rotate={-4} className="absolute -left-4 -top-7" />
          <span className="label-tag self-start">My topics</span>
          <h3 className="font-display mt-2 text-3xl">My Study Progress</h3>
          <p className="font-display mt-4 text-4xl">
            {stats.topicsCompleted} <span className="text-2xl text-[var(--ink-soft)]">of {stats.topicsTotal} topics</span>
          </p>
          <div className="mt-3">
            <ProgressBar value={topicPct} color="#9CA98E" label="Topics completed" />
          </div>
          <p className="font-hand mt-3 text-xl">
            {stats.topicsTotal === 0 ? 'Add the topics you want to study — grammar, reading, anything!' : `${Math.round(topicPct)}% completed. Look how far you've come!`}
          </p>
          <Link to="/topics" className="btn btn-sage self-start" style={{ marginTop: 20 }}>
            {stats.topicsTotal === 0 ? 'Add my first topic' : 'View topics'} <ArrowRight size={18} />
          </Link>
        </Paper>

        <Paper tape="mustard" tilt="l" className="paper-dots flex flex-col px-6 pb-6 pt-8 md:col-span-2 lg:col-span-1">
          <Sticker id="coffee" size={72} rotate={8} className="absolute -right-3 -top-7" />
          <span className="label-tag self-start">Study time</span>
          <h3 className="font-display mt-2 pr-12 text-3xl">Little Steps, Big Dreams</h3>
          <p className="font-display mt-3 text-4xl">
            {formatMinutes(stats.weekMinutes)} <span className="text-2xl text-[var(--ink-soft)]">this week</span>
          </p>
          <div className="mt-2">
            <BarChart values={weekMinutes} labels={week.map(weekdayShort)} format={formatMinutes} height={96} color="#D6B56C" highlightLast={false} />
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm font-bold text-[var(--ink-soft)]">
            <span className="whitespace-nowrap">Today {formatMinutes(stats.todayMinutes)} / {formatMinutes(data.settings.dailyStudyGoal)}</span>
            <div className="flex-1"><ProgressBar value={studyPct} color="#9CB5C8" label="Today's study goal" /></div>
          </div>
          <Link to="/journal" className="btn btn-paper self-start" style={{ marginTop: 16 }}>
            Log study time <ArrowRight size={18} />
          </Link>
        </Paper>
      </section>

      {/* MOTIVATION NOTE */}
      <section className="relative mx-auto max-w-3xl pt-4">
        <Paper tape="rose" tapePos="corners" tilt="r" className="torn-bottom px-6 pb-10 pt-10 text-center sm:px-14" style={{ background: '#fdf6ea' }}>
          <Sticker id="envelope" size={70} rotate={-10} className="absolute -left-4 -top-8 sm:-left-8" />
          <span className="label-tag">Note of the day</span>
          <p className="font-hand mt-4 text-4xl leading-tight sm:text-5xl">“{messageOfTheDay(today)}”</p>
          <p className="mt-4 font-semibold text-[var(--ink-soft)]">Keep going, you're doing wonderfully. ♡</p>
          <Link to="/wall" className="btn btn-ghost mt-4">
            <Trophy size={18} /> Visit the motivation wall
          </Link>
        </Paper>
      </section>

      <TravelStrip ids={['colosseum', 'santorini', 'sydney', 'liberty', 'towerbridge']} />
    </div>
  );
}
