import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BookOpenCheck,
  CalendarHeart,
  Heart,
  Home,
  LineChart,
  ListChecks,
  Menu,
  NotebookPen,
  RotateCcw,
  Settings,
  X,
  AlertTriangle,
} from 'lucide-react';
import Sticker from '../stickers/Sticker';
import { useApp } from '../store/AppContext';

// Decorative stickers for the empty page margins on wide screens (different on every page).
const GUTTERS: Record<string, [string[], string[]]> = {
  '/': [['notredame', 'pisa', 'venice'], ['amsterdam', 'alps', 'tram']],
  '/topics': [['budapest', 'edinburgh', 'coffee'], ['acropolis', 'parkguell', 'books']],
  '/words': [['eiffel', 'colosseum', 'flowers'], ['sydney', 'buckingham', 'star']],
  '/review': [['arc', 'santorini', 'heart'], ['montstmichel', 'duomo', 'pencil']],
  '/journal': [['towerbridge', 'pisa', 'coffee'], ['sagrada', 'prague', 'envelope']],
  '/progress': [['plane', 'books', 'flowers'], ['heart', 'clock', 'envelope']],
  '/settings': [['amsterdam', 'tram', 'clock'], ['bigben', 'venice', 'coffee']],
  '/wall': [['liberty', 'edinburgh', 'star'], ['acropolis', 'brandenburg', 'envelope']],
};

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/topics', label: 'My Topics', icon: ListChecks },
  { to: '/words', label: 'Daily Words', icon: BookOpenCheck },
  { to: '/review', label: 'Review', icon: RotateCcw },
  { to: '/journal', label: 'Journal', icon: NotebookPen },
  { to: '/progress', label: 'Progress', icon: LineChart },
];

function Logo() {
  return (
    <NavLink to="/" className="group flex min-w-0 items-center gap-3" aria-label="Her Little English Journey — home">
      <Sticker id="book" size={46} rotate={-8} />
      <span className="min-w-0 leading-none">
        <span className="font-display block text-[17px] leading-tight min-[380px]:text-lg sm:text-2xl">Her Little English Journey</span>
        <span className="font-hand block truncate text-[15px] text-[var(--ink-soft)] sm:text-lg">A little journey to a big dream</span>
      </span>
    </NavLink>
  );
}

function Toasts() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-8" aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className="paper pointer-events-auto relative max-w-md px-6 py-4 text-center"
          style={{ animation: 'pop-in .4s cubic-bezier(.22,1,.36,1) both', transform: 'rotate(-1deg)' }}
        >
          <span className={`washi ${t.tone === 'sage' ? 'washi-sage' : t.tone === 'blue' ? 'washi-blue' : ''}`} />
          {t.title && <span className="label-tag mb-1">{t.title}</span>}
          <span className="font-hand block text-2xl leading-snug">{t.message}</span>
        </button>
      ))}
    </div>
  );
}

function BadgePopup() {
  const { badgeQueue, shiftBadge } = useApp();
  const badge = badgeQueue[0];
  if (!badge) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(60,44,33,0.45)] p-4" onClick={shiftBadge}>
      <div className="paper anim-pop relative w-full max-w-sm px-6 pb-7 pt-10 text-center" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="New badge">
        <span className="washi washi-mustard" />
        <span className="label-tag">New badge unlocked</span>
        <div className="anim-badge mx-auto my-5 grid h-28 w-28 place-items-center rounded-full text-5xl" style={{ background: badge.color, boxShadow: '0 0 0 6px #fffdf8, 0 8px 20px rgba(73,55,43,.3)' }}>
          {badge.emoji}
        </div>
        <h2 className="font-display text-3xl">{badge.name}</h2>
        <p className="mt-1 text-[var(--ink-soft)]">{badge.description}</p>
        <p className="font-hand mt-3 text-2xl">I'm so proud of you! ♡</p>
        <button className="btn btn-rose mt-5" onClick={shiftBadge}>
          Yay, thank you! ✨
        </button>
      </div>
    </div>
  );
}

