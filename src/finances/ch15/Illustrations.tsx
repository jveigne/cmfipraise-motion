import React from 'react';
import { Coeur, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lineaire = (f: number, a: number, b: number) => Math.max(0, Math.min(1, (f - a) / (b - a)));

/** Une goutte dorée, pointe vers le haut. */
const Goutte: React.FC<{ x: number; y: number; s: number; opacite?: number }> = ({ x, y, s, opacite = 1 }) => (
  <path
    d={`M${x} ${y - s * 1.5} C${x + s} ${y - s * 0.2} ${x + s} ${y + s} ${x} ${y + s} C${x - s} ${y + s} ${x - s} ${y - s * 0.2} ${x} ${y - s * 1.5} Z`}
    fill={F.or}
    stroke={F.orFonce}
    strokeWidth={2}
    opacity={opacite}
  />
);

/** La coupe du chapitre : `y` est le niveau du bord, `niveau` va de 0 à 1 (au-delà de 0,99, le liquide bombe). */
const Coupe: React.FC<{ id: string; x: number; y: number; w: number; h: number; tige: number; niveau: number }> = ({ id, x, y, w, h, tige, niveau }) => {
  const bol = `M${x - w / 2} ${y} C${x - w / 2} ${y + h * 0.62} ${x - w * 0.24} ${y + h} ${x} ${y + h} C${x + w * 0.24} ${y + h} ${x + w / 2} ${y + h * 0.62} ${x + w / 2} ${y} Z`;
  const haut = y + h * (1 - niveau);
  const trait = Math.max(3, w * 0.025);
  const piedL = w * 0.32;
  const piedH = Math.max(8, h * 0.11);
  return (
    <g>
      <rect x={x - w * 0.045} y={y + h - 3} width={w * 0.09} height={tige + 5} fill={F.orClair} stroke={F.encre} strokeWidth={trait * 0.8} />
      <path d={`M${x - piedL} ${y + h + tige + piedH} Q${x} ${y + h + tige - piedH * 0.7} ${x + piedL} ${y + h + tige + piedH} Z`} fill={F.orClair} stroke={F.encre} strokeWidth={trait * 0.8} strokeLinejoin="round" />
      <clipPath id={id}>
        <path d={bol} />
      </clipPath>
      <path d={bol} fill={F.papier} />
      <g clipPath={`url(#${id})`}>
        {niveau > 0 ? <rect x={x - w / 2} y={haut} width={w} height={h * niveau + 2} fill={F.or} /> : null}
        {niveau > 0 ? <rect x={x - w / 2} y={haut} width={w} height={Math.min(5, h * niveau)} fill={F.orClair} /> : null}
      </g>
      {niveau > 0.99 ? <path d={`M${x - w / 2 + 2} ${y} Q${x} ${y - h * 0.13} ${x + w / 2 - 2} ${y} Z`} fill={F.orClair} stroke={F.orFonce} strokeWidth={2} /> : null}
      <path d={bol} fill="none" stroke={F.encre} strokeWidth={trait} strokeLinejoin="round" />
      <line x1={x - w / 2 - 4} x2={x + w / 2 + 4} y1={y} y2={y} stroke={F.encre} strokeWidth={trait + 2} strokeLinecap="round" />
    </g>
  );
};

/** Le trop-plein : passe par-dessus le bord en `x`, puis tombe jusqu'à `y1`. `t` le fait descendre. */
const Filet: React.FC<{ x: number; y0: number; y1: number; sens: number; f: number; t: number }> = ({ x, y0, y1, sens, f, t }) => {
  if (t <= 0) return null;
  const bas = lerp(y0 + 10, y1, t);
  const d = `M${x} ${y0 - 3} Q${x + sens * 11} ${y0 - 5} ${x + sens * 12} ${y0 + 10} L${x + sens * 12} ${bas}`;
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={F.orClair} strokeWidth={9} />
      <path d={d} stroke={F.or} strokeWidth={5} strokeDasharray="16 12" strokeDashoffset={-f * 1.6} />
    </g>
  );
};

/** Rayons très simples venus du haut. */
const Rayons: React.FC<{ x: number; y: number; bas: number; largeur: number; n: number; opacite: number }> = ({ x, y, bas, largeur, n, opacite }) => (
  <g opacity={opacite}>
    {Array.from({ length: n }, (_, i) => {
      const u = n === 1 ? 0 : i / (n - 1) - 0.5;
      const c = x + u * 2 * largeur;
      const e = (largeur / n) * 0.62;
      const h = x + u * largeur * 0.5;
      return <path key={i} d={`M${h - e * 0.25} ${y} L${h + e * 0.25} ${y} L${c + e} ${bas} L${c - e} ${bas} Z`} fill={F.orClair} />;
    })}
  </g>
);

