import React from 'react';
import { interpolate, interpolateColors } from 'remotion';
import { FONDU_PLANS } from '../moteur/frise';
import { Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F, PoliceF } from '../theme';
import { LIBELLES } from './libelles';
import { OUVERTURE } from './textes.gen';

const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const teinte = (t: number, a: string, b: string) => interpolateColors(t, [0, 1], [a, b]);

type Pt = readonly [number, number];
const bezier = (c: readonly [Pt, Pt, Pt, Pt], t: number): Pt => {
  const u = 1 - t;
  const m = (i: 0 | 1) => u ** 3 * c[0][i] + 3 * u * u * t * c[1][i] + 3 * u * t * t * c[2][i] + t ** 3 * c[3][i];
  return [m(0), m(1)];
};
/** Polyligne d'une courbe, de son début jusqu'à la fraction t. */
const trace = (c: readonly [Pt, Pt, Pt, Pt], t: number) =>
  Array.from({ length: 41 }, (_, i) => bezier(c, (i / 40) * t))
    .map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`)
    .join(' ');

/* ---------- Enveloppe (plans 1 et 2) ---------- */

/** Origine : milieu du bord haut. `children` : ce qui sort de l'enveloppe, glissé entre le fond et la poche. */
const Enveloppe: React.FC<{ id: string; w: number; h: number; ouvre: number; lueur?: number; children?: React.ReactNode }> = ({ id, w, h, ouvre, lueur = 0, children }) => {
  const pointe = h * 0.56 * Math.cos(Math.PI * ouvre);
  const rabat = `M${-w / 2} 0 L0 ${pointe} L${w / 2} 0 Z`;
  const rSceau = w * 0.082;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={-w * 2} y={-2000} width={w * 4} height={2000 + h - 2} />
        </clipPath>
      </defs>
      <rect x={-w / 2} y={0} width={w} height={h} rx={6} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {ouvre >= 0.5 ? <path d={rabat} fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" /> : null}
      <g clipPath={`url(#${id})`}>{children}</g>
      <path d={`M${-w / 2} 0 L0 ${h * 0.56} L${w / 2} 0 V${h} H${-w / 2} Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${-w / 2} ${h} L${-w * 0.09} ${h * 0.47} M${w / 2} ${h} L${w * 0.09} ${h * 0.47}`} fill="none" stroke={F.filet} strokeWidth={4} />
      {ouvre < 0.5 ? (
        <g>
          <path d={rabat} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={0} cy={pointe} r={rSceau * (1.5 + 0.55 * lueur)} fill={F.orClair} opacity={0.2 + 0.5 * lueur} />
          <circle cx={0} cy={pointe} r={rSceau} fill={F.argile} stroke={F.encre} strokeWidth={3} />
          <circle cx={0} cy={pointe} r={rSceau * 0.62} fill="none" stroke={F.orClair} strokeWidth={3} opacity={0.5 + 0.5 * lueur} />
        </g>
      ) : null}
    </g>
  );
};

const Ouverture: React.FC<PropsIllustration> = ({ f }) => {
  const leve = p(f, 30, 200);
  const y = 250 - 24 * leve + Math.sin(f / 20) * 5;
  const lueur = 0.5 + 0.5 * Math.sin(f / 13);
  const nom = p(f, 70, 94);
  return (
    <Scene>
      <ellipse cx={400} cy={665} rx={270 - 40 * leve} ry={15} fill={F.filet} opacity={0.85 - 0.3 * leve} />
      <g transform={`translate(400 ${y})`}>
        <Enveloppe id="ch16-env-o" w={540} h={360} ouvre={0} lueur={lueur} />
      </g>
      <Libelle x={400} y={770} taille={34} graisse={600} opacite={nom}>{OUVERTURE.auteur}</Libelle>
    </Scene>
  );
};

/** La feuille marquée « mission », et sa pièce au bout d'un fil. Origine : celle de l'enveloppe. */
const Feuille: React.FC<{ monte: number; r: number; balance: number; souligne: number }> = ({ monte, r, balance, souligne }) => {
  const haut = lerp(36, -250, monte);
  const cx = balance;
  const cy = haut - 34 - r;
  return (
    <g>
      <rect x={-100} y={haut} width={200} height={290} rx={4} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <Libelle x={0} y={haut + 66} taille={36} graisse={600}>{LIBELLES.mission}</Libelle>
      {souligne > 0 ? <line x1={-68} x2={-68 + 136 * souligne} y1={haut + 80} y2={haut + 80} stroke={F.or} strokeWidth={5} strokeLinecap="round" /> : null}
      {[118, 148, 178, 208].map((dy) => (
        <line key={dy} x1={-72} x2={72} y1={haut + dy} y2={haut + dy} stroke={F.filet} strokeWidth={4} />
      ))}
      <path d={`M0 ${haut + 12} Q${cx * 0.4} ${haut - 14} ${cx} ${cy + r - 2}`} fill="none" stroke={F.orFonce} strokeWidth={4} />
      <rect x={-12} y={haut - 4} width={24} height={20} rx={4} fill={F.or} stroke={F.encre} strokeWidth={3} />
      <Piece x={cx} y={cy} r={r} />
    </g>
  );
};

const AvecMission: React.FC<PropsIllustration> = ({ f, d }) => {
  const g = p(f, d[1] - 5, d[1] + 40);
  const souligne = p(f, d[1] + 190, d[1] + 240);
  return (
    <Scene>
      <g opacity={g} transform={`translate(${lerp(680, 590, g)} 540)`}>
        <Enveloppe id="ch16-env-b" w={300} h={200} ouvre={p(f, d[1] + 50, d[1] + 82)} lueur={0.5}>
          <Feuille monte={p(f, d[1] + 72, d[1] + 145)} r={28} balance={Math.sin(f / 21 + 1.4) * 8} souligne={souligne} />
        </Enveloppe>
      </g>
      <g transform={`translate(${lerp(400, 210, g)} ${lerp(500, 540, g)}) scale(${lerp(1.25, 1, g)})`}>
        <Enveloppe id="ch16-env-a" w={300} h={200} ouvre={p(f, d[0] - 16, d[0] + 18)} lueur={0.5}>
          <Feuille monte={p(f, d[0] + 8, d[0] + 82)} r={38} balance={Math.sin(f / 18) * 8} souligne={souligne} />
        </Enveloppe>
      </g>
    </Scene>
  );
};

/* ---------- Plan 3 : Nabal et David ---------- */

const Bulle: React.FC<{ x: number; y: number; rx: number; o: number; sens: number }> = ({ x, y, rx, o, sens }) => {
  const ry = rx * 0.68;
  return (
    <g opacity={o} transform={`translate(${x} ${y})`}>
      <path d={`M${sens * rx * 0.1} ${ry * 0.82} L${sens * rx * 0.42} ${ry * 1.5} L${sens * rx * 0.55} ${ry * 0.68} Z`} fill={F.papier} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      <ellipse rx={rx} ry={ry} fill={F.papier} stroke={F.encre} strokeWidth={3} />
      <path d={`M${sens * rx * 0.14} ${ry * 0.72} L${sens * rx * 0.46} ${ry * 0.6}`} stroke={F.papier} strokeWidth={6} />
    </g>
  );
};

const Note: React.FC<{ x: number; y: number; o: number; s: number }> = ({ x, y, o, s }) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={16} ry={11.5} transform="rotate(-22)" fill={F.orFonce} stroke={F.encre} strokeWidth={2} />
    <line x1={14} y1={-4} x2={14} y2={-62} stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
    <path d="M14 -62 C18 -46 36 -42 30 -20" fill="none" stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
  </g>
);