export default function Layout() {
  const { warning, dismissWarning } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const gutter = GUTTERS[location.pathname] ?? GUTTERS['/'];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="gutter gutter-l" aria-hidden>
        {gutter[0].map((id, i) => (
          <Sticker key={id} id={id} rotate={[-8, 6, -4][i]} label={i !== 2} />
        ))}
      </div>
      <div className="gutter gutter-r" aria-hidden>
        {gutter[1].map((id, i) => (
          <Sticker key={id} id={id} rotate={[7, -5, 9][i]} label={i !== 2} />
        ))}
      </div>
      {/* Header */}
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
        <div className="paper paper-kraft relative mx-auto flex max-w-[1280px] items-center justify-between gap-3 rounded-sm px-3 py-2 sm:px-5" style={{ background: 'linear-gradient(180deg,#fbf3e4,#f3e6cf)', backgroundImage: 'var(--grain), linear-gradient(180deg,#fbf3e4,#f3e6cf)' }}>
          <span className="washi washi-left washi-sage hidden sm:block" />
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-[0.92rem] font-extrabold transition ${isActive ? 'bg-[var(--ink)] text-[#fbf3e6] shadow' : 'text-[var(--ink-soft)] hover:bg-[rgba(73,55,43,.07)]'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <NavLink to="/wall" className="btn btn-ghost btn-icon hidden sm:inline-flex" aria-label="Motivation wall" title="Motivation wall">
              <Heart size={22} fill="#D9A6A0" color="#C27C74" />
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `btn btn-ghost btn-icon hidden lg:inline-flex ${isActive ? 'bg-[rgba(73,55,43,.08)]' : ''}`} aria-label="Settings" title="Settings">
              <Settings size={22} />
            </NavLink>
            <button className="btn btn-ghost btn-icon lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {warning && (
        <div className="mx-auto mt-4 w-full max-w-[1280px] px-3 sm:px-5" role="alert">
          <div className="paper flex items-start gap-3 px-4 py-3" style={{ background: '#f8e3d6' }}>
            <AlertTriangle className="mt-0.5 shrink-0" size={20} color="#9C4A3F" />
            <p className="flex-1 text-sm font-semibold">{warning}</p>
            <button className="btn btn-ghost btn-sm" onClick={dismissWarning}>
              OK
            </button>
          </div>
        </div>
      )}

      <main className="relative z-[1] mx-auto w-full max-w-[1280px] flex-1 px-4 pb-32 pt-8 sm:px-6 lg:pb-16">
        <Outlet />
      </main>

      <footer className="hidden pb-8 text-center lg:block">
        <p className="font-hand text-xl text-[var(--ink-soft)]">One word, one step, one dream at a time. ♡</p>
      </footer>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 px-2 pb-[max(env(safe-area-inset-bottom),8px)] lg:hidden" aria-label="Mobile">
        <div className="paper mx-auto grid max-w-lg grid-cols-5 rounded-xl px-1 py-1" style={{ background: '#fbf3e4' }}>
          {[NAV[0], NAV[1], NAV[2], NAV[3]].map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `flex min-h-[54px] flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-extrabold ${isActive ? 'bg-[var(--ink)] text-[#fbf3e6]' : 'text-[var(--ink-soft)]'}`}
            >
              <Icon size={21} />
              <span className="truncate">{label.replace('My ', '').replace('Daily ', '')}</span>
            </NavLink>
          ))}
          <button className="flex min-h-[54px] flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-extrabold text-[var(--ink-soft)]" onClick={() => setMenuOpen(true)}>
            <Menu size={21} />
            More
          </button>
        </div>
      </nav>

      {/* Menu sheet (mobile / tablet) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[rgba(60,44,33,0.45)] lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="paper anim-pop absolute inset-x-2 bottom-2 rounded-xl p-5 sm:inset-x-auto sm:right-4 sm:top-4 sm:bottom-auto sm:w-80" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Menu">
            <span className="washi" />
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-2xl">Where to, love?</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[...NAV, { to: '/wall', label: 'Motivation Wall', icon: CalendarHeart }, { to: '/settings', label: 'Settings', icon: Settings }].map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `flex min-h-[52px] items-center gap-2 rounded-lg border-[1.5px] border-dashed px-3 font-extrabold ${isActive ? 'border-transparent bg-[var(--ink)] text-[#fbf3e6]' : 'border-[rgba(73,55,43,.25)]'}`}
                >
                  <Icon size={19} />
                  <span className="text-sm">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      <Toasts />
      <BadgePopup />
    </div>
  );
}