/** Plan 1 : une goutte tombe dans la coupe vide. */
const IlluOuvertureCoupe: React.FC<PropsIllustration> = ({ f }) => {
  const chute = lineaire(f, 58, 96);
  const impact = lineaire(f, 96, 136);
  const niveau = 0.1 * p(f, 96, 130);
  const X = 400;
  const BORD = 340;
  return (
    <Scene>
      <Rayons x={X} y={0} bas={770} largeur={300} n={7} opacite={0.26 * p(f, 0, 50)} />
      <line x1={60} x2={740} y1={770} y2={770} stroke={F.filet} strokeWidth={4} />
      <Coupe id="c15-ouv" x={X} y={BORD} w={340} h={250} tige={150} niveau={niveau} />
      {chute > 0 && chute < 1 ? <Goutte x={X} y={lerp(40, BORD + 225, chute * chute)} s={17} /> : null}
      {impact > 0 && impact < 1 ? <ellipse cx={X} cy={BORD + 226} rx={16 + impact * 60} ry={2 + impact * 7} fill="none" stroke={F.orFonce} strokeWidth={3} opacity={1 - impact} /> : null}
    </Scene>
  );
};

const VP = { x: 520, y: 400 };

/** La voiture vue de l'arrière, à sa place la plus proche ; l'éloignement est une échelle vers le point de fuite. */
const VoitureArgent: React.FC<{ s: number; lueur: number }> = ({ s, lueur }) => (
  <g transform={`translate(${VP.x} ${VP.y}) scale(${s}) translate(${-VP.x} ${-VP.y})`}>
    {[415, 712].map((x) => (
      <rect key={x} x={x - 24} y={728} width={48} height={72} rx={8} fill={F.encre} />
    ))}
    <rect x={400} y={728} width={326} height={22} fill={F.encre} />
    {[432, 694].map((x) => (
      <circle key={x} cx={x} cy={762} r={15} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
    ))}
    <path d="M396 730 V470 Q396 410 563 400 Q730 410 730 470 V730 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
    <path d="M396 470 Q396 410 563 400 Q730 410 730 470 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
    {[445, 563, 681].map((x, i) => (
      <g key={x}>
        <rect x={x - 42} y={492} width={84} height={120} rx={8} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
        <rect x={x - 42} y={492} width={84} height={120} rx={8} fill={F.papier} opacity={0.65 * (1 - lueur)} />
        <Piece x={x} y={574 - (i === 1 ? 16 : 0)} r={24} opacite={lueur} />
      </g>
    ))}
    <rect x={426} y={638} width={274} height={72} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={4} />
  </g>
);

/** Une volute : une courbe qui s'écrit de bas en haut, puis monte et s'efface. */
const Volute: React.FC<{ x: number; y: number; t: number; o: number; miroir: number }> = ({ x, y, t, o, miroir }) => (
  <path
    transform={`translate(${x} ${y - t * 46}) scale(${miroir} 1)`}
    d="M0 0 C-34 -36 32 -68 2 -104 C-24 -134 24 -160 18 -188 C14 -208 -10 -204 -6 -188"
    pathLength={100}
    strokeDasharray="100 100"
    strokeDashoffset={100 * (1 - Math.min(1, t * 1.8))}
    fill="none"
    stroke={F.or}
    strokeWidth={6}
    strokeLinecap="round"
    opacity={o}
  />
);

