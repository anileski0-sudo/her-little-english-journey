/*
 * Original hand-built SVG sticker illustrations (made for this project, no external assets,
 * so there are no copyright or loading issues). Every landmark is drawn with filled,
 * rounded shapes on a round "collectible travel sticker" disc. The white die-cut border and
 * paper shadow are added by the .sticker CSS class.
 */
import { ReactNode, useId } from 'react';

const C = {
  ink: '#49372B',
  dark: '#2F2A28',
  brown: '#8A5A3C',
  bronze: '#A8734F',
  bronzeDark: '#5E3B26',
  sand: '#DCC298',
  sandDark: '#B89A6E',
  stone: '#E4D3B4',
  cream: '#FFFDF8',
  creamShade: '#E8DFCF',
  rose: '#D9A6A0',
  roseDeep: '#C27C74',
  sage: '#9CA98E',
  sageDeep: '#6F8A6A',
  blue: '#9CB5C8',
  blueDeep: '#5F84A3',
  navy: '#3F5A75',
  mustard: '#D6B56C',
  mustardDeep: '#C0953F',
  terracotta: '#C9715A',
  teal: '#6E9E9A',
  slate: '#56656B',
  water: '#6F95B5',
  grass: '#8FA67F',
};

/** Round sticker backdrop. `back` is clipped to the disc, children may pop out of it. */
function Disc({ bg, back, children }: { bg: string; back?: ReactNode; children: ReactNode }) {
  const id = useId().replace(/:/g, '');
  return (
    <>
      <defs>
        <clipPath id={`c${id}`}>
          <circle cx="50" cy="50" r="47" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="47" fill={bg} />
      <g clipPath={`url(#c${id})`}>
        {back}
      </g>
      <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="2 3" />
      {children}
      {/* vinyl shine */}
      <path d="M15 36 A37 37 0 0 1 36 13" stroke="#fff" strokeOpacity=".55" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="10.5" r="1.6" fill="#fff" fillOpacity=".6" />
    </>
  );
}

const Ground = ({ y = 86, color = C.grass }: { y?: number; color?: string }) => (
  <path d={`M0 ${y} Q50 ${y - 6} 100 ${y} L100 100 L0 100 Z`} fill={color} />
);
const Water = ({ y = 78, color = C.water }: { y?: number; color?: string }) => (
  <>
    <rect x="0" y={y} width="100" height={100 - y} fill={color} />
    <path d={`M10 ${y + 6} q5 -3 10 0 t10 0 M50 ${y + 10} q5 -3 10 0 t10 0 M70 ${y + 4} q4 -2 8 0`} stroke="#fff" strokeOpacity=".6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </>
);

/* ------------------------------ Landmarks ------------------------------ */

const Eiffel = () => (
  <Disc bg="#CFE0EA" back={<><Ground y={86} /><circle cx="18" cy="84" r="6" fill={C.sageDeep} /><circle cx="84" cy="84" r="7" fill={C.sageDeep} /></>}>
    <path fill={C.bronze} d="M50 6 L52 10 L54 30 L57 30 L60 50 L64 50 L77 91 L63 91 Q50 66 37 91 L23 91 L36 50 L40 50 L43 30 L46 30 L48 10 Z" />
    <path fill="#C08A5E" d="M50 10 L48 10 L46 30 L43 30 L40 50 L36 50 L23 91 L37 91 Q43 79 50 76 Z" />
    <path d="M50 33.5 L53.6 40 L50 46.5 L46.4 40 Z" fill={C.bronzeDark} opacity=".75" />
    <path d="M40.5 56 L59.5 56 L50 66.5 Z" fill={C.bronzeDark} opacity=".7" />
    <path d="M38 72 L44 66 L44 78 Z M62 72 L56 66 L56 78 Z" fill={C.bronzeDark} opacity=".45" />
    <rect x="39" y="27.5" width="22" height="4.5" rx="1.5" fill={C.bronzeDark} />
    <rect x="32" y="48" width="36" height="5" rx="1.5" fill={C.bronzeDark} />
    <path d="M50 6 V1 L57 3 L50 5" fill={C.roseDeep} />
  </Disc>
);

const Liberty = () => (
  <Disc bg="#F3DDB3" back={<Water y={82} />}>
    <path d="M33 93 L36 71 L64 71 L67 93 Z" fill={C.sandDark} />
    <rect x="31" y="66" width="38" height="6" rx="1.5" fill="#9C7F57" />
    <path d="M41 66 L43 40 Q50 34 57 40 L60 66 Z" fill="#7FB3A3" />
    <path d="M50 37 Q57 38 57 40 L60 66 L51 66 Z" fill="#5E9585" />
    <path d="M54 41 L58 14 L62.5 15 L58.5 43 Z" fill="#7FB3A3" />
    <rect x="56" y="9" width="8" height="5.5" rx="1.5" fill={C.mustardDeep} />
    <path d="M60 1.5 Q66 6 62.5 9.5 L57.5 9.5 Q55 6 60 1.5 Z" fill="#F0A64A" />
    <circle cx="50" cy="33" r="5.2" fill="#7FB3A3" />
    <path d="M43 31 L45 23.5 L47 29 L50 21 L53 29 L55 23.5 L57 31 Z" fill="#5E9585" />
    <rect x="37.5" y="44" width="7.5" height="11" rx="1.2" fill="#5E9585" transform="rotate(-12 41 49)" />
  </Disc>
);

const Colosseum = () => {
  const arches: ReactNode[] = [];
  const rows: [number, number][] = [[42, 62], [57, 78], [72, 86]];
  rows.forEach(([y, max], r) => {
    for (let x = 14; x <= max; x += 9) arches.push(<rect key={`${r}-${x}`} x={x} y={y} width="6" height="9" rx="3" fill="#8C5E3C" />);
  });
  return (
    <Disc bg="#F6E1C6" back={<Ground y={88} />}>
      <path d="M10 85 L10 38 Q38 27 66 29 L70 29 L74 35 L80 37 L80 47 L91 51 L91 85 Z" fill="#DDAE7C" />
      <path d="M66 29 L70 29 L74 35 L80 37 L80 47 L91 51 L91 85 L70 85 Z" fill="#C99866" />
      <rect x="10" y="52.5" width="81" height="2.5" fill="#B8875A" />
      <rect x="10" y="67.5" width="81" height="2.5" fill="#B8875A" />
      {arches}
    </Disc>
  );
};

