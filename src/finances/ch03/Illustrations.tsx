import React from 'react';
import { Easing, interpolate } from 'remotion';
import { Coeur, IlluFin, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F, PoliceF } from '../theme';
import { LIBELLES } from './libelles';

const borne = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/** Progression linéaire, sans adoucissement. */
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], borne);
/** Chute : lente au départ, de plus en plus rapide. */
const chute = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...borne, easing: Easing.in(Easing.quad) });
/** Petit rebond amorti après l'image `a`. */
const rebond = (f: number, a: number, force = 16) => (f <= a ? 0 : -Math.abs(Math.sin((f - a) / 4.5)) * force * Math.exp(-(f - a) / 9));
/** Vaut 1 à l'image `c` et retombe à 0 à `largeur` images de distance. */
const cloche = (f: number, c: number, largeur: number) => Math.max(0, 1 - Math.abs(f - c) / largeur);

/** Rayons de lumière autour d'un point. */
const Rayons: React.FC<{ x: number; y: number; r1: number; r2: number; n?: number; o?: number; tour?: number; epaisseur?: number }> = ({ x, y, r1, r2, n = 12, o = 1, tour = 0, epaisseur = 6 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const a = ((i * 360) / n + tour) * (Math.PI / 180);
      return <line key={i} x1={x + Math.cos(a) * r1} y1={y + Math.sin(a) * r1} x2={x + Math.cos(a) * r2} y2={y + Math.sin(a) * r2} stroke={F.or} strokeWidth={epaisseur} strokeLinecap="round" />;
    })}
  </g>
);

/* ---------- La poubelle : dessinée en coupe, on voit ce qu'elle contient. ---------- */

const CORPS = 'M-270 -540 L-222 -8 Q0 22 222 -8 L270 -540';

const PoubelleFond: React.FC<{ cx: number; base: number; s: number }> = ({ cx, base, s }) => (
  <g transform={`translate(${cx} ${base}) scale(${s})`}>
    <path d={`${CORPS} Z`} fill={F.papier} />
    {[-0.66, -0.33, 0, 0.33, 0.66].map((k) => (
      <line key={k} x1={k * 262} y1={-490} x2={k * 218} y2={-20} stroke={F.filet} strokeWidth={7} strokeLinecap="round" />
    ))}
    <ellipse cx={0} cy={-540} rx={270} ry={34} fill={F.encre2} stroke={F.encre} strokeWidth={5} vectorEffect="non-scaling-stroke" />
  </g>
);

const PoubelleFace: React.FC<{ cx: number; base: number; s: number; levee?: number; couvercle?: number }> = ({ cx, base, s, levee = 0, couvercle = 0 }) => (
  <g transform={`translate(${cx} ${base}) scale(${s})`}>
    <path d={CORPS} fill="none" stroke={F.encre} strokeWidth={5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    {[-1, 1].map((c) => (
      <path key={c} d={`M${c * 262} -490 C${c * 325} -490 ${c * 322} -410 ${c * 255} -410`} fill="none" stroke={F.encre} strokeWidth={13} strokeLinecap="round" />
    ))}
    <path d="M-276 -540 A276 38 0 0 0 276 -540" fill="none" stroke={F.encre} strokeWidth={20} strokeLinecap="round" />
    <path d="M-276 -540 A276 38 0 0 0 276 -540" fill="none" stroke={F.cuirClair} strokeWidth={10} strokeLinecap="round" />
    {couvercle > 0 ? (
      <g opacity={couvercle} transform={`translate(0 ${-levee})`}>
        <path d="M-290 -546 Q0 -660 290 -546 Q0 -500 -290 -546 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path d="M-52 -606 Q0 -668 52 -606" fill="none" stroke={F.encre} strokeWidth={15} strokeLinecap="round" />
      </g>
    ) : null}
  </g>
);

const Maison: React.FC = () => (
  <g>
    <rect x={44} y={-98} width={26} height={56} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <rect x={-84} y={-22} width={168} height={122} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
    <path d="M-106 -20 L0 -106 L106 -20 Z" fill={F.argile} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-20} y={34} width={40} height={66} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <circle cx={10} cy={70} r={3.5} fill={F.orClair} />
    {[-54, 54].map((x) => (
      <g key={x}>
        <rect x={x - 17} y={8} width={34} height={34} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
        <path d={`M${x} 8 V42 M${x - 17} 25 H${x + 17}`} stroke={F.encre} strokeWidth={2.5} />
      </g>
    ))}
  </g>
);

const Releve: React.FC = () => (
  <g>
    <rect x={-96} y={-116} width={192} height={232} rx={6} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
    <Libelle x={0} y={-68} taille={27} graisse={600}>{LIBELLES.comptes}</Libelle>
    <Libelle x={0} y={-36} taille={27} graisse={600}>{LIBELLES.bancaires}</Libelle>
    <line x1={-74} x2={74} y1={-18} y2={-18} stroke={F.encre} strokeWidth={3} />
    {[12, 44, 76].map((y, i) => (
      <g key={y}>
        <line x1={-74} x2={[22, 34, 12][i]} y1={y} y2={y} stroke={F.encre2} strokeWidth={5} strokeLinecap="round" />
        <Piece x={58} y={y} r={13} />
      </g>
    ))}
  </g>
);

const Mallette: React.FC = () => (
  <g>
    <path d="M-52 -70 V-98 Q-52 -112 -38 -112 H38 Q52 -112 52 -98 V-70" fill="none" stroke={F.encre} strokeWidth={11} />
    <rect x={-150} y={-70} width={300} height={160} rx={14} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <line x1={-150} x2={150} y1={-22} y2={-22} stroke={F.cuirClair} strokeWidth={5} />
    {[-88, 88].map((x) => (
      <rect key={x} x={x - 15} y={-36} width={30} height={28} rx={4} fill={F.or} stroke={F.encre} strokeWidth={3} />
    ))}
    <Libelle x={0} y={48} taille={33} couleur={F.papier} graisse={600}>{LIBELLES.carrieres}</Libelle>
  </g>
);