/** Plan 2 : l'aiguille passe l'heure du rendez-vous, la voiture part, le parfum s'efface, le quai reste vide. */
const IlluQuai: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const rv = d[1];
  const aiguille = f < rv ? -66 * (1 - lineaire(f, 0, rv)) : 118 * lineaire(f, rv, duree);
  const retard = p(f, rv + 40, rv + 70);
  // « certains ont vu l'argent s'en aller » : la voiture part à la fin de la première moitié de la phrase.
  const depart = rv + 90;
  const t = lineaire(f, depart, depart + 190);
  const s = 1 / (1 + 14 * t * t);
  const presente = 1 - p(f, depart + 205, depart + 255);
  // Le mot rétrécit avec son panneau et s'efface tant qu'il se lit encore (corps d'environ 20 px à la fin).
  const motO = 1 - p(f, depart + 38, depart + 62);
  const volute = depart + 145;
  const voluteFin = 1 - p(f, volute + 130, volute + 185);
  const CX = 170;
  const CY = 180;
  const R = 122;
  const pointe = (angle: number, r: number) => ({ x: CX + Math.sin((angle * Math.PI) / 180) * r, y: CY - Math.cos((angle * Math.PI) / 180) * r });
  const fin = pointe(aiguille, R - 22);
  const secteur = pointe(aiguille, R - 10);
  return (
    <Scene>
      <line x1={15} x2={785} y1={VP.y} y2={VP.y} stroke={F.filet} strokeWidth={3} />
      {/* La voie. */}
      <path d={`M340 860 L${VP.x} ${VP.y} L770 860 Z`} fill={F.filet} opacity={0.55} />
      {Array.from({ length: 10 }, (_, i) => {
        const u = 1 / (1 + (i + 1) * 0.62);
        const y = VP.y + 460 * u;
        return <line key={i} x1={VP.x - 140 * u} x2={VP.x + 240 * u} y1={y} y2={y} stroke={F.cuirClair} strokeWidth={Math.max(2, 13 * u)} />;
      })}
      <line x1={400} y1={860} x2={VP.x} y2={VP.y} stroke={F.encre} strokeWidth={6} />
      <line x1={739} y1={860} x2={VP.x} y2={VP.y} stroke={F.encre} strokeWidth={6} />
      {/* Le quai. */}
      <path d={`M15 860 V${VP.y} H${VP.x} L340 860 Z`} fill={F.papier} />
      {[60, 190].map((x) => (
        <line key={x} x1={x} y1={860} x2={VP.x} y2={VP.y} stroke={F.filet} strokeWidth={3} />
      ))}
      {[470, 560, 700].map((y) => (
        <line key={y} x1={15} x2={VP.x + (340 - VP.x) * ((y - VP.y) / 460)} y1={y} y2={y} stroke={F.filet} strokeWidth={3} />
      ))}
      <path d={`M340 860 L${VP.x} ${VP.y} L372 860 Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      <line x1={306} y1={860} x2={VP.x - 2} y2={VP.y + 6} stroke={F.or} strokeWidth={7} strokeDasharray="18 14" />
      <line x1={15} x2={340} y1={860} y2={860} stroke={F.encre} strokeWidth={4} />
      {/* L'horloge sur son pied. */}
      <rect x={CX - 11} y={CY + R} width={22} height={420} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      <path d={`M${CX - 62} 744 Q${CX} 694 ${CX + 62} 744 Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={CX} cy={CY} r={R + 12} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <circle cx={CX} cy={CY} r={R} fill={F.papier} stroke={F.encre} strokeWidth={3} />
      {aiguille > 0 ? (
        <path
          d={`M${CX} ${CY} L${CX} ${CY - R + 10} A${R - 10} ${R - 10} 0 ${aiguille > 180 ? 1 : 0} 1 ${secteur.x} ${secteur.y} Z`}
          fill={F.argile}
          opacity={0.32}
        />
      ) : null}
      {Array.from({ length: 12 }, (_, i) => {
        const a = pointe(i * 30, R - 6);
        const b = pointe(i * 30, R - (i % 3 === 0 ? 26 : 18));
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={F.encre} strokeWidth={i % 3 === 0 ? 6 : 3} strokeLinecap="round" />;
      })}
      <circle cx={CX} cy={CY - R + 12} r={11} fill={F.or} stroke={F.orFonce} strokeWidth={3} />
      <line x1={CX} y1={CY} x2={pointe(aiguille / 12 - 4, 62).x} y2={pointe(aiguille / 12 - 4, 62).y} stroke={F.encre} strokeWidth={10} strokeLinecap="round" />
      <line x1={CX} y1={CY} x2={fin.x} y2={fin.y} stroke={F.encre} strokeWidth={6} strokeLinecap="round" />
      <circle cx={CX} cy={CY} r={10} fill={F.or} stroke={F.encre} strokeWidth={3} />
      {/* Le panneau du rendez-vous. */}
      <rect x={24} y={324} width={292} height={50} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <Libelle x={CX} y={358} taille={24} graisse={600}>{LIBELLES.rendezVous}</Libelle>
      <g opacity={retard}>
        <rect x={72} y={428} width={196} height={50} rx={6} fill={F.argile} stroke={F.encre} strokeWidth={4} />
        <Libelle x={CX} y={462} taille={27} graisse={600} couleur={F.papier}>{LIBELLES.enRetard}</Libelle>
      </g>
      {/* La voiture. */}
      <g opacity={presente}>
        <VoitureArgent s={s} lueur={1} />
        <Libelle x={VP.x + (563 - VP.x) * s} y={VP.y + (690 - VP.y) * s} taille={46 * s} graisse={600} opacite={motO}>{LIBELLES.argent}</Libelle>
      </g>
      {/* Le parfum. */}
      {f >= volute
        ? [
            { x: 560, y: 790, a: 0, m: 1 },
            { x: 640, y: 740, a: 18, m: -1 },
            { x: 712, y: 810, a: 36, m: 1 },
          ].map((v) => {
            const t2 = lineaire(f, volute + v.a, volute + v.a + 120);
            return <Volute key={v.x} x={v.x} y={v.y} t={t2} o={voluteFin} miroir={v.m} />;
          })
        : null}
      <Libelle x={650} y={472} taille={32} graisse={600} couleur={F.orFonce} opacite={p(f, volute + 15, volute + 40) * voluteFin}>{LIBELLES.parfum}</Libelle>
    </Scene>
  );
};

const VASE =
  'M125 110 H245 C245 135 230 140 230 175 C230 215 330 240 330 350 C330 520 255 660 255 760 H115 C115 660 40 520 40 350 C40 240 140 215 140 175 C140 140 125 135 125 110 Z';

const Voiture: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <path d="M-36 8 V-4 Q-34 -9 -24 -10 L-14 -22 H12 L24 -10 Q34 -9 36 -3 V8 Z" fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
    <circle cx={-20} cy={9} r={7} fill={F.encre} />
    <circle cx={20} cy={9} r={7} fill={F.encre} />
  </g>
);

