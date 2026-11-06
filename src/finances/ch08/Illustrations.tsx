import React from 'react';
import { Easing, interpolate } from 'remotion';
import { Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F, PoliceF } from '../theme';
import { LIBELLES } from './libelles';

const lin = (a: number, b: number, t: number) => a + (b - a) * t;
const courbe = (f: number, images: number[], valeurs: number[]) => interpolate(f, images, valeurs, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
/** Durée de la phrase i, pour caler un mouvement sur un mot à l'intérieur de la phrase. */
const longueurs = (d: number[], duree: number) => d.map((a, i) => (i + 1 < d.length ? d[i + 1] : duree - 30) - a);
const rad = (a: number) => (a * Math.PI) / 180;

/** Le sac du salaire, posé sur sa base en (x, y). */
const Sac: React.FC<{ x: number; y: number; s?: number; rot?: number; opacite?: number; texte?: string; tailleTexte?: number }> = ({ x, y, s = 1, rot = 0, opacite = 1, texte, tailleTexte = 25 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacite}>
    <path d="M-58 0 C-98 -38 -88 -88 -34 -112 L-24 -128 L-38 -150 Q-18 -140 0 -150 Q18 -140 38 -150 L24 -128 L34 -112 C88 -88 98 -38 58 0 Q0 8 -58 0 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-28 -122 Q0 -112 28 -122" fill="none" stroke={F.orClair} strokeWidth={7} strokeLinecap="round" />
    {texte ? <Libelle x={0} y={-44} taille={tailleTexte} couleur={F.papier} graisse={600}>{texte}</Libelle> : null}
  </g>
);

/** L'enveloppe de paie vierge, du plan 1 au plan de fin. `ouvert` et `rayon` vont de 0 à 1. */
const Enveloppe: React.FC<{ cx: number; base: number; w: number; h: number; ouvert: number; rayon: number; eclat?: number }> = ({ cx, base, w, h, ouvert, rayon, eclat = 1 }) => {
  const x = cx - w / 2;
  const haut = base - h;
  const pointe = haut + h * 0.54 * (1 - 2 * ouvert);
  const rabat = <path d={`M${x} ${haut} L${cx} ${pointe} L${x + w} ${haut} Z`} fill={ouvert < 0.5 ? F.papier : F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />;
  return (
    <g>
      <defs>
        <linearGradient id="ch08-rayon" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={F.or} stopOpacity={0.95} />
          <stop offset="1" stopColor={F.orClair} stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <rect x={x} y={haut} width={w} height={h} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      {ouvert < 0.5 ? null : rabat}
      {rayon > 0 ? <path d={`M${cx - 9} ${haut + h * 0.5} L${cx - 9 - 24 * rayon} ${lin(haut + h * 0.5, 4, rayon)} H${cx + 9 + 24 * rayon} L${cx + 9} ${haut + h * 0.5} Z`} fill="url(#ch08-rayon)" opacity={eclat} /> : null}
      <path d={`M${x} ${haut} L${cx} ${haut + h * 0.54} L${x + w} ${haut} V${base} H${x} Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${x} ${base} L${cx - w * 0.09} ${haut + h * 0.47} M${x + w} ${base} L${cx + w * 0.09} ${haut + h * 0.47}`} stroke={F.filet} strokeWidth={3} />
      {ouvert < 0.5 ? rabat : null}
    </g>
  );
};

/** Une source de lumière, sans contour : jamais un astre ni une figure. */
const Lueur: React.FC<{ id: string; x: number; y: number; r: number; opacite?: number }> = ({ id, x, y, r, opacite = 1 }) => (
  <g opacity={opacite}>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={F.papier} />
        <stop offset="0.35" stopColor={F.orClair} />
        <stop offset="1" stopColor={F.orClair} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

/** Une table vue de côté, dessus en `y`. */
const Table: React.FC<{ x1: number; x2: number; y: number; bas: number }> = ({ x1, x2, y, bas }) => (
  <g>
    {[x1 + 54, x2 - 80].map((x) => (
      <rect key={x} x={x} y={y + 30} width={26} height={bas - y - 30} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    ))}
    <rect x={x1 + 34} y={y + 30} width={x2 - x1 - 68} height={26} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
    <rect x={x1} y={y} width={x2 - x1} height={30} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
  </g>
);

/** Plan 1 : l'enveloppe se pose et s'ouvre, un fin rayon en sort. */
const IlluOuvertureEnveloppe: React.FC<PropsIllustration> = ({ f }) => {
  const chute = interpolate(f, [8, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bounce });
  const BASE = 650;
  const y = lin(-330, 0, chute);
  const ombre = p(f, 25, 46);
  return (
    <Scene>
      <Table x1={70} x2={730} y={BASE} bas={880} />
      <ellipse cx={400} cy={BASE + 3} rx={236 * ombre} ry={7} fill={F.encre} opacity={0.25} />
      <g transform={`translate(0 ${y}) rotate(${(1 - chute) * -5} 400 ${BASE})`} opacity={p(f, 2, 14)}>
        <Enveloppe cx={400} base={BASE} w={450} h={290} ouvert={p(f, 66, 108)} rayon={p(f, 100, 150)} eclat={0.85 + 0.15 * Math.sin(f / 13)} />
      </g>
    </Scene>
  );
};

const Fin: React.FC<PropsIllustration> = ({ f }) => (
  <Scene>
    <Thermometre x={112} y={130} h={600} l={60} niveau={1} />
    <Table x1={240} x2={785} y={700} bas={880} />
    <Enveloppe cx={512} base={700} w={390} h={250} ouvert={1} rayon={0.7 + 0.3 * p(f, 0, 70)} eclat={0.85 + 0.15 * Math.sin(f / 13)} />
  </Scene>
);

const creneaux = (x: number, y: number, w: number, h: number) => {
  const m = w / 5;
  return `M${x} ${y + h} V${y} h${m} v15 h${m} v-15 h${m} v15 h${m} v-15 h${m} V${y + h} Z`;
};

const Vague: React.FC<{ x: number; y: number; l: number; f: number; phase: number }> = ({ x, y, l, f, phase }) => {
  const u = l / 6;
  return (
    <path
      transform={`translate(${Math.sin(f / 24 + phase) * 7} ${Math.sin(f / 17 + phase) * 3})`}
      d={`M${x} ${y} q${u / 2} -13 ${u} 0 t${u} 0 t${u} 0 t${u} 0 t${u} 0 t${u} 0`}
      fill="none"
      stroke={F.encre2}
      strokeWidth={3.5}
      strokeLinecap="round"
      opacity={0.6}
    />
  );
};

const VAGUES: [number, number, number][] = [
  [60, 232, 120], [215, 226, 120], [370, 238, 96], [500, 232, 110], [640, 240, 100],
  [470, 310, 110], [620, 300, 120], [510, 385, 110], [650, 375, 100], [600, 450, 90],
  [42, 340, 48], [42, 460, 46], [52, 668, 110], [205, 680, 120], [335, 650, 66],
  [64, 748, 120], [225, 762, 120], [52, 830, 110], [190, 838, 90], [300, 826, 66],
];

/** Plan 2 : treize ans de siège, et le sac arrive de l'autre bord, vers l'Égypte. */
const IlluTyr: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const D = longueurs(d, duree);
  const TRAITS = 13;
  const debutTraits = d[0] + 8;
  const finTraits = d[2] - 16;
  const treize = p(f, finTraits - 8, finTraits + 12);
  const egypte = p(f, d[2] + D[2] * 0.58, d[2] + D[2] * 0.72);
  const glisse = p(f, d[2] + D[2] * 0.76, d[2] + D[2] * 0.98);
  const eclat = p(f, d[2] + D[2] * 0.98, duree - 6);
  const estompe = 1 - 0.4 * p(f, d[2] + D[2] * 0.2, d[2] + D[2] * 0.55);
  const drapeau = Math.sin(f / 9) * 5;
  const xSac = lin(885, 672, glisse);
  return (
    <Scene>
      <defs>
        <clipPath id="ch08-cadre-tyr">
          <rect x={24} y={24} width={752} height={852} rx={14} />
        </clipPath>
      </defs>
      <rect x={24} y={24} width={752} height={852} rx={14} fill={F.papier} />
      <g clipPath="url(#ch08-cadre-tyr)">
        {VAGUES.map(([x, y, l], i) => (
          <Vague key={i} x={x} y={y} l={l} f={f} phase={i * 1.3} />
        ))}
        <g opacity={egypte} transform={`translate(${(1 - egypte) * 60} 0)`}>
          <path d="M395 880 C430 760 450 630 550 575 C620 540 700 530 790 490 V880 Z" fill={F.orClair} stroke={F.orFonce} strokeWidth={4} />
          <path d="M705 606 L752 672 H658 Z" fill={F.or} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <path d="M610 568 L686 672 H534 Z" fill={F.or} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <path d="M610 568 L686 672 H620 Z" fill={F.orFonce} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <Libelle x={500} y={796} taille={32} graisse={600}>{LIBELLES.egypte}</Libelle>
        </g>
        <path d="M438 490 Q505 462 540 566" fill="none" stroke={F.orFonce} strokeWidth={5} strokeDasharray="4 15" strokeLinecap="round" strokeDashoffset={-f / 2} opacity={egypte} />
        {eclat > 0 ? <circle cx={672} cy={790} r={70 + 44 * eclat} fill="none" stroke={F.or} strokeWidth={5} opacity={1 - eclat * 0.75} /> : null}
        <Sac x={xSac} y={856} texte={LIBELLES.salaire} />
      </g>
      <g opacity={estompe}>
        <ellipse cx={250} cy={560} rx={192} ry={62} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <line x1={250} y1={345} x2={250} y2={286} stroke={F.encre} strokeWidth={5} />
        <path d={`M250 288 Q272 ${282 + drapeau} 296 ${292 - drapeau} L296 ${316 - drapeau} Q272 ${306 + drapeau} 250 ${312} Z`} fill={F.argile} stroke={F.encre} strokeWidth={3} />
        <path d={creneaux(205, 345, 90, 200)} fill={F.parchemin} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d={creneaux(125, 430, 250, 115)} fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d={creneaux(102, 385, 70, 160)} fill={F.parchemin} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d={creneaux(328, 385, 70, 160)} fill={F.parchemin} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d="M222 545 V497 Q250 462 278 497 V545 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        {[137, 363].map((x) => (
          <rect key={x} x={x - 6} y={425} width={12} height={34} rx={5} fill={F.encre} />
        ))}
        <rect x={244} y={380} width={12} height={34} rx={5} fill={F.encre} />
        <Libelle x={250} y={603} taille={32} couleur={F.papier} graisse={600}>{LIBELLES.tyr}</Libelle>
      </g>
      {Array.from({ length: TRAITS }, (_, i) => {
        const a = lin(debutTraits, finTraits, i / TRAITS);
        const t = p(f, a, a + 14);
        const x = 70 + i * 26 + Math.floor(i / 5) * 22;
        const penche = (i % 3) * 2 - 2;
        return t > 0 ? <line key={i} x1={x + penche} y1={70} x2={x + penche + (-penche * 2 - 1) * t} y2={70 + 92 * t} stroke={F.encre} strokeWidth={7} strokeLinecap="round" /> : null;
      })}
      <Libelle x={462} y={132} taille={38} ancre="start" graisse={600} opacite={treize}>{LIBELLES.treizeAns}</Libelle>
      <rect x={24} y={24} width={752} height={852} rx={14} fill="none" stroke={F.encre} strokeWidth={5} />
    </Scene>
  );
};