const NabalDavid: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const pale = p(f, d[1] + 60, d[1] + 200);
  const glisse = p(f, d[2] - 25, d[2] + 20);
  const droite = p(f, d[2] - 5, d[2] + 35);
  const dx = 205 * (1 - glisse);
  const corps = teinte(pale, F.cuir, F.filet);
  const col = teinte(pale, F.cuirClair, F.papier);
  const trait = teinte(pale, F.encre, F.encre2);
  const bulles = Array.from({ length: Math.ceil((d[1] + 60 - d[0]) / 46) }, (_, i) => i);
  const notes = Array.from({ length: Math.ceil((duree - d[2]) / 38) }, (_, i) => i);
  const NX = [720, 640, 560];
  const NY = [680, 640, 600];
  return (
    <Scene>
      {bulles.map((i) => {
        const l = (f - d[0] - i * 46) / 130;
        if (l < 0 || l > 1) return null;
        const o = lin(l, 0, 0.1) * (1 - lin(l, 0.82, 1));
        return <Bulle key={i} x={195 + dx + ((i % 3) - 1) * 52 * l + Math.sin(f / 16 + i) * 10} y={lerp(375, 60, l)} rx={32 + (i % 3) * 9} o={o} sens={i % 2 ? 1 : -1} />;
      })}
      <g transform={`translate(${dx} 0)`}>
        <g transform={`translate(195 725) scale(${1 - 0.06 * pale} ${1 - 0.14 * pale}) translate(-195 -725)`}>
          <path d="M152 440 C50 530 40 722 195 726 C350 722 340 530 238 440 Z" fill={corps} stroke={trait} strokeWidth={5} />
          <path d="M150 392 Q172 410 195 396 Q218 410 240 392 L224 442 H166 Z" fill={col} stroke={trait} strokeWidth={4} strokeLinejoin="round" />
          <path d="M120 600 Q195 640 270 600" fill="none" stroke={teinte(pale, F.cuirClair, F.papier)} strokeWidth={4} strokeDasharray="12 10" />
          <rect x={150} y={432} width={90} height={20} rx={9} fill={F.orFonce} stroke={F.encre} strokeWidth={3} opacity={1 - 0.5 * pale} />
          <circle cx={195} cy={442} r={15} fill={F.orFonce} stroke={F.encre} strokeWidth={3} opacity={1 - 0.5 * pale} />
          <path d="M186 454 L168 490 M204 454 L222 490" stroke={F.orFonce} strokeWidth={7} strokeLinecap="round" opacity={1 - 0.5 * pale} />
        </g>
        <Libelle x={195} y={785} taille={30} graisse={600} couleur={trait}>{LIBELLES.nabal}</Libelle>
      </g>
      <g opacity={droite}>
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={420} x2={775} y1={600 + i * 20} y2={600 + i * 20} stroke={F.encre} strokeWidth={3} />
        ))}
        <line x1={420} x2={420} y1={600} y2={680} stroke={F.encre} strokeWidth={4} />
        <line x1={775} x2={775} y1={600} y2={680} stroke={F.encre} strokeWidth={4} />
        <path
          transform="translate(462 660)"
          d="M6 12 C-10 14 -16 -6 0 -12 C18 -16 24 12 4 20 C-22 28 -34 -6 -16 -30 C-4 -46 12 -62 10 -84 C9 -98 -2 -100 -6 -84 C-9 -70 0 -20 8 30 C12 52 -10 58 -14 42"
          fill="none"
          stroke={F.encre}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <Libelle x={597} y={785} taille={30} graisse={600}>{LIBELLES.david}</Libelle>
      </g>
      {notes.map((i) => {
        const l = (f - d[2] - 20 - i * 38) / 260;
        if (l < 0 || l > 1) return null;
        const xFin = NX[i % NX.length];
        const yBase = NY[i % NY.length];
        const entre = lin(l, 0, 0.25);
        const change = lin(l, 0.25, 0.35);
        const monte = lin(l, 0.35, 1);
        const x = lerp(505, xFin, entre) + Math.sin(f / 15 + i) * 8 * monte;
        const y = lerp(yBase, 110, monte);
        return (
          <g key={i}>
            {change < 1 ? <Piece x={x} y={yBase} r={17 * (1 - 0.35 * change)} opacite={lin(l, 0, 0.05) * (1 - change)} /> : null}
            {change > 0 ? <Note x={x} y={y} s={0.8 + 0.3 * change} o={change * (1 - lin(l, 0.86, 1))} /> : null}
          </g>
        );
      })}
    </Scene>
  );
};

/* ---------- Plans 4 et 5 : la ville ---------- */

const BATIMENTS = [
  { x: 262, y: 412, w: 58, h: 170 },
  { x: 480, y: 412, w: 58, h: 170 },
  { x: 322, y: 450, w: 42, h: 130 },
  { x: 436, y: 442, w: 42, h: 140 },
  { x: 360, y: 350, w: 80, h: 230 },
];
const FENETRES: Pt[] = [
  [291, 446], [509, 446], [343, 482], [457, 476], [291, 492], [509, 492], [385, 395], [415, 395], [385, 442], [415, 442], [400, 490],
];

const Ville: React.FC<{ eclat: number }> = ({ eclat }) => {
  const mur = teinte(eclat, F.encre2, F.papier);
  const toit = teinte(eclat, F.encre2, F.or);
  return (
    <g>
      <circle cx={400} cy={440} r={130 + 40 * eclat} fill={F.orClair} opacity={0.42 * eclat} />
      {BATIMENTS.map((b) => (
        <g key={b.x}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={mur} stroke={F.encre} strokeWidth={4} />
          {b.w === 58 ? (
            [0, 1, 2].map((k) => <rect key={k} x={b.x - 2 + k * 24} y={b.y - 14} width={14} height={14} fill={mur} stroke={F.encre} strokeWidth={3} />)
          ) : b.w === 80 ? (
            <path d={`M${b.x - 10} ${b.y} L${b.x + 40} ${b.y - 52} L${b.x + 90} ${b.y} Z`} fill={toit} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          ) : (
            <path d={`M${b.x - 5} ${b.y} L${b.x + 21} ${b.y - 28} L${b.x + 47} ${b.y} Z`} fill={toit} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          )}
        </g>
      ))}
      {FENETRES.map(([x, y], i) => {
        const o = lin(eclat, i / FENETRES.length, Math.min(1, (i + 1.6) / FENETRES.length));
        return <rect key={i} x={x - 7} y={y - 12} width={14} height={24} rx={7} fill={teinte(o, F.encre, F.or)} stroke={F.encre} strokeWidth={2} />;
      })}
      <path d="M95 668 Q400 372 705 668 Z" fill={teinte(eclat, F.cuir, F.cuirClair)} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M210 610 Q300 560 360 590 M470 600 Q540 590 610 630" fill="none" stroke={F.cuir} strokeWidth={3} opacity={0.65} />
    </g>
  );
};

const NATIONS: Pt[] = [
  [96, 225], [195, 125], [322, 72], [480, 72], [608, 125], [706, 225], [60, 390], [146, 320], [654, 320], [742, 390],
  [56, 555], [744, 555], [116, 715], [254, 770], [400, 800], [548, 770], [686, 715],
];

const Israel: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const eclat = p(f, d[0], d[1] - 10);
  const lDur = duree - d[1];
  const front = 30 + 380 * lin(f, d[1], d[1] + lDur * 0.72);
  const debut = f > d[1];
  return (
    <Scene>
      {debut
        ? [0, 1, 2, 3, 4].map((i) => {
            const t = ((f - d[1]) / 110 - i * 0.2) % 1;
            if (t < 0 || f - d[1] < i * 22) return null;
            const r = Math.min(front, 30 + t * 370);
            return <circle key={i} cx={400} cy={440} r={r} fill="none" stroke={F.or} strokeWidth={5} opacity={0.75 * (1 - t)} />;
          })
        : null}
      <Ville eclat={eclat} />
      {NATIONS.map(([x, y]) => {
        const dist = Math.hypot(x - 400, y - 440);
        const o = Math.max(0, Math.min(1, (front - dist + 10) / 30));
        return (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={24} fill={F.orClair} opacity={o * (0.45 + 0.15 * Math.sin(f / 14 + x))} />
            <circle cx={x} cy={y} r={12} fill={teinte(o, F.filet, F.or)} stroke={teinte(o, F.encre2, F.orFonce)} strokeWidth={3} />
          </g>
        );
      })}
      <Libelle x={400} y={868} taille={32} graisse={600} opacite={p(f, d[1] + 30, d[1] + 70)}>{LIBELLES.nations}</Libelle>
    </Scene>
  );
};

const Aile: React.FC<{ sens: number; angle: number; s: number }> = ({ sens, angle, s }) => (
  <g transform={`scale(${sens * s} ${s}) rotate(${angle})`}>
    <path d="M0 8 C22 -48 82 -92 158 -86 C146 -66 138 -58 124 -50 C118 -34 106 -28 92 -22 C80 -6 62 -2 46 4 C28 12 12 14 0 8 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M24 -8 C54 -30 88 -48 124 -50 M22 2 C46 -6 72 -14 92 -22" fill="none" stroke={F.filet} strokeWidth={3.5} />
  </g>
);