const Etiquette: React.FC<{ texte: string }> = ({ texte }) => (
  <g>
    <path d="M-120 0 L-98 -26 H118 Q122 -26 122 -22 V22 Q122 26 118 26 H-98 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
    <circle cx={-96} cy={0} r={6} fill={F.papier} stroke={F.encre} strokeWidth={2.5} />
    <Libelle x={12} y={8} taille={23} graisse={600}>{texte}</Libelle>
  </g>
);

/* ---------- Plan 1 : la poubelle et la banque ; une pièce tombe dans le thermomètre. ---------- */

const Banque: React.FC<{ cx: number; base: number; lumiere: number }> = ({ cx, base, lumiere }) => (
  <g transform={`translate(${cx} ${base})`}>
    <rect x={-140} y={-22} width={280} height={22} fill={F.papier} stroke={F.encre} strokeWidth={4} />
    <rect x={-124} y={-42} width={248} height={20} fill={F.papier} stroke={F.encre} strokeWidth={4} />
    <rect x={-112} y={-214} width={224} height={172} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
    <path d="M-34 -42 V-124 Q-34 -152 0 -152 Q34 -152 34 -124 V-42 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <path d="M-34 -42 V-124 Q-34 -152 0 -152 Q34 -152 34 -124 V-42 Z" fill={F.orClair} opacity={lumiere} />
    {[-92, -56, 56, 92].map((x) => (
      <g key={x}>
        <rect x={x - 12} y={-204} width={24} height={162} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <path d={`M${x - 4} -194 V-52 M${x + 4} -194 V-52`} stroke={F.filet} strokeWidth={2.5} />
      </g>
    ))}
    <rect x={-128} y={-232} width={256} height={22} fill={F.papier} stroke={F.encre} strokeWidth={4} />
    <path d="M-146 -232 L0 -316 L146 -232 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <Piece x={0} y={-262} r={21} />
  </g>
);

const IlluTitre: React.FC<PropsIllustration> = ({ f }) => {
  const sol = 820;
  const poubelle = p(f, 2, 28);
  const banque = p(f, 14, 40);
  const c = chute(f, 52, 86);
  const niveau = 0.05 + 0.15 * p(f, 84, 118);
  const haut = 170 + 520 - niveau * 520;
  const yPiece = -44 + c * (haut + 44 - 10);
  const ride = lin(f, 86, 112);
  const couvercle = p(f, 128, 148) - p(f, 164, 180);
  return (
    <Scene>
      <line x1={10} x2={790} y1={sol} y2={sol} stroke={F.encre} strokeWidth={4} />
      <g opacity={poubelle} transform={`translate(0 ${(1 - poubelle) * 40})`}>
        <PoubelleFond cx={165} base={sol - 2} s={0.5} />
        <PoubelleFace cx={165} base={sol - 2} s={0.5} couvercle={1} levee={couvercle * 34 + rebond(f, 180, 10)} />
      </g>
      <g opacity={banque} transform={`translate(0 ${(1 - banque) * 40})`}>
        <Banque cx={632} base={sol - 2} lumiere={p(f, 104, 146)} />
      </g>
      <g opacity={p(f, 104, 146)}>
        {[-150, -125, -100, -75, -50, -25].map((deg, i) => {
          const a = (deg * Math.PI) / 180;
          const long = 40 + 6 * Math.sin(f / 9 + i);
          return <line key={deg} x1={632 + Math.cos(a) * 22} y1={sol - 320 + Math.sin(a) * 22} x2={632 + Math.cos(a) * long} y2={sol - 320 + Math.sin(a) * long} stroke={F.or} strokeWidth={5} strokeLinecap="round" />;
        })}
      </g>
      <Thermometre x={400} y={170} h={520} l={72} niveau={niveau} graduations={false} />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={444} x2={i % 2 === 0 ? 470 : 458} y1={170 + 65 * i} y2={170 + 65 * i} stroke={F.encre2} strokeWidth={3} />
      ))}
      {ride > 0 && ride < 1 ? <ellipse cx={400} cy={haut} rx={30 * ride} ry={6 * ride} fill="none" stroke={F.orFonce} strokeWidth={3} opacity={1 - ride} /> : null}
      {f < 87 ? <Piece x={400} y={yPiece} r={27} opacite={lin(f, 44, 52)} /> : null}
    </Scene>
  );
};

/* ---------- Plan 2 : le livre de comptes. ---------- */

const Voiture: React.FC = () => (
  <g>
    <path d="M-38 8 V-4 Q-38 -10 -30 -11 L-22 -12 L-12 -28 H14 L26 -12 Q38 -11 38 -2 V8 Z" fill={F.argile} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M-14 -13 L-8 -23 H1 V-13 Z M5 -23 H12 L19 -13 H5 Z" fill={F.orClair} stroke={F.encre} strokeWidth={2} />
    {[-21, 21].map((x) => (
      <circle key={x} cx={x} cy={9} r={9} fill={F.encre} stroke={F.filet} strokeWidth={2.5} />
    ))}
  </g>
);

const Acte: React.FC = () => (
  <g>
    <rect x={-25} y={-30} width={50} height={60} rx={3} fill={F.parchemin} stroke={F.encre} strokeWidth={3.5} />
    {[-16, -5, 6].map((y) => (
      <line key={y} x1={-16} x2={16} y1={y} y2={y} stroke={F.encre2} strokeWidth={3} />
    ))}
    <circle cx={12} cy={18} r={10} fill={F.argile} stroke={F.encre} strokeWidth={2.5} />
  </g>
);

const Cadenas: React.FC<{ o: number }> = ({ o }) => (
  <g opacity={o} transform={`scale(${1.5 - 0.5 * o})`}>
    <path d="M-11 -6 V-16 Q-11 -29 0 -29 Q11 -29 11 -16 V-6" fill="none" stroke={F.encre} strokeWidth={6} />
    <rect x={-18} y={-7} width={36} height={30} rx={4} fill={F.or} stroke={F.encre} strokeWidth={3.5} />
    <circle cx={0} cy={6} r={4} fill={F.encre} />
  </g>
);

