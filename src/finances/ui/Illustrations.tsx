import React from 'react';
import { Easing, interpolate } from 'remotion';
import { LIBELLES, PARTIES } from '../textes';
import { F, PoliceF } from '../theme';

/** Progression 0 → 1 entre deux images, adoucie. */
const p = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

export type PropsIllustration = { f: number; d: number[]; duree: number };

const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 800 900" width={800} height={900} style={{ overflow: 'visible' }}>
    {children}
  </svg>
);

const Libelle: React.FC<{ x: number; y: number; taille?: number; ancre?: 'start' | 'middle' | 'end'; couleur?: string; graisse?: number; opacite?: number; children: React.ReactNode }> = ({
  x, y, taille = 26, ancre = 'middle', couleur = F.encre, graisse = 500, opacite = 1, children,
}) => (
  <text x={x} y={y} textAnchor={ancre} fontFamily={PoliceF.sans} fontSize={taille} fontWeight={graisse} fill={couleur} opacity={opacite}>
    {children}
  </text>
);

export const Piece: React.FC<{ x: number; y: number; r: number; opacite?: number }> = ({ x, y, r, opacite = 1 }) => (
  <g opacity={opacite}>
    <circle cx={x} cy={y} r={r} fill={F.or} stroke={F.orFonce} strokeWidth={Math.max(2, r * 0.08)} />
    <circle cx={x} cy={y} r={r * 0.72} fill={F.orClair} stroke={F.orFonce} strokeWidth={Math.max(1, r * 0.04)} />
  </g>
);

export const Coeur: React.FC<{ x: number; y: number; s: number; rempli?: string; contour?: string; opacite?: number }> = ({
  x, y, s, rempli = F.argile, contour = F.encre, opacite = 1,
}) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 42 C-64 2 -54 -48 -24 -50 C-10 -51 0 -40 0 -30 C0 -40 10 -51 24 -50 C54 -48 64 2 0 42 Z"
    fill={rempli}
    stroke={contour}
    strokeWidth={3 / s}
    opacity={opacite}
  />
);

/** Thermomètre : le fil conducteur de la vidéo. `niveau` de 0 à 1. */
export const Thermometre: React.FC<{ x: number; y: number; h: number; l: number; niveau: number; graduations?: boolean }> = ({ x, y, h, l, niveau, graduations = true }) => {
  const rBulbe = l * 1.05;
  const yBulbe = y + h + rBulbe * 0.72;
  const interieur = l - 12;
  const hauteur = Math.max(0, Math.min(1, niveau)) * h;
  return (
    <g>
      <rect x={x - l / 2} y={y - l / 2} width={l} height={h + l} rx={l / 2} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <circle cx={x} cy={yBulbe} r={rBulbe} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <rect x={x - interieur / 2} y={y + h - hauteur} width={interieur} height={hauteur + l} fill={F.or} />
      <circle cx={x} cy={yBulbe} r={rBulbe - 7} fill={F.or} />
      {graduations
        ? Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={x + l / 2 + 8} x2={x + l / 2 + (i % 2 === 0 ? 34 : 22)} y1={y + (h / 8) * i} y2={y + (h / 8) * i} stroke={F.encre2} strokeWidth={3} />
          ))
        : null}
    </g>
  );
};

/** Ouverture : une pièce tombe dans le thermomètre, le niveau monte un peu. */
export const IlluOuverture: React.FC<PropsIllustration> = ({ f }) => {
  const chute = p(f, 20, 62);
  return (
    <Scene>
      <Thermometre x={400} y={170} h={520} l={72} niveau={0.08 + 0.14 * p(f, 58, 110)} />
      {chute < 1 ? <Piece x={400} y={-60 + chute * 240} r={46} /> : null}
    </Scene>
  );
};

