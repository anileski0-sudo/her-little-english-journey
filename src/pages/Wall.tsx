import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { PageHeader, Paper, Postmark, TravelStrip } from '../components/ui';
import Sticker from '../stickers/Sticker';
import { pickMessage, WALL_MESSAGES } from '../lib/messages';

const NOTE_COLORS = ['#fdf3dc', '#f6e0da', '#e5ead9', '#e1e9ef', '#f7ead0', '#fbefe6'];
const PIN_COLORS = ['#c27c74', '#5f84a3', '#c0953f', '#6f8a6a'];
const TAPE_CLASSES = ['', 'washi-sage', 'washi-blue', 'washi-mustard', 'washi-kraft'];
const TILT_CLASSES = ['tilt-l', 'tilt-r', 'tilt-l2', 'tilt-r2', ''];

export default function Wall() {
  const [message, setMessage] = useState(() => pickMessage(WALL_MESSAGES));
  const [n, setN] = useState(0);

  return (
    <div>
      <PageHeader kicker="Just for you" title="Motivation Wall" subtitle="Little notes to keep in your pocket" stickers={[{ id: 'santorini' }, { id: 'heart' }]} />

      <section className="relative mx-auto mb-16 max-w-3xl pt-4">
        <Sticker id="flowers" size={92} rotate={-10} className="absolute -left-4 -top-8 z-10 sm:-left-14" />
        <Paper key={n} tape="rose" tapePos="corners" tilt="l" className="anim-pop torn-bottom note-lined px-6 pb-16 pt-12 text-center sm:px-14" style={{ background: '#fffaf0' }}>
          <p className="font-hand text-4xl leading-tight sm:text-5xl" aria-live="polite">“{message}”</p>
          <p className="mt-4 font-semibold text-[var(--ink-soft)]">— with love ♡</p>
          <Postmark text="SENT WITH LOVE · ALWAYS ·" center="♡" size={88} className="absolute bottom-3 right-4 hidden rotate-[-12deg] opacity-70 sm:block" />
        </Paper>
        <div className="mt-6 flex justify-center">
          <button
            className="btn btn-rose"
            onClick={() => {
              setMessage(pickMessage(WALL_MESSAGES));
              setN((x) => x + 1);
            }}
          >
            <Shuffle size={18} /> New motivation note
          </button>
        </div>
      </section>

      <ul className="columns-1 gap-7 sm:columns-2 lg:columns-3">
        {WALL_MESSAGES.map((m, i) => {
          const kind = i % 3; // 0 lined, 1 grid, 2 plain
          const pinned = i % 4 === 1 || i % 4 === 3;
          return (
            <li key={m} className="mb-9 break-inside-avoid pt-4">
              <div
                className={`paper relative px-6 pb-7 pt-8 ${kind === 0 ? 'note-lined' : kind === 1 ? 'note-grid' : ''} ${i % 5 === 2 ? 'note-fold' : ''} ${TILT_CLASSES[i % 5]}`}
                style={{ background: NOTE_COLORS[i % NOTE_COLORS.length] }}
              >
                {pinned ? (
                  <span className="pin" style={{ ['--pin' as string]: PIN_COLORS[i % 4] }} />
                ) : (
                  <span className={`washi ${i % 2 ? 'washi-left' : ''} ${TAPE_CLASSES[i % 5]}`} />
                )}
                <p className="font-hand text-[1.85rem] leading-[34px]">{m}</p>
                <p className="font-hand mt-2 text-right text-xl text-[var(--accent-deep)]">♡</p>
              </div>
            </li>
          );
        })}
      </ul>

      <TravelStrip ids={['venice', 'eiffel', 'amsterdam']} />
    </div>
  );
}
