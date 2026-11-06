import React from 'react';
import { Coeur, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES as L } from './libelles';

const lin = (f: number, a: number, b: number) => Math.max(0, Math.min(1, (f - a) / (b - a)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const impulsion = (x: number, c: number, l: number) => Math.exp(-(((x - c) / l) ** 2));
const bezier = (t: number, a: number, b: number, c: number, e: number) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * e;

/** Une part de disque, depuis midi, dans le sens des aiguilles. */
const part = (cx: number, cy: number, r: number, frac: number) => {
  const b = -Math.PI / 2 + 2 * Math.PI * frac;
  return `M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${cx + r * Math.cos(b)} ${cy + r * Math.sin(b)} Z`;
};

/** Une étincelle : huit rayons et un cœur clair. */
const Etincelle: React.FC<{ x: number; y: number; r: number; o: number }> = ({ x, y, r, o }) =>
  o <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${0.45 + 0.55 * o})`} opacity={o}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        const long = i % 2 === 0 ? r : r * 0.62;
        return <line key={i} x1={Math.cos(a) * r * 0.34} y1={Math.sin(a) * r * 0.34} x2={Math.cos(a) * long} y2={Math.sin(a) * long} stroke={F.or} strokeWidth={Math.max(3, r * 0.1)} strokeLinecap="round" />;
      })}
      <circle r={r * 0.24} fill={F.orClair} stroke={F.orFonce} strokeWidth={2.5} />
    </g>
  );

/** Plan 1 : une graine, des pointillés qui montent, un plan roulé. */
const IlluTitre: React.FC<PropsIllustration> = ({ f }) => {
  const chute = p(f, 0, 24);
  const germe = p(f, 22, 48);
  const POINTS = 27;
  const arrive = p(f, 158, 186);
  const ouvre = p(f, 180, 222);
  const X = 262;
  const W = 276;
  return (
    <Scene>
      {/* La terre. */}
      <path d="M90 800 Q400 716 710 800 V826 Q400 846 90 826 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {/* La graine, posée sur la terre. */}
      <g transform={`translate(400 ${lerp(560, 736, chute)}) rotate(${lerp(-30, -14, chute)})`} opacity={p(f, 0, 8)}>
        <path d="M-40 0 C-30 -28 22 -30 42 0 C22 24 -30 26 -40 0 Z" fill={F.or} stroke={F.encre} strokeWidth={4} />
        <path d="M-24 0 C-8 -9 12 -9 28 -1" fill="none" stroke={F.orFonce} strokeWidth={3} strokeLinecap="round" />
      </g>
      {/* Le germe. */}
      {germe > 0 ? (
        <g>
          <path d={`M400 714 V${714 - 40 * germe}`} stroke={F.orFonce} strokeWidth={5} strokeLinecap="round" />
          <path d={`M400 ${714 - 34 * germe} C${400 - 36 * germe} ${714 - 62 * germe} ${400 - 54 * germe} ${714 - 44 * germe} ${400 - 58 * germe} ${714 - 30 * germe} C${400 - 38 * germe} ${714 - 16 * germe} ${400 - 16 * germe} ${714 - 18 * germe} 400 ${714 - 34 * germe} Z`} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
          <path d={`M400 ${714 - 34 * germe} C${400 + 36 * germe} ${714 - 62 * germe} ${400 + 54 * germe} ${714 - 44 * germe} ${400 + 58 * germe} ${714 - 30 * germe} C${400 + 38 * germe} ${714 - 16 * germe} ${400 + 16 * germe} ${714 - 18 * germe} 400 ${714 - 34 * germe} Z`} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
        </g>
      ) : null}
      {/* Les pointillés, de bas en haut. */}
      {Array.from({ length: POINTS }, (_, i) => {
        const t = i / (POINTS - 1);
        const a = 40 + i * 4.6;
        const o = p(f, a, a + 9);
        return <circle key={i} cx={bezier(t, 400, 150, 650, 400)} cy={bezier(t, 650, 540, 400, 262)} r={8 * o} fill={F.orFonce} opacity={o} />;
      })}
      {/* Le plan roulé : l'esquisse se précise quand les pointillés l'atteignent. */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = (-Math.PI * (i + 1)) / 10;
        return <line key={i} x1={400 + Math.cos(a) * 172} y1={156 + Math.sin(a) * 110} x2={400 + Math.cos(a) * 204} y2={156 + Math.sin(a) * 134} stroke={F.or} strokeWidth={5} strokeLinecap="round" opacity={arrive * 0.9} />;
      })}
      <g opacity={0.35 + 0.65 * arrive}>
        {/* Le rabat qui se déroule sous le rouleau. */}
        <rect x={X + 10} y={170} width={W - 20} height={62 * ouvre} fill={F.papier} stroke={F.encre} strokeWidth={ouvre > 0 ? 4 : 0} />
        {ouvre > 0.5 ? <path d={`M${X + 34} 204 H${X + W - 34}`} stroke={F.encre2} strokeWidth={3} strokeDasharray="10 8" opacity={p(ouvre, 0.5, 1)} /> : null}
        <rect x={X} y={118} width={W} height={66} rx={12} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <path d={`M${X + 12} 134 H${X + W - 20} M${X + 12} 150 H${X + W - 20} M${X + 12} 166 H${X + W - 20}`} stroke={F.filet} strokeWidth={3} />
        <rect x={385} y={116} width={30} height={70} fill={F.or} stroke={F.encre} strokeWidth={3} />
        <ellipse cx={X + W - 2} cy={151} rx={15} ry={33} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <path d={`M${X + W - 2} 134 C${X + W + 8} 138 ${X + W + 8} 164 ${X + W - 2} 168 C${X + W - 9} 162 ${X + W - 9} 146 ${X + W - 2} 144`} fill="none" stroke={F.encre2} strokeWidth={3} />
      </g>
    </Scene>
  );
};

/** Plan 2 : un relevé qui avance ; des étincelles s'allument et s'éteignent ; la ligne reste plate. */
const IlluSpontane: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const Y = 480;
  const debut = d[0] - 10;
  const tete = (t: number) => lerp(84, 690, lin(t, debut, d[1]));
  const VITESSE = 1.7;
  const defile = Math.max(0, f - d[1]) * VITESSE;
  const off = defile % 70;
  const xT = tete(f);
  const NOMMEES = [
    { t: d[0] + 35, mot: L.spontane, y: 386 },
    { t: d[0] + 100, mot: L.occasionnel, y: 326 },
    { t: d[0] + 165, mot: L.ponctuel, y: 386 },
    { t: d[0] + 225, mot: L.coeurDispose, y: 326 },
  ];
  const sortie = 1 - p(f, d[1] - 6, d[1] + 18);
  const AUTRES = [38, 96, 150, 205].map((k) => d[1] + k).filter((t) => t < duree - 30);
  const trace = p(f, d[1] + 5, d[1] + 95);
  return (
    <Scene>
      <defs>
        <clipPath id="ch14-releve">
          <rect x={62} y={154} width={704} height={482} />
        </clipPath>
      </defs>
      <rect x={30} y={150} width={740} height={490} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <g clipPath="url(#ch14-releve)">
        {Array.from({ length: 12 }, (_, k) => (
          <line key={k} x1={62 + k * 70 - off} x2={62 + k * 70 - off} y1={154} y2={636} stroke={F.filet} strokeWidth={2} />
        ))}
        {Array.from({ length: 7 }, (_, k) => (
          <line key={k} x1={62} x2={766} y1={200 + k * 70} y2={200 + k * 70} stroke={F.filet} strokeWidth={2} />
        ))}
        {/* La ligne : toujours au même niveau. */}
        <line x1={Math.max(62, 84 - defile)} x2={xT} y1={Y} y2={Y} stroke={F.encre} strokeWidth={7} strokeLinecap="round" />
        {NOMMEES.map((e, i) => {
          const vie = p(f, e.t, e.t + 9) * (1 - p(f, e.t + 34, e.t + 60));
          const mot = p(f, e.t, e.t + 12) * sortie * (0.5 + 0.5 * (1 - p(f, e.t + 34, e.t + 60)));
          const x = tete(e.t) - defile;
          return (
            <g key={e.mot}>
              {i === 3 ? (
                <g opacity={vie}>
                  <Etincelle x={x} y={Y} r={58} o={vie} />
                  {vie > 0 ? <Coeur x={x} y={Y} s={0.42 + 0.3 * vie} /> : null}
                </g>
              ) : (
                <Etincelle x={x} y={Y} r={50} o={vie} />
              )}
              <line x1={x} x2={x} y1={e.y + 12} y2={Y - 58} stroke={F.encre2} strokeWidth={2.5} strokeDasharray="5 6" opacity={mot * 0.8} />
              <Libelle x={x} y={e.y} taille={28} graisse={600} opacite={mot}>{e.mot}</Libelle>
            </g>
          );
        })}
        {AUTRES.map((t, i) => {
          const vie = p(f, t, t + 8) * (1 - p(f, t + 18, t + 42));
          return <Etincelle key={i} x={690 - (f - t) * VITESSE} y={Y} r={40} o={vie} />;
        })}
      </g>
      {/* L'axe de la croissance, inutilisé. */}
      <line x1={62} x2={62} y1={606} y2={196} stroke={F.encre2} strokeWidth={4} />
      <path d="M50 212 L62 186 L74 212 Z" fill={F.encre2} />
      {/* Le stylet. */}
      <line x1={46} x2={754} y1={620} y2={620} stroke={F.encre2} strokeWidth={4} />
      <rect x={xT - 30} y={596} width={60} height={30} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      <rect x={xT - 6} y={514} width={12} height={84} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
      <path d={`M${xT - 13} 516 H${xT + 13} L${xT} 486 Z`} fill={F.encre} />
      {/* Toute sa vie : l'accolade qui couvre tout le relevé. */}
      <path d="M40 668 Q40 690 70 690 H380 Q400 690 400 712 Q400 690 420 690 H730 Q760 690 760 668" fill="none" stroke={F.encre} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={`${trace} 1`} opacity={trace > 0 ? 1 : 0} />
      <Libelle x={400} y={756} taille={32} opacite={p(f, d[1] + 20, d[1] + 50)}>{L.vie}</Libelle>
      <Libelle x={400} y={812} taille={38} graisse={600} couleur={F.orFonce} opacite={p(f, d[1] + 62, d[1] + 92)}>{L.grandir}</Libelle>
    </Scene>
  );
};

/** Plan 3 : la part des dîmes grandit par à-coups, au rythme d'un cœur qui bat plus fort. */
const IlluSacrifice: React.FC<PropsIllustration> = ({ f, d }) => {
  const CX = 285;
  const CY = 310;
  const R = 235;
  const T = 42;
  const battu = (x: number) => Math.ceil(x / T) * T;
  const SAUTS = [d[1] + 100, d[1] + 190, d[1] + 280, d[1] + 360, d[2] + 205, d[2] + 290, d[2] + 375, d[2] + 460].map(battu);
  const PAS = [0.05, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11];
  const VOYAGE = 14;
  const naissance = p(f, d[1] + 10, d[1] + 34);
  const frac = 0.1 * naissance + SAUTS.reduce((s, b, i) => s + PAS[i] * p(f, b + VOYAGE, b + VOYAGE + 9), 0);
  const secousse = SAUTS.reduce((s, b) => s + impulsion(f, b + VOYAGE + 6, 6), 0);
  const croissance = SAUTS.reduce((s, b) => s + p(f, b, b + 18) / SAUTS.length, 0);
  const contour = p(f, d[0] + 140, d[0] + 195);
  const phase = f % T;
  const battement = impulsion(phase, 4, 4) + 0.6 * impulsion(phase, 14, 4);
  const amp = 0.04 + 0.14 * croissance;
  const s = lerp(1.1, 2.35, croissance);
  const HX = 610;
  const HY = 690;
  // Le fil du cœur au disque part juste au-dessus du cœur le plus gonflé.
  const AX = HX;
  const AY = HY - 50 * s * (1 + amp) - 12;
  const BX = 518;
  const BY = 434;
  const CTX = 610;
  const CTY = 446;
  const fil = p(f, d[1] + 30, d[1] + 60);
  const surFil = (t: number) => ({ x: (1 - t) ** 2 * AX + 2 * (1 - t) * t * CTX + t ** 2 * BX, y: (1 - t) ** 2 * AY + 2 * (1 - t) * t * CTY + t ** 2 * BY });
  const ETINCELLES = [
    { x: 200, y: 210, t: d[0] - 22 },
    { x: 380, y: 180, t: d[0] + 12 },
    { x: 300, y: 340, t: d[0] + 44 },
    { x: 150, y: 370, t: d[0] + 76 },
    { x: 410, y: 390, t: d[0] + 106 },
    { x: 260, y: 460, t: d[0] + 134 },
  ];
  const bourse = p(f, d[2] - 4, d[2] + 22) * (1 - p(f, d[2] + 188, d[2] + 215));
  const croix = p(f, d[2] + 92, d[2] + 104);
  return (
    <Scene>
      {/* Avant : des élans isolés. */}
      {ETINCELLES.map((e, i) => (
        <Etincelle key={i} x={e.x} y={e.y} r={48} o={p(f, e.t, e.t + 9) * (1 - p(f, e.t + 22, e.t + 44))} />
      ))}
      {/* Le disque : une mesure, sans aucun chiffre. */}
      <g transform={`translate(${CX} ${CY}) scale(${1 + 0.025 * secousse}) translate(${-CX} ${-CY})`}>
        <circle cx={CX} cy={CY} r={R} fill={F.papier} opacity={contour} />
        {frac > 0 ? <path d={part(CX, CY, R, frac)} fill={F.or} stroke={F.encre} strokeWidth={3} /> : null}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={F.encre} strokeWidth={5} pathLength={1} strokeDasharray={`${contour} 1`} opacity={contour > 0 ? 1 : 0} />
        {Array.from({ length: 20 }, (_, i) => {
          const a = (i * Math.PI) / 10;
          return <line key={i} x1={CX + Math.cos(a) * (R + 5)} y1={CY + Math.sin(a) * (R + 5)} x2={CX + Math.cos(a) * (R + 17)} y2={CY + Math.sin(a) * (R + 17)} stroke={F.encre2} strokeWidth={3} opacity={p(f, d[0] + 160 + i, d[0] + 175 + i)} />;
        })}
      </g>
      <g opacity={naissance}>
        <line x1={366} y1={84} x2={424} y2={50} stroke={F.encre2} strokeWidth={3} />
        <Libelle x={432} y={50} taille={32} graisse={600} ancre="start">{L.dimes}</Libelle>
      </g>
      {/* Le fil et les élans du cœur qui font avancer la part. */}
      {fil > 0 ? <path d={`M${AX} ${AY} Q${CTX} ${CTY} ${BX} ${BY}`} fill="none" stroke={F.argile} strokeWidth={4} strokeDasharray="3 13" strokeLinecap="round" opacity={0.75 * fil} /> : null}
      {SAUTS.map((b, i) => {
        const t = lin(f, b, b + VOYAGE);
        if (t <= 0 || t >= 1) return null;
        const q = surFil(t);
        return <Coeur key={i} x={q.x} y={q.y} s={0.3} />;
      })}
      {SAUTS.map((b, i) => {
        const t = lin(f, b, b + 30);
        if (t <= 0 || t >= 1) return null;
        return <circle key={i} cx={HX} cy={HY - 4} r={lerp(58, 58 + 30, t) * Math.min(s, 2.35)} fill="none" stroke={F.argile} strokeWidth={5} opacity={(1 - t) * 0.75} />;
      })}
      <Coeur x={HX} y={HY} s={s * (1 + amp * battement)} />
      {/* Ce qu'on peut se permettre : la pièce monte, mais la part ne bouge pas. */}
      {bourse > 0 ? (
        <g opacity={bourse}>
          <line x1={160} y1={674} x2={188} y2={566} stroke={F.encre2} strokeWidth={4} strokeDasharray="10 9" />
          {[d[2] + 26, d[2] + 92].map((t) => {
            const v = Math.sin(lin(f, t, t + 58) * Math.PI);
            return v > 0 ? <Piece key={t} x={160 + v * 12} y={lerp(676, 622, v)} r={20} /> : null;
          })}
          <path d="M108 680 C84 730 76 776 96 804 Q160 826 224 804 C244 776 236 730 212 680 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
          <path d="M104 682 Q160 702 216 682 L206 660 Q160 676 114 660 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
          <path d={`M${186 - 20 * croix} ${588 - 20 * croix} L${186 + 20 * croix} ${588 + 20 * croix} M${186 + 20 * croix} ${588 - 20 * croix} L${186 - 20 * croix} ${588 + 20 * croix}`} stroke={F.argile} strokeWidth={8} strokeLinecap="round" opacity={croix} />
          <Libelle x={190} y={866} taille={24}>{L.permettre}</Libelle>
        </g>
      ) : null}
    </Scene>
  );
};

/** Largeur de la silhouette de l'ouvrage à une hauteur donnée (0 au faîte, 210 à la base). */
const largeurOuvrage = (h: number) => (h < 90 ? (130 * h) / 90 : h < 140 ? 130 : 210);
const RANGS = 10;
const contourOuvrage = (cx: number, base: number, k: number) =>
  `M${cx} ${base - 210 * k} L${cx + 65 * k} ${base - 120 * k} V${base - 70 * k} H${cx + 105 * k} V${base} H${cx - 105 * k} V${base - 70 * k} H${cx - 65 * k} V${base - 120 * k} Z`;
const detailsOuvrage = (cx: number, base: number, k: number) =>
  `M${cx - 18 * k} ${base} V${base - 34 * k} Q${cx} ${base - 56 * k} ${cx + 18 * k} ${base - 34 * k} V${base} M${cx - 78 * k} ${base - 42 * k} h${16 * k} v${22 * k} h${-16 * k} Z M${cx + 62 * k} ${base - 42 * k} h${16 * k} v${22 * k} h${-16 * k} Z M${cx - 34 * k} ${base - 112 * k} h${16 * k} v${26 * k} h${-16 * k} Z M${cx + 18 * k} ${base - 112 * k} h${16 * k} v${26 * k} h${-16 * k} Z`;

/** Plan 4 : la longue-vue se lève vers l'ouvrage ; les comptes prennent sa forme. */
const IlluVision: React.FC<PropsIllustration> = ({ f, d }) => {
  const PX = 170;
  const PY = 470;
  const leve = p(f, d[0] + 165, d[0] + 225);
  const angle = lerp(33.7, -34, leve);
  const rad = (angle * Math.PI) / 180;
  const OX = PX + 150 * Math.cos(rad);
  const OY = PY + 150 * Math.sin(rad);
  const CX = 535;
  const CY = 225;
  const ouvre = p(f, d[0] + 222, d[0] + 262);
  const R = 175 * ouvre;
  const dessin = p(f, d[0] + 262, d[0] + 350);
  const motVois = p(f, d[0] + 330, d[0] + 358);
  const mini = 1 - p(f, d[0] + 150, d[0] + 190);
  const registre = p(f, d[1] - 14, d[1] + 6);
  const prendForme = p(f, d[1] + 128, d[1] + 195);
  const or = p(f, d[1] + 190, d[1] + 225);
  const k = 30 / 21;
  const BASE = 820;
  const DEPART = [300, 240, 345, 200, 310, 265, 350, 225, 290, 330];
  const pasEcrit = 12;
  const nx = -Math.sin(-34 * (Math.PI / 180));
  const ny = Math.cos(-34 * (Math.PI / 180));
  return (
    <Scene>
      <defs>
        <clipPath id="ch14-vue">
          <circle cx={CX} cy={CY} r={Math.max(R - 3, 0)} />
        </clipPath>
      </defs>
      {/* Ce qu'on regardait d'abord : le disque du pourcentage. */}
      {mini > 0 ? (
        <g opacity={mini}>
          <path d={`M${OX} ${OY} L${440 - 58} ${650 + 62} L${440 + 58} ${650 - 62} Z`} fill={F.orClair} opacity={0.25} />
          <circle cx={440} cy={650} r={92} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <path d={part(440, 650, 92, 0.42)} fill={F.or} stroke={F.encre} strokeWidth={3} />
          <Libelle x={465} y={790} taille={27}>{L.mesure}</Libelle>
        </g>
      ) : null}
      {/* Le cercle de vue. */}
      {ouvre > 0 ? (
        <g>
          <path d={`M${OX} ${OY} L${CX + nx * R} ${CY + ny * R} L${CX - nx * R} ${CY - ny * R} Z`} fill={F.orClair} opacity={0.32} />
          <circle cx={CX} cy={CY} r={R} fill={F.papier} />
          <g clipPath="url(#ch14-vue)">
            <rect x={CX - 180} y={335} width={360} height={80} fill={F.filet} />
            <line x1={CX - 180} x2={CX + 180} y1={335} y2={335} stroke={F.encre} strokeWidth={3} />
            <path d={contourOuvrage(CX, 335, 1)} fill={F.or} opacity={or} />
            <path d={contourOuvrage(CX, 335, 1)} fill="none" stroke={F.encre} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray={`${dessin} 1`} opacity={dessin > 0 ? 1 : 0} />
            <path d={detailsOuvrage(CX, 335, 1)} fill="none" stroke={F.encre} strokeWidth={3} opacity={p(dessin, 0.7, 1)} />
          </g>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={F.encre} strokeWidth={8} />
          <circle cx={CX} cy={CY} r={R + 6} fill="none" stroke={F.or} strokeWidth={4} />
        </g>
      ) : null}
      <Libelle x={CX} y={437} taille={27} graisse={600} opacite={motVois}>{L.vois}</Libelle>
      {/* Le registre : les lignes s'écrivent, puis prennent la forme de l'ouvrage. */}
      {registre > 0 ? (
        <g opacity={registre}>
          <rect x={300} y={456} width={470} height={410} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <Libelle x={CX} y={498} taille={25} graisse={600} couleur={F.encre2}>{L.finances}</Libelle>
          {Array.from({ length: RANGS }, (_, i) => {
            const y = BASE - 300 + (i + 0.5) * 30;
            return <line key={i} x1={320} x2={750} y1={y + 12} y2={y + 12} stroke={F.filet} strokeWidth={2} />;
          })}
          {Array.from({ length: RANGS }, (_, i) => {
            const a = d[1] + 2 + i * pasEcrit;
            const ecrit = lin(f, a, a + 20);
            const y = BASE - 300 + (i + 0.5) * 30;
            const cible = largeurOuvrage((i + 0.5) * 21) * k;
            const w = lerp(DEPART[i] * ecrit, cible, prendForme);
            const x0 = lerp(335, CX - cible / 2, prendForme);
            return ecrit > 0 ? (
              <g key={i}>
                <line x1={x0} x2={x0 + w} y1={y} y2={y} stroke={F.encre2} strokeWidth={13} strokeDasharray="34 7 16 7 46 7 12 7" />
                <line x1={x0} x2={x0 + w} y1={y} y2={y} stroke={F.or} strokeWidth={lerp(13, 27, or)} opacity={or} />
              </g>
            ) : null;
          })}
          <path d={contourOuvrage(CX, BASE, k)} fill="none" stroke={F.orFonce} strokeWidth={4} strokeLinejoin="round" opacity={prendForme * prendForme * 0.9} />
        </g>
      ) : null}
      {/* La longue-vue sur son trépied. */}
      <path d={`M${PX} ${PY} L88 842 M${PX} ${PY} L252 842 M${PX} ${PY} L${PX} 842`} stroke={F.cuir} strokeWidth={12} strokeLinecap="round" />
      <g transform={`rotate(${angle} ${PX} ${PY})`}>
        <rect x={PX - 118} y={PY - 13} width={52} height={26} rx={4} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <rect x={PX - 70} y={PY - 20} width={110} height={40} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <rect x={PX + 34} y={PY - 28} width={110} height={56} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <rect x={PX + 138} y={PY - 32} width={14} height={64} rx={3} fill={F.or} stroke={F.encre} strokeWidth={3} />
        <rect x={PX + 34} y={PY - 28} width={12} height={56} fill={F.or} stroke={F.encre} strokeWidth={3} />
      </g>
      <circle cx={PX} cy={PY} r={13} fill={F.or} stroke={F.encre} strokeWidth={4} />
    </Scene>
  );
};

/** Plan 5 : le mur monte selon le plan, s'arrête sous le trait prévu, et ses pierres deviennent dorées. */
const IlluOeuvre: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 800;
  const H = 58;
  const X0 = 120;
  const LP = 80;
  const COUCHES_PLAN = 9;
  const COUCHES = 8;
  const TRAIT = SOL - COUCHES_PLAN * H;
  type Pierre = { x: number; y: number; w: number; c: number };
  const couche = (c: number): Pierre[] => {
    const y = SOL - (c + 1) * H;
    if (c % 2 === 0) return Array.from({ length: 7 }, (_, i) => ({ x: X0 + i * LP, y, w: LP, c }));
    return [{ x: X0, y, w: LP / 2, c }, ...Array.from({ length: 6 }, (_, i) => ({ x: X0 + LP / 2 + i * LP, y, w: LP, c })), { x: X0 + LP / 2 + 6 * LP, y, w: LP / 2, c }];
  };
  const PLAN = Array.from({ length: COUCHES_PLAN }, (_, c) => couche(c)).flat();
  const MUR = Array.from({ length: COUCHES }, (_, c) => couche(c)).flat();
  const debut = d[0] + 4;
  const finMur = d[2] + 30;
  const pas = (finMur - debut - 14) / MUR.length;
  const planO = p(f, 0, d[0]);
  const traitO = p(f, 4, d[0] - 2);
  const motOeuvre = p(f, d[1] + 6, d[1] + 30) * (1 - p(f, d[2] - 8, d[2] + 8));
  const motTout = p(f, d[2] + 8, d[2] + 32);
  const lumiere = p(f, d[2] + 62, d[2] + 120);
  const motPrevu = p(f, d[2] + 165, d[2] + 195);
  const projette = p(f, d[3] + 4, d[3] + 70);
  const insiste = impulsion(f, d[3] + 75, 26);
  return (
    <Scene>
      {/* Une lumière, seulement quand le don est agréé. */}
      <g opacity={lumiere}>
        <circle cx={400} cy={72} r={46} fill={F.orClair} />
        {Array.from({ length: 13 }, (_, i) => {
          const a = Math.PI * (0.11 + (i * 0.78) / 12);
          return <line key={i} x1={400 + Math.cos(a) * 62} y1={72 + Math.sin(a) * 62} x2={400 + Math.cos(a) * 130} y2={72 + Math.sin(a) * 130} stroke={F.or} strokeWidth={6} strokeLinecap="round" />;
        })}
      </g>
      {/* Le plan en pointillés. */}
      <g opacity={planO}>
        {PLAN.map((q, i) => (
          <rect key={i} x={q.x + 2} y={q.y + 2} width={q.w - 4} height={H - 4} fill="none" stroke={F.encre2} strokeWidth={2.5} strokeDasharray="7 7" opacity={0.6} />
        ))}
      </g>
      {/* Le sol. */}
      <line x1={50} x2={750} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={6} />
      {/* Les pierres posées une à une. */}
      {MUR.map((q, i) => {
        const a = debut + i * pas;
        const o = p(f, a, a + 12);
        if (o <= 0) return null;
        const a2 = d[2] + 62 + q.c * 9 + (i % 7) * 2;
        const dore = p(f, a2, a2 + 22);
        return (
          <g key={i} transform={`translate(0 ${(1 - o) * -46})`} opacity={Math.min(1, o * 2)}>
            <rect x={q.x + 1.5} y={q.y + 1.5} width={q.w - 3} height={H - 3} rx={5} fill={i % 3 === 0 ? F.papier : F.filet} stroke={F.encre} strokeWidth={3} />
            <rect x={q.x + 1.5} y={q.y + 1.5} width={q.w - 3} height={H - 3} rx={5} fill={i % 3 === 0 ? F.orClair : F.or} stroke={F.encre} strokeWidth={3} opacity={dore} />
          </g>
        );
      })}
      {/* Le trait prévu : il reste visible. */}
      <g opacity={traitO}>
        <line x1={70} x2={730} y1={TRAIT} y2={TRAIT} stroke={F.argile} strokeWidth={5 + 4 * insiste} strokeDasharray="22 12" />
        <path d={`M70 ${TRAIT - 16} V${TRAIT + 16} M730 ${TRAIT - 16} V${TRAIT + 16}`} stroke={F.argile} strokeWidth={6} strokeLinecap="round" />
      </g>
      <Libelle x={400} y={TRAIT - 18} taille={28} graisse={600} couleur={F.argile} opacite={motPrevu}>{L.prevu}</Libelle>
      {/* Projeter : la flèche monte jusqu'au trait. */}
      {projette > 0
        ? [80, 720].map((x) => (
            <g key={x}>
              <line x1={x} x2={x} y1={SOL - 8} y2={lerp(SOL - 8, TRAIT + 24, projette)} stroke={F.argile} strokeWidth={5} strokeDasharray="10 9" />
              <path d={`M${x - 11} ${lerp(SOL - 8, TRAIT + 24, projette) + 4} L${x} ${lerp(SOL - 8, TRAIT + 24, projette) - 16} L${x + 11} ${lerp(SOL - 8, TRAIT + 24, projette) + 4} Z`} fill={F.argile} />
            </g>
          ))
        : null}
      <Libelle x={400} y={858} taille={36} graisse={600} couleur={F.orFonce} opacite={motOeuvre}>{L.oeuvre}</Libelle>
      <Libelle x={400} y={858} taille={36} graisse={600} couleur={F.orFonce} opacite={motTout}>{L.tout}</Libelle>
    </Scene>
  );
};

/** Plan 6 : deux carrés en proportions réelles (mille fois la surface, soit 31,6 fois le côté). */
const IlluMontants: React.FC<PropsIllustration> = ({ f, d }) => {
  const COTE = 560;
  const GX = 210;
  const GY = 270;
  const BAS = GY + COTE;
  const PETIT = COTE / Math.sqrt(1000);
  const PX = 92;
  const disque = 1 - p(f, d[0] + 160, d[0] + 192);
  const trace = p(f, d[0] + 165, d[0] + 215);
  const motsCarres = p(f, d[0] + 190, d[0] + 220);
  const lignes = p(f, d[1] - 4, d[1] + 20);
  // Le remplissage occupe tout « cent pour cent de cent mille, c'est cent mille », sous la loupe.
  const plein = p(f, d[1] + 15, d[1] + 98);
  const eclat = impulsion(f, d[1] + 102, 9);
  const loupe = p(f, d[1] - 6, d[1] + 14) * (1 - p(f, d[1] + 125, d[1] + 150));
  const LX = 101;
  const LY = 640;
  const LR = 78;
  const LC = 96;
  const dixieme = p(f, d[1] + 125, d[1] + 180);
  const motDix = p(f, d[1] + 175, d[1] + 200);
  const copie = p(f, d[1] + 190, d[1] + 222);
  // Le dixième se quadrille à la taille du petit carré : la comparaison se lit à la même échelle.
  const mesure = p(f, d[1] + 220, d[1] + 252);
  const souligne = p(f, d[1] + 186, d[1] + 198) * (1 - p(f, d[2] + 6, d[2] + 30));
  const BANDE = COTE / 10;
  const cX = lerp(PX, GX + 24, copie);
  const cY = lerp(BAS - PETIT, BAS - BANDE - PETIT, copie);
  const coin = p(f, d[2] + 8, d[2] + 95);
  const haut = p(f, d[2] - 6, d[2] + 16);
  const refus = p(f, d[2] + 92, d[2] + 112);
  const YH = 70;
  const xPiece = lerp(100, 540, coin);
  const pcx = PX + PETIT / 2;
  const pcy = BAS - PETIT / 2;
  return (
    <Scene>
      {/* Le pourcentage cède la place aux montants. */}
      {disque > 0 ? (
        <g opacity={disque}>
          <circle cx={400} cy={430} r={190} fill={F.papier} stroke={F.encre} strokeWidth={5} />
          <path d={part(400, 430, 190, 0.3 + 0.32 * lin(f, 0, d[0] + 150))} fill={F.or} stroke={F.encre} strokeWidth={3} />
          <Libelle x={400} y={680} taille={32} graisse={600}>{L.pourcentages}</Libelle>
        </g>
      ) : null}
      {/* Le grand carré, ses dix bandes et son dixième. */}
      {trace > 0 ? <rect x={GX} y={GY} width={COTE} height={COTE} fill={F.papier} opacity={trace} /> : null}
      {dixieme > 0 ? <rect x={GX} y={BAS - BANDE * dixieme} width={COTE} height={BANDE * dixieme} fill={F.or} /> : null}
      {mesure > 0 ? (
        <g>
          <defs>
            <clipPath id="ch14-mesure">
              <rect x={GX} y={BAS - BANDE} width={lerp(24 + PETIT, COTE, mesure)} height={BANDE} />
            </clipPath>
          </defs>
          <g clipPath="url(#ch14-mesure)" stroke={F.encre} strokeWidth={1.5} opacity={0.42}>
            {Array.from({ length: 33 }, (_, i) => (
              <line key={i} x1={GX + 24 + (i - 2) * PETIT} x2={GX + 24 + (i - 2) * PETIT} y1={BAS - BANDE} y2={BAS} />
            ))}
            {[1, 2, 3].map((j) => (
              <line key={j} x1={GX} x2={GX + COTE} y1={BAS - BANDE + j * PETIT} y2={BAS - BANDE + j * PETIT} />
            ))}
          </g>
          <rect x={GX} y={BAS - BANDE} width={COTE} height={BANDE} fill="none" stroke={F.orFonce} strokeWidth={5} opacity={mesure * souligne} />
        </g>
      ) : null}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={GX} x2={GX + COTE} y1={GY + (i + 1) * BANDE} y2={GY + (i + 1) * BANDE} stroke={F.filet} strokeWidth={2.5} opacity={lignes} />
      ))}
      {trace > 0 ? <rect x={GX} y={GY} width={COTE} height={COTE} fill="none" stroke={F.encre} strokeWidth={5} pathLength={1} strokeDasharray={`${trace} 1`} /> : null}
      <Libelle x={GX + COTE / 2} y={GY - 20} taille={32} graisse={600} opacite={motsCarres}>{L.centMillions}</Libelle>
      <Libelle x={GX + COTE - 24} y={BAS - BANDE / 2 + 12} taille={32} graisse={600} ancre="end" opacite={motDix}>{L.dixMillions}</Libelle>
      {/* Le petit carré, à la même échelle. */}
      {trace > 0 ? (
        <g opacity={trace}>
          <rect x={PX} y={BAS - PETIT} width={PETIT} height={PETIT} fill={F.papier} />
          <rect x={PX} y={BAS - PETIT * plein} width={PETIT} height={PETIT * plein} fill={F.or} />
          <rect x={PX} y={BAS - PETIT} width={PETIT} height={PETIT} fill="none" stroke={F.encre} strokeWidth={3} />
        </g>
      ) : null}
      <Libelle x={pcx} y={BAS + 46} taille={29} graisse={600} opacite={motsCarres}>{L.centMille}</Libelle>
      {/* La loupe : le carré garde sa taille réelle, elle seule le grossit pendant qu'il se remplit. */}
      {loupe > 0 ? (
        <g opacity={loupe}>
          <path d={`M${PX} ${BAS - PETIT} L${LX - LR} ${LY} L${LX + LR} ${LY} L${PX + PETIT} ${BAS - PETIT} Z`} fill={F.orClair} opacity={0.35} />
          <path d={`M${PX} ${BAS - PETIT} L${LX - LR} ${LY} M${PX + PETIT} ${BAS - PETIT} L${LX + LR} ${LY}`} fill="none" stroke={F.encre2} strokeWidth={3} />
          <circle cx={pcx} cy={pcy} r={21} fill="none" stroke={F.argile} strokeWidth={4} />
          {[10, 40, 70, 100].map((t) => {
            const v = lin(f, d[1] + t, d[1] + t + 26);
            return v > 0 && v < 1 ? <circle key={t} cx={pcx} cy={pcy} r={lerp(21, 32, v)} fill="none" stroke={F.argile} strokeWidth={3} opacity={1 - v} /> : null;
          })}
          {eclat > 0.02 ? <circle cx={LX} cy={LY} r={LR + 24 * lin(f, d[1] + 92, d[1] + 122)} fill="none" stroke={F.or} strokeWidth={8} opacity={eclat} /> : null}
          <g transform={`translate(${LX} ${LY}) scale(${lerp(0.7, 1, p(f, d[1] - 6, d[1] + 14))}) translate(${-LX} ${-LY})`}>
            <circle cx={LX} cy={LY} r={LR} fill={F.papier} />
            <g transform={`translate(${LX} ${LY}) scale(${1 + 0.1 * eclat}) translate(${-LX} ${-LY})`}>
              <rect x={LX - LC / 2} y={LY + LC / 2 - LC * plein} width={LC} height={LC * plein} fill={F.or} />
              <rect x={LX - LC / 2} y={LY - LC / 2} width={LC} height={LC} fill={F.orClair} opacity={eclat} />
              <rect x={LX - LC / 2} y={LY - LC / 2} width={LC} height={LC} fill="none" stroke={F.encre} strokeWidth={4} />
            </g>
            <circle cx={LX} cy={LY} r={LR} fill="none" stroke={F.encre} strokeWidth={6} />
            <circle cx={LX} cy={LY} r={LR + 5} fill="none" stroke={F.or} strokeWidth={4} />
          </g>
        </g>
      ) : null}
      {/* Son double vient se poser sur le dixième : il y paraît minuscule. */}
      {copie > 0 ? <rect x={cX} y={cY} width={PETIT} height={PETIT} fill={F.or} stroke={F.encre} strokeWidth={3} /> : null}
      {souligne > 0 ? (
        <g opacity={souligne}>
          <circle cx={cX + PETIT / 2} cy={cY + PETIT / 2} r={23} fill="none" stroke={F.argile} strokeWidth={4} />
          {[222, 242, 262].map((t) => {
            const v = lin(f, d[1] + t, d[1] + t + 26);
            return v > 0 && v < 1 ? <circle key={t} cx={cX + PETIT / 2} cy={cY + PETIT / 2} r={lerp(23, 54, v)} fill="none" stroke={F.argile} strokeWidth={3} opacity={1 - v} /> : null;
          })}
        </g>
      ) : null}
      {/* Les dîmes prennent un autre chemin. */}
      {haut > 0 ? (
        <g opacity={haut}>
          <line x1={150} x2={590} y1={YH} y2={YH} stroke={F.encre2} strokeWidth={4} strokeDasharray="10 10" />
          <g opacity={refus}>
            <line x1={330} x2={330} y1={YH + 6} y2={236} stroke={F.encre2} strokeWidth={4} strokeDasharray="10 10" />
            <path d="M319 234 H341 L330 256 Z" fill={F.encre2} />
          </g>
          <path d={`M${312} ${118} L${348} ${154} M${348} ${118} L${312} ${154}`} stroke={F.argile} strokeWidth={8} strokeLinecap="round" opacity={refus} />
          {/* La petite église. */}
          <path d="M646 50 L700 12 L754 50 V104 H646 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <path d="M686 104 V76 Q700 60 714 76 V104" fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
          <Libelle x={700} y={140} taille={25}>{L.eglise}</Libelle>
          <Piece x={xPiece} y={YH} r={30} />
          <Libelle x={xPiece} y={136} taille={26} graisse={600}>{L.dimes}</Libelle>
        </g>
      ) : null}
    </Scene>
  );
};

/** Le plan de chantier, commun au plan 7 et à la fin. */
const RANGEES = [215, 380, 545];
const HB = 130;
const COLONNES = [
  { x: 62, w: 170 },
  { x: 244, w: 150 },
  { x: 406, w: 150 },
];
const motBloc = (j: number) => (j === 0 ? L.phases : L.projets);
const fondBloc = (j: number) => (j === 0 ? F.cuir : F.orClair);
const encreBloc = (j: number) => (j === 0 ? F.papier : F.encre);

const FondPlan: React.FC<{ bas: number; titre: number; ouvert: number }> = ({ bas, titre, ouvert }) => (
  <g>
    <defs>
      <clipPath id="ch14-plan">
        <rect x={40} y={110} width={530} height={Math.max(0, bas - 110)} />
      </clipPath>
    </defs>
    <g clipPath="url(#ch14-plan)">
      <rect x={40} y={110} width={530} height={640} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={66 + i * 40} x2={66 + i * 40} y1={110} y2={750} stroke={F.filet} strokeWidth={1.5} />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <line key={i} x1={40} x2={570} y1={140 + i * 40} y2={140 + i * 40} stroke={F.filet} strokeWidth={1.5} />
      ))}
      <Libelle x={305} y={178} taille={30} graisse={600} opacite={titre}>{L.ouvriers}</Libelle>
      {RANGEES.map((y, r) =>
        COLONNES.map((c, j) => <rect key={`${r}-${j}`} x={c.x} y={y} width={c.w} height={HB} rx={6} fill="none" stroke={F.encre2} strokeWidth={2.5} strokeDasharray="8 8" opacity={ouvert} />),
      )}
      {[0, 1].map((r) => (
        <path key={r} d={`M147 ${RANGEES[r] + HB + 3} V${RANGEES[r + 1] - 8} M138 ${RANGEES[r + 1] - 16} L147 ${RANGEES[r + 1] - 4} L156 ${RANGEES[r + 1] - 16}`} fill="none" stroke={F.encre2} strokeWidth={3.5} strokeLinecap="round" opacity={ouvert} />
      ))}
    </g>
    <rect x={28} y={94} width={554} height={24} rx={10} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
  </g>
);

const Bloc: React.FC<{ x: number; y: number; w: number; h: number; j: number; fond?: number; mot?: number }> = ({ x, y, w, h, j, fond = 1, mot = 1 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={4} />
    <rect x={x} y={y} width={w} height={h} rx={6} fill={fondBloc(j)} stroke={F.encre} strokeWidth={4} opacity={fond} />
    <rect x={x + 3} y={y + h - 16} width={Math.max(0, w - 6)} height={13} fill={F.encre} opacity={0.16 * fond} />
    <Libelle x={x + w / 2} y={y + h / 2 + 7} taille={27} graisse={600} couleur={encreBloc(j)} opacite={mot}>{motBloc(j)}</Libelle>
  </g>
);

/** Plan 7 : le plan se déroule, les blocs se posent ; le podium de comparaison rejoint le plan. */
const IlluOuvriers: React.FC<PropsIllustration> = ({ f, d }) => {
  const deroule = p(f, 0, d[0] + 70);
  const bas = lerp(118, 750, deroule);
  const titre = p(f, d[0] + 95, d[0] + 125);
  const SOL = 750;
  const MARCHES = [
    { x: 598, w: 62, depart: d[2] + 166, slot: 0 },
    { x: 660, w: 62, depart: d[2] + 192, slot: 1 },
    { x: 722, w: 62, depart: d[2] + 218, slot: 2 },
  ];
  // La comparaison : tour à tour, une marche monte d'un à-coup et sa pile gagne une pièce pour dépasser les autres.
  const H0 = 50;
  const ETAPES = [
    { m: 0, h: 90 },
    { m: 1, h: 130 },
    { m: 2, h: 90 },
    { m: 0, h: 150 },
    { m: 1, h: 180 },
    { m: 1, h: 205 },
    { m: 1, h: 230 },
  ].map((e, i) => ({ ...e, t: d[1] + 40 + i * 32 }));
  const ETAT = MARCHES.map((_, j) => {
    const siennes = ETAPES.filter((e) => e.m === j);
    const h = siennes.reduce((s, e, i) => s + (e.h - (i === 0 ? H0 : siennes[i - 1].h)) * (p(f, e.t, e.t + 12) + 0.14 * impulsion(f, e.t + 13, 5)), H0);
    const pieces = [d[1] + 18 + j * 6, ...siennes.map((e) => e.t + 6)];
    const nb = pieces.reduce((s, t) => s + p(f, t, t + 14), 0);
    return { h, pieces, sommet: SOL - h - 19 - 13 * Math.max(0, nb - 1) };
  });
  const toise = Math.min(...ETAT.map((e) => e.sommet)) - 7;
  const toiseO = p(f, d[1] + 28, d[1] + 44);
  const felicite = p(f, d[2] + 30, d[2] + 60);
  const defait = p(f, d[2] + 146, d[2] + 166);
  return (
    <Scene>
      <FondPlan bas={bas} titre={titre} ouvert={p(f, d[0] - 10, d[0] + 40)} />
      {/* Deux rangées se posent dès que le plan est ouvert. */}
      {[0, 1].map((r) =>
        COLONNES.map((c, j) => {
          const a = d[0] + 28 + r * 56 + j * 16;
          const o = p(f, a, a + 18);
          return o > 0 ? (
            <g key={`${r}-${j}`} opacity={Math.min(1, o * 2)} transform={`translate(0 ${(1 - o) * -36})`}>
              <Bloc x={c.x} y={RANGEES[r]} w={c.w} h={HB} j={j} />
            </g>
          ) : null;
        }),
      )}
      {/* Le rouleau du plan. */}
      <g>
        <rect x={28} y={bas - 14} width={554} height={28} rx={13} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <path d={`M44 ${bas} H566`} stroke={F.filet} strokeWidth={3} opacity={1 - deroule * 0.4} />
      </g>
      {/* Le podium de comparaison : ses marches deviennent la dernière rangée. */}
      {MARCHES.map((m, j) => {
        const pop = p(f, d[1] + 2, d[1] + 34);
        if (pop <= 0) return null;
        const v = p(f, m.depart, m.depart + 42);
        const c = COLONNES[m.slot];
        const hm = ETAT[j].h * pop;
        return <Bloc key={m.x} x={lerp(m.x, c.x, v)} y={lerp(SOL - hm, RANGEES[2], v)} w={lerp(m.w, c.w, v)} h={lerp(hm, HB, v)} j={m.slot} fond={p(v, 0.45, 1)} mot={p(v, 0.82, 1)} />;
      })}
      {/* Les piles comparées sur les marches, et la satisfaction sur la plus haute. */}
      {/* La toise : le niveau du premier, auquel chacun se mesure. */}
      <line x1={592} x2={790} y1={toise} y2={toise} stroke={F.argile} strokeWidth={4} strokeDasharray="12 8" opacity={toiseO * (1 - defait)} />
      {MARCHES.map((m, j) => (
        <g key={m.x} opacity={1 - defait}>
          {ETAT[j].pieces.map((t, i) => {
            const o = p(f, t, t + 14);
            return o > 0 ? <ellipse key={i} cx={m.x + 31} cy={SOL - ETAT[j].h - 10 - i * 13 - (1 - o) * 44} rx={23} ry={9} fill={F.or} stroke={F.orFonce} strokeWidth={2.5} opacity={Math.min(1, o * 2)} /> : null;
          })}
        </g>
      ))}
      <Etincelle x={691} y={396} r={40} o={felicite * (1 - defait) * (0.65 + 0.35 * Math.sin(f / 5))} />
      <line x1={592} x2={790} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={5} opacity={p(f, d[1] + 2, d[1] + 20) * (1 - p(f, d[2] + 225, d[2] + 258))} />
    </Scene>
  );
};

/** Fin : le thermomètre plein là où se tenait le podium ; le plan reste en fond, immobile. */
const IlluFinChapitre: React.FC<PropsIllustration> = ({ f }) => {
  const c = p(f, 55, 85);
  return (
    <Scene>
      <g opacity={0.42}>
        <FondPlan bas={750} titre={1} ouvert={1} />
        {RANGEES.map((y, r) => COLONNES.map((col, j) => <Bloc key={`${r}-${j}`} x={col.x} y={y} w={col.w} h={HB} j={j} />))}
        <rect x={28} y={736} width={554} height={28} rx={13} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      </g>
      <Thermometre x={672} y={210} h={480} l={72} niveau={0.72 + 0.28 * p(f, 0, 60)} />
      {c > 0 ? <Coeur x={672} y={90} s={1.25 * c} /> : null}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluTitre,
  p2: IlluSpontane,
  p3: IlluSacrifice,
  p4: IlluVision,
  p5: IlluOeuvre,
  p6: IlluMontants,
  p7: IlluOuvriers,
  fin: IlluFinChapitre,
};