const SydneyOpera = () => (
  <Disc bg="#D9E7EF" back={<Water y={74} color="#7FA6C2" />}>
    <rect x="9" y="67" width="84" height="8" rx="1.5" fill="#C9A27A" />
    {[
      'M14 68 Q16 50 32 44 Q28 58 30 68 Z',
      'M27 68 Q29 34 54 25 Q45 46 49 68 Z',
      'M46 68 Q50 40 71 33 Q64 52 66 68 Z',
      'M63 68 Q67 48 84 43 Q79 58 81 68 Z',
    ].map((d, i) => (
      <g key={i}>
        <path d={d} fill={C.cream} stroke="#CDBFA6" strokeWidth="1.3" strokeLinejoin="round" />
      </g>
    ))}
    <path d="M31 66 Q34 46 50 32 M50 66 Q52 50 66 39 M67 66 Q70 54 80 47" stroke={C.creamShade} strokeWidth="2.2" fill="none" />
  </Disc>
);

const Sagrada = () => {
  const spire = (x: number, top: number, w: number) =>
    `M${x - w} 92 L${x - w} ${top + 22} Q${x - w} ${top + 4} ${x} ${top} Q${x + w} ${top + 4} ${x + w} ${top + 22} L${x + w} 92 Z`;
  const spires: [number, number, number, string, string][] = [
    [24, 30, 5, '#D1A777', C.rose],
    [37, 16, 6, '#C49563', C.mustard],
    [50, 9, 6.5, '#D1A777', C.sage],
    [63, 16, 6, '#C49563', C.blue],
    [76, 30, 5, '#D1A777', C.roseDeep],
  ];
  return (
    <Disc bg="#F2D9CF" back={<Ground y={92} color={C.sandDark} />}>
      {spires.map(([x, t, w, f, tip]) => (
        <g key={x}>
          <path d={spire(x, t, w)} fill={f} />
          {[t + 16, t + 26, t + 36].map((y) => (
            <ellipse key={y} cx={x} cy={y} rx={w * 0.35} ry="2.3" fill="#7D5A3C" />
          ))}
          <circle cx={x} cy={t - 2.5} r="3.2" fill={tip} />
        </g>
      ))}
      <rect x="13" y="68" width="74" height="24" rx="1" fill="#B8875A" />
      <path d="M42 92 L42 80 Q50 70 58 80 L58 92 Z" fill="#6E4F36" />
      <path d="M20 92 V82 Q24 77 28 82 V92 Z M72 92 V82 Q76 77 80 82 V92 Z" fill="#7D5A3C" />
    </Disc>
  );
};

const BigBen = () => (
  <Disc bg="#E3EDF2" back={<Ground y={90} />}>
    <rect x="40" y="44" width="20" height="50" fill="#D4B06A" />
    <rect x="50" y="44" width="10" height="50" fill="#BF974E" />
    <path d="M44 50 V90 M48 50 V90 M52 50 V90 M56 50 V90" stroke="#A8823D" strokeWidth="1" />
    <rect x="37" y="29" width="26" height="19" rx="1.5" fill="#C9A35C" />
    <circle cx="50" cy="38.5" r="8" fill={C.cream} stroke="#7A5A2E" strokeWidth="1.6" />
    <path d="M50 38.5 V33.5 M50 38.5 L54 40.5" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" />
    <rect x="40" y="19" width="20" height="10" fill="#BF974E" />
    <path d="M43 28 V23 Q44.5 21 46 23 V28 Z M49 28 V23 Q50 21 51 23 V28 Z M54 28 V23 Q55.5 21 57 23 V28 Z" fill="#6E4F36" />
    <path d="M38.5 19.5 L50 2 L61.5 19.5 Z" fill="#5E6E6A" />
    <path d="M50 2 L61.5 19.5 L50 19.5 Z" fill="#4C5A57" />
    <circle cx="50" cy="2.5" r="1.6" fill={C.mustard} />
  </Disc>
);

const TowerBridge = () => (
  <Disc bg="#D7E6EE" back={<Water y={76} />}>
    <path d="M1 48 Q14 64 24 61 M99 48 Q86 64 76 61" stroke="#7E9DB6" strokeWidth="3.4" fill="none" strokeLinecap="round" />
    <rect x="4" y="62" width="92" height="6" rx="1" fill={C.blueDeep} />
    {[24, 62].map((x) => (
      <g key={x}>
        <rect x={x} y="29" width="14" height="53" fill="#D8C29E" />
        <rect x={x + 7} y="29" width="7" height="53" fill="#C4AC85" />
        <path d={`M${x + 3} 82 V72 Q${x + 7} 66 ${x + 11} 72 V82 Z`} fill="#6E4F36" />
        <rect x={x + 4} y="44" width="2.5" height="7" rx="1" fill="#6E4F36" />
        <rect x={x + 8} y="44" width="2.5" height="7" rx="1" fill="#6E4F36" />
        <path d={`M${x - 2} 30 L${x + 7} 13 L${x + 16} 30 Z`} fill={C.blueDeep} />
        <path d={`M${x - 3} 31 L${x - 1} 22 L${x + 1} 31 Z M${x + 13} 31 L${x + 15} 22 L${x + 17} 31 Z`} fill={C.navy} />
        <circle cx={x + 7} cy="12.5" r="1.4" fill={C.mustard} />
      </g>
    ))}
    <rect x="38" y="33" width="24" height="7" rx="1" fill="#7E9DB6" />
    {[41, 46, 51, 56].map((x) => (
      <rect key={x} x={x} y="35" width="3" height="3" rx=".5" fill={C.cream} />
    ))}
  </Disc>
);

