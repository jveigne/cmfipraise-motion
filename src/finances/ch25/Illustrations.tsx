import React from 'react';
import { Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F, PoliceF } from '../theme';
import { LIBELLES } from './libelles';

const rad = (a: number) => (a * Math.PI) / 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const borne = (t: number) => Math.max(0, Math.min(1, t));

/** Le coffret de collecte, le fil du chapitre. (x, y) : le milieu de sa base. */
const Coffret: React.FC<{ x: number; y: number; l: number }> = ({ x, y, l }) => {
  const hCorps = l * 0.55;
  const hCouvercle = l * 0.22;
  const haut = y - hCorps;
  return (
    <g>
      <rect x={x - l * 0.44} y={y - 2} width={l * 0.14} height={l * 0.04} fill={F.encre} />
      <rect x={x + l * 0.3} y={y - 2} width={l * 0.14} height={l * 0.04} fill={F.encre} />
      <rect x={x - l / 2} y={haut} width={l} height={hCorps} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {[-0.32, 0.32].map((k) => (
        <rect key={k} x={x + k * l - l * 0.035} y={haut} width={l * 0.07} height={hCorps} fill={F.cuirClair} stroke={F.encre} strokeWidth={2} />
      ))}
      <path d={`M${x - l / 2} ${haut} L${x - l * 0.42} ${haut - hCouvercle} H${x + l * 0.42} L${x + l / 2} ${haut} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <rect x={x - l * 0.22} y={haut - hCouvercle * 0.62} width={l * 0.44} height={Math.max(7, l * 0.05)} rx={3} fill={F.encre} />
      <rect x={x - l * 0.09} y={haut + hCorps * 0.2} width={l * 0.18} height={hCorps * 0.5} rx={4} fill={F.or} stroke={F.encre} strokeWidth={3} />
      <circle cx={x} cy={haut + hCorps * 0.39} r={l * 0.025} fill={F.encre} />
      <rect x={x - l * 0.012} y={haut + hCorps * 0.39} width={l * 0.024} height={hCorps * 0.2} fill={F.encre} />
    </g>
  );
};

/** Une enveloppe fermée, vue de dos, centrée sur (0, 0). */
const Enveloppe: React.FC<{ l: number; h: number; rabat?: string }> = ({ l, h, rabat = F.papier }) => (
  <g>
    <rect x={-l / 2} y={-h / 2} width={l} height={h} rx={5} fill={F.papier} stroke={F.encre} strokeWidth={4} />
    <path d={`M${-l / 2} ${h / 2} L${-l * 0.08} ${0} M${l / 2} ${h / 2} L${l * 0.08} ${0}`} stroke={F.filet} strokeWidth={3} />
    <path d={`M${-l / 2 + 2} ${-h / 2 + 2} L0 ${h * 0.14} L${l / 2 - 2} ${-h / 2 + 2} Z`} fill={rabat} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

/** Un faisceau de rayons effilés qui s'ouvre autour de (x, y). `o` de 0 à 1. */
const Rayons: React.FC<{ x: number; y: number; r1: number; r2: number; o: number; debut: number; fin: number; n: number; f: number }> = ({ x, y, r1, r2, o, debut, fin, n, f }) => {
  const milieu = (debut + fin) / 2;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = milieu + (debut + (i * (fin - debut)) / (n - 1) - milieu) * o;
        const long = (i % 2 === 0 ? r2 : r2 * 0.8) * (0.96 + 0.04 * Math.sin(f / 18 + i));
        const r = r1 + (long - r1) * o;
        const e = 3 + (i % 2 === 0 ? 3.6 : 2.6);
        return (
          <path
            key={i}
            d={`M${x + Math.cos(rad(a - e)) * r1} ${y + Math.sin(rad(a - e)) * r1} L${x + Math.cos(rad(a)) * r} ${y + Math.sin(rad(a)) * r} L${x + Math.cos(rad(a + e)) * r1} ${y + Math.sin(rad(a + e)) * r1} Z`}
            fill={i % 2 === 0 ? F.or : F.orClair}
            opacity={o}
          />
        );
      })}
    </g>
  );
};

/** Plan 1 : une enveloppe de don bascule, entre dans le thermomètre, et le niveau monte un peu. */
const Ouverture: React.FC<PropsIllustration> = ({ f }) => {
  const chute = p(f, 18, 74);
  const y = 40 + chute * 570;
  const angle = 90 * p(f, 18, 44);
  const visible = p(f, 8, 18) * (1 - p(f, 68, 78));
  const env = (
    <g transform={`translate(400 ${y}) rotate(${angle})`} opacity={visible}>
      <Enveloppe l={100} h={60} rabat={F.orClair} />
    </g>
  );
  const onde = p(f, 72, 104);
  return (
    <Scene>
      <defs>
        <clipPath id="ch25-tube">
          <rect x={366} y={140} width={68} height={520} />
        </clipPath>
      </defs>
      {env}
      <Thermometre x={400} y={170} h={520} l={72} niveau={0.08 + 0.14 * p(f, 70, 125)} />
      <g clipPath="url(#ch25-tube)">{env}</g>
      {onde > 0 && onde < 1 ? <circle cx={400} cy={645} r={36 + onde * 86} fill="none" stroke={F.or} strokeWidth={5} opacity={1 - onde} /> : null}
    </Scene>
  );
};

/** Plan 2 : le coffret posé au sol s'élève sur un socle de pierre, les rayons s'ouvrent derrière lui. */
const Plan2: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 800;
  const HAUT = 300;
  const monte = p(f, d[0] - 14, d[0] + 225);
  const ouvre = p(f, d[0] + 15, d[0] + 275);
  const dessus = SOL - HAUT * monte;
  const cy = dessus - 70;
  const rangs = [0, 1, 2, 3];
  return (
    <Scene>
      <defs>
        <clipPath id="ch25-sol">
          <rect x={0} y={0} width={800} height={SOL} />
        </clipPath>
      </defs>
      <circle cx={400} cy={cy} r={60 + 100 * ouvre} fill={F.orClair} opacity={0.55 * ouvre} />
      <Rayons x={400} y={cy} r1={110} r2={360} o={ouvre} debut={-200} fin={20} n={17} f={f} />
      <g clipPath="url(#ch25-sol)">
        <g transform={`translate(0 ${dessus})`}>
          <rect x={270} y={0} width={260} height={34} rx={3} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <rect x={300} y={34} width={200} height={224} fill={F.filet} stroke={F.encre} strokeWidth={4} />
          {rangs.map((i) => (
            <g key={i}>
              <line x1={300} x2={500} y1={34 + (i + 1) * 45} y2={34 + (i + 1) * 45} stroke={F.encre2} strokeWidth={2.5} />
              <line x1={i % 2 === 0 ? 370 : 425} x2={i % 2 === 0 ? 370 : 425} y1={34 + i * 45} y2={34 + (i + 1) * 45} stroke={F.encre2} strokeWidth={2.5} />
            </g>
          ))}
          <rect x={260} y={258} width={280} height={44} rx={3} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        </g>
      </g>
      <line x1={50} x2={750} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
      <Coffret x={400} y={dessus - 8} l={200} />
    </Scene>
  );
};

/** Plan 3 : la caisse tourne, le toit s'ouvre et la lumière descend sur le coffret ; puis le toit se referme sur les caissiers. */
const Plan3: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1] = d;
  const toit = p(f, d0 + 70, d0 + 130) * (1 - p(f, d1 + 45, d1 + 110));
  const lumiere = p(f, d0 + 105, d0 + 170) * (1 - p(f, d1 + 25, d1 + 75));
  const marche = (1 - p(f, d0 + 45, d0 + 75)) + p(f, d1 + 5, d1 + 40);
  const defile = 1.1 * Math.min(f, d0 + 60) + 2.6 * Math.max(0, f - (d1 + 15));
  const tiroir = marche * Math.pow(Math.max(0, Math.sin((f * Math.PI) / 42)), 0.6);
  const insiste = p(f, d1 + 510, d1 + 545);
  const angle = lerp(24.4, 60, toit);
  const L = 362;
  const hautG = { x: 70 + Math.cos(rad(angle)) * L, y: 330 - Math.sin(rad(angle)) * L };
  const hautD = { x: 730 - Math.cos(rad(angle)) * L, y: hautG.y };
  const basLumiere = 17 + 683 * lumiere;
  const k = (basLumiere - 17) / 683;
  const eclat = lumiere;
  const Colonne: React.FC<{ x: number; sens: number; couleur: string }> = ({ x, sens, couleur }) => (
    <g clipPath="url(#ch25-ecran)">
      {Array.from({ length: 6 }, (_, i) => {
        const pas = 30;
        const y = 462 + ((((defile * sens + i * pas) % (6 * pas)) + 6 * pas) % (6 * pas));
        return (
          <g key={i}>
            <circle cx={x - 50} cy={y} r={7} fill={couleur} stroke={F.encre} strokeWidth={2} />
            <rect x={x - 36} y={y - 4} width={56 + ((i * 37) % 34)} height={8} rx={4} fill={F.encre2} />
          </g>
        );
      })}
    </g>
  );
  const Pan: React.FC<{ sens: number }> = ({ sens }) => (
    <g transform={sens < 0 ? `rotate(${-angle} 70 330)` : `translate(800 0) scale(-1 1) rotate(${-angle} 70 330)`}>
      <rect x={58} y={306} width={L + 12} height={26} rx={3} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={96 + i * 38} x2={96 + i * 38} y1={309} y2={329} stroke={F.cuirClair} strokeWidth={3} />
      ))}
    </g>
  );
  return (
    <Scene>
      <defs>
        <clipPath id="ch25-ecran">
          <rect x={142} y={458} width={276} height={118} />
        </clipPath>
        <clipPath id="ch25-sol-caisse">
          <rect x={0} y={0} width={800} height={807} />
        </clipPath>
      </defs>
      {/* Le ciel, derrière le toit. */}
      <path d={`M70 330 L${hautG.x} ${hautG.y} L${hautD.x} ${hautD.y} L730 330 Z`} fill={F.orClair} opacity={0.45 * toit} />
      <rect x={72} y={330} width={656} height={480} fill={F.papier} />
      <path d={`M70 330 L400 180 L730 330 Z`} fill={F.papier} opacity={1 - toit} />
      {/* La lumière qui descend sur le coffret. */}
      <path d={`M380 17 H520 L${520 + 170 * k} ${basLumiere} H${380 + 110 * k} Z`} fill={F.orClair} opacity={0.62 * eclat} />
      {Array.from({ length: 7 }, (_, i) => {
        const t = (f * 0.006 + i / 7) % 1;
        return <circle key={i} cx={lerp(410 + i * 14, 500 + i * 26, 1 - t)} cy={lerp(660, 120, t)} r={3 + (i % 3)} fill={F.or} opacity={eclat * Math.sin(t * Math.PI)} />;
      })}
      {/* Murs et sol. */}
      <path d="M72 330 V810 M728 330 V810" stroke={F.encre} strokeWidth={6} fill="none" />
      <line x1={30} x2={770} y1={810} y2={810} stroke={F.encre} strokeWidth={6} strokeLinecap="round" />
      {/* Le coffret : éteint à l'ombre, vif dans la lumière ; des pièces y tombent. */}
      <ellipse cx={590} cy={735} rx={130} ry={92} fill={F.orClair} opacity={0.5 * eclat} clipPath="url(#ch25-sol-caisse)" />
      {Array.from({ length: 4 }, (_, i) => {
        const t = ((f + i * 34) % 136) / 136;
        return <Piece key={i} x={lerp(500, 590, t)} y={lerp(160, 672, t * t)} r={16} opacite={eclat * Math.min(1, (1 - t) * 8) * Math.min(1, t * 8)} />;
      })}
      <g opacity={0.5 + 0.5 * eclat}>
        <Coffret x={590} y={806} l={190} />
      </g>
      {/* La caisse enregistreuse. */}
      <rect x={125} y={400} width={310} height={192} rx={14} fill={F.cuir} stroke={insiste > 0 ? F.or : F.encre} strokeWidth={4 + 3 * insiste} />
      <rect x={139} y={414} width={282} height={164} rx={5} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
      <Libelle x={210} y={444} taille={23} graisse={600} couleur={insiste > 0.5 ? F.orFonce : F.encre}>{LIBELLES.entrees}</Libelle>
      <Libelle x={350} y={444} taille={23} graisse={600} couleur={insiste > 0.5 ? F.orFonce : F.encre}>{LIBELLES.sorties}</Libelle>
      <line x1={142} x2={418} y1={456} y2={456} stroke={F.encre2} strokeWidth={2} />
      <line x1={280} x2={280} y1={420} y2={574} stroke={F.encre2} strokeWidth={2} />
      <Colonne x={210} sens={1} couleur={F.or} />
      <Colonne x={350} sens={-1} couleur={F.argile} />
      <path d="M125 590 H435 L455 690 H105 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      {[0, 1, 2].map((r) =>
        Array.from({ length: 7 }, (_, c) => {
          const enfonce = marche > 0.5 && Math.floor(f / 7) % 21 === r * 7 + c ? 2 : 0;
          return <circle key={`${r}-${c}`} cx={280 + (c - 3) * (42 + r * 3)} cy={612 + r * 28 + enfonce} r={10 + r} fill={F.orClair} stroke={F.encre} strokeWidth={2.5} />;
        }),
      )}
      <rect x={105} y={690} width={350} height={80} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <rect x={120} y={702} width={320} height={56} fill={F.encre} />
      {tiroir > 0.05 ? (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <Piece key={i} x={170 + i * 55} y={722} r={13} />
          ))}
        </g>
      ) : null}
      <g transform={`translate(0 ${tiroir * 32})`}>
        <rect x={112 - tiroir * 7} y={704 + tiroir * 2} width={336 + tiroir * 14} height={52} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <rect x={250} y={724} width={60} height={10} rx={5} fill={F.or} stroke={F.encre} strokeWidth={2} />
      </g>
      {/* Le toit, en deux pans. */}
      <Pan sens={-1} />
      <Pan sens={1} />
      <path d="M372 166 L400 150 L428 166 L400 182 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" opacity={toit < 0.02 ? 1 : 0} />
    </Scene>
  );
};

/** Plan 4 : le plateau oscille, éclairé des deux côtés ; le poids de l'intégrité l'immobilise net. */
const Plan4: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1] = d;
  const haut = p(f, d0 + 105, d0 + 150);
  const cote = p(f, d0 + 190, d0 + 235);
  // Le poids touche le plateau à l'instant précis où celui-ci repasse à l'horizontale.
  const PERIODE = 13;
  const pose = Math.round((d1 + 175) / (PERIODE * Math.PI)) * (PERIODE * Math.PI);
  const apres = f >= pose;
  const angle = apres ? 0 : Math.sin(f / PERIODE) * 8;
  const PLATEAU = 549;
  const apparait = p(f, d1 + 15, d1 + 50);
  const t = borne((f - (pose - 34)) / 34);
  const basPoids = lerp(236, PLATEAU, t * t);
  const choc = p(f, pose, pose + 18);
  /** Un point du dessus du plateau, en suivant son inclinaison. */
  const surPlateau = (x: number) => {
    const a = rad(angle);
    return { x: 400 + (x - 400) * Math.cos(a) + 33 * Math.sin(a), y: 582 + (x - 400) * Math.sin(a) - 33 * Math.cos(a) };
  };
  const hG = surPlateau(lerp(365, 195, haut));
  const hD = surPlateau(lerp(435, 605, haut));
  const cG = surPlateau(235);
  const cD = surPlateau(625);
  return (
    <Scene>
      <defs>
        <linearGradient id="ch25-rayon" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={150}>
          <stop offset={0} stopColor={F.orClair} stopOpacity={0} />
          <stop offset={1} stopColor={F.orClair} stopOpacity={1} />
        </linearGradient>
      </defs>
      {/* Le rayon d'en haut. */}
      <path d={`M365 0 H435 L${hD.x} ${lerp(0, hD.y, haut)} L${hG.x} ${lerp(0, hG.y, haut)} Z`} fill="url(#ch25-rayon)" opacity={0.6 * haut} />
      <Libelle x={318} y={62} taille={27} ancre="end" opacite={haut} graisse={600}>{LIBELLES.seigneur}</Libelle>
      {/* La lampe de côté. */}
      <g opacity={p(f, 0, 20)}>
        <path d={`M668 372 L${lerp(668, cG.x, cote)} ${lerp(372, cG.y, cote)} L${lerp(676, cD.x, cote)} ${lerp(422, cD.y, cote)} L676 422 Z`} fill={F.orClair} opacity={0.5 * cote} />
        <rect x={720} y={380} width={10} height={400} fill={F.encre} />
        <path d="M725 370 Q725 345 700 350" fill="none" stroke={F.encre} strokeWidth={8} strokeLinecap="round" />
        <path d="M710 334 L664 366 L680 428 L722 380 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <ellipse cx={672} cy={397} rx={10} ry={32} transform="rotate(-14 672 397)" fill={cote > 0 ? F.orClair : F.filet} stroke={F.encre} strokeWidth={3} />
        <rect x={680} y={776} width={90} height={14} rx={3} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      </g>
      <Libelle x={772} y={830} taille={27} ancre="end" opacite={cote} graisse={600}>{LIBELLES.hommes}</Libelle>
      {/* La colonne et le plateau. */}
      <path d="M368 600 H432 L446 760 H354 Z" fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <rect x={300} y={760} width={200} height={30} rx={3} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <line x1={50} x2={770} y1={790} y2={790} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
      <g transform={`rotate(${angle} 400 582)`}>
        <rect x={170} y={PLATEAU} width={460} height={22} rx={5} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <path d={`M170 ${PLATEAU + 6} V${PLATEAU - 16} M630 ${PLATEAU + 6} V${PLATEAU - 16}`} stroke={F.encre} strokeWidth={7} strokeLinecap="round" />
        <rect x={172} y={PLATEAU} width={456} height={6} fill={F.orClair} opacity={Math.max(haut, cote)} />
      </g>
      <circle cx={400} cy={586} r={18} fill={F.or} stroke={F.encre} strokeWidth={4} />
      {/* Le choc. */}
      {choc > 0 && choc < 1
        ? [-1, 1].map((s) => (
            <g key={s} opacity={1 - choc}>
              {[0, 1, 2].map((i) => (
                <line
                  key={i}
                  x1={400 + s * (122 + choc * 16)}
                  y1={PLATEAU - 6 - i * 16}
                  x2={400 + s * (148 + choc * 34 - i * 6)}
                  y2={PLATEAU - 12 - i * 26}
                  stroke={F.encre}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
              ))}
            </g>
          ))
        : null}
      {/* Le poids de fonte. */}
      <g opacity={apparait} transform={`translate(400 ${basPoids})`}>
        <circle cx={0} cy={-156} r={25} fill="none" stroke={F.encre} strokeWidth={11} />
        <path d="M-105 -4 Q-108 0 -100 0 H100 Q108 0 105 -4 L74 -128 Q72 -136 64 -136 H-64 Q-72 -136 -74 -128 Z" fill={F.encre} />
        <path d="M-92 -12 L-64 -124" stroke={F.encre2} strokeWidth={5} strokeLinecap="round" />
        <Libelle x={0} y={-54} taille={29} couleur={F.papier} graisse={600}>{LIBELLES.integrite}</Libelle>
      </g>
    </Scene>
  );
};

/** Une cible : la vision visée. */
const LueurCible: React.FC<{ x: number; y: number; r: number; lueur: number; f: number }> = ({ x, y, r, lueur, f }) => (
  <g>
    {Array.from({ length: 12 }, (_, i) => {
      const a = rad(i * 30 + f * 0.25);
      return <line key={i} x1={x + Math.cos(a) * (r + 10)} y1={y + Math.sin(a) * (r + 10)} x2={x + Math.cos(a) * (r + 32)} y2={y + Math.sin(a) * (r + 32)} stroke={F.or} strokeWidth={5} strokeLinecap="round" opacity={lueur} />;
    })}
  </g>
);

const Cible: React.FC<{ x: number; y: number; r: number; couleur: string }> = ({ x, y, r, couleur }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={F.papier} stroke={F.encre} strokeWidth={5} />
    <circle cx={x} cy={y} r={r * 0.68} fill={couleur} stroke={F.encre} strokeWidth={3} />
    <circle cx={x} cy={y} r={r * 0.4} fill={F.papier} stroke={F.encre} strokeWidth={3} />
    <circle cx={x} cy={y} r={r * 0.16} fill={couleur} stroke={F.encre} strokeWidth={3} />
  </g>
);

const Loupe: React.FC<{ x: number; y: number; r: number; id: string; children: React.ReactNode }> = ({ x, y, r, id, children }) => (
  <g>
    <defs>
      <clipPath id={id}>
        <circle cx={x} cy={y} r={r} />
      </clipPath>
    </defs>
    <line x1={x + r * 0.74} y1={y + r * 0.74} x2={x + r * 1.62} y2={y + r * 1.62} stroke={F.cuir} strokeWidth={17} strokeLinecap="round" />
    <line x1={x + r * 0.74} y1={y + r * 0.74} x2={x + r * 1.62} y2={y + r * 1.62} stroke={F.encre} strokeWidth={3} strokeDasharray="1 200" />
    <circle cx={x} cy={y} r={r} fill={F.parchemin} />
    <g clipPath={`url(#${id})`}>
      <g transform={`translate(${x} ${y}) scale(1.35) translate(${-x} ${-y})`}>{children}</g>
    </g>
    <circle cx={x} cy={y} r={r} fill={F.orClair} opacity={0.14} />
    <circle cx={x} cy={y} r={r} fill="none" stroke={F.encre} strokeWidth={9} />
    <circle cx={x} cy={y} r={r - 7} fill="none" stroke={F.or} strokeWidth={3} />
  </g>
);

/** Plan 5 : les pièces vont de la collecte à la vision ; la vanne les détourne ; les loupes les ramènent. */
const Plan5: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1, d2, d3] = d;
  const Y = 350;
  const X_D = 180;
  const X_V = 420;
  const X_F = 585;
  const Y_B = 690;
  const X_B = 578;
  const cible = p(f, d0 - 6, d0 + 26);
  const tuyau = p(f, d1, d1 + 65);
  const debutFlux = d1 + 30;
  const branche = p(f, d2 + 15, d2 + 75);
  const detour = d2 + 100;
  const pose1 = d3 + 185;
  const pose2 = d3 + 255;
  const retour = d3 + 310;
  const volet = p(f, detour - 24, detour) * (1 - p(f, retour - 24, retour));
  const devie = p(f, detour + 15, detour + 50) * (1 - p(f, retour + 30, retour + 70));
  const VITESSE = 3.4;
  const PERIODE = 26;
  const lgV = X_V - X_D;
  const pieces: { x: number; y: number; k: number; devie: boolean }[] = [];
  if (f >= debutFlux) {
    const n = Math.floor((f - debutFlux) / PERIODE);
    for (let k = Math.max(0, n - 32); k <= n; k++) {
      const e = debutFlux + k * PERIODE;
      const s = (f - e) * VITESSE;
      const tv = e + lgV / VITESSE;
      const parBranche = tv >= detour && tv < retour;
      if (!parBranche) {
        if (s <= X_F - X_D) pieces.push({ x: X_D + s, y: Y, k, devie: false });
      } else if (s <= lgV) {
        pieces.push({ x: X_D + s, y: Y, k, devie: true });
      } else if (s - lgV <= Y_B - Y) {
        pieces.push({ x: X_V, y: Y + s - lgV, k, devie: true });
      } else if (s - lgV - (Y_B - Y) <= X_B - X_V) {
        pieces.push({ x: X_V + s - lgV - (Y_B - Y), y: Y_B, k, devie: true });
      }
    }
  }
  const dashTuyau = `${tuyau} 1`;
  const dashBranche = `${branche} 1`;
  const cheminM = `M${X_D} ${Y} H${X_F}`;
  const cheminB = `M${X_V} ${Y + 16} V${Y_B} H${X_B}`;
  const tuyaux = (
    <g>
      {branche > 0 ? <path d={cheminB} pathLength={1} strokeDasharray={dashBranche} fill="none" stroke={F.encre} strokeWidth={46} strokeLinejoin="round" /> : null}
      {tuyau > 0 ? <path d={cheminM} pathLength={1} strokeDasharray={dashTuyau} fill="none" stroke={F.encre} strokeWidth={46} /> : null}
      {branche > 0 ? <path d={cheminB} pathLength={1} strokeDasharray={dashBranche} fill="none" stroke={F.papier} strokeWidth={36} strokeLinejoin="round" /> : null}
      {tuyau > 0 ? <path d={cheminM} pathLength={1} strokeDasharray={dashTuyau} fill="none" stroke={F.papier} strokeWidth={36} /> : null}
      {tuyau > 0 ? <path d={`M${X_D} ${Y - 11} H${X_F}`} pathLength={1} strokeDasharray={dashTuyau} fill="none" stroke={F.filet} strokeWidth={4} strokeLinecap="round" /> : null}
    </g>
  );
  const coins = pieces.map((c) => <Piece key={c.k} x={c.x} y={c.y} r={14} />);
  const a1 = p(f, pose1 - 48, pose1);
  const a2 = p(f, pose2 - 48, pose2);
  const l1 = { x: 285, y: Y - (1 - a1) * 150 };
  const l2 = { x: X_V - (1 - a2) * 70, y: 540 + (1 - a2) * 180 };
  const angleVolet = lerp(180, 270, volet);
  return (
    <Scene>
      <LueurCible x={665} y={Y} r={84} lueur={cible * tuyau * (1 - devie)} f={f} />
      <LueurCible x={650} y={Y_B} r={70} lueur={branche * devie} f={f} />
      {tuyaux}
      {coins}
      {/* Le volet de la vanne, dans le tuyau. */}
      {tuyau >= 1 ? (
        <line x1={X_V + 18} y1={Y + 18} x2={X_V + 18 + Math.cos(rad(angleVolet)) * 36} y2={Y + 18 + Math.sin(rad(angleVolet)) * 36} stroke={F.orFonce} strokeWidth={7} strokeLinecap="round" />
      ) : null}
      {/* La vanne. */}
      <g opacity={p(f, d1 + 30, d1 + 60)}>
        <rect x={X_V - 7} y={Y - 58} width={14} height={36} fill={F.encre} />
        <g transform={`translate(${X_V} ${Y - 62}) rotate(${360 * volet})`}>
          <circle r={25} fill="none" stroke={F.argile} strokeWidth={8} />
          <path d="M-25 0 H25 M0 -25 V25" stroke={F.argile} strokeWidth={6} />
          <circle r={6} fill={F.encre} />
        </g>
      </g>
      {/* La collecte. */}
      <Coffret x={95} y={402} l={170} />
      <Libelle x={95} y={446} taille={26} graisse={600}>{LIBELLES.collecte}</Libelle>
      {/* Les deux visions. */}
      <g opacity={cible * (1 - 0.55 * devie)} transform={`translate(665 ${Y}) scale(${0.7 + 0.3 * cible}) translate(-665 ${-Y})`}>
        <Cible x={665} y={Y} r={84} couleur={F.or} />
      </g>
      <Libelle x={640} y={212} taille={26} graisse={600} opacite={p(f, d1, d1 + 25) * (1 - 0.45 * devie)}>{LIBELLES.visionEnoncee}</Libelle>
      <g opacity={branche * (1 - 0.55 * p(f, retour + 30, retour + 70))}>
        <Cible x={650} y={Y_B} r={70} couleur={F.argile} />
      </g>
      <Libelle x={650} y={826} taille={26} graisse={600} opacite={p(f, d2 + 60, d2 + 90) * (1 - 0.45 * p(f, retour + 30, retour + 70))}>{LIBELLES.propreVision}</Libelle>
      {/* Les deux loupes. */}
      <g opacity={p(f, pose1 - 48, pose1 - 26)}>
        <Loupe x={l1.x} y={l1.y} r={54} id="ch25-loupe1">
          {tuyaux}
          {coins}
        </Loupe>
        <Libelle x={l1.x} y={l1.y - 112} taille={23} graisse={600}>{LIBELLES.commissaire}</Libelle>
      </g>
      <g opacity={p(f, pose2 - 48, pose2 - 26)}>
        <Loupe x={l2.x} y={l2.y} r={54} id="ch25-loupe2">
          {tuyaux}
          {coins}
        </Loupe>
        <Libelle x={l2.x - 70} y={l2.y + 9} taille={23} graisse={600} ancre="end">{LIBELLES.accompagnateur}</Libelle>
      </g>
    </Scene>
  );
};

const ORBITE = { x: 400, y: 262, rx: 240, ry: 150 };

/** Plan 6 : les enveloppes jonglent, puis chacune retombe dans sa fente, et tout s'arrête. */
const Plan6: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1, d2] = d;
  const OMEGA = (2 * Math.PI) / 96;
  const HAUT_BOITE = 590;
  const BOITES = [
    { x: 150, teinte: F.argile, fin: Math.PI, vise: d1 + 300 },
    { x: 400, teinte: F.or, fin: Math.PI / 2, vise: d1 + 430 },
    { x: 650, teinte: F.encre2, fin: 0, vise: d2 - 8 },
  ];
  const tag = p(f, d0 + 30, d0 + 60);
  const boites = p(f, d0 + 120, d0 + 170);
  const enveloppes = BOITES.map((b, i) => {
    const phase = (i * 2 * Math.PI) / 3 + Math.PI / 2;
    const n = Math.round((b.vise * OMEGA + phase - b.fin) / (2 * Math.PI));
    const depart = (b.fin - phase + 2 * Math.PI * n) / OMEGA;
    const orbite = (g: number) => ({
      x: ORBITE.x + Math.cos(g * OMEGA + phase) * ORBITE.rx,
      y: ORBITE.y + Math.sin(g * OMEGA + phase) * ORBITE.ry,
      r: 14 * Math.sin(g * OMEGA * 2 + phase),
    });
    const t = borne((f - depart) / 34);
    const a = orbite(Math.min(f, depart));
    const x = lerp(a.x, b.x, t);
    const y = f < depart ? a.y : lerp(a.y, HAUT_BOITE - 28, t * t);
    return { ...b, x: x, xBoite: b.x, y, r: a.r * (1 - t), pose: t >= 1, depart, t };
  });
  return (
    <Scene>
      <ellipse cx={ORBITE.x} cy={ORBITE.y} rx={ORBITE.rx} ry={ORBITE.ry} fill="none" stroke={F.filet} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 18" opacity={p(f, 0, 18) * (1 - p(f, d1 + 300, d1 + 340))} />
      {/* Les fentes (l'arrière des boîtes), derrière les enveloppes. */}
      <g opacity={boites} transform={`translate(0 ${(1 - boites) * 50})`}>
        {BOITES.map((b) => (
          <rect key={b.x} x={b.x - 100} y={HAUT_BOITE - 10} width={200} height={26} rx={6} fill={F.encre} />
        ))}
      </g>
      {enveloppes.map((e) => (
        <g key={e.xBoite} transform={`translate(${e.x} ${e.y}) rotate(${e.r})`} opacity={p(f, 0, 18)}>
          <Enveloppe l={170} h={116} rabat={e.teinte} />
          <g opacity={tag}>
            <path d="M-62 -10 H52 L66 8 L52 26 H-62 Z" fill={F.papier} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
            <circle cx={50} cy={8} r={4} fill={F.encre} />
            <Libelle x={-7} y={16} taille={23} graisse={600}>{LIBELLES.fardeau}</Libelle>
          </g>
        </g>
      ))}
      {/* Le devant des boîtes, qui cache le bas de l'enveloppe posée. */}
      <g opacity={boites} transform={`translate(0 ${(1 - boites) * 50})`}>
        {enveloppes.map((e) => {
          const fait = p(f, e.depart + 30, e.depart + 44);
          return (
            <g key={e.xBoite}>
              <rect x={e.xBoite - 110} y={HAUT_BOITE} width={220} height={230} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
              <rect x={e.xBoite - 110} y={HAUT_BOITE} width={220} height={26} rx={6} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
              <rect x={e.xBoite - 84} y={HAUT_BOITE + 66} width={168} height={96} rx={6} fill={F.papier} stroke={fait > 0 ? F.or : F.encre} strokeWidth={3 + 3 * fait} />
              <rect x={e.xBoite - 42} y={HAUT_BOITE + 80} width={84} height={10} rx={5} fill={e.teinte} stroke={F.encre} strokeWidth={2} />
              <Libelle x={e.xBoite} y={HAUT_BOITE + 134} taille={28} graisse={600}>{LIBELLES.dessein}</Libelle>
            </g>
          );
        })}
      </g>
      <line x1={20} x2={780} y1={HAUT_BOITE + 230 + (1 - boites) * 50} y2={HAUT_BOITE + 230 + (1 - boites) * 50} stroke={F.encre} strokeWidth={5} strokeLinecap="round" opacity={boites} />
    </Scene>
  );
};