/** Plan 3 : le vase qui reçoit sans se remplir, la petite coupe qui déborde sur les autres. */
const IlluAbondance: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const [d0, d1, d2] = d;
  const niveauVase = lerp(0.045, 0.08, lineaire(f, 0, duree));
  const hautVase = 760 - niveauVase * 650;
  const auxVoitures = d2 + 158;
  const finGouttes = 1 - p(f, auxVoitures - 22, auxVoitures - 8);
  const n1 = lerp(0.08, 1, lineaire(f, d0, d1));
  const c2 = p(f, d1, d1 + 25);
  const n2 = p(f, d1 + 25, d1 + 115);
  const c3 = p(f, d1 + 115, d1 + 140);
  const n3 = p(f, d1 + 140, d2 + 70);
  const R1 = 150;
  const R2 = 430;
  const R3 = 650;
  return (
    <Scene>
      {/* Le vase. */}
      <clipPath id="c15-vase">
        <path d={VASE} />
      </clipPath>
      <path d="M92 800 Q185 712 278 800 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d={VASE} fill={F.papier} />
      <g clipPath="url(#c15-vase)">
        <path d="M30 300 Q185 340 340 300" fill="none" stroke={F.filet} strokeWidth={10} />
        <path d="M30 330 Q185 370 340 330" fill="none" stroke={F.filet} strokeWidth={4} />
        <rect x={40} y={hautVase} width={300} height={780 - hautVase} fill={F.or} />
        <rect x={40} y={hautVase} width={300} height={5} fill={F.orClair} />
      </g>
      <path d={VASE} fill="none" stroke={F.encre} strokeWidth={6} strokeLinejoin="round" />
      <line x1={118} x2={252} y1={110} y2={110} stroke={F.encre} strokeWidth={9} strokeLinecap="round" />
      {finGouttes > 0
        ? Array.from({ length: 4 }, (_, k) => {
            const T = 44;
            const u = ((f + k * 11) % T) / T;
            return <Goutte key={k} x={185} y={lerp(14, hautVase - 12, u * u)} s={11} opacite={finGouttes} />;
          })
        : null}
      {/* Les voitures tombent à leur tour, sans rien changer. */}
      {f >= auxVoitures
        ? Array.from({ length: 6 }, (_, k) => {
            const u = lineaire(f, auxVoitures + k * 28, auxVoitures + k * 28 + 44);
            if (u <= 0 || u >= 1) return null;
            return <Voiture key={k} x={185} y={lerp(18, hautVase - 8, u * u)} o={1 - p(u, 0.8, 1)} />;
          })
        : null}
      {/* La petite coupe et les coupes qu'elle remplit. */}
      {Array.from({ length: 3 }, (_, k) => {
        const T = 48;
        const u = ((f + k * 16) % T) / T;
        return <Goutte key={k} x={575} y={lerp(8, R1 + 8, u * u)} s={8} opacite={1 - p(u, 0.86, 1)} />;
      })}
      <Coupe id="c15-c1" x={575} y={R1} w={130} h={88} tige={34} niveau={n1} />
      <Coupe id="c15-c2a" x={498} y={R2} w={110} h={74} tige={30} niveau={n2} />
      <Coupe id="c15-c2b" x={652} y={R2} w={110} h={74} tige={30} niveau={n2} />
      <Coupe id="c15-c3a" x={431} y={R3} w={100} h={68} tige={28} niveau={n3} />
      <Coupe id="c15-c3b" x={575} y={R3} w={100} h={68} tige={28} niveau={n3} />
      <Coupe id="c15-c3c" x={719} y={R3} w={100} h={68} tige={28} niveau={n3} />
      <Filet x={510} y0={R1} y1={R2 + 74 * (1 - n2)} sens={-1} f={f} t={c2} />
      <Filet x={640} y0={R1} y1={R2 + 74 * (1 - n2)} sens={1} f={f} t={c2} />
      <Filet x={443} y0={R2} y1={R3 + 68 * (1 - n3)} sens={-1} f={f} t={c3} />
      <Filet x={553} y0={R2} y1={R3 + 68 * (1 - n3)} sens={1} f={f} t={c3} />
      <Filet x={597} y0={R2} y1={R3 + 68 * (1 - n3)} sens={-1} f={f} t={c3} />
      <Filet x={707} y0={R2} y1={R3 + 68 * (1 - n3)} sens={1} f={f} t={c3} />
      <Libelle x={672} y={134} taille={28} ancre="start" graisse={600} couleur={F.orFonce} opacite={p(f, d1 + 10, d1 + 35)}>{LIBELLES.deborde}</Libelle>
      {/* Les mots de la dernière phrase. */}
      <Libelle x={575} y={826} taille={27} graisse={600} opacite={p(f, d2 + 5, d2 + 30)}>{LIBELLES.prince}</Libelle>
      <Libelle x={575} y={862} taille={25} couleur={F.encre2} opacite={p(f, d2 + 65, d2 + 90)}>{LIBELLES.recolte}</Libelle>
      <Libelle x={185} y={836} taille={27} graisse={600} opacite={p(f, auxVoitures - 8, auxVoitures + 17)}>{LIBELLES.voitures}</Libelle>
      <Libelle x={185} y={872} taille={27} graisse={600} couleur={F.argile} opacite={p(f, d2 + 268, d2 + 293)}>{LIBELLES.miserable}</Libelle>
    </Scene>
  );
};