/** Plan 3 : un faisceau s'arrête sur chaque point de la foule, sans en oublier un. */
const IlluFoule: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const COLS = 14;
  const LIGNES = 15;
  const N = COLS * LIGNES;
  const X0 = 101;
  const Y0 = 180;
  const PAS = 46;
  const position = (k: number) => {
    const ligne = Math.floor(k / COLS);
    const reste = k % COLS;
    const col = ligne % 2 === 0 ? reste : COLS - 1 - reste;
    return { x: X0 + col * PAS, y: Y0 + ligne * PAS };
  };
  const a = d[0];
  const b = d[3] - 25;
  const parPoint = (b - a) / N;
  const s = (f - a) / parPoint;
  const i = Math.max(0, Math.min(N - 1, Math.floor(s)));
  const reste = Math.max(0, Math.min(1, s - i));
  const arrivee = p(reste, 0, 0.6);
  const P1 = position(i);
  const P0 = position(Math.max(0, i - 1));
  const cx = lin(P0.x, P1.x, arrivee);
  const cy = lin(P0.y, P1.y, arrivee);
  const allume = (k: number) => k < i || (k === i && reste >= 0.6) || s >= N;
  const faisceau = p(f, 8, a) * (1 - p(f, b, b + 25));
  const fruit = p(f, b + 10, duree - 40);
  const SX = 400;
  const SY = 58;
  return (
    <Scene>
      <Lueur id="ch08-lueur-foule" x={SX} y={SY} r={58} opacite={0.3 + 0.7 * p(f, 4, 30)} />
      {Array.from({ length: N }, (_, k) => {
        const q = position(k);
        const on = allume(k);
        const vague = fruit > 0 ? 1 + 0.16 * Math.sin(f / 9 - q.y / 90) * fruit : 1;
        return <circle key={k} cx={q.x} cy={q.y} r={13 * vague} fill={on ? F.or : F.encre2} stroke={on ? F.orFonce : F.encre} strokeWidth={2} />;
      })}
      {faisceau > 0 ? (
        <g opacity={faisceau}>
          <path d={`M${SX - 12} ${SY + 28} L${cx - 26} ${cy} A26 26 0 0 0 ${cx + 26} ${cy} L${SX + 12} ${SY + 28} Z`} fill={F.orClair} opacity={0.42} />
          <circle cx={cx} cy={cy} r={24} fill="none" stroke={F.orFonce} strokeWidth={4} />
        </g>
      ) : null}
    </Scene>
  );
};

/** Plan 4 : l'horloge tourne, trois rangées arrivent, le même denier pour chacune. */
const IlluOnzieme: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const D = longueurs(d, duree);
  const tPremiere = d[0] + D[0] * 0.14;
  const tMidi = d[0] + D[0] * 0.5;
  const tOnze = d[0] + D[0] * 0.66;
  const ARRIVEES = [tPremiere, tMidi, tOnze];
  const heure = courbe(f, [0, tPremiere, tMidi, tOnze, d[1], d[1] + 40], [180, 210, 360, 510, 510, 540]);
  const minute = heure * 12;
  const CX = 400;
  const CY = 170;
  const R = 142;
  // La paie commence par les derniers : rangée 3, puis 2, puis 1.
  const paie = (r: number) => d[1] + 30 + (2 - r) * (D[1] * 0.26);
  const murmure = p(f, d[2], d[2] + 25);
  const echange = p(f, d[3] + 12, d[3] + 70);
  const pli = Math.sin(echange * Math.PI);
  const milieu = 1 - p(f, d[3], d[3] + 12) * (1 - p(f, d[3] + 70, d[3] + 82));
  const SLOT = [372, 546, 720];
  const denierLabel = p(f, paie(0) + 26, paie(0) + 46);
  return (
    <Scene>
      <circle cx={CX} cy={CY} r={R} fill={F.papier} stroke={F.encre} strokeWidth={7} />
      <circle cx={CX} cy={CY} r={R - 12} fill="none" stroke={F.filet} strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = rad(i * 30);
        const majeure = i % 3 === 0;
        return <line key={i} x1={CX + Math.sin(a) * (R - 24)} y1={CY - Math.cos(a) * (R - 24)} x2={CX + Math.sin(a) * (R - (majeure ? 52 : 40))} y2={CY - Math.cos(a) * (R - (majeure ? 52 : 40))} stroke={F.encre} strokeWidth={majeure ? 7 : 4} strokeLinecap="round" />;
      })}
      <line x1={CX} y1={CY + 14} x2={CX} y2={CY - 100} stroke={F.encre2} strokeWidth={6} strokeLinecap="round" transform={`rotate(${minute} ${CX} ${CY})`} />
      <line x1={CX} y1={CY + 12} x2={CX} y2={CY - 68} stroke={F.encre} strokeWidth={11} strokeLinecap="round" transform={`rotate(${heure} ${CX} ${CY})`} />
      <circle cx={CX} cy={CY} r={11} fill={F.or} stroke={F.encre} strokeWidth={3} />
      <Libelle x={640} y={352} taille={26} graisse={600} couleur={F.orFonce} opacite={denierLabel}>{LIBELLES.denier}</Libelle>
      {LIBELLES.heures.map((nom, r) => {
        const a = ARRIVEES[r];
        const o = p(f, a, a + 20);
        const y = r === 0 ? lin(SLOT[0], SLOT[2], echange) : r === 2 ? lin(SLOT[2], SLOT[0], echange) : SLOT[1];
        const echelle = r === 1 ? 1 : 1 - 0.55 * pli;
        const ancreX = r === 0 ? 60 : 700;
        const t = paie(r);
        const tombe = interpolate(f, [t, t + 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
        const rebond = Math.abs(Math.sin(p(f, t + 26, t + 40) * Math.PI)) * 12;
        const yDenier = lin(-y + 10, 32, tombe) - rebond;
        const fusion = r === 0 ? murmure : 0;
        return (
          <g key={nom} opacity={o * (r === 1 ? milieu : 1)} transform={`translate(${ancreX} ${y}) scale(${echelle}) translate(${-ancreX} 0)`}>
            <Libelle x={60} y={0} taille={28} ancre="start" graisse={600} opacite={r === 1 ? 1 : Math.max(0, 1 - pli * 2.5)}>{nom}</Libelle>
            {Array.from({ length: 9 }, (_, i) => {
              const e = p(f, a + i * 3, a + i * 3 + 12);
              const dx = fusion * Math.sin(f * 1.1 + i * 2.1) * 3.5;
              const dy = fusion * Math.cos(f * 1.4 + i * 1.3) * 3.5;
              return (
                <g key={i} transform={`translate(${dx} ${dy})`}>
                  <circle cx={84 + i * 50} cy={52} r={17 * e} fill={F.encre2} stroke={F.encre} strokeWidth={2} />
                  {fusion > 0 ? <circle cx={84 + i * 50} cy={52} r={17} fill={F.argile} opacity={fusion} /> : null}
                </g>
              );
            })}
            {tombe > 0 ? <Piece x={640} y={yDenier} r={36} /> : null}
          </g>
        );
      })}
    </Scene>
  );
};