const NotreDame = () => (
  <Disc bg="#F3E6D0" back={<Ground y={92} color={C.sandDark} />}>
    <path d="M48.5 38 L50 4 L51.5 38 Z" fill="#6B6F6A" />
    <rect x="18" y="62" width="64" height="30" fill="#D9C29E" />
    <rect x="20" y="20" width="20" height="44" fill="#D9C29E" />
    <rect x="60" y="20" width="20" height="44" fill="#D9C29E" />
    <rect x="31" y="20" width="9" height="44" fill="#C9B08A" />
    <rect x="71" y="20" width="9" height="44" fill="#C9B08A" />
    <rect x="40" y="36" width="20" height="28" fill="#CDB48C" />
    {[20, 60].map((x) => (
      <g key={x}>
        {[0, 4, 8, 12, 16].map((o) => (
          <rect key={o} x={x + o} y="17" width="2.5" height="3.5" fill="#C9B08A" />
        ))}
        <path d={`M${x + 4} 44 V30 Q${x + 6} 26 ${x + 8} 30 V44 Z M${x + 12} 44 V30 Q${x + 14} 26 ${x + 16} 30 V44 Z`} fill="#6E4F36" />
      </g>
    ))}
    <circle cx="50" cy="48" r="8.5" fill={C.roseDeep} />
    <circle cx="50" cy="48" r="5" fill={C.blue} />
    <circle cx="50" cy="48" r="2" fill={C.mustard} />
    <rect x="18" y="60" width="64" height="3" fill={C.sandDark} />
    {[25, 44, 63].map((x, i) => (
      <path key={x} d={`M${x} 92 V77 Q${x + (i === 1 ? 6 : 6)} ${i === 1 ? 66 : 68} ${x + 12} 77 V92 Z`} fill="#6E4F36" />
    ))}
  </Disc>
);

const ArcTriomphe = () => (
  <Disc bg="#F0E2C6" back={<Ground y={92} color={C.sandDark} />}>
    <rect x="18" y="26" width="64" height="66" fill="#DCC298" />
    <rect x="50" y="26" width="32" height="66" fill="#CDB184" />
    <rect x="16" y="18" width="68" height="11" fill="#C9AD80" />
    <rect x="14" y="28" width="72" height="3.5" fill={C.sandDark} />
    <path d="M38 92 V55 Q50 38 62 55 V92 Z" fill="#6E4F36" />
    <rect x="22" y="50" width="12" height="17" rx="1" fill="#C2A574" />
    <rect x="66" y="50" width="12" height="17" rx="1" fill="#B7996A" />
    <rect x="22" y="73" width="12" height="14" rx="1" fill="#C2A574" />
    <rect x="66" y="73" width="12" height="14" rx="1" fill="#B7996A" />
    <path d="M50 18 V5" stroke={C.ink} strokeWidth="1.3" />
    <rect x="50" y="5" width="3.3" height="6.5" fill={C.navy} />
    <rect x="53.3" y="5" width="3.3" height="6.5" fill={C.cream} />
    <rect x="56.6" y="5" width="3.3" height="6.5" fill={C.terracotta} />
  </Disc>
);

const Santorini = () => (
  <Disc
    bg="#CFE3F0"
    back={
      <>
        <rect x="0" y="74" width="100" height="26" fill="#4F86B5" />
        <path d="M14 82 q5 -3 10 0 M60 88 q6 -3 12 0" stroke="#fff" strokeOpacity=".6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M0 76 Q30 66 60 72 Q80 66 100 70 L100 80 L0 80 Z" fill="#E9DCC6" />
      </>
    }
  >
    {[
      [12, 56, 18, 20],
      [29, 47, 22, 29],
      [50, 60, 18, 16],
      [66, 53, 22, 23],
    ].map(([x, y, w, h], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} rx="1.5" fill={C.cream} />
        <rect x={x + w * 0.62} y={y} width={w * 0.38} height={h} fill="#ECE6DC" />
        <rect x={x + w * 0.2} y={y + h - 9} width="5" height="9" rx="2.5" fill="#3F6FA8" />
        <rect x={x + w * 0.62} y={y + 4} width="4" height="4" rx="1" fill="#3F6FA8" />
      </g>
    ))}
    <path d="M30 47.5 A10.5 10.5 0 0 1 51 47.5 Z" fill="#3F6FA8" />
    <path d="M40.5 37 V31 M38.3 33.3 H42.7" stroke={C.cream} strokeWidth="1.5" strokeLinecap="round" />
    <rect x="70" y="35" width="10" height="18" rx="1" fill={C.cream} />
    <path d="M72.5 46 V40 Q75 37 77.5 40 V46 Z" fill="#3F6FA8" />
    <path d="M69.5 35.5 A5.5 5.5 0 0 1 80.5 35.5 Z" fill="#3F6FA8" />
    {[[24, 74], [27, 71], [63, 74], [66, 71], [60, 71]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="2.4" fill="#D96C9A" />
    ))}
  </Disc>
);

const Pisa = () => (
  <Disc bg="#E8EFD9" back={<Ground y={88} />}>
    <g transform="rotate(8 50 90)">
      <rect x="37" y="18" width="26" height="72" rx="2" fill="#F4EBD8" />
      <rect x="54" y="18" width="9" height="72" fill="#E0D2B5" />
      {[28, 38, 48, 58, 68, 78].map((y) => (
        <g key={y}>
          <rect x="35" y={y} width="30" height="2.2" fill="#CDBA95" />
          {[39, 45, 51, 57].map((x) => (
            <rect key={x} x={x} y={y + 3.5} width="3" height="5.5" rx="1.5" fill="#9C8763" />
          ))}
        </g>
      ))}
      <rect x="40" y="9" width="20" height="11" rx="2" fill="#F4EBD8" />
      <rect x="53" y="9" width="7" height="11" fill="#E0D2B5" />
      <rect x="43" y="12" width="3" height="5" rx="1.5" fill="#9C8763" />
      <rect x="49" y="12" width="3" height="5" rx="1.5" fill="#9C8763" />
    </g>
  </Disc>
);

const Brandenburg = () => (
  <Disc bg="#E9DFCC" back={<Ground y={92} color={C.sandDark} />}>
    <path d="M34 27 C34 19 38 17 40 19 C41 14.5 44 13.5 45 16.5 C46 13 49 13 50 16.5 C51 13 54 13 55 16.5 C56 13.5 59 14.5 60 19 C62 17 66 19 66 27 Z" fill="#6E9481" />
    <rect x="48.6" y="5" width="2.8" height="11" fill="#6E9481" />
    <circle cx="50" cy="5" r="2.2" fill="#6E9481" />
    <circle cx="55" cy="3.5" r="2.4" fill="none" stroke="#6E9481" strokeWidth="1.4" />
    <rect x="30" y="26" width="40" height="8" fill="#CDB48C" />
    <rect x="9" y="34" width="82" height="10" fill="#D6C19C" />
    <rect x="9" y="42" width="82" height="2" fill={C.sandDark} />
    {[13, 26, 39, 55, 68, 81].map((x) => (
      <g key={x}>
        <rect x={x} y="44" width="6" height="42" fill="#EBDBBB" />
        <rect x={x + 3.5} y="44" width="2.5" height="42" fill="#D2BE97" />
      </g>
    ))}
    <rect x="9" y="85" width="82" height="7" fill="#C9AD80" />
  </Disc>
);

