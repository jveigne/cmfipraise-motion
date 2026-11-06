import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { PageLignee, PAGE_CAHIER, Question, Silhouette } from '../../journal/ui/Illustrations';
import { useEtude } from '../langue';
import { Salon, centrePersonne } from '../ui/Salon';
import { LivreOuvert } from '../ui/Livre';
import { LegendeEtude, Poses, Ralenti, borne, dureeRalentie, imageRalentie } from './commun';

/**
 * Partie « Le problème » (P1–P4, 24,0 s) : illustrations, pas d'écran d'app (style du « cahier » de
 * « Journal »). Un dimanche, en journée, l'assemblée de maison Paris Ouest dans le salon de Samuel
 * (P1) ; aujourd'hui (1) on échange les cahiers et on corrige à la main (P2), (2) les notes se
 * perdent sur une feuille volante (P3), (3) rien de visible : le dirigeant ne sait pas où en est
 * chacun, la ville encore moins (P4).
 *
 * Rythme (retour JP du 21/10) : chaque plan garde sa chorégraphie d'origine (gestes à la même
 * vitesse) et reçoit des poses (`Ralenti`) ; les légendes sont posées dans le temps ralenti.
 */
const POSES_P1: Poses = [
  [119, 30],
  [150, 30],
];
const POSES_P2: Poses = [
  [52, 15],
  [92, 15],
];
const POSES_P3: Poses = [[52, 30]];
const POSES_P4: Poses = [[72, 15]];
export const DUREE_P1 = dureeRalentie(165, POSES_P1);
export const DUREE_P2 = dureeRalentie(150, POSES_P2);
export const DUREE_P3 = dureeRalentie(120, POSES_P3);
export const DUREE_P4 = dureeRalentie(150, POSES_P4);

const ressort = (f: number, fps: number, a: number, amorti = 12) => spring({ frame: f - a, fps, config: { damping: amorti } });

// ---------------------------------------------------------------------------------------------
// P1 — Le dimanche, une assemblée de maison

/** Ordre des étiquettes : Samuel d'abord, puis les quatre membres suivis tout au long. */
const ORDRE_ETIQUETTES = ['samuel', 'marie', 'jean', 'esther', 'paul'] as const;