/** Un poisson de profil : `l` est sa longueur, `sens` -1 le tourne vers la gauche. */
const Poisson: React.FC<{ x: number; y: number; l: number; sens: number; couleur?: number; opacite?: number }> = ({ x, y, l, sens, couleur = 1, opacite = 1 }) => {
  const k = l / 100;
  const corps = 'M50 0 C22 -26 -16 -24 -30 0 C-16 24 22 26 50 0 Z';
  const queue = 'M-27 0 L-50 -19 L-44 0 L-50 19 Z';
  const trait = 3 / k;
  return (
    <g transform={`translate(${x} ${y}) scale(${sens * k} ${k})`} opacity={opacite}>
      <path d={queue} fill={F.papier} stroke={F.encre2} strokeWidth={trait} strokeLinejoin="round" />
      <path d={corps} fill={F.papier} stroke={F.encre2} strokeWidth={trait} />
      <g opacity={couleur}>
        <path d={queue} fill={F.orFonce} stroke={F.encre} strokeWidth={trait} strokeLinejoin="round" />
        <path d={corps} fill={F.or} stroke={F.encre} strokeWidth={trait} />
        <path d="M34 -7 C18 -19 -8 -18 -18 -6" fill="none" stroke={F.orClair} strokeWidth={5 / k} strokeLinecap="round" />
      </g>
      <path d="M14 -17 Q6 0 14 17" fill="none" stroke={couleur > 0.5 ? F.encre : F.encre2} strokeWidth={2.5 / k} />
      <circle cx={30} cy={-5} r={3.4} fill={couleur > 0.5 ? F.encre : F.encre2} />
    </g>
  );
};

const PLACES = [130, 265, 400, 535, 670];

/** Plan 4 : la table vide reçoit sous la lumière, puis le plat la fait passer de place en place. */
const IlluTable: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1] = d;
  const lumiere = p(f, 0, d0 + 60);
  const plat = p(f, d0 + 185, d0 + 225);
  const servi: Record<number, number> = {
    2: d0 + 245,
    1: d1 + 48,
    0: d1 + 102,
    3: d1 + 192,
    4: d1 + 238,
  };
  const etapes: [number, number, number][] = [
    [d1 + 8, d1 + 50, 265],
    [d1 + 66, d1 + 104, 130],
    [d1 + 120, d1 + 194, 535],
    [d1 + 208, d1 + 240, 670],
    [d1 + 252, d1 + 276, 400],
  ];
  let xPlat = 400;
  for (const [a, b, cible] of etapes) xPlat = lerp(xPlat, cible, p(f, a, b));
  const ouverture = lerp(135, 300, p(f, d1 + 10, d1 + 200));
  return (
    <Scene>
      <Rayons x={400} y={0} bas={470} largeur={ouverture} n={7} opacite={0.5 * lumiere} />
      {PLACES.map((x) => {
        const moment = PLACES.indexOf(x) === 2 ? d1 + 6 : servi[PLACES.indexOf(x)];
        const coeur = p(f, moment, moment + 22);
        return (
          <g key={x}>
            <rect x={x - 52} y={296} width={104} height={184} rx={14} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
            <rect x={x - 36} y={314} width={72} height={126} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
            {coeur > 0 ? <Coeur x={x} y={376} s={0.56 * coeur} /> : null}
          </g>
        );
      })}
      {/* La table. */}
      <path d="M70 460 H730 L770 610 H30 Z" fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {[66, 734].map((x) => (
        <rect key={x} x={x - 15} y={650} width={30} height={176} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      ))}
      <rect x={30} y={610} width={740} height={48} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <line x1={38} x2={762} y1={634} y2={634} stroke={F.orClair} strokeWidth={4} strokeDasharray="16 12" />
      <line x1={20} x2={780} y1={826} y2={826} stroke={F.encre} strokeWidth={4} />
      {PLACES.map((x, i) => {
        const c = p(f, servi[i], servi[i] + 20);
        return (
          <g key={x}>
            <ellipse cx={x} cy={506} rx={56} ry={21} fill="none" stroke={F.filet} strokeWidth={3} strokeDasharray="9 8" opacity={1 - c} />
            {c > 0 ? (
              <g opacity={c}>
                <ellipse cx={x} cy={506} rx={56 * lerp(0.8, 1, c)} ry={21 * lerp(0.8, 1, c)} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
                <ellipse cx={x} cy={506} rx={38} ry={13} fill="none" stroke={F.filet} strokeWidth={2} />
                <Poisson x={x} y={501 - (1 - c) * 26} l={76} sens={i % 2 === 0 ? 1 : -1} />
              </g>
            ) : null}
          </g>
        );
      })}
      {/* Le plat qui passe. */}
      {plat > 0 ? (
        <g opacity={plat} transform={`translate(${xPlat} ${570 - (1 - plat) * 40})`}>
          <ellipse cx={0} cy={0} rx={82} ry={24} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
          <ellipse cx={0} cy={-1} rx={68} ry={15} fill={F.or} opacity={0.45} />
          <Poisson x={-32} y={-5} l={56} sens={-1} />
          <Poisson x={32} y={-5} l={56} sens={1} />
        </g>
      ) : null}
      <Libelle x={400} y={748} taille={32} graisse={600} couleur={F.orFonce} opacite={p(f, d0 + 290, d0 + 320) * (1 - p(f, d1 - 12, d1 + 8))}>{LIBELLES.jouissions}</Libelle>
      <Libelle x={400} y={748} taille={32} graisse={600} couleur={F.orFonce} opacite={p(f, d1 + 95, d1 + 125)}>{LIBELLES.heureux}</Libelle>
    </Scene>
  );
};