const Amsterdam = () => {
  const house = (x: number, w: number, t: number, color: string, gable: 'step' | 'bell' | 'tri') => {
    const g =
      gable === 'step'
        ? `M${x} ${t + 10} L${x} ${t + 6} L${x + w * 0.2} ${t + 6} L${x + w * 0.2} ${t + 3} L${x + w * 0.35} ${t + 3} L${x + w * 0.35} ${t} L${x + w * 0.65} ${t} L${x + w * 0.65} ${t + 3} L${x + w * 0.8} ${t + 3} L${x + w * 0.8} ${t + 6} L${x + w} ${t + 6} L${x + w} ${t + 10} Z`
        : gable === 'bell'
          ? `M${x} ${t + 10} Q${x + w * 0.15} ${t + 8} ${x + w * 0.3} ${t + 4} Q${x + w * 0.5} ${t - 3} ${x + w * 0.7} ${t + 4} Q${x + w * 0.85} ${t + 8} ${x + w} ${t + 10} Z`
          : `M${x} ${t + 10} L${x + w / 2} ${t - 1} L${x + w} ${t + 10} Z`;
    const rows: number[] = [];
    for (let y = t + 14; y < 70; y += 10) rows.push(y);
    return (
      <g key={x}>
        <path d={g} fill={color} />
        <rect x={x} y={t + 10} width={w} height={80 - t - 10} fill={color} />
        {rows.map((y) => (
          <g key={y}>
            <rect x={x + w * 0.16} y={y} width={w * 0.26} height="6" rx=".8" fill={C.cream} />
            <rect x={x + w * 0.58} y={y} width={w * 0.26} height="6" rx=".8" fill={C.cream} />
          </g>
        ))}
        <rect x={x + w * 0.36} y="72" width={w * 0.28} height="8" rx="1" fill={C.ink} opacity=".8" />
      </g>
    );
  };
  return (
    <Disc bg="#F2DDD2" back={<Water y={79} />}>
      {house(13, 17, 30, C.terracotta, 'step')}
      {house(30, 19, 21, C.mustard, 'bell')}
      {house(49, 16, 32, C.teal, 'tri')}
      {house(65, 21, 26, C.brown, 'step')}
      <path d="M30 85 Q50 93 70 85 Z" fill={C.bronzeDark} />
      <rect x="47" y="80" width="2" height="6" fill={C.ink} />
    </Disc>
  );
};

const SwissAlps = () => (
  <Disc
    bg="#D6E6F2"
    back={
      <>
        <path d="M2 82 L30 30 L44 52 L60 17 L98 82 Z" fill="#7E93A8" />
        <path d="M60 17 L98 82 L72 82 L62 40 Z M30 30 L44 52 L38 60 Z" fill="#6A7F95" />
        <path d="M60 17 L51.5 33 L56 30.5 L60 35 L64 30.5 L68.5 33 Z" fill={C.cream} />
        <path d="M30 30 L23.5 42 L27.5 39.5 L31 43 L34 39.5 L37 43.5 Z" fill={C.cream} />
        <path d="M0 78 Q30 66 60 76 Q80 70 100 74 L100 100 L0 100 Z" fill={C.grass} />
      </>
    }
  >
    <rect x="62" y="70" width="17" height="13" fill={C.bronze} />
    <path d="M58 72 L70.5 61 L83 72 Z" fill={C.terracotta} />
    <rect x="68" y="74" width="5" height="9" rx="1" fill={C.bronzeDark} />
    <path d="M24 82 V58" stroke={C.ink} strokeWidth="1.3" />
    <rect x="24" y="58" width="12" height="10" rx="1" fill="#D8433B" />
    <path d="M30 60.5 V65.5 M27.5 63 H32.5" stroke="#fff" strokeWidth="2" />
  </Disc>
);

const PragueClock = () => (
  <Disc bg="#EFE0D0" back={<Ground y={92} color={C.sandDark} />}>
    <rect x="37" y="30" width="26" height="64" fill="#D4BC96" />
    <rect x="54" y="30" width="9" height="64" fill="#BFA47A" />
    <path d="M35 31 L50 6 L65 31 Z" fill="#4F5B5E" />
    <path d="M50 6 L65 31 L50 31 Z" fill="#3E4A4D" />
    <path d="M32 32 L35 17 L38 32 Z M62 32 L65 17 L68 32 Z M44 31 L46.5 22 L49 31 Z M51 31 L53.5 22 L56 31 Z" fill="#4F5B5E" />
    <rect x="33" y="30" width="34" height="4" fill="#8A6E4E" />
    <path d="M42 46 V38 Q44 35 46 38 V46 Z M54 46 V38 Q56 35 58 38 V46 Z" fill="#6E4F36" />
    <circle cx="50" cy="63" r="11" fill={C.mustardDeep} />
    <circle cx="50" cy="63" r="9" fill={C.navy} />
    <circle cx="50" cy="63" r="5" fill={C.blue} />
    <circle cx="50" cy="63" r="9" fill="none" stroke={C.mustard} strokeWidth="1" strokeDasharray="1.5 2" />
    <path d="M50 63 L56 58" stroke={C.mustard} strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="50" cy="84" r="6" fill={C.mustardDeep} />
    <circle cx="50" cy="84" r="4.5" fill={C.cream} />
  </Disc>
);

const Budapest = () => (
  <Disc bg="#DCE6EE" back={<Water y={80} />}>
    <rect x="9" y="56" width="82" height="25" fill="#F2E6CF" />
    <rect x="9" y="72" width="82" height="9" fill="#E4D5B8" />
    {Array.from({ length: 10 }, (_, i) => 9 + i * 8.2).map((x) => (
      <path key={x} d={`M${x} 57 L${x + 4.1} 49 L${x + 8.2} 57 Z`} fill="#B5655A" />
    ))}
    {[20, 29, 71, 80].map((x) => (
      <path key={x} d={`M${x - 1.5} 57 V44 L${x} 38 L${x + 1.5} 44 V57 Z`} fill="#E4D5B8" />
    ))}
    <rect x="37" y="47" width="26" height="10" fill="#F2E6CF" />
    <path d="M36 48 Q36 30 50 28 Q64 30 64 48 Z" fill="#B5655A" />
    <path d="M50 28 Q64 30 64 48 L54 48 Q55 34 50 28 Z" fill="#9C5249" />
    <path d="M48.3 29 L50 11 L51.7 29 Z" fill="#B5655A" />
    {Array.from({ length: 12 }, (_, i) => 13 + i * 6.4).map((x) => (
      <rect key={x} x={x} y="61" width="2.6" height="6" rx="1.3" fill="#8C6A4E" />
    ))}
  </Disc>
);

