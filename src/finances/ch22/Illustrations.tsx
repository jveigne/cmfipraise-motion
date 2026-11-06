import React from 'react';
import { interpolate } from 'remotion';
import { Coeur, Libelle, Piece, PropsIllustration, Scene, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';

/** Progression 0 → 1 à vitesse constante. */
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const rad = (deg: number) => (deg * Math.PI) / 180;

/** La couronne, posée sur sa base (`y` = bas de la couronne). `eclat` allume de courts rayons autour. */
const Couronne: React.FC<{ x: number; y: number; s: number; angle?: number; eclat?: number }> = ({ x, y, s, angle = 0, eclat = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
    {eclat > 0
      ? [-160, -130, -50, -20].map((a) => (
          <line
            key={a}
            x1={Math.cos(rad(a)) * 86}
            y1={-30 + Math.sin(rad(a)) * 62}
            x2={Math.cos(rad(a)) * (86 + 26 * eclat)}
            y2={-30 + Math.sin(rad(a)) * (62 + 26 * eclat)}
            stroke={F.or}
            strokeWidth={4.5 / s}
            strokeLinecap="round"
            opacity={eclat}
          />
        ))
      : null}
    <path d="M-56 0 L-66 -56 L-30 -24 L0 -68 L30 -24 L66 -56 L56 0 Z" fill={F.or} stroke={F.encre} strokeWidth={3.5 / s} strokeLinejoin="round" />
    <rect x={-56} y={-15} width={112} height={15} fill={F.orClair} stroke={F.encre} strokeWidth={3 / s} />
    {[-34, 0, 34].map((j) => (
      <circle key={j} cx={j} cy={-7.5} r={4.2} fill={F.argile} stroke={F.encre} strokeWidth={1.5 / s} />
    ))}
    {[
      [-66, -56, 6],
      [0, -68, 7],
      [66, -56, 6],
    ].map(([cx, cy, r]) => (
      <circle key={cx} cx={cx} cy={cy} r={r} fill={F.orClair} stroke={F.encre} strokeWidth={2.5 / s} />
    ))}
  </g>
);

/**
 * Le coffre vu de face, fermé ou entrouvert (`ouvert` de 0 à 1 : le bord du couvercle se soulève et
 * découvre l'intérieur). La serrure est un cœur, dont `coeur` règle la couleur et le battement.
 */
const Coffre: React.FC<{ cx: number; bas: number; l: number; h: number; hc: number; ouvert?: number; coeur?: number; battement?: number }> = ({
  cx, bas, l, h, hc, ouvert = 0, coeur = 0, battement = 1,
}) => {
  const rebord = bas - h;
  const ecart = ouvert * hc * 0.7;
  const yLevre = rebord - ecart;
  const haut = hc + ecart * 0.3 - ecart;
  const x0 = cx - l / 2 - 4;
  const x1 = cx + l / 2 + 4;
  const rx = (x1 - x0) / 2;
  const sangle = [-0.32, 0.32].map((k) => cx + k * l);
  const dome = (x: number) => yLevre - haut * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
  const ls = l * 0.055;
  const es = l / 420;
  return (
    <g>
      {ecart > 0 ? (
        <g>
          <rect x={cx - l / 2 + 4} y={yLevre - 2} width={l - 8} height={ecart + 4} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
          {[-0.3, -0.1, 0.1, 0.3].map((k) => (
            <circle key={k} cx={cx + k * l} cy={rebord - 2} r={Math.min(ecart * 0.45, 16 * es)} fill={F.or} stroke={F.orFonce} strokeWidth={2} />
          ))}
        </g>
      ) : null}
      <rect x={cx - l / 2} y={rebord} width={l} height={h} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      {[0.36, 0.68].map((k) => (
        <line key={k} x1={cx - l / 2 + 4} x2={cx + l / 2 - 4} y1={rebord + h * k} y2={rebord + h * k} stroke={F.cuirClair} strokeWidth={3} />
      ))}
      {sangle.map((x) => (
        <rect key={x} x={x - ls / 2} y={rebord} width={ls} height={h} fill={F.or} stroke={F.encre} strokeWidth={3} />
      ))}
      <path d={`M${x0} ${yLevre} A${rx} ${haut} 0 0 1 ${x1} ${yLevre} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {sangle.map((x) => (
        <path key={x} d={`M${x - ls / 2} ${yLevre} V${dome(x - ls / 2)} L${x + ls / 2} ${dome(x + ls / 2)} V${yLevre} Z`} fill={F.or} stroke={F.encre} strokeWidth={3} />
      ))}
      <line x1={x0} x2={x1} y1={yLevre} y2={yLevre} stroke={F.encre} strokeWidth={6} />
      <rect x={cx - 34 * es} y={rebord + 4} width={68 * es} height={h * 0.52} rx={5} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
      <g opacity={coeur}>
        <Coeur x={cx} y={rebord + 4 + h * 0.27} s={0.46 * es * battement} rempli={F.argile} />
      </g>
      <g opacity={1 - coeur}>
        <Coeur x={cx} y={rebord + 4 + h * 0.27} s={0.46 * es} rempli={F.or} />
      </g>
    </g>
  );
};

/** La pièce du chapitre, marquée d'un cœur dès que le texte dit « parce qu'il aime Dieu ». */
const PieceMarquee: React.FC<{ x: number; y: number; r: number; marque: number; opacite?: number }> = ({ x, y, r, marque, opacite = 1 }) => (
  <g opacity={opacite}>
    <Piece x={x} y={y} r={r} />
    {marque > 0 ? <Coeur x={x} y={y + r * 0.04} s={(r / 96) * marque} rempli={F.argile} contour={F.orFonce} /> : null}
  </g>
);

/** Ouverture : la couronne sur le coffre fermé ; le coffre s'entrouvre, une lueur en sort. */
const IlluTitre: React.FC<PropsIllustration> = ({ f }) => {
  const pose = p(f, 0, 34);
  const ouvert = 0.62 * p(f, 92, 150);
  const lueur = p(f, 100, 165);
  const vibre = 1 + 0.05 * Math.sin(f / 13);
  const rebord = 465;
  const cy = rebord - 30 * ouvert;
  const bas = 655;
  return (
    <Scene>
      <defs>
        <radialGradient id="ch22-lueur">
          <stop offset="0%" stopColor={F.orClair} stopOpacity={0.95} />
          <stop offset="55%" stopColor={F.orClair} stopOpacity={0.4} />
          <stop offset="100%" stopColor={F.orClair} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={400} cy={cy} rx={390 * vibre} ry={250 * vibre} fill="url(#ch22-lueur)" opacity={lueur} />
      {Array.from({ length: 15 }, (_, i) => {
        // Les rayons du milieu passeraient derrière la couronne : ils sont retirés.
        if (i >= 5 && i <= 9) return null;
        const a = rad(-176 + (i * 172) / 14);
        const long = (i % 2 === 0 ? 372 : 322) * (0.86 + 0.14 * lueur);
        return (
          <line
            key={i}
            x1={400 + Math.cos(a) * 270}
            y1={cy + Math.sin(a) * 150}
            x2={400 + Math.cos(a) * long}
            y2={cy + Math.sin(a) * (long * 0.62)}
            stroke={F.or}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={lueur * (0.72 + 0.28 * Math.sin(f / 15 + i))}
          />
        );
      })}
      <line x1={70} x2={730} y1={bas} y2={bas} stroke={F.encre} strokeWidth={4} />
      <Coffre cx={400} bas={bas} l={440} h={190} hc={100} ouvert={ouvert} />
      <Couronne x={400} y={rebord - 100 - 0.42 * ouvert * 70 - (1 - pose) * 170 + 6} s={1.55} />
    </Scene>
  );
};

/**
 * Les pierres des fondations, de part et d'autre de la grande pierre centrale qui reçoit la grosse pièce.
 * Un seul rang à remplir : chaque pierre s'ouvre sur le rail qui court au-dessus, aucune pièce n'en traverse une autre.
 */
const PIERRES = [
  { x: 85, l: 74 },
  { x: 159, l: 92 },
  { x: 251, l: 74 },
  { x: 475, l: 74 },
  { x: 549, l: 92 },
  { x: 641, l: 74 },
];
const Y_PIERRE = 710;
const H_PIERRE = 90;
const Y_SOL = 830;
/** Le rail, posé sur les pierres, et la hauteur du centre d'une pièce qui y roule. */
const Y_RAIL = 704;
const X_TREMIE = 800;
/** Les piliers qui portent le palais : le rail passe derrière eux. */
const PILIERS = [150, 311, 473, 634];

/** Le palais en traits, posé sur les fondations. */
const PALAIS = [
  'M170 420 L400 335 L630 420 Z',
  'M185 420 V446 H615 V420',
  ...[205, 285, 365, 435, 515, 595].flatMap((x) => [`M${x - 15} 446 V628`, `M${x + 15} 446 V628`, `M${x - 21} 628 H${x + 21}`, `M${x - 21} 458 H${x + 21}`]),
  'M150 650 V628 H650 V650 Z',
];

/** Plan 2 : la grosse pièce du dirigeant d'abord, dans les fondations ; puis la file des petites pièces. */
const IlluDirigeant: React.FC<PropsIllustration> = ({ f, d }) => {
  const trace = p(f, 0, 28);
  // La trappe s'ouvre sous le coffre à la fin de la phrase « … pour donner. »
  const aTrappe = d[0] + 128;
  const aChute = aTrappe + 12;
  const aImpact = aChute + 34;
  const trappe = p(f, aTrappe, aTrappe + 12) * (1 - p(f, aImpact + 8, aImpact + 28));
  const tChute = lin(f, aChute, aImpact);
  const yGrosse = 205 + (770 - 205) * tChute * tChute;
  const onde = lin(f, aImpact, aImpact + 24);
  // « en tant que dirigeant » : la couronne s'allume ; « en tant qu'amoureux » : la serrure bat.
  const eclat = p(f, d[1] + 10, d[1] + 30) * (1 - p(f, d[1] + 72, d[1] + 95));
  const coeur = p(f, d[1] + 82, d[1] + 104);
  const battement = 1 + 0.13 * Math.max(0, Math.sin((f - d[1]) / 6.5)) * coeur * (1 - p(f, d[1] + 200, d[1] + 240));
  // « puis il s'est tourné vers le peuple » : la file des petites pièces.
  const aFile = d[1] + 152;
  // Une arrivée toutes les RYTHME images : chaque départ se cale sur son heure d'arrivée.
  // La pierre la plus lointaine est servie d'abord, si bien qu'aucune pièce n'en double une autre sur le rail.
  const RYTHME = 22;
  const VITESSE = 12;
  const CHUTE = 10;
  const R_PIECE = 21;
  const Y_ROULE = Y_RAIL - R_PIECE;
  const trajet = (i: number) => (X_TREMIE - (PIERRES[i].x + PIERRES[i].l / 2)) / VITESSE;
  const arrivees = PIERRES.map((_, i) => aFile + trajet(0) + CHUTE + i * RYTHME);
  const acheve = p(f, Math.max(...arrivees), Math.max(...arrivees) + 26);
  return (
    <Scene>
      {/* Le palais en traits, qui passe à l'encre une fois les fondations remplies. */}
      <g opacity={0.6}>
        {PALAIS.map((c) => (
          <path key={c} d={c} fill="none" stroke={F.encre2} strokeWidth={3} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - trace} />
        ))}
      </g>
      <g opacity={acheve}>
        {PALAIS.map((c) => (
          <path key={c} d={c} fill="none" stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        ))}
      </g>
      {/* Le sol et les fondations. */}
      <line x1={25} x2={840} y1={Y_SOL} y2={Y_SOL} stroke={F.encre} strokeWidth={4} />
      {[
        [85, 120],
        [205, 120],
        [475, 120],
        [595, 120],
      ].map(([x, l]) => (
        <rect key={x} x={x} y={Y_PIERRE + H_PIERRE} width={l} height={Y_SOL - Y_PIERRE - H_PIERRE} fill={F.papier} stroke={F.encre} strokeWidth={3} />
      ))}
      {PIERRES.map((q, i) => {
        const rempli = lin(f, arrivees[i] - 1, arrivees[i] + 6);
        const eclair = lin(f, arrivees[i], arrivees[i] + 16);
        const xC = q.x + q.l / 2;
        const yC = Y_PIERRE + H_PIERRE / 2;
        return (
          <g key={q.x}>
            <rect x={q.x} y={Y_PIERRE} width={q.l} height={H_PIERRE} fill={F.papier} stroke={F.encre} strokeWidth={3} />
            <rect x={q.x + 2} y={Y_PIERRE + 2} width={q.l - 4} height={H_PIERRE - 4} fill={F.orClair} opacity={rempli * 0.75} />
            {f >= arrivees[i] ? <Piece x={xC} y={yC} r={22} /> : null}
            {eclair > 0 && eclair < 1 ? <circle cx={xC} cy={yC} r={22 + eclair * 14} fill="none" stroke={F.orFonce} strokeWidth={3} opacity={1 - eclair} /> : null}
          </g>
        );
      })}
      <rect x={325} y={Y_PIERRE} width={150} height={Y_SOL - Y_PIERRE} fill={F.papier} stroke={F.encre} strokeWidth={3} />
      <rect x={327} y={Y_PIERRE + 2} width={146} height={Y_SOL - Y_PIERRE - 4} fill={F.orClair} opacity={lin(f, aImpact - 2, aImpact + 6) * 0.75} />
      {/* Le rail, ouvert au-dessus d'une pierre juste le temps de laisser entrer sa pièce. */}
      <rect x={85} y={Y_RAIL} width={X_TREMIE - 85} height={7} fill={F.cuir} stroke={F.encre} strokeWidth={2.5} />
      {PIERRES.map((q, i) => (
        <rect
          key={`fente-${q.x}`}
          x={q.x + q.l / 2 - 26}
          y={Y_RAIL - 2}
          width={52}
          height={Y_PIERRE - Y_RAIL + 4}
          fill={F.parchemin}
          opacity={lin(f, arrivees[i] - CHUTE - 5, arrivees[i] - CHUTE) * (1 - lin(f, arrivees[i], arrivees[i] + 6))}
        />
      ))}
      {/* La file de petites pièces : elle sort de la trémie, roule sur le rail, puis tombe dans sa pierre. */}
      {PIERRES.map((q, i) => {
        const xC = q.x + q.l / 2;
        const s = arrivees[i] - CHUTE - trajet(i);
        if (f < s || f >= arrivees[i]) return null;
        const roule = f < s + trajet(i);
        const t = roule ? 0 : (f - s - trajet(i)) / CHUTE;
        const yC = Y_PIERRE + H_PIERRE / 2;
        return <Piece key={`file-${i}`} x={roule ? X_TREMIE - (f - s) * VITESSE : xC} y={Y_ROULE + (yC - Y_ROULE) * t * t} r={R_PIECE} />;
      })}
      {/* Les piliers du palais, devant le rail. */}
      {PILIERS.map((x) => (
        <g key={x}>
          <rect x={x} y={650} width={16} height={Y_RAIL - 650} fill={F.parchemin} stroke={F.encre2} strokeWidth={3} opacity={trace} />
          <rect x={x} y={650} width={16} height={Y_RAIL - 650} fill="none" stroke={F.encre} strokeWidth={4} opacity={acheve} />
        </g>
      ))}
      {/* La trémie d'où part la file : quelques pièces en réserve, sur un pied. */}
      <rect x={X_TREMIE - 12} y={Y_RAIL} width={24} height={Y_SOL - Y_RAIL} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {[-18, 18, 0].map((dx) => (
        <Piece key={dx} x={X_TREMIE + dx} y={dx === 0 ? 596 : 606} r={18} />
      ))}
      <rect x={X_TREMIE - 28} y={640} width={56} height={Y_RAIL + 7 - 640} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <path d={`M${X_TREMIE - 36} 612 H${X_TREMIE + 36} L${X_TREMIE + 28} 640 H${X_TREMIE - 28} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      {/* L'échafaudage du chantier, qui porte le coffre au-dessus du palais : il descend jusqu'au sol, hors des fondations. */}
      {[60, 740].map((x) => (
        <rect key={x} x={x - 11} y={292} width={22} height={Y_SOL - 292} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      ))}
      {[
        [71, 350, 125, 292],
        [729, 350, 675, 292],
      ].map(([a, b, c, e]) => (
        <line key={a} x1={a} y1={b} x2={c} y2={e} stroke={F.encre} strokeWidth={9} strokeLinecap="round" />
      ))}
      {/* La grosse pièce, qui sort de sous le coffre. */}
      {f >= aChute ? <Piece x={400} y={yGrosse} r={56} /> : null}
      {onde > 0 && onde < 1 ? (
        <g>
          <circle cx={400} cy={770} r={56 + onde * 34} fill="none" stroke={F.orFonce} strokeWidth={5} opacity={1 - onde} />
          <circle cx={400} cy={770} r={56 + onde * 66} fill="none" stroke={F.or} strokeWidth={4} opacity={(1 - onde) * 0.7} />
        </g>
      ) : null}
      {/* La poutre, percée sous la trappe. */}
      <rect x={40} y={268} width={298} height={24} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <rect x={462} y={268} width={298} height={24} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <Coffre cx={400} bas={268} l={270} h={104} hc={56} coeur={coeur} battement={battement} />
      <rect x={338} y={260} width={124} height={8} fill={F.encre} opacity={trappe} />
      {[
        { x: 339, sens: 1 },
        { x: 461, sens: -1 },
      ].map((t) => (
        <rect key={t.x} x={t.sens > 0 ? t.x : t.x - 61} y={264} width={61} height={7} fill={F.cuir} stroke={F.encre} strokeWidth={2.5} transform={`rotate(${t.sens * 82 * trappe} ${t.x} 267)`} />
      ))}
      <Couronne x={400} y={112} s={1.08} eclat={eclat} />
    </Scene>
  );
};

/** Le levier du plan 3 : pivot et bras, côté bloc et côté coffre. */
const PIVOT = { x: 350, y: 535 };
const BRAS_BLOC = 340;
const BRAS_COFFRE = 190;
const Y_DEPART = 679;
const Y_ARRIVEE = 415;
const FLEXION = 26;
const CALE = 60;
const L_BLOC = 164;
const H_BLOC = 110;
const REBORD = 660;
const FOND = 872;
const SOL = 885;
const TIGE = 212;
const X_NICHE = PIVOT.x + BRAS_BLOC * Math.sqrt(1 - ((PIVOT.y + FLEXION - Y_ARRIVEE) / BRAS_BLOC) ** 2);
const Y_NICHE = Y_ARRIVEE - CALE - H_BLOC;

/** Le lingot : sa face avant en trapèze, sa face de dessus plus claire. `bas` = dessous du lingot. */
const Lingot: React.FC<{ cx: number; bas: number; halo?: number }> = ({ cx, bas, halo = 0 }) => {
  const dl = L_BLOC / 2;
  const hf = H_BLOC - 30;
  const contour = `M${cx - dl} ${bas} L${cx - dl + 20} ${bas - hf} L${cx - dl + 44} ${bas - H_BLOC} H${cx + dl - 44} L${cx + dl - 20} ${bas - hf} L${cx + dl} ${bas} Z`;
  return (
    <g>
      {halo > 0 ? <path d={contour} fill="none" stroke={F.orClair} strokeWidth={6 + 14 * halo} strokeLinejoin="round" opacity={halo} /> : null}
      <path d={contour} fill={F.or} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${cx - dl + 20} ${bas - hf} L${cx - dl + 44} ${bas - H_BLOC} H${cx + dl - 44} L${cx + dl - 20} ${bas - hf} Z`} fill={F.orClair} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
      <path d={`M${cx - dl + 20} ${bas - 13} L${cx - dl + 33} ${bas - hf + 13} H${cx + dl - 33} L${cx + dl - 20} ${bas - 13} Z`} fill="none" stroke={F.orFonce} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${cx - 38} ${bas - 24} L${cx - 22} ${bas - hf + 24} M${cx - 20} ${bas - 24} L${cx - 11} ${bas - 48}`} fill="none" stroke={F.orClair} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

/** Plan 3 : le levier plie, le bloc d'or monte lentement, le coffre se vide. */
const IlluLevier: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const pose = p(f, d[0] - 22, d[0] + 6);
  const effort = p(f, d[0] + 8, d[0] + 62);
  const finMontee = duree - 88;
  const monte = lin(f, d[1] + 6, finMontee);
  const m = monte * monte * (3 - 2 * monte) * 0.35 + monte * 0.65;
  const tremble = effort * (1 - p(f, finMontee - 8, finMontee + 14)) * 1.7 * Math.sin(f / 1.7);
  const B = FLEXION * effort + tremble;
  const yBout = Y_DEPART + (Y_ARRIVEE - Y_DEPART) * m;
  const sinA = (PIVOT.y + B - yBout) / BRAS_BLOC;
  const cosA = Math.sqrt(1 - sinA * sinA);
  const degres = (Math.asin(sinA) * 180) / Math.PI;
  const point = (u: number) => ({ x: PIVOT.x + u * cosA, y: PIVOT.y - u * sinA + B * (u / BRAS_BLOC) ** 2 });
  const points = Array.from({ length: 28 }, (_, i) => point(-BRAS_COFFRE + (i * (BRAS_COFFRE + BRAS_BLOC)) / 27));
  const courbe = `M${points.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(' L')}`;
  // Le berceau suit le dessous du bloc, à l'aplomb de la niche ; son pied épouse le levier sous lui.
  const uAplomb = (X_NICHE - PIVOT.x) / cosA;
  const appui = point(uAplomb);
  const yLingot = appui.y - CALE;
  const pied = Array.from({ length: 8 }, (_, i) => point(Math.min(BRAS_BLOC, uAplomb - 74 + (i * 108) / 7)));
  const queue = point(-BRAS_COFFRE);
  const assise = point(-110);
  const yPlaque = queue.y + TIGE;
  const installe = p(f, finMontee, finMontee + 20);
  const chevrons = effort * (1 - p(f, finMontee, finMontee + 20));
  const X_FENETRE = 68;
  const L_FENETRE = 204;
  const gauche = 50;
  return (
    <Scene>
      <defs>
        <clipPath id="ch22-or-coffre">
          <rect x={X_FENETRE} y={yPlaque + 12} width={L_FENETRE} height={Math.max(0, FOND - yPlaque - 12)} />
        </clipPath>
      </defs>
      {/* Le chantier : un mur en traits et sa niche vide en haut. */}
      <g stroke={F.filet} strokeWidth={3} fill="none">
        <path d={`M430 ${SOL} V${Y_NICHE + H_BLOC} M790 ${SOL} V${Y_NICHE + H_BLOC}`} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = Y_NICHE + H_BLOC + 88 * i;
          const b = Math.min(SOL, y + 88);
          return (
            <g key={i}>
              {b < SOL ? <line x1={430} x2={790} y1={b} y2={b} /> : null}
              {[0, 1, 2].map((j) => {
                const x = 490 + (i % 2) * 60 + j * 120;
                return x < 790 ? <line key={j} x1={x} x2={x} y1={y} y2={b} /> : null;
              })}
            </g>
          );
        })}
      </g>
      {/* Le rang supérieur : la niche entre deux pierres, le palais dessiné au-dessus. */}
      <rect x={430} y={Y_NICHE} width={X_NICHE - L_BLOC / 2 - 432} height={H_BLOC} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <line x1={510} x2={510} y1={Y_NICHE} y2={Y_NICHE + H_BLOC} stroke={F.encre} strokeWidth={3} />
      <rect x={X_NICHE + L_BLOC / 2 + 2} y={Y_NICHE} width={790 - X_NICHE - L_BLOC / 2 - 2} height={H_BLOC} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <rect x={X_NICHE - L_BLOC / 2} y={Y_NICHE} width={L_BLOC} height={H_BLOC} fill={F.parchemin} stroke={F.encre2} strokeWidth={3} strokeDasharray="10 8" />
      <g fill="none" stroke={F.encre2} strokeWidth={3} strokeLinejoin="round" opacity={0.75}>
        <path d={`M430 ${Y_NICHE} H790`} />
        <path d="M432 96 L610 30 L788 96 Z" />
        <path d="M444 96 V120 H776 V96" />
        {[480, 567, 653, 740].flatMap((x) => [`M${x - 13} 120 V${Y_NICHE}`, `M${x + 13} 120 V${Y_NICHE}`]).map((c) => (
          <path key={c} d={c} />
        ))}
      </g>
      <line x1={20} x2={790} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      {/* Le socle d'où part le bloc. */}
      <rect x={X_NICHE - 70} y={Y_DEPART + 13} width={140} height={SOL - Y_DEPART - 13} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {/* Le couvercle rabattu en arrière, à gauche du coffre. */}
      <path d={`M${gauche} ${REBORD} A36 124 0 0 1 ${gauche} ${REBORD - 248} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {[0.2, 0.8].map((k) => {
        const u = Math.sqrt(1 - (2 * k - 1) ** 2);
        const y = REBORD - 248 * k;
        return <path key={k} d={`M${gauche} ${y - 8} H${gauche - 36 * u} L${gauche - 36 * u} ${y + 8} H${gauche} Z`} fill={F.or} stroke={F.encre} strokeWidth={3} />;
      })}
      {/* Le coffre en coupe : l'or qui reste sous la plaque. */}
      <rect x={gauche} y={REBORD} width={240} height={SOL - REBORD} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={X_FENETRE} y={REBORD + 10} width={L_FENETRE} height={FOND - REBORD - 10} fill={F.filet} stroke={F.encre} strokeWidth={3} />
      <g clipPath="url(#ch22-or-coffre)">
        <rect x={X_FENETRE} y={REBORD} width={L_FENETRE} height={FOND - REBORD} fill={F.or} />
        {Array.from({ length: 6 }, (_, ligne) =>
          Array.from({ length: 6 }, (_, c) => (
            <Piece key={`${ligne}-${c}`} x={X_FENETRE + 18 + c * 38 + (ligne % 2) * 19 - 8} y={FOND - 15 - ligne * 36} r={19} />
          )),
        )}
      </g>
      <rect x={X_FENETRE} y={REBORD + 10} width={L_FENETRE} height={FOND - REBORD - 10} fill="none" stroke={F.encre} strokeWidth={3} />
      {[
        { x: gauche - 3, y: REBORD - 3, w: 28, h: 28 },
        { x: gauche + 215, y: REBORD - 3, w: 28, h: 28 },
        { x: gauche - 3, y: SOL - 25, w: 28, h: 28 },
        { x: gauche + 215, y: SOL - 25, w: 28, h: 28 },
      ].map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width={c.w} height={c.h} rx={3} fill={F.or} stroke={F.encre} strokeWidth={3} />
      ))}
      {/* Le tréteau. */}
      <path d={`M${PIVOT.x} ${PIVOT.y} L${PIVOT.x - 44} ${SOL - 6} M${PIVOT.x} ${PIVOT.y} L${PIVOT.x + 44} ${SOL - 6} M${PIVOT.x - 26} ${PIVOT.y + 205} H${PIVOT.x + 26}`} fill="none" stroke={F.encre} strokeWidth={13} strokeLinecap="round" />
      {/* La tige et la plaque, qui appuient sur l'or. */}
      <rect x={queue.x - 6} y={queue.y} width={12} height={TIGE} fill={F.encre2} stroke={F.encre} strokeWidth={2.5} />
      <rect x={queue.x - 80} y={yPlaque} width={160} height={12} rx={2} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
      {/* Le lingot d'or, porté par un berceau posé sur le levier. */}
      <path
        d={`M${X_NICHE - 58} ${yLingot + 6} H${X_NICHE + 34} ${pied
          .slice()
          .reverse()
          .map((q) => `L${q.x.toFixed(1)} ${q.y.toFixed(1)}`)
          .join(' ')} Z`}
        fill={F.cuir}
        stroke={F.encre}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <rect x={X_NICHE - L_BLOC / 2 + 4} y={yLingot} width={L_BLOC - 8} height={9} rx={2} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
      <Lingot cx={X_NICHE} bas={yLingot} halo={installe * (1 - p(f, finMontee + 20, finMontee + 60) * 0.6)} />
      {/* Le levier, qui plie. */}
      <path d={courbe} fill="none" stroke={F.encre} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
      <path d={courbe} fill="none" stroke={F.cuirClair} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={PIVOT.x} cy={PIVOT.y} r={15} fill={F.or} stroke={F.encre} strokeWidth={4} />
      {/* La couronne pèse sur le levier, de toutes ses forces. */}
      <g opacity={pose}>
        <Couronne x={assise.x} y={assise.y - 11 - (1 - pose) * 90} s={1.1} angle={-degres * pose} />
      </g>
      {[0, 1, 2].map((i) => {
        const phase = ((f / 16 + i / 3) % 1 + 1) % 1;
        const y = assise.y - 196 + phase * 60;
        return (
          <path
            key={i}
            d={`M${assise.x - 34} ${y - 14} L${assise.x} ${y + 12} L${assise.x + 34} ${y - 14}`}
            fill="none"
            stroke={F.argile}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={chevrons * Math.sin(phase * Math.PI)}
          />
        );
      })}
    </Scene>
  );
};

/** Plan 4 : la pièce devant le miroir, qui la renvoie ; puis la barre arrêtée à dix pour cent. */
const IlluMiroir: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL_M = 680;
  const montee = p(f, d[2] - 26, d[2] + 4);
  // « par-dessus tout ce qu'il a déjà préparé » : la pièce tombe sur la réserve.
  const aChute = d[0] + 92;
  const aPose = aChute + 26;
  const tC = lin(f, aChute, aPose);
  const rebond = aPose <= f ? Math.max(0, 1 - (f - aPose) / 14) * Math.abs(Math.sin((f - aPose) / 2.3)) * 12 : 0;
  // « parce qu'il aime Dieu » : la marque de cœur apparaît sur la pièce.
  const marque = p(f, d[0] + 178, d[0] + 205);
  // « se consacrer » : la réserve s'efface, la pièce reste seule.
  const reserve = 1 - p(f, d[1] + 4, d[1] + 34);
  const descend = p(f, d[1] + 12, d[1] + 46);
  // « ce que tu donnes représente la valeur » : la pièce grandit, et le miroir renvoie exactement la même.
  const grandit = p(f, d[1] + 170, d[1] + 260);
  // « dix pour cent » : la barre, puis la pièce rétrécit.
  const barre = p(f, d[2] + 8, d[2] + 62);
  const stop = lin(f, d[2] + 62, d[2] + 84);
  const retrecit = p(f, d[2] + 96, d[2] + 148);
  const r = 50 + 44 * grandit - 66 * retrecit;
  const X = 190;
  const yHaut = SOL_M - 52 * 2 - r;
  const ySol = SOL_M - r;
  const yReposee = yHaut + (ySol - yHaut) * descend;
  const yPiece = f < aChute ? -999 : (f < aPose ? -10 + (yHaut + 10) * tC * tC : yReposee - rebond);
  const opPiece = lin(f, aChute, aChute + 5);
  const Objets: React.FC = () => (
    <g>
      <g opacity={reserve}>
        {[
          [X - 100, SOL_M - 52],
          [X, SOL_M - 52],
          [X - 50, SOL_M - 104],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width={100} height={52} rx={3} fill={F.or} stroke={F.encre} strokeWidth={4} />
            <path d={`M${x + 11} ${y + 40} V${y + 11} H${x + 88}`} fill="none" stroke={F.orClair} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
      </g>
      {f >= aChute ? <PieceMarquee x={X} y={yPiece} r={r} marque={marque} opacite={opPiece} /> : null}
    </g>
  );
  const MX = 545;
  const MY = 322;
  const RX = 178;
  const RY = 278;
  const K = 0.74;
  const S_REFLET = 515;
  // Le va-et-vient : de la pièce au miroir, du miroir à la pièce.
  const aller = lin(f, d[1] + 62, d[1] + 170);
  const allerRetour = Array.from({ length: 4 }, (_, i) => {
    const t = (aller * 3 + 0.75 - i * 0.25) % 1;
    return { i, t };
  });
  const xA = X + r + 14;
  const xB = MX - RX - 22;
  const yLien = yPiece;
  return (
    <Scene>
      <defs>
        <clipPath id="ch22-glace">
          <ellipse cx={MX} cy={MY} rx={RX} ry={RY} />
        </clipPath>
      </defs>
      <g transform={`translate(0 ${88 * (1 - montee)})`}>
        <line x1={30} x2={770} y1={SOL_M} y2={SOL_M} stroke={F.encre} strokeWidth={4} />
        {/* Le pied du miroir. */}
        <path d={`M${MX - 72} ${SOL_M} L${MX - 16} ${MY + RY + 2} H${MX + 16} L${MX + 72} ${SOL_M} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        {/* La glace et le reflet. */}
        <ellipse cx={MX} cy={MY} rx={RX} ry={RY} fill={F.papier} />
        <g clipPath="url(#ch22-glace)">
          <rect x={MX - RX} y={S_REFLET} width={RX * 2} height={MY + RY - S_REFLET} fill={F.filet} opacity={0.65} />
          <line x1={MX - RX} x2={MX + RX} y1={S_REFLET} y2={S_REFLET} stroke={F.encre2} strokeWidth={3} />
          <g transform={`translate(${MX} ${S_REFLET}) scale(${-K} ${K}) translate(${-X} ${-SOL_M})`}>
            <Objets />
          </g>
          {[-46, 8, 66].map((dx, i) => (
            <line key={dx} x1={MX + dx + 110} y1={MY - RY} x2={MX + dx - 110} y2={MY - RY + 300} stroke={F.filet} strokeWidth={i === 1 ? 14 : 7} opacity={0.45} />
          ))}
        </g>
        <ellipse cx={MX} cy={MY} rx={RX} ry={RY} fill="none" stroke={F.encre} strokeWidth={32} />
        <ellipse cx={MX} cy={MY} rx={RX} ry={RY} fill="none" stroke={F.cuir} strokeWidth={25} />
        <ellipse cx={MX} cy={MY} rx={RX} ry={RY} fill="none" stroke={F.orClair} strokeWidth={3} />
        {/* Le lien entre la pièce et son reflet. */}
        {aller > 0 && aller < 1
          ? allerRetour.map(({ i, t }) => (
              <circle key={i} cx={xA + (xB - xA) * (aller * 3 < 1.5 ? t : 1 - t)} cy={yLien} r={6} fill={F.or} stroke={F.orFonce} strokeWidth={2} opacity={Math.sin(aller * Math.PI) * Math.sin(t * Math.PI)} />
            ))
          : null}
        {/* La pièce devant le miroir. */}
        <Objets />
      </g>
      {/* La barre, qui s'arrête à dix pour cent ; le reste demeure vide. */}
      <g opacity={p(f, d[2] - 14, d[2] + 8)}>
        <rect x={60} y={762} width={680} height={58} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <rect x={62} y={764} width={66 * barre} height={54} fill={F.or} />
        <line x1={128} x2={128} y1={750} y2={832} stroke={F.encre} strokeWidth={5} opacity={stop} />
      </g>
      <Libelle x={60} y={738} taille={32} ancre="start" graisse={600} couleur={F.orFonce} opacite={stop}>
        {LIBELLES.dixPourCent}
      </Libelle>
    </Scene>
  );
};

/** Fin : la pièce est posée, seule, sous une lumière. */
const IlluPieceSeule: React.FC<PropsIllustration> = ({ f }) => {
  const lumiere = p(f, 0, 70);
  const pose = p(f, 8, 44);
  const souffle = 0.92 + 0.08 * Math.sin(f / 20);
  const SOL_F = 730;
  const R = 92;
  return (
    <Scene>
      <defs>
        <linearGradient id="ch22-faisceau" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={F.orClair} stopOpacity={0} />
          <stop offset="35%" stopColor={F.orClair} stopOpacity={0.42} />
          <stop offset="100%" stopColor={F.orClair} stopOpacity={0.72} />
        </linearGradient>
      </defs>
      <g opacity={lumiere * souffle}>
        <path d={`M340 30 H460 L650 ${SOL_F} H150 Z`} fill="url(#ch22-faisceau)" />
      </g>
      <ellipse cx={400} cy={SOL_F + 3} rx={258} ry={26} fill={F.orClair} opacity={lumiere * 0.85} />
      <line x1={70} x2={730} y1={SOL_F} y2={SOL_F} stroke={F.encre} strokeWidth={4} />
      <PieceMarquee x={400} y={SOL_F - R - (1 - pose) * 150} r={R} marque={1} opacite={lin(f, 4, 18)} />
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluTitre,
  p2: IlluDirigeant,
  p3: IlluLevier,
  p4: IlluMiroir,
  fin: IlluPieceSeule,
};