const IlluLivre: React.FC<PropsIllustration> = ({ f, d }) => {
  const LIGNES = [
    { mot: LIBELLES.voitures, icone: <Voiture />, y: 462 },
    { mot: LIBELLES.argent, icone: <Piece x={0} y={0} r={30} />, y: 580 },
    { mot: LIBELLES.droits, icone: <Acte />, y: 698 },
  ];
  // Les lignes partent quand la phrase arrive à « comme une perte ».
  const departs = [d[0] + 165, d[0] + 205, d[0] + 245];
  // À la dernière phrase, elles reviennent et on s'y accroche : un cadenas par mot cité.
  const cadenas = [d[2] + 92, d[2] + 122, d[2] + 160];
  const lumiere = p(f, d[1] + 62, d[1] + 100);
  const eteinte = p(f, d[2] + 195, d[2] + 225);
  const titreDroite = 0.7 + 0.3 * Math.max(p(f, d[0] + 150, d[0] + 180) * (1 - p(f, d[2], d[2] + 40)), 0);
  return (
    <Scene>
      {/* La lumière de ce qu'on a trouvé. */}
      <g opacity={lumiere}>
        <Rayons x={400} y={102} r1={60} r2={92} n={14} o={1 - eteinte} tour={f / 3} />
        <circle cx={400} cy={102} r={48} fill={F.orClair} stroke={F.or} strokeWidth={5} opacity={1 - eteinte} />
        <circle cx={400} cy={102} r={48} fill={F.filet} stroke={F.encre2} strokeWidth={4} opacity={eteinte} />
        <Libelle x={400} y={234} taille={32} graisse={600} couleur={F.orFonce} opacite={1 - eteinte}>{LIBELLES.trouve}</Libelle>
        <Libelle x={400} y={234} taille={32} graisse={600} couleur={F.argile} opacite={eteinte}>{LIBELLES.pasTrouve}</Libelle>
      </g>
      {/* Le livre ouvert. */}
      <rect x={38} y={262} width={724} height={574} rx={12} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <path d="M58 286 Q230 268 400 298 V812 Q230 786 58 808 Z" fill={F.papier} stroke={F.encre} strokeWidth={3} />
      <path d="M742 286 Q570 268 400 298 V812 Q570 786 742 808 Z" fill={F.papier} stroke={F.encre} strokeWidth={3} />
      <line x1={400} x2={400} y1={298} y2={812} stroke={F.encre} strokeWidth={5} />
      {[0, 345].map((dx) =>
        LIGNES.map((l) => <line key={`${dx}-${l.y}`} x1={78 + dx} x2={380 + dx} y1={l.y + 50} y2={l.y + 50} stroke={F.filet} strokeWidth={3} />),
      )}
      <text x={228} y={358} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={42} fontWeight={500} fill={F.encre}>{LIBELLES.gains}</text>
      <text x={572} y={358} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={42} fontWeight={500} fill={F.argile} opacity={titreDroite}>{LIBELLES.perte}</text>
      <line x1={78} x2={380} y1={382} y2={382} stroke={F.encre} strokeWidth={4} />
      <line x1={423} x2={722} y1={382} y2={382} stroke={F.encre} strokeWidth={4} />
      {/* Les lignes du compte. */}
      {LIGNES.map((l, i) => {
        const aller = p(f, departs[i], departs[i] + 42);
        const retour = p(f, d[2] + i * 12, d[2] + 46 + i * 12);
        const position = aller - retour;
        const leve = Math.sin(position * Math.PI) * 20;
        const barre = p(f, departs[i] + 42, departs[i] + 64) * (1 - retour);
        const entree = p(f, 6 + i * 8, 26 + i * 8);
        const verrou = p(f, cadenas[i], cadenas[i] + 12);
        return (
          <g key={l.mot} opacity={entree} transform={`translate(${position * 345} ${-leve})`}>
            <g opacity={1 - 0.4 * barre}>
              <g transform={`translate(122 ${l.y})`}>{l.icone}</g>
              <Libelle x={170} y={l.y + 11} taille={31} ancre="start">{l.mot}</Libelle>
            </g>
            <line x1={78} x2={78 + 280 * barre} y1={l.y + 1} y2={l.y + 1} stroke={F.argile} strokeWidth={5} strokeLinecap="round" opacity={barre > 0 ? 1 : 0} />
            {verrou > 0 ? (
              <g transform={`translate(350 ${l.y})`}>
                <Cadenas o={verrou} />
              </g>
            ) : null}
          </g>
        );
      })}
    </Scene>
  );
};

/* ---------- Plan 3 : la poubelle. ---------- */

const VERRE = 104;
const GROSSI = 1.2;