const Venice = () => (
  <Disc
    bg="#F3E3C7"
    back={
      <>
        <path d="M2 64 L2 46 L14 46 Q50 22 86 46 L98 46 L98 64 Z" fill="#E2CDA8" />
        <path d="M30 64 Q50 46 70 64 Z" fill="#F3E3C7" />
        <rect x="14" y="40" width="10" height="7" fill="#CDB48C" />
        <rect x="76" y="40" width="10" height="7" fill="#CDB48C" />
        <Water y={63} />
      </>
    }
  >
    <path d="M6 69 Q20 85 50 85 Q80 85 92 66 L94 61 Q90 71 84 73 Q50 79 16 73 Z" fill={C.dark} />
    <path d="M88 68 L95 52 L97.5 53 L94 61 L97 61 L93 66 Z" fill="#E6E0D6" />
    <path d="M9 71 L5 64" stroke={C.dark} strokeWidth="2.5" strokeLinecap="round" />
    <rect x="24" y="58" width="3" height="14" fill={C.dark} />
    <rect x="29" y="58" width="3" height="14" fill={C.dark} />
    <rect x="22" y="43" width="12" height="16" rx="2" fill={C.cream} />
    {[45.5, 50.5, 55.5].map((y) => (
      <rect key={y} x="22" y={y} width="12" height="2.4" fill={C.navy} />
    ))}
    <circle cx="28" cy="38.5" r="4.3" fill="#E8B897" />
    <rect x="23.5" y="32.5" width="9" height="3.5" rx=".8" fill={C.mustard} />
    <rect x="23.5" y="34.6" width="9" height="1.2" fill={C.terracotta} />
    <ellipse cx="28" cy="36.3" rx="7" ry="1.6" fill={C.mustardDeep} />
    <path d="M33 46 L47 82" stroke={C.brown} strokeWidth="2.2" strokeLinecap="round" />
  </Disc>
);

const Buckingham = () => (
  <Disc bg="#E4E9F0" back={<Ground y={81} color="#CDB794" />}>
    <rect x="8" y="46" width="84" height="35" fill="#ECE0C8" />
    <rect x="8" y="44" width="84" height="3" fill="#D6C3A0" />
    <rect x="36" y="40" width="28" height="41" fill="#E2D3B5" />
    <path d="M34 41 L50 31 L66 41 Z" fill="#D6C3A0" />
    {[39, 45, 51, 57].map((x) => (
      <rect key={x} x={x} y="43" width="2.6" height="26" fill="#F6EEDD" />
    ))}
    {[12, 18, 24, 30, 68, 74, 80, 86].map((x) =>
      [52, 64].map((y) => <rect key={`${x}${y}`} x={x - 1} y={y} width="3.6" height="6" rx=".6" fill="#6E5A46" />),
    )}
    <rect x="46" y="72" width="8" height="9" rx="1" fill="#6E5A46" />
    <path d="M50 31 V14" stroke={C.ink} strokeWidth="1.2" />
    <rect x="50" y="14" width="14" height="9" fill={C.navy} />
    <path d="M50 14 L64 23 M64 14 L50 23" stroke="#fff" strokeWidth="2" />
    <path d="M57 14 V23 M50 18.5 H64" stroke="#fff" strokeWidth="3" />
    <path d="M57 14 V23 M50 18.5 H64" stroke="#C8443D" strokeWidth="1.6" />
    <ellipse cx="17" cy="73" rx="3.6" ry="6" fill={C.dark} />
    <rect x="14" y="78" width="6" height="9" rx="1" fill="#C8443D" />
    <rect x="14.5" y="86" width="5" height="7" fill={C.dark} />
  </Disc>
);

const Edinburgh = () => (
  <Disc bg="#DDE4EA" back={<path d="M2 96 L14 68 L30 60 L46 64 L60 56 L80 62 L98 96 Z" fill="#8D7B6A" />}>
    <path d="M60 56 L80 62 L98 96 L66 96 Z" fill="#76665A" />
    <path d="M10 82 q4 -3 8 0 M76 80 q4 -3 8 0" stroke={C.grass} strokeWidth="3" strokeLinecap="round" fill="none" />
    <rect x="22" y="44" width="56" height="17" fill="#B9A68C" />
    {[22, 28, 34, 40, 46, 52, 58, 64, 70].map((x) => (
      <rect key={x} x={x} y="41" width="3.6" height="4" fill="#B9A68C" />
    ))}
    <rect x="20" y="32" width="13" height="27" fill="#A8957B" />
    {[20, 24.5, 29].map((x) => (
      <rect key={x} x={x} y="29" width="3.4" height="4" fill="#A8957B" />
    ))}
    <rect x="58" y="28" width="17" height="20" fill="#C6B497" />
    <path d="M57 29 L66.5 20 L76 29 Z" fill="#6B6F6A" />
    {[25, 40, 48, 63, 69].map((x, i) => (
      <rect key={x} x={x} y={i === 0 ? 40 : i > 2 ? 34 : 50} width="3" height="5" rx="1.5" fill="#5A4A3C" />
    ))}
    <path d="M26.5 29 V17" stroke={C.ink} strokeWidth="1.2" />
    <rect x="26.5" y="17" width="12" height="8" fill="#3F6FA8" />
    <path d="M26.5 17 L38.5 25 M38.5 17 L26.5 25" stroke="#fff" strokeWidth="1.6" />
  </Disc>
);