const PILE: [number, number][] = [[-76, -18], [0, -22], [76, -18], [-40, -58], [40, -58], [0, -96]];

/** Le bol et ses pièces, de l'or au gris selon `pale`. */
const Bol: React.FC<{ x: number; y: number; pale: number; pieces: number }> = ({ x, y, pale, pieces }) => (
  <g>
    {PILE.slice(0, pieces).map(([dx, dy], i) => (
      <g key={i}>
        <circle cx={x + dx} cy={y + dy} r={36} fill={F.filet} stroke={F.encre2} strokeWidth={3} />
        <circle cx={x + dx} cy={y + dy} r={26} fill={F.parchemin} stroke={F.encre2} strokeWidth={1.5} />
        <Piece x={x + dx} y={y + dy} r={36} opacite={1 - pale} />
      </g>
    ))}
    <path d={`M${x - 135} ${y} Q${x - 128} ${y + 118} ${x - 52} ${y + 136} H${x + 52} Q${x + 128} ${y + 118} ${x + 135} ${y} Z`} fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
    <path d={`M${x - 135} ${y} Q${x - 128} ${y + 118} ${x - 52} ${y + 136} H${x + 52} Q${x + 128} ${y + 118} ${x + 135} ${y} Z`} fill={F.cuirClair} opacity={1 - pale * 0.82} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
    <rect x={x - 60} y={y + 136} width={120} height={16} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={4} opacity={1 - pale * 0.5} />
  </g>
);

/** Plan 5 : la longue-vue quitte le bol plein pour viser l'autre, et le premier se décolore. */
const IlluComparaison: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const D = longueurs(d, duree);
  const XG = 205;
  const XD = 595;
  const YB = 560;
  const PX = 400;
  const PY = 170;
  const CIBLE = 442;
  const aG = (Math.atan2(CIBLE - PY, XG - PX) * 180) / Math.PI;
  const aD = (Math.atan2(CIBLE - PY, XD - PX) * 180) / Math.PI;
  const bascule = p(f, d[2] + D[2] * 0.06, d[2] + D[2] * 0.42);
  const tentation = p(f, d[0] + D[0] * 0.45, d[1]) * (1 - bascule);
  const angle = lin(aG, aD, bascule) + Math.sin(f / 15) * 5 * tentation;
  const pale = p(f, d[2] + D[2] * 0.2, d[3]);
  const cible = { x: lin(XG, XD, bascule), y: CIBLE };
  const a = rad(angle);
  const bout = { x: PX + Math.cos(a) * 196, y: PY + Math.sin(a) * 196 };
  const fauteur = p(f, d[3], d[3] + 25);
  const chute = (x: number, retard: number) => {
    const t = interpolate(f, [d[1] + retard, d[1] + retard + 32], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
    return t > 0 && t < 1 ? <Piece x={x} y={lin(40, 470, t)} r={28} opacite={Math.min(1, t * 6)} /> : null;
  };
  const lJustice = p(f, d[1] + 20, d[1] + 45) * (1 - p(f, d[2] - 12, d[2] + 4));
  const lDonne = p(f, d[2] + 8, d[2] + 30);
  const halo = 1 + 0.06 * Math.sin(f / 10);
  return (
    <Scene>
      <line x1={30} x2={770} y1={712} y2={712} stroke={F.encre} strokeWidth={5} />
      {chute(XG, 15)}
      {chute(XD, D[1] * 0.45)}
      <circle cx={XD} cy={YB - 40} r={178 * halo} fill={F.orClair} opacity={0.3 * bascule} />
      <Bol x={XG} y={YB} pale={pale} pieces={6} />
      <Bol x={XD} y={YB} pale={0} pieces={6} />
      <Libelle x={XG} y={768} taille={28} opacite={lJustice}>{LIBELLES.justice}</Libelle>
      <Libelle x={XD} y={768} taille={28} opacite={lJustice}>{LIBELLES.generosite}</Libelle>
      <Libelle x={XG} y={768} taille={25} opacite={lDonne} couleur={F.encre2}>{LIBELLES.donneLeur}</Libelle>
      <Libelle x={XD} y={768} taille={25} opacite={lDonne} graisse={600}>{LIBELLES.donneAutres}</Libelle>
      <line x1={bout.x} y1={bout.y} x2={cible.x} y2={cible.y} stroke={fauteur > 0.5 ? F.argile : F.orFonce} strokeWidth={5} strokeDasharray="3 14" strokeLinecap="round" strokeDashoffset={-f / 2} />
      <g transform={`translate(${PX} ${PY}) rotate(${angle})`}>
        <rect x={-112} y={-14} width={78} height={28} rx={5} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <rect x={-36} y={-20} width={112} height={40} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <rect x={72} y={-27} width={116} height={54} rx={4} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        {[-34, 70, 76, 180].map((x) => (
          <rect key={x} x={x} y={x < 60 ? -22 : -29} width={8} height={x < 60 ? 44 : 58} fill={F.or} stroke={F.encre} strokeWidth={2} />
        ))}
        <ellipse cx={192} cy={0} rx={8} ry={27} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
        <ellipse cx={-114} cy={0} rx={5} ry={14} fill={F.encre} />
      </g>
      <circle cx={PX} cy={PY} r={9} fill={F.or} stroke={F.encre} strokeWidth={3} />
      <Libelle x={400} y={50} taille={36} graisse={600} couleur={F.argile} opacite={fauteur}>{LIBELLES.comparaison}</Libelle>
    </Scene>
  );
};