/** Le crochet, dessiné autour de son attache (0, 0) : la tige, la courbe et la pointe à ardillon, ouverte à gauche. */
const FormeCrochet: React.FC = () => (
  <g>
    <path
      d="M-8 21 H8 V80 C8 136 -88 138 -88 80 L-84 50 L-62 84 L-71 82 C-70 110 -8 112 -8 78 Z"
      fill={F.encre}
      stroke={F.papier}
      strokeWidth={6}
      strokeLinejoin="round"
      paintOrder="stroke"
    />
    <path d="M-2 28 V78" fill="none" stroke={F.cuirClair} strokeWidth={3} strokeLinecap="round" />
  </g>
);

/** La cassure du crochet : ce qui reste au câble, puis les deux éclats, le long des mêmes lignes brisées. */
const COUPES_CROCHET = {
  reste: 'M-30 15 H30 V58 L12 50 L4 62 L-4 52 L-12 60 L-30 54 Z',
  tige: 'M-30 54 L-12 60 L-4 52 L4 62 L12 50 L30 58 V150 H-38 L-38 130 L-46 120 L-36 113 L-46 105 L-40 95 Z',
  pointe: 'M-38 150 V130 L-46 120 L-36 113 L-46 105 L-40 95 L-40 40 H-110 V150 Z',
};
/** Chaque éclat vole vers l'extérieur, passe au-dessus du couvercle et retombe à côté du coffre. */
const ECLATS = [
  { id: 'c15-eclat-tige', d: COUPES_CROCHET.tige, cx: -10, cy: 90, xFin: 680, yFin: 745, tours: 450 },
  { id: 'c15-eclat-pointe', d: COUPES_CROCHET.pointe, cx: -65, cy: 90, xFin: 125, yFin: 735, tours: -270 },
];
/** Le crochet s'arrête au-dessus du coffre, dans le clair ; il ne touche le couvercle qu'au moment du choc. */
const Y_ATTENTE = 250;
const Y_CHOC = 287;
const CHOC = { x: 358, y: 408 };