const IlluPoubelle: React.FC<PropsIllustration> = ({ f, d }) => {
  const [t0, t1, t2] = d;
  // « Lorsque le ciel descend dans un cœur » : la lumière descend, le cœur s'éclaire.
  const ciel = p(f, t0 - 15, t0 + 45);
  const sortieCoeur = p(f, t0 + 105, t0 + 135);
  const grand = p(f, t0 + 112, t0 + 215);
  const reduit = p(f, t2 + 28, t2 + 72);
  const s = (0.45 + 0.55 * grand) * (1 - reduit) + 0.6 * reduit;
  const cx = 400 + (205 - 400) * reduit;
  const base = 830 + (700 - 830) * reduit;
  const couvercle = 1 - lin(f, t0 + 108, t0 + 132);
  const levee = 120 * lin(f, t0 + 108, t0 + 132);

  const OBJETS = [
    { x: 288, y: 702, r0: -18, r: -3, a: t0 + 340, e: <Maison /> },
    { x: 512, y: 696, r0: 16, r: 4, a: t0 + 392, e: <Releve /> },
    { x: 400, y: 476, r0: -12, r: -2, a: t0 + 442, e: <Mallette /> },
  ];

  // La loupe passe sur chaque objet : on évalue le contenu.
  const L0 = { x: 650, y: 150 };
  const etapes = [
    { x: 288, y: 690, a: t1 + 8, b: t1 + 52 },
    // Le verre se centre sur les mots : « comptes bancaires », puis « carrières ».
    { x: 516, y: 634, a: t1 + 92, b: t1 + 128 },
    { x: 400, y: 505, a: t1 + 168, b: t1 + 205 },
  ];
  let lx = L0.x;
  let ly = L0.y;
  for (const e of etapes) {
    const q = p(f, e.a, e.b);
    lx += (e.x - lx) * q;
    ly += (e.y - ly) * q;
  }
  const loupe = p(f, t1 - 6, t1 + 12) * (1 - p(f, t2 - 22, t2 - 2));
  // Le grossissement retombe à 1 avant le fondu : sous un verre qui s'efface, aucun mot ne se dédouble.
  const grossi = 1 + (GROSSI - 1) * p(f, t1, t1 + 12) * (1 - p(f, t2 - 44, t2 - 22));
  const eclats = [cloche(f, t1 + 72, 40), cloche(f, t1 + 148, 40), Math.min(1, lin(f, t1 + 195, t1 + 225))];

  const TAGS = [
    { mot: LIBELLES.maledictions, y: 646, a: t2 + 100, r: -1.5 },
    { mot: LIBELLES.maladies, y: 580, a: t2 + 158, r: 1.5 },
    { mot: LIBELLES.pauvrete, y: 514, a: t2 + 216, r: -1 },
  ];
  const second = p(f, t2 + 58, t2 + 94);
  const egal = p(f, t2 + 262, t2 + 285);
  const nomNotre = p(f, t2 + 66, t2 + 94);

  const fond = <PoubelleFond cx={cx} base={base} s={s} />;
  const face = <PoubelleFace cx={cx} base={base} s={s} couvercle={couvercle} levee={levee} />;
  // Les trésors tombent dans la poubelle, puis en ressortent : on les garde.
  const tresors = OBJETS.map((o, i) => {
    const c = chute(f, o.a, o.a + 28);
    if (c === 0) return null;
    const q = p(f, t2 + (2 - i) * 9, t2 + 30 + (2 - i) * 9);
    if (q === 1) return null;
    const y = 90 + (o.y - 90) * c + rebond(f, o.a + 28) - q * 300;
    const rot = o.r0 * (1 - c) + o.r;
    return (
      <g key={i} opacity={lin(f, o.a, o.a + 7) * (1 - q)} transform={`translate(${o.x} ${y}) rotate(${rot}) scale(${1 + 0.05 * eclats[i]})`}>
        {o.e}
      </g>
    );
  });

  return (
    <Scene>
      {/* La lumière qui descend, et le cœur. */}
      <g opacity={ciel * (1 - p(f, t0 + 300, t0 + 335))}>
        {[-54, -27, 0, 27, 54].map((x, i) => {
          const q = p(f, t0 - 15 + i * 2, t0 + 50 + i * 2);
          return <line key={x} x1={400 + x * 0.5} y1={10} x2={400 + x * (0.5 + 0.5 * q)} y2={10 + 190 * q} stroke={F.or} strokeWidth={7} strokeLinecap="round" strokeDasharray="30 22" strokeDashoffset={-f * 1.4} />;
        })}
      </g>
      <g opacity={ciel * (1 - sortieCoeur)}>
        <Coeur x={400} y={326} s={1.5 + 0.1 * cloche(f, t0 + 56, 22)} />
        <Coeur x={400} y={326} s={1.5 + 0.1 * cloche(f, t0 + 56, 22)} rempli={F.or} opacite={p(f, t0 + 36, t0 + 66)} />
      </g>

      {fond}
      {tresors}
      {face}

      {/* La loupe : le verre grossit vraiment ce qu'il couvre ; le manche part vers le haut, loin des mots. */}
      {loupe > 0 ? (
        <g opacity={loupe}>
          <line x1={lx + 76} y1={ly - 76} x2={lx + 132} y2={ly - 132} stroke={F.encre} strokeWidth={24} strokeLinecap="round" />
          <line x1={lx + 82} y1={ly - 82} x2={lx + 128} y2={ly - 128} stroke={F.cuirClair} strokeWidth={12} strokeLinecap="round" />
          <clipPath id="ch03-verre">
            <circle cx={lx} cy={ly} r={VERRE} />
          </clipPath>
          <g clipPath="url(#ch03-verre)">
            <rect x={lx - VERRE} y={ly - VERRE} width={VERRE * 2} height={VERRE * 2} fill={F.parchemin} />
            <g transform={`translate(${lx} ${ly}) scale(${grossi}) translate(${-lx} ${-ly})`}>
              {fond}
              {tresors}
              {face}
            </g>
          </g>
          <circle cx={lx} cy={ly} r={VERRE} fill={F.orClair} opacity={0.12} />
          <circle cx={lx} cy={ly} r={VERRE} fill="none" stroke={F.encre} strokeWidth={10} />
          <circle cx={lx} cy={ly} r={VERRE} fill="none" stroke={F.or} strokeWidth={4} />
        </g>
      ) : null}

      {/* La seconde poubelle, et les mêmes étiquettes dans les deux. */}
      {second > 0 ? (
        <g opacity={second} transform={`translate(${(1 - second) * 70} 0)`}>
          <PoubelleFond cx={595} base={700} s={0.6} />
        </g>
      ) : null}
      {TAGS.map((t) => {
        const c = chute(f, t.a, t.a + 26);
        if (c === 0) return null;
        const y = 90 + (t.y - 90) * c + rebond(f, t.a + 26, 10);
        return [205, 595].map((x) => (
          <g key={`${t.mot}-${x}`} opacity={lin(f, t.a, t.a + 6)} transform={`translate(${x} ${y}) rotate(${t.r * c})`}>
            <Etiquette texte={t.mot} />
          </g>
        ));
      })}
      {second > 0 ? (
        <g opacity={second} transform={`translate(${(1 - second) * 70} 0)`}>
          <PoubelleFace cx={595} base={700} s={0.6} />
        </g>
      ) : null}
      <Libelle x={205} y={762} taille={31} graisse={600} opacite={nomNotre}>{LIBELLES.notre}</Libelle>
      <Libelle x={595} y={762} taille={31} graisse={600} opacite={second}>{LIBELLES.monde}</Libelle>
      <g opacity={egal} stroke={F.or} strokeWidth={9} strokeLinecap="round">
        <line x1={380} x2={420} y1={568} y2={568} />
        <line x1={380} x2={420} y1={592} y2={592} />
      </g>
    </Scene>
  );
};

