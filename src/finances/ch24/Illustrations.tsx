import React from 'react';
import { Libelle, Piece, PropsIllustration, Scene, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';

const rad = (a: number) => (a * Math.PI) / 180;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/* ------------------------------------------------------------------ Le trousseau ---------- */

const R_ANNEAU = 78;
/** Demi-angle du trousseau fermé : les pannetons voisins ne se touchent pas. */
const FERME = 12;
const L_CLE = 340;
const PIVOT = 36;
/** Distance entre le centre de l'anneau et le bout d'une clé. */
const PORTEE = R_ANNEAU + L_CLE;

const PANNETONS = [
  'M8 258 H56 V276 H38 V290 H56 V306 H38 V318 H8 Z',
  'M8 264 H48 V280 H60 V296 H36 V308 H52 V324 H8 Z',
  'M8 262 H36 V274 H58 V292 H44 V304 H58 V322 H8 Z',
];

const TREFLE = [[-15, 22, 14], [15, 22, 14], [0, 3, 14]];

/** Une clé, l'origine au trou de l'anneau, la pointe vers le bas. `forme` : anneau, trèfle ou losange. */
const Cle: React.FC<{ forme: 0 | 1 | 2; couleur: string; sens: 1 | -1 }> = ({ forme, couleur, sens }) => (
  <g stroke={F.encre} strokeWidth={4} strokeLinejoin="round">
    <g transform={`scale(${sens} 1)`}>
      <path d={PANNETONS[forme]} fill={couleur} />
    </g>
    <rect x={-10} y={34} width={20} height={L_CLE - 34} rx={6} fill={couleur} />
    <rect x={-18} y={46} width={36} height={13} rx={4} fill={couleur} />
    {forme === 0 ? <circle cy={15} r={25} fill={couleur} /> : null}
    {forme === 1 ? (
      <g>
        {TREFLE.map((l) => <circle key={l[0]} cx={l[0]} cy={l[1]} r={l[2]} fill={couleur} />)}
        {TREFLE.map((l) => <circle key={l[0]} cx={l[0]} cy={l[1]} r={l[2] - 2} fill={couleur} stroke="none" />)}
        <circle cy={15} r={9} fill={couleur} stroke="none" />
      </g>
    ) : null}
    {forme === 2 ? <rect x={-19} y={-4} width={38} height={38} rx={7} transform="rotate(45 0 15)" fill={couleur} /> : null}
    <circle r={7} fill={F.parchemin} />
  </g>
);

/**
 * Le trousseau accroché à sa patte. `ecart` : demi-angle entre les clés (FERME : au repos, 36 : ouvertes).
 * `balance` : oscillation de tout le trousseau autour du crochet.
 */
const Trousseau: React.FC<{ x: number; y: number; s: number; ecart: number; balance?: number; opacite?: number }> = ({ x, y, s, ecart, balance = 0, opacite = 1 }) => {
  const cy = PIVOT + R_ANNEAU;
  const cles = [
    { k: -1, forme: 0, couleur: F.or, sens: -1 },
    { k: 1, forme: 2, couleur: F.or, sens: 1 },
    { k: 0, forme: 1, couleur: F.orClair, sens: 1 },
  ] as const;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacite}>
      <rect x={-62} y={-18} width={124} height={26} rx={7} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <circle cx={-42} cy={-5} r={4} fill={F.orClair} />
      <circle cx={42} cy={-5} r={4} fill={F.orClair} />
      <g transform={`rotate(${balance} 0 ${PIVOT})`}>
        {cles.map((c) => (
          <g key={c.k} transform={`rotate(${-c.k * ecart + balance * 0.35 * c.k} 0 ${cy}) translate(0 ${cy + R_ANNEAU})`}>
            <Cle forme={c.forme} couleur={c.couleur} sens={c.sens} />
          </g>
        ))}
        <circle cy={cy} r={R_ANNEAU} fill="none" stroke={F.encre} strokeWidth={13} />
        <circle cy={cy} r={R_ANNEAU} fill="none" stroke={F.orClair} strokeWidth={5} />
      </g>
      <path d={`M0 6 V${PIVOT - 8} Q0 ${PIVOT + 14} -20 ${PIVOT + 6}`} fill="none" stroke={F.encre} strokeWidth={10} strokeLinecap="round" />
    </g>
  );
};