const NouveauTestament: React.FC<PropsIllustration> = ({ f, d }) => {
  // La ville de p4 reste en place pendant le fondu, s'efface, puis seulement le cadran arrive.
  const ville = 1 - p(f, FONDU_PLANS, FONDU_PLANS + 22);
  const cadran = p(f, FONDU_PLANS + 20, FONDU_PLANS + 46);
  const eteint = p(f, d[0] + 110, d[0] + 185);
  const m = p(f, d[2] - 22, d[2] + 26);
  // L'aiguille retombe, tente de remonter à « si Dieu t'aime… », puis retombe encore.
  const essai = lin(f, d[1] + 70, d[1] + 120) * (1 - p(f, d[1] + 140, d[1] + 195));
  const essai2 = lin(f, d[3] + 25, d[3] + 60) * (1 - p(f, d[3] + 70, d[3] + 115));
  const angle = lerp(-42, -172, eteint) + 50 * essai + 24 * essai2 + Math.sin(f / 2.4) * (0.6 * (1 - eteint) + 0.9 * (essai + essai2));
  const rad = (angle * Math.PI) / 180;
  const R = 250;
  const arc = teinte(eteint, F.or, F.filet);
  const apparait = p(f, d[2] - 12, d[2] + 14);
  const ailes = p(f, d[2] + 12, d[2] + 52);
  const rouleau = p(f, d[2] + 36, d[2] + 66);
  const vol = p(f, d[2] + 70, d[2] + 275);
  const pos = (t: number): Pt => [lerp(530, 450, t) + Math.sin(t * Math.PI * 2) * 60, lerp(690, 235, t)];
  const [x0, y0] = pos(vol);
  const x = x0 + Math.sin(f / 26) * 10 * vol;
  const y = y0 + Math.cos(f / 19) * 9 * vol;
  const battement = Math.sin(f / (vol > 0 && vol < 1 ? 3 : 5.5)) * (vol > 0 ? 17 : 6);
  const trainee = Array.from({ length: 31 }, (_, i) => pos((i / 30) * vol)).map(([a, b]) => `${a.toFixed(1)},${(b + 172).toFixed(1)}`).join(' ');
  const lRouleau = lerp(26, 216, rouleau);
  return (
    <Scene>
      {ville > 0 ? (
        <g opacity={ville}>
          <Ville eclat={1} />
        </g>
      ) : null}
      {cadran > 0 ? (
        <g opacity={cadran} transform={`translate(${lerp(400, 190, m)} ${lerp(590, 725, m)}) scale(${lerp(1, 0.6, m)})`}>
          <circle cx={0} cy={-80} r={R + 34} fill={F.orClair} opacity={0.42 * (1 - eteint)} />
          <path d={`M${-R} 0 A${R} ${R} 0 0 1 ${R} 0 V96 H${-R} Z`} fill={F.papier} stroke={F.encre} strokeWidth={6} strokeLinejoin="round" />
          <path d={`M${-R + 34} 0 A${R - 34} ${R - 34} 0 0 1 ${R - 34} 0`} fill="none" stroke={arc} strokeWidth={26} />
          {Array.from({ length: 11 }, (_, i) => {
            const a = ((-175 + i * 17) * Math.PI) / 180;
            return <line key={i} x1={Math.cos(a) * (R - 76)} y1={Math.sin(a) * (R - 76)} x2={Math.cos(a) * (R - 54)} y2={Math.sin(a) * (R - 54)} stroke={F.encre2} strokeWidth={i % 5 === 0 ? 6 : 3} />;
          })}
          <line x1={0} y1={0} x2={Math.cos(rad) * (R - 66)} y2={Math.sin(rad) * (R - 66)} stroke={teinte(eteint, F.argile, F.encre2)} strokeWidth={9} strokeLinecap="round" />
          <circle r={18} fill={F.encre} />
          <Libelle x={0} y={70} taille={42} graisse={600} couleur={teinte(eteint, F.encre, F.encre2)}>{LIBELLES.attestation}</Libelle>
        </g>
      ) : null}
      {apparait > 0 ? (
        <g>
          <polyline points={trainee} fill="none" stroke={F.encre2} strokeWidth={4} strokeDasharray="4 16" strokeLinecap="round" />
          <g transform={`translate(${x} ${y})`} opacity={apparait}>
            <line x1={-60} y1={30} x2={-lRouleau / 2 + 26} y2={84} stroke={F.encre} strokeWidth={3} opacity={rouleau} />
            <line x1={60} y1={30} x2={lRouleau / 2 - 26} y2={84} stroke={F.encre} strokeWidth={3} opacity={rouleau} />
            <rect x={-lRouleau / 2} y={84} width={lRouleau} height={78} fill={F.papier} stroke={F.encre} strokeWidth={4} />
            <rect x={-lRouleau / 2 - 13} y={78} width={26} height={90} rx={13} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
            <rect x={lRouleau / 2 - 13} y={78} width={26} height={90} rx={13} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
            <Libelle x={0} y={133} taille={30} graisse={600} opacite={lin(rouleau, 0.6, 1)}>{LIBELLES.evangile}</Libelle>
            <g transform="translate(-44 -6)"><Aile sens={-1} angle={battement} s={ailes} /></g>
            <g transform="translate(44 -6)"><Aile sens={1} angle={battement} s={ailes} /></g>
            <Piece x={0} y={0} r={56 * apparait} />
          </g>
        </g>
      ) : null}
    </Scene>
  );
};

/* ---------- Plan 6 : Job ---------- */

const Moto: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    {[-42, 42].map((c) => (
      <g key={c}>
        <circle cx={c} cy={-19} r={18} fill={F.papier} stroke={F.encre} strokeWidth={5} />
        <circle cx={c} cy={-19} r={4} fill={F.encre} />
      </g>
    ))}
    <path d="M42 -19 L8 -36 L-26 -36 L-42 -19 M-42 -19 L-26 -64 M-26 -64 L-40 -72 M8 -36 L58 -30" fill="none" stroke={F.encre} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M-20 -46 Q-4 -62 16 -48 L12 -36 H-16 Z" fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
    <rect x={14} y={-54} width={36} height={10} rx={5} fill={F.encre} />
    <circle cx={-37} cy={-56} r={6} fill={F.orClair} stroke={F.encre} strokeWidth={2.5} />
  </g>
);

const Job: React.FC<PropsIllustration> = ({ f, d }) => {
  const L = d[1] - d[0];
  const coupe = p(f, d[0] + 50, d[0] + 95);
  const DEST: Pt[] = [[135, 330], [285, 115], [515, 115], [665, 330]];
  const fantome = p(f, d[1] + 10, d[1] + 45) * (1 - p(f, d[2], d[2] + 40));
  const moto = p(f, d[2] + 10, d[2] + 75);
  const grond = lin(f, d[2] + 60, d[2] + 80);
  const xm = lerp(735, 650, moto) + Math.sin(f * 2.3) * 2.2 * (0.3 + 0.7 * grond);
  const ym = 782 + Math.sin(f * 3.1) * 1.8 * (0.3 + 0.7 * grond);
  return (
    <Scene>
      <line x1={30} x2={770} y1={782} y2={782} stroke={F.encre} strokeWidth={4} />
      <path d="M278 565 H522 L534 722 H266 Z" fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <rect x={236} y={720} width={328} height={62} rx={4} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <rect x={228} y={540} width={344} height={28} rx={4} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <path d="M250 540 L292 432 H508 L550 540 Z" fill="none" stroke={F.encre2} strokeWidth={4} strokeDasharray="12 12" opacity={fantome * (0.6 + 0.3 * Math.sin(f / 12))} />
      {[0, 1, 2, 3].map((i) => {
        const bas = [250 + 75 * i, 250 + 75 * (i + 1)];
        const hautx = [292 + 54 * i, 292 + 54 * (i + 1)];
        const cx0 = (bas[0] + bas[1]) / 2;
        const cy0 = 486;
        const ecart = (i - 1.5) * 10 * coupe;
        const dep = d[0] + L * 0.52 + i * 40;
        const u = p(f, dep, dep + 56);
        const [dx, dy] = DEST[i];
        const x = lerp(ecart, dx - cx0, u);
        const y = lerp(0, dy - cy0, u) - Math.sin(u * Math.PI) * 30;
        const noms = p(f, dep + 40, dep + 62);
        return (
          <g key={i}>
            <path transform={`translate(${x} ${y})`} d={`M${bas[0]} 540 L${hautx[0]} 432 H${hautx[1]} L${bas[1]} 540 Z`} fill={F.or} stroke={F.orFonce} strokeWidth={4} strokeLinejoin="round" />
            <path transform={`translate(${x} ${y})`} d={`M${hautx[0] + 8} 446 H${hautx[1] - 8}`} stroke={F.orClair} strokeWidth={6} strokeLinecap="round" />
            <Libelle x={dx} y={dy + 94} taille={29} graisse={600} opacite={noms}>{LIBELLES.jobParts[i]}</Libelle>
          </g>
        );
      })}
      {moto > 0 ? (
        <g opacity={lin(moto, 0, 0.25)}>
          <Moto x={xm} y={ym} />
          {[0, 1, 2].map((i) => {
            const t = ((f + i * 12) % 36) / 36;
            return <circle key={i} cx={xm + 66 + t * 44} cy={ym - 32 - t * 26} r={5 + t * 8} fill={F.filet} opacity={grond * (1 - t)} />;
          })}
          {[-1, 1].map((s) => (
            <path key={s} d={`M${xm + s * 18} ${ym - 88} q${s * 7} -7 0 -14 q${-s * 7} -7 0 -14`} fill="none" stroke={F.encre2} strokeWidth={3} strokeLinecap="round" opacity={grond * (0.55 + 0.45 * Math.sin(f / 1.5))} />
          ))}
        </g>
      ) : null}
    </Scene>
  );
};

