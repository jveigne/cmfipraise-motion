import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { useJournal } from '../langue';
import { Batons, Cahier, Carton, PAGE_CAHIER, PetitCahier, Question, Silhouette } from '../ui/Illustrations';
import { LegendeJournal, borne } from './commun';

/**
 * Partie « Le cahier » (P1–P5, 19,5 s) : la problématique, en illustrations — pas d'écran d'app.
 * Les trois problèmes retenus par JP : (1) un seul exemplaire, perdu ou parti avec l'ancien
 * dirigeant (P2, P3) ; (2) au bout de dix ans, une pile de cahiers (P4) ; (3) rien de visible :
 * tout recompter, et la ville ne voit rien (P5).
 */
export const DUREE_C1 = 90;
export const DUREE_C2 = 120;
export const DUREE_C3 = 120;
export const DUREE_C4 = 105;
export const DUREE_C5 = 150;

/** Centre du cahier (pixels vidéo), sous la légende, et son agrandissement en P1–P2. */
const CENTRE = { x: 540, y: 1110 };
const GRAND = 1.06;

const apparition = (f: number, fps: number, a: number, amorti = 14) => spring({ frame: f - a, fps, config: { damping: amorti } });

// ---------------------------------------------------------------------------------------------
// P1 — Chaque réunion s'écrit au cahier

export const C1Cahier: React.FC = () => {
  const f = useCurrentFrame();
  const { legendes, cartons } = useJournal();
  const { fps } = useVideoConfig();
  const pose = apparition(f, fps, 0, 16);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, opacity: borne(pose * 1.4), transform: `translateY(${(1 - pose) * 80}px)` }}>
        <Cahier
          x={CENTRE.x}
          y={CENTRE.y}
          ouverture={doux(f, [20, 36], [0, 1])}
          echelle={GRAND}
          etiquette={cartons.etiquetteCahier}
          lignes={cartons.pageCahier}
          // Une ligne toutes les 8 images à partir de i 38.
          ecrites={Math.max(0, (f - 38) / 8)}
        />
      </div>
      <LegendeJournal lignes={legendes.p1} duree={DUREE_C1} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P2 — Un seul exemplaire, et il se perd

/** Tache d'eau aux bords irréguliers, sur la page (repère de la page). */
const Tache: React.FC<{ p: number }> = ({ p }) =>
  p <= 0.001 ? null : (
    <svg style={{ position: 'absolute', left: 60, top: 150, overflow: 'visible' }} width={360} height={360}>
      <path
        d="M180 20 C 260 10, 330 90, 320 170 C 340 250, 270 330, 190 320 C 110 345, 30 280, 40 190 C 20 110, 90 30, 180 20 Z"
        fill="rgba(30,58,47,0.10)"
        stroke="rgba(30,58,47,0.12)"
        strokeWidth={3}
        transform={`translate(180 180) scale(${p}) translate(-180 -180)`}
      />
    </svg>
  );