/** Plan 5 : le crochet descend, frappe le couvercle sur « contrainte », se brise et remonte à vide ; le coffre reste ouvert dans la lumière. */
const IlluCrochet: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1, d2] = d;
  const descente = p(f, d0 + 20, d1 - 30);
  const brise = d1 + 157;
  const remonte = p(f, brise + 20, brise + 85);
  const elan = lineaire(f, brise - 9, brise);
  const rebond = p(f, brise, brise + 10);
  const yH = lerp(118, Y_ATTENTE, descente) + (Y_CHOC - Y_ATTENTE) * elan * elan * (1 - rebond) - (Y_ATTENTE - 118) * remonte;
  const tremble = f >= d1 - 30 && f < brise ? Math.sin(f / 2.1) * lerp(0.6, 3, lineaire(f, d1 - 30, brise)) : 0;
  const xH = 400 + tremble;
  const casse = f >= brise;
  const vol = lineaire(f, brise, brise + 42);
  const eclat = lineaire(f, brise, brise + 20);
  const disparait = 1 - p(f, brise + 92, brise + 125);
  const baigne = p(f, brise + 30, d2 + 60);
  const joie = p(f, brise + 90, brise + 120);
  const battement = 1 + Math.sin(f / 13) * 0.04;
  return (
    <Scene>
      <radialGradient id="c15-lueur">
        <stop offset="0%" stopColor={F.orClair} stopOpacity={0.9} />
        <stop offset="60%" stopColor={F.orClair} stopOpacity={0.45} />
        <stop offset="100%" stopColor={F.orClair} stopOpacity={0} />
      </radialGradient>
      <Rayons x={400} y={0} bas={768} largeur={lerp(230, 330, baigne)} n={7} opacite={lerp(0.14, 0.62, baigne)} />
      <ellipse cx={400} cy={530} rx={lerp(240, 390, baigne)} ry={lerp(160, 238, baigne)} fill="url(#c15-lueur)" opacity={baigne} />
      {/* Le coffre. */}
      <path d="M220 570 L252 432 Q400 392 548 432 L580 570 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M244 566 L270 450 Q400 416 530 450 L556 566 Z" fill={F.cuir} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Piece key={i} x={270 + i * 65} y={552} r={36} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Piece key={i} x={302 + i * 65} y={528} r={34} />
      ))}
      {[0, 1, 2].map((i) => {
        const o = 0.5 + 0.5 * Math.sin(f / 9 + i * 2.1);
        const x = [292, 432, 512][i];
        const y = [512, 500, 516][i];
        return <path key={i} d={`M${x} ${y - 16} L${x + 4} ${y - 4} L${x + 16} ${y} L${x + 4} ${y + 4} L${x} ${y + 16} L${x - 4} ${y + 4} L${x - 16} ${y} L${x - 4} ${y - 4} Z`} fill={F.papier} opacity={o * baigne} />;
      })}
      <rect x={212} y={566} width={376} height={200} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={204} y={560} width={392} height={26} rx={6} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {[272, 528].map((x) => (
        <rect key={x} x={x - 14} y={586} width={28} height={180} fill={F.orFonce} stroke={F.encre} strokeWidth={3} />
      ))}
      <rect x={366} y={586} width={68} height={70} rx={6} fill={F.or} stroke={F.encre} strokeWidth={4} />
      <circle cx={400} cy={616} r={9} fill={F.encre} />
      <line x1={60} x2={740} y1={768} y2={768} stroke={F.encre} strokeWidth={4} />
      {/* Le rail, le câble, le panneau et le crochet. */}
      <g opacity={disparait}>
        <rect x={290} y={8} width={220} height={20} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <circle cx={400} cy={30} r={14} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <line x1={xH} y1={36} x2={xH} y2={yH - 12} stroke={F.encre} strokeWidth={6} />
        <g transform={`rotate(${casse ? Math.sin(f / 9) * 4 * (1 - remonte) + 3 : 0} ${xH} ${yH - 66})`}>
          <rect x={xH - 98} y={yH - 66} width={196} height={54} rx={6} fill={F.argile} stroke={F.encre} strokeWidth={4} />
          <Libelle x={xH} y={yH - 29} taille={29} graisse={600} couleur={F.papier}>{LIBELLES.contrainte}</Libelle>
        </g>
        <clipPath id="c15-reste">
          <path d={COUPES_CROCHET.reste} />
        </clipPath>
        <g transform={`translate(${xH} ${yH})`}>
          {casse ? (
            <g clipPath="url(#c15-reste)">
              <FormeCrochet />
            </g>
          ) : (
            <FormeCrochet />
          )}
        </g>
        <circle cx={xH} cy={yH + 6} r={15} fill="none" stroke={F.encre} strokeWidth={7} />
      </g>
      {/* Le choc : il part du point touché vers le haut, dans le clair, au-dessus du couvercle. */}
      {eclat > 0 && eclat < 1 ? (
        <g opacity={1 - p(eclat, 0.4, 1)}>
          <g transform={`translate(${CHOC.x} ${CHOC.y}) scale(${lerp(0.5, 1.15, Math.min(1, eclat * 2.5))})`}>
            <path d="M0 -46 L10 -16 L36 -30 L22 -6 L46 0 L14 2 L0 0 L-14 2 L-46 0 L-22 -6 L-36 -30 L-10 -16 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          </g>
          {Array.from({ length: 7 }, (_, i) => {
            const a = ((-165 + i * 25) * Math.PI) / 180;
            const r0 = 40 + eclat * 34;
            const r1 = 58 + eclat * 74;
            const trait = { x1: CHOC.x + Math.cos(a) * r0, y1: CHOC.y + Math.sin(a) * r0, x2: CHOC.x + Math.cos(a) * r1, y2: CHOC.y + Math.sin(a) * r1 };
            return (
              <g key={i} strokeLinecap="round">
                <line {...trait} stroke={F.encre} strokeWidth={10} />
                <line {...trait} stroke={F.or} strokeWidth={6} />
              </g>
            );
          })}
        </g>
      ) : null}
      {/* Les deux éclats : la tige à droite, la pointe à gauche ; ils restent à terre jusqu'à ce que le crochet soit parti. */}
      {casse
        ? ECLATS.map((e) => {
            const horizontal = 1 - (1 - vol) * (1 - vol);
            const X = 400 + (e.xFin - (400 + e.cx)) * horizontal;
            const Y = Y_CHOC - 260 * vol + (e.yFin - e.cy - Y_CHOC + 260) * vol * vol;
            return (
              <g key={e.id} opacity={disparait} transform={`translate(${X} ${Y}) rotate(${e.tours * vol} ${e.cx} ${e.cy})`}>
                <clipPath id={e.id}>
                  <path d={e.d} />
                </clipPath>
                <g clipPath={`url(#${e.id})`}>
                  <FormeCrochet />
                </g>
              </g>
            );
          })
        : null}
      {/* Ce qui donne avec joie : un cœur là où visait le crochet. */}
      {joie > 0 ? <Coeur x={400} y={344 + (1 - joie) * 40} s={1 * joie * battement} /> : null}
      <Libelle x={400} y={272} taille={32} graisse={600} couleur={F.orFonce} opacite={joie}>{LIBELLES.avecJoie}</Libelle>
      <Libelle x={400} y={836} taille={34} graisse={600} couleur={F.orFonce} opacite={p(f, d2 + 75, d2 + 105)}>{LIBELLES.vision}</Libelle>
    </Scene>
  );
};