/* ---------- Plan 7 : Josaphat ---------- */

const Paquet: React.FC<{ x: number; y: number; o: number; v: number }> = ({ x, y, o, v }) => (
  <g opacity={o} transform={`translate(${x} ${y})`}>
    <rect x={-33} y={-29} width={66} height={58} rx={4} fill={v % 2 ? F.papier : F.cuirClair} stroke={F.encre} strokeWidth={3.5} />
    <rect x={-7} y={-29} width={14} height={58} fill={F.or} stroke={F.orFonce} strokeWidth={1.5} />
    <path d="M0 -29 C-22 -48 -24 -30 0 -29 C22 -48 24 -30 0 -29 Z" fill={F.orClair} stroke={F.orFonce} strokeWidth={2.5} />
  </g>
);

const PAQUETS: { a: Pt; b: Pt }[] = [
  { a: [120, 862], b: [228, 268] },
  { a: [680, 862], b: [572, 268] },
  { a: [37, 760], b: [150, 268] },
  { a: [763, 760], b: [650, 268] },
  { a: [37, 500], b: [72, 268] },
  { a: [763, 500], b: [728, 268] },
  { a: [37, 200], b: [112, 190] },
  { a: [763, 200], b: [688, 190] },
  { a: [270, 40], b: [190, 190] },
  { a: [530, 40], b: [610, 190] },
  { a: [60, 40], b: [150, 112] },
  { a: [740, 40], b: [650, 112] },
];

const Josaphat: React.FC<PropsIllustration> = ({ f, d }) => {
  const fin = d[1] + (d[1] - d[0]) * 0.55;
  const av = lin(f, d[0], fin);
  const yTete = lerp(860, 284, av);
  const lueur = p(f, fin - 10, fin + 40);
  const milieu = Array.from({ length: 13 }, (_, i) => 845 - i * 44).filter((y) => y > yTete + 6);
  return (
    <Scene>
      <defs>
        <clipPath id="ch16-route">
          <rect x={0} y={yTete} width={800} height={900} />
        </clipPath>
      </defs>
      <g clipPath="url(#ch16-route)">
        <path d="M240 860 L384 284 H416 L560 860 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      </g>
      {milieu.map((y) => (
        <line key={y} x1={400} x2={400} y1={y} y2={y - 20 * (0.45 + (0.55 * (y - 284)) / 576)} stroke={F.encre2} strokeWidth={lerp(2.5, 6, (y - 284) / 576)} strokeLinecap="round" />
      ))}
      {av < 1 ? <circle cx={400} cy={yTete} r={10} fill={F.or} stroke={F.orFonce} strokeWidth={3} /> : null}
      <circle cx={400} cy={170} r={150 + 8 * Math.sin(f / 16)} fill={F.orClair} opacity={0.15 + 0.4 * lueur} />
      <g transform={`translate(400 180) scale(${1 + 0.05 * lueur}) translate(-400 -180)`}>
        <path d="M292 244 L270 128 L344 188 L400 96 L456 188 L530 128 L508 244 Z" fill={F.or} stroke={F.orFonce} strokeWidth={5} strokeLinejoin="round" />
        <rect x={286} y={236} width={228} height={30} rx={6} fill={F.orClair} stroke={F.orFonce} strokeWidth={4} />
        {[320, 400, 480].map((x) => (
          <circle key={x} cx={x} cy={251} r={8} fill={F.argile} stroke={F.encre} strokeWidth={2} />
        ))}
        {[[270, 124], [400, 90], [530, 124]].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r={11} fill={F.orClair} stroke={F.orFonce} strokeWidth={4} />
        ))}
      </g>
      {PAQUETS.map((q, i) => {
        const arrive = d[0] + ((i + 1) / PAQUETS.length) * (fin - d[0]);
        const u = p(f, arrive - 62, arrive);
        const o = lin(f, arrive - 72, arrive - 56);
        return <Paquet key={i} x={lerp(q.a[0], q.b[0], u)} y={lerp(q.a[1], q.b[1], u)} o={o} v={i >> 1} />;
      })}
    </Scene>
  );
};

/* ---------- Plan 8 : Cyrus ---------- */

const onde = (y: number, amp: number, ph: number) => {
  const pts = Array.from({ length: 21 }, (_, i) => `${i * 40},${(y + Math.sin(i * 0.9 + ph) * amp).toFixed(1)}`);
  return `M${pts.join(' L')} L800 880 L0 880 Z`;
};

const COUCHES = [
  { y: 200, c: F.filet, o: 1, ph: 0, amp: 0 },
  { y: 350, c: F.cuirClair, o: 0.6, ph: 1, amp: 6 },
  { y: 510, c: F.cuirClair, o: 1, ph: 2.4, amp: 7 },
  { y: 690, c: F.encre, o: 0.88, ph: 4, amp: 8 },
];

const CAILLOUX: { x: number; y: number; r: number }[] = [
  [420, 260, 11], [560, 310, 8], [690, 250, 12], [60, 300, 9], [480, 430, 13], [620, 470, 9], [730, 400, 11], [50, 440, 10], [440, 610, 12], [590, 570, 10], [700, 640, 13], [60, 590, 11], [500, 790, 13], [640, 830, 10], [720, 750, 12], [60, 800, 12],
].map(([x, y, r]) => ({ x, y, r }));