type Pt = { x: number; y: number };
/** Courbe de Bézier composée, parcourue à vitesse constante : t de 0 à 1. */
const parcours = (depart: Pt, segments: [Pt, Pt, Pt][]) => {
  const points: Pt[] = [];
  let p0 = depart;
  for (const [c1, c2, p3] of segments) {
    for (let i = 0; i < 80; i++) {
      const t = i / 80;
      const u = 1 - t;
      points.push({
        x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p3.x,
        y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p3.y,
      });
    }
    p0 = p3;
  }
  points.push(p0);
  const cumul = [0];
  for (let i = 1; i < points.length; i++) cumul.push(cumul[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  const total = cumul[cumul.length - 1];
  return (t: number): Pt => {
    const cible = Math.max(0, Math.min(1, t)) * total;
    let i = 1;
    while (i < cumul.length - 1 && cumul[i] < cible) i++;
    const k = (cible - cumul[i - 1]) / (cumul[i] - cumul[i - 1] || 1);
    return { x: lin(points[i - 1].x, points[i].x, k), y: lin(points[i - 1].y, points[i].y, k) };
  };
};

const SEGMENTS: [Pt, Pt, Pt][] = [
  [{ x: 290, y: 870 }, { x: 590, y: 830 }, { x: 650, y: 700 }],
  [{ x: 710, y: 570 }, { x: 430, y: 610 }, { x: 270, y: 560 }],
  [{ x: 90, y: 505 }, { x: 170, y: 370 }, { x: 350, y: 372 }],
  [{ x: 530, y: 374 }, { x: 700, y: 340 }, { x: 690, y: 175 }],
];
const SENTIER = 'M80 830 C290 870 590 830 650 700 C710 570 430 610 270 560 C90 505 170 370 350 372 C530 374 700 340 690 175';
const surSentier = parcours({ x: 80, y: 830 }, SEGMENTS);
/** Chaque sac est posé au bord du sentier ; `t` est l'endroit du sentier où il apparaît. */
const SACS: { t: number; x: number; y: number }[] = [
  { t: 0.11, x: 250, y: 808 }, { t: 0.24, x: 490, y: 762 }, { t: 0.37, x: 694, y: 590 }, { t: 0.5, x: 505, y: 558 }, { t: 0.635, x: 295, y: 510 }, { t: 0.78, x: 425, y: 490 }, { t: 0.92, x: 585, y: 266 },
];

/** Plan 6 : le salaire apparaît le long du sentier ; l'organisation, à l'écart, reste fermée. */
const IlluChemin: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const D = longueurs(d, duree);
  const t = lin(0, 1, Math.max(0, Math.min(1, (f - d[0] + 12) / (d[2] + 6 - d[0] + 12))));
  const point = surSentier(t);
  const secousse = p(f, d[2] + D[2] * 0.45, d[2] + D[2] * 0.55) * (1 - p(f, d[2] + D[2] * 0.72, d[2] + D[2] * 0.82));
  const dx = Math.sin(f * 1.8) * 3 * secousse;
  const accent = p(f, d[2] + D[2] * 0.45, d[2] + D[2] * 0.6);
  const lueur = p(f, d[2], d[2] + D[2] * 0.4);
  return (
    <Scene>
      {/* Les halos passent sous le sentier : ils ne teintent jamais le chemin. */}
      {lueur > 0
        ? SACS.map((s, i) => <circle key={i} cx={s.x} cy={s.y - 34} r={50 + 5 * Math.sin(f / 9 + i)} fill={F.orClair} opacity={0.5 * lueur} />)
        : null}
      <path d={SENTIER} fill="none" stroke={F.encre2} strokeWidth={50} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} />
      <path d={SENTIER} fill="none" stroke={F.papier} strokeWidth={42} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} />
      {/* Le village, au bout du sentier. */}
      <g opacity={p(f, 2, 24)}>
        {[{ x: 640, s: 0.85 }, { x: 722, s: 1 }].map((h) => (
          <g key={h.x} transform={`translate(${h.x} 142) scale(${h.s})`}>
            <rect x={-34} y={-54} width={68} height={54} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
            <path d="M-50 -50 L0 -98 L50 -50 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <rect x={-10} y={-30} width={20} height={30} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
          </g>
        ))}
      </g>
      {/* L'organisation, à l'écart. */}
      <g opacity={p(f, 2, 24)} transform={`translate(${dx} 0)`}>
        <path d="M180 40 L306 110 H54 Z" fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <rect x={68} y={110} width={224} height={138} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
        {[88, 124, 216, 252].map((x) => (
          <rect key={x} x={x} y={118} width={20} height={130} fill={F.filet} stroke={F.encre} strokeWidth={3} />
        ))}
        <rect x={150} y={150} width={60} height={98} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <line x1={180} x2={180} y1={150} y2={248} stroke={F.encre} strokeWidth={3} />
        <line x1={140} x2={220} y1={196} y2={196} stroke={accent > 0.5 ? F.argile : F.encre} strokeWidth={9} strokeLinecap="round" />
        <rect x={168} y={188} width={24} height={22} rx={3} fill={F.or} stroke={F.encre} strokeWidth={3} />
        <rect x={52} y={248} width={256} height={14} fill={F.filet} stroke={F.encre} strokeWidth={4} />
        <Libelle x={180} y={300} taille={28} graisse={600} couleur={accent > 0.5 ? F.argile : F.encre}>{LIBELLES.organisation}</Libelle>
      </g>
      {SACS.map((s, i) => {
        const { x, y } = s;
        const tPassage = d[0] - 12 + s.t * (d[2] + 18 - d[0]);
        const o = p(f, tPassage, tPassage + 18);
        const r = o > 0 ? 1 + 0.22 * Math.sin(o * Math.PI) : 0;
        return o > 0 ? <Sac key={i} x={x} y={y} s={0.5 * r} opacite={o} /> : null;
      })}
      <circle cx={point.x} cy={point.y} r={19} fill={F.or} stroke={F.encre} strokeWidth={4} />
    </Scene>
  );
};