const MontStMichel = () => (
  <Disc
    bg="#F0E4D2"
    back={
      <>
        <rect x="0" y="78" width="100" height="22" fill="#9CB5C8" />
        <path d="M0 86 Q50 80 100 88 L100 100 L0 100 Z" fill="#E2CDA0" />
      </>
    }
  >
    <path d="M12 82 Q28 58 42 52 L58 52 Q72 58 88 82 Z" fill="#B8A389" />
    {[
      [20, 68, 10, 8],
      [30, 60, 9, 9],
      [62, 60, 9, 9],
      [71, 67, 10, 8],
      [52, 66, 9, 8],
      [37, 68, 9, 7],
    ].map(([x, y, w, h], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} fill="#E4D3B4" />
        <path d={`M${x - 1} ${y + 0.5} L${x + w / 2} ${y - 4} L${x + w + 1} ${y + 0.5} Z`} fill="#5E6E6A" />
      </g>
    ))}
    <rect x="39" y="36" width="22" height="17" fill="#D8C7A8" />
    <path d="M38 37 L50 29 L62 37 Z" fill="#5E6E6A" />
    <path d="M48.4 33 L50 5 L51.6 33 Z" fill="#5E6E6A" />
    <circle cx="50" cy="5" r="1.9" fill={C.mustard} />
    <path d="M43 50 V43 Q44.5 41 46 43 V50 Z M54 50 V43 Q55.5 41 57 50 Z" fill="#6E5A46" />
    <rect x="14" y="76" width="72" height="7" fill="#A8957B" />
    {[14, 21, 28, 35, 42, 49, 56, 63, 70, 77].map((x) => (
      <rect key={x} x={x} y="73.5" width="4" height="3" fill="#A8957B" />
    ))}
  </Disc>
);

const ParkGuell = () => (
  <Disc bg="#F4E0D6" back={<Ground y={92} color={C.sandDark} />}>
    <rect x="72" y="30" width="11" height="62" fill={C.cream} />
    {Array.from({ length: 10 }, (_, i) => i).map((i) => (
      <rect key={i} x={i % 2 ? 77.5 : 72} y={32 + i * 6} width="5.5" height="6" fill={C.blueDeep} />
    ))}
    <path d="M77.5 30 V20 M73.5 24 H81.5" stroke={C.mustardDeep} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M26 92 V55 H72 V92 Z" fill="#C99A6A" />
    {[[32, 64], [44, 70], [58, 62], [64, 78], [34, 82]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="1.8" fill="#A87A4C" />
    ))}
    <path d="M20 57 Q25 35 49 29 Q73 35 78 57 Q66 50 49 52 Q32 50 20 57 Z" fill="#FBF0DC" />
    <path d="M24 50 Q36 42 49 44 Q62 42 74 50" stroke={C.brown} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <path d="M30 41 Q40 36 49 37 Q58 36 68 41" stroke={C.rose} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <rect x="46" y="20" width="6" height="10" rx="1" fill={C.cream} />
    <ellipse cx="49" cy="19" rx="8" ry="5" fill={C.terracotta} />
    <circle cx="46" cy="18" r="1.2" fill="#fff" />
    <circle cx="51" cy="16.5" r="1.1" fill="#fff" />
    <circle cx="53" cy="20" r="1" fill="#fff" />
    <path d="M36 92 V76 Q41 70 46 76 V92 Z" fill="#6E4F36" />
    <path d="M54 72 V64 Q57.5 60 61 64 V72 Z" fill="#6E4F36" />
    {[[30, 88, C.mustard], [52, 88, C.teal], [62, 86, C.rose], [68, 89, C.blueDeep]].map(([x, y, c], i) => (
      <rect key={i} x={x as number} y={y as number} width="4" height="3" rx="1" fill={c as string} />
    ))}
  </Disc>
);

const Acropolis = () => (
  <Disc
    bg="#CFE0EA"
    back={
      <>
        <path d="M0 92 Q18 70 38 67 L66 67 Q84 70 100 88 L100 100 L0 100 Z" fill="#B8A07A" />
        <circle cx="14" cy="86" r="6" fill={C.grass} />
        <circle cx="86" cy="84" r="7" fill={C.grass} />
        <circle cx="78" cy="90" r="5" fill={C.sageDeep} />
      </>
    }
  >
    <rect x="22" y="61" width="56" height="6" fill="#EFE4CC" />
    <rect x="25" y="57" width="50" height="4" fill="#E2D3B2" />
    {Array.from({ length: 8 }, (_, i) => 27 + i * 6.2).map((x) => (
      <g key={x}>
        <rect x={x} y="36" width="3.8" height="21" fill="#F7EEDB" />
        <rect x={x + 2.4} y="36" width="1.4" height="21" fill="#DCCDAE" />
      </g>
    ))}
    <rect x="23" y="30" width="54" height="6" fill="#EFE4CC" />
    <path d="M23 30 L50 19 L77 30 Z" fill="#E6D8BA" />
    <path d="M30 30 L50 22 L70 30 Z" fill="#D9C8A4" />
  </Disc>
);

const LisbonTram = () => (
  <Disc
    bg="#DDE8EE"
    back={
      <>
        <rect x="0" y="82" width="100" height="18" fill="#B8A389" />
        <path d="M0 86 H100 M0 90 H100" stroke="#8C7A62" strokeWidth="1.2" />
        <rect x="0" y="34" width="10" height="48" fill="#E9B8A6" />
        <rect x="90" y="40" width="10" height="42" fill="#A9C5B0" />
      </>
    }
  >
    <path d="M54 34 L74 10" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round" />
    <rect x="18" y="33" width="64" height="8" rx="3" fill="#B48A3E" />
    <rect x="13" y="39" width="74" height="38" rx="6" fill="#E6B84A" />
    <rect x="13" y="39" width="74" height="11" rx="6" fill="#FFF8E8" />
    <rect x="13" y="45" width="74" height="5" fill="#FFF8E8" />
    {[18, 31, 44, 57, 70].map((x) => (
      <g key={x}>
        <rect x={x} y="51" width="11" height="12" rx="1.5" fill="#4F6D8A" />
        <path d={`M${x + 2} 61 L${x + 7} 53`} stroke="#fff" strokeOpacity=".5" strokeWidth="1.4" />
      </g>
    ))}
    <rect x="13" y="67" width="74" height="3.5" fill={C.terracotta} />
    <rect x="40" y="41" width="20" height="7" rx="1" fill={C.dark} />
    <text x="50" y="46.6" textAnchor="middle" fontSize="6" fontWeight="800" fill="#fff" fontFamily="Nunito, sans-serif">28</text>
    <circle cx="28" cy="79" r="5" fill={C.dark} />
    <circle cx="72" cy="79" r="5" fill={C.dark} />
    <circle cx="28" cy="79" r="1.8" fill={C.mustard} />
    <circle cx="72" cy="79" r="1.8" fill={C.mustard} />
  </Disc>
);