const Coffre: React.FC<{ ouvre: number }> = ({ ouvre }) => (
  <g>
    {ouvre > 0 ? (
      <g>
        <path d="M-80 -8 L-68 -62 H68 L80 -8 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" opacity={ouvre} />
        <ellipse cx={0} cy={-6} rx={70} ry={20 * ouvre} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
        <Piece x={-34} y={-14} r={15 * ouvre} />
        <Piece x={32} y={-16} r={15 * ouvre} />
        <Piece x={0} y={-22} r={17 * ouvre} />
      </g>
    ) : null}
    <rect x={-88} y={-6} width={176} height={62} rx={5} fill={F.or} stroke={F.encre} strokeWidth={4} />
    {[-52, 52].map((x) => (
      <rect key={x} x={x - 8} y={-6} width={16} height={62} fill={F.orFonce} />
    ))}
    {ouvre < 1 ? (
      <g opacity={1 - ouvre}>
        <path d="M-88 -6 Q0 -66 88 -6 Z" fill={F.orClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      </g>
    ) : null}
    <rect x={-14} y={-14} width={28} height={30} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={3} opacity={1 - ouvre} />
  </g>
);

const Cyrus: React.FC<PropsIllustration> = ({ f, d }) => {
  const X = 225;
  const ETAPES = [790, 610, 440, 290, 146];
  const MOMENTS = [d[0] + 70, d[0] + 180, d[0] + 290, d[1] + 25];
  const y = MOMENTS.reduce((acc, m, i) => lerp(acc, ETAPES[i + 1], p(f, m, m + 46)), ETAPES[0]);
  const hors = MOMENTS[3] + 56;
  const LIENS = 8;
  const pas = (d[2] - 12 - hors) / LIENS;
  const ouvre = p(f, d[2] + 4, d[2] + 44);
  const eclat = p(f, d[2] + 22, d[2] + 74);
  return (
    <Scene>
      {COUCHES.map((c) => (
        <path key={c.y} d={onde(c.y, c.amp, c.ph)} fill={c.c} fillOpacity={c.o} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      ))}
      {CAILLOUX.map((c) => (
        <ellipse key={`${c.x}-${c.y}`} cx={c.x} cy={c.y} rx={c.r} ry={c.r * 0.7} fill={c.y > 690 ? F.encre2 : F.cuir} opacity={0.65} />
      ))}
      <rect x={X - 100} y={y + 54} width={200} height={Math.max(0, 846 - y)} fill={F.parchemin} opacity={0.2} />
      {[-100, 100].map((s) => (
        <line key={s} x1={X + s} x2={X + s} y1={Math.max(200, y + 54)} y2={848} stroke={F.papier} strokeWidth={3} strokeDasharray="10 12" opacity={y < 770 ? 0.75 : 0} />
      ))}
      <g opacity={eclat}>
        {Array.from({ length: 11 }, (_, i) => {
          const a = ((-170 + i * 16) * Math.PI) / 180;
          const r0 = 88;
          const r1 = 88 + 34 * eclat + 6 * Math.sin(f / 9 + i);
          return <line key={i} x1={X + Math.cos(a) * r0} y1={120 + Math.sin(a) * r0 * 0.9} x2={X + Math.cos(a) * r1} y2={120 + Math.sin(a) * r1 * 0.9} stroke={F.or} strokeWidth={6} strokeLinecap="round" />;
        })}
      </g>
      <g transform={`translate(${X} ${y})`}>
        <Coffre ouvre={ouvre} />
      </g>
      {Array.from({ length: LIENS }, (_, i) => {
        const u = p(f, hors + i * pas, hors + (i + 1) * pas);
        const x = 400 + i * 40 + u * i * 11;
        const rot = [24, -32, 40, -18, 34, -40, 16, -26][i] * u;
        const h = i % 2 ? 14 : 28;
        return (
          <rect key={i} x={x - 22} y={186 - h / 2 - Math.sin(u * Math.PI) * 28 + u * (h / 2 - 4)} width={44} height={h} rx={h / 2} fill="none" stroke={F.encre} strokeWidth={7} transform={`rotate(${rot} ${x} 186)`} />
        );
      })}
    </Scene>
  );
};

/* ---------- Plan 9 : Barzillaï ---------- */

const Tente: React.FC<{ x: number; y: number; allume: number }> = ({ x, y, allume }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={0} cy={-46} r={84} fill="url(#ch16-halo)" opacity={allume} />
    <path d="M0 -118 L68 0 H-68 Z" fill={teinte(allume, F.cuir, F.orClair)} stroke={teinte(allume, F.encre2, F.orFonce)} strokeWidth={4} strokeLinejoin="round" />
    <path d="M0 -62 L24 0 H-24 Z" fill={teinte(allume, F.encre, F.or)} stroke={teinte(allume, F.encre2, F.orFonce)} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

/** Sac de toile, posé sur (0, 0) : panse, col resserré, lien noué, bord évasé. */
const Sac: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M-24 0 C-33 -4 -34 -20 -22 -31 C-17 -36 -11 -37 -8 -41 L-14 -50 Q0 -45 14 -50 L8 -41 C11 -37 17 -36 22 -31 C34 -20 33 -4 24 0 Z" fill={F.filet} stroke={F.cuir} strokeWidth={3} />
    <path d="M-7 -33 Q-12 -25 -15 -16 M8 -32 Q11 -26 13 -20" fill="none" stroke={F.cuirClair} strokeWidth={2.5} />
    <path d="M-9 -41 H9 M9 -41 Q16 -39 15 -31" fill="none" stroke={F.argile} strokeWidth={4} />
  </g>
);

const Charrette: React.FC<{ x: number; roue: number; nom: number }> = ({ x, roue, nom }) => (
  <g transform={`translate(${x} 618)`}>
    <path d="M-92 -20 L-132 -30" stroke={F.cuirClair} strokeWidth={7} strokeLinecap="round" />
    <Sac x={-29} y={-60} />
    <Sac x={29} y={-60} />
    <Sac x={-58} y={-50} />
    <Sac x={0} y={-50} />
    <Sac x={58} y={-50} />
    <rect x={-92} y={-58} width={184} height={48} rx={4} fill={F.cuir} stroke={F.orClair} strokeWidth={3} />
    <Libelle x={0} y={-25} taille={26} graisse={600} couleur={F.papier} opacite={nom}>{LIBELLES.barzillai}</Libelle>
    <rect x={-80} y={-10} width={160} height={6} fill={F.cuirClair} />
    {[-56, 56].map((c) => (
      <g key={c} transform={`translate(${c} 16) rotate(${roue})`}>
        <circle r={20} fill={F.cuirClair} stroke={F.orClair} strokeWidth={4} />
        {[0, 60, 120].map((a) => (
          <line key={a} x1={-18} x2={18} y1={0} y2={0} transform={`rotate(${a})`} stroke={F.orClair} strokeWidth={3} />
        ))}
      </g>
    ))}
  </g>
);

const CHEMINS = ['M280 378 C270 300 230 220 160 110', 'M460 378 C490 290 560 200 650 110', 'M548 494 C640 450 700 370 772 290', 'M640 726 C690 730 735 770 772 826'];
const ETOILES: Pt[] = [[70, 90], [140, 190], [250, 70], [360, 130], [440, 66], [560, 90], [720, 80], [700, 200], [70, 270], [400, 240], [600, 280]];
const TENTES: { x: number; y: number }[] = [
  { x: 550, y: 790 }, { x: 460, y: 500 }, { x: 370, y: 790 }, { x: 280, y: 500 }, { x: 190, y: 790 }, { x: 100, y: 500 },
];

const Barzillai: React.FC<PropsIllustration> = ({ f, d }) => {
  // Repères de la longue phrase, à 12 caractères par seconde : « un seul homme » à +315, « Barzillaï » à +353, « Mahanaïm » à +533.
  const debut = d[1] + 313;
  const fin = d[1] + 545;
  const X0 = 930;
  const X1 = 152;
  const av = lin(f, debut, fin);
  const x = lerp(X0, X1, av);
  const roue = -av * 1800;
  const chemin = 1 - 0.6 * p(f, debut, debut + 100);
  return (
    <Scene>
      <defs>
        <radialGradient id="ch16-halo">
          <stop offset="0%" stopColor={F.orClair} stopOpacity={0.5} />
          <stop offset="100%" stopColor={F.orClair} stopOpacity={0} />
        </radialGradient>
        <clipPath id="ch16-nuit">
          <rect x={6} y={30} width={788} height={840} rx={14} />
        </clipPath>
      </defs>
      <rect x={6} y={30} width={788} height={840} rx={14} fill={F.encre} />
      {ETOILES.map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r={2.6 + (i % 3)} fill={F.papier} opacity={0.45 + 0.35 * Math.sin(f / 18 + i * 1.7)} />
      ))}
      {CHEMINS.map((c) => (
        <g key={c} opacity={chemin}>
          <path d={c} fill="none" stroke={F.cuir} strokeWidth={22} strokeLinecap="round" />
          <path d={c} fill="none" stroke={F.filet} strokeWidth={4} strokeDasharray="14 18" strokeDashoffset={f * 1.6} strokeLinecap="round" />
        </g>
      ))}
      <rect x={6} y={610} width={788} height={46} fill={F.cuir} />
      {TENTES.map((t) => {
        const passe = lerp(debut, fin, (X0 - (t.x + 60)) / (X0 - X1));
        return <Tente key={t.x} x={t.x} y={t.y} allume={p(f, passe, passe + 30)} />;
      })}
      {av > 0 ? (
        <g clipPath="url(#ch16-nuit)">
          <path d={`M${x + 100} 633 H900`} stroke={F.orClair} strokeWidth={4} strokeDasharray="14 16" opacity={0.8} />
          <Charrette x={x} roue={roue} nom={p(f, d[1] + 340, d[1] + 362)} />
        </g>
      ) : null}
      <Libelle x={370} y={845} taille={28} graisse={600} couleur={F.papier} opacite={p(f, d[1] + 525, d[1] + 555)}>{LIBELLES.mahanaim}</Libelle>
    </Scene>
  );
};

/* ---------- Plan 10 : les ruisseaux ---------- */

const RUISSEAUX: readonly (readonly [Pt, Pt, Pt, Pt])[] = [
  [[250, 92], [250, 250], [340, 340], [400, 474]],
  [[550, 92], [550, 250], [460, 340], [400, 474]],
  [[50, 352], [190, 362], [310, 400], [400, 490]],
  [[750, 352], [610, 362], [490, 400], [400, 490]],
];

