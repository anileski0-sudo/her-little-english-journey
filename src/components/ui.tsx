import { CSSProperties, ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Sticker from '../stickers/Sticker';

type Tape = 'rose' | 'sage' | 'blue' | 'mustard' | 'kraft';
type TapePos = 'center' | 'left' | 'right' | 'corners';

export function Paper({
  children,
  className = '',
  tape,
  tapePos = 'center',
  tilt,
  as: Tag = 'section',
  clip = false,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  tape?: Tape;
  tapePos?: TapePos;
  tilt?: 'l' | 'r' | 'l2' | 'r2';
  as?: 'section' | 'div' | 'article' | 'li';
  clip?: boolean;
} & Record<string, unknown>) {
  const tapeClass = tape && tape !== 'rose' ? `washi-${tape}` : '';
  return (
    <Tag className={`paper ${tilt ? `tilt-${tilt}` : ''} ${className}`} {...rest}>
      {tape && tapePos === 'corners' ? (
        <>
          <span className={`washi washi-corner-l ${tapeClass}`} />
          <span className={`washi washi-corner-r ${tapeClass}`} />
        </>
      ) : tape ? (
        <span className={`washi ${tapePos !== 'center' ? `washi-${tapePos}` : ''} ${tapeClass}`} />
      ) : null}
      {clip && <span className="clip" style={{ left: 22 }} />}
      {children}
    </Tag>
  );
}

export function ProgressBar({ value, color, label }: { value: number; color?: string; label?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="bar" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${v}%`, ['--bar' as string]: color }} />
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  subtitle,
  stickers = [],
  children,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  stickers?: { id: string; rotate?: number }[];
  children?: ReactNode;
}) {
  return (
    <header className="relative mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between anim-pop">
      <div className="min-w-0">
        {kicker && <span className="luggage-tag mb-3">{kicker}</span>}
        <div className="block">
          <div className="title-label">
            <h1 className="font-display text-[2.4rem] leading-tight sm:text-[3.4rem]">{title}</h1>
          </div>
        </div>
        {subtitle && <p className="font-hand mt-2 pl-2 text-2xl text-[var(--ink-soft)] sm:text-[1.7rem]">{subtitle}</p>}
        {children}
      </div>
      {stickers.length > 0 && (
        <div className="flex shrink-0 items-end gap-4 self-end sm:self-auto sm:pr-2">
          {stickers.map((s, i) => (
            <Sticker
              key={s.id}
              id={s.id}
              size={i === 0 ? 'clamp(96px, 11vw, 142px)' : 'clamp(78px, 8.5vw, 112px)'}
              rotate={s.rotate ?? (i % 2 ? 8 : -6)}
              className="anim-float"
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          ))}
        </div>
      )}
    </header>
  );
}

export function EmptyState({ sticker, title, text, action }: { sticker: string; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <Sticker id={sticker} size={110} rotate={-5} />
      <h3 className="font-display mt-5 text-2xl">{title}</h3>
      <p className="mt-1 max-w-md text-[var(--ink-soft)]">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => ref.current?.querySelector<HTMLElement>('input,textarea,select,button')?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(60,44,33,0.45)] p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`paper anim-pop max-h-[92vh] w-full overflow-y-auto rounded-t-xl p-5 sm:rounded-sm sm:p-7 ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'}`}
      >
        <span className="washi washi-mustard" />
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
          <button className="btn btn-ghost btn-icon -mr-2 -mt-1" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel,
  onConfirm,
  onClose,
  danger = false,
}: {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-[var(--ink-soft)]">{text}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button className="btn btn-paper" onClick={onClose}>
          Cancel
        </button>
        <button
          className={`btn ${danger ? 'btn-ink' : 'btn-rose'}`}
          style={danger ? { background: '#9C4A3F', boxShadow: '0 3px 0 #6E3029' } : undefined}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

/** Vintage notebook bar chart drawn in SVG from real values. */
export function BarChart({
  values,
  labels,
  color = 'var(--accent)',
  unit = '',
  highlightLast = true,
  height = 160,
  format = (v: number) => String(v),
}: {
  values: number[];
  labels: string[];
  color?: string;
  unit?: string;
  highlightLast?: boolean;
  height?: number;
  format?: (v: number) => string;
}) {
  const max = Math.max(1, ...values);
  const n = values.length;
  const W = 100 * n;
  const H = 100;
  const total = values.reduce((a, b) => a + b, 0);
  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H + 34}`} width="100%" height={height} preserveAspectRatio="none" role="img" aria-label={`Chart: ${labels.map((l, i) => `${l} ${format(values[i])}${unit}`).join(', ')}`}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="0" x2={W} y1={H - f * H * 0.82 + 4} y2={H - f * H * 0.82 + 4} stroke="rgba(95,132,163,.25)" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
        ))}
        <line x1="0" x2={W} y1={H + 4} y2={H + 4} stroke="#49372B" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {values.map((v, i) => {
          const h = (v / max) * H * 0.82;
          const x = i * 100 + 22;
          const isLast = highlightLast && i === n - 1;
          return (
            <g key={i}>
              {v > 0 && <rect x={x} y={H + 4 - h} width="56" height={h} rx="6" fill={isLast ? 'var(--accent-deep)' : color} opacity={isLast ? 1 : 0.88} />}
              {v > 0 && <rect x={x + 6} y={H + 4 - h + 6} width="8" height={Math.max(0, h - 12)} rx="4" fill="#fff" opacity=".28" />}
              {v === 0 && <rect x={x} y={H + 1} width="56" height="3" rx="1.5" fill="rgba(73,55,43,.25)" />}
            </g>
          );
        })}
      </svg>
      <div className="mt-1 grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {labels.map((l, i) => (
          <div key={i} className="text-center leading-tight">
            <div className="font-hand text-lg">{l}</div>
            <div className="text-[11px] font-bold text-[var(--ink-soft)]">{values[i] > 0 ? `${format(values[i])}${unit}` : '–'}</div>
          </div>
        ))}
      </div>
      {total === 0 && <figcaption className="font-hand mt-2 text-center text-lg text-[var(--ink-soft)]">No entries yet — your bars will grow here ♡</figcaption>}
    </figure>
  );
}

export function TravelStrip({ ids }: { ids: string[] }) {
  return (
    <div className="souvenir-shelf mt-20 pt-6" aria-hidden>
      <p className="font-hand mb-6 text-center text-2xl text-[var(--ink-soft)]">✈ little places on today's page</p>
      <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-10 pb-4 sm:gap-x-12">
        {ids.map((id, i) => (
          <Sticker key={id} id={id} size={i % 2 ? 'clamp(92px, 9vw, 126px)' : 'clamp(104px, 11vw, 148px)'} rotate={[-7, 5, -3, 8, -5, 4][i % 6]} label />
        ))}
      </div>
    </div>
  );
}

/** Round ink postmark, like on a posted letter. */
export function Postmark({ text = 'HER LITTLE ENGLISH JOURNEY', center = '2026', size = 110, className = '', style }: { text?: string; center?: string; size?: number; className?: string; style?: CSSProperties }) {
  const id = `pm-${text.length}-${center}`.replace(/\W/g, '');
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={`postmark ${className}`} style={style} aria-hidden>
      <defs>
        <path id={id} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="2" />
      <text fontSize="10.5" fontWeight="800" letterSpacing="2.4" fill="currentColor" fontFamily="Nunito, sans-serif">
        <textPath href={`#${id}`}>{text} ·</textPath>
      </text>
      <text x="60" y="66" textAnchor="middle" fontSize="17" fontWeight="800" fill="currentColor" fontFamily="'DM Serif Display', serif">{center}</text>
    </svg>
  );
}

/** A perforated postage stamp holding one statistic. */
export function StampStat({ icon, label, value, color, rotate = 0, delay = 0 }: { icon: ReactNode; label: string; value: ReactNode; color: string; rotate?: number; delay?: number }) {
  return (
    <div className="stamp-wrap anim-pop" style={{ transform: `rotate(${rotate}deg)`, animationDelay: `${delay}s` }}>
      <div className="stamp-color">
        <div className="stamp-inner relative px-4 pb-4 pt-3" style={{ backgroundColor: color }}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold uppercase leading-tight tracking-wider text-[#3c2a22]/80">{label}</span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[rgba(255,250,240,.65)]">{icon}</span>
          </div>
          <div className="font-display mt-1 text-4xl leading-none text-[#3c2a22]">{value}</div>
        </div>
      </div>
    </div>
  );
}