/* ---------- Plan 4 : la graine et la tige aux pièces. ---------- */

const SOL = 650;
const SEMENCE_Y = 738;
const TIGE_HAUT = 118;
const TIGE = `M400 ${SEMENCE_Y - 30} C398 600 403 420 400 ${TIGE_HAUT}`;

/** Chaque étage : la branche part de la tige à `y + 55` et se termine à `y`, à `D` de la tige. */
const ETAGES = [
  { y: 540, D: 195, pieces: [95, 195] },
  { y: 450, D: 300, pieces: [95, 200, 300] },
  { y: 360, D: 300, pieces: [95, 200, 300] },
  { y: 270, D: 195, pieces: [95, 195] },
  { y: 185, D: 165, pieces: [85, 165] },
];
const surBranche = (e: { y: number; D: number }, dx: number) => {
  const t = dx / e.D;
  return e.y + (1 - t) ** 2 * 55 + 2 * (1 - t) * t * 12;
};
/** Angle de la branche à `dx` de la tige, dans le sens de la pousse. */
const penteBranche = (e: { D: number }, c: number, dx: number) => {
  const t = dx / e.D;
  return (Math.atan2(-110 * (1 - t) + 24 * (1 - 2 * t), c * e.D) * 180) / Math.PI;
};
const surTige = (y: number, droite: boolean) => ({ x: 400, y, angle: -90, cote: droite ? -1 : 1, k: 1 });
/** Sur une branche : `dessus` dit de quel côté du bois l'épine sort. */
const surRameau = (etage: number, c: number, dx: number, dessus: boolean) => ({
  x: 400 + c * dx,
  y: surBranche(ETAGES[etage], dx),
  angle: penteBranche(ETAGES[etage], c, dx),
  cote: (c > 0) === dessus ? 1 : -1,
  k: 0.72,
});
/** Épines : elles naissent du bois, sur la tige et sur les branches, entre les pièces. */
const EPINES = [
  surTige(622, true),
  surTige(550, false),
  surTige(460, true),
  surTige(370, false),
  surTige(282, true),
  surRameau(1, -1, 148, true),
  surRameau(2, 1, 148, false),
  surRameau(0, 1, 148, true),
  surRameau(3, -1, 148, false),
  surRameau(1, 1, 250, true),
];
/** Origine sur l'axe du bois, pointe vers -y et penchée dans le sens de la pousse (+x) : dos bombé, ventre creux. */
const EPINE = 'M-15 0 Q-7 -30 20 -46 Q5 -24 15 0 Z';

/** Une lumière sans bord ni anneau ; ses rayons s'ouvrent vers le ciel et laissent la tige libre. */
const Lumiere: React.FC<{ x: number; y: number; o: number; f: number }> = ({ x, y, o, f }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={46} fill="url(#ch03-lumiere)" />
    {[-160, -130, -105, -75, -50, -20].map((deg, i) => {
      const a = (deg * Math.PI) / 180;
      const long = 42 + 5 * Math.sin(f / 11 + i);
      return <line key={deg} x1={x + Math.cos(a) * 24} y1={y + Math.sin(a) * 24} x2={x + Math.cos(a) * long} y2={y + Math.sin(a) * long} stroke={F.or} strokeWidth={5} strokeLinecap="round" />;
    })}
  </g>
);

const Graine: React.FC<{ x: number; y: number; ouverte: number }> = ({ x, y, ouverte }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 -36 C24 -14 30 12 16 28 C8 36 -8 36 -16 28 C-30 12 -24 -14 0 -36 Z" fill={F.orClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d={`M0 -30 C-8 -10 -8 10 0 28`} fill="none" stroke={F.orFonce} strokeWidth={3} opacity={1 - 0.5 * ouverte} />
  </g>
);