const Converge: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const L = duree - d[0] - 30;
  const DEBUTS = [0.14, 0.36, 0.56, 0.74].map((u) => d[0] + L * u);
  const ETIQUETTES: { x: number; y: number; a: 'start' | 'middle' | 'end' }[] = [
    { x: 250, y: 66, a: 'middle' },
    { x: 550, y: 66, a: 'middle' },
    { x: 22, y: 326, a: 'start' },
    { x: 778, y: 326, a: 'end' },
  ];
  const niveau = DEBUTS.reduce((s, t) => s + p(f, t + 66, t + 106), 0) / 4;
  // Le courant naît de la tête du premier ruisseau arrivé : même largeur que lui, puis il s'ouvre et descend.
  const Y0 = 474;
  const naissance = DEBUTS[0] + 78;
  const longueur = p(f, naissance, d[0] + L * 0.86);
  const ouvre = lin(longueur, 0, 0.15);
  const yBas = lerp(Y0, 878, longueur);
  const demi = (y: number) => lerp(15, 24, ouvre) + (Math.max(0, y - 480) / 398) * (24 + 136 * niveau) + 3 * ouvre * Math.sin(y / 34 + f / 14);
  const centre = (y: number) => 400 + (Math.max(0, y - 480) / 398) * 26 * Math.sin((y - 480) / 82);
  const ys = Array.from({ length: 41 }, (_, i) => lerp(Y0, yBas, i / 40));
  const bord = (k: number) => ys.map((y) => `${(centre(y) + k * demi(y)).toFixed(1)},${y.toFixed(1)}`);
  const pieces = Array.from({ length: 8 }, (_, i) => i);
  // Vagues de longueur fixe et creux proportionnel à la largeur : un courant étroit a un bout lisse, pas des dents.
  const creux = 7 * Math.min(1, demi(yBas) / 90);
  const vague = Array.from({ length: 25 }, (_, i) => {
    const u = i / 24;
    return `${(centre(yBas) + lerp(-1, 1, u) * demi(yBas)).toFixed(1)},${(yBas + Math.sin(u * Math.PI) * ((1 - ouvre) * demi(yBas) + creux * Math.sin((lerp(-1, 1, u) * demi(yBas) * 2 * Math.PI) / 120 + f / 9))).toFixed(1)}`;
  });
  const coiffe = Array.from({ length: 13 }, (_, i) => {
    const a = (i / 12) * Math.PI;
    return `${(400 + demi(Y0) * Math.cos(a)).toFixed(1)},${(Y0 - demi(Y0) * Math.sin(a)).toFixed(1)}`;
  });
  // Forme fermée : côté gauche, vague (d'abord arrondie comme la tête du ruisseau), côté droit, puis le dôme du haut.
  const courant = [...bord(-1), ...vague, ...bord(1).reverse(), ...coiffe].join(' ');
  const ruisseaux = RUISSEAUX.map((c, i) => ({ c, u: lin(f, DEBUTS[i], DEBUTS[i] + 80) })).filter((r) => r.u > 0);
  return (
    <Scene>
      <defs>
        <clipPath id="ch16-courant">
          <polygon points={courant} />
        </clipPath>
      </defs>
      {/* Tous les contours d'abord, tous les aplats ensuite : ruisseaux et courant ne font qu'une seule forme. */}
      {ruisseaux.map(({ c, u }, i) => (
        <g key={i}>
          <circle cx={c[0][0]} cy={c[0][1]} r={16} fill={F.orFonce} />
          <polyline points={trace(c, u)} fill="none" stroke={F.orFonce} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      {longueur > 0 ? <polygon points={courant} fill={F.orFonce} stroke={F.orFonce} strokeWidth={7} strokeLinejoin="round" /> : null}
      {ruisseaux.map(({ c, u }, i) => (
        <g key={i}>
          <circle cx={c[0][0]} cy={c[0][1]} r={12} fill={F.or} />
          <polyline points={trace(c, u)} fill="none" stroke={F.or} strokeWidth={23} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      {longueur > 0 ? <polygon points={courant} fill={F.or} /> : null}
      {ruisseaux.map(({ c, u }, i) => (
        <polyline key={i} points={trace(c, u * 0.92)} fill="none" stroke={F.orClair} strokeWidth={5} strokeDasharray="14 22" strokeDashoffset={-f * 3} strokeLinecap="round" />
      ))}
      {longueur > 0 ? (
        <g clipPath="url(#ch16-courant)" opacity={lin(longueur, 0.02, 0.1)}>
          {[-0.68, 0, 0.68].map((k) => (
            <polyline key={k} points={bord(k).join(' ')} fill="none" stroke={F.orClair} strokeWidth={5} strokeDasharray="22 26" strokeDashoffset={-f * 3} strokeLinecap="round" />
          ))}
        </g>
      ) : null}
      {pieces.map((i) => {
        const t = ((f + i * 38) % 304) / 304;
        const y = lerp(600, 866, t);
        if (y > yBas - 16) return null;
        const k = i % 2 ? 0.34 : -0.34;
        return <Piece key={i} x={centre(y) + k * demi(y)} y={y} r={14} opacite={lin(t, 0, 0.12) * (1 - lin(t, 0.9, 1)) * p(f, DEBUTS[1] + 80, DEBUTS[1] + 110)} />;
      })}
      {ETIQUETTES.map((e, i) => (
        <Libelle key={i} x={e.x} y={e.y} ancre={e.a} taille={29} graisse={600} opacite={p(f, DEBUTS[i] - 8, DEBUTS[i] + 16)}>{LIBELLES.ruisseaux[i]}</Libelle>
      ))}
    </Scene>
  );
};

/* ---------- Plan 11 : tente, temple, mur ---------- */

const TENTE = 'M215 112 Q150 270 80 404 H350 Q280 270 215 112 Z';
const TEMPLE = 'M450 218 L600 112 L750 218 V240 H722 V382 H752 V404 H448 V382 H478 V240 H450 Z';
const MUR = 'M128 800 V620 H178 V580 H238 V620 H298 V580 H358 V620 H418 V580 H478 V620 H538 V580 H598 V620 H672 V800 Z';

const Remplissage: React.FC<{ id: string; forme: string; haut: number; bas: number; niveau: number; f: number; deborde?: number; cx?: number; cy?: number }> = ({ id, forme, haut, bas, niveau, f, deborde = 0, cx = 0, cy = 0 }) => {
  // Remplit exactement dans le trait ; une fois plein, `deborde` (0 → 1) fait passer l'or au-delà.
  const y = lerp(bas, haut, niveau) - 16 * deborde;
  const onduler = Array.from({ length: 21 }, (_, i) => `${i * 45},${(y + Math.sin(i * 0.9 + f / 8) * 5 * (niveau > 0 && niveau < 1 ? 1 : 0)).toFixed(1)}`);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={forme} transform={deborde > 0 ? `translate(${cx} ${cy}) scale(${1 + 0.09 * deborde}) translate(${-cx} ${-cy})` : undefined} />
        </clipPath>
      </defs>
      {niveau > 0 ? (
        <g clipPath={`url(#${id})`}>
          <polygon points={`${onduler.join(' ')} 900,${bas + 40} 0,${bas + 40}`} fill={F.or} />
          <polyline points={onduler.join(' ')} fill="none" stroke={F.orClair} strokeWidth={8} />
        </g>
      ) : null}
    </g>
  );
};

const Ouvrages: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const dessin = [p(f, d[0], d[0] + 60), p(f, d[0] + 30, d[0] + 100), p(f, d[0] + 60, d[0] + 140)];
  const tente = lin(f, d[1] + 30, d[1] + 245);
  const L2 = d[3] - d[2];
  const temple = [0.12, 0.3, 0.48, 0.66].reduce((s, u) => s + p(f, d[2] + L2 * u, d[2] + L2 * u + 40) * 0.25, 0);
  const mur = lin(f, d[3] + 20, duree - 60);
  const deborde = p(f, d[1] + 245, d[1] + 320);
  const SURPLUS: Pt[] = [[48, 403], [20, 403], [382, 403], [410, 403]];
  const noms = [p(f, d[1] - 10, d[1] + 20), p(f, d[2] - 10, d[2] + 20), p(f, d[3] - 10, d[3] + 20)];
  return (
    <Scene>
      <Remplissage id="ch16-f-tente" forme={TENTE} haut={112} bas={404} niveau={tente} f={f} deborde={deborde} cx={215} cy={268} />
      <Remplissage id="ch16-f-temple" forme={TEMPLE} haut={112} bas={404} niveau={temple} f={f} />
      <Remplissage id="ch16-f-mur" forme={MUR} haut={578} bas={800} niveau={mur} f={f} />
      {SURPLUS.map(([x, y], i) => {
        const o = lin(deborde, i * 0.18, i * 0.18 + 0.4);
        const sens = x < 215 ? 1 : -1;
        return <Piece key={i} x={x + sens * 30 * (1 - o)} y={y - 14 * Math.sin(o * Math.PI)} r={13} opacite={o} />;
      })}
      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d={TENTE} pathLength={1} stroke={F.encre} strokeWidth={5} strokeDasharray={`${dessin[0]} 1`} />
        <path d="M215 112 V404 M215 230 L168 404 M215 230 L262 404" stroke={F.encre} strokeWidth={3} opacity={dessin[0]} />
        <path d={TEMPLE} pathLength={1} stroke={F.encre} strokeWidth={5} strokeDasharray={`${dessin[1]} 1`} />
        <g stroke={F.encre} strokeWidth={3.5} opacity={dessin[1]}>
          <path d="M478 240 H722" />
          {[520, 560, 600, 640, 680].map((x) => (
            <path key={x} d={`M${x} 240 V382`} />
          ))}
          <path d="M478 382 H722" />
          <circle cx={600} cy={180} r={15} />
        </g>
        <path d={MUR} pathLength={1} stroke={F.encre} strokeWidth={5} strokeDasharray={`${dessin[2]} 1`} />
        <g stroke={F.encre} strokeWidth={2.5} opacity={dessin[2] * 0.72}>
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <path d={`M128 ${656 + r * 36} H672`} />
              {Array.from({ length: 8 }, (_, i) => 164 + i * 72 + (r % 2 ? 34 : 0))
                .filter((x) => x < 660)
                .map((x) => (
                  <path key={x} d={`M${x} ${620 + r * 36} V${656 + r * 36}`} />
                ))}
            </g>
          ))}
        </g>
      </g>
      <Libelle x={215} y={458} taille={30} graisse={600} opacite={noms[0]}>{LIBELLES.ouvrages[0]}</Libelle>
      <Libelle x={600} y={458} taille={30} graisse={600} opacite={noms[1]}>{LIBELLES.ouvrages[1]}</Libelle>
      <Libelle x={400} y={852} taille={30} graisse={600} opacite={noms[2]}>{LIBELLES.ouvrages[2]}</Libelle>
    </Scene>
  );
};