/** Une enveloppe ouverte : le dos et le rabat levé (le devant se dessine à part). */
const DosOuvert: React.FC<{ l: number; h: number }> = ({ l, h }) => (
  <g>
    <path d={`M${-l / 2} ${-h / 2} L0 ${-h / 2 - 84} L${l / 2} ${-h / 2} Z`} fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-l / 2} y={-h / 2} width={l} height={h} rx={4} fill={F.filet} stroke={F.encre} strokeWidth={4} />
  </g>
);
const DevantOuvert: React.FC<{ l: number; h: number }> = ({ l, h }) => (
  <path d={`M${-l / 2} ${-h / 2 + 6} L0 ${h * 0.12} L${l / 2} ${-h / 2 + 6} V${h / 2} H${-l / 2} Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
);

const BOUFFEES = [
  { x: -92, y: 22, r: 44 },
  { x: -46, y: -22, r: 52 },
  { x: 16, y: -36, r: 60 },
  { x: 76, y: -6, r: 48 },
  { x: 108, y: 28, r: 36 },
  { x: 8, y: 26, r: 56 },
];

/** Plan 7 : le nuage de soupçons plane ; la feuille se remplit, il se dissipe ; elle glisse vers ceux qui ont donné. */
const Plan7: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1, d2] = d;
  const LIGNES = 7;
  const fin = d2 + 195;
  const rempli = (i: number) => p(f, d2 + 15 + (i * (fin - d2 - 15)) / LIGNES, d2 + 15 + ((i + 1) * (fin - d2 - 15)) / LIGNES);
  const dissipe = borne((f - (d2 + 15)) / (fin - d2 - 15));
  const glisse = p(f, fin + 5, fin + 65);
  const nuage = p(f, d1 + 10, d1 + 100);
  const cx = 220 + Math.sin(f / 40) * 14;
  const cy = 135 + Math.sin(f / 27) * 5;
  const pluie = nuage * (1 - p(f, d2 + 15, d2 + 90));
  const sx = lerp(220, 560, glisse);
  const sy = lerp(440, 525, glisse);
  const PILE = [
    { x: 556, y: 711, r: -1.6, a: d0 - 25 },
    { x: 566, y: 700, r: 1.3, a: d0 + 2 },
    { x: 552, y: 684, r: -0.9, a: d0 + 28 },
    { x: 562, y: 668, r: 0.8, a: d0 + 54 },
  ];
  const HAUT = { x: 560, y: 650 };
  const dernier = p(f, d0 + 80, d0 + 102);
  const satisfait = p(f, fin + 62, fin + 100);
  return (
    <Scene>
      {/* La pile d'enveloppes ouvertes. */}
      <line x1={370} x2={770} y1={806} y2={806} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
      {PILE.map((e, i) => {
        const o = p(f, e.a, e.a + 22);
        return (
          <g key={i} opacity={o} transform={`translate(${e.x} ${e.y - (1 - o) * 70}) rotate(${e.r})`}>
            <DosOuvert l={310} h={176} />
            <DevantOuvert l={310} h={176} />
          </g>
        );
      })}
      {satisfait > 0
        ? Array.from({ length: 9 }, (_, i) => {
            const a = rad(-170 + i * 20);
            return <line key={i} x1={HAUT.x + Math.cos(a) * 215} y1={500 + Math.sin(a) * 215} x2={HAUT.x + Math.cos(a) * (215 + 26 * satisfait)} y2={500 + Math.sin(a) * (215 + 26 * satisfait)} stroke={F.or} strokeWidth={6} strokeLinecap="round" opacity={satisfait} />;
          })
        : null}
      <g opacity={dernier} transform={`translate(${HAUT.x} ${HAUT.y - (1 - dernier) * 70})`}>
        <DosOuvert l={310} h={176} />
      </g>
      {/* La feuille. */}
      <g transform={`translate(${sx} ${sy}) rotate(${lerp(-2, 0, glisse)})`}>
        <rect x={-130} y={-175} width={260} height={350} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <Libelle x={0} y={-132} taille={28} graisse={600} opacite={p(f, d2, d2 + 20)}>{LIBELLES.compteRendu}</Libelle>
        <line x1={-104} x2={104} y1={-114} y2={-114} stroke={F.encre} strokeWidth={3} opacity={p(f, d2, d2 + 20)} />
        {Array.from({ length: LIGNES }, (_, i) => {
          const r = rempli(i);
          const y = -82 + i * 38;
          return (
            <g key={i}>
              <line x1={-104} x2={104} y1={y} y2={y} stroke={F.filet} strokeWidth={3} />
              <circle cx={-96} cy={y - 2} r={7} fill={F.or} stroke={F.encre} strokeWidth={2} opacity={r > 0 ? 1 : 0} />
              {r > 0 ? <line x1={-78} x2={-78 + r * (120 + ((i * 53) % 60))} y1={y - 2} y2={y - 2} stroke={F.encre2} strokeWidth={7} strokeLinecap="round" /> : null}
            </g>
          );
        })}
      </g>
      <g opacity={dernier} transform={`translate(${HAUT.x} ${HAUT.y - (1 - dernier) * 70})`}>
        <DevantOuvert l={310} h={176} />
      </g>
      <Libelle x={560} y={856} taille={26} graisse={600} opacite={p(f, d0 + 30, d0 + 70)}>{LIBELLES.donateurs}</Libelle>
      {/* La bruine. */}
      {pluie > 0
        ? Array.from({ length: 9 }, (_, i) => {
            const t = ((f * 1.6 + i * 37) % 80) / 80;
            return <line key={i} x1={cx - 104 + i * 26} x2={cx - 104 + i * 26 - 3} y1={200 + t * 46} y2={212 + t * 46} stroke={F.encre2} strokeWidth={4} strokeLinecap="round" opacity={pluie * (1 - t)} />;
          })
        : null}
      {/* Le nuage : chaque bouffée s'envole et s'efface à son tour. */}
      {nuage > 0 ? (
        <g opacity={nuage * (1 - p(f, d2 + 140, d2 + 192))}>
          {BOUFFEES.map((b, i) => {
            const q = borne(dissipe * 1.3 - i * 0.06);
            const r = b.r * nuage * (1 - q);
            return r > 0.5 ? <circle key={i} cx={cx + b.x * nuage + b.x * q * 0.5} cy={cy + b.y * nuage - q * 30} r={r} fill={F.encre2} /> : null;
          })}
          <rect x={cx - 76} y={cy - 22} width={164} height={56} rx={28} fill={F.encre2} />
          <Libelle x={cx + 6} y={cy + 16} taille={27} graisse={600} couleur={F.papier}>{LIBELLES.soupcons}</Libelle>
        </g>
      ) : null}
    </Scene>
  );
};

/** Trois objets dessinés sur leur base : (0, 0) est le milieu du bas. */
const Cahier: React.FC = () => (
  <g>
    <rect x={-85} y={-220} width={170} height={220} rx={6} fill={F.argile} stroke={F.encre} strokeWidth={4} />
    <rect x={-85} y={-220} width={30} height={220} rx={6} fill={F.encre} opacity={0.35} />
    <rect x={-42} y={-186} width={108} height={76} rx={4} fill={F.papier} stroke={F.encre} strokeWidth={3} />
    {[-166, -148, -130].map((y) => (
      <line key={y} x1={-30} x2={54} y1={y} y2={y} stroke={F.encre2} strokeWidth={3} />
    ))}
    <rect x={-85 + 170 - 4} y={-212} width={6} height={204} fill={F.papier} stroke={F.encre} strokeWidth={2} />
  </g>
);
const Coffre: React.FC = () => (
  <g>
    <rect x={-115} y={-112} width={230} height={112} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <rect x={-115} y={-170} width={230} height={62} rx={8} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
    {[-80, 80].map((x) => (
      <rect key={x} x={x - 9} y={-170} width={18} height={170} fill={F.orClair} stroke={F.encre} strokeWidth={2.5} />
    ))}
    <rect x={-26} y={-128} width={52} height={52} rx={6} fill={F.or} stroke={F.encre} strokeWidth={3} />
    <circle cx={0} cy={-108} r={7} fill={F.encre} />
    <rect x={-3} y={-108} width={6} height={18} fill={F.encre} />
  </g>
);
const Tampon: React.FC = () => (
  <g>
    <rect x={-75} y={-18} width={150} height={18} rx={3} fill={F.encre} />
    <rect x={-66} y={-46} width={132} height={28} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <path d="M-20 -46 Q-16 -80 -26 -98 H26 Q16 -80 20 -46 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <ellipse cx={0} cy={-124} rx={42} ry={34} fill={F.argile} stroke={F.encre} strokeWidth={4} />
  </g>
);

const FENTE = [0, 10, -8, 7, -4];
const couture = (x: number, y: number, h: number) => FENTE.map((dx, i) => `${x + dx} ${y + (i * h) / (FENTE.length - 1)}`);

/** Plan 8 : tout sur un seul socle ; le socle se fend en trois, et chaque objet part sur le sien. */
const Plan8: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1] = d;
  const fend = p(f, d1 - 55, d1 - 8);
  const ecarte = p(f, d1 + 2, d1 + 32);
  const penche = p(f, d0 + 60, d0 + 240) * (1 - p(f, d1 - 40, d1 - 8));
  const angle = Math.sin(f / 21) * 2.2 * penche;
  const a = d1 + 45;
  const c = d1 + 255;
  const leve = p(f, d1 + 300, d1 + 348);
  const SOCLE = 650;
  const cahierX = lerp(400, 136, p(f, a, a + 48));
  const cahierY = lerp(480, SOCLE, p(f, a + 34, a + 62)) - 26 * Math.sin(Math.PI * borne((f - a) / 34));
  const tamponX = lerp(400, 664, p(f, c, c + 48));
  const tamponChute = borne((f - (a + 24)) / 15);
  const tamponY = lerp(lerp(260, 480, tamponChute * tamponChute), SOCLE, p(f, c + 34, c + 62)) - 26 * Math.sin(Math.PI * borne((f - c) / 34));
  const argent = p(f, d1 + 135, d1 + 170);
  const coup = Math.sin(Math.PI * borne((f - (c + 68)) / 16));
  const liens = p(f, d1 + 320, d1 + 375);
  const pieces = [
    { g: 40, dr: 280, dx: -24 * ecarte, l: LIBELLES.cahiers, o: p(f, a + 40, a + 65) },
    { g: 280, dr: 520, dx: 0, l: LIBELLES.argent, o: argent },
    { g: 520, dr: 760, dx: 24 * ecarte, l: LIBELLES.depenses, o: p(f, c + 40, c + 65) },
  ];
  const H = 80;
  return (
    <Scene>
      <g transform={`translate(0 ${-85 * leve})`}>
        <line x1={0} x2={800} y1={SOCLE + H} y2={SOCLE + H} stroke={F.encre} strokeWidth={5} opacity={1} />
        {/* Le socle. */}
        {ecarte > 0 ? (
          pieces.map((m, i) => {
            const gauche = i === 0 ? [`${m.g} ${SOCLE}`, `${m.g} ${SOCLE + H}`] : couture(m.g, SOCLE, H).reverse();
            const droite = i === 2 ? [`${m.dr} ${SOCLE}`, `${m.dr} ${SOCLE + H}`] : couture(m.dr, SOCLE, H);
            const points = i === 0 ? [gauche[0], ...droite, gauche[1]] : [...gauche.slice().reverse(), ...droite.slice().reverse()];
            return <polygon key={i} points={points.join(' ')} fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" transform={`translate(${m.dx} 0)`} />;
          })
        ) : (
          <g>
            <rect x={40} y={SOCLE} width={720} height={H} fill={F.filet} stroke={F.encre} strokeWidth={4} />
            {[280, 520].map((x) => (
              <polyline key={x} points={couture(x, SOCLE, H).join(' ')} pathLength={1} strokeDasharray={`${fend} 1`} fill="none" stroke={F.encre} strokeWidth={4} opacity={fend > 0 ? 1 : 0} />
            ))}
          </g>
        )}
        {pieces.map((m) => (
          <Libelle key={m.l} x={(m.g + m.dr) / 2 + m.dx} y={SOCLE + 50} taille={28} graisse={600} opacite={m.o}>{m.l}</Libelle>
        ))}
        {/* Les traits fins qui relient les trois. */}
        {liens > 0 ? (
          <g fill="none" stroke={F.encre2} strokeWidth={2.5}>
            <path d={`M136 ${SOCLE - 232} C136 ${SOCLE - 330} 400 ${SOCLE - 330} 400 ${SOCLE - 182}`} pathLength={1} strokeDasharray={`${liens} 1`} />
            <path d={`M400 ${SOCLE - 182} C400 ${SOCLE - 330} 664 ${SOCLE - 330} 664 ${SOCLE - 170}`} pathLength={1} strokeDasharray={`${liens} 1`} />
            <circle cx={136} cy={SOCLE - 232} r={7} fill={F.or} stroke={F.encre} opacity={liens} />
            <circle cx={400} cy={SOCLE - 182} r={7} fill={F.or} stroke={F.encre} opacity={liens} />
            <circle cx={664} cy={SOCLE - 170} r={7} fill={F.or} stroke={F.encre} opacity={liens} />
          </g>
        ) : null}
        {/* Les objets, sur le même pied puis chacun sur le sien. */}
        <g transform={`rotate(${angle} 400 ${SOCLE})`}>
          <g transform={`translate(400 ${SOCLE})`}>
            <Coffre />
          </g>
          <g transform={`translate(${cahierX} ${cahierY})`}>
            <Cahier />
          </g>
          <g transform={`translate(${tamponX} ${tamponY - coup * 34})`}>
            <Tampon />
          </g>
        </g>
      </g>
    </Scene>
  );
};

const CENTRE = { x: 400, y: 450 };
const SERRE = { x: 400, y: 505 };
const FILS = Array.from({ length: 12 }, (_, i) => {
  const a = rad(15 + i * 30);
  const A = { x: CENTRE.x + Math.cos(a) * 352, y: CENTRE.y + Math.sin(a) * 396 };
  const M = { x: CENTRE.x + Math.cos(a) * 240, y: CENTRE.y + Math.sin(a) * 280 };
  return { A, M };
});
const PLAQUES = [
  { x: 400, y: 300, l: 176, mot: LIBELLES.integrite, fils: [8, 9, 7, 10] },
  { x: 260, y: 582, l: 150, mot: LIBELLES.dessein, fils: [3, 4, 5, 6] },
  { x: 540, y: 582, l: 240, mot: LIBELLES.compteRendu, fils: [0, 1, 2, 11] },
];

/** Plan 9 : le cadenas au centre de la toile se fissure, s'ouvre, et la toile devient un réseau ; trois mots s'allument. */
const Plan9: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1, d2, d3] = d;
  const tire = p(f, d0 + 30, d0 + 260);
  const serre = p(f, d2 + 10, d2 + 120);
  const fissure = p(f, d1 + 110, d1 + 220);
  const lueur = p(f, d1 + 200, d1 + 300);
  const ouvre = p(f, d3 - 15, d3 + 45);
  const part = p(f, d3 + 40, d3 + 110);
  const trem = serre * (1 - ouvre) * Math.sin(f / 2.2) * 1.6;
  const q = (i: number) => p(f, d3 + 25 + i * 4, d3 + 95 + i * 4);
  const liens = p(f, d3 + 70, d3 + 135);
  const plaques = p(f, d3 + 90, d3 + 125);
  const allume = [p(f, d3 + 165, d3 + 190), p(f, d3 + 225, d3 + 250), p(f, d3 + 285, d3 + 310)];
  const point = (A: { x: number; y: number }, t: number) => ({ x: lerp(A.x, SERRE.x, t), y: lerp(A.y, SERRE.y, t) });
  const anneau = (t: number) => FILS.map((n) => { const m = point(n.A, t); return `${m.x} ${m.y}`; }).join(' ');
  const epais = 3 + 1.6 * serre * (1 - part);
  return (
    <Scene>
      {/* La toile : les anneaux qui se resserrent. */}
      <g opacity={1 - part}>
        {[0.2, 0.42 + 0.06 * tire].map((t) => (
          <polygon key={t < 0.3 ? 'a' : 'b'} points={anneau(t)} fill="none" stroke={F.filet} strokeWidth={3} />
        ))}
      </g>
      {/* Le réseau final. */}
      {liens > 0 ? (
        <g opacity={liens} stroke={F.encre2} strokeWidth={2.5}>
          {FILS.map((n, i) => {
            const s = FILS[(i + 1) % FILS.length];
            return <line key={i} x1={n.M.x} y1={n.M.y} x2={s.M.x} y2={s.M.y} />;
          })}
          {PLAQUES.map((c) => c.fils.map((i) => <line key={`${c.mot}-${i}`} x1={FILS[i].M.x} y1={FILS[i].M.y} x2={c.x} y2={c.y} />))}
          {PLAQUES.map((c, i) => {
            const s = PLAQUES[(i + 1) % 3];
            return <line key={c.mot} x1={c.x} y1={c.y} x2={s.x} y2={s.y} stroke={F.or} strokeWidth={4} />;
          })}
        </g>
      ) : null}
      {/* Les fils et leurs nœuds. */}
      {FILS.map((n, i) => {
        const t = q(i);
        const enHaut = i === 8 || i === 9;
        const aCoin = i === 1 || i === 4 || i === 7 || i === 10;
        const pris = point(n.A, enHaut ? 0.14 * tire + 0.06 * serre : aCoin ? 0.22 * tire + 0.08 * serre : 0.34 * tire + 0.1 * serre);
        const noeud = { x: lerp(pris.x, n.M.x, t), y: lerp(pris.y, n.M.y, t) };
        const bout = { x: lerp(SERRE.x, n.M.x, t), y: lerp(SERRE.y, n.M.y, t) };
        return (
          <g key={i}>
            <line x1={n.A.x} y1={n.A.y} x2={bout.x} y2={bout.y} stroke={t > 0.5 ? F.encre2 : F.encre} strokeWidth={lerp(epais, 2.5, t)} />
            <circle cx={n.A.x} cy={n.A.y} r={8} fill={F.encre} />
            <circle cx={noeud.x} cy={noeud.y} r={lerp(11, 12, t)} fill={F.or} stroke={F.encre} strokeWidth={3} />
          </g>
        );
      })}
      {/* Le cadenas. */}
      {part < 1 ? (
        <g opacity={1 - part} transform={`translate(${trem} 0)`}>
          <circle cx={400} cy={510} r={150 + 90 * ouvre} fill={F.orClair} opacity={0.55 * ouvre} />
          <g transform={`translate(0 ${-34 * ouvre}) rotate(${-38 * ouvre} 500 400)`}>
            <path d="M300 410 V320 A100 100 0 0 1 500 320 V410" fill="none" stroke={F.encre} strokeWidth={48} />
            <path d="M300 410 V320 A100 100 0 0 1 500 320 V410" fill="none" stroke={F.encre2} strokeWidth={28} />
          </g>
          <path transform={`translate(${-44 * ouvre - part * 30} ${part * 20}) rotate(${-5 * ouvre} 400 640)`} d="M258 400 Q250 400 250 408 V642 Q250 650 258 650 H398 L412 610 L390 565 L416 515 L392 470 L410 435 L400 400 Z" fill={F.encre} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          <path transform={`translate(${44 * ouvre + part * 30} ${part * 20}) rotate(${5 * ouvre} 400 640)`} d="M542 400 Q550 400 550 408 V642 Q550 650 542 650 H398 L412 610 L390 565 L416 515 L392 470 L410 435 L400 400 Z" fill={F.encre} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          {ouvre < 0.5 ? (
            <g opacity={1 - ouvre * 2}>
              <circle cx={400} cy={505} r={52} fill={F.or} stroke={F.orClair} strokeWidth={4} />
              <circle cx={400} cy={490} r={16} fill={F.encre} />
              <path d="M392 496 L384 540 H416 L408 496 Z" fill={F.encre} />
            </g>
          ) : null}
          {/* La fissure qui laisse passer la lumière. */}
          {fissure > 0 ? (
            <polyline points="400 400 410 435 392 470 416 515 390 565 412 610 398 650" pathLength={1} strokeDasharray={`${fissure} 1`} fill="none" stroke={F.orClair} strokeWidth={5 + 6 * lueur} strokeLinejoin="round" opacity={1 - ouvre} />
          ) : null}
        </g>
      ) : null}
      {/* Les trois mots qui s'allument. */}
      {PLAQUES.map((c, i) => (
        <g key={c.mot} opacity={plaques}>
          <rect x={c.x - c.l / 2 - 8 * allume[i]} y={c.y - 34 - 8 * allume[i]} width={c.l + 16 * allume[i]} height={68 + 16 * allume[i]} rx={34 + 8 * allume[i]} fill={F.orClair} opacity={0.5 * allume[i]} />
          <rect x={c.x - c.l / 2} y={c.y - 34} width={c.l} height={68} rx={34} fill={allume[i] > 0 ? F.orClair : F.papier} stroke={allume[i] > 0 ? F.orFonce : F.encre2} strokeWidth={3 + 2 * allume[i]} />
          <text x={c.x} y={c.y + 11} textAnchor="middle" fontFamily={PoliceF.sans} fontSize={31} fontWeight={600} fill={F.encre} opacity={0.5 + 0.5 * allume[i]}>{c.mot}</text>
        </g>
      ))}
    </Scene>
  );
};

/** Plan 10 : le thermomètre plein, le coffret à son pied. */
const Fin: React.FC<PropsIllustration> = ({ f }) => {
  const plein = p(f, 0, 70);
  const lueur = p(f, 66, 110);
  return (
    <Scene>
      <circle cx={280} cy={118} r={52 + 30 * lueur} fill={F.orClair} opacity={0.5 * lueur} />
      <Rayons x={280} y={150} r1={56} r2={118} o={lueur} debut={-155} fin={-25} n={9} f={f} />
      <Thermometre x={280} y={150} h={500} l={72} niveau={0.72 + 0.28 * plein} />
      <line x1={120} x2={720} y1={781} y2={781} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
      {[0, 1, 2].map((i) => {
        const t = borne((f - 6 - i * 20) / 30);
        return t > 0 && t < 1 ? <Piece key={i} x={lerp(530, 300, t)} y={lerp(620, 690, t) - Math.sin(t * Math.PI) * 120} r={18} /> : null;
      })}
      <Coffret x={530} y={772} l={220} />
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: Ouverture,
  p2: Plan2,
  p3: Plan3,
  p4: Plan4,
  p5: Plan5,
  p6: Plan6,
  p7: Plan7,
  p8: Plan8,
  p9: Plan9,
  fin: Fin,
};