const P1Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const etiquettes = Object.fromEntries(ORDRE_ETIQUETTES.map((n, i) => [n, ressort(f, fps, 70 + i * 8)]));
  // Travelling vers Marie et Jean sur les dernières images (raccord avec P2).
  const avance = doux(f, [150, 165], [0, 1]);
  const foyer = { x: (centrePersonne('marie').x + centrePersonne('jean').x) / 2, y: centrePersonne('marie').y };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.7 * avance})`, transformOrigin: `${foyer.x}px ${foyer.y}px`, opacity: 1 - 0.6 * avance }}>
        <Salon
          pose={doux(f, [0, 20], [0, 1])}
          assis={(i) => ressort(f, fps, 24 + i * 2, 11)}
          etiquettes={etiquettes}
          cahiers={doux(f, [120, 130], [0, 1])}
          ecriture={doux(f, [130, 150], [0, 1])}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const P1Salon: React.FC = () => {
  const { legendes } = useEtude();
  const n = (a: number) => imageRalentie(a, POSES_P1);
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P1}>
        <P1Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p1} duree={DUREE_P1} fin={n(120) - 2} />
      <LegendeEtude lignes={legendes.p1Cahiers} duree={DUREE_P1} debut={n(120) + 2} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P2 — On échange les cahiers, on corrige à la main

/** Une page de cahier (480 × 640) réduite, posée par son coin haut gauche. */
const Page: React.FC<{ x: number; y: number; lignes: readonly string[]; rotation?: number; children?: React.ReactNode }> = ({ x, y, lignes, rotation = 0, children }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: PAGE_CAHIER.largeur,
      height: PAGE_CAHIER.hauteur,
      transform: `scale(${ECHELLE_PAGE}) rotate(${rotation}deg)`,
      transformOrigin: '0 0',
      boxShadow: '0 30px 60px rgba(42,38,32,0.22)',
      borderRadius: '4px 14px 14px 4px',
    }}
  >
    <PageLignee lignes={lignes} taille={24}>
      {children}
    </PageLignee>
  </div>
);
const ECHELLE_PAGE = 0.95;
const PAGE_G = { x: 62, y: 960 };
const PAGE_D = { x: 562, y: 960 };

/** Ligne `i` d'une page : haut du texte (repère de la page). */
const hautLigne = (i: number) => PAGE_CAHIER.hautLignes + i * PAGE_CAHIER.interligne;

const P2Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons: CARTONS } = useEtude();
  const entree = doux(f, [0, 14], [0, 1]);
  const echange = doux(f, [16, 50], [0, 1]);
  const arc = Math.sin(echange * Math.PI);
  const coche = doux(f, [56, 72], [0, 1]);
  const doute = ressort(f, fps, 92, 11);
  const rature = doux(f, [96, 110], [0, 1]);
  const reecrit = doux(f, [112, 132], [0, 1]);
  const froisse = f >= 96 && f <= 132 ? Math.sin(((f - 96) / 36) * Math.PI * 4) * 1.4 * (1 - (f - 96) / 36) : 0;
  const marie = { x: PAGE_G.x + (PAGE_D.x - PAGE_G.x) * echange, y: PAGE_G.y - 150 * arc };
  const jean = { x: PAGE_D.x + (PAGE_G.x - PAGE_D.x) * echange, y: PAGE_D.y + 60 * arc };
  return (
    <AbsoluteFill style={{ opacity: borne(entree * 1.5), transform: `scale(${1.08 - 0.08 * entree})`, transformOrigin: '540px 1100px' }}>
      <Silhouette x={300} y={560} teinte={S.mossSoft} taille={0.95} />
      <Silhouette x={780} y={560} teinte={S.mossSoft} taille={0.95} />
      {[
        { nom: CARTONS.etiquettes.marie, x: 300 },
        { nom: CARTONS.etiquettes.jean, x: 780 },
      ].map((e) => (
        <div
          key={e.nom}
          style={{
            position: 'absolute',
            left: e.x,
            top: 480,
            transform: 'translateX(-50%)',
            padding: '8px 18px',
            borderRadius: 16,
            background: S.paper,
            boxShadow: '0 10px 22px rgba(42,38,32,0.14)',
            fontFamily: P.sans,
            fontWeight: 600,
            fontSize: 30,
            color: S.ink,
          }}
        >
          {e.nom}
        </div>
      ))}
      <Page x={jean.x} y={jean.y} lignes={CARTONS.cahierJean} rotation={2 - 4 * echange} />
      <Page x={marie.x} y={marie.y} lignes={CARTONS.cahierMarie} rotation={-2 + 4 * echange + froisse}>
        {/* La main invisible du correcteur : « ✓ » devant Q1, « ? » devant Q11, rature et réécriture. */}
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={PAGE_CAHIER.largeur} height={PAGE_CAHIER.hauteur}>
          <path
            d={`M 14 ${hautLigne(1) - 18} L 26 ${hautLigne(1) - 6} L 48 ${hautLigne(1) - 34}`}
            fill="none"
            stroke={S.clay}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={60}
            strokeDashoffset={60 * (1 - coche)}
          />
          {rature > 0 ? (
            <path
              d={`M 70 ${hautLigne(2) - 14} q 30 -10 60 0 t 60 0 t 60 0`}
              fill="none"
              stroke={S.clay}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={200}
              strokeDashoffset={200 * (1 - rature)}
            />
          ) : null}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: hautLigne(2) - 44,
            fontFamily: P.serif,
            fontWeight: 600,
            fontSize: 44,
            color: S.clay,
            transform: `scale(${doute})`,
          }}
        >
          ?
        </div>
        <div
          style={{
            position: 'absolute',
            left: 74,
            top: hautLigne(3) - 26,
            fontFamily: P.serif,
            fontStyle: 'italic',
            fontSize: 24,
            color: S.clay,
            whiteSpace: 'nowrap',
            clipPath: `inset(0 ${(1 - reecrit) * 100}% 0 0)`,
          }}
        >
          {CARTONS.reecriture}
        </div>
      </Page>
    </AbsoluteFill>
  );
};

export const P2Cahiers: React.FC = () => {
  const { legendes } = useEtude();
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P2}>
        <P2Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p2} duree={DUREE_P2} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P3 — Les notes se perdent

const LIVRE = { x: 120, y: 980, largeur: 840 };

/** La feuille volante, lignée, écrite au crayon. */
const Feuille: React.FC<{ ecrites: number }> = ({ ecrites }) => {
  const { cartons: CARTONS } = useEtude();
  return (
  <div
    style={{
      width: 260,
      height: 400,
      borderRadius: 6,
      background: S.paper2,
      boxShadow: '0 14px 30px rgba(42,38,32,0.2)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 90 + i * 56, height: 2, background: S.hair }} />
    ))}
    {CARTONS.feuille.map((l, i) => {
      const p = Math.max(0, Math.min(1, ecrites - i));
      return p <= 0 ? null : (
        <div
          key={l}
          style={{
            position: 'absolute',
            left: 28,
            top: 90 + i * 56 - 40,
            fontFamily: P.serif,
            fontStyle: 'italic',
            fontSize: 34,
            color: S.ink2,
            whiteSpace: 'nowrap',
            clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
          }}
        >
          {l}
        </div>
      );
    })}
  </div>
  );
};

const P3Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pose = ressort(f, fps, 0, 16);
  const ecrites = Math.max(0, (f - 14) / 9);
  const fermeture = doux(f, [60, 78], [0, 1]);
  const envol = doux(f, [80, 110], [0, 1]);
  const page = LIVRE.largeur / 2;
  // La feuille dépasse du haut de la page de droite ; le livre fermé, elle dépasse du livre.
  const base = { x: LIVRE.x + page + 40 - (page + 10) * fermeture, y: LIVRE.y - 190 };
  return (
    <AbsoluteFill style={{ opacity: borne(pose * 1.4), transform: `translateY(${(1 - pose) * 60}px)` }}>
      <Silhouette x={540} y={560} teinte={S.moss} taille={0.95} />
      {/* La place de la feuille, en pointillé, une fois envolée. */}
      <div
        style={{
          position: 'absolute',
          left: base.x,
          top: base.y,
          width: 260,
          height: 400,
          borderRadius: 6,
          border: `5px dashed ${S.hairStrong}`,
          boxSizing: 'border-box',
          transform: 'rotate(4deg)',
          opacity: doux(f, [92, 104], [0, 1]),
        }}
      />
      <div style={{ position: 'absolute', left: LIVRE.x, top: LIVRE.y }}>
        <LivreOuvert largeur={LIVRE.largeur} fermeture={fermeture} />
      </div>
      {envol < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: base.x + envol * 700,
            top: base.y - envol * 900 + Math.sin(envol * Math.PI * 2) * 80,
            transform: `rotate(${4 + envol * 260}deg) scale(${1 - 0.3 * envol})`,
            opacity: 1 - doux(f, [100, 110], [0, 1]),
          }}
        >
          <Feuille ecrites={ecrites} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const P3Feuille: React.FC = () => {
  const { legendes } = useEtude();
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P3}>
        <P3Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p3} duree={DUREE_P3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P4 — Le dirigeant ne voit rien, la ville non plus

/** Pivot du recul de caméra (pixels vidéo). */
const PIVOT = { x: 540, y: 1300 };
const RECUL = 0.72;
const TETE_SAMUEL = 1000;

const P4Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons: CARTONS } = useEtude();
  const pose = ressort(f, fps, 0, 18);
  const recul = doux(f, [76, 96], [0, 1]);
  const echelle = 1 - (1 - RECUL) * recul;
  const ville = doux(f, [80, 98], [0, 1]);
  const trace = doux(f, [96, 100], [0, 1]);
  const brise = doux(f, [100, 104], [0, 1]);
  const interro = ressort(f, fps, 104, 11);
  const haut = 594;
  const bas = PIVOT.y + (TETE_SAMUEL - 20 - PIVOT.y) * RECUL;
  const milieu = (haut + bas) / 2;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${echelle})`, transformOrigin: `${PIVOT.x}px ${PIVOT.y}px` }}>
        <div style={{ position: 'absolute', inset: 0, opacity: borne(pose * 1.4) }}>
          <Silhouette x={540} y={TETE_SAMUEL} teinte={S.moss} taille={1.05} etiquette={CARTONS.etiquettes.samuel} />
        </div>
        {CARTONS.questions.map((q, i) => (
          <Question key={q} texte={q} echelle={ressort(f, fps, 14 + i * 14)} style={[{ left: 40, top: 820 }, { left: 560, top: 1060 }, { left: 70, top: 1520 }][i]} />
        ))}
      </div>

      {/* La ville, au-dessus : le lien vers l'assemblée se trace puis se brise. */}
      <div style={{ position: 'absolute', left: 290, top: 460 - (1 - ville) * 300, width: 500, opacity: ville }}>
        <div
          style={{
            padding: '22px 30px',
            borderRadius: 30,
            border: `4px solid ${S.sauge}`,
            background: 'rgba(251,245,230,0.9)',
            display: 'flex',
            alignItems: 'center',
            gap: 26,
          }}
        >
          <div style={{ position: 'relative', width: 70, height: 90 }}>
            <div style={{ position: 'absolute', left: 17, top: 0, width: 36, height: 36, borderRadius: 18, background: S.mossSoft }} />
            <div style={{ position: 'absolute', left: 0, top: 42, width: 70, height: 48, borderRadius: '35px 35px 10px 10px', background: S.mossSoft }} />
          </div>
          <div style={{ fontFamily: P.mono, fontWeight: 500, fontSize: 32, letterSpacing: 2, color: S.ink2 }}>{CARTONS.ville}</div>
        </div>
      </div>
      {trace > 0 ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1080} height={1920}>
          <line x1={540} y1={haut} x2={540} y2={haut + (milieu - haut) * trace - 40 * brise} stroke={S.sauge} strokeWidth={6} strokeDasharray="14 14" strokeLinecap="round" />
          <line x1={540} y1={bas} x2={540} y2={bas - (bas - milieu) * trace + 40 * brise} stroke={S.sauge} strokeWidth={6} strokeDasharray="14 14" strokeLinecap="round" />
        </svg>
      ) : null}
      <div style={{ position: 'absolute', left: 580, top: milieu - 70, fontFamily: P.serif, fontWeight: 600, fontSize: 110, color: S.clay, transform: `scale(${interro})` }}>?</div>
    </AbsoluteFill>
  );
};

export const P4RienDeVisible: React.FC = () => {
  const { legendes } = useEtude();
  const n = (a: number) => imageRalentie(a, POSES_P4);
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P4}>
        <P4Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p4Chacun} duree={DUREE_P4} debut={6} fin={n(74)} />
      <LegendeEtude lignes={legendes.p4Ville} duree={DUREE_P4} debut={n(80)} />
    </AbsoluteFill>
  );
};