/* ---------- Plan 12 : les coffrets ---------- */

const Coffret: React.FC<{ x: number; ouvre: number; repere: number; f: number; nom: string; contenu: number }> = ({ x, ouvre, repere, f, nom, contenu }) => {
  const Y = 270;
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx={0} cy={Y} r={112} fill={F.orClair} opacity={0.5 * repere} />
      {ouvre > 0 ? <path d={`M-78 ${Y} L-66 ${Y - 58} H66 L78 ${Y} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" opacity={ouvre} /> : null}
      {ouvre > 0.3 && contenu === 0
        ? [[-40, -8], [36, -8], [-2, -18], [2, -4]].map(([cx, cy], i) => <Piece key={i} x={cx} y={Y + cy} r={22} opacite={ouvre} />)
        : null}
      {ouvre > 0.3 && contenu === 1
        ? [-26, 0, 26].map((cx, i) => (
            <path
              key={cx}
              d={`M${cx} ${Y - 8} C${cx - 24} ${Y - 40} ${cx + 24} ${Y - 62} ${cx} ${Y - 94} C${cx - 24} ${Y - 122} ${cx + 22} ${Y - 138} ${cx + 4} ${Y - 166}`}
              fill="none"
              stroke={F.encre2}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray="30 16"
              strokeDashoffset={f * 1.4 + i * 15}
              opacity={ouvre * 0.7}
            />
          ))
        : null}
      {ouvre > 0.3 && contenu === 2 ? (
        <g opacity={ouvre}>
          <path d={`M-14 ${Y - 56} H14 V${Y - 40} C34 ${Y - 28} 34 ${Y - 4} 28 ${Y} H-28 C-34 ${Y - 4} -34 ${Y - 28} -14 ${Y - 40} Z`} fill={F.argile} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
          <rect x={-18} y={Y - 68} width={36} height={14} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
        </g>
      ) : null}
      <rect x={-85} y={Y} width={170} height={92} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <rect x={-85} y={Y} width={170} height={15} fill={F.or} stroke={F.encre} strokeWidth={3} />
      <rect x={-14} y={Y + 4} width={28} height={34} rx={4} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
      {ouvre < 1 ? <path d={`M-85 ${Y} Q0 ${Y - 62 * (1 - ouvre)} 85 ${Y} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" opacity={1 - ouvre} /> : null}
      <Libelle x={0} y={Y + 136} taille={30} graisse={600}>{nom}</Libelle>
    </g>
  );
};

const Coffrets: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const XS = [130, 400, 670];
  const LIGNE = 680;
  const L = duree - d[2];
  const repere = (u: number) => {
    const a = d[2] + L * u;
    return p(f, a, a + 18) * (1 - p(f, a + 40, a + 62));
  };
  const a = d[1];
  const saut = p(f, a, a + 22);
  const chute = lin(f, a + 20, a + 46) ** 2;
  const aller = p(f, a + 48, a + 104);
  const retour = p(f, a + 122, a + 200);
  const rayon = 40;
  const xSol = lerp(lerp(265, 690, aller), 122, retour);
  const x = f < a + 20 ? lerp(130, 265, saut) : xSol;
  const y = f < a + 20 ? lerp(258, 190, Math.sin(saut * Math.PI)) : lerp(190, LIGNE - rayon - 2, chute);
  const roule = ((xSol - 265) / rayon) * (180 / Math.PI);
  const couvert = p(f, d[2] + L * 0.62, d[2] + L * 0.86);
  const anneau = (f - (d[2] + L * 0.62)) / 40;
  return (
    <Scene>
      <rect x={60} y={LIGNE - 8} width={680 * couvert} height={16} rx={8} fill={F.orClair} />
      <line x1={60} x2={740} y1={LIGNE} y2={LIGNE} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
      <line x1={265} x2={Math.max(265, lerp(265, 690, aller))} y1={LIGNE} y2={LIGNE} stroke={F.or} strokeWidth={8} opacity={aller > 0 ? 1 : 0} />
      <line x1={690} x2={lerp(690, 122, retour)} y1={LIGNE + 16} y2={LIGNE + 16} stroke={F.orFonce} strokeWidth={5} strokeDasharray="12 12" strokeLinecap="round" opacity={retour > 0 ? 1 : 0} />
      <line x1={690} x2={690} y1={LIGNE - 10} y2={LIGNE + 26} stroke={F.encre} strokeWidth={5} opacity={p(f, a + 88, a + 106)} />
      <line x1={122} x2={122} y1={LIGNE - 10} y2={LIGNE + 26} stroke={F.encre} strokeWidth={5} opacity={p(f, a + 180, a + 200)} />
      <Libelle x={690} y={LIGNE + 66} taille={30} graisse={600} opacite={p(f, a + 88, a + 106)}>{LIBELLES.egypte}</Libelle>
      <Libelle x={122} y={LIGNE + 66} taille={30} graisse={600} opacite={p(f, a + 180, a + 200)}>{LIBELLES.nazareth}</Libelle>
      {[0, 1, 2].map((i) => {
        const o = d[0] + 20 + i * 62;
        return <Coffret key={i} x={XS[i]} ouvre={p(f, o, o + 30)} repere={repere(0.02 + i * 0.18)} f={f} nom={LIBELLES.coffrets[i]} contenu={i} />;
      })}
      {anneau > 0 && anneau < 1 ? <circle cx={x} cy={y} r={rayon + anneau * 70} fill="none" stroke={F.or} strokeWidth={5} opacity={1 - anneau} /> : null}
      {f >= a ? (
        <g transform={`translate(${x} ${y}) rotate(${roule})`}>
          <Piece x={0} y={0} r={rayon} />
          {[0, 90, 180, 270].map((r) => (
            <line key={r} x1={rayon * 0.3} y1={0} x2={rayon * 0.58} y2={0} transform={`rotate(${r})`} stroke={F.orFonce} strokeWidth={5} strokeLinecap="round" />
          ))}
        </g>
      ) : null}
    </Scene>
  );
};

/* ---------- Plan 13 : les empreintes ---------- */

const cheminX = (y: number) => 400 + 22 * Math.sin(y / 125);

const Empreinte: React.FC<{ x: number; y: number; o: number; c: string; sens: number }> = ({ x, y, o, c, sens }) => (
  <g opacity={o} transform={`translate(${x} ${y}) rotate(${sens * 6})`}>
    <ellipse cx={0} cy={-8} rx={13} ry={19} fill={c} />
    <ellipse cx={0} cy={22} rx={9.5} ry={10} fill={c} />
  </g>
);

const Rouleau: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * o}) rotate(-8)`}>
    <rect x={-44} y={-26} width={88} height={52} fill={F.papier} stroke={F.encre} strokeWidth={3.5} />
    <path d="M-24 -9 H24 M-24 9 H24" stroke={F.filet} strokeWidth={4} />
    <rect x={-56} y={-32} width={20} height={64} rx={10} fill={F.cuirClair} stroke={F.encre} strokeWidth={3.5} />
    <rect x={36} y={-32} width={20} height={64} rx={10} fill={F.cuirClair} stroke={F.encre} strokeWidth={3.5} />
  </g>
);

const Panier: React.FC<{ x: number; y: number; o: number; plein: number; lueur: number }> = ({ x, y, o, plein, lueur }) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * o})`}>
    <circle cx={0} cy={0} r={66} fill={F.orClair} opacity={0.5 * lueur} />
    <path d="M-44 -6 C-44 -56 44 -56 44 -6" fill="none" stroke={F.cuir} strokeWidth={7} />
    {plein > 0 ? (
      <g>
        <Piece x={-20} y={-10} r={15 * plein} />
        <Piece x={20} y={-10} r={15 * plein} />
        <Piece x={0} y={-18} r={15 * plein} />
      </g>
    ) : null}
    <path d="M-54 -6 H54 L40 38 H-40 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M-48 8 H48 M-44 22 H44 M-26 -6 L-20 38 M0 -6 V38 M26 -6 L20 38" stroke={F.cuir} strokeWidth={2.5} />
  </g>
);