/** Quatre marches, l'argent tout en bas. */
export const IlluMarches: React.FC<PropsIllustration> = ({ f, d }) => {
  const LARGEUR = 165;
  const bas = 780;
  const fin = d[1];
  const pulse = p(f, fin, fin + 25);
  return (
    <Scene>
      <line x1={0} x2={800} y1={bas} y2={bas} stroke={F.encre} strokeWidth={4} />
      {LIBELLES.marches.map((m, i) => {
        const a = d[0] + (i * (fin - d[0])) / 5;
        const o = p(f, a, a + 24);
        const h = 130 * (i + 1) * o;
        return (
          <g key={m}>
            <rect x={130 + i * LARGEUR} y={bas - h} width={LARGEUR} height={h} fill={F.papier} stroke={F.encre} strokeWidth={3} />
            <Libelle x={130 + i * LARGEUR + LARGEUR / 2} y={bas - h + 46} taille={21} opacite={o}>
              {m}
            </Libelle>
          </g>
        );
      })}
      <circle cx={62} cy={bas - 44} r={44 + pulse * 46} fill="none" stroke={F.or} strokeWidth={5} opacity={pulse > 0 ? 1 - pulse * 0.6 : 0} />
      <Piece x={62} y={bas - 44 - (1 - p(f, 0, 26)) * 240} r={44} />
    </Scene>
  );
};