export const C2Perdu: React.FC = () => {
  const f = useCurrentFrame();
  const { legendes, cartons } = useJournal();
  const { fps } = useVideoConfig();
  const tache = doux(f, [14, 50], [0, 1]);
  const ouverture = 1 - doux(f, [56, 68], [0, 1]);
  // Le carton monte (i 70 → 84), le cahier y tombe (i 76 → 90), les volets se ferment (i 86 → 94),
  // puis le carton sort par la droite (i 96 → 114).
  const montee = doux(f, [70, 84], [0, 1]);
  const chute = doux(f, [76, 90], [0, 1]);
  const fermeture = doux(f, [86, 94], [0, 1]);
  const sortie = doux(f, [96, 114], [0, 1]);
  const hautCarton = 1260;
  const goutte = f >= 6 && f < 16 ? doux(f, [6, 14], [0, 1]) : f >= 16 ? 1 : 0;
  return (
    <AbsoluteFill>
      {/* Contour pointillé : la place vide du cahier. */}
      <div
        style={{
          position: 'absolute',
          left: CENTRE.x - (PAGE_CAHIER.largeur * GRAND) / 2,
          top: CENTRE.y - (PAGE_CAHIER.hauteur * GRAND) / 2,
          width: PAGE_CAHIER.largeur * GRAND,
          height: PAGE_CAHIER.hauteur * GRAND,
          borderRadius: 14,
          border: `5px dashed ${S.hairStrong}`,
          boxSizing: 'border-box',
          opacity: doux(f, [92, 104], [0, 1]),
        }}
      />
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${sortie * 900}px)` }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateY(${chute * 330}px) scale(${1 - 0.42 * chute})`,
            transformOrigin: `${CENTRE.x}px ${CENTRE.y}px`,
            opacity: chute > 0.95 ? 0 : 1,
          }}
        >
          <Cahier
            x={CENTRE.x}
            y={CENTRE.y}
            ouverture={ouverture}
            echelle={GRAND}
            etiquette={cartons.etiquetteCahier}
            lignes={cartons.pageCahier}
            bavure={doux(f, [20, 52], [0, 1])}
          >
            <Tache p={tache} />
          </Cahier>
        </div>
        {montee > 0 ? (
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - montee) * 900}px)` }}>
            <Carton x={CENTRE.x} y={hautCarton} fermeture={fermeture} texte={cartons.demenagement} />
          </div>
        ) : null}
      </div>
      {/* La goutte tombe sur la page (i 6 → 14). */}
      {goutte > 0 && f < 18 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRE.x + 200,
            top: 520 + goutte * 560,
            width: 34,
            height: 46,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            background: 'rgba(30,58,47,0.35)',
            opacity: f < 14 ? 1 : 1 - (f - 14) / 4,
          }}
        />
      ) : null}
      <LegendeJournal lignes={legendes.p2} duree={DUREE_C2} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P3 — Le dirigeant change, le cahier s'en va

export const C3Passation: React.FC = () => {
  const f = useCurrentFrame();
  const { legendes, cartons } = useJournal();
  const { fps } = useVideoConfig();
  const pose = apparition(f, fps, 6, 16);
  const depart = doux(f, [40, 78], [0, 1]);
  const bulle = apparition(f, fps, 80, 11);
  const neuf = apparition(f, fps, 88, 14);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, opacity: borne(pose * 1.3), transform: `translateY(${(1 - pose) * 60}px)` }}>
        {/* L'ancien dirigeant part par la gauche, le cahier sous le bras. */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-depart * 700}px)` }}>
          <Silhouette x={300} y={760} teinte={S.ink3} etiquette={cartons.ancienDirigeant}>
            <PetitCahier largeur={150} hauteur={200} couleur={S.earth} style={{ position: 'absolute', left: 150, top: 160, transform: 'rotate(-8deg)' }} />
          </Silhouette>
        </div>
        <Silhouette x={790} y={760} teinte={S.mossSoft} etiquette={cartons.nouveauDirigeant} />
      </div>
      {/* Bulle « ? » au-dessus du nouveau dirigeant. */}
      <div
        style={{
          position: 'absolute',
          left: 790 + 70,
          top: 600,
          width: 120,
          height: 120,
          borderRadius: 60,
          background: S.paper,
          boxShadow: '0 14px 30px rgba(42,38,32,0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: P.serif,
          fontWeight: 600,
          fontSize: 80,
          color: S.clay,
          transform: `scale(${bulle})`,
        }}
      >
        ?
      </div>
      {/* Un cahier neuf, ouvert sur une page blanche, devant lui. */}
      <div style={{ position: 'absolute', inset: 0, opacity: borne(neuf), transform: `translateY(${(1 - neuf) * 60}px)` }}>
        <Cahier x={590} y={1440} ouverture={1} echelle={0.42} />
      </div>
      <LegendeJournal lignes={legendes.p3} duree={DUREE_C3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P4 — Dix ans : une pile de cahiers

/** Dix cahiers dépareillés, de 2017 (en bas) à 2026 (en haut) : couleur, largeur, hauteur, décalage. */
const PILE = [
  { annee: '2017', couleur: S.earth, l: 520, h: 66, dx: -10 },
  { annee: '2018', couleur: S.moss, l: 470, h: 58, dx: 22 },
  { annee: '2019', couleur: S.clay, l: 540, h: 62, dx: -26 },
  { annee: '2020', couleur: S.sauge, l: 480, h: 70, dx: 14 },
  { annee: '2021', couleur: S.ink3, l: 500, h: 56, dx: -4 },
  { annee: '2022', couleur: S.earthDeep, l: 456, h: 64, dx: 30 },
  { annee: '2023', couleur: S.mossSoft, l: 530, h: 58, dx: -20 },
  { annee: '2024', couleur: '#B98A5E', l: 490, h: 68, dx: 8 },
  { annee: '2025', couleur: S.clay, l: 466, h: 60, dx: -14 },
  { annee: '2026', couleur: S.moss, l: 510, h: 62, dx: 18 },
];
/** Bas de la pile (pixels vidéo). */
const SOL = 1640;

export const C4Pile: React.FC = () => {
  const f = useCurrentFrame();
  const { legendes } = useJournal();
  const { fps } = useVideoConfig();
  // Vacillement de la pile (i 40 → 80), puis « 2020 » glisse et sort (i 66 → 90).
  const vacille = f >= 40 && f <= 84 ? Math.sin(((f - 40) / 44) * Math.PI * 3) * 2 * (1 - (f - 40) / 44) : 0;
  const glisse = doux(f, [66, 90], [0, 1]);
  let bas = SOL;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, transform: `rotate(${vacille}deg)`, transformOrigin: `540px ${SOL}px` }}>
        {PILE.map((c, i) => {
          bas -= c.h + 6;
          const chute = spring({ frame: f - (4 + i * 4), fps, config: { damping: 13, mass: 0.7 } });
          const sort = c.annee === '2020' ? glisse : 0;
          return (
            <div
              key={c.annee}
              style={{
                position: 'absolute',
                left: 540 - c.l / 2 + c.dx + sort * 900,
                top: bas - (1 - chute) * 1300,
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.2 + sort * 14}deg)`,
                opacity: f < 4 + i * 4 ? 0 : 1,
              }}
            >
              <PetitCahier largeur={c.l} hauteur={c.h} couleur={c.couleur} annee={c.annee} />
            </div>
          );
        })}
      </div>
      <LegendeJournal lignes={legendes.p4} duree={DUREE_C4} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P5 — Tout recompter ; la ville ne voit rien

export const C5Recompter: React.FC = () => {
  const f = useCurrentFrame();
  const { legendes, cartons } = useJournal();
  const { fps } = useVideoConfig();
  const pose = apparition(f, fps, 0, 18);
  const recul = doux(f, [76, 96], [0, 1]);
  const echelle = 1 - 0.28 * recul;
  const ville = doux(f, [80, 98], [0, 1]);
  const trace = doux(f, [94, 102], [0, 1]);
  const brise = doux(f, [100, 106], [0, 1]);
  const interro = apparition(f, fps, 104, 11);
  const questions = cartons.questions;
  // La sortie du dessin (il descend et s'efface) se joue sur les 10 premières images de P6, sur la
  // montée du chant : voir `SortieDessin` dans Video.tsx.
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${echelle})`, transformOrigin: `${CENTRE.x}px ${CENTRE.y + 250}px` }}>
        <div style={{ position: 'absolute', inset: 0, opacity: borne(pose * 1.4) }}>
          <Cahier x={CENTRE.x} y={CENTRE.y} ouverture={1} lignes={cartons.pageComptes} />
          {/* Bâtons de comptage, au crayon, sur la page de gauche (un trait toutes les 3 images). */}
          <Batons n={Math.max(0, Math.min(23, (f - 14) / 3 + 1))} x={110} y={930} />
        </div>
        {questions.map((q, i) => (
          <Question
            key={q}
            texte={q}
            echelle={apparition(f, fps, 26 + i * 12, 12)}
            style={[{ left: 60, top: 760 }, { left: 560, top: 1500 }, { left: 120, top: 1580 }][i]}
          />
        ))}
      </div>

      {/* La ville, au-dessus : le lien vers le cahier se trace puis se brise. */}
      <div style={{ position: 'absolute', left: 290, top: 400 - (1 - ville) * 300, width: 500, opacity: ville }}>
        <div
          style={{
            padding: '22px 30px',
            borderRadius: 30,
            border: `4px solid ${S.sauge}`,
            background: 'rgba(251,245,230,0.85)',
            display: 'flex',
            alignItems: 'center',
            gap: 26,
          }}
        >
          <div style={{ position: 'relative', width: 70, height: 90 }}>
            <div style={{ position: 'absolute', left: 17, top: 0, width: 36, height: 36, borderRadius: 18, background: S.mossSoft }} />
            <div style={{ position: 'absolute', left: 0, top: 42, width: 70, height: 48, borderRadius: '35px 35px 10px 10px', background: S.mossSoft }} />
          </div>
          <div style={{ fontFamily: P.mono, fontWeight: 500, fontSize: 32, letterSpacing: 2, color: S.ink2 }}>{cartons.ville}</div>
        </div>
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1080} height={1920}>
        {/* Deux tronçons : le haut et le bas s'écartent quand le trait se brise. */}
        <line x1={540} y1={548} x2={540} y2={548 + 120 * trace - 30 * brise} stroke={S.sauge} strokeWidth={6} strokeDasharray="14 14" strokeLinecap="round" opacity={trace > 0 ? 1 : 0} />
        <line x1={540} y1={548 + 240 * trace} x2={540} y2={548 + 120 * trace + 30 * brise} stroke={S.sauge} strokeWidth={6} strokeDasharray="14 14" strokeLinecap="round" opacity={trace > 0 ? 1 : 0} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 590,
          top: 610,
          fontFamily: P.serif,
          fontWeight: 600,
          fontSize: 96,
          color: S.clay,
          transform: `scale(${interro})`,
        }}
      >
        ?
      </div>
      <LegendeJournal lignes={legendes.p5Compter} duree={DUREE_C5} debut={6} fin={74} />
      <LegendeJournal lignes={legendes.p5Ville} duree={DUREE_C5} debut={80} fin={DUREE_C5 - 1} />
    </AbsoluteFill>
  );
};