const FlorenceDuomo = () => (
  <Disc bg="#F2E3D2" back={<Ground y={90} color={C.sandDark} />}>
    <rect x="15" y="22" width="14" height="68" fill="#F6EEDD" />
    {[30, 44, 58, 72].map((y) => (
      <g key={y}>
        <rect x="15" y={y} width="14" height="2.4" fill={C.sageDeep} />
        <rect x="18.5" y={y + 4.5} width="7" height="6" rx="1" fill={C.rose} />
      </g>
    ))}
    <rect x="13" y="19" width="18" height="4" fill="#E2D6BE" />
    <rect x="26" y="60" width="67" height="30" fill="#F6EEDD" />
    {[30, 40, 50, 76, 86].map((x) => (
      <rect key={x} x={x} y="62" width="2" height="28" fill={C.sageDeep} />
    ))}
    <rect x="26" y="72" width="67" height="2" fill={C.sageDeep} />
    <path d="M58 90 V78 Q62 73 66 78 V90 Z" fill="#6E4F36" />
    <rect x="43" y="44" width="36" height="17" fill="#F6EEDD" />
    {[49, 61, 73].map((x) => (
      <circle key={x} cx={x} cy="52.5" r="3" fill={C.sageDeep} />
    ))}
    <path d="M41 46 Q41 18 61 13 Q81 18 81 46 Z" fill="#C2694F" />
    <path d="M61 13 Q81 18 81 46 L68 46 Q68 24 61 13 Z" fill="#A9563F" />
    <path d="M61 13 Q51 22 49 46 M61 13 V46 M61 13 Q71 22 73 46" stroke="#F6EEDD" strokeWidth="1.7" fill="none" />
    <rect x="58" y="7" width="6" height="7" fill="#F6EEDD" />
    <path d="M58 7.5 L61 2.5 L64 7.5 Z" fill="#E2D6BE" />
    <circle cx="61" cy="2.3" r="1.3" fill={C.mustard} />
  </Disc>
);

/* ------------------------------ Little extras ------------------------------ */

const Book = () => (
  <>
    <path d="M10 30 Q30 20 50 30 Q70 20 90 30 L90 80 Q70 70 50 80 Q30 70 10 80 Z" fill={C.roseDeep} />
    <path d="M14 28 Q32 19 50 28 L50 76 Q32 67 14 76 Z" fill={C.cream} />
    <path d="M50 28 Q68 19 86 28 L86 76 Q68 67 50 76 Z" fill="#F3EADB" />
    <path d="M20 36 Q32 31 44 36 M20 44 Q32 39 44 44 M20 52 Q32 47 44 52 M56 36 Q68 31 80 36 M56 44 Q68 39 80 44" stroke={C.blue} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M66 22 V44 L70 40 L74 44 V22 Z" fill={C.mustard} />
  </>
);

const Books = () => (
  <>
    <rect x="16" y="66" width="68" height="14" rx="2.5" fill={C.blueDeep} />
    <rect x="16" y="70" width="68" height="3" fill={C.mustard} />
    <rect x="22" y="50" width="60" height="16" rx="2.5" fill={C.roseDeep} />
    <rect x="70" y="50" width="4" height="16" fill={C.cream} />
    <rect x="14" y="36" width="62" height="14" rx="2.5" fill={C.sageDeep} />
    <rect x="22" y="41" width="30" height="4" rx="2" fill={C.cream} />
    <path d="M60 36 L64 18 Q72 14 80 22 L74 38 Z" fill={C.mustard} />
    <circle cx="70" cy="24" r="3" fill={C.cream} />
  </>
);

const Plane = () => (
  <>
    <path d="M6 70 Q20 62 30 66" stroke="#A98462" strokeWidth="2.4" strokeDasharray="3 4" fill="none" strokeLinecap="round" />
    <path d="M22 54 Q24 44 40 44 L78 44 Q92 46 94 52 Q92 58 78 60 L40 60 Q24 60 22 54 Z" fill={C.cream} />
    <path d="M78 44 Q92 46 94 52 L80 52 Z" fill={C.blue} />
    <path d="M44 50 L60 50 L48 76 L40 76 Z" fill={C.blueDeep} />
    <path d="M46 46 L58 46 L50 28 L44 28 Z" fill={C.blueDeep} />
    <path d="M24 52 L18 36 L26 36 L34 48 Z" fill={C.roseDeep} />
    {[50, 58, 66, 74].map((x) => (
      <circle key={x} cx={x} cy="51" r="2.2" fill={C.navy} />
    ))}
  </>
);

const Flowers = () => (
  <>
    <path d="M50 90 Q48 66 34 50 M50 90 Q52 66 66 50 M50 90 V46" stroke={C.sageDeep} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M50 88 Q30 82 26 68 Q42 70 50 88 Z M50 88 Q70 82 74 68 Q58 70 50 88 Z" fill={C.sage} />
    <path d="M26 50 Q24 34 30 30 L34 36 L38 30 Q44 34 42 50 Q34 56 26 50 Z" fill={C.roseDeep} />
    <path d="M42 46 Q40 28 46 24 L50 30 L54 24 Q60 28 58 46 Q50 52 42 46 Z" fill={C.mustard} />
    <path d="M58 50 Q56 34 62 30 L66 36 L70 30 Q76 34 74 50 Q66 56 58 50 Z" fill={C.rose} />
  </>
);

const Star = () => (
  <path d="M50 8 L61 36 L91 38 L68 57 L76 87 L50 70 L24 87 L32 57 L9 38 L39 36 Z" fill={C.mustard} stroke={C.mustardDeep} strokeWidth="3" strokeLinejoin="round" />
);

const Heart = () => (
  <>
    <path d="M50 86 C20 66 8 50 12 32 C16 16 38 12 50 30 C62 12 84 16 88 32 C92 50 80 66 50 86 Z" fill={C.roseDeep} />
    <path d="M26 30 Q30 22 38 24" stroke="#fff" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round" fill="none" />
  </>
);