/** La balance : fidèle dans le petit, fidèle dans le grand. */
export const IlluBalance: React.FC<PropsIllustration> = ({ f, d }) => {
  const bascule = p(f, d[0] + 170, d[0] + 190);
  const stable = p(f, d[1] - 20, d[1] + 20);
  const angle = Math.sin(f / 22) * 7 * (1 - stable);
  const rad = (angle * Math.PI) / 180;
  const cx = 400;
  const cy = 210;
  const L = 270;
  const gx = cx - L * Math.cos(rad);
  const gy = cy - L * Math.sin(rad);
  const dx = cx + L * Math.cos(rad);
  const dy = cy + L * Math.sin(rad);
  const Plateau: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => (
    <g>
      <line x1={x} y1={y} x2={x - 85} y2={y + 220} stroke={F.encre} strokeWidth={3} />
      <line x1={x} y1={y} x2={x + 85} y2={y + 220} stroke={F.encre} strokeWidth={3} />
      <path d={`M${x - 100} ${y + 220} H${x + 100} Q${x} ${y + 275} ${x - 100} ${y + 220} Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      {children}
    </g>
  );
  return (
    <Scene>
      <line x1={cx} y1={cy} x2={cx} y2={740} stroke={F.encre} strokeWidth={10} />
      <path d={`M${cx - 130} 770 Q${cx} 700 ${cx + 130} 770 Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <line x1={gx} y1={gy} x2={dx} y2={dy} stroke={F.encre} strokeWidth={10} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={18} fill={F.or} stroke={F.encre} strokeWidth={4} />
      <Plateau x={gx} y={gy}>
        <Piece x={gx} y={gy + 196} r={24} />
      </Plateau>
      <Plateau x={dx} y={dy}>
        <Piece x={dx - 40} y={dy + 188} r={32} />
        <Piece x={dx + 34} y={dy + 188} r={32} />
        <Piece x={dx} y={dy + 142} r={32} />
      </Plateau>
      {LIBELLES.balance.map(([g, dr], i) => {
        const o = i === 0 ? 1 - bascule : bascule;
        return (
          <g key={g}>
            <Libelle x={gx} y={gy + 320} opacite={o} taille={25}>{g}</Libelle>
            <Libelle x={dx} y={dy + 320} opacite={o} taille={25}>{dr}</Libelle>
          </g>
        );
      })}
    </Scene>
  );
};

const POLICES = PARTIES.find((x) => x.id === 'polices')!.temps.slice(1, 8);

/** Sept polices tamponnées une à une. */
export const IlluPolices: React.FC<PropsIllustration> = ({ f, d }) => {
  const W = 200;
  const H = 262;
  const final = d[d.length - 1];
  const estompe = 1 - 0.72 * p(f, final, final + 25);
  const coeur = p(f, final + 5, final + 35);
  return (
    <Scene>
      <g opacity={estompe}>
        {POLICES.map((v, i) => {
          const debut = d[i + 1];
          const arrivee = p(f, debut - 4, debut + 14);
          const colonne = i < 6 ? i % 3 : 1;
          const ligne = Math.floor(i / 3);
          const x = 75 + colonne * (W + 25);
          const y = 18 + ligne * (H + 22);
          const tampon = p(f, debut + 16, debut + 26);
          const actuel = f >= debut && (i === 6 ? f < final : f < d[i + 2]);
          return (
            <g key={v.reference} opacity={arrivee} transform={`translate(0 ${(1 - arrivee) * 30})`}>
              <rect x={x} y={y} width={W} height={H} rx={8} fill={F.papier} stroke={actuel ? F.or : F.encre} strokeWidth={actuel ? 6 : 3} />
              <Libelle x={x + W / 2} y={y + 42} taille={20} graisse={600}>{`${LIBELLES.police} ${i + 1}`}</Libelle>
              {[64, 84, 104].map((dy) => (
                <line key={dy} x1={x + 24} x2={x + W - 24} y1={y + dy} y2={y + dy} stroke={F.filet} strokeWidth={4} />
              ))}
              <Libelle x={x + W / 2} y={y + H - 22} taille={15.5} couleur={F.encre2}>{v.reference}</Libelle>
              <g opacity={tampon} transform={`translate(${x + W / 2} ${y + 164}) rotate(-12) scale(${1.5 - 0.5 * tampon})`}>
                <circle r={38} fill="none" stroke={F.orFonce} strokeWidth={5} />
                <circle r={30} fill="none" stroke={F.orFonce} strokeWidth={2} />
                <path d="M-15 1 L-4 13 L17 -13" fill="none" stroke={F.orFonce} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          );
        })}
      </g>
      {coeur > 0 ? <Coeur x={400} y={440} s={3.4 * coeur} /> : null}
    </Scene>
  );
};

/** La poche trouée, recousue, puis la chaîne brisée. */
export const IlluPoche: React.FC<PropsIllustration> = ({ f, d }) => {
  const TROUS = [
    { x: 300, y: 610 },
    { x: 400, y: 655 },
    { x: 500, y: 610 },
  ];
  const couture = p(f, d[1], d[1] + 40);
  const chaine = p(f, d[2], d[2] + 25);
  const rupture = p(f, d[2] + 95, d[2] + 125);
  return (
    <Scene>
      <path d="M170 150 H630 V500 Q630 660 400 725 Q170 660 170 500 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <path d="M170 215 H630" stroke={F.orClair} strokeWidth={4} strokeDasharray="16 12" />
      {/* Les pièces qui restent. */}
      <Piece x={330} y={445} r={50} />
      <Piece x={470} y={445} r={50} />
      <Piece x={400} y={365} r={50} />
      {/* Les pièces qui tombent : seulement tant que la poche n'est pas recousue. */}
      {f < d[1]
        ? Array.from({ length: 7 }, (_, i) => {
            const periode = 66;
            const local = (f + i * 22) % periode;
            const t = local / periode;
            const trou = TROUS[i % 3];
            return <Piece key={i} x={trou.x} y={trou.y + t * 260} r={24} opacite={(1 - t) * (1 - p(f, d[1] - 12, d[1]))} />;
          })
        : null}
      {TROUS.map((t, i) => (
        <g key={i}>
          <ellipse cx={t.x} cy={t.y} rx={38 * (1 - couture)} ry={22 * (1 - couture)} fill={F.parchemin} stroke={F.encre} strokeWidth={couture < 1 ? 3 : 0} />
          {[-24, 0, 24].map((dx) => (
            <path key={dx} d={`M${t.x + dx - 9} ${t.y - 12} L${t.x + dx + 9} ${t.y + 12} M${t.x + dx + 9} ${t.y - 12} L${t.x + dx - 9} ${t.y + 12}`} stroke={F.orClair} strokeWidth={5} strokeLinecap="round" opacity={couture} />
          ))}
        </g>
      ))}
      {/* La chaîne : deux moitiés qui s'écartent et tombent. */}
      {chaine > 0
        ? [-1, 1].map((sens) => (
            <g key={sens} opacity={chaine * (1 - rupture)} transform={`translate(${sens * rupture * 120} ${rupture * 150}) rotate(${sens * rupture * 14} 400 420)`}>
              {Array.from({ length: 6 }, (_, i) => (
                <rect key={i} x={sens < 0 ? 96 + i * 50 : 416 + i * 50} y={398} width={58} height={34} rx={15} fill="none" stroke={F.encre} strokeWidth={10} />
              ))}
            </g>
          ))
        : null}
    </Scene>
  );
};

/** L'étiquette de prix devient un cœur, relié vers le haut. */
export const IlluRelation: React.FC<PropsIllustration> = ({ f, d }) => {
  const bascule = p(f, d[1] - 95, d[1] - 55);
  const don = p(f, d[2], d[2] + 70);
  const battement = 1 + Math.sin(f / 11) * 0.025 * bascule;
  return (
    <Scene>
      <g opacity={1 - bascule} transform={`rotate(${-8 * (1 - bascule)} 400 500)`}>
        <path d="M190 420 L300 320 H630 V680 H300 L190 580 Z" fill={F.papier} stroke={F.encre} strokeWidth={5} />
        <circle cx={260} cy={500} r={24} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
        <Libelle x={465} y={510} taille={36} graisse={600}>{LIBELLES.avant}</Libelle>
      </g>
      <g opacity={bascule}>
        {Array.from({ length: 11 }, (_, i) => {
          const a = (-90 + (i - 5) * 18) * (Math.PI / 180);
          return <line key={i} x1={400 + Math.cos(a) * 92} y1={108 + Math.sin(a) * 92} x2={400 + Math.cos(a) * 150} y2={108 + Math.sin(a) * 150} stroke={F.or} strokeWidth={6} strokeLinecap="round" opacity={0.25 + 0.75 * don} />;
        })}
        <circle cx={400} cy={108} r={70} fill={F.orClair} opacity={0.3 + 0.7 * don} />
        <line x1={400} y1={400} x2={400} y2={180} stroke={F.or} strokeWidth={8} strokeDasharray="4 20" strokeLinecap="round" opacity={don} />
        <Coeur x={400} y={520} s={3.1 * battement} />
        <Libelle x={400} y={720} taille={36} graisse={600}>{LIBELLES.apres}</Libelle>
        <Piece x={400} y={850 - don * 680} r={32} opacite={don < 1 ? 1 : 0} />
      </g>
    </Scene>
  );
};

const VolantCoin: React.FC<{ x: number; y: number; r: number; angle: number }> = ({ x, y, r, angle }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <Piece x={0} y={0} r={r} />
    <circle r={r * 0.24} fill={F.orFonce} />
    {[90, 210, 330].map((a) => (
      <line key={a} x1={0} y1={0} x2={Math.cos((a * Math.PI) / 180) * r * 0.86} y2={Math.sin((a * Math.PI) / 180) * r * 0.86} stroke={F.orFonce} strokeWidth={r * 0.11} strokeLinecap="round" />
    ))}
  </g>
);

/** Le cœur est la voiture, l'argent est le volant. */
export const IlluVolant: React.FC<PropsIllustration> = ({ f, d }) => {
  const tresor = p(f, d[1], d[1] + 25);
  const noms = p(f, d[2], d[2] + 20);
  const route = p(f, d[3], d[3] + 90);
  const tourne = p(f, d[3], d[3] + 28);
  const angle = 34 * tourne - 12 * route;
  // Le cœur suit la route : droit, puis courbe de Bézier vers la branche de droite.
  const P0 = { x: 400, y: 560 };
  const P1 = { x: 400, y: 330 };
  const P2 = { x: 535, y: 275 };
  const t = route;
  const cx = (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x;
  const cy = (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y;
  return (
    <Scene>
      {[
        { d: 'M400 640 V430 Q400 310 190 110', o: 0.55 },
        { d: 'M400 640 V430 Q400 310 610 110', o: 1 },
      ].map((r) => (
        <g key={r.d} opacity={r.o}>
          <path d={r.d} fill="none" stroke={F.filet} strokeWidth={104} />
          <path d={r.d} fill="none" stroke={F.papier} strokeWidth={92} />
          <path d={r.d} fill="none" stroke={F.encre2} strokeWidth={4} strokeDasharray="22 22" />
        </g>
      ))}
      <g opacity={tresor} transform={`translate(650 72) scale(${0.9 + 0.1 * tresor})`}>
        <rect x={-68} y={-14} width={136} height={76} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <path d="M-68 -14 Q0 -70 68 -14 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <rect x={-12} y={-20} width={24} height={34} fill={F.or} stroke={F.encre} strokeWidth={3} />
      </g>
      <Libelle x={650} y={-10} taille={24} opacite={tresor} ancre="middle">{LIBELLES.tresor}</Libelle>
      <g transform={`translate(${cx} ${cy})`}>
        <circle cx={-42} cy={-18} r={13} fill={F.encre} />
        <circle cx={42} cy={-18} r={13} fill={F.encre} />
        <circle cx={-34} cy={36} r={13} fill={F.encre} />
        <circle cx={34} cy={36} r={13} fill={F.encre} />
      </g>
      <Coeur x={cx} y={cy} s={1.25} />
      <Libelle x={cx + 94} y={cy + 9} taille={26} ancre="start" opacite={noms}>{LIBELLES.coeur}</Libelle>
      <VolantCoin x={400} y={760} r={94} angle={angle} />
      <Libelle x={525} y={769} taille={26} ancre="start" opacite={noms}>{LIBELLES.argent}</Libelle>
    </Scene>
  );
};

/** La fenêtre sur l'âme, le papier de tournesol, le réveil. */
export const IlluRevelateur: React.FC<PropsIllustration> = ({ f, d }) => {
  const ouvre = p(f, d[0], d[0] + 45);
  const papier = p(f, d[1] - 15, d[1] + 15);
  const teinte = p(f, d[1] + 25, d[1] + 110);
  const eveil = p(f, d[2], d[2] + 55);
  const X = 230;
  const Y = 210;
  const W = 340;
  const H = 460;
  return (
    <Scene>
      <g opacity={1 - papier}>
        <rect x={X} y={Y} width={W} height={H} fill={F.orClair} stroke={F.encre} strokeWidth={8} />
        <Coeur x={X + W / 2} y={Y + H / 2} s={1.9} opacite={ouvre} />
        <rect x={X} y={Y} width={(W / 2) * (1 - ouvre)} height={H} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <rect x={X + W - (W / 2) * (1 - ouvre)} y={Y} width={(W / 2) * (1 - ouvre)} height={H} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <path d={`M${X + W / 2} ${Y} V${Y + H} M${X} ${Y + H / 2} H${X + W}`} stroke={F.encre} strokeWidth={6} opacity={1 - ouvre * 0.65} />
      </g>
      <g opacity={papier}>
        {Array.from({ length: 13 }, (_, i) => {
          const a = (-180 + i * 15) * (Math.PI / 180);
          return <line key={i} x1={400 + Math.cos(a) * 262} y1={720 + Math.sin(a) * 262} x2={400 + Math.cos(a) * (262 + 92 * eveil)} y2={720 + Math.sin(a) * (262 + 92 * eveil)} stroke={F.or} strokeWidth={8} strokeLinecap="round" opacity={eveil} />;
        })}
        <path d={`M150 720 A250 250 0 0 1 650 720 Z`} fill={F.orClair} opacity={eveil} />
        <rect x={345} y={170} width={110} height={550} rx={4} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <rect x={349} y={720 - 546 * teinte} width={102} height={546 * teinte} fill={F.or} />
        <Piece x={400} y={760} r={70} />
      </g>
    </Scene>
  );
};

/** Le budget s'écrit ligne par ligne. */
export const IlluBudget: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const debut = d[0];
  const pas = (duree - debut - 60) / LIBELLES.lignes.length;
  return (
    <Scene>
      <rect x={110} y={70} width={580} height={760} rx={10} fill={F.papier} stroke={F.encre} strokeWidth={5} />
      <text x={400} y={165} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={54} fontWeight={500} fill={F.encre}>{LIBELLES.budget}</text>
      <line x1={160} x2={640} y1={195} y2={195} stroke={F.encre} strokeWidth={4} />
      {LIBELLES.lignes.map((l, i) => {
        const a = debut + i * pas;
        const o = p(f, a, a + 22);
        const y = 285 + i * 115;
        return (
          <g key={l} opacity={o}>
            <Libelle x={165} y={y} taille={32} ancre="start">{l}</Libelle>
            <line x1={160} x2={640} y1={y + 32} y2={y + 32} stroke={F.filet} strokeWidth={3} />
            <Piece x={610} y={y - 10} r={26} />
          </g>
        );
      })}
    </Scene>
  );
};

/** Fin : le thermomètre est plein, un cœur le surmonte. */
export const IlluFin: React.FC<PropsIllustration> = ({ f }) => {
  const c = p(f, 55, 85);
  return (
    <Scene>
      <Thermometre x={400} y={210} h={480} l={72} niveau={0.72 + 0.28 * p(f, 0, 60)} />
      {c > 0 ? <Coeur x={400} y={90} s={1.25 * c} /> : null}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluOuverture,
  facile: IlluMarches,
  test: IlluBalance,
  polices: IlluPolices,
  dime: IlluPoche,
  relation: IlluRelation,
  volant: IlluVolant,
  revelateur: IlluRevelateur,
  budget: IlluBudget,
  fin: IlluFin,
};