const IlluTige: React.FC<PropsIllustration> = ({ f, d }) => {
  const t0 = d[0];
  const pose = p(f, t0 + 130, t0 + 400);
  const yGraine = 520 + (SEMENCE_Y - 520) * pose;
  const nomHaut = 1 - lin(f, t0 + 112, t0 + 138);
  const nomBas = lin(f, t0 + 400, t0 + 430);
  const referme = p(f, t0 + 400, t0 + 470);

  // « ne reçoive au centuple » : la tige monte.
  const T0 = t0 + 518;
  const T1 = t0 + 800;
  const croit = lin(f, T0, T1);
  const hauteurTige = SEMENCE_Y - 30 - TIGE_HAUT;
  const quand = (y: number) => T0 + (T1 - T0) * ((SEMENCE_Y - 30 - y) / hauteurTige);
  const racines = p(f, T0 - 60, T0 + 100);
  const balance = Math.sin(f / 70) * 0.7 * croit;

  const tEpines = t0 + 842;
  const echelleEpine = (i: number) => p(f, tEpines + i * 7, tEpines + i * 7 + 16);
  const tVie = t0 + 965;
  const vie = p(f, tVie, tVie + 40);

  // Pierre : la graine se rappelle à nous. Puis la dernière phrase : l'or monte de la graine vers les pièces.
  const anneau = [d[1] + 20, d[1] + 95].map((a) => lin(f, a, a + 60));
  const passage = f < d[2] + 165 ? [d[2] + 25, d[2] + 165] : [d[2] + 175, d[2] + 285];
  const vague = interpolate(f, passage, [SEMENCE_Y - 30, TIGE_HAUT - 90], { ...borne, easing: Easing.inOut(Easing.sin) });
  const vagueActive = f >= passage[0] && f <= passage[1];
  const pointVisible = vagueActive && vague - TIGE_HAUT >= 40;
  const dorure = p(f, d[2] + 40, d[2] + 70);

  return (
    <Scene>
      {/* La terre, en coupe. */}
      <path d={`M16 ${SOL + 6} Q200 ${SOL - 10} 400 ${SOL} T784 ${SOL + 4} V858 Q784 870 772 870 H28 Q16 870 16 858 Z`} fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {[[70, 700, 44], [168, 780, 30], [250, 722, 36], [90, 830, 26], [570, 706, 40], [662, 780, 34], [716, 716, 24], [610, 835, 28]].map(([x, y, l]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y} q${l / 2} -7 ${l} 0`} fill="none" stroke={F.cuirClair} strokeWidth={4} strokeLinecap="round" />
      ))}
      {/* Le trou qui reçoit la graine, refermé ensuite. */}
      <path d={`M362 ${SOL + 1} L374 ${SEMENCE_Y + 44} Q400 ${SEMENCE_Y + 58} 426 ${SEMENCE_Y + 44} L438 ${SOL + 1} Z`} fill={F.encre} opacity={0.55 * lin(f, t0 + 90, t0 + 130) * (1 - referme)} />
      <path d="M340 647.6 Q400 626 460 652.6 V664 H340 Z" fill={F.cuir} opacity={referme} />
      <path d="M340 647.6 Q400 626 460 652.6" fill="none" stroke={F.encre} strokeWidth={5} opacity={referme} />

      {/* Les racines. */}
      {[
        `M392 ${SEMENCE_Y + 26} C378 ${SEMENCE_Y + 50} 350 ${SEMENCE_Y + 40} 326 ${SEMENCE_Y + 56}`,
        `M408 ${SEMENCE_Y + 26} C422 ${SEMENCE_Y + 50} 450 ${SEMENCE_Y + 40} 474 ${SEMENCE_Y + 56}`,
        `M384 ${SEMENCE_Y + 14} C360 ${SEMENCE_Y + 18} 340 ${SEMENCE_Y + 4} 306 ${SEMENCE_Y + 12}`,
        `M416 ${SEMENCE_Y + 14} C440 ${SEMENCE_Y + 18} 460 ${SEMENCE_Y + 4} 494 ${SEMENCE_Y + 12}`,
      ].map((r) => (racines === 0 ? null : (
        <path key={r} d={r} fill="none" stroke={F.orClair} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${racines} 1`} />
      )))}

      {/* La plante. */}
      <defs>
        <linearGradient id="ch03-epine" gradientUnits="userSpaceOnUse" x1={0} y1={-8} x2={8} y2={-32}>
          <stop offset={0} stopColor={F.cuirClair} />
          <stop offset={1} stopColor={F.argile} />
        </linearGradient>
        <radialGradient id="ch03-lumiere">
          <stop offset={0} stopColor={F.orClair} />
          <stop offset={0.45} stopColor={F.orClair} stopOpacity={0.75} />
          <stop offset={1} stopColor={F.orClair} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`rotate(${balance} 400 ${SOL})`}>
        {/* Le contour des épines passe sous le bois : aucun trait ne traverse la tige. */}
        {EPINES.map((e, i) => {
          const o = echelleEpine(i);
          return o > 0 ? (
            <g key={i} transform={`translate(${e.x} ${e.y}) rotate(${e.angle}) scale(${o * e.k} ${o * e.k * e.cote})`}>
              <path d={EPINE} fill={F.encre} stroke={F.encre} strokeWidth={8} strokeLinejoin="round" />
            </g>
          ) : null;
        })}
        {ETAGES.map((e, k) =>
          [-1, 1].map((c) => {
            const q = lin(f, quand(e.y + 55), quand(e.y + 55) + 42);
            if (q === 0) return null;
            return (
              <g key={`${k}${c}`}>
                <path d={`M400 ${e.y + 55} Q${400 + (c * e.D) / 2} ${e.y + 12} ${400 + c * e.D} ${e.y}`} fill="none" stroke={F.encre} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray={`${q} 1`} />
                <path d={`M400 ${e.y + 55} Q${400 + (c * e.D) / 2} ${e.y + 12} ${400 + c * e.D} ${e.y}`} fill="none" stroke={F.cuirClair} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${q} 1`} />
              </g>
            );
          }),
        )}
        {croit > 0 ? <path d={TIGE} fill="none" stroke={F.encre} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={`${croit} 1`} /> : null}
        {croit > 0 ? <path d={TIGE} fill="none" stroke={F.cuirClair} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${croit} 1`} /> : null}

        {/* Les épines, entre les pièces. */}
        {/* La chair de l'épine couvre le contour du bois à sa base : les deux ne font qu'une silhouette. */}
        {EPINES.map((e, i) => {
          const o = echelleEpine(i);
          return o > 0 ? (
            <g key={i} transform={`translate(${e.x} ${e.y}) rotate(${e.angle}) scale(${o * e.k} ${o * e.k * e.cote})`}>
              <path d={EPINE} fill="url(#ch03-epine)" />
            </g>
          ) : null;
        })}

        {/* Les pièces, nombreuses. */}
        {ETAGES.map((e, k) =>
          [-1, 1].map((c) =>
            e.pieces.map((dx) => {
              const a = quand(e.y + 55) + 12 + (dx / e.D) * 30;
              const o = p(f, a, a + 16);
              const y = surBranche(e, dx);
              const eclat = vagueActive ? Math.max(0, 1 - Math.abs(y - vague) / 70) : 0;
              return o > 0 ? (
                <g key={`${k}${c}${dx}`} transform={`translate(${400 + c * dx} ${y}) scale(${o * (1 + 0.2 * eclat)})`}>
                  <Piece x={0} y={0} r={30} />
                </g>
              ) : null;
            }),
          ),
        )}
        {/* La vie éternelle : une lumière au bout de la tige, qui n'est pas une pièce de plus. */}
        {vie > 0 ? <Lumiere x={400} y={TIGE_HAUT - 16} o={vie} f={f} /> : null}
      </g>

      {/* L'or qui remonte de la graine. */}
      {pointVisible ? <circle cx={400} cy={vague} r={13} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} /> : null}

      {/* La graine. */}
      {anneau.map((q, i) => (q > 0 && q < 1 ? <circle key={i} cx={400} cy={SEMENCE_Y} r={44 + q * 56} fill="none" stroke={F.orClair} strokeWidth={5} opacity={1 - q} /> : null))}
      <Graine x={400} y={yGraine} ouverte={croit} />

      {/* Les mots. */}
      <Libelle x={400} y={452} taille={30} graisse={600} opacite={nomHaut * lin(f, 4, 24)}>{LIBELLES.abandonne}</Libelle>
      <Libelle x={400} y={846} taille={29} graisse={600} couleur={dorure > 0.5 ? F.orClair : F.papier} opacite={nomBas}>{LIBELLES.abandonne}</Libelle>
      <Libelle x={324} y={628} taille={25} ancre="end" graisse={600} couleur={F.orFonce} opacite={lin(f, T0 - 15, T0 + 15)}>{LIBELLES.centuple}</Libelle>
      <Libelle x={466} y={628} taille={25} ancre="start" graisse={600} couleur={F.argile} opacite={lin(f, tEpines - 10, tEpines + 15)}>{LIBELLES.persecutions}</Libelle>
      <Libelle x={400} y={34} taille={28} graisse={600} couleur={F.orFonce} opacite={vie}>{LIBELLES.vieEternelle}</Libelle>
    </Scene>
  );
};

