import React from 'react';
import { interpolate, interpolateColors } from 'remotion';
import { Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F, PoliceF } from '../theme';
import { LIBELLES } from './libelles';

/* ------------------------------------------------------------------ */
/* Outils                                                              */
/* ------------------------------------------------------------------ */

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const lin = (f: number, a: number, b: number) => Math.max(0, Math.min(1, (f - a) / (b - a)));
const rad = (deg: number) => (deg * Math.PI) / 180;
const bez = (a: number, b: number, c: number, t: number) => (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t ** 2 * c;

/** Surface d'un liquide : ondule doucement entre x0 et x1, fermée jusqu'à `bas`. */
const vague = (x0: number, x1: number, y: number, bas: number, f: number, a = 5) => {
  let s = `M${x0} ${bas} L${x0} ${y}`;
  for (let x = x0; x <= x1; x += 16) s += ` L${x} ${y + Math.sin(x / 34 + f / 11) * a}`;
  return `${s} L${x1} ${y} L${x1} ${bas} Z`;
};

const Lueur: React.FC<{ id: string; x: number; y: number; r: number; o: number; c?: string }> = ({ id, x, y, r, o, c = F.orClair }) => (
  <g opacity={o}>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={c} stopOpacity={0.95} />
        <stop offset="0.55" stopColor={c} stopOpacity={0.35} />
        <stop offset="1" stopColor={c} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

/** Rayons de lumière qui descendent du haut, en éventail, et s'effacent vers le bas. */
const Rayons: React.FC<{ id: string; x: number; haut: number; bas: number; n: number; ecart: number; o: number; f: number }> = ({ id, x, haut, bas, n, ecart, o, f }) => (
  <g opacity={o}>
    <defs>
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={haut} y2={bas}>
        <stop offset="0" stopColor={F.orClair} stopOpacity={0} />
        <stop offset="0.14" stopColor={F.orClair} stopOpacity={0.85} />
        <stop offset="1" stopColor={F.orClair} stopOpacity={0} />
      </linearGradient>
    </defs>
    {Array.from({ length: n }, (_, i) => {
      const k = i - (n - 1) / 2;
      const xh = x + k * ecart * 0.22;
      const xb = x + k * ecart;
      const lh = ecart * 0.1;
      const lb = ecart * 0.34;
      return <path key={i} d={`M${xh - lh} ${haut} L${xh + lh} ${haut} L${xb + lb} ${bas} L${xb - lb} ${bas} Z`} fill={`url(#${id})`} opacity={0.72 + 0.28 * Math.sin(f / 19 + i * 1.7)} />;
    })}
  </g>
);

/** Une clé : l'anneau est à l'origine, la tige part vers la droite. */
const Cle: React.FC<{ x: number; y: number; rot?: number; s?: number; opacite?: number; ombre?: boolean }> = ({ x, y, rot = 0, s = 1, opacite = 1, ombre = false }) => {
  const forme = (rempli: string, trait: string, l: number) => (
    <>
      <circle r={36} fill={rempli} stroke={trait} strokeWidth={l} />
      <rect x={32} y={-9} width={122} height={18} rx={4} fill={rempli} stroke={trait} strokeWidth={l} />
      <path d="M118 9 V34 H132 V22 H142 V34 H154 V9 Z" fill={rempli} stroke={trait} strokeWidth={l} strokeLinejoin="round" />
    </>
  );
  return (
    <g opacity={opacite}>
      {ombre ? (
        <g transform={`translate(${x + 7} ${y + 9}) rotate(${rot}) scale(${s})`} opacity={0.2}>
          {forme(F.encre, 'none', 0)}
        </g>
      ) : null}
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        {forme(F.or, F.orFonce, 4)}
        <circle r={16} fill={F.parchemin} stroke={F.orFonce} strokeWidth={4} />
        <rect x={40} y={-3} width={70} height={4} fill={F.orClair} />
      </g>
    </g>
  );
};

/** Coffre vu de face. `x` : centre, `y` : bas. `ouverture` : 0 fermé, 1 couvercle levé derrière le contenu. */
const Coffre: React.FC<{ x: number; y: number; l: number; h: number; ouverture: number; children?: React.ReactNode; serrure?: boolean }> = ({ x, y, l, h, ouverture, children, serrure = true }) => {
  const H = h * 0.5;
  const haut = y - h;
  const ferme = Math.max(0, 1 - ouverture * 2);
  const leve = Math.max(0, ouverture * 2 - 1);
  const arche = (k: number) => `M${x - l / 2} ${haut} C${x - l / 2} ${haut - H * k} ${x - l * 0.3} ${haut - H * k} ${x} ${haut - H * k} C${x + l * 0.3} ${haut - H * k} ${x + l / 2} ${haut - H * k} ${x + l / 2} ${haut} Z`;
  return (
    <g>
      {leve > 0 ? <path d={arche(1.35 * leve)} fill={F.encre} stroke={F.encre} strokeWidth={5} /> : null}
      {children}
      <rect x={x - l / 2} y={haut} width={l} height={h} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      {[0.14, 0.86].map((k) => (
        <rect key={k} x={x - l / 2 + l * k - 11} y={haut} width={22} height={h} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
      ))}
      <rect x={x - l / 2} y={haut} width={l} height={12} fill={F.or} stroke={F.encre} strokeWidth={3} />
      {ferme > 0 ? (
        <g>
          <path d={arche(ferme)} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
          {[0.14, 0.86].map((k) => (
            <path key={k} d={`M${x - l / 2 + l * k - 11} ${haut} V${haut - H * ferme * 0.72} H${x - l / 2 + l * k + 11} V${haut} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
          ))}
        </g>
      ) : null}
      {serrure ? (
        <g>
          <rect x={x - 24} y={haut - 8} width={48} height={52} rx={6} fill={F.or} stroke={F.encre} strokeWidth={4} />
          <circle cx={x} cy={haut + 12} r={7} fill={F.encre} />
          <rect x={x - 3} y={haut + 14} width={6} height={16} fill={F.encre} />
        </g>
      ) : null}
    </g>
  );
};

/** Une plume : la pointe est à l'origine. */
const Plume: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d="M0 0 C22 -44 62 -112 128 -170 C148 -128 118 -66 72 -44 C58 -36 42 -26 0 0 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M0 0 C36 -56 76 -108 128 -170" fill="none" stroke={F.encre} strokeWidth={3} />
    {[0.42, 0.56, 0.7, 0.84].map((t) => (
      <path key={t} d={`M${118 * t} ${-156 * t} l${16} ${10}`} stroke={F.encre2} strokeWidth={2.5} strokeLinecap="round" />
    ))}
    <path d="M0 0 L9 -15 L15 -9 Z" fill={F.encre} />
  </g>
);

/** Une pièce vue par la tranche, posée à plat. `y` : bas de la pièce. */
const PieceCote: React.FC<{ x: number; y: number; rx: number; ep: number; rot?: number; opacite?: number }> = ({ x, y, rx, ep, rot = 0, opacite = 1 }) => {
  const ry = rx * 0.2;
  return (
    <g transform={`rotate(${rot} ${x} ${y})`} opacity={opacite}>
      <path d={`M${x - rx} ${y - ry} V${y - ry - ep} A${rx} ${ry} 0 0 1 ${x + rx} ${y - ry - ep} V${y - ry} A${rx} ${ry} 0 0 1 ${x - rx} ${y - ry} Z`} fill={F.or} stroke={F.orFonce} strokeWidth={3} />
      <ellipse cx={x} cy={y - ry - ep} rx={rx} ry={ry} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
    </g>
  );
};

/** Un sac d'argent : `y` est le bas du sac. */
const Sac: React.FC<{ x: number; y: number; s?: number; rot?: number; opacite?: number }> = ({ x, y, s = 1, rot = 0, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacite}>
    <path d="M-30 -120 C-96 -92 -104 -16 -64 0 H64 C104 -16 96 -92 30 -120 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4 / s} strokeLinejoin="round" />
    <path d="M-34 -152 Q-12 -134 0 -142 Q12 -134 34 -152 L30 -120 Q0 -112 -30 -120 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4 / s} strokeLinejoin="round" />
    <path d="M-32 -120 Q0 -110 32 -120" fill="none" stroke={F.orClair} strokeWidth={5 / s} strokeLinecap="round" />
    <Piece x={0} y={-52} r={27} />
  </g>
);

/** Une flamme qui tremble : la base est à l'origine. */
const Flamme: React.FC<{ x: number; y: number; s: number; f: number; i?: number }> = ({ x, y, s, f, i = 0 }) => {
  const b = 1 + Math.sin(f / 4.3 + i * 1.9) * 0.07;
  const c = Math.sin(f / 6.1 + i) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * b})`}>
      <path d={`M0 0 C-20 -8 -22 -30 ${c} -60 C22 -30 20 -8 0 0 Z`} fill={F.or} stroke={F.orFonce} strokeWidth={2.5 / Math.max(s, 0.2)} />
      <path d={`M0 -4 C-9 -8 -10 -20 ${c * 0.6} -34 C10 -20 9 -8 0 -4 Z`} fill={F.papier} />
    </g>
  );
};

/** Une coupe de verre : `y` est le bas du pied. `niveau` de 0 à 1. */
const Coupe: React.FC<{ id: string; x: number; y: number; s: number; niveau?: number; f?: number }> = ({ id, x, y, s, niveau = 0, f = 0 }) => {
  const COUPE = 'M-48 -160 C-48 -104 -28 -76 0 -68 C28 -76 48 -104 48 -160 Z';
  const yL = mix(-68, -146, niveau);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id={id}>
          <path d={COUPE} />
        </clipPath>
      </defs>
      <path d="M-6 -68 H6 V-16 C6 -8 28 -8 38 0 H-38 C-28 -8 -6 -8 -6 -16 Z" fill={F.papier} stroke={F.encre} strokeWidth={4 / s} strokeLinejoin="round" />
      <path d={COUPE} fill={F.papier} />
      {niveau > 0 ? (
        <g clipPath={`url(#${id})`}>
          <path d={vague(-52, 52, yL, 0, f, 2)} fill={F.orClair} />
          <path d={`M-52 ${yL} H52`} stroke={F.or} strokeWidth={3 / s} />
        </g>
      ) : null}
      <path d={COUPE} fill="none" stroke={F.encre} strokeWidth={4 / s} />
      <ellipse cx={0} cy={-160} rx={48} ry={8} fill={niveau > 0.98 ? F.orClair : F.parchemin} stroke={F.encre} strokeWidth={3.5 / s} />
    </g>
  );
};

/** Une plante : `t` de 0 à 1 fait pousser la tige, puis les paires de feuilles. `y` : pied de la tige. */
const Plante: React.FC<{ x: number; y: number; h: number; t: number; s?: number; bal?: number }> = ({ x, y, h, t, s = 1, bal = 0 }) => {
  if (t <= 0) return null;
  const ht = h * Math.min(1, t * 1.15);
  const xh = x + bal;
  const paires = Math.max(2, Math.round(h / 75));
  return (
    <g>
      <path d={`M${x} ${y} Q${x + bal * 0.2} ${y - ht * 0.55} ${xh} ${y - ht}`} fill="none" stroke={F.orFonce} strokeWidth={7 * s} strokeLinecap="round" />
      {Array.from({ length: paires }, (_, i) => {
        const a = (i + 1) / (paires + 1);
        const o = lin(t, a * 0.72, a * 0.72 + 0.22);
        if (o <= 0) return null;
        const yF = y - h * a;
        const xF = x + bal * a * a;
        const lg = 56 * s * (1 - a * 0.28) * o;
        return [-1, 1].map((sens) => (
          <path key={`${i}${sens}`} d={`M${xF} ${yF} C${xF + sens * lg * 0.35} ${yF - lg * 0.6} ${xF + sens * lg * 0.8} ${yF - lg * 0.6} ${xF + sens * lg} ${yF - lg * 0.26} C${xF + sens * lg * 0.8} ${yF + lg * 0.1} ${xF + sens * lg * 0.32} ${yF + lg * 0.16} ${xF} ${yF} Z`} fill={F.or} stroke={F.orFonce} strokeWidth={2.5} strokeLinejoin="round" />
        ));
      })}
      {t > 0.9 ? <path d={`M${xh} ${y - h - 2} C${xh - 18 * s} ${y - h - 22 * s} ${xh - 8 * s} ${y - h - 42 * s} ${xh} ${y - h - 48 * s} C${xh + 8 * s} ${y - h - 42 * s} ${xh + 18 * s} ${y - h - 22 * s} ${xh} ${y - h - 2} Z`} fill={F.orClair} stroke={F.orFonce} strokeWidth={2.5} opacity={lin(t, 0.9, 1)} /> : null}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 1 : le registre s'ouvre, la clé glisse sur la page             */
/* ------------------------------------------------------------------ */

const IlluOuvertureCh18: React.FC<PropsIllustration> = ({ f }) => {
  const L = 340;
  const H = 540;
  const Y = 170;
  const o = p(f, 34, 100);
  const c = Math.cos(o * Math.PI);
  const dos = 400 - 170 * (1 - o);
  const glisse = p(f, 104, 172);
  const lignes = (x: number) =>
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => <line key={i} x1={x + 34} x2={x + L - 34} y1={Y + 76 + i * 58} y2={Y + 76 + i * 58} stroke={F.filet} strokeWidth={4} />);
  const leve = Math.sin(Math.min(1, o * 1.2) * Math.PI);
  const cx = dos + 170 + 26 * glisse;
  const cy = mix(Y + 230, Y + 400, glisse) - 20 * leve;
  const cr = mix(-32, 12, glisse);
  return (
    <Scene>
      <ellipse cx={400} cy={Y + H + 24} rx={150 + 200 * o} ry={14} fill={F.filet} />
      {/* Plat du dessous et bloc de pages de droite. */}
      <rect x={dos - 6} y={Y - 10} width={L + 18} height={H + 20} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={dos} y={Y} width={L} height={H} fill={F.papier} stroke={F.encre} strokeWidth={3} />
      {lignes(dos)}
      {/* Le plat du dessus tourne autour du dos. */}
      <g transform={`translate(${dos} 0) scale(${c} 1)`}>
        {c >= 0 ? (
          <g>
            <rect x={-6} y={Y - 10} width={L + 18} height={H + 20} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
            <rect x={24} y={Y + 22} width={L - 42} height={H - 44} fill="none" stroke={F.orClair} strokeWidth={4} />
            <rect x={36} y={Y + 34} width={L - 66} height={H - 68} fill="none" stroke={F.orClair} strokeWidth={2} />
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M${i % 2 === 0 ? -6 : L + 12} ${i < 2 ? Y - 10 : Y + H + 10} h${i % 2 === 0 ? 46 : -46} L${i % 2 === 0 ? -6 : L + 12} ${i < 2 ? Y + 36 : Y + H - 36} Z`} fill={F.or} stroke={F.encre} strokeWidth={3} />
            ))}
          </g>
        ) : (
          <g>
            <rect x={-6} y={Y - 10} width={L + 18} height={H + 20} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
            <rect x={0} y={Y} width={L} height={H} fill={F.papier} stroke={F.encre} strokeWidth={3} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <line key={i} x1={34} x2={L - 34} y1={Y + 76 + i * 58} y2={Y + 76 + i * 58} stroke={F.filet} strokeWidth={4} />
            ))}
          </g>
        )}
      </g>
      <line x1={dos} x2={dos} y1={Y - 10} y2={Y + H + 10} stroke={F.encre} strokeWidth={5} />
      <Cle x={cx - 62} y={cy} rot={cr} s={1} ombre />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 2 : le coffre, sa clé, puis le registre                        */
/* ------------------------------------------------------------------ */

const IlluIntendant: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, 26);
  const passeC = p(f, d[1] - 30, d[1] - 8);
  const passeK = p(f, d[1] - 16, d[1] + 14);
  const passe = p(f, d[1] - 8, d[1] + 16);
  const sort = p(f, d[0] + 14, d[0] + 80);
  const balance = Math.sin(f / 15) * 11 * (1 - p(f, d[1] - 60, d[1] - 26));
  // La clé pend sous le coffre, puis vient se poser dans la marge du registre.
  const yPend = 440 + 74 * sort;
  const kx = mix(400, 500, passeK);
  const ky = mix(yPend, 122, passeK);
  const krot = mix(90 + balance, 0, passeK);
  const ks = mix(1, 0.62, passeK);

  const Y0 = 186;
  const PAS = 72;
  const N = 7;
  const debut = d[1] + 22;
  const parLigne = 44;
  const fin = debut + N * parLigne;
  const ligne = (i: number) => lin(f, debut + i * parLigne, debut + (i + 1) * parLigne - 6);
  const courante = Math.min(N - 1, Math.floor(Math.max(0, f - debut) / parLigne));
  const lc = ligne(courante);
  const xPlume = 212 + 376 * lc;
  const yPlume = Y0 + courante * PAS - Math.sin(f / 2.2) * 2 * (f < fin ? 1 : 0);
  const pose = p(f, d[1] + 366, d[1] + 392);
  const souligne = p(f, d[1] + 392, d[1] + 416);
  return (
    <Scene>
      {/* Le coffre et la corde de la clé. */}
      <g opacity={entree * (1 - passeC) * (1 - passeK)}>
        {sort > 0 ? <path d={`M400 430 L${400 + Math.sin(rad(balance)) * -(yPend - 430)} ${yPend}`} stroke={F.encre} strokeWidth={4} /> : null}
      </g>
      {passe > 0 ? (
        <g opacity={passe} transform={`translate(0 ${(1 - passe) * 70})`}>
          <rect x={148} y={54} width={504} height={806} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
          <rect x={160} y={66} width={480} height={782} fill={F.papier} stroke={F.encre} strokeWidth={3} />
          <line x1={196} x2={196} y1={66} y2={848} stroke={F.filet} strokeWidth={3} />
          {Array.from({ length: N }, (_, i) => (
            <line key={i} x1={212} x2={212 + 376 * ligne(i)} y1={Y0 + i * PAS} y2={Y0 + i * PAS} stroke={F.encre} strokeWidth={4} strokeLinecap="round" opacity={ligne(i) > 0 ? 1 : 0} />
          ))}
        </g>
      ) : null}
      <Cle x={kx + Math.sin(rad(balance)) * -(ky - 430) * (1 - passeK)} y={ky} rot={krot} s={ks} opacite={sort > 0 ? 1 : 0} />
      <g opacity={entree * (1 - passeC)} transform={`translate(0 ${-40 * passeC + (1 - entree) * 30})`}>
        <Coffre x={400} y={452} l={440} h={200} ouverture={0} />
      </g>
      {f > d[1] + 6 ? (
        <g opacity={p(f, d[1] + 6, d[1] + 22)}>
          <Plume x={xPlume} y={yPlume} rot={Math.sin(f / 7) * 3} />
        </g>
      ) : null}
      {pose > 0 ? (
        <g opacity={pose} transform={`translate(400 790) scale(${1.5 - 0.5 * pose})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={52} fontWeight={600} fill={F.orFonce}>
            {LIBELLES.rendreCompte}
          </text>
          <line x1={-166} x2={-166 + 332 * souligne} y1={18} y2={18} stroke={F.orFonce} strokeWidth={4} />
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 3 : l'espérance posée sur des pièces, puis sur le rocher       */
/* ------------------------------------------------------------------ */

const IlluEsperance: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 760;
  const N = 13;
  const EP = 22;
  const X = 205;
  const RX = 88;
  const HAUT = SOL - N * (EP + 4);
  const lumiere = p(f, d[0] + 330, d[0] + 420);
  const amp = 7 * p(f, d[0] + 110, d[0] + 170) + 34 * p(f, d[0] + 220, d[1] + 190);
  const osc = Math.sin(f / 7);
  const chute = lin(f, d[1] + 200, d[1] + 262);
  const pose = p(f, d[0] + 50, d[0] + 110);
  const XF = [141, 212, 276, 175, 242, 111, 297, 212, 137, 270, 176, 235, 114];
  const YF = [0, 0, 0, -26, -26, 0, 0, -50, -30, -30, -54, -54, -28];
  const RF = [-3, 2, 5, -9, 6, -14, 12, -4, 10, -8, 5, -13, 7];
  const estompe = 0.5 * p(f, d[2], d[2] + 40);

  // Le poids : sur la pile, puis glisse jusqu'au replat du rocher.
  const vol = p(f, d[1] + 210, d[1] + 290);
  const glisse = p(f, d[1] + 288, d[1] + 370);
  const dxHaut = amp * osc * (1 - lin(f, d[1] + 200, d[1] + 215));
  const xV = bez(X + dxHaut, 370, 470, vol);
  const yV = bez(HAUT, 380, 543, vol);
  const px = vol < 1 ? xV : mix(470, 625, glisse);
  const py = vol < 1 ? mix(mix(60, HAUT, pose), yV, vol > 0 ? 1 : 0) : mix(543, 570, lin(glisse, 0, 0.55));
  const prot = (vol < 1 ? 16 * vol + amp * osc * 0.22 * (1 - vol) : 16 * (1 - lin(glisse, 0, 0.55))) as number;
  const etiquette = p(f, d[1] + 8, d[1] + 34);
  const etiquette2 = p(f, d[1] + 46, d[1] + 74);
  return (
    <Scene>
      <Rayons id="p3-rayons" x={625} haut={20} bas={590} n={5} ecart={50} o={lumiere * (0.8 + 0.2 * p(f, d[1], d[1] + 30))} f={f} />
      <Lueur id="p3-lueur" x={625} y={62} r={140} o={lumiere} />
      {/* Le rocher. */}
      <path d="M402 760 C410 690 430 590 470 552 C490 536 510 560 530 570 L730 570 C750 580 766 680 772 760 Z" fill={F.encre2} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M452 660 L498 610 L470 700 M650 620 L610 680 L670 730 M540 640 L560 720" fill="none" stroke={F.encre} strokeWidth={3} opacity={0.5} strokeLinejoin="round" />
      <path d="M470 552 C490 536 510 560 530 570 L730 570" fill="none" stroke={F.orClair} strokeWidth={6} strokeLinecap="round" opacity={lumiere} />
      {/* La pile. */}
      <g>
        {Array.from({ length: N }, (_, i) => {
          const h = i / (N - 1);
          const dep = lin(chute * 1.5 - (1 - h) * 0.5, 0, 1);
          const x0 = X + amp * osc * Math.pow(h, 1.5);
          const y0 = SOL - i * (EP + 4);
          const r0 = amp * osc * 0.09 * h;
          const x = mix(x0, XF[i], dep);
          const y = mix(y0, SOL + YF[i], dep * dep);
          return <PieceCote key={i} x={x} y={y} rx={RX * (dep > 0 ? 0.86 : 1)} ep={EP} rot={mix(r0, RF[i], dep)} />;
        })}
      </g>
      {estompe > 0 ? <rect x={24} y={640} width={376} height={120} fill={F.parchemin} opacity={estompe} /> : null}
      <line x1={24} x2={776} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      {/* Le poids. */}
      <g transform={`translate(${px} ${py}) rotate(${prot})`} opacity={p(f, d[0] + 10, d[0] + 44)}>
        <circle cx={0} cy={-126} r={20} fill="none" stroke={F.encre} strokeWidth={9} />
        <path d="M-96 0 L-68 -108 H68 L96 0 Z" fill={F.encre} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d="M-60 -98 H60" stroke={F.encre2} strokeWidth={4} />
        <Libelle x={0} y={-40} taille={29} couleur={F.orClair} graisse={600}>
          {LIBELLES.esperance}
        </Libelle>
      </g>
      <Libelle x={205} y={824} taille={27} opacite={etiquette2} couleur={F.encre2}>
        {LIBELLES.incertaine}
      </Libelle>
      <Libelle x={590} y={824} taille={27} opacite={etiquette} couleur={F.orFonce} graisse={600}>
        {LIBELLES.certain}
      </Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 4 : la racine qui part de la pièce enterrée                    */
/* ------------------------------------------------------------------ */

const RACINES: { d: string; w: number; a: number; b: number }[] = [
  { d: 'M400 222 C398 262 404 300 400 345', w: 18, a: 40, b: 105 },
  { d: 'M400 345 C372 392 286 396 222 476', w: 12, a: 100, b: 165 },
  { d: 'M400 345 C430 392 520 396 585 476', w: 12, a: 150, b: 198 },
  { d: 'M400 345 C396 420 406 500 398 590', w: 14, a: 200, b: 285 },
  { d: 'M300 402 C288 424 300 444 288 470', w: 5, a: 235, b: 280 },
  { d: 'M500 402 C512 424 498 444 512 472', w: 5, a: 250, b: 295 },
  { d: 'M402 450 C440 470 468 486 486 530', w: 5, a: 275, b: 325 },
  { d: 'M400 490 C360 505 338 526 316 580', w: 5, a: 295, b: 345 },
  { d: 'M398 590 C360 640 300 650 232 730', w: 11, a: 340, b: 425 },
  { d: 'M398 590 C440 650 510 690 575 782', w: 11, a: 385, b: 465 },
  { d: 'M398 590 C400 660 392 730 398 820', w: 8, a: 400, b: 490 },
  { d: 'M336 648 C326 680 342 700 330 742', w: 5, a: 405, b: 450 },
  { d: 'M470 672 C462 706 476 736 462 778', w: 5, a: 425, b: 470 },
  { d: 'M397 716 C362 738 350 770 338 826', w: 5, a: 440, b: 490 },
  { d: 'M396 762 C430 782 440 812 470 852', w: 5, a: 455, b: 505 },
];

const IlluRacine: React.FC<PropsIllustration> = ({ f, d }) => {
  const MOTS = [
    { x: 182, y: 526, a: 165, tx: 222, ty: 476 },
    { x: 620, y: 526, a: 198, tx: 585, ty: 476 },
    { x: 196, y: 780, a: 425, tx: 232, ty: 730 },
    { x: 600, y: 834, a: 465, tx: 575, ty: 782 },
  ];
  const desir = p(f, d[1] + 70, d[1] + 100);
  const seve = p(f, d[1] + 70, d[1] + 110);
  const non = p(f, d[2] + 440, d[2] + 475);
  const eteint = 1 - 0.5 * non;
  return (
    <Scene>
      <rect x={28} y={112} width={744} height={768} rx={14} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      {[
        [80, 210, 7], [150, 640, 8], [660, 250, 7], [700, 620, 9], [90, 420, 6], [720, 420, 6], [120, 850, 8], [680, 860, 7], [270, 200, 5], [540, 210, 6], [300, 840, 6], [540, 600, 6],
      ].map(([x, y, r]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx={r * 1.5} ry={r} fill={F.cuirClair} opacity={0.65} />
      ))}
      {[90, 170, 630, 712].map((x, i) => (
        <path key={x} d={`M${x} 112 q-6 -22 -16 -30 M${x} 112 q0 -26 0 -38 M${x} 112 q6 -22 16 -30`} fill="none" stroke={F.encre2} strokeWidth={4} strokeLinecap="round" opacity={0.6 + (i % 2) * 0.2} />
      ))}
      <g opacity={eteint}>
        {RACINES.map((r) => {
          const t = lin(f, r.a, r.b);
          return t > 0 ? <path key={r.d} d={r.d} pathLength={1} fill="none" stroke={F.encre} strokeWidth={r.w + 5} strokeLinecap="round" strokeDasharray={`${t} 1`} /> : null;
        })}
        {RACINES.map((r) => {
          const t = lin(f, r.a, r.b);
          return t > 0 ? <path key={r.d} d={r.d} pathLength={1} fill="none" stroke={F.orClair} strokeWidth={r.w} strokeLinecap="round" strokeDasharray={`${t} 1`} /> : null;
        })}
        {seve > 0
          ? RACINES.filter((r) => r.w >= 8).map((r) => (
              <path key={r.d} d={r.d} pathLength={1} fill="none" stroke={F.papier} strokeWidth={r.w * 0.45} strokeLinecap="round" strokeDasharray="0.015 0.12" strokeDashoffset={-f * 0.0045} opacity={seve} />
            ))
          : null}
      </g>
      {MOTS.map((m, i) => {
        const o = p(f, m.a - 6, m.a + 16);
        return (
          <g key={i} opacity={o}>
            <circle cx={m.tx} cy={m.ty} r={9 * o} fill={F.argile} stroke={F.encre} strokeWidth={3} />
            <Libelle x={m.x} y={m.y} taille={31} couleur={F.papier} graisse={600}>
              {LIBELLES.racines[i]}
            </Libelle>
          </g>
        );
      })}
      <Lueur id="p4-lueur" x={400} y={174} r={120 + 10 * Math.sin(f / 9)} o={desir * 0.7 * eteint} />
      <Piece x={400} y={174} r={52} />
      <g opacity={desir}>
        <Libelle x={400} y={68} taille={34} graisse={600} couleur={F.orFonce}>
          {LIBELLES.desir}
        </Libelle>
        {non > 0 ? <line x1={232} x2={232 + 336 * non} y1={56} y2={56} stroke={F.argile} strokeWidth={6} strokeLinecap="round" /> : null}
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 5 : le calendrier tourne, l'investissement grandit             */
/* ------------------------------------------------------------------ */

const IlluCalendrier: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const T = 84;
  const X = 278;
  const Y = 74;
  const W = 244;
  const H = 214;
  const PAGES = Math.floor((duree - 70 - d[0]) / T);
  const k = Math.max(0, Math.min(PAGES, Math.floor((f - d[0]) / T)));
  const local = f - d[0] - k * T;
  const tourne = f < d[0] || k >= PAGES ? 0 : p(local, 0, 22);
  const SOL = 790;
  const EP = 16;
  const XP = 230;
  const atterrie = (i: number) => d[0] + Math.floor(i / 2) * T + 22 + (i % 2) * 12 + 32;
  const pile = Array.from({ length: PAGES * 2 }, (_, i) => atterrie(i)).filter((t) => f >= t).length;
  const Page: React.FC<{ n: number }> = ({ n }) => (
    <g>
      <rect x={X} y={Y} width={W} height={H} fill={F.papier} stroke={F.encre} strokeWidth={3} />
      {Array.from({ length: 24 }, (_, i) => {
        const cx = X + 18 + (i % 6) * 36;
        const cy = Y + 20 + Math.floor(i / 6) * 46;
        const marque = i === (n * 7 + 3) % 24;
        return <rect key={i} x={cx} y={cy} width={28} height={36} rx={3} fill={marque ? F.or : F.parchemin} stroke={marque ? F.orFonce : F.filet} strokeWidth={2.5} />;
      })}
    </g>
  );
  const bascule = p(f, d[1] + 280, d[1] + 310);
  return (
    <Scene>
      <line x1={70} x2={760} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      {/* Le calendrier. */}
      <rect x={X - 6} y={24} width={W + 12} height={54} rx={5} fill={F.argile} stroke={F.encre} strokeWidth={4} />
      {[0.2, 0.5, 0.8].map((a) => (
        <rect key={a} x={X + W * a - 6} y={10} width={12} height={32} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={3} />
      ))}
      <Page n={k + 1} />
      {tourne < 1 ? (
        <g transform={`translate(0 ${Y}) scale(1 ${1 - tourne}) translate(0 ${-Y})`} opacity={1 - tourne * 0.2}>
          <Page n={k} />
        </g>
      ) : null}
      {/* La pile qui grandit. */}
      {Array.from({ length: pile }, (_, i) => (
        <PieceCote key={i} x={XP + (i % 3 === 1 ? 3 : i % 3 === 2 ? -3 : 0)} y={SOL - i * EP} rx={78} ep={EP - 3} />
      ))}
      {/* Les pièces en vol. */}
      {Array.from({ length: PAGES * 2 }, (_, i) => {
        const ar = atterrie(i);
        const t = lin(f, ar - 32, ar);
        if (t <= 0 || t >= 1) return null;
        const yCible = SOL - i * EP - 34;
        return <Piece key={i} x={bez(400, 330, XP, t)} y={bez(Y + H + 30, Y + H - 10, yCible, t * t)} r={24} />;
      })}
      {/* La coupe vide. */}
      <Coupe id="p5-coupe" x={590} y={SOL} s={1.72} niveau={0} />
      <g opacity={1 - bascule}>
        <Libelle x={XP} y={842} taille={29} graisse={600}>{LIBELLES.investissement}</Libelle>
      </g>
      <g opacity={bascule}>
        <Libelle x={XP} y={842} taille={29} graisse={600} couleur={F.orFonce}>{LIBELLES.accumulation}</Libelle>
      </g>
      <Libelle x={590} y={842} taille={29} couleur={F.encre2}>{LIBELLES.donner}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 6 : Nabal, la porte qui claque, dix traits, la cruche fendue   */
/* ------------------------------------------------------------------ */

const IlluNabal: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 800;
  const claque = d[0] + 170;
  const ferme = lin(f, claque, claque + 7);
  const ouvert = 0.2 + 0.8 * ferme * ferme;
  const rebond = f > claque + 7 ? Math.sin((f - claque - 7) / 2.2) * 0.02 * Math.exp(-(f - claque - 7) / 10) : 0;
  const choc = lin(f, claque + 6, claque + 30);
  const saut = f > claque + 6 ? Math.abs(Math.sin((f - claque - 6) / 4)) * 16 * Math.exp(-(f - claque - 6) / 12) : 0;
  const entree = p(f, 0, 24);

  const debutTraits = d[1] + 6;
  const PAS = 12.5;
  const fend = p(f, d[2] + 8, d[2] + 42);
  const ecart = p(f, d[2] + 50, d[2] + 110);
  const fuite = lin(f, d[2] + 60, d[2] + 240);
  const deborde = lin(fuite, 0.3, 1);

  const CRUCHE = 'M-30 -226 H30 L24 -198 C22 -184 54 -160 58 -104 C62 -56 44 -14 28 0 H-28 C-44 -14 -62 -56 -58 -104 C-54 -160 -22 -184 -24 -198 Z';
  const FENTE = 'M4 -226 L-8 -186 L12 -148 L-10 -108 L10 -70 L-6 -34 L4 0';
  const Cruche = () => (
    <g>
      <path d="M46 -160 C96 -176 96 -86 52 -84" fill="none" stroke={F.encre} strokeWidth={15} strokeLinecap="round" />
      <path d="M46 -160 C96 -176 96 -86 52 -84" fill="none" stroke={F.argile} strokeWidth={9} strokeLinecap="round" />
      <path d={CRUCHE} fill={F.argile} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-44 -150 C-56 -110 -50 -60 -36 -30" fill="none" stroke={F.orClair} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
      <rect x={-33} y={-232} width={66} height={12} rx={5} fill={F.argile} stroke={F.encre} strokeWidth={4} />
    </g>
  );
  return (
    <Scene>
      <line x1={24} x2={776} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      <g opacity={entree}>
        {/* L'intérieur, chaud tant que la porte est ouverte. */}
        <rect x={110} y={192} width={300} height={SOL - 192} fill={F.orClair} opacity={1} />
        <rect x={110} y={192} width={300} height={SOL - 192} fill={F.encre} opacity={0.15} />
        {/* La porte, sur ses gonds à gauche. */}
        <g transform={`translate(110 0) scale(${ouvert + rebond} 1)`}>
          <rect x={0} y={192} width={300} height={SOL - 192} fill={F.cuir} stroke={F.encre} strokeWidth={4} vectorEffect="non-scaling-stroke" />
          {[75, 150, 225].map((x) => (
            <line key={x} x1={x} x2={x} y1={192} y2={SOL} stroke={F.encre} strokeWidth={3} vectorEffect="non-scaling-stroke" opacity={0.6} />
          ))}
          {[300, 660].map((y) => (
            <rect key={y} x={0} y={y} width={300} height={22} fill={F.cuirClair} stroke={F.encre} strokeWidth={2} vectorEffect="non-scaling-stroke" />
          ))}
          <circle cx={258} cy={510} r={15} fill="none" stroke={F.orClair} strokeWidth={6} />
        </g>
        {/* Montants et linteau. */}
        <rect x={70} y={192} width={40} height={SOL - 192} fill={F.filet} stroke={F.encre} strokeWidth={4} />
        <rect x={410} y={192} width={40} height={SOL - 192} fill={F.filet} stroke={F.encre} strokeWidth={4} />
        <rect x={46} y={116} width={428} height={78} rx={3} fill={F.papier} stroke={F.encre} strokeWidth={5} />
      </g>
      {/* Le choc. */}
      {choc > 0 && choc < 1
        ? [-1, 1].flatMap((sens) =>
            [260, 420, 580].map((y, i) => (
              <line key={`${sens}${y}`} x1={sens < 0 ? 58 - choc * 18 : 462 + choc * 18} x2={sens < 0 ? 58 - choc * 50 - i * 2 : 462 + choc * 50 + i * 2} y1={y} y2={y + (i - 1) * 16} stroke={F.encre} strokeWidth={5} strokeLinecap="round" opacity={1 - choc} />
            )),
          )
        : null}
      {/* Les dix traits. */}
      {Array.from({ length: 10 }, (_, i) => {
        const t = lin(f, debutTraits + i * PAS, debutTraits + i * PAS + 9);
        const x = 86 + i * 39;
        return t > 0 ? <line key={i} x1={x + 7} y1={130} x2={x + 7 - 14 * t} y2={130 + 50 * t} stroke={F.argile} strokeWidth={7} strokeLinecap="round" /> : null;
      })}
      <Libelle x={260} y={92} taille={32} graisse={600} couleur={F.argile} opacite={p(f, d[1] - 6, d[1] + 16)}>
        {LIBELLES.dixJours}
      </Libelle>
      {/* La table, le pain, la cruche. */}
      <g opacity={entree}>
        <rect x={500} y={600} width={18} height={SOL - 600} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
        <rect x={716} y={600} width={18} height={SOL - 600} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
        <rect x={486} y={584} width={262} height={22} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <g transform={`translate(552 ${584 - saut * 0.7})`}>
          <path d="M-60 0 C-72 -46 -36 -74 0 -74 C36 -74 72 -46 60 0 Z" fill={F.orClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          {[-26, 0, 26].map((x) => (
            <path key={x} d={`M${x - 8} -58 q10 12 16 28`} fill="none" stroke={F.orFonce} strokeWidth={4} strokeLinecap="round" />
          ))}
        </g>
        {/* Ce qui s'écoule de la cruche. */}
        {fuite > 0 ? (
          <g>
            {deborde > 0 ? <ellipse cx={754} cy={SOL - 3} rx={6 + 32 * deborde} ry={3 + 4 * deborde} fill={F.orClair} stroke={F.or} strokeWidth={2} /> : null}
            <rect x={654 - 40 * fuite} y={579} width={36 + 40 * fuite + 58 * lin(fuite, 0, 0.3)} height={7} rx={3} fill={F.orClair} stroke={F.or} strokeWidth={2} />
            {deborde > 0
              ? Array.from({ length: 5 }, (_, i) => {
                  const loc = ((f - d[2]) / 34 + i / 5) % 1;
                  return <ellipse key={i} cx={753 + ((i * 3) % 5) - 2} cy={590 + loc * loc * (SOL - 596)} rx={5} ry={8} fill={F.orClair} stroke={F.or} strokeWidth={1.5} />;
                })
              : null}
          </g>
        ) : null}
        <g transform={`translate(672 ${584 - saut})`}>
          <defs>
            <clipPath id="p6-g">
              <path d={`${FENTE} L-120 0 L-120 -240 L4 -240 Z`} />
            </clipPath>
            <clipPath id="p6-d">
              <path d={`${FENTE} L120 0 L120 -240 L4 -240 Z`} />
            </clipPath>
          </defs>
          <g clipPath="url(#p6-g)" transform={`translate(${-7 * ecart} 0) rotate(${-3.2 * ecart} 0 0)`}>
            <Cruche />
          </g>
          <g transform={`translate(${7 * ecart} 0) rotate(${3.2 * ecart} 0 0)`}>
            <g clipPath="url(#p6-d)">
              <Cruche />
            </g>
          </g>
          {fend > 0 ? <path d={FENTE} pathLength={1} fill="none" stroke={F.encre} strokeWidth={4} strokeDasharray={`${fend} 1`} strokeLinejoin="round" opacity={1 - ecart * 0.6} /> : null}
        </g>
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 7 : Assuérus, la couronne en baudruche                         */
/* ------------------------------------------------------------------ */

const CouronneBaudruche: React.FC<{ x: number; y: number; k: number; mou: number; f: number }> = ({ x, y, k, mou, f }) => {
  const H = 214 * k + 10;
  const W = 330 * Math.max(0.42, k) * (1 + mou * 0.25);
  const respire = 1 + Math.sin(f / 13) * 0.012 * (1 - mou);
  // Cinq pointes gonflées ; quand l'air s'en va, elles s'affaissent et se plissent.
  const XT = [-0.5, -0.25, 0, 0.25, 0.5];
  const YT = [0.94, 0.72, 1.08, 0.72, 0.94];
  const MOU = [10, -7, 14, -9, 6];
  const pointes = XT.map((a, i) => ({ x: a * W + mou * (i - 2) * 6, y: -H * YT[i] * (1 - mou * 0.32) + mou * MOU[i] }));
  const yV = -H * 0.44;
  const creux = [-0.375, -0.125, 0.125, 0.375].map((a) => a * W);
  const rd = W * 0.085;
  let d = `M${-0.46 * W} 0 C${-0.6 * W} ${-H * 0.3} ${pointes[0].x - rd * 1.1} ${pointes[0].y} ${pointes[0].x} ${pointes[0].y}`;
  creux.forEach((c, i) => {
    const a = pointes[i];
    const b = pointes[i + 1];
    d += ` C${a.x + rd} ${a.y} ${c} ${yV - H * 0.16} ${c} ${yV}`;
    d += ` C${c} ${yV - H * 0.16} ${b.x - rd} ${b.y} ${b.x} ${b.y}`;
  });
  d += ` C${pointes[4].x + rd * 1.1} ${pointes[4].y} ${0.6 * W} ${-H * 0.3} ${0.46 * W} 0 Q0 ${10 * k} ${-0.46 * W} 0 Z`;
  const hb = Math.max(14, 46 * k);
  return (
    <g transform={`translate(${x} ${y}) scale(${respire})`}>
      <path d={d} fill={F.or} stroke={F.orFonce} strokeWidth={4.5} strokeLinejoin="round" />
      {k > 0.34
        ? pointes.map((t, i) => <path key={i} d={`M${t.x - rd * 0.62} ${t.y + H * 0.28} C${t.x - rd * 0.72} ${t.y + H * 0.13} ${t.x - rd * 0.48} ${t.y + H * 0.05} ${t.x - rd * 0.14} ${t.y + H * 0.04}`} fill="none" stroke={F.papier} strokeWidth={5.5} strokeLinecap="round" opacity={0.85} />)
        : null}
      {mou > 0.4
        ? [-0.3, -0.12, 0.08, 0.26].map((a) => <path key={a} d={`M${a * W} -6 q6 ${-H * 0.2} -4 ${-H * 0.42}`} fill="none" stroke={F.orFonce} strokeWidth={3} strokeLinecap="round" opacity={lin(mou, 0.4, 0.8)} />)
        : null}
      {pointes.map((t, i) => (
        <circle key={i} cx={t.x} cy={t.y} r={Math.max(4, 12 * k)} fill={F.argile} stroke={F.encre} strokeWidth={3} />
      ))}
      <rect x={-W * 0.5} y={-hb * 0.62} width={W} height={hb} rx={hb / 2} fill={F.orClair} stroke={F.orFonce} strokeWidth={4.5} />
      {k > 0.3 ? [-0.3, 0, 0.3].map((a) => <circle key={a} cx={a * W} cy={-hb * 0.12} r={10 * k} fill={F.argile} stroke={F.encre} strokeWidth={3} />) : null}
      <path d={`M-9 ${hb * 0.38 - 1} L9 ${hb * 0.38 - 1} L5 ${hb * 0.38 + 15} L-5 ${hb * 0.38 + 15} Z`} fill={F.orFonce} stroke={F.encre} strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  );
};

const IlluAssuerus: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 800;
  const infle = lin(f, d[0] + 6, d[1] - 34);
  const defl = p(f, d[1] + 250, d[1] + 305);
  const k = mix(mix(0.2, 1, Math.sqrt(infle)), 0.3, defl);
  const yC = mix(mix(576, 462, p(f, d[0] + 6, d[0] + 110)), 584, p(f, d[1] + 280, d[1] + 335));
  const porte = p(f, d[1] + 120, d[1] + 146);
  const roule = interpolate(f, [d[0], d[0] + 300], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - (1 - t) ** 3 });
  const texte = p(f, d[0] + 272, d[0] + 304);
  const X = 180;
  const W = 440;
  const air = defl > 0 && defl < 1;
  return (
    <Scene>
      <line x1={24} x2={776} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      {/* Le compteur. */}
      <rect x={X - 16} y={24} width={W + 32} height={96} rx={12} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={X} y={38} width={W} height={68} rx={5} fill={F.papier} stroke={F.encre} strokeWidth={3} />
      <defs>
        <clipPath id="p7-fen">
          <rect x={X + 2} y={40} width={W - 4} height={64} />
        </clipPath>
      </defs>
      <g clipPath="url(#p7-fen)">
        {Array.from({ length: 8 }, (_, c) => (
          <g key={c} opacity={1 - texte}>
            {Array.from({ length: 6 }, (_, i) => {
              const y = 40 + (((i * 20 + roule * (2400 + c * 90)) % 120) - 18);
              return <rect key={i} x={X + 14 + c * 53} y={y} width={40} height={7} rx={3} fill={F.encre2} />;
            })}
            {c > 0 ? <line x1={X + 7 + c * 53} x2={X + 7 + c * 53} y1={40} y2={106} stroke={F.filet} strokeWidth={3} /> : null}
          </g>
        ))}
        <g transform={`translate(0 ${(1 - texte) * 62})`} opacity={texte}>
          <Libelle x={X + W / 2} y={84} taille={34} graisse={600}>
            {LIBELLES.jours}
          </Libelle>
        </g>
      </g>
      {/* La porte du palais. */}
      <rect x={560} y={330} width={200} height={SOL - 330} fill={F.orClair} stroke={F.encre} strokeWidth={5} />
      <g transform={`translate(760 0) scale(${0.2 + 0.8 * porte} 1)`}>
        <rect x={-200} y={330} width={200} height={SOL - 330} fill={F.cuir} stroke={F.encre} strokeWidth={4} vectorEffect="non-scaling-stroke" />
        {[-134, -67].map((x) => (
          <line key={x} x1={x} x2={x} y1={330} y2={SOL} stroke={F.encre} strokeWidth={3} vectorEffect="non-scaling-stroke" opacity={0.6} />
        ))}
        <circle cx={-170} cy={570} r={11} fill={F.or} stroke={F.encre} strokeWidth={3} vectorEffect="non-scaling-stroke" />
      </g>
      <path d="M544 330 L660 262 L776 330 Z" fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <rect x={546} y={330} width={14} height={SOL - 330} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <rect x={760} y={330} width={14} height={SOL - 330} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      {/* Le coffre ouvert, plein de pièces. */}
      <Coffre x={290} y={SOL} l={360} h={170} ouverture={1} serrure={false}>
        {[
          [160, 634, 30], [214, 618, 32], [272, 610, 34], [334, 616, 32], [394, 626, 30], [420, 640, 22], [186, 612, 22], [244, 590, 24], [304, 590, 24], [364, 600, 22],
        ].map(([x, y, r], i) => (
          <Piece key={i} x={x} y={y} r={r} />
        ))}
      </Coffre>
      {/* La ficelle, la couronne, l'air qui s'échappe. */}
      <path d={`M290 ${yC + 46 * k * 0.38 + 14} Q${290 + Math.sin(f / 11) * 10} ${(yC + 620) / 2} 290 612`} fill="none" stroke={F.encre} strokeWidth={3} />
      <CouronneBaudruche x={290} y={yC} k={k} mou={defl} f={f} />
      {air
        ? [0, 1, 2, 3].map((i) => {
            const t = ((f / 9 + i / 4) % 1);
            return <path key={i} d={`M${290 + 195 * k + t * 40} ${yC - 30 - i * 30 - t * 20} q10 -8 22 0`} fill="none" stroke={F.encre2} strokeWidth={4} strokeLinecap="round" opacity={1 - t} />;
          })
        : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 8 : Haman, la trompette, puis les sacs sur la bulle            */
/* ------------------------------------------------------------------ */

const IlluHaman: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const entree = p(f, 0, 26);
  const part = p(f, d[1] - 8, d[1] + 34);
  const fin = d[1] - 16;
  const bas = 770;
  const ecrase = lin(f, d[1] + 70, duree - 60);
  const a1 = d[1] + 30;
  const a2 = d[1] + 120;
  const a3 = d[1] + 215;
  const coup = (a: number) => (f > a + 40 ? Math.sin((f - a - 40) / 3) * 9 * Math.exp(-(f - a - 40) / 11) : 0);
  const hB = 270 - 190 * ecrase - Math.abs(coup(a1) + coup(a2) + coup(a3));
  const wB = 440 + 150 * ecrase;
  const yB = bas - hB;
  const chutes = [a1, a2, a3].map((a) => p(f, a, a + 42));
  const SACS = [
    { x: 300, cible: yB },
    { x: 500, cible: yB },
    { x: 400, cible: yB - 142 },
  ];
  const Cor = (
    <g>
      <path d="M92 214 H380 C430 214 470 190 548 120 V332 C470 262 430 244 380 244 H92 Z" fill={F.or} stroke={F.orFonce} strokeWidth={5} strokeLinejoin="round" />
      <path d="M100 222 H380" stroke={F.orClair} strokeWidth={6} strokeLinecap="round" />
      <path d="M170 244 C160 300 170 322 215 322 H310 C350 322 360 290 350 244" fill="none" stroke={F.orFonce} strokeWidth={22} />
      <path d="M170 244 C160 300 170 322 215 322 H310 C350 322 360 290 350 244" fill="none" stroke={F.or} strokeWidth={14} />
      {[210, 260, 310].map((x) => (
        <g key={x}>
          <rect x={x - 9} y={166} width={18} height={50} fill={F.orClair} stroke={F.orFonce} strokeWidth={4} />
          <rect x={x - 15} y={154} width={30} height={13} rx={4} fill={F.or} stroke={F.orFonce} strokeWidth={4} />
        </g>
      ))}
      <path d="M92 208 L54 192 V266 L92 250 Z" fill={F.orClair} stroke={F.orFonce} strokeWidth={5} strokeLinejoin="round" />
      <ellipse cx={548} cy={226} rx={18} ry={106} fill={F.orFonce} stroke={F.orFonce} strokeWidth={4} />
    </g>
  );
  return (
    <Scene>
      <g opacity={entree * (1 - part)} transform={`translate(0 ${150 - 90 * part})`}>
        {Cor}
        {Array.from({ length: 14 }, (_, i) => {
          const P = 84;
          const n = Math.floor((f + (i * P) / 14) / P);
          const loc = ((f + (i * P) / 14) % P) / P;
          const nee = f - loc * P;
          if (nee < 20 || nee > fin) return null;
          const graine = (n * 37 + i * 53) % 100;
          const vx = 118 + (graine % 5) * 16;
          const vy = -118 + (graine % 7) * 36;
          const x = 566 + vx * loc * 1.05;
          const y = 226 + vy * loc * 1.2 + 400 * loc * loc;
          return <Piece key={i} x={x} y={y} r={17 + (graine % 3) * 3.5} opacite={lin(loc, 0, 0.1) * (1 - lin(loc, 0.76, 1))} />;
        })}
        {[0, 1, 2].map((i) => {
          const t = ((f / 34 + i / 3) % 1);
          return <path key={i} d={`M${590 + t * 130} ${226 - 150 - t * 40} q${34} ${10} ${60} ${40}`} fill="none" stroke={F.or} strokeWidth={5} strokeLinecap="round" opacity={(1 - t) * 0.7} />;
        })}
      </g>
      {/* La bulle de parole, vide, écrasée. */}
      <g opacity={p(f, d[1] - 4, d[1] + 24)}>
        <path d={`M${400 - wB * 0.3} ${bas - 2} L${400 - wB * 0.34} ${bas + 42} L${400 - wB * 0.14} ${bas - 2} Z`} fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <rect x={400 - wB / 2} y={yB} width={wB} height={hB} rx={Math.min(hB / 2, 70)} fill={F.papier} stroke={F.encre} strokeWidth={5} />
        <rect x={400 - wB * 0.3 - 3} y={bas - 8} width={wB * 0.16 + 6} height={10} fill={F.papier} />
        <Libelle x={400} y={868} taille={30} graisse={600} couleur={F.encre2}>
          {LIBELLES.sansVoix}
        </Libelle>
      </g>
      {SACS.map((s, i) => {
        const c = chutes[i];
        return c > 0 ? <Sac key={i} x={s.x} y={mix(-30, s.cible + 2, c * c)} s={1} /> : null;
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 9 : la pièce entre, la médaille sort                           */
/* ------------------------------------------------------------------ */

const IlluDistributeur: React.FC<PropsIllustration> = ({ f, d }) => {
  const T = [d[0] + 22, d[0] + 58, d[0] + 100, d[0] + 116, d[0] + 170, d[0] + 196];
  const borne = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  const px = interpolate(f, T, [300, 300, 395, 422, 212, 186], borne);
  const py = interpolate(f, T, [56, 283, 300, 374, 411, 520], borne);
  const roule = interpolate(f, T, [0, 0, 240, 280, -200, -200], borne);
  const visible = f >= d[0] && f < T[5];
  const sort = p(f, T[5], T[5] + 54);
  const monte = p(f, d[1] + 20, d[1] + 110);
  const eclat = p(f, d[1] + 70, d[1] + 120);
  const engr = interpolate(f, [T[1], T[5]], [0, 720], borne);
  const yMed = mix(660, 400, monte);
  const xMed = mix(470, 650, sort);
  const Coin = (
    <g transform={`translate(${px} ${py}) rotate(${roule})`}>
      <Piece x={0} y={0} r={30} />
      <line x1={-14} x2={14} y1={0} y2={0} stroke={F.orFonce} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
  return (
    <Scene>
      {/* Pièce au-dessus de la fente (passe derrière le corps de la machine). */}
      {visible ? <g opacity={p(f, d[0], d[0] + 18)}>{Coin}</g> : null}
      {/* Médaille : sort de la goulotte. */}
      {eclat > 0
        ? [-40, -14, 12, 38, 142, 168, 194, 220].map((deg, i) => {
            const a = rad(deg);
            const l = 84 + (26 + 8 * Math.sin(f / 7 + i)) * eclat;
            return <line key={i} x1={650 + Math.cos(a) * 80} y1={yMed + Math.sin(a) * 80} x2={650 + Math.cos(a) * l} y2={yMed + Math.sin(a) * l} stroke={F.or} strokeWidth={6} strokeLinecap="round" opacity={eclat} />;
          })
        : null}
      {monte > 0 ? <rect x={612} y={yMed + 62} width={76} height={722 - yMed - 62} fill={F.papier} stroke={F.encre} strokeWidth={4} /> : null}
      {sort > 0 ? (
        <g transform={`translate(${xMed} ${yMed})`}>
          <path d="M-36 -128 L-6 -50 L12 -58 L-14 -128 Z" fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          <path d="M36 -128 L6 -50 L-12 -58 L14 -128 Z" fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          <circle r={62} fill={F.or} stroke={F.orFonce} strokeWidth={5} />
          <circle r={46} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
          <path d="M0 -30 L9 -9 L31 -9 L13 5 L20 27 L0 14 L-20 27 L-13 5 L-31 -9 L-9 -9 Z" fill={F.or} stroke={F.orFonce} strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      ) : null}
      {/* La machine. */}
      <rect x={238} y={148} width={124} height={26} rx={5} fill={F.encre} />
      <rect x={110} y={170} width={390} height={630} rx={16} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={160} y={210} width={290} height={320} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={5} />
      <defs>
        <clipPath id="p9-fen">
          <rect x={163} y={213} width={284} height={314} rx={6} />
        </clipPath>
      </defs>
      <g clipPath="url(#p9-fen)">
        <g transform={`translate(372 478) rotate(${engr})`}>
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={-7} y={-40} width={14} height={14} fill={F.encre2} transform={`rotate(${i * 45})`} />
          ))}
          <circle r={30} fill={F.encre2} />
          <circle r={9} fill={F.papier} />
        </g>
        {/* Rampes. */}
        <line x1={163} y1={302} x2={402} y2={338} stroke={F.encre} strokeWidth={10} strokeLinecap="round" />
        <line x1={447} y1={402} x2={208} y2={448} stroke={F.encre} strokeWidth={10} strokeLinecap="round" />
        {visible ? Coin : null}
      </g>
      {/* Plaque. */}
      <rect x={150} y={562} width={310} height={66} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <Libelle x={305} y={606} taille={31} graisse={600}>{LIBELLES.compliments}</Libelle>
      {/* Tablette. */}
      {[150, 460].map((x) => [662, 766].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={8} fill={F.orClair} stroke={F.encre} strokeWidth={3} />))}
      <rect x={498} y={722} width={266} height={18} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <rect x={744} y={738} width={16} height={62} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      <line x1={40} x2={776} y1={800} y2={800} stroke={F.encre} strokeWidth={4} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 10 : trois vignettes                                           */
/* ------------------------------------------------------------------ */

const IlluTroisRiches: React.FC<PropsIllustration> = ({ f, d }) => {
  const W = 720;
  const H = 272;
  const X = 40;
  const Ys = [20, 310, 600];
  const app = d.map((a) => p(f, a - 14, a + 14));
  const actif = (i: number) => (i < 2 ? 1 - 0.3 * p(f, d[i + 1] - 8, d[i + 1] + 12) : 1);

  // 1. Le coffre plein, verrouillé, sous la lune.
  const v1 = d[0];
  const lune = p(f, v1 + 90, v1 + 165);
  const cou = p(f, v1 + 80, v1 + 108);
  const verrou = p(f, v1 + 112, v1 + 130);

  // 2. Le sac qui barre le chemin.
  const v2 = d[1];
  const avance = p(f, v2 + 20, v2 + 110);
  const sacC = p(f, v2 + 90, v2 + 120);
  const recul = f > v2 + 120 ? Math.sin((f - v2 - 120) / 3) * 8 * Math.exp(-(f - v2 - 120) / 16) : 0;

  // 3. Le cœur qui devient pierre.
  const v3 = d[2];
  const dur = p(f, v3 + 30, v3 + 190);
  const bat = 1 + Math.abs(Math.sin(f / 9)) * 0.1 * (1 - dur);
  const T = (a: number, b: number) => (mix(a, b, dur));
  const coeurPierre = `M${T(0, 2)} ${T(42, 46)} C${T(-64, -50)} ${T(2, 40)} ${T(-54, -72)} ${T(-48, -20)} ${T(-24, -34)} ${T(-50, -48)} C${T(-10, -20)} ${T(-51, -54)} ${T(0, -8)} ${T(-40, -54)} ${T(0, 4)} ${T(-30, -50)} C${T(0, 14)} ${T(-40, -52)} ${T(10, 24)} ${T(-51, -50)} ${T(24, 36)} ${T(-50, -44)} C${T(54, 70)} ${T(-48, -24)} ${T(64, 52)} ${T(2, 36)} ${T(0, 2)} ${T(42, 46)} Z`;
  const teinte = interpolateColors(dur, [0, 1], [F.argile, F.encre2]);
  const Cadre: React.FC<{ i: number; nuit?: boolean; children: React.ReactNode }> = ({ i, nuit, children }) => (
    <g opacity={app[i] * actif(i)} transform={`translate(${X + (1 - app[i]) * 60} ${Ys[i]})`}>
      <defs>
        <clipPath id={`p10-c${i}`}>
          <rect x={3} y={3} width={W - 6} height={H - 6} rx={13} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={W} height={H} rx={16} fill={nuit ? F.encre : F.papier} />
      <g clipPath={`url(#p10-c${i})`}>{children}</g>
      <rect x={0} y={0} width={W} height={H} rx={16} fill="none" stroke={F.encre} strokeWidth={5} />
      {LIBELLES.riches[i].map((t, j) => (
        <Libelle key={t} x={32} y={126 + j * 40} taille={31} ancre="start" graisse={600} couleur={nuit ? F.papier : F.encre}>
          {t}
        </Libelle>
      ))}
    </g>
  );
  return (
    <Scene>
      <Cadre i={0} nuit>
        {[[300, 36], [356, 90], [520, 34], [680, 150], [420, 62], [620, 26], [250, 92]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill={F.papier} opacity={lune * (0.55 + 0.45 * Math.sin(f / 13 + i * 2))} />
        ))}
        <g transform={`translate(622 ${mix(120, 72, lune)})`} opacity={lune}>
          <circle r={36} fill={F.orClair} />
          <circle cx={15} cy={-9} r={32} fill={F.encre} />
        </g>
        <rect x={0} y={250} width={720} height={30} fill={F.encre2} />
        <Coffre x={430} y={250} l={210} h={96} ouverture={1 - cou} serrure={false}>
          {[
            [356, 152, 19], [400, 142, 21], [446, 140, 21], [492, 148, 20], [378, 126, 16], [428, 118, 17], [472, 124, 16],
          ].map(([x, y, r], i) => {
            const c = p(f, v1 + i * 9, v1 + i * 9 + 22);
            return <Piece key={i} x={x} y={mix(-30, y, c)} r={r} opacite={c > 0 && cou < 0.5 ? 1 : 0} />;
          })}
        </Coffre>
        {/* Le cadenas se ferme. */}
        <g opacity={p(f, v1 + 104, v1 + 114)} transform={`translate(430 ${mix(150, 170, verrou)})`}>
          <path d="M-13 2 V-13 C-13 -30 13 -30 13 -13 V2" fill="none" stroke={F.papier} strokeWidth={6} />
          <rect x={-22} y={0} width={44} height={36} rx={5} fill={F.or} stroke={F.orClair} strokeWidth={3} />
          <circle cx={0} cy={15} r={5} fill={F.encre} />
        </g>
      </Cadre>
      <Cadre i={1}>
        <Lueur id="p10-lueur" x={702} y={68} r={110} o={0.9} />
        <path d="M256 250 C340 250 400 210 470 170 C540 130 600 90 720 66" fill="none" stroke={F.filet} strokeWidth={46} strokeLinecap="round" />
        <path d="M256 250 C340 250 400 210 470 170 C540 130 600 90 720 66" fill="none" stroke={F.encre2} strokeWidth={3} strokeDasharray="14 14" />
        {/* Celui qui avance est un simple point. */}
        <circle cx={bez(276, 330, 376, avance) - Math.abs(recul)} cy={bez(246, 246, 214, avance)} r={15} fill={F.argile} stroke={F.encre} strokeWidth={4} />
        <Sac x={512} y={mix(-20, 214, sacC * sacC) + recul * 0.3} s={1.1} opacite={sacC > 0 ? 1 : 0} />
      </Cadre>
      <Cadre i={2}>
        <g transform={`translate(490 136) scale(${1.95 * bat})`}>
          <path d={coeurPierre} fill={teinte} stroke={F.encre} strokeWidth={3 / 1.95} strokeLinejoin="round" />
          <path d="M-34 -28 L-14 -6 L-38 14 M-14 -6 L10 -24 L30 -6 L10 18 L-14 -6 M30 -6 L46 -24 M10 18 L6 38 M-38 14 L-10 30" fill="none" stroke={F.encre} strokeWidth={1.8} opacity={p(f, v3 + 150, v3 + 215)} strokeLinejoin="round" />
        </g>
      </Cadre>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 11 : Lot et Abraham, le fil qui casse                          */
/* ------------------------------------------------------------------ */

const Caillou: React.FC<{ x: number; y: number; c: string }> = ({ x, y, c }) => (
  <g transform={`translate(${x} ${y}) scale(1.3)`}>
    <path d="M-30 18 C-38 -4 -22 -24 -4 -24 C16 -28 36 -10 32 12 C30 24 -22 28 -30 18 Z" fill={c} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M-14 -10 C-8 -16 0 -18 8 -16" fill="none" stroke={F.papier} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
  </g>
);

const IlluLot: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const monte = p(f, d[0] + 10, d[0] + 210);
  const eau = lin(f, d[0] + 170, d[0] + 260);
  const part = p(f, d[1] + 10, duree - 70);
  const reste = p(f, d[1] + 40, duree - 60);
  const casse = d[1] + 118;
  const brise = lin(f, casse, casse + 20);
  // Abraham à gauche, Lot à droite.
  const aX = mix(358, 330, reste);
  const aY = mix(mix(735, 560, monte), 385, reste);
  const lX = bez(442, 490, 640, part);
  const lY = bez(mix(735, 560, monte), 370, 262, part);
  const dist = Math.hypot(lX - aX, lY - aY);
  const tension = lin(dist, 118, 220);
  const mx = (aX + lX) / 2;
  const my = (aY + lY) / 2;
  const creux = 42 * (1 - tension);
  const vibre = tension > 0.6 && brise === 0 ? Math.sin(f * 2.1) * 3.5 * tension : 0;
  const CHEMINS = ['M400 812 V590', 'M400 590 C400 480 330 370 150 96', 'M400 590 C400 470 510 340 640 262'];
  const RIVIERE = 'M750 140 C706 112 668 168 618 150 C574 134 556 98 528 150';
  const noms = p(f, d[0] + 20, d[0] + 44);
  return (
    <Scene>
      {/* La plaine, où l'eau se met à couler. */}
      <path d="M470 300 C430 210 470 74 570 40 C660 12 766 28 778 92 V300 C760 346 520 356 470 300 Z" fill={F.orClair} opacity={0.42} stroke={F.or} strokeWidth={3} />
      {[
        [560, 92], [642, 74], [726, 72], [752, 262], [722, 214], [492, 236], [482, 164],
      ].map(([x, y]) => (
        <path key={`${x}${y}`} d={`M${x} ${y} q-5 -14 -12 -20 M${x} ${y} q0 -16 0 -26 M${x} ${y} q5 -14 12 -20`} fill="none" stroke={F.orFonce} strokeWidth={4} strokeLinecap="round" />
      ))}
      {eau > 0 ? (
        <g>
          <path d={RIVIERE} pathLength={1} fill="none" stroke={F.or} strokeWidth={34} strokeLinecap="round" strokeDasharray={`${eau} 1`} />
          <path d={RIVIERE} pathLength={1} fill="none" stroke={F.papier} strokeWidth={28} strokeLinecap="round" strokeDasharray={`${eau} 1`} />
          <path d={RIVIERE} pathLength={1} fill="none" stroke={F.or} strokeWidth={4} strokeLinecap="round" strokeDasharray="0.05 0.07" strokeDashoffset={-f * 0.008} opacity={lin(eau, 0.2, 0.6)} />
        </g>
      ) : null}
      {CHEMINS.map((t) => (
        <path key={t} d={t} fill="none" stroke={F.filet} strokeWidth={168} strokeLinecap="round" />
      ))}
      {CHEMINS.map((t) => (
        <path key={t} d={t} fill="none" stroke={F.papier} strokeWidth={156} strokeLinecap="round" />
      ))}
      {CHEMINS.map((t) => (
        <path key={t} d={t} fill="none" stroke={F.encre2} strokeWidth={4} strokeDasharray="20 22" opacity={0.6} />
      ))}
      {/* Le fil. */}
      {brise === 0 ? (
        <path d={`M${aX} ${aY} Q${mx + vibre} ${my + creux + vibre} ${lX} ${lY}`} fill="none" stroke={tension > 0.75 ? F.argile : F.encre} strokeWidth={mix(6, 3.5, tension)} />
      ) : (
        <g>
          <path d={`M${aX} ${aY} Q${mix(mx, aX + 30, brise)} ${mix(my, aY - 6, brise)} ${mix(mx - 3, aX + 58, brise)} ${mix(my + 3, aY + 10, brise)}`} fill="none" stroke={F.argile} strokeWidth={4} strokeLinecap="round" />
          <path d={`M${lX} ${lY} Q${mix(mx, lX - 30, brise)} ${mix(my, lY + 6, brise)} ${mix(mx + 3, lX - 58, brise)} ${mix(my - 3, lY - 8, brise)}`} fill="none" stroke={F.argile} strokeWidth={4} strokeLinecap="round" />
          {brise < 1
            ? [0, 1, 2, 3, 4, 5].map((i) => {
                const a = rad(i * 60 + 20);
                return <line key={i} x1={mx + Math.cos(a) * 10} y1={my + Math.sin(a) * 10} x2={mx + Math.cos(a) * (14 + 30 * brise)} y2={my + Math.sin(a) * (14 + 30 * brise)} stroke={F.argile} strokeWidth={4.5} strokeLinecap="round" opacity={1 - brise} />;
              })
            : null}
        </g>
      )}
      <g transform={`translate(${aX} ${aY}) scale(0.8)`}><Caillou x={0} y={0} c={F.encre2} /></g>
      <g transform={`translate(${lX} ${lY}) scale(0.8)`}><Caillou x={0} y={0} c={F.cuirClair} /></g>
      <g opacity={noms}>
        <rect x={aX - 92} y={aY + 34} width={122} height={38} rx={7} fill={F.parchemin} stroke={F.filet} strokeWidth={2} />
        <Libelle x={aX - 31} y={aY + 62} taille={26} graisse={600}>{LIBELLES.abraham}</Libelle>
        <rect x={lX - 8} y={lY + 34} width={62} height={38} rx={7} fill={F.parchemin} stroke={F.filet} strokeWidth={2} />
        <Libelle x={lX + 23} y={lY + 62} taille={26} graisse={600}>{LIBELLES.lot}</Libelle>
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 12 : la pièce monte, revient et retombe sur le CV              */
/* ------------------------------------------------------------------ */

const IlluCV: React.FC<PropsIllustration> = ({ f, d }) => {
  const monte = p(f, d[0], d[1] - 8);
  const YH = 240;
  const demi = p(f, d[1] + 215, d[1] + 245);
  const tombe = lin(f, d[1] + 240, d[1] + 284);
  const YBAS = 762;
  const yP = tombe > 0 ? mix(YH, YBAS, tombe * tombe) : mix(838, YH, monte);
  const hesite = f > d[1] + 120 && tombe === 0 ? Math.sin(f / 3.2) * 4 * lin(f, d[1] + 120, d[1] + 215) : 0;
  const cv = p(f, d[1] + 70, d[1] + 120);
  const eteint = 1 - 0.68 * p(f, d[1] + 245, d[1] + 300);
  const lum = p(f, 0, 30) * eteint;
  const choc = lin(f, d[1] + 284, d[1] + 310);
  const tourne = Math.cos(demi * Math.PI);
  return (
    <Scene>
      <Rayons id="p12-rayons" x={400} haut={20} bas={228} n={7} ecart={62} o={lum} f={f} />
      <Lueur id="p12-lueur" x={400} y={68} r={150} o={lum} />
      {/* La traînée. */}
      {Array.from({ length: 12 }, (_, i) => {
        const y = 830 - i * 50;
        const vu = mix(838, YH, monte) < y - 30;
        return vu ? <circle key={i} cx={400} cy={y} r={5} fill={F.or} opacity={0.75 * (1 - p(f, d[1] + 200, d[1] + 245)) * (y < YH + 70 ? 0 : 1) * (1 - cv)} /> : null;
      })}
      {/* La feuille. */}
      <g opacity={cv} transform={`translate(0 ${(1 - cv) * 110})`}>
        <path d="M216 540 H560 L596 576 V880 H216 Z" fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d="M560 540 V576 H596" fill={F.parchemin} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <text x={406} y={636} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={76} fontWeight={600} fill={F.encre}>
          {LIBELLES.cv}
        </text>
        {[670, 716, 762, 808, 850].map((y) => (
          <line key={y} x1={258} x2={554} y1={y} y2={y} stroke={F.filet} strokeWidth={5} strokeLinecap="round" />
        ))}
      </g>
      {choc > 0 && choc < 1 ? <ellipse cx={406} cy={YBAS} rx={46 + 80 * choc} ry={14 + 26 * choc} fill="none" stroke={F.or} strokeWidth={5} opacity={1 - choc} /> : null}
      <g transform={`translate(${tombe > 0 ? mix(400, 406, tombe) : 400 + hesite} ${yP}) scale(${Math.max(0.12, Math.abs(tourne))} 1)`}>
        <Piece x={0} y={0} r={46} />
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 13 : Néhémie, cent cinquante couverts, puis le rouleau         */
/* ------------------------------------------------------------------ */

const IlluNehemie: React.FC<PropsIllustration> = ({ f, d }) => {
  const C = 25;
  const R = 6;
  const debut = d[0] + 8;
  const finN = d[1] - 26;
  const n = Math.floor(lin(f, debut, finN) * C * R);
  const tBourse = lin(f, debut, finN);
  const glisse = p(f, d[1] - 18, d[1] + 26);
  const Ty = mix(246, 540, glisse);
  const totalO = p(f, finN - 6, finN + 14);
  const rayon = p(f, d[1] + 14, d[1] + 60) * (0.8 + 0.2 * p(f, d[1] + 190, d[1] + 230));
  const app = p(f, d[1] + 26, d[1] + 56);
  const ouvre = p(f, d[1] + 62, d[1] + 120);
  const mot = p(f, d[1] + 100, d[1] + 130);
  const hO = 8 + 232 * ouvre;
  const yC = 268;
  return (
    <Scene>
      <Rayons id="p13-rayons" x={400} haut={20} bas={yC + 40} n={5} ecart={100} o={rayon} f={f} />
      <Lueur id="p13-lueur" x={400} y={60} r={140} o={rayon} />
      <g transform={`translate(0 ${Ty})`}>
        <rect x={24} y={0} width={610} height={286} rx={8} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
        <rect x={36} y={12} width={586} height={262} rx={5} fill="none" stroke={F.cuir} strokeWidth={3} />
        {Array.from({ length: Math.min(n, C * R) }, (_, i) => {
          const c = Math.floor(i / R);
          const r = i % R;
          const x = 48 + c * 23.5;
          const y = 42 + r * 42;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={9} fill={F.papier} stroke={F.encre} strokeWidth={1.5} />
              <circle cx={x} cy={y} r={4.5} fill="none" stroke={F.filet} strokeWidth={1.5} />
              <line x1={x - 4} x2={x - 4} y1={y - 22} y2={y - 11} stroke={F.papier} strokeWidth={2} strokeLinecap="round" />
              <line x1={x + 4} x2={x + 4} y1={y - 22} y2={y - 11} stroke={F.papier} strokeWidth={2} strokeLinecap="round" />
            </g>
          );
        })}
        {/* La bourse se vide au bout de la table. */}
        <g transform={`translate(716 214) scale(${0.9 * (1 - 0.18 * tBourse)} ${0.9 * (1 - 0.56 * tBourse)})`}>
          <path d="M-20 -98 C-82 -70 -92 44 -56 72 H56 C92 44 82 -70 20 -98 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
          <path d="M-24 -116 Q0 -100 24 -116 L20 -98 Q0 -92 -20 -98 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <path d="M-22 -98 Q0 -88 22 -98" fill="none" stroke={F.orClair} strokeWidth={5} strokeLinecap="round" />
        </g>
        {Array.from({ length: 16 }, (_, i) => {
          const a = debut + i * ((finN - debut) / 16);
          const t = lin(f, a, a + 24);
          if (t <= 0 || t >= 1) return null;
          return <Piece key={i} x={mix(712, 606, t)} y={bez(150 + 40 * tBourse, 50 + 40 * tBourse, 90 + (i % 5) * 40, t)} r={13} opacite={1 - lin(t, 0.8, 1)} />;
        })}
        <Libelle x={330} y={330} taille={34} graisse={600} opacite={totalO} couleur={F.orFonce}>
          {LIBELLES.cent}
        </Libelle>
      </g>
      {/* Le rouleau. */}
      {app > 0 ? (
        <g opacity={app}>
          <rect x={190} y={yC - hO / 2} width={420} height={hO} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <g opacity={mot}>
            <text x={400} y={yC + 20} textAnchor="middle" fontFamily={PoliceF.serif} fontStyle="italic" fontSize={62} fontWeight={400} fill={F.orFonce}>
              {LIBELLES.souviens}
            </text>
          </g>
          {[yC - hO / 2 - 14, yC + hO / 2 - 14].map((y, i) => (
            <g key={i}>
              <rect x={172} y={y} width={456} height={28} rx={14} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
              <circle cx={166} cy={y + 14} r={12} fill={F.or} stroke={F.encre} strokeWidth={3} />
              <circle cx={634} cy={y + 14} r={12} fill={F.or} stroke={F.encre} strokeWidth={3} />
            </g>
          ))}
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 14 : l'escalier, les deux premières marches                    */
/* ------------------------------------------------------------------ */

const Marche: React.FC<{ x: number; l: number; h: number; sol: number; rangs: number; cols: number; t: number }> = ({ x, l, h, sol, rangs, cols, t }) => {
  const hb = h / rangs;
  const lb = l / cols;
  const total = rangs * cols;
  const pose = Math.floor(t * total + 0.001);
  return (
    <g>
      {Array.from({ length: Math.min(pose, total) }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = r % 2 === 0 ? i % cols : cols - 1 - (i % cols);
        return <rect key={i} x={x + c * lb} y={sol - (r + 1) * hb} width={lb} height={hb} fill={F.papier} stroke={F.encre2} strokeWidth={2.5} />;
      })}
      {t >= 1 ? <rect x={x} y={sol - h} width={l} height={h} fill="none" stroke={F.encre} strokeWidth={5} /> : null}
    </g>
  );
};

const IlluPaliers: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 800;
  const X1 = 240;
  const L1 = 276;
  const H1 = 190;
  const X2 = X1 + L1;
  const L2 = 260;
  const H2 = 400;
  const T1 = SOL - H1;
  const T2 = SOL - H2;
  const plan = p(f, d[0] + 20, d[0] + 110);
  const m1 = lin(f, d[1], d[1] + 70);
  const m2 = lin(f, d[2], d[2] + 60);
  const nom1 = p(f, d[1] + 60, d[1] + 84);
  const nom2 = p(f, d[2] + 50, d[2] + 76);
  const graine = lin(f, d[1] + 86, d[1] + 116);
  const pousse = lin(f, d[1] + 116, d[1] + 230);
  const XG = X1 + L1 / 2;
  const sites = [X2 + 34, X2 + 82, X2 + 130, X2 + 178, X2 + 226];
  const COINS = 10;
  const vol = (j: number) => {
    const a = j < 3 ? d[1] + j * 20 : d[2] + (j - 3) * 16;
    return lin(f, a, a + 30);
  };
  const partis = Array.from({ length: 6 }, (_, j) => vol(j)).filter((t) => t > 0).length;
  const bal = Math.sin(f / 19) * 3;
  return (
    <Scene>
      <line x1={24} x2={776} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      {/* L'intention : le plan de l'escalier. */}
      <path d={`M${X1} ${SOL} V${T1} H${X2} V${T2} H${X2 + L2} V${SOL}`} pathLength={1} fill="none" stroke={F.encre2} strokeWidth={3} strokeDasharray={plan < 1 ? `${plan} 1` : '0.012 0.012'} strokeDashoffset={plan < 1 ? 0 : -f * 0.0006} opacity={0.75} />
      {/* Les biens. */}
      {Array.from({ length: COINS - partis }, (_, i) => (
        <PieceCote key={i} x={128} y={SOL - i * 20} rx={70} ep={16} />
      ))}
      <Libelle x={128} y={850} taille={27} graisse={600} opacite={p(f, d[0] + 8, d[0] + 34)}>{LIBELLES.biens}</Libelle>
      <Marche x={X1} l={L1} h={H1} sol={SOL} rangs={4} cols={6} t={m1} />
      <Marche x={X2} l={L2} h={H2} sol={SOL} rangs={8} cols={5} t={m2} />
      {Array.from({ length: 6 }, (_, j) => {
        const t = vol(j);
        if (t <= 0 || t >= 1) return null;
        const yD = SOL - (COINS - 1 - j) * 20 - 30;
        const xB = j < 3 ? XG : X2 + L2 / 2;
        const yB = j < 3 ? SOL - 70 : SOL - 200;
        return <Piece key={j} x={bez(128, (128 + xB) / 2, xB, t)} y={bez(yD, Math.min(yD, yB) - 120, yB, t)} r={26} opacite={1 - lin(t, 0.8, 1)} />;
      })}
      <g opacity={nom1}>
        <rect x={XG - 112} y={SOL - 118} width={224} height={52} rx={6} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
        <Libelle x={XG} y={SOL - 82} taille={29} graisse={600}>{LIBELLES.faireBien}</Libelle>
      </g>
      <g opacity={nom2}>
        <rect x={X2 + L2 / 2 - 118} y={SOL - 262} width={236} height={92} rx={6} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
        <Libelle x={X2 + L2 / 2} y={SOL - 226} taille={29} graisse={600}>{LIBELLES.bonnes[0]}</Libelle>
        <Libelle x={X2 + L2 / 2} y={SOL - 190} taille={29} graisse={600}>{LIBELLES.bonnes[1]}</Libelle>
      </g>
      {/* La graine, puis la plante. */}
      {graine > 0 && pousse === 0 ? <ellipse cx={XG} cy={mix(T1 - 180, T1 - 7, graine * graine)} rx={12} ry={8} fill={F.cuir} stroke={F.encre} strokeWidth={3} /> : null}
      <Plante x={XG} y={T1} h={160} t={pousse} bal={bal} />
      {/* La plante se multiplie en rangée. */}
      {sites.map((x, i) => {
        const a = d[2] + 70 + i * 30;
        const v = lin(f, a, a + 26);
        const g = lin(f, a + 26, a + 86);
        return (
          <g key={x}>
            {v > 0 && v < 1 ? <ellipse cx={bez(XG, (XG + x) / 2, x, v)} cy={bez(T1 - 150, T2 - 190, T2 - 7, v)} rx={9} ry={6} fill={F.cuir} stroke={F.encre} strokeWidth={2.5} /> : null}
            <Plante x={x} y={T2} h={122} t={g} s={0.42} bal={Math.sin(f / 19 + i) * 2} />
          </g>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 15 : le tuteur et l'arrosoir                                   */
/* ------------------------------------------------------------------ */

const IlluTuteur: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 780;
  const XT = 340;
  const BASE = 752;
  const pours = [
    [d[1] + 35, d[1] + 68],
    [d[1] + 75, d[1] + 108],
    [d[1] + 115, d[1] + 150],
  ];
  const debitActif = pours.some(([a, b]) => f >= a && f < b);
  const incl = pours.reduce((m, [a, b]) => Math.max(m, p(f, a - 8, a + 2) * (1 - p(f, b - 2, b + 6))), 0);
  const leve = p(f, d[1] + 184, d[1] + 200);
  const can = -30 * incl + 8 * leve;
  const arrivee = p(f, d[0] + 120, d[0] + 180);
  const CX = 640;
  const CY = 190 - 26 * leve;
  const croit = pours.reduce((s, [a, b]) => s + lin(f, a, b + 10), 0);
  const haut = 150 + 95 * croit;
  const t = lin(haut, 0, 435);
  const ecarte = p(f, d[1] + 320, d[1] + 388);
  const lien = 1 - p(f, d[1] + 300, d[1] + 322);
  const balance = Math.sin((f - (d[1] + 320)) / 9) * 16 * lin(f, d[1] + 320, d[1] + 360) * (1 - lin(f, d[1] + 370, d[1] + 540));
  const pieu = p(f, d[0] + 16, d[0] + 60);
  const liens = [BASE - 90, BASE - 220, BASE - 350].filter((y) => haut > BASE - y);
  const rot = rad(-30);
  const rx = CX + Math.cos(rot) * -178 - Math.sin(rot) * -44;
  const ry = CY + Math.sin(rot) * -178 + Math.cos(rot) * -44;
  return (
    <Scene>
      <line x1={24} x2={776} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      <path d={`M120 ${SOL} C200 ${SOL - 50} 470 ${SOL - 52} 590 ${SOL} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      {/* Le tuteur. */}
      <g transform={`translate(${-136 * ecarte} ${20 * ecarte}) rotate(${-16 * ecarte} 296 ${SOL - 28})`} opacity={pieu}>
        <rect x={290} y={mix(SOL - 300, SOL - 560, pieu) + (1 - pieu) * 0} width={13} height={520} rx={4} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
        <rect x={290} y={mix(SOL - 300, SOL - 560, pieu) + 500} width={13} height={0} />
      </g>
      <Plante x={XT} y={BASE} h={Math.min(haut, 435)} t={Math.min(1, t * 2.2)} s={1} bal={balance} />
      {lien > 0
        ? liens.map((y) => (
            <g key={y} opacity={lien * p(f, d[0] + 58, d[0] + 88)}>
              <path d={`M296 ${y} Q322 ${y + 12} ${XT + 2} ${y}`} fill="none" stroke={F.argile} strokeWidth={5} strokeLinecap="round" />
              <circle cx={296} cy={y} r={5} fill={F.argile} />
            </g>
          ))
        : null}
      {/* L'eau. */}
      {debitActif
        ? Array.from({ length: 16 }, (_, i) => {
            const loc = ((f / 22 + i / 16) % 1);
            const v = (i % 4) * 5 - 8;
            const x = rx + (i % 5 - 2) * 6 + loc * (v - 18);
            const y = ry + 8 + loc * loc * (BASE - ry - 8);
            return <ellipse key={i} cx={x} cy={y} rx={4.5} ry={7.5} fill={F.orClair} stroke={F.or} strokeWidth={1.5} />;
          })
        : null}
      {/* L'arrosoir. */}
      <g transform={`translate(${CX + (1 - arrivee) * 240} ${CY}) rotate(${can})`} opacity={arrivee}>
        <path d="M84 -46 C142 -70 146 54 84 40" fill="none" stroke={F.encre} strokeWidth={12} />
        <path d="M84 -46 C142 -70 146 54 84 40" fill="none" stroke={F.cuirClair} strokeWidth={6} />
        <path d="M-82 34 L-170 -38 L-160 -50 L-82 -6 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d="M-158 -66 L-186 -28 L-172 -18 L-146 -54 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <rect x={-84} y={-60} width={170} height={132} rx={14} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
        <path d="M-30 -60 C-30 -96 30 -96 30 -60" fill="none" stroke={F.encre} strokeWidth={8} />
        <rect x={-84} y={-22} width={170} height={10} fill={F.cuir} />
      </g>
      {/* Les fois. */}
      {LIBELLES.fois.map((t2, i) => {
        const a = i < 3 ? pours[i][0] : d[1] + 186;
        const on = p(f, a - 6, a + 14);
        const X = [106, 293, 482, 672][i];
        return (
          <Libelle key={t2} x={X} y={848} taille={26} graisse={600} couleur={i === 3 ? F.argile : F.encre} opacite={on}>
            {t2}
          </Libelle>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 16 : le verre gradué déborde                                   */
/* ------------------------------------------------------------------ */

const IlluVerre: React.FC<PropsIllustration> = ({ f, d }) => {
  const X0 = 240;
  const X1 = 500;
  const BAS = 730;
  const HAUT = 110;
  const MARQUE = 340;
  const debut = d[0] + 8;
  const plein = debut + 240;
  const n = lin(f, debut, plein);
  const y = mix(BAS - 4, HAUT + 2, n);
  const passe = p(f, debut + 150, debut + 176);
  const deb = lin(f, plein, plein + 74);
  const CONTOUR = `M${X0} ${HAUT} L${X0 + 10} ${BAS - 16} Q${X0 + 12} ${BAS} ${X0 + 30} ${BAS} H${X1 - 30} Q${X1 - 12} ${BAS} ${X1 - 10} ${BAS - 16} L${X1} ${HAUT}`;
  const SOL = 782;
  return (
    <Scene>
      <defs>
        <clipPath id="p16-v">
          <path d={`${CONTOUR} Z`} />
        </clipPath>
      </defs>
      <line x1={24} x2={776} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      {/* Le débit qui ne s'arrête pas. */}
      <rect x={X0 + 122} y={62} width={16} height={y - 62} fill={F.orClair} />
      <rect x={X0 + 122} y={62} width={16} height={y - 62} fill="none" stroke={F.or} strokeWidth={2} />
      <path d={`M${X0 + 20} 36 H${X0 + 130} V62`} fill="none" stroke={F.encre} strokeWidth={36} strokeLinejoin="round" />
      <path d={`M${X0 + 22} 36 H${X0 + 130} V60`} fill="none" stroke={F.filet} strokeWidth={28} strokeLinejoin="round" />
      <rect x={X0 + 62} y={6} width={16} height={14} fill={F.encre} />
      <rect x={X0 + 44} y={2} width={52} height={14} rx={5} fill={F.or} stroke={F.encre} strokeWidth={3} />
      {/* La flaque. */}
      {deb > 0 ? <ellipse cx={(X0 + X1) / 2} cy={SOL - 2} rx={150 + 200 * deb} ry={7 + 8 * deb} fill={F.orClair} stroke={F.or} strokeWidth={3} /> : null}
      {/* Le verre. */}
      <path d={`${CONTOUR} Z`} fill={F.papier} />
      <g clipPath="url(#p16-v)">
        <path d={vague(X0 - 10, X1 + 10, y, BAS + 4, f, n > 0.98 ? 2 : 5)} fill={F.orClair} />
        <path d={`M${X0 - 10} ${y} H${X1 + 10}`} stroke={F.or} strokeWidth={3} />
      </g>
      <path d={CONTOUR} fill="none" stroke={F.encre} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      {Array.from({ length: 10 }, (_, i) => {
        const yt = BAS - 60 - i * 60;
        return <line key={i} x1={X0 + 18} x2={X0 + (i % 2 ? 42 : 58)} y1={yt} y2={yt} stroke={F.encre2} strokeWidth={3} />;
      })}
      {/* Pied. */}
      <path d={`M${X0 + 30} ${BAS} H${X1 - 30} L${X1} ${SOL} H${X0} Z`} fill={F.filet} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {/* Le trait marqué. */}
      <line x1={X0 + 6} x2={X1 + 44} y1={MARQUE} y2={MARQUE} stroke={F.argile} strokeWidth={7} strokeLinecap="round" />
      <Libelle x={X1 + 58} y={MARQUE + 10} taille={29} ancre="start" graisse={600} couleur={F.argile}>{LIBELLES.tenu}</Libelle>
      {/* Plus que le trait. */}
      <g opacity={passe}>
        <path d={`M${X1 + 66} ${MARQUE - 24} V${MARQUE - 130} m-14 22 l14 -22 l14 22`} fill="none" stroke={F.orFonce} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <Libelle x={X1 + 58} y={MARQUE - 150} taille={32} ancre="start" graisse={600} couleur={F.orFonce}>{LIBELLES.plus}</Libelle>
      </g>
      {/* Le débordement. */}
      {deb > 0
        ? [
            { x: X0 - 5, s: -1 },
            { x: X1 + 5, s: 1 },
          ].map(({ x, s }) => (
            <g key={s}>
              <path d={`M${x} ${HAUT - 3} L${x + s * (-7) * lin(deb, 0, 1)} ${mix(HAUT, SOL - 8, deb)}`} fill="none" stroke={F.orClair} strokeWidth={13} strokeLinecap="round" />
              <path d={`M${x + s * 2} ${HAUT - 3} L${x + s * (-5)} ${mix(HAUT, SOL - 8, deb)}`} fill="none" stroke={F.or} strokeWidth={2} />
            </g>
          ))
        : null}
      {deb > 0
        ? Array.from({ length: 6 }, (_, i) => {
            const loc = ((f / 24 + i / 6) % 1);
            const s = i % 2 ? 1 : -1;
            return <circle key={i} cx={s > 0 ? X1 + 16 + 14 * loc + (i * 7) % 8 : X0 - 16 - 14 * loc - (i * 7) % 8} cy={HAUT + (SOL - HAUT - 12) * (loc * loc)} r={7} fill={F.orClair} stroke={F.or} strokeWidth={2} opacity={deb} />;
          })
        : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 17 : deux vases, jusqu'au même niveau                          */
/* ------------------------------------------------------------------ */

const IlluVases: React.FC<PropsIllustration> = ({ f, d }) => {
  const YB = 708;
  const XL = 200;
  const XR = 600;
  const VASE = 'M-112 -490 H112 L100 -462 V-46 Q100 0 54 0 H-54 Q-100 0 -100 -46 V-462 Z';
  const ouvre = p(f, d[0] + 100, d[0] + 140);
  const k = p(f, d[1] + 8, d[1] + 420);
  const yL = mix(286, 462, k);
  const yR = mix(640, 462, k);
  const coule = ouvre > 0.5 && k < 1;
  const fosse = p(f, d[1] + 140, d[1] + 170) * (1 - p(f, d[1] + 370, d[1] + 404));
  const TUBE = 656;
  return (
    <Scene>
      <defs>
        <clipPath id="p17-v">
          <path d={VASE} />
        </clipPath>
      </defs>
      {/* Le tube. */}
      <rect x={XL + 96} y={TUBE - 19} width={XR - XL - 192} height={38} fill={F.papier} stroke={F.encre} strokeWidth={5} />
      {ouvre > 0.3 ? <rect x={XL + 96} y={TUBE - 15} width={XR - XL - 192} height={30} fill={F.orClair} opacity={lin(ouvre, 0.3, 0.7)} /> : null}
      {coule
        ? Array.from({ length: 8 }, (_, i) => {
            const x = XL + 100 + (((f * 1.4 + i * 28) % 196));
            return <circle key={i} cx={x} cy={TUBE} r={5} fill={F.orFonce} />;
          })
        : null}
      {/* La vanne. */}
      <circle cx={400} cy={TUBE} r={34} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <g transform={`rotate(${90 * ouvre} 400 ${TUBE})`}>
        <rect x={358} y={TUBE - 8} width={84} height={16} rx={8} fill={F.or} stroke={F.encre} strokeWidth={4} />
      </g>
      {[
        { x: XL, y: yL, id: 'l' },
        { x: XR, y: yR, id: 'r' },
      ].map((v) => (
        <g key={v.id} transform={`translate(${v.x} ${YB})`}>
          <path d={VASE} fill={F.papier} />
          <g clipPath="url(#p17-v)">
            <path d={vague(-120, 120, v.y - YB, 4, f + v.x, 3)} fill={F.orClair} />
            <path d={`M-120 ${v.y - YB} H120`} stroke={F.or} strokeWidth={3} />
          </g>
          <path d={VASE} fill="none" stroke={F.encre} strokeWidth={6} strokeLinejoin="round" />
          {Array.from({ length: 6 }, (_, i) => (
            <line key={i} x1={-82} x2={-60} y1={-70 - i * 62} y2={-70 - i * 62} stroke={F.encre2} strokeWidth={3} />
          ))}
        </g>
      ))}
      {/* Le fossé entre les deux niveaux. */}
      {fosse > 0 && yR - yL > 14 ? (
        <g opacity={fosse}>
          <path d={`M400 ${yL} V${yR} M384 ${yL} H416 M384 ${yR} H416`} fill="none" stroke={F.argile} strokeWidth={5} strokeLinecap="round" />
          <rect x={344} y={(yL + yR) / 2 - 22} width={112} height={42} rx={6} fill={F.parchemin} />
          <Libelle x={400} y={(yL + yR) / 2 + 9} taille={27} graisse={600} couleur={F.argile}>{LIBELLES.fosse}</Libelle>
        </g>
      ) : null}
      <line x1={40} x2={760} y1={YB + 2} y2={YB + 2} stroke={F.encre} strokeWidth={4} />
      <Libelle x={XL} y={768} taille={29} graisse={600} opacite={p(f, d[1] + 70, d[1] + 95)}>{LIBELLES.sature}</Libelle>
      <Libelle x={XR - 10} y={768} taille={29} graisse={600} opacite={p(f, d[1] + 90, d[1] + 115)}>{LIBELLES.moinsSature}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 18 : le réservoir s'épuise, puis devient des lampes            */
/* ------------------------------------------------------------------ */

const Lampe: React.FC<{ x: number; y: number; flamme: number; f: number; i: number; opacite: number; id: string }> = ({ x, y, flamme, f, i, opacite, id }) => {
  const E = 1.35;
  return (
    <g opacity={opacite}>
      {flamme > 0 ? <Lueur id={id} x={x + 100} y={y - 62} r={78} o={flamme * 0.85} /> : null}
      <g transform={`translate(${x} ${y}) scale(${E})`}>
        <path d="M-70 -8 C-86 -22 -86 8 -66 4" fill="none" stroke={F.encre} strokeWidth={8} />
        <path d="M-64 -14 C-64 24 -28 38 4 38 C34 38 54 22 62 2 L88 -16 L66 -22 C46 -16 28 -14 8 -14 Z" fill={F.argile} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
        <ellipse cx={-20} cy={-14} rx={38} ry={8} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
        <rect x={-36} y={36} width={80} height={10} rx={3} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      </g>
      {flamme > 0 ? <Flamme x={x + 100} y={y - 24} s={1.25 * flamme} f={f} i={i} /> : null}
    </g>
  );
};

const IlluReservoir: React.FC<PropsIllustration> = ({ f, d }) => {
  const X = 240;
  const Y = 170;
  const W = 300;
  const H = 450;
  const SOL = 812;
  const baisse = lin(f, d[0], d[1] + 14);
  const niveau = 0.86 * (1 - baisse);
  const yN = Y + H - H * niveau;
  const coupe = p(f, d[1] + 22, d[1] + 50);
  const separe = p(f, d[1] + 50, d[1] + 112);
  const voile = 1 - p(f, d[1] + 22, d[1] + 46);
  const lampes = p(f, d[1] + 92, d[1] + 124);
  const LAMPES = [
    { x: 130, y: 330 },
    { x: 375, y: 330 },
    { x: 620, y: 330 },
    { x: 252, y: 590 },
    { x: 497, y: 590 },
  ];
  const allume = (i: number) => p(f, d[1] + 130 + i * 44, d[1] + 158 + i * 44);
  const ecoule = baisse < 1;
  const CW = W / 5;
  return (
    <Scene>
      {/* Pieds et sol du réservoir. */}
      <g opacity={voile}>
        <line x1={100} x2={776} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
        {[X + 40, X + W - 40].map((x) => (
          <rect key={x} x={x - 9} y={Y + H} width={18} height={SOL - Y - H} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        ))}
      </g>
      {/* Robinet du haut, fermé. */}
      <g opacity={voile}>
        <rect x={378} y={40} width={44} height={132} fill={F.filet} stroke={F.encre} strokeWidth={4} />
        <circle cx={400} cy={100} r={38} fill={F.papier} stroke={F.encre} strokeWidth={8} />
        <path d="M376 76 L424 124 M424 76 L376 124" stroke={F.argile} strokeWidth={9} strokeLinecap="round" />
        <Libelle x={452} y={110} taille={31} ancre="start" graisse={600}>{LIBELLES.production}</Libelle>
      </g>
      {/* Le réservoir. */}
      <defs>
        <clipPath id="p18-r">
          <rect x={X + 3} y={Y + 3} width={W - 6} height={H - 6} rx={12} />
        </clipPath>
      </defs>
      {separe === 0 ? (
        <g>
          <rect x={X} y={Y} width={W} height={H} rx={14} fill={F.papier} />
          <g clipPath="url(#p18-r)">
            {niveau > 0 ? (
              <>
                <path d={vague(X - 6, X + W + 6, yN, Y + H + 4, f, 4)} fill={F.orClair} />
                <path d={`M${X - 6} ${yN} H${X + W + 6}`} stroke={F.or} strokeWidth={3} />
              </>
            ) : null}
          </g>
          <rect x={X} y={Y} width={W} height={H} rx={14} fill="none" stroke={F.encre} strokeWidth={6} />
          {[1, 2, 3, 4].map((i) => (
            <line key={i} x1={X + i * CW} x2={X + i * CW} y1={Y + 3} y2={Y + 3 + (H - 6) * coupe} stroke={F.encre} strokeWidth={5} opacity={coupe > 0 ? 1 : 0} />
          ))}
        </g>
      ) : (
        LAMPES.map((l, i) => {
          const x = mix(X + i * CW, l.x - CW / 2, separe);
          const y = mix(Y, l.y - 30, separe);
          const h = mix(H, 70, separe);
          return <rect key={i} x={x} y={y} width={CW} height={h} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={5} opacity={1 - lampes} />;
        })
      )}
      {/* Robinet du bas, qui verse. */}
      <g opacity={voile}>
        <path d={`M${X + W} 572 H${X + W + 88} V612`} fill="none" stroke={F.encre} strokeWidth={36} strokeLinejoin="round" />
        <path d={`M${X + W} 572 H${X + W + 88} V612`} fill="none" stroke={F.filet} strokeWidth={28} strokeLinejoin="round" />
        <rect x={X + W + 52} y={534} width={16} height={22} fill={F.encre} />
        <rect x={X + W + 34} y={522} width={52} height={14} rx={5} fill={F.or} stroke={F.encre} strokeWidth={3} />
        <Libelle x={X + W + 92} y={498} taille={31} graisse={600}>{LIBELLES.partage}</Libelle>
        {ecoule ? <rect x={X + W + 80} y={614} width={16} height={SOL - 616} fill={F.orClair} stroke={F.or} strokeWidth={2} /> : null}
        {ecoule ? <ellipse cx={X + W + 88} cy={SOL - 4} rx={70} ry={8} fill={F.orClair} stroke={F.or} strokeWidth={2} /> : null}
      </g>
      {/* Les lampes, chacune sur son étagère. */}
      <g opacity={lampes}>
        <line x1={24} x2={776} y1={330 + 62} y2={330 + 62} stroke={F.encre} strokeWidth={4} />
        <line x1={124} x2={676} y1={590 + 62} y2={590 + 62} stroke={F.encre} strokeWidth={4} />
      </g>
      {LAMPES.map((l, i) => (
        <Lampe key={l.x} id={`p18-l${i}`} x={l.x} y={l.y} flamme={allume(i)} f={f} i={i} opacite={lampes} />
      ))}
      <Libelle x={400} y={738} taille={36} graisse={600} couleur={F.orFonce} opacite={p(f, d[1] + 280, d[1] + 310)}>
        {LIBELLES.frere}
      </Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 19 : la voiture immobile, la clé qui tourne                    */
/* ------------------------------------------------------------------ */

const Voiture: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-176 -28 C-178 -68 -150 -78 -112 -84 L-66 -142 C-58 -152 -48 -156 -36 -156 H56 C70 -156 80 -150 90 -140 L132 -90 C164 -84 186 -72 186 -30 C186 -22 182 -18 174 -18 H-168 C-174 -18 -176 -22 -176 -28 Z" fill={F.argile} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-88 -88 L-52 -134 C-48 -138 -44 -140 -38 -140 H-2 V-88 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M12 -140 H54 C62 -140 70 -136 76 -130 L108 -88 H12 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <line x1={4} x2={4} y1={-88} y2={-26} stroke={F.encre} strokeWidth={3} />
    <rect x={24} y={-74} width={26} height={7} rx={3} fill={F.encre} />
    <rect x={-44} y={-74} width={26} height={7} rx={3} fill={F.encre} />
    <path d="M170 -66 L186 -58 V-42 H172 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} />
    {[-108, 112].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy={-18} r={42} fill={F.encre} />
        <circle cx={cx} cy={-18} r={21} fill={F.filet} stroke={F.encre} strokeWidth={3} />
        <circle cx={cx} cy={-18} r={6} fill={F.encre} />
      </g>
    ))}
  </g>
);

const IlluVoiture: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 740;
  const app = p(f, 0, 30);
  const don = p(f, d[0] + 10, d[0] + 60) * (1 - p(f, d[1] - 20, d[1] + 30));
  const cle = p(f, d[0] + 100, d[0] + 170);
  const gere = d[1] + 96;
  const tour = p(f, gere, gere + 44);
  const LX = 590;
  const LY = 560;
  const encore = f > gere + 44 ? Math.sin((f - gere - 44) / 28) * 16 : 0;
  const angle = mix(90 + Math.sin(f / 26) * 4 * (1 - tour), 172, tour) - Math.abs(encore);
  const a = rad(angle);
  // Le bout de la tige est dans la serrure ; l'anneau tourne autour.
  const hx = LX + Math.cos(a) * -150;
  const hy = LY + Math.sin(a) * -150;
  const debutPoints = gere + 34;
  const P = 150;
  const joie = p(f, d[1] + 200, d[1] + 232);
  return (
    <Scene>
      <Rayons id="p19-rayons" x={235} haut={0} bas={560} n={5} ecart={74} o={don * 0.75} f={f} />
      <line x1={24} x2={776} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      <g opacity={app}>
        <ellipse cx={235} cy={SOL - 2} rx={200} ry={9} fill={F.filet} />
        <Voiture x={228} y={SOL - 24} />
      </g>
      <Libelle x={235} y={806} taille={30} graisse={600} opacite={p(f, d[0] + 26, d[0] + 56)}>
        {LIBELLES.voiture}
      </Libelle>
      {/* La serrure et la clé. */}
      <g opacity={cle}>
        <Lueur id="p19-lueur" x={LX} y={LY} r={150} o={tour} />
        <circle cx={LX} cy={LY} r={56} fill={F.papier} stroke={F.encre} strokeWidth={6} />
        <circle cx={LX} cy={LY} r={40} fill="none" stroke={F.filet} strokeWidth={4} />
        <rect x={LX - 6} y={LY - 24} width={12} height={48} rx={5} fill={F.encre} transform={`rotate(${angle - 90} ${LX} ${LY})`} />
        <g transform={`translate(0 ${(1 - cle) * -40})`}>
          <Cle x={hx} y={hy} rot={angle} s={0.98} />
        </g>
      </g>
      {/* Les points de lumière. */}
      {Array.from({ length: 22 }, (_, i) => {
        const nee = debutPoints + (i * P) / 22;
        const loc = ((f - nee) % P) / P;
        if (f < nee) return null;
        const y = mix(LY - 30, 120, loc);
        const x = LX + Math.sin(loc * 7 + i * 1.3) * (22 + loc * 90) * (i % 2 ? 1 : -1);
        const r = 5 + (i % 4) * 2;
        return (
          <g key={i} opacity={lin(loc, 0, 0.1) * (1 - lin(loc, 0.72, 1))}>
            <circle cx={x} cy={y} r={r * 2.6} fill={F.orClair} opacity={0.35} />
            <circle cx={x} cy={y} r={r} fill={F.or} stroke={F.orClair} strokeWidth={1.5} />
          </g>
        );
      })}
      <text x={LX} y={84} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={52} fontWeight={600} fill={F.orFonce} opacity={joie}>
        {LIBELLES.joie}
      </text>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 20 : la jarre verse dans les coupes                            */
/* ------------------------------------------------------------------ */

const IlluGrace: React.FC<PropsIllustration> = ({ f, d }) => {
  const S = 1.15;
  const JARRE = 'M-36 -150 H36 C36 -120 30 -112 46 -96 C92 -62 98 42 56 96 L46 110 H-46 L-56 96 C-98 42 -92 -62 -46 -96 C-30 -112 -36 -120 -36 -150 Z';
  const CX = [320, 408, 496, 584, 672];
  const SOL = 836;
  const BETA = 70;
  const LIP = S * (36 * Math.cos(rad(BETA)) + 150 * Math.sin(rad(BETA)));
  const debut = d[1] - 8;
  const a1 = debut + 44;
  const PAS = 130;
  const dur = 104;
  const penche = p(f, debut, debut + 40);
  const redresse = p(f, a1 + 5 * PAS + 12, a1 + 5 * PAS + 58);
  const beta = BETA * penche * (1 - redresse);
  const b = rad(beta);
  // La jarre avance le long de la rangée, son bec au-dessus de la coupe qu'elle remplit.
  const tx: number[] = [debut];
  const vx: number[] = [190];
  tx.push(debut + 40);
  vx.push(CX[0] - LIP);
  CX.forEach((c, i) => {
    tx.push(a1 + i * PAS + dur);
    vx.push(c - LIP);
    if (i < 4) {
      tx.push(a1 + (i + 1) * PAS);
      vx.push(CX[i + 1] - LIP);
    }
  });
  const jx = interpolate(f, tx, vx, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const JY = 310;
  const vide = lin(f, a1, a1 + 5 * PAS - 26);
  const yLip = S * (36 * Math.sin(b) - 150 * Math.cos(b));
  const xLip = S * (36 * Math.cos(b) + 150 * Math.sin(b));
  const sNiv = Math.max(-115 * S, yLip + 4);
  const surface = mix(sNiv, 112 * S, vide);
  const verse = (i: number) => f >= a1 + i * PAS && f < a1 + i * PAS + dur;
  const enCours = [0, 1, 2, 3, 4].findIndex(verse);
  const niveauCoupe = (i: number) => lin(f, a1 + i * PAS + 6, a1 + i * PAS + dur);
  const brille = p(f, a1 + 5 * PAS - 30, a1 + 5 * PAS + 30);
  const entrees = CX.map((_, i) => p(f, d[0] + 100 + i * 28, d[0] + 128 + i * 28));
  const grace = p(f, d[2] + 4, d[2] + 40);
  return (
    <Scene>
      <line x1={24} x2={776} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      {/* Les coupes. */}
      {CX.map((x, i) => {
        const n = niveauCoupe(i);
        const e = lin(n, 0.8, 1);
        return (
          <g key={x} opacity={entrees[i]}>
            {e > 0 ? <Lueur id={`p20-l${i}`} x={x} y={SOL - 100} r={78 + 8 * Math.sin(f / 9 + i) + 26 * brille} o={e * (0.55 + 0.4 * brille)} /> : null}
            <Coupe id={`p20-c${i}`} x={x} y={SOL} s={0.8} niveau={n} f={f + i * 14} />
            {e > 0
              ? [-26, 0, 26].map((a, j) => {
                  const r = rad(a - 90);
                  const R0 = 92;
                  const R1 = R0 + 16 * e + 12 * brille * (1 + Math.sin(f / 7 + j + i));
                  return <line key={a} x1={x + Math.cos(r) * R0 * 0.56} y1={SOL - 128 + Math.sin(r) * R0 * 0.56} x2={x + Math.cos(r) * R1 * 0.56} y2={SOL - 128 + Math.sin(r) * R1 * 0.56} stroke={F.or} strokeWidth={4} strokeLinecap="round" opacity={e} />;
                })
              : null}
          </g>
        );
      })}
      {/* Le filet versé. */}
      {enCours >= 0 ? (
        <path
          d={`M${jx + xLip} ${JY + yLip + 2} C${jx + xLip + 6} ${JY + yLip + 80} ${CX[enCours]} ${JY + yLip + 200} ${CX[enCours]} ${SOL - 150 * 0.8 + 18 - 10 * niveauCoupe(enCours)}`}
          fill="none"
          stroke={F.orClair}
          strokeWidth={13}
          strokeLinecap="round"
        />
      ) : null}
      {/* La jarre. */}
      <defs>
        <clipPath id="p20-j">
          <path d={JARRE} />
        </clipPath>
      </defs>
      <g transform={`translate(${jx} ${JY}) rotate(${beta}) scale(${S})`}>
        <path d="M-40 -116 C-98 -130 -106 -60 -68 -44" fill="none" stroke={F.encre} strokeWidth={15} strokeLinecap="round" />
        <path d="M-40 -116 C-98 -130 -106 -60 -68 -44" fill="none" stroke={F.cuirClair} strokeWidth={8} strokeLinecap="round" />
        <path d="M40 -116 C98 -130 106 -60 68 -44" fill="none" stroke={F.encre} strokeWidth={15} strokeLinecap="round" />
        <path d="M40 -116 C98 -130 106 -60 68 -44" fill="none" stroke={F.cuirClair} strokeWidth={8} strokeLinecap="round" />
        <path d={JARRE} fill={F.papier} />
        <g clipPath="url(#p20-j)">
          <g transform={`rotate(${-beta})`}>
            <rect x={-300} y={surface / S} width={600} height={500} fill={F.orClair} />
            <line x1={-300} x2={300} y1={surface / S} y2={surface / S} stroke={F.or} strokeWidth={3} />
          </g>
        </g>
        <path d={JARRE} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-42} y={-160} width={84} height={14} rx={6} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      </g>
      <text x={132} y={724} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={52} fontWeight={600} fill={F.orFonce} opacity={grace}>
        {LIBELLES.grace}
      </text>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 21 : le thermomètre plein, les points de lumière               */
/* ------------------------------------------------------------------ */

const IlluFinCh18: React.FC<PropsIllustration> = ({ f }) => {
  const debut = 40;
  const P = 120;
  return (
    <Scene>
      <Lueur id="fin-lueur" x={400} y={170} r={200} o={p(f, 40, 80) * 0.75} />
      <Thermometre x={400} y={230} h={470} l={72} niveau={0.72 + 0.28 * p(f, 0, 60)} />
      {Array.from({ length: 18 }, (_, i) => {
        const nee = debut + (i * P) / 18;
        if (f < nee) return null;
        const loc = ((f - nee) % P) / P;
        const y = mix(220, 16, loc);
        const x = 400 + Math.sin(loc * 6 + i * 2.1) * (18 + 150 * loc) * (i % 2 ? 1 : -1);
        const r = 5 + (i % 3) * 2.5;
        return (
          <g key={i} opacity={lin(loc, 0, 0.12) * (1 - lin(loc, 0.72, 1))}>
            <circle cx={x} cy={y} r={r * 2.6} fill={F.orClair} opacity={0.4} />
            <circle cx={x} cy={y} r={r} fill={F.or} stroke={F.orClair} strokeWidth={1.5} />
          </g>
        );
      })}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluOuvertureCh18,
  p2: IlluIntendant,
  p3: IlluEsperance,
  p4: IlluRacine,
  p5: IlluCalendrier,
  p6: IlluNabal,
  p7: IlluAssuerus,
  p8: IlluHaman,
  p9: IlluDistributeur,
  p10: IlluTroisRiches,
  p11: IlluLot,
  p12: IlluCV,
  p13: IlluNehemie,
  p14: IlluPaliers,
  p15: IlluTuteur,
  p16: IlluVerre,
  p17: IlluVases,
  p18: IlluReservoir,
  p19: IlluVoiture,
  p20: IlluGrace,
  fin: IlluFinCh18,
};