/** Plan 1 : le trousseau oscille, puis s'immobilise. */
const IlluOuvertureCh24: React.FC<PropsIllustration> = ({ f }) => {
  const balance = Math.sin(f / 15) * 11 * (1 - p(f, 25, 200));
  return (
    <Scene>
      <Trousseau x={400} y={120} s={1.22} ecart={FERME} balance={balance} />
    </Scene>
  );
};

/** Plan 6 : le trousseau du début ; les clés s'écartent un peu et se posent. */
const IlluFinCh24: React.FC<PropsIllustration> = ({ f }) => {
  const ecart = FERME + 10 * p(f, 15, 90);
  const balance = Math.sin(f / 15) * 5 * (1 - p(f, 0, 135));
  return (
    <Scene>
      <Trousseau x={400} y={120} s={1.22} ecart={ecart} balance={balance} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ Les mains ------------- */

/** Une main de profil en simple contour, doigts vers la droite ; la paume est sur la ligne y = 0. */
const Main: React.FC<{ x: number; y: number; dessous?: boolean; rot?: number; e?: number }> = ({ x, y, dessous = false, rot = 0, e = 1.25 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${dessous ? -e : e})`} strokeLinejoin="round" strokeLinecap="round">
    <rect x={-240} y={-68} width={124} height={64} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <path d="M-120 -60 C-80 -67 -30 -67 20 -54 L140 -30 C174 -23 178 0 150 0 L-10 0 C-50 0 -84 5 -120 -8 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} />
    <path d="M38 -38 L136 -20 M34 -25 L126 -11 M34 -12 L116 -3" fill="none" stroke={F.encre2} strokeWidth={2.5} />
    <path d="M-86 -32 C-56 -30 -24 -18 0 -8 C14 -1 8 11 -6 8 C-36 2 -62 -4 -90 -10" fill={F.papier} stroke={F.encre} strokeWidth={4} />
    <rect x={-126} y={-71} width={16} height={70} rx={4} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
  </g>
);

/* ------------------------------------------------------------------ Plan 2 ---------------- */

const Sebile: React.FC = () => (
  <g strokeLinejoin="round">
    <path d="M250 526 Q258 652 400 652 Q542 652 550 526 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
    <path d="M272 590 Q400 620 528 590" fill="none" stroke={F.cuir} strokeWidth={3} />
    <ellipse cx={400} cy={526} rx={150} ry={22} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
  </g>
);

const ETIQUETTES = [{ k: -1, w: 170 }, { k: 0, w: 276 }, { k: 1, w: 160 }];

/** La sébile tendue s'efface ; à sa place le trousseau s'ouvre en trois clés étiquetées. */
const IlluP2: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, 40);
  const lumiere = p(f, d[0] + 165, d[0] + 205) * (1 - p(f, d[1] - 15, d[1] + 40));
  const insiste = p(f, d[1] + 300, d[1] + 315) * (1 - p(f, d[1] + 350, d[1] + 370));
  const efface = p(f, d[1] + 345, d[1] + 410);
  const bobX = Math.sin(f * 0.85) * 7 * insiste - Math.sin(f / 26) * 8;
  const bobY = Math.sin(f / 19) * 7 + efface * 40;
  const descend = p(f, d[1] + 190, d[1] + 275);
  const ouvre = p(f, d[1] + 410, d[1] + 480);
  const s = mix(0.55, 1.2, ouvre);
  const y = mix(-330, 10, descend) + 22 * ouvre;
  const balance = Math.sin(f / 15) * (5 * (descend > 0 ? 1 - p(f, d[1] + 275, d[1] + 370) : 0) + 4 * ouvre * (1 - p(f, d[1] + 470, d[1] + 560)));
  const brille = p(f, d[1] + 525, d[1] + 550);
  const yCentre = y + s * (PIVOT + R_ANNEAU);
  return (
    <Scene>
      {lumiere > 0 ? (
        <g opacity={lumiere}>
          {Array.from({ length: 11 }, (_, i) => {
            const a = rad(i * 18);
            return <line key={i} x1={400 + Math.cos(a) * 66} y1={58 + Math.sin(a) * 66} x2={400 + Math.cos(a) * 116} y2={58 + Math.sin(a) * 116} stroke={F.or} strokeWidth={6} strokeLinecap="round" />;
          })}
          <circle cx={400} cy={58} r={50} fill={F.orClair} />
        </g>
      ) : null}
      {/* Les bénédictions passent à côté et se perdent. */}
      {Array.from({ length: 10 }, (_, i) => {
        const t = (f - (d[0] + 195 + i * 26)) / 72;
        if (t <= 0 || t >= 1) return null;
        const sens = i % 2 === 0 ? -1 : 1;
        const large = 262 + ((i * 37) % 70);
        const yp = 80 + 760 * t * t;
        return <Piece key={i} x={400 + sens * large * t} y={yp} r={22} opacite={Math.max(0, Math.min(1, (t - 0.3) * 8)) * (1 - p(yp, 400, 610))} />;
      })}
      {efface < 1 ? (
        <g opacity={entree * (1 - efface)} transform={`translate(${bobX} ${bobY + (1 - entree) * 36})`}>
          <Sebile />
          <Main x={480} y={652} dessous />
        </g>
      ) : null}
      {descend > 0 ? <Trousseau x={400} y={y} s={s} ecart={mix(FERME, 36, ouvre)} balance={balance} /> : null}
      {ETIQUETTES.map((e, i) => {
        const a = d[1] + 468 + i * 24;
        const o = p(f, a, a + 20);
        if (o <= 0) return null;
        const tx = 400 + e.k * s * PORTEE * Math.sin(rad(36));
        const ty = yCentre + s * PORTEE * Math.cos(rad(e.k === 0 ? 0 : 36));
        const haut = ty + 32;
        return (
          <g key={e.k} opacity={o} transform={`translate(0 ${(1 - o) * -14})`}>
            <line x1={tx} y1={ty - 4} x2={tx} y2={haut} stroke={F.encre} strokeWidth={3} />
            <rect x={tx - e.w / 2} y={haut} width={e.w} height={58} rx={9} fill={F.papier} stroke={brille > 0 ? F.orFonce : F.encre} strokeWidth={3 + 2 * brille} />
            <Libelle x={tx} y={haut + 38} taille={26}>{LIBELLES.cles[i]}</Libelle>
          </g>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 3 ---------------- */

const Toit: React.FC = () => (
  <g strokeLinejoin="round">
    <rect x={190} y={370} width={420} height={130} fill={F.papier} stroke={F.encre} strokeWidth={5} />
    <rect x={365} y={412} width={70} height={88} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <rect x={238} y={404} width={72} height={58} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
    <path d="M274 404 V462 M238 433 H310" stroke={F.encre} strokeWidth={3} />
    <rect x={490} y={404} width={72} height={58} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
    <path d="M526 404 V462 M490 433 H562" stroke={F.encre} strokeWidth={3} />
    <path d="M290 230 H510 L660 370 H140 Z" fill={F.argile} stroke={F.encre} strokeWidth={5} />
    <path d="M254 265 H546 M216 300 H584 M178 335 H622" stroke={F.encre} strokeWidth={2.5} opacity={0.45} />
  </g>
);

const PorteVoix: React.FC = () => (
  <g strokeLinejoin="round" stroke={F.encre} strokeWidth={4}>
    <rect x={-40} y={12} width={22} height={50} rx={5} fill={F.cuir} />
    <rect x={-84} y={-13} width={24} height={26} rx={5} fill={F.cuir} />
    <path d="M-64 -16 L46 -58 Q60 0 46 58 L-64 16 Z" fill={F.or} />
    <path d="M-30 -29 Q-24 0 -30 29" fill="none" stroke={F.orFonce} strokeWidth={3} />
    <ellipse cx={47} cy={0} rx={13} ry={58} fill={F.orClair} />
  </g>
);

/** Les veines du bois, le long des bords : le milieu de la poutre reste libre pour les mots. */
const VEINES = [
  { a: 52, b: 190, y: 626 }, { a: 118, b: 256, y: 714 },
  { a: 300, b: 440, y: 626 }, { a: 372, b: 504, y: 714 },
  { a: 546, b: 690, y: 626 }, { a: 612, b: 752, y: 714 },
];

/** Le don crié sur le toit : la toute petite pièce s'étale sur la longue poutre et s'efface. */
const IlluP3: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, 30);
  const crie = p(f, d[0] + 92, d[0] + 108) * (1 - p(f, d[1] - 40, d[1] + 25));
  const baisse = p(f, d[1] + 70, d[1] + 150);
  const pousse = crie * Math.max(0, Math.sin(f / 9)) * 5;
  const poutre = p(f, d[0] + 140, d[0] + 205);
  const xBout = 30 + 740 * poutre;
  const roule = (f - (d[0] + 205)) / 42;
  const chute = Math.max(0, Math.min(1, (f - (d[0] + 247)) / 24));
  const etale = p(f, d[0] + 271, d[0] + 348);
  const efface = p(f, d[0] + 325, d[0] + 372);
  const R = 15;
  // La pièce suit le faîte, puis la pente, puis tombe du bord du toit.
  const seg = Math.max(0, Math.min(1, roule));
  let cx: number;
  let cy: number;
  if (seg < 0.15) {
    cx = mix(318, 288, seg / 0.15);
    cy = 230 - R;
  } else {
    const t = (seg - 0.15) / 0.85;
    cx = mix(288, 130, t);
    cy = mix(230 - R, 359, t);
  }
  const yPiece = cy + (595 - cy) * chute * chute;
  const saute = crie * Math.abs(Math.sin(f / 9)) * 5 * (seg > 0 ? 0 : 1);
  return (
    <Scene>
      <g opacity={entree}>
        <Toit />
        <g transform={`translate(${444 + pousse * -0.6} 163) rotate(${mix(-12, -1, baisse)} -29 62) scale(1.15)`}>
          {[0, 1, 2].map((i) => {
            const ph = ((f + i * 18) % 54) / 54;
            const r = 26 + ph * 120;
            const a = rad(34);
            return <path key={i} d={`M${60 + r * Math.cos(a)} ${-r * Math.sin(a)} A${r} ${r} 0 0 1 ${60 + r * Math.cos(a)} ${r * Math.sin(a)}`} fill="none" stroke={F.orFonce} strokeWidth={5} strokeLinecap="round" opacity={crie * (1 - ph)} />;
          })}
          <PorteVoix />
        </g>
      </g>
      {/* La poutre : elle s'allonge sur ses deux tréteaux, puis se marque. */}
      {poutre > 0 ? (
        <g strokeLinejoin="round">
          <line x1={30} x2={xBout} y1={840} y2={840} stroke={F.encre} strokeWidth={4} />
          {[{ x: 93, sens: 1 }, { x: 707, sens: -1 }].map((t) => {
            const o = Math.max(0, Math.min(1, (xBout - t.x) / 60));
            if (o <= 0) return null;
            return (
              <g key={t.x} opacity={o}>
                <path d={`M${t.x + t.sens * 23} 790 L${t.x + t.sens * 78} 730`} fill="none" stroke={F.cuirClair} strokeWidth={12} />
                <path d={`M${t.x + t.sens * 23} 790 L${t.x + t.sens * 78} 730`} fill="none" stroke={F.encre} strokeWidth={2} />
                <rect x={t.x - 23} y={730} width={46} height={110} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
                <rect x={t.x - 37} y={826} width={74} height={14} rx={3} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
              </g>
            );
          })}
          <rect x={30} y={610} width={xBout - 30} height={120} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
          {VEINES.map((v) => {
            const fin = Math.min(v.b, xBout - 8);
            return fin > v.a ? <line key={`${v.a}-${v.y}`} x1={v.a} x2={fin} y1={v.y} y2={v.y} stroke={F.cuirClair} strokeWidth={3} strokeLinecap="round" /> : null;
          })}
          {[276, 524].map((x) => (xBout > x + 4 ? <line key={x} x1={x} x2={x} y1={610} y2={730} stroke={F.encre} strokeWidth={3} /> : null))}
        </g>
      ) : null}
      {LIBELLES.poutre.map((lignes, i) => {
        const a = d[0] + 160 + i * 24;
        const o = p(f, a, a + 18);
        const x = 153 + i * 247;
        return (
          <g key={lignes[0]} opacity={o}>
            <Libelle x={x} y={662} taille={24} couleur={F.papier}>{lignes[0]}</Libelle>
            <Libelle x={x} y={694} taille={24} couleur={F.papier}>{lignes[1]}</Libelle>
          </g>
        );
      })}
      {/* La pièce, puis la mince trace qu'elle laisse sur toute la longueur. */}
      {etale === 0 ? (
        <Piece x={cx} y={yPiece - saute} r={R} opacite={entree} />
      ) : efface < 1 ? (
        <ellipse cx={mix(130, 400, etale)} cy={610 - mix(R, 3, etale)} rx={mix(R, 368, etale)} ry={mix(R, 3, etale)} fill={F.or} stroke={F.orFonce} strokeWidth={2} opacity={1 - efface} />
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 4 ---------------- */

const COUTURE = 'L-9 -36 L9 -14 L-8 8 L8 30 L0 60';

/** Une moitié de pièce fendue : même dessin que `Piece`, découpé le long de la fissure. */
const DemiPiece: React.FC<{ sens: 1 | -1; x: number; y: number; rot: number }> = ({ sens, x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <defs>
      <clipPath id={`ch24-demi${sens}`}>
        <path d={`M0 -60 ${COUTURE} L${sens * 80} 60 L${sens * 80} -60 Z`} />
      </clipPath>
    </defs>
    <g clipPath={`url(#ch24-demi${sens})`}>
      <Piece x={0} y={0} r={60} />
    </g>
    <path d={`M0 -60 ${COUTURE}`} fill="none" stroke={F.orFonce} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

/** La main du haut appuie, celle du bas descend ; la pièce se fend et la pression cesse. */
const IlluP4: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, d[0] + 10);
  const piece = p(f, d[0] + 55, d[0] + 90);
  const serre = p(f, d[0] + 60, d[0] + 100);
  const appui = 0.35 * p(f, d[0] + 215, d[0] + 248) + 0.4 * p(f, d[0] + 420, d[0] + 462) + 0.25 * p(f, d[1] + 88, d[1] + 140);
  const fissure = p(f, d[1] + 160, d[1] + 184);
  const fendu = p(f, d[1] + 184, d[1] + 206);
  const lache = p(f, d[1] + 190, d[1] + 236);
  const pressee = appui > 0 ? 1 - p(f, d[1] + 160, d[1] + 190) : 0;
  const tremble = Math.sin(f * 0.8) * 1.6 * pressee * appui;
  const yPiece = 300 + 250 * appui;
  const yHaut = mix(mix(yPiece - 150, yPiece - 60, serre), 160, lache);
  const yBas = mix(mix(yPiece + 150, yPiece + 60, serre), 470, lache) + tremble;
  const glisse = (1 - entree) * 40;
  const yP = yBas - 60;
  return (
    <Scene>
      {/* L'appui, en trois chevrons qui pèsent. */}
      {[0, 1, 2].map((i) => {
        const ph = ((f + i * 14) % 42) / 42;
        return (
          <path
            key={i}
            d={`M360 ${yHaut - 148 + ph * 34} L400 ${yHaut - 120 + ph * 34} L440 ${yHaut - 148 + ph * 34}`}
            fill="none"
            stroke={F.argile}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={pressee * Math.sin(ph * Math.PI) * p(f, d[0] + 205, d[0] + 225)}
          />
        );
      })}
      {fendu === 0 ? (
        <g opacity={piece}>
          <Piece x={400} y={yP} r={60} />
          <path d={`M400 ${yP - 60} ${COUTURE.replace(/L(-?\d+) (-?\d+)/g, (_, a, b) => `L${400 + Number(a)} ${yP + Number(b)}`)}`} fill="none" stroke={F.orFonce} strokeWidth={3} strokeLinejoin="round" pathLength={1} strokeDasharray={`${fissure} 1`} opacity={fissure > 0 ? 1 : 0} />
        </g>
      ) : (
        <g>
          <DemiPiece sens={-1} x={400 - 24 * fendu} y={yP} rot={-10 * fendu} />
          <DemiPiece sens={1} x={400 + 24 * fendu} y={yP} rot={10 * fendu} />
        </g>
      )}
      <g opacity={entree}>
        <Main x={320} y={yHaut - glisse} rot={mix(0, 3, appui) * (1 - lache)} />
      </g>
      <g opacity={entree}>
        <Main x={480} y={yBas + glisse} dessous rot={mix(0, 3, appui) * (1 - lache)} />
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 5 ---------------- */

const Cadenas: React.FC<{ x: number; y: number; ouvert?: number; rot?: number; s?: number; opacite?: number }> = ({ x, y, ouvert = 0, rot = 0, s = 1, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacite} strokeLinejoin="round">
    <g transform={`translate(${ouvert * 14} ${-ouvert * 12})`}>
      <path d="M-20 -22 V-40 A20 20 0 0 1 20 -40 V-22" fill="none" stroke={F.encre} strokeWidth={11} />
      <path d="M-20 -22 V-40 A20 20 0 0 1 20 -40 V-22" fill="none" stroke={F.filet} strokeWidth={4} />
    </g>
    <rect x={-36} y={-26} width={72} height={58} rx={8} fill={F.or} stroke={F.encre} strokeWidth={4} />
    <circle cy={-3} r={7.5} fill={F.encre} />
    <path d="M-4 -2 L-6 16 H6 L4 -2 Z" fill={F.encre} />
  </g>
);

const CADENAS = [
  { x: 400, y: 660 },
  { x: 225, y: 515 },
  { x: 575, y: 515 },
  { x: 400, y: 375 },
  { x: 270, y: 660 },
  { x: 530, y: 660 },
  { x: 345, y: 515 },
  { x: 455, y: 515 },
  { x: 260, y: 375 },
  { x: 540, y: 375 },
];

/** L'inclinaison de chaque cadenas une fois tombé, de gauche à droite. */
const PENCHES = [-9, 6, -4, 9, -6, 3, -9, 7, -3, 8];

/** Le coffre se couvre de cadenas ; il s'ouvre, vide ; les cadenas tombent et une petite flamme s'allume. */
const IlluP5: React.FC<PropsIllustration> = ({ f, d }) => {
  const arrivees = [d[0] + 40, d[0] + 110, d[0] + 180, d[0] + 240, d[0] + 283, d[0] + 343, d[0] + 405, d[1] + 88, d[1] + 132, d[1] + 165];
  const chocs = arrivees.reduce((s, a) => s + (f >= a + 10 && f < a + 26 ? Math.sin(((f - a - 10) / 16) * Math.PI) * 7 : 0), 0);
  const ouvre = p(f, d[1] + 208, d[1] + 245);
  const peur = p(f, d[1] + 88, d[1] + 110) * (1 - p(f, d[1] + 188, d[1] + 200));
  const tremble = Math.sin(f * 1.5) * 3.2 * peur;
  const flamme = p(f, d[1] + 258, d[1] + 286);
  const yFront = mix(430, 130, ouvre);
  const largeurFront = mix(270, 238, ouvre);
  const retourne = yFront < 300;
  const lueur = 1 + Math.sin(f / 5) * 0.06 + Math.sin(f / 2.7) * 0.04;
  return (
    <Scene>
      <path d="M78 690 H722 L776 852 H24 Z" fill={F.filet} opacity={0.55} />
      <line x1={24} x2={776} y1={852} y2={852} stroke={F.encre} strokeWidth={4} />
      <g transform={`translate(${tremble} ${chocs - 30})`}>
        {/* L'intérieur, vide, puis la flamme. */}
        <path d="M130 430 L180 300 H620 L670 430 Z" fill={F.encre} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        {flamme > 0 ? (
          <g>
            <circle cx={400} cy={392} r={84 * flamme * lueur} fill={F.or} opacity={0.22} />
            <g transform={`translate(400 432) scale(${flamme * lueur} ${flamme * (1 + Math.sin(f / 3.3) * 0.08)})`}>
              <path d="M0 0 C-44 -4 -46 -44 -20 -66 C-16 -46 -6 -44 -4 -54 C-4 -74 4 -92 14 -104 C14 -80 46 -60 40 -30 C36 -10 22 -2 0 0 Z" fill={F.or} stroke={F.orFonce} strokeWidth={3} />
              <path d="M0 -2 C-20 -6 -20 -28 -6 -40 C-2 -30 6 -36 8 -50 C18 -38 24 -24 18 -12 C14 -6 8 -2 0 -2 Z" fill={F.orClair} />
            </g>
          </g>
        ) : null}
        {/* Le corps du coffre. */}
        <rect x={130} y={430} width={540} height={320} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
        <path d="M130 585 H670" stroke={F.encre} strokeWidth={3} opacity={0.55} />
        <path d="M130 510 H670 M130 660 H670" stroke={F.encre} strokeWidth={2} opacity={0.3} />
        <rect x={130} y={430} width={32} height={320} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <rect x={638} y={430} width={32} height={320} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <rect x={154} y={750} width={58} height={20} rx={3} fill={F.encre} />
        <rect x={588} y={750} width={58} height={20} rx={3} fill={F.encre} />
        {/* Le couvercle, charnière à l'arrière : il pivote et montre son revers. */}
        <path
          d={`M${400 - largeurFront} ${yFront} Q${400 - largeurFront} 300 180 300 L620 300 Q${400 + largeurFront} 300 ${400 + largeurFront} ${yFront} Z`}
          fill={retourne ? F.cuirClair : F.cuir}
          stroke={F.encre}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        {ouvre === 0 ? <path d="M136 402 H664" stroke={F.encre} strokeWidth={3} opacity={0.55} /> : null}
        {ouvre === 0 ? null : <line x1={400 - largeurFront + 4} x2={400 + largeurFront - 4} y1={yFront} y2={yFront} stroke={F.encre} strokeWidth={7} strokeLinecap="round" />}
      </g>
      {CADENAS.map((c, i) => {
        const a = arrivees[i];
        const pose = p(f, a - 4, a + 12);
        if (pose <= 0) return null;
        const debutChute = d[1] + 186 + ((i * 7) % 24);
        const t = Math.max(0, Math.min(1, (f - debutChute) / 22));
        const place = [3, 0, 9, 5, 1, 7, 2, 4, 6, 8][i];
        const xSol = 62 + place * 75.5;
        const penche = PENCHES[place];
        const ySol = 850 - (26 * Math.cos(rad(penche)) + 30 * Math.sin(rad(Math.abs(penche))));
        const x = mix(c.x, xSol, t);
        const y = mix(c.y - 30, ySol, t * t);
        const rot = t * penche;
        return <Cadenas key={i} x={x + tremble * (1 - t)} y={y + chocs * (1 - t)} s={mix(1.5, 1, pose) * mix(1, 0.82, t)} opacite={pose} ouvert={p(f, debutChute, debutChute + 8)} rot={rot} />;
      })}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluOuvertureCh24,
  p2: IlluP2,
  p3: IlluP3,
  p4: IlluP4,
  p5: IlluP5,
  fin: IlluFinCh24,
};