/** Plan 7 : les trois étais retirés, puis la route vient porter la planche. */
const IlluRoute: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const D = longueurs(d, duree);
  const SOL = 810;
  const HAUT_ROUTE = 240;
  // La chaussée a de la profondeur : la planche et les étais sont sur le plan SOL, la chaussée s'étend derrière (DOS) et devant (FACE).
  const DOS = 30;
  const FACE = 44;
  const RAMPE = 600;
  const X1 = 120;
  const X2 = 680;
  const retireOr = p(f, d[0] + D[0] * 0.4, d[0] + D[0] * 0.7);
  const retireSac = p(f, d[1] + D[1] * 0.25, d[1] + D[1] * 0.55);
  const retireBaton = p(f, d[2] + D[2] * 0.02, d[2] + D[2] * 0.14);
  const chute = interpolate(f, [d[2] + D[2] * 0.08, d[2] + D[2] * 0.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bounce });
  const roule = p(f, d[2] + D[2] * 0.68, d[3] + 42);
  const X = lin(30, 1420, roule);
  const hauteur = (x: number) => {
    if (x >= X) return 0;
    return Math.min(HAUT_ROUTE, ((X - x) / RAMPE) * HAUT_ROUTE);
  };
  // La planche repose sur la route : on la lève juste assez pour qu'aucun point ne la traverse.
  let hG = hauteur(X1);
  let hD = hauteur(X2);
  let marge = 0;
  for (let i = 0; i <= 28; i++) {
    const x = lin(X1, X2, i / 28);
    marge = Math.max(marge, hauteur(x) - lin(hG, hD, i / 28));
  }
  hG += marge;
  hD += marge;
  const repos = 400 + 30;
  const dessous = lin(repos, SOL, chute);
  const yCentre = dessous - (hG + hD) / 2;
  const inquiet = retireSac * (1 - chute);
  const peche = Math.sin(f / 13) * 3.2 * inquiet + (retireOr * (1 - retireSac) * -1.4 * (1 - chute));
  const angle = (Math.atan2(hG - hD, X2 - X1) * 180) / Math.PI + peche;
  const finale = p(f, d[3] + 25, d[3] + 55);
  const ETAIS = [
    { x: 170, l: 46, rempli: F.or, retrait: retireOr, sx: -130, sy: 0, rot: -12 },
    { x: 400, l: 26, rempli: F.cuir, retrait: retireBaton, sx: 0, sy: 0, rot: 82 },
    { x: 630, l: 46, rempli: F.cuirClair, retrait: retireSac, sx: 110, sy: 0, rot: 12 },
  ];
  const haut = 430;
  const TOIT = SOL - HAUT_ROUTE;
  const xR = X - RAMPE;
  const GAUCHE = xR - 2400;
  const motRoute = p(f, d[3], d[3] + 20);
  return (
    <Scene>
      <defs>
        {/* Le sol et la route continuent hors du cadre : ils s'estompent au lieu d'être coupés net. */}
        <linearGradient id="ch08-fondu" gradientUnits="userSpaceOnUse" x1={30} x2={770} y1={0} y2={0}>
          <stop offset={0} stopColor="#000" />
          <stop offset={0.08} stopColor="#fff" />
          <stop offset={0.92} stopColor="#fff" />
          <stop offset={1} stopColor="#000" />
        </linearGradient>
        <mask id="ch08-estompe" maskUnits="userSpaceOnUse" x={0} y={0} width={800} height={900}>
          <rect x={0} y={0} width={800} height={900} fill="url(#ch08-fondu)" />
        </mask>
        <clipPath id="ch08-scene-route">
          <rect x={0} y={0} width={800} height={900} />
        </clipPath>
      </defs>
      {finale > 0
        ? Array.from({ length: 9 }, (_, i) => {
            const a = rad(-160 + i * 17.5);
            return <line key={i} x1={400 + Math.cos(a) * 170} y1={440 + Math.sin(a) * 170} x2={400 + Math.cos(a) * (170 + 90 * finale)} y2={440 + Math.sin(a) * (170 + 90 * finale)} stroke={F.or} strokeWidth={6} strokeLinecap="round" opacity={finale} />;
          })
        : null}
      {/* Le sol. */}
      <g mask="url(#ch08-estompe)">
        <rect x={0} y={SOL - DOS} width={800} height={DOS + FACE} fill={F.filet} />
        <line x1={0} x2={800} y1={SOL - DOS} y2={SOL - DOS} stroke={F.encre2} strokeWidth={3} />
        <line x1={0} x2={800} y1={SOL + FACE} y2={SOL + FACE} stroke={F.encre} strokeWidth={5} />
      <g clipPath="url(#ch08-scene-route)">
      {ETAIS.map((e, i) => (
        <g key={i} opacity={1 - Math.min(1, e.retrait * 1.25)} transform={`translate(${e.sx * e.retrait} 0) rotate(${e.rot * e.retrait} ${e.x} ${SOL})`}>
          <rect x={e.x - e.l / 2} y={haut} width={e.l} height={SOL - haut} fill={e.rempli} stroke={F.encre} strokeWidth={4} />
          <rect x={e.x - e.l / 2 - 10} y={haut} width={e.l + 20} height={14} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
          <rect x={e.x - e.l / 2 - 14} y={SOL - 16} width={e.l + 28} height={16} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
          <Libelle x={e.x + e.l / 2 + 14} y={640} taille={34} ancre="start" graisse={600}>{LIBELLES.etais[i]}</Libelle>
        </g>
      ))}
      </g>
      {/* La route : une chaussée claire vue en surplomb, comme le sentier du plan 6, sur son remblai. */}
        <path d={`M${GAUCHE} ${TOIT + FACE} H${xR} L${X} ${SOL + FACE} H${GAUCHE} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M${GAUCHE} ${TOIT - DOS} H${xR} L${X} ${SOL - DOS} V${SOL + FACE} L${xR} ${TOIT + FACE} H${GAUCHE} Z`} fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M${GAUCHE} ${TOIT + FACE / 2} H${xR} L${X - 16} ${SOL + FACE / 2 - 6}`} fill="none" stroke={F.encre2} strokeWidth={5} strokeDasharray="34 26" />
        {/* Les bornes, au bord de la chaussée. */}
        {[xR - 728, xR - 112].map((x) => (
          <path key={x} d={`M${x - 13} ${TOIT - DOS + 8} V${TOIT - DOS - 26} Q${x - 13} ${TOIT - DOS - 40} ${x} ${TOIT - DOS - 40} Q${x + 13} ${TOIT - DOS - 40} ${x + 13} ${TOIT - DOS - 26} V${TOIT - DOS + 8} Z`} fill={F.parchemin} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        ))}
        <Libelle x={Math.min(400, xR - 170)} y={SOL - 58} taille={54} couleur={F.papier} graisse={600} opacite={motRoute}>{LIBELLES.route}</Libelle>
      </g>
      <g transform={`translate(400 ${yCentre}) rotate(${angle})`}>
        <rect x={-280} y={-30} width={560} height={30} rx={4} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        {[-220, -90, 60, 190].map((x) => (
          <path key={x} d={`M${x} -21 h40 M${x + 22} -10 h30`} stroke={F.cuir} strokeWidth={3} strokeLinecap="round" />
        ))}
        <Sac x={0} y={-32} s={1.2} texte={LIBELLES.salaire} tailleTexte={26} />
      </g>
    </Scene>
  );
};

const LAINE: [number, number, number][] = [[-36, -6, 26], [-14, -22, 28], [14, -22, 28], [36, -6, 24], [-22, 10, 24], [2, 14, 26], [26, 10, 24]];

/** Une brebis : de la laine, une tête sans visage. */
const Brebis: React.FC<{ x: number; y: number; s: number; marche: number; opacite?: number }> = ({ x, y, s, marche, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacite}>
    {[-30, -12, 14, 32].map((dx, i) => (
      <line key={dx} x1={dx} y1={20} x2={dx + Math.sin(marche + i * 1.6) * 9} y2={56} stroke={F.encre} strokeWidth={8} strokeLinecap="round" />
    ))}
    {LAINE.map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r + 2} fill={F.encre} />
    ))}
    {LAINE.map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r - 1} fill={F.papier} />
    ))}
    <ellipse cx={60} cy={-16} rx={16} ry={22} fill={F.cuir} stroke={F.encre} strokeWidth={3} transform="rotate(18 60 -16)" />
    <ellipse cx={47} cy={-34} rx={11} ry={6} fill={F.cuir} stroke={F.encre} strokeWidth={3} transform="rotate(-24 47 -34)" />
  </g>
);

/** Plan 8 : les brebis entrent, le poste pâlit, les soins montent de l'enclos. */
const IlluEnclos: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const D = longueurs(d, duree);
  const CX = 440;
  const CY = 650;
  const RX = 310;
  const RY = 185;
  const POTEAU = 74;
  const places = [
    { x: 305, y: 548 }, { x: 450, y: 538 }, { x: 590, y: 556 }, { x: 285, y: 664 }, { x: 430, y: 680 }, { x: 575, y: 668 },
  ];
  // Les plus éloignées de la porte entrent d'abord : aucune ne passe à travers une brebis déjà en place.
  const ordre = [2, 5, 1, 4, 0, 3];
  const entree = (k: number) => {
    const rang = ordre.indexOf(k);
    const a = lin(d[0] + 8, d[2] - 70, rang / 6);
    return { a, b: a + 76 };
  };
  const pale = p(f, d[1] + D[1] * 0.45, d[2]);
  const fin = p(f, d[3], d[3] + 30);
  const posts = (debut: number, finA: number, n: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = rad(lin(debut, finA, i / (n - 1)));
      return { x: CX + Math.cos(a) * RX, y: CY + Math.sin(a) * RY };
    });
  // L'enclos est fermé partout, sauf à gauche : l'ouverture laisse passer une brebis entière sous les yeux.
  const fond = posts(215, 360, 10);
  const devant = posts(0, 140, 9);
  const gond = fond[0];
  const battant = { x: gond.x - 92, y: gond.y - 16 };
  const Y_PORTE = 620;
  const rail = (pts: Pt[], dy: number) => pts.map((q, i) => `${i === 0 ? 'M' : 'L'}${q.x} ${q.y - dy}`).join(' ');
  const Barriere: React.FC<{ pts: Pt[] }> = ({ pts }) => (
    <g>
      {[26, 56].map((dy) => (
        <path key={dy} d={rail(pts, dy)} fill="none" stroke={F.cuir} strokeWidth={9} strokeLinejoin="round" />
      ))}
      {pts.map((q, i) => (
        <rect key={i} x={q.x - 8} y={q.y - POTEAU} width={16} height={POTEAU + 6} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
      ))}
    </g>
  );
  const TAGS = [
    { x: 420, y: 336, t: 0.56 },
    { x: 590, y: 226, t: 0.68 },
    { x: 702, y: 118, t: 0.8 },
  ];
  return (
    <Scene>
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill={F.papier} stroke={F.filet} strokeWidth={4} />
      {TAGS.map((t, i) => {
        const a = d[2] + D[2] * t.t;
        const m = p(f, a - 30, a + 12);
        const y = lin(510, t.y, m);
        const w = 42 + LIBELLES.soins[i].length * 15;
        const lueur = fin > 0 ? 3 + 2 * Math.sin(f / 8 + i) * fin : 3;
        return m > 0 ? (
          <g key={i} opacity={Math.max(0, Math.min(1, (470 - y) / 40))}>
            <line x1={t.x} x2={t.x} y1={y + 24} y2={510} stroke={F.or} strokeWidth={3} strokeDasharray="3 10" strokeLinecap="round" />
            <rect x={t.x - w / 2} y={y - 26} width={w} height={52} rx={10} fill={F.papier} stroke={F.or} strokeWidth={lueur} />
            <Libelle x={t.x} y={y + 10} taille={30} graisse={600}>{LIBELLES.soins[i]}</Libelle>
          </g>
        ) : null;
      })}
      {/* Le portillon, ouvert vers l'extérieur, derrière le passage des brebis. */}
      <g>
        {[26, 56].map((dy) => (
          <line key={dy} x1={gond.x} y1={gond.y - dy} x2={battant.x} y2={battant.y - dy} stroke={F.cuir} strokeWidth={8} strokeLinecap="round" />
        ))}
        <line x1={gond.x} y1={gond.y - 26} x2={battant.x} y2={battant.y - 56} stroke={F.cuir} strokeWidth={6} strokeLinecap="round" />
        <rect x={battant.x - 7} y={battant.y - 66} width={14} height={66} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
      </g>
      <Barriere pts={fond} />
      {places
        .map((q, k) => ({ q, k }))
        .sort((u, v) => u.q.y - v.q.y)
        .map(({ q, k }) => {
          const { a, b } = entree(k);
          const t = p(f, a, b);
          // Elle passe par la porte (à gauche), puis gagne sa place.
          const x = t < 0.45 ? lin(60, 215, t / 0.45) : lin(215, q.x, (t - 0.45) / 0.55);
          const y = t < 0.45 ? Y_PORTE : lin(Y_PORTE, q.y, (t - 0.45) / 0.55);
          const enMarche = t > 0 && t < 1;
          const paix = Math.sin(f / 21 + k) * 2.2;
          return t > 0 ? <Brebis key={k} x={x} y={y + (enMarche ? Math.abs(Math.sin(f / 4)) * -5 : paix)} s={0.88} marche={enMarche ? f / 3.2 : 0} opacite={Math.min(1, t * 8)} /> : null;
        })}
      <Barriere pts={devant} />
      {/* Le panneau. */}
      <g opacity={1 - 0.74 * pale}>
        <path d="M112 446 Q165 408 218 446 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
        <rect x={156} y={190} width={18} height={238} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
        <rect x={34} y={100} width={262} height={100} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={5} />
        <Libelle x={165} y={164} taille={40} graisse={600}>{LIBELLES.poste}</Libelle>
      </g>
    </Scene>
  );
};

const Feuille: React.FC<{ y: number; cote: number; s: number; l: number }> = ({ y, cote, s, l }) => (
  <g transform={`translate(400 ${y}) scale(${cote * s * l} ${s * l})`}>
    <path d="M0 8 C22 -44 78 -70 136 -22 C146 -14 152 -2 156 12 C124 -22 72 -24 2 22 Z" fill={F.orFonce} stroke={F.encre} strokeWidth={3 / Math.max(0.3, s * l)} strokeLinejoin="round" />
  </g>
);

const Fantome: React.FC<{ haut: number; sol: number }> = ({ haut, sol }) => (
  <g fill="none" stroke={F.encre2} strokeWidth={3.5} strokeDasharray="3 11" strokeLinecap="round">
    <line x1={400} x2={400} y1={sol - 6} y2={sol - haut} />
    {[{ h: 0.24, c: 1 }, { h: 0.38, c: -1 }, { h: 0.52, c: 1 }, { h: 0.66, c: -1 }, { h: 0.82, c: 1 }].map((l) => (
      <path key={l.h} transform={`translate(400 ${sol - l.h * haut}) scale(${l.c} 1)`} d="M0 8 C22 -44 78 -70 136 -22 C146 -14 152 -2 156 12" />
    ))}
  </g>
);

const Goutte: React.FC<{ x: number; y: number; s?: number; opacite?: number }> = ({ x, y, s = 1, opacite = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -34 C10 -14 22 -2 22 12 A22 22 0 0 1 -22 12 C-22 -2 -10 -14 0 -34 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} opacity={opacite} />
);

/** Plan 9 : la graine, la sueur, puis le maïs par étapes jusqu'à l'épi doré. */
const IlluMais: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const D = longueurs(d, duree);
  const SOL = 600;
  const graine = p(f, 6, d[0] + 20);
  const gouttes = [
    { x: 400, a: d[1] + 8 },
    { x: 215, a: d[1] + D[1] * 0.36 },
    { x: 585, a: d[1] + D[1] * 0.68 },
  ];
  const etapes = [...gouttes.map((g) => g.a + 30), d[2] + 6];
  const g = etapes.reduce((s, a) => s + p(f, a, a + 40) / etapes.length, 0);
  const HAUT = 440;
  const yTete = SOL - g * HAUT;
  const FEUILLES = [
    { h: 0.14, c: -1 }, { h: 0.24, c: 1 }, { h: 0.38, c: -1 }, { h: 0.52, c: 1 }, { h: 0.66, c: -1 }, { h: 0.82, c: 1 },
  ];
  const epi = p(f, d[2] + D[2] * 0.08, d[2] + D[2] * 0.3);
  const dore = p(f, d[2] + D[2] * 0.3, d[2] + D[2] * 0.5);
  const racines = p(f, gouttes[0].a + 25, gouttes[0].a + 80);
  // Pendant la première phrase, l'avenir qu'on ne regarde pas : le plant en pointillés, au-dessus de la graine.
  const fantome = p(f, d[0] + 40, d[0] + 110) * (1 - p(f, d[1] - 20, d[1] + 8));
  const avenir = p(f, d[2] + D[2] * 0.42, d[2] + D[2] * 0.56);
  const respire = 1 + 0.05 * Math.sin(f / 12);
  return (
    <Scene>
      {dore > 0
        ? Array.from({ length: 15 }, (_, i) => {
            const a = rad(-168 + i * (178 / 14));
            return <line key={i} x1={452 + Math.cos(a) * 124} y1={262 + Math.sin(a) * 124} x2={452 + Math.cos(a) * (124 + 70 * dore)} y2={262 + Math.sin(a) * (124 + 70 * dore)} stroke={F.or} strokeWidth={5} strokeLinecap="round" opacity={dore} />;
          })
        : null}
      {fantome > 0 ? (
        <g opacity={fantome}>
          <Fantome haut={HAUT} sol={SOL} />
        </g>
      ) : null}
      {gouttes.map((go, i) => {
        const t = interpolate(f, [go.a, go.a + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
        const onde = p(f, go.a + 28, go.a + 56);
        return (
          <g key={i}>
            {t > 0 && t < 1 ? <Goutte x={go.x} y={lin(40, SOL - 16, t)} s={1.05} /> : null}
            {onde > 0 && onde < 1 ? <ellipse cx={go.x} cy={SOL + 3} rx={18 + 56 * onde} ry={3 + 7 * onde} fill="none" stroke={F.encre2} strokeWidth={3} opacity={1 - onde} /> : null}
          </g>
        );
      })}
      {/* La terre, en coupe. */}
      <path d="M40 606 Q130 590 230 602 T420 600 T600 604 T760 598 V864 Q760 880 744 880 H56 Q40 880 40 864 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      {[[110, 660, 14], [190, 780, 10], [236, 848, 12], [650, 680, 13], [590, 800, 10], [700, 790, 14], [130, 830, 9], [290, 690, 8], [530, 690, 8]].map(([x, y, r]) => (
        <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.7} fill={F.cuirClair} />
      ))}
      {/* L'eau de la sueur descend vers la graine. */}
      {gouttes.map((go, i) => {
        const s = p(f, go.a + 30, go.a + 62);
        const fade = 1 - p(f, go.a + 62, go.a + 92);
        return s > 0 && fade > 0 ? <line key={i} x1={go.x} y1={SOL + 8} x2={lin(go.x, 400, s)} y2={lin(SOL + 8, 684, s)} stroke={F.orClair} strokeWidth={5} strokeDasharray="4 13" strokeLinecap="round" opacity={fade} /> : null;
      })}
      {racines > 0
        ? ['M400 722 C385 750 360 765 340 800', 'M400 722 C402 750 398 775 404 806', 'M400 722 C418 750 445 762 462 796', 'M400 722 C370 738 345 738 310 744', 'M400 722 C430 738 460 738 492 746'].map((c) => (
            <path key={c} d={c} fill="none" stroke={F.orClair} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - racines} />
          ))
        : null}
      <circle cx={400} cy={704} r={38 * respire} fill={F.orClair} opacity={0.22 * graine} />
      {g > 0 ? <path d={`M394 ${704} L${400 - 2 - 3 * g} ${yTete + 14} L400 ${yTete} L${400 + 2 + 3 * g} ${yTete + 14} L406 704 Z`} fill={F.orFonce} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" /> : null}
      <g transform={`translate(400 ${lin(560, 704, graine)}) rotate(-18)`} opacity={Math.min(1, graine * 4)}>
        <ellipse rx={30} ry={21} fill={F.or} stroke={F.encre} strokeWidth={4} />
        <path d="M-16 -2 Q0 -11 17 -3" fill="none" stroke={F.orFonce} strokeWidth={3} strokeLinecap="round" />
      </g>
      {FEUILLES.map((l, i) => {
        const y = SOL - l.h * HAUT;
        const pousse = Math.max(0, Math.min(1, (g - l.h) / 0.18));
        return pousse > 0 ? <Feuille key={i} y={y} cote={l.c} s={lin(0.25, 1, pousse)} l={1.06 - l.h * 0.28} /> : null;
      })}
      {/* L'épi. */}
      {epi > 0 ? (
        <g transform={`translate(412 ${SOL - 0.6 * HAUT}) rotate(24) scale(${epi})`}>
          <path d="M-36 0 C-48 -70 -30 -150 0 -192 C30 -150 48 -70 36 0 Q0 18 -36 0 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <path d="M-34 0 C-44 -60 -30 -130 0 -172 C30 -130 44 -60 34 0 Q0 14 -34 0 Z" fill={F.filet} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          <g opacity={dore}>
            <path d="M-34 0 C-44 -60 -30 -130 0 -172 C30 -130 44 -60 34 0 Q0 14 -34 0 Z" fill={F.or} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
            {Array.from({ length: 9 }, (_, r) => {
              const yR = -8 - r * 17;
              const demi = Math.min(30, 36 - Math.max(0, r - 3) * 6);
              const n = Math.max(1, Math.round((demi * 2) / 14));
              return Array.from({ length: n }, (_, k) => <ellipse key={`${r}-${k}`} cx={-demi + 7 + (k * (demi * 2 - 14)) / Math.max(1, n - 1)} cy={yR} rx={6} ry={7} fill={F.orClair} stroke={F.orFonce} strokeWidth={1.5} />);
            })}
          </g>
          <path d="M-38 2 C-62 -40 -56 -90 -34 -122 C-36 -80 -28 -36 -6 8 Q-22 10 -38 2 Z" fill={F.orFonce} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          <path d="M38 2 C62 -40 56 -90 34 -122 C36 -80 28 -36 6 8 Q22 10 38 2 Z" fill={F.orFonce} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
        </g>
      ) : null}
      <Libelle x={400} y={856} taille={36} couleur={F.papier} graisse={600} opacite={avenir}>{LIBELLES.avenir}</Libelle>
    </Scene>
  );
};

/** Plan 10 : la table se garnit, la bourse est repoussée, le rouleau se déroule. */
const IlluNehemie: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const D = longueurs(d, duree);
  const pousse = interpolate(f, [d[0] + 22, d[0] + 86], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const recul = p(f, d[0] + 8, d[0] + 22) * (1 - p(f, d[0] + 22, d[0] + 32));
  const xB = lin(170, 655, pousse) - recul * 14;
  const n = 8;
  const debutAssiettes = d[0] + D[0] * 0.24;
  const finAssiettes = d[0] + D[0] * 0.82;
  const ordreAssiette = (r: number, i: number) => r * n + (r === 0 ? i : n - 1 - i);
  const quand = (r: number, i: number) => lin(debutAssiettes, finAssiettes, ordreAssiette(r, i) / (2 * n));
  const deroule = p(f, d[1] + 2, d[1] + 62);
  const LARG = 300 * deroule;
  const rayons = p(f, d[2], d[2] + 50);
  const parJour = (f - d[2]) / 8;
  const T = 322;
  const B = 670;
  return (
    <Scene>
      <defs>
        <clipPath id="ch08-rouleau">
          <rect x={400 - LARG} y={100} width={LARG * 2} height={170} />
        </clipPath>
      </defs>
      {rayons > 0
        ? Array.from({ length: 13 }, (_, i) => {
            const x = lin(150, 650, i / 12);
            return <line key={i} x1={x} y1={104} x2={lin(x, 400, 0.22)} y2={104 - 78 * rayons} stroke={F.or} strokeWidth={5} strokeLinecap="round" opacity={rayons * (0.7 + 0.3 * Math.sin(f / 10 + i))} />;
          })
        : null}
      {/* Le rouleau. */}
      <g clipPath="url(#ch08-rouleau)">
        <rect x={100} y={118} width={600} height={134} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <text x={400} y={200} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={50} fontWeight={500} fill={F.orFonce}>{LIBELLES.souviens}</text>
      </g>
      {[-1, 1].map((c) => (
        <g key={c} opacity={p(f, 6, 26)}>
          <rect x={400 + c * LARG - 17} y={102} width={34} height={166} rx={10} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
          <rect x={400 + c * LARG - 7} y={90} width={14} height={190} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
        </g>
      ))}
      {/* La table, vue de dessus. */}
      <rect x={50} y={T} width={700} height={B - T} rx={16} fill={F.filet} stroke={F.encre} strokeWidth={5} />
      {[T + 66, T + 150, T + 236, T + 300].map((y, i) => (
        <path key={y} d={`M${70 + i * 30} ${y} H${720 - i * 22}`} stroke={F.cuirClair} strokeWidth={3} opacity={0.4} />
      ))}
      {[0, 1].flatMap((r) =>
        Array.from({ length: n }, (_, i) => {
          const x = 100 + i * 86;
          const y = r === 0 ? T + 54 : B - 54;
          const a = quand(r, i);
          const plein = p(f, a, a + 16);
          const onde = f > d[2] ? Math.max(0, Math.sin(parJour - (ordreAssiette(r, i) * Math.PI) / 8)) : 0;
          return (
            <g key={`${r}-${i}`}>
              <circle cx={x} cy={y} r={33} fill={F.papier} stroke={F.encre} strokeWidth={3.5} />
              <circle cx={x} cy={y} r={23} fill="none" stroke={F.filet} strokeWidth={2.5} />
              {plein > 0 ? (
                <g transform={`translate(${x} ${y}) scale(${plein * (1 + 0.07 * onde)})`}>
                  <circle cx={-7} cy={4} r={11} fill={F.or} stroke={F.orFonce} strokeWidth={2} />
                  <circle cx={8} cy={5} r={10} fill={F.argile} stroke={F.encre} strokeWidth={2} />
                  <circle cx={1} cy={-8} r={11} fill={F.orClair} stroke={F.orFonce} strokeWidth={2} />
                </g>
              ) : null}
            </g>
          );
        }),
      )}
      {/* La bourse du gouverneur, repoussée. */}
      <Sac x={xB} y={T + 244} s={0.78} rot={pousse * 6} />
      <Libelle x={xB} y={T + 120} taille={27} graisse={600}>{LIBELLES.gouverneur}</Libelle>
      {/* Cent cinquante : chacun a son point. */}
      {Array.from({ length: 150 }, (_, k) => {
        const a = lin(debutAssiettes, finAssiettes, k / 150);
        const o = p(f, a, a + 10);
        const col = k % 50;
        const ligne = Math.floor(k / 50);
        return o > 0 ? <circle key={k} cx={75 + col * 13.3} cy={712 + ligne * 19} r={5 * o} fill={F.or} stroke={F.orFonce} strokeWidth={1.2} /> : null;
      })}
      <Libelle x={400} y={812} taille={32} graisse={600} opacite={p(f, finAssiettes - 10, finAssiettes + 16)}>{LIBELLES.cent}</Libelle>
    </Scene>
  );
};

/** Plan 11 : l'aiguille dérive, tremble, revient et se fixe vers le haut. */
const IlluBoussole: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const D = longueurs(d, duree);
  const CX = 400;
  const CY = 548;
  const R = 268;
  const GAUCHE = -51;
  const DROITE = 51;
  const tRetour = d[2] + D[2] * 0.42;
  const tFixe = d[2] + D[2] * 0.82;
  const base = courbe(
    f,
    [0, d[0] + D[0] * 0.25, d[0] + D[0] * 0.65, d[1] + D[1] * 0.05, d[1] + D[1] * 0.8, tRetour, tFixe],
    [10, 10, GAUCHE, GAUCHE, DROITE, DROITE, 0],
  );
  const verrou = p(f, tRetour, tFixe);
  const derive = (Math.sin(f / 23) * 6 + Math.sin(f / 9) * 2.5) * (1 - verrou);
  const tremble = p(f, d[2], d[2] + 15) * (1 - p(f, tRetour - 5, tRetour + 25));
  const secousse = Math.sin(f * 1.45) * 8 * tremble;
  const depuis = Math.max(0, f - tFixe);
  const amorti = f > tFixe ? Math.exp(-depuis / 16) * Math.sin(depuis / 2.6) * 7 : 0;
  const angle = base + derive + secousse + amorti;
  const proche = (cible: number) => Math.max(0, 1 - Math.abs(base - cible) / 34);
  const lHommes = (0.32 + 0.68 * proche(GAUCHE)) * (1 - p(f, tRetour, tFixe));
  const lOrg = (0.32 + 0.68 * proche(DROITE)) * (1 - p(f, tRetour, tFixe));
  const rayons = p(f, tRetour + 10, d[3]);
  const service = p(f, d[4], d[4] + 40);
  const doree = p(f, tFixe - 12, tFixe + 12);
  return (
    <Scene>
      {/* Les rayons, en haut. */}
      <Lueur id="ch08-lueur-foi" x={CX} y={64} r={72} opacite={rayons} />
      {Array.from({ length: 11 }, (_, i) => {
        const a = rad(28 + i * 12.4);
        const r1 = 64;
        const r2 = lin(64, 150 + 22 * service, rayons) + (rayons > 0.98 ? 4 * Math.sin(f / 9 + i) : 0);
        return <line key={i} x1={CX + Math.cos(a) * r1} y1={64 + Math.sin(a) * r1} x2={CX + Math.cos(a) * r2} y2={64 + Math.sin(a) * r2} stroke={F.or} strokeWidth={6} strokeLinecap="round" opacity={rayons} />;
      })}
      {/* Les deux directions trompeuses. */}
      <Libelle x={118} y={300} taille={30} graisse={600} opacite={lHommes}>{LIBELLES.hommes}</Libelle>
      <Libelle x={672} y={300} taille={30} graisse={600} opacite={lOrg}>{LIBELLES.organisation}</Libelle>
      {/* Le boîtier. */}
      <path d={`M${CX - 24} ${CY - R - 2} a24 24 0 1 1 48 0`} fill="none" stroke={F.encre} strokeWidth={9} />
      <circle cx={CX} cy={CY} r={R} fill={F.or} stroke={F.encre} strokeWidth={6} />
      <circle cx={CX} cy={CY} r={R - 22} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      {Array.from({ length: 36 }, (_, i) => {
        const a = rad(i * 10);
        const grand = i % 9 === 0;
        return <line key={i} x1={CX + Math.sin(a) * (R - 34)} y1={CY - Math.cos(a) * (R - 34)} x2={CX + Math.sin(a) * (R - (grand ? 62 : 48))} y2={CY - Math.cos(a) * (R - (grand ? 62 : 48))} stroke={grand ? F.encre : F.encre2} strokeWidth={grand ? 6 : 3} strokeLinecap="round" />;
      })}
      {[0, 90, 180, 270].map((a) => (
        <path key={a} transform={`rotate(${a} ${CX} ${CY})`} d={`M${CX} ${CY - 170} L${CX + 26} ${CY - 26} L${CX} ${CY} L${CX - 26} ${CY - 26} Z`} fill={F.filet} stroke={F.encre2} strokeWidth={2} strokeLinejoin="round" />
      ))}
      {/* L'aiguille. */}
      <g transform={`rotate(${angle} ${CX} ${CY})`}>
        <path d={`M${CX} ${CY - 206} L${CX + 24} ${CY} H${CX - 24} Z`} fill={F.argile} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
        <path d={`M${CX} ${CY - 206} L${CX + 24} ${CY} H${CX - 24} Z`} fill={F.or} opacity={doree} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
        <path d={`M${CX} ${CY + 170} L${CX + 24} ${CY} H${CX - 24} Z`} fill={F.encre} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
      </g>
      <circle cx={CX} cy={CY} r={16} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
    </Scene>
  );
};

const FIOLE = 'M-54 0 Q-68 0 -62 -16 L-18 -116 V-168 H-25 V-182 H25 V-168 H18 V-116 L62 -16 Q68 0 54 0 Z';

/** Le marteau couché, base en y = 0 : il repose sur le coin de sa tête et le bout de son manche. */
const Marteau: React.FC = () => (
  <g transform="translate(0 -2) rotate(-7.84 86 0)">
    <rect x={-190} y={-62} width={286} height={24} rx={11} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
    <path d="M86 -98 H140 V-6 Q140 0 134 0 H92 Q86 0 86 -6 Z" fill={F.encre2} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M86 -98 Q98 -128 140 -136 Q124 -118 140 -98 Z" fill={F.encre2} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

/** Plan 12 : cinq fioles s'évaporent ; restent l'établi et l'outil, qui se mettent à luire. */
const IlluEtabli: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const D = longueurs(d, duree);
  const HAUT_E = 620;
  const COULEURS = [F.argile, F.or, F.orFonce, F.cuirClair, F.orClair];
  const X = [100, 250, 400, 550, 700];
  const QUAND = [0.2, 0.33, 0.46, 0.6, 0.78];
  const luit = p(f, d[2] + D[2] * 0.3, d[2] + D[2] * 0.5);
  // Le plateau occupe toute la largeur : l'outil vient d'au-dessus et se pose dessus, sans traverser le bois.
  const pose = interpolate(f, [d[2], d[2] + 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bounce });
  const voile = p(f, d[2], d[2] + 14);
  const xM = 385;
  const yM = HAUT_E - 150 * (1 - pose);
  const vanite = p(f, d[1] + D[1] * 0.84, d[1] + D[1] * 0.96) * (1 - p(f, d[2] - 4, d[2] + 18));
  const MOTS = [0.66, 0.76, 0.88];
  const lueurAtelier = luit * (0.88 + 0.12 * Math.sin(f / 11));
  return (
    <Scene>
      <defs>
        <clipPath id="ch08-fiole">
          <path d={FIOLE} />
        </clipPath>
      </defs>
      {/* La lueur de l'établi. */}
      {luit > 0 ? (
        <g opacity={lueurAtelier}>
          <ellipse cx={400} cy={HAUT_E - 40} rx={290} ry={130} fill={F.orClair} opacity={0.42} />
          {Array.from({ length: 13 }, (_, i) => {
            const a = rad(-170 + i * (160 / 12));
            return <line key={i} x1={400 + Math.cos(a) * 230} y1={HAUT_E - 30 + Math.sin(a) * 118} x2={400 + Math.cos(a) * (230 + 66 * luit)} y2={HAUT_E - 30 + Math.sin(a) * (118 + 66 * luit)} stroke={F.or} strokeWidth={6} strokeLinecap="round" />;
          })}
        </g>
      ) : null}
      {/* L'établi. */}
      {[110, 660].map((x) => (
        <rect key={x} x={x} y={HAUT_E + 44} width={30} height={830 - HAUT_E - 44 + 30} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      ))}
      <rect x={95} y={825} width={610} height={16} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <rect x={20} y={HAUT_E} width={760} height={48} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={20} y={HAUT_E} width={760} height={48} rx={5} fill="none" stroke={F.orClair} strokeWidth={5} opacity={luit} />
      {/* Les fioles. */}
      {LIBELLES.fioles.map((nom, i) => {
        const x = X[i];
        const entre = p(f, 4 + i * 16, 30 + i * 16);
        const a = d[1] + D[1] * QUAND[i];
        const e = p(f, a, a + 58);
        const niveau = (1 - e) * 104 * entre;
        const parti = 1 - p(f, a + 42, a + 70);
        return (
          <g key={nom}>
            {parti > 0 ? (
              <g opacity={parti} transform={`translate(${x} ${HAUT_E})`}>
                <g clipPath="url(#ch08-fiole)">
                  <rect x={-70} y={-niveau} width={140} height={niveau} fill={COULEURS[i]} />
                </g>
                <path d={FIOLE} fill="none" stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
                {e === 0
                  ? [0, 1, 2].map((b) => {
                      const u = ((f + b * 17 + i * 11) % 50) / 50;
                      return <circle key={b} cx={-14 + b * 14} cy={-8 - u * 80} r={4} fill={F.papier} opacity={entre * (1 - u)} />;
                    })
                  : null}
              </g>
            ) : null}
            {Array.from({ length: 6 }, (_, k) => {
              const u = (f - a - k * 8) / 58;
              if (u <= 0 || u >= 1) return null;
              const yV = lin(HAUT_E - 186, 96, u);
              const xV = x + Math.sin(u * 7 + k * 1.7 + i) * lin(4, 26, u);
              return <circle key={k} cx={xV} cy={yV} r={lin(9, 28, u)} fill={F.filet} stroke={F.encre2} strokeWidth={1.5} opacity={(1 - u) * 0.85} />;
            })}
            <Libelle x={x} y={HAUT_E + 33} taille={22} couleur={F.papier} graisse={600} opacite={entre * parti}>{nom}</Libelle>
          </g>
        );
      })}
      <Libelle x={400} y={300} taille={64} couleur={F.encre2} graisse={600} opacite={vanite}>{LIBELLES.vanite}</Libelle>
      {/* L'outil. */}
      {voile > 0 ? (
        <g transform={`translate(${xM} ${yM})`} opacity={voile}>
          <Marteau />
        </g>
      ) : null}
      {LIBELLES.oeuvres.map((m, i) => {
        const a = d[2] + D[2] * MOTS[i];
        const o = p(f, a, a + 22);
        return (
          <Libelle key={m} x={160 + i * 240} y={lin(330, 306, o)} taille={40} graisse={600} couleur={F.orFonce} opacite={o}>{m}</Libelle>
        );
      })}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluOuvertureEnveloppe,
  p2: IlluTyr,
  p3: IlluFoule,
  p4: IlluOnzieme,
  p5: IlluComparaison,
  p6: IlluChemin,
  p7: IlluRoute,
  p8: IlluEnclos,
  p9: IlluMais,
  p10: IlluNehemie,
  p11: IlluBoussole,
  p12: IlluEtabli,
  fin: Fin,
};