/* ---------- Plan 5 : les deux guichets. ---------- */

const PILE_BASE = 558;
const DISQUE = 26;
/** Assez de disques pour sortir par le haut de l'image (la scène commence 90 pixels sous le bord). */
const DISQUES_MAX = 26;

const Disque: React.FC<{ x: number; y: number; eclat?: number }> = ({ x, y, eclat = 0 }) => (
  <g>
    <path d={`M${x - 66} ${y - 9} V${y + 8} A66 13 0 0 0 ${x + 66} ${y + 8} V${y - 9} Z`} fill={F.or} stroke={F.orFonce} strokeWidth={3} strokeLinejoin="round" />
    <ellipse cx={x} cy={y - 9} rx={66} ry={13} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
    {eclat > 0 ? <ellipse cx={x} cy={y - 9} rx={72} ry={18} fill={F.papier} opacity={eclat * 0.75} /> : null}
  </g>
);

const Guichet: React.FC<{ cx: number; nom: string; taux: string; oTaux: number; lumiere: number; couleurTaux: string; children?: React.ReactNode }> = ({ cx, nom, taux, oTaux, lumiere, couleurTaux, children }) => (
  <g>
    <rect x={cx - 170} y={630} width={340} height={230} fill={F.papier} stroke={F.encre} strokeWidth={5} />
    <rect x={cx - 180} y={558} width={360} height={16} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
    <rect x={cx - 170} y={574} width={340} height={56} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <Libelle x={cx} y={611} taille={23} couleur={F.papier} graisse={600}>{nom}</Libelle>
    <path d={`M${cx - 104} 770 V680 Q${cx - 104} 648 ${cx - 72} 648 H${cx + 72} Q${cx + 104} 648 ${cx + 104} 680 V770 Z`} fill={F.filet} stroke={F.encre} strokeWidth={4} />
    <path d={`M${cx - 104} 770 V680 Q${cx - 104} 648 ${cx - 72} 648 H${cx + 72} Q${cx + 104} 648 ${cx + 104} 680 V770 Z`} fill={F.orClair} opacity={lumiere} />
    {[-70, -35, 0, 35, 70].map((dx) => (
      <line key={dx} x1={cx + dx} x2={cx + dx} y1={650} y2={770} stroke={F.encre} strokeWidth={3.5} />
    ))}
    {children}
    <rect x={cx - 128} y={770} width={256} height={14} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
    <rect x={cx - 156} y={796} width={312} height={52} rx={5} fill={F.parchemin} stroke={F.encre} strokeWidth={3} opacity={oTaux} />
    <Libelle x={cx} y={832} taille={28} graisse={600} couleur={couleurTaux} opacite={oTaux}>{taux}</Libelle>
  </g>
);

const IlluGuichets: React.FC<PropsIllustration> = ({ f, d }) => {
  const [t0, t1] = d;
  const tauxG = p(f, t0 + 72, t0 + 100);
  const disqueG = chute(f, t0 + 80, t0 + 108);
  const tauxD = p(f, t0 + 215, t0 + 250);
  const n = interpolate(f, [t0 + 130, t0 + 300], [0, DISQUES_MAX], { ...borne, easing: Easing.in(Easing.quad) });
  const recul = 1 - 0.4 * p(f, t1, t1 + 30);
  // « ce qu'ils font de ce qu'ils ont » : une petite pièce et une grosse entrent, et la colonne répond de même.
  const dep = [t1 + 128, t1 + 182];
  const pose = p(f, t1 + 5, t1 + 35);
  const vagues = dep.map((a) => a + 22);
  const X = 600;
  return (
    <Scene>
      {Array.from({ length: DISQUES_MAX }, (_, i) => {
        const q = Math.max(0, Math.min(1, n - i));
        if (q === 0) return null;
        const y = PILE_BASE - 14 - i * DISQUE;
        const eclat = Math.max(...vagues.map((a) => (f < a ? 0 : Math.max(0, 1 - Math.abs(i - (f - a) * 0.8) / 3))));
        return <Disque key={i} x={X} y={y + (1 - q) * DISQUE} eclat={eclat} />;
      })}
      <g opacity={recul}>
        {disqueG > 0 ? <Disque x={200} y={PILE_BASE - 14 - (1 - disqueG) * 70} /> : null}
        <Guichet cx={200} nom={LIBELLES.banque} taux={LIBELLES.cinq} oTaux={tauxG} lumiere={0} couleurTaux={F.encre} />
      </g>
      <Guichet cx={X} nom={LIBELLES.banqueFoi} taux={LIBELLES.dixMille} oTaux={tauxD} lumiere={p(f, t0 + 130, t0 + 200)} couleurTaux={F.orFonce}>
        {[
          { r: 14, x: X - 74, s: 0 },
          { r: 34, x: X + 44, s: 1 },
        ].map((c) => {
          const q = p(f, dep[c.s], dep[c.s] + 22);
          if (pose === 0 || q === 1) return null;
          return (
            <g key={c.r} opacity={pose * (1 - q)} transform={`translate(${c.x + (X - c.x) * q} ${770 - c.r - q * 40}) scale(${1 - 0.4 * q})`}>
              <Piece x={0} y={0} r={c.r} />
            </g>
          );
        })}
      </Guichet>
    </Scene>
  );
};