const Pourvoir: React.FC<PropsIllustration> = ({ f, d }) => {
  const N = 12;
  const yPas = (i: number) => 830 - i * 64;
  const L0 = d[1] - d[0];
  const deb = [d[0] - 10, d[0] + L0 * 0.42];
  const pas = [(L0 * 0.56) / N, (L0 * 0.58 + 10) / N];
  const YS = [680, 500, 320, 140];
  const lueur = p(f, d[1] + 40, d[1] + 80) * (0.7 + 0.3 * Math.sin(f / 13));
  const bords = [-155, 155].map((dx) => Array.from({ length: 31 }, (_, i) => `${(cheminX(880 - i * 29) + dx).toFixed(1)},${880 - i * 29}`).join(' '));
  return (
    <Scene>
      <polygon points={`${bords[0]} ${bords[1].split(' ').reverse().join(' ')}`} fill={F.papier} />
      <polyline points={bords[0]} fill="none" stroke={F.filet} strokeWidth={5} />
      <polyline points={bords[1]} fill="none" stroke={F.filet} strokeWidth={5} />
      {[0, 1].map((ligne) =>
        Array.from({ length: N }, (_, i) => {
          const a = deb[ligne] + i * pas[ligne];
          const y = yPas(i);
          const x = cheminX(y) + (ligne === 0 ? -72 : 72) + (i % 2 ? 19 : -19);
          return <Empreinte key={`${ligne}-${i}`} x={x} y={y} o={p(f, a, a + 12)} c={ligne === 0 ? F.encre2 : F.orFonce} sens={i % 2 ? 1 : -1} />;
        }),
      )}
      {YS.map((y) => {
        const i = (830 - y) / 64;
        const r = deb[0] + i * pas[0];
        const q = deb[1] + i * pas[1];
        const idx = YS.indexOf(y);
        return (
          <g key={y}>
            <Rouleau x={118} y={y} o={p(f, r, r + 22)} />
            <Panier x={684} y={y} o={p(f, q, q + 22)} plein={p(f, d[1] + 60 + idx * 28, d[1] + 84 + idx * 28)} lueur={lueur} />
          </g>
        );
      })}
      <Libelle x={118} y={800} taille={28} graisse={600} opacite={p(f, deb[0], deb[0] + 30)}>{LIBELLES.apprentis}</Libelle>
      <Libelle x={684} y={800} taille={28} graisse={600} opacite={p(f, deb[1], deb[1] + 30)}>{LIBELLES.pourvoyeuses}</Libelle>
    </Scene>
  );
};

/* ---------- Plans 14 et fin : le document et les clés ---------- */

const Cle: React.FC<{ angle: number; c: string }> = ({ angle, c }) => (
  <g transform={`rotate(${angle})`}>
    <circle cx={0} cy={72} r={26} fill={c} stroke={F.orFonce} strokeWidth={4} />
    <circle cx={0} cy={72} r={10} fill={F.papier} stroke={F.orFonce} strokeWidth={3} />
    <rect x={-6} y={96} width={12} height={82} fill={c} stroke={F.orFonce} strokeWidth={3} />
    <path d="M6 148 H26 V158 H6 M6 166 H20 V176 H6" fill={c} stroke={F.orFonce} strokeWidth={3} />
  </g>
);

const Trousseau: React.FC<{ x: number; y: number; angle: number; o?: number }> = ({ x, y, angle, o = 1 }) => (
  <g opacity={o} transform={`translate(${x} ${y}) rotate(${angle})`}>
    <Cle angle={38} c={F.orClair} />
    <Cle angle={-38} c={F.orClair} />
    <Cle angle={0} c={F.or} />
    <circle r={40} fill="none" stroke={F.encre} strokeWidth={12} />
    <circle r={40} fill="none" stroke={F.or} strokeWidth={6} />
  </g>
);

const Document: React.FC<{ x: number; biffe: number; secousse?: number }> = ({ x, biffe, secousse = 0 }) => (
  <g transform={`translate(${x} ${Math.sin(secousse * Math.PI) * 7})`}>
    <path d="M-230 130 H180 L230 180 V770 H-230 Z" fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
    <path d="M180 130 V180 H230" fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <text x={0} y={262} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={56} fontWeight={500} fill={F.encre} opacity={1 - 0.5 * biffe}>{LIBELLES.proprietaires}</text>
    <line x1={-192} x2={lerp(-192, 192, biffe)} y1={246} y2={242} stroke={F.argile} strokeWidth={9} strokeLinecap="round" opacity={biffe > 0 ? 1 : 0} />
    <line x1={-190} x2={190} y1={298} y2={298} stroke={F.encre} strokeWidth={3} />
  </g>
);

/** Position du document dans le plan final, atteinte à la fin de p14. */
const X_DOC_FIN = 510;

const Desseins: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const biffe = p(f, d[0] + 110, d[0] + 158);
  const t0 = d[0] + 200;
  const chute = lin(f, t0, t0 + 28) ** 2;
  const rebond = Math.max(0, f - t0 - 28);
  const hop = Math.abs(Math.sin(rebond / 8)) * 22 * Math.exp(-rebond / 16);
  const y = lerp(60, 400, chute) - hop;
  const angle = lerp(-70, 6, chute) + 8 * Math.sin(rebond / 6) * Math.exp(-rebond / 22);
  const onde2 = (f - t0 - 28) / 45;
  const lignes = [660, 700, 740];
  // En fin de plan, le document glisse à sa place du plan final, trousseau compris : le raccord ne saute pas.
  const glisse = p(f, duree - 70, duree - 12);
  const xDoc = lerp(400, X_DOC_FIN, glisse);
  return (
    <Scene>
      <Document x={xDoc} biffe={biffe} secousse={lin(f, t0 + 26, t0 + 40)} />
      {lignes.map((yl, i) => (
        <line key={yl} x1={xDoc - 190} x2={xDoc + (i === 2 ? 70 : 190)} y1={yl} y2={yl} stroke={F.filet} strokeWidth={5} strokeLinecap="round" opacity={1 - glisse} />
      ))}
      {onde2 > 0 && onde2 < 1 ? <ellipse cx={400} cy={492} rx={120 + 90 * onde2} ry={100 + 60 * onde2} fill="none" stroke={F.or} strokeWidth={4} opacity={1 - onde2} /> : null}
      {f >= t0 ? <Trousseau x={xDoc} y={y} angle={angle} o={lin(f, t0, t0 + 8)} /> : null}
    </Scene>
  );
};

const Fin: React.FC<PropsIllustration> = ({ f }) => {
  const ecrit = lin(f, 40, 130);
  const lumiere = 0.5 + 0.5 * Math.sin(f / 16);
  return (
    <Scene>
      <defs>
        <clipPath id="ch16-ecrit">
          <rect x={280} y={620} width={460 * ecrit} height={100} />
        </clipPath>
      </defs>
      <circle cx={118} cy={750} r={108 + 6 * lumiere} fill={F.orClair} opacity={0.32} />
      <Thermometre x={118} y={150} h={560} l={72} niveau={0.9 + 0.1 * p(f, 0, 40)} graduations={false} />
      <Document x={X_DOC_FIN} biffe={1} />
      <Trousseau x={X_DOC_FIN} y={400} angle={6} />
      <g clipPath="url(#ch16-ecrit)">
        <text x={510} y={688} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={60} fontWeight={500} fill={F.orFonce}>{LIBELLES.intendants}</text>
      </g>
      {ecrit > 0 && ecrit < 1 ? <circle cx={280 + 460 * ecrit} cy={672} r={7} fill={F.or} /> : null}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: Ouverture,
  p2: AvecMission,
  p3: NabalDavid,
  p4: Israel,
  p5: NouveauTestament,
  p6: Job,
  p7: Josaphat,
  p8: Cyrus,
  p9: Barzillai,
  p10: Converge,
  p11: Ouvrages,
  p12: Coffrets,
  p13: Pourvoir,
  p14: Desseins,
  fin: Fin,
};