const Coffee = () => (
  <>
    <path d="M38 30 Q32 22 38 14 M50 30 Q44 22 50 14 M62 30 Q56 22 62 14" stroke={C.rose} strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="48" cy="82" rx="36" ry="7" fill={C.creamShade} />
    <path d="M20 38 H76 L70 76 Q48 84 26 76 Z" fill={C.cream} />
    <path d="M76 44 Q92 44 90 56 Q88 66 72 66" stroke={C.cream} strokeWidth="6" fill="none" />
    <ellipse cx="48" cy="39" rx="28" ry="5" fill={C.brown} />
    <path d="M40 58 C34 52 36 46 42 48 C44 44 50 46 48 52 Z" fill={C.roseDeep} transform="translate(4 2)" />
  </>
);

const Clock = () => (
  <>
    <circle cx="28" cy="22" r="10" fill={C.mustard} />
    <circle cx="72" cy="22" r="10" fill={C.mustard} />
    <path d="M30 88 L36 78 M70 88 L64 78" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="54" r="34" fill={C.blueDeep} />
    <circle cx="50" cy="54" r="27" fill={C.cream} />
    <path d="M50 54 V36 M50 54 L62 60" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="54" r="3" fill={C.roseDeep} />
  </>
);

const Pencil = () => (
  <g transform="rotate(-35 50 50)">
    <rect x="20" y="40" width="54" height="20" fill={C.mustard} />
    <rect x="20" y="46" width="54" height="8" fill={C.mustardDeep} />
    <rect x="12" y="40" width="10" height="20" rx="3" fill={C.rose} />
    <rect x="20" y="40" width="4" height="20" fill="#B8B4AC" />
    <path d="M74 40 L92 50 L74 60 Z" fill="#EBD3AE" />
    <path d="M86 46.7 L92 50 L86 53.3 Z" fill={C.ink} />
  </g>
);

const Suitcase = () => (
  <>
    <path d="M38 26 V18 Q38 14 42 14 H58 Q62 14 62 18 V26" stroke={C.bronzeDark} strokeWidth="5" fill="none" />
    <rect x="12" y="26" width="76" height="56" rx="8" fill={C.bronze} />
    <rect x="30" y="26" width="5" height="56" fill={C.bronzeDark} />
    <rect x="65" y="26" width="5" height="56" fill={C.bronzeDark} />
    <circle cx="48" cy="48" r="9" fill={C.blue} />
    <rect x="40" y="62" width="20" height="10" rx="3" fill={C.rose} transform="rotate(-8 50 67)" />
    <path d="M76 38 L80 46 L72 46 Z" fill={C.mustard} />
  </>
);

const Envelope = () => (
  <>
    <rect x="10" y="26" width="80" height="54" rx="4" fill={C.cream} />
    <path d="M10 30 L50 58 L90 30" stroke={C.creamShade} strokeWidth="4" fill="none" />
    <path d="M10 30 L50 58 L90 30 V26 H10 Z" fill="#F0E4CF" />
    <path d="M50 66 C42 60 40 54 44 51 C47 49 50 51 50 54 C50 51 53 49 56 51 C60 54 58 60 50 66 Z" fill={C.roseDeep} />
  </>
);


/* ------------------------------ Registry ------------------------------ */

export interface StickerDef {
  name: string;
  place: string;
  draw: () => JSX.Element;
}

export const LANDMARKS: Record<string, StickerDef> = {
  eiffel: { name: 'Eiffel Tower', place: 'Paris', draw: Eiffel },
  liberty: { name: 'Statue of Liberty', place: 'New York', draw: Liberty },
  colosseum: { name: 'Colosseum', place: 'Rome', draw: Colosseum },
  sydney: { name: 'Sydney Opera House', place: 'Sydney', draw: SydneyOpera },
  sagrada: { name: 'La Sagrada Família', place: 'Barcelona', draw: Sagrada },
  bigben: { name: 'Big Ben', place: 'London', draw: BigBen },
  towerbridge: { name: 'Tower Bridge', place: 'London', draw: TowerBridge },
  notredame: { name: 'Notre-Dame', place: 'Paris', draw: NotreDame },
  arc: { name: 'Arc de Triomphe', place: 'Paris', draw: ArcTriomphe },
  santorini: { name: 'Santorini', place: 'Greece', draw: Santorini },
  pisa: { name: 'Leaning Tower', place: 'Pisa', draw: Pisa },
  brandenburg: { name: 'Brandenburg Gate', place: 'Berlin', draw: Brandenburg },
  amsterdam: { name: 'Canal Houses', place: 'Amsterdam', draw: Amsterdam },
  alps: { name: 'Swiss Alps', place: 'Switzerland', draw: SwissAlps },
  prague: { name: 'Clock Tower', place: 'Prague', draw: PragueClock },
  budapest: { name: 'Parliament', place: 'Budapest', draw: Budapest },
  venice: { name: 'Gondola', place: 'Venice', draw: Venice },
  buckingham: { name: 'Buckingham Palace', place: 'London', draw: Buckingham },
  edinburgh: { name: 'Edinburgh Castle', place: 'Scotland', draw: Edinburgh },
  montstmichel: { name: 'Mont Saint-Michel', place: 'Normandy', draw: MontStMichel },
  parkguell: { name: 'Park Güell', place: 'Barcelona', draw: ParkGuell },
  acropolis: { name: 'Acropolis', place: 'Athens', draw: Acropolis },
  tram: { name: 'Tram 28', place: 'Lisbon', draw: LisbonTram },
  duomo: { name: 'Il Duomo', place: 'Florence', draw: FlorenceDuomo },
};

export const EXTRAS: Record<string, StickerDef> = {
  book: { name: 'Book', place: '', draw: Book },
  books: { name: 'Books', place: '', draw: Books },
  plane: { name: 'Plane', place: '', draw: Plane },
  flowers: { name: 'Flowers', place: '', draw: Flowers },
  star: { name: 'Star', place: '', draw: Star },
  heart: { name: 'Heart', place: '', draw: Heart },
  coffee: { name: 'Coffee', place: '', draw: Coffee },
  clock: { name: 'Clock', place: '', draw: Clock },
  pencil: { name: 'Pencil', place: '', draw: Pencil },
  suitcase: { name: 'Suitcase', place: '', draw: Suitcase },
  envelope: { name: 'Love letter', place: '', draw: Envelope },
};

export const LANDMARK_IDS = Object.keys(LANDMARKS);