/* ---------- Plan 6 : l'échange, puis les deux chemins. ---------- */

const Coffret: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-44} width={80} height={44} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <path d="M-40 -44 Q0 -82 40 -44 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-8} y={-52} width={16} height={22} rx={2} fill={F.or} stroke={F.encre} strokeWidth={3} />
  </g>
);

type Pt = { x: number; y: number };
const bezier = (a: Pt, b: Pt, c: Pt, e: Pt, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u ** 3 * a.x + 3 * u ** 2 * t * b.x + 3 * u * t ** 2 * c.x + t ** 3 * e.x,
    y: u ** 3 * a.y + 3 * u ** 2 * t * b.y + 3 * u * t ** 2 * c.y + t ** 3 * e.y,
  };
};

const IlluEchange: React.FC<PropsIllustration> = ({ f, d }) => {
  const [t0, t1] = d;
  const fondu = p(f, t1 - 12, t1 + 14);
  const COFFRETS = [
    { x0: 110, x1: 510 },
    { x0: 200, x1: 600 },
    { x0: 290, x1: 690 },
  ];
  const q = COFFRETS.map((_, i) => p(f, t0 + 20 + (2 - i) * 34, t0 + 90 + (2 - i) * 34));
  const xs = COFFRETS.map((c, i) => c.x0 + (c.x1 - c.x0) * q[i]);
  const xPeu = (xs[0] + xs[1] + xs[2]) / 3;
  const xLumiere = 620 + (180 - 620) * p(f, t0 + 18, t0 + 170);

  const CHEMINS = [
    { a: { x: 170, y: 838 }, b: { x: 170, y: 610 }, c: { x: 330, y: 400 }, e: { x: 400, y: 172 }, nom: LIBELLES.pierre, deb: t1 + 72, fin: t1 + 218 },
    { a: { x: 630, y: 838 }, b: { x: 630, y: 610 }, c: { x: 470, y: 400 }, e: { x: 400, y: 172 }, nom: LIBELLES.paul, deb: t1 + 222, fin: t1 + 405 },
  ];
  const trace = p(f, t1 + 2, t1 + 66);
  const arrivees = CHEMINS.map((c) => p(f, c.fin - 8, c.fin + 26));
  const force = 0.55 + 0.25 * arrivees[0] + 0.2 * arrivees[1];

  return (
    <Scene>
      {/* L'échange sur le plateau. */}
      {fondu < 1 ? (
        <g opacity={1 - fondu}>
          <path d="M400 586 V708" stroke={F.encre} strokeWidth={18} />
          <path d="M400 586 V708" stroke={F.cuirClair} strokeWidth={8} />
          <path d="M290 740 Q400 680 510 740 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <path d="M56 546 H744 L716 586 H84 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
          {COFFRETS.map((_, i) => (
            <Coffret key={i} x={xs[i]} y={546 - Math.sin(q[i] * Math.PI) * 16} />
          ))}
          <Libelle x={xPeu} y={442} taille={29} graisse={600}>{LIBELLES.peu}</Libelle>
          <Rayons x={xLumiere} y={270} r1={66} r2={108} n={14} tour={f / 2} />
          <circle cx={xLumiere} cy={270} r={54} fill={F.orClair} stroke={F.or} strokeWidth={5} />
          <Libelle x={xLumiere} y={128} taille={29} graisse={600} couleur={F.orFonce}>{LIBELLES.vieMeilleure}</Libelle>
        </g>
      ) : null}

      {/* Les deux chemins mènent au même point. */}
      {fondu > 0 ? (
        <g opacity={fondu}>
          <Rayons x={400} y={136} r1={64 * force + 6} r2={118 * force + 6} n={16} tour={f / 2} o={lin(f, t1 + 10, t1 + 40)} />
          {[{ couleur: F.encre2, l: 82 }, { couleur: F.papier, l: 72 }].map((trait) =>
            CHEMINS.map((c) => (
              <path key={c.nom + trait.l} d={`M${c.a.x} ${c.a.y} C${c.b.x} ${c.b.y} ${c.c.x} ${c.c.y} ${c.e.x} ${c.e.y}`} fill="none" stroke={trait.couleur} strokeWidth={trait.l} pathLength={1} strokeDasharray={`${trace} 1`} />
            )),
          )}
          {CHEMINS.map((c) => (
            <path key={c.nom} d={`M${c.a.x} ${c.a.y} C${c.b.x} ${c.b.y} ${c.c.x} ${c.c.y} ${c.e.x} ${c.e.y}`} fill="none" stroke={F.encre2} strokeWidth={4} strokeDasharray="20 20" opacity={lin(f, t1 + 50, t1 + 72)} />
          ))}
          {CHEMINS.map((c, i) => {
            const t = 0.1 + 0.9 * p(f, c.deb, c.fin);
            if (f < c.deb - 10 || arrivees[i] >= 1) return null;
            const pt = bezier(c.a, c.b, c.c, c.e, t);
            const o = lin(f, c.deb - 10, c.deb + 5) * (1 - arrivees[i]);
            return (
              <g key={c.nom} opacity={o}>
                {i === 0 ? <Piece x={pt.x} y={pt.y} r={30} /> : <Coffret x={pt.x} y={pt.y + 24 * (1 - t)} s={0.72} />}
              </g>
            );
          })}
          <circle cx={400} cy={136} r={58 * force} fill={F.orClair} stroke={F.or} strokeWidth={5} opacity={lin(f, t1 + 10, t1 + 40)} />
          {CHEMINS.map((c) => (
            <Libelle key={c.nom} x={c.a.x} y={884} taille={32} graisse={600} couleur={f >= c.deb && f <= c.fin + 20 ? F.orFonce : F.encre} opacite={lin(f, t1 + 8, t1 + 40)}>{c.nom}</Libelle>
          ))}
        </g>
      ) : null}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluTitre,
  p2: IlluLivre,
  p3: IlluPoubelle,
  p4: IlluTige,
  p5: IlluGuichets,
  p6: IlluEchange,
  fin: IlluFin,
};