/** Les vingt poissons : cinq par colonne, la première colonne est le quart éclairé. */
const POISSONS = Array.from({ length: 4 }, (_, c) =>
  Array.from({ length: 5 }, (_, l) => {
    const ligne = (c * 3 + l * 7) % 5;
    return {
      colonne: c,
      x: 130 + c * 180 + [-16, 18, -6, 12, -20][(l + c * 2) % 5],
      y: 268 + l * 96 + (c % 2 === 0 ? 0 : 44) + [-10, 12, 0, -6, 8][(ligne + c) % 5],
      l: [84, 104, 74, 96, 88][(l + c) % 5],
      sens: (l + c) % 2 === 0 ? 1 : -1,
      phase: (c * 5 + l * 3) * 0.7,
    };
  }),
).flat();

const X_MER = 40;
const QUART = 180;

/** Plan 6 : la mer pleine de poissons encore gris, dont un quart seulement s'éclaire. */
const IlluMer: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1] = d;
  const entree = (i: number) => p(f, d0 + i * 6, d0 + i * 6 + 30);
  const eclaire = lineaire(f, d1 + 150, d1 + 220);
  const nb = 40;
  const vague = Array.from({ length: nb + 1 }, (_, i) => {
    const x = X_MER + (i * 720) / nb;
    const y = 178 + Math.sin(i / 2.2 + f / 22) * 9 + Math.sin(i / 5.1 - f / 37) * 5;
    return `${x} ${y.toFixed(1)}`;
  });
  const surface = `M${vague.join(' L')}`;
  const contour = `${surface} L760 790 H${X_MER} Z`;
  return (
    <Scene>
      <g transform="translate(0 -60)">
      <clipPath id="c15-mer">
        <path d={contour} />
      </clipPath>
      <path d={contour} fill={F.papier} />
      <path d={contour} fill={F.filet} opacity={0.34} />
      <g clipPath="url(#c15-mer)">
        {[300, 450, 600].map((y) => (
          <path key={y} d={`M30 ${y} Q215 ${y - 22} 400 ${y} T770 ${y}`} fill="none" stroke={F.filet} strokeWidth={2} opacity={0.75} />
        ))}
        <rect x={X_MER} y={120} width={QUART * eclaire} height={700} fill={F.orClair} opacity={0.62} />
        <path d="M30 790 V752 Q150 722 300 748 T560 742 T770 750 V790 Z" fill={F.filet} stroke={F.encre2} strokeWidth={3} />
      </g>
      {POISSONS.map((o, i) => {
        const allume = o.colonne === 0 ? p(eclaire, Math.max(0, (o.x - X_MER - 50) / QUART), Math.min(1, (o.x - X_MER + 20) / QUART)) : 0;
        const nage = Math.sin(f / (o.colonne === 0 ? 20 : 34) + o.phase) * 11;
        return <Poisson key={i} x={o.x + nage} y={o.y + Math.cos(f / 41 + o.phase) * 4} l={o.l} sens={o.sens} couleur={allume} opacite={entree(i)} />;
      })}
      <path d={contour} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <g opacity={p(eclaire, 0.1, 0.5)}>
        <line x1={X_MER + QUART} x2={X_MER + QUART} y1={186} y2={790} stroke={F.orFonce} strokeWidth={4} strokeDasharray="12 10" />
        <path d={`M${X_MER + 2} 804 V820 H${X_MER + QUART} V804`} fill="none" stroke={F.orFonce} strokeWidth={4} strokeLinejoin="round" />
      </g>
      <Libelle x={X_MER} y={862} taille={32} ancre="start" graisse={600} couleur={F.orFonce} opacite={p(eclaire, 0.3, 0.75)}>{LIBELLES.quart}</Libelle>
      </g>
    </Scene>
  );
};

/** Plan 7 : le thermomètre plein, et la petite coupe du plan 3 qui déborde encore, très lentement. */
const IlluFinCoupe: React.FC<PropsIllustration> = ({ f }) => {
  const R1 = 290;
  const R2 = 560;
  const T = 150;
  const perle = (decalage: number, xBord: number, sens: number) => {
    const u = ((f + decalage) % T) / T;
    const glisse = lineaire(u, 0, 0.32);
    const chute = lineaire(u, 0.32, 1);
    const x = xBord + sens * 12 * glisse;
    const y = R1 + 8 * glisse + (R2 - R1 - 4) * chute * chute;
    return <Goutte key={decalage} x={x} y={y} s={8} opacite={1 - p(u, 0.92, 1)} />;
  };
  return (
    <Scene>
      <Thermometre x={170} y={130} h={570} l={72} niveau={1} />
      <Rayons x={500} y={0} bas={R1} largeur={72} n={5} opacite={0.3} />
      <Coupe id="c15-fin1" x={500} y={R1} w={150} h={102} tige={40} niveau={1} />
      <Coupe id="c15-fin2" x={413} y={R2} w={130} h={88} tige={36} niveau={1} />
      <Coupe id="c15-fin3" x={587} y={R2} w={130} h={88} tige={36} niveau={1} />
      {perle(0, 425, -1)}
      {perle(75, 575, 1)}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluOuvertureCoupe,
  p2: IlluQuai,
  p3: IlluAbondance,
  p4: IlluTable,
  p5: IlluCrochet,
  p6: IlluMer,
  fin: IlluFinCoupe,
};
