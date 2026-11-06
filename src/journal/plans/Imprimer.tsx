import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { CENTRE_TEL, versVideo } from '../../ui/Scene';
import { Bascule } from '../../evenements/ui/Bascule';
import { Journal, useJournal } from '../langue';
import { DUREE_I1 } from '../calage';
import { EcranVieAssemblee, PT_VIE } from '../ecrans/VieAssemblee';
import { EcranJournalPdf, ptJournal } from '../ecrans/JournalPdf';
import { FeuillePartage, PT_PARTAGE } from '../ecrans/Partage';
import { PAGE, PageJournal } from '../ui/Pages';
import { Classeur } from '../ui/Illustrations';
import { Appui, Decale, LegendeJournal, Voile, borne, lisse, voilePour } from './commun';

/**
 * Partie « 3 · Imprimer » (P13–P15) : le Journal PDF. On choisit la périodicité et la période, on
 * génère ; le document — la synthèse en tête, puis chaque compte rendu dans l'ordre — sort sur
 * l'entrée de l'orchestre (début de P14, 70,5 s du chant). Il se partage et s'imprime ; année après
 * année, les journaux se rangent (réponse à la pile de cahiers de P4).
 *
 * Dans l'app, « Générer le PDF » ouvre directement la feuille de partage : il n'y a pas d'aperçu.
 * Les pages dessinées hors du téléphone sont une annotation vidéo, au contenu réel du fichier.
 */
export { DUREE_I1 };
export const DUREE_I2 = 165;
export const DUREE_I3 = 90;

/** « Générer le PDF » : 27 images avant la fin de P13 (le chargement tient jusqu'à l'orchestre). */
const GENERER = DUREE_I1 - 27;

/** Écran du Journal PDF selon l'avancement de P13 (Mois → Année 2026 → Année 2025 → génération). */
const journalA = ({ app, d }: Journal, f: number, halos: { pastilles?: number; compte?: number; contenu?: number; generer?: number } = {}) => {
  const annee = f >= 114;
  const bascule = doux(f, [138, 144], [0, 1]);
  return (
    <EcranJournalPdf
      periodicite={annee ? 3 : 0}
      periode={annee ? <Bascule de={2026} a={2025} p={bascule} hauteur={34} /> : d.PERIODE_MOIS}
      suivantInactif={!annee || f < 140}
      compte={app.journal.reportCount(!annee ? 2 : f < 140 ? 38 : d.JOURNAL_2025.reunions)}
      generation={f >= GENERER + 2}
      haloPastilles={halos.pastilles}
      haloCompte={halos.compte}
      haloContenu={halos.contenu}
      haloGenerer={halos.generer}
    />
  );
};

// ---------------------------------------------------------------------------------------------
// P13 — Journal PDF : périodicité, période, « Générer le PDF »

export const I1Periode: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const j = useJournal();
  const pt = ptJournal(j.langue);
  const zoom = doux(f, [66, 80, 190, 204], [1, 1.3, 1.3, 1]);
  const vie =
    f < 8 ? (
      <EcranVieAssemblee onglet="avancement" />
    ) : (
      <EcranVieAssemblee onglet="reunions" reunions={[j.d.REUNION_DU_JOUR, ...j.d.REUNIONS_2026]} haloJournal={doux(f, [14, 22, 34, 40], [0, 1, 1, 0])} />
    );
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={pt.periodicite}
        dessus={
          <>
            <Appui {...PT_VIE.segmentReunions} a={8} />
            <Appui {...PT_VIE.journalPdf} a={40} coupe={48} />
            <Appui {...pt.annee} a={114} />
            <Appui {...pt.precedente} a={138} />
            <Appui {...pt.generer} a={GENERER} />
          </>
        }
      >
        <Pile
          p={lisse(f, fps, 44, 16)}
          dessous={vie}
          dessus={journalA(j, f, {
            pastilles: doux(f, [72, 80, 100, 108], [0, 1, 1, 0]),
            compte: doux(f, [146, 154, 188, 196], [0, 1, 1, 0]),
            contenu: doux(f, [200, 206, 216, 222], [0, 1, 1, 0]),
            generer: doux(f, [GENERER - 8, GENERER - 2, GENERER, GENERER + 4], [0, 1, 1, 0]),
          })}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendeJournal lignes={j.legendes.p13Pdf} duree={DUREE_I1} debut={6} fin={110} />
      <LegendeJournal lignes={j.legendes.p13Annee} duree={DUREE_I1} debut={116} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Pages qui sortent de la vignette (P14) et se rangent en classeur (P15)

/** Réduction de page à l'écran, et position finale des trois pages (pixels vidéo). */
const E_PAGE = 0.74;
const POSES = [
  { x: 446, y: 540, r: 0 },
  { x: 476, y: 512, r: 3.5 },
  { x: 506, y: 486, r: 7 },
];

/** Position vidéo d'un point d'écran (points) une fois le téléphone décalé et réduit. */
const versDecale = (x: number, y: number, dx: number, r: number) => {
  const v = versVideo(x, y);
  return { x: CENTRE_TEL.x + r * (v.x - CENTRE_TEL.x) + dx, y: CENTRE_TEL.y + r * (v.y - CENTRE_TEL.y) };
};

/** Décalage du téléphone pendant P14 et P15. */
const DEC_P14 = { dx: -300, r: 0.6 };
const DEC_P15 = { dx: -250, r: 0.62 };

/** Caméra de P14 : zoom sur la synthèse (i 30 → 84), puis sur le premier compte rendu. */
const FOYERS = {
  synthese: { x: POSES[0].x + (PAGE.largeur / 2) * E_PAGE, y: POSES[0].y + 235 * E_PAGE },
  premier: { x: POSES[0].x + (PAGE.largeur / 2) * E_PAGE, y: POSES[0].y + 560 * E_PAGE },
};
const CIBLE = { x: 540, y: 1000 };
const ZOOM_PAGE = 1.8;

const Pages: React.FC<{ f: number; fps: number; source: { x: number; y: number }; rangement: number; haloSynthese: number; haloPremier: number }> = ({
  f,
  fps,
  source,
  rangement,
  haloSynthese,
  haloPremier,
}) => (
  <>
    {[2, 1, 0].map((k) => {
      // Ressort, 4 images d'écart (page 1 la première) : les pages jaillissent de la vignette.
      const s = spring({ frame: f - (6 + 4 * k), fps, config: { damping: 15, mass: 0.8 } });
      const pose = POSES[k];
      // P14, fin : les pages 2 et 3 se rangent derrière la page 1.
      const pile = doux(f, [140, 158], [0, 1]);
      const cx = pose.x + (POSES[0].x - pose.x) * pile;
      const cy = pose.y + (POSES[0].y - pose.y) * pile;
      const r = pose.r * (1 - pile);
      const debutX = source.x - (PAGE.largeur * E_PAGE) / 2;
      const debutY = source.y - (PAGE.hauteur * E_PAGE) / 2;
      const echelle = 0.06 + 0.94 * s;
      if (f < 6 + 4 * k) return null;
      return (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: debutX + (cx - debutX) * s,
            top: debutY + (cy - debutY) * s,
            transform: `rotate(${r}deg) scale(${echelle})`,
            transformOrigin: '50% 50%',
            opacity: borne(s * 3) * (1 - rangement),
          }}
        >
          <PageJournal numero={(k + 1) as 1 | 2 | 3} echelle={E_PAGE} haloSynthese={k === 0 ? haloSynthese : 0} haloPremier={k === 0 ? haloPremier : 0} />
        </div>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------------------------
// P14 — Le PDF : la synthèse, puis chaque réunion (entrée de l'orchestre)

export const I2Pdf: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const j = useJournal();
  const decale = doux(f, [0, 18], [0, 1]);
  const dx = DEC_P14.dx * decale;
  const r = 1 - (1 - DEC_P14.r) * decale;
  const source = versDecale(PT_PARTAGE.vignette.x, PT_PARTAGE.vignette.y, DEC_P14.dx, DEC_P14.r);
  // Caméra : zoom sur la synthèse (i 30 → 44), descente sur « 8 janvier 2025 » (i 88 → 108),
  // dézoom (i 140 → 158).
  const z = doux(f, [30, 44, 140, 158], [1, ZOOM_PAGE, ZOOM_PAGE, 1]);
  const vers = doux(f, [88, 108], [0, 1]);
  const foyer = {
    x: FOYERS.synthese.x + (FOYERS.premier.x - FOYERS.synthese.x) * vers,
    y: FOYERS.synthese.y + (FOYERS.premier.y - FOYERS.synthese.y) * vers,
  };
  const k = (z - 1) / (ZOOM_PAGE - 1);
  const camera = `translate(${(CIBLE.x - foyer.x) * k}px, ${(CIBLE.y - foyer.y) * k}px) scale(${z})`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: camera, transformOrigin: `${foyer.x}px ${foyer.y}px` }}>
        <Decale dx={dx} reduction={r}>
          <Plateau>
            <FeuillePartage p={lisse(f, fps, 0, 12)} fichier={j.d.JOURNAL_2025.fichier} dessous={journalA(j, 1000)} />
          </Plateau>
        </Decale>
        <Pages
          f={f}
          fps={fps}
          source={source}
          rangement={0}
          haloSynthese={doux(f, [44, 52, 76, 84], [0, 1, 1, 0])}
          haloPremier={doux(f, [108, 116, 132, 140], [0, 1, 1, 0])}
        />
      </AbsoluteFill>
      <Voile force={voilePour(z)} />
      <LegendeJournal lignes={j.legendes.p14Synthese} duree={DUREE_I2} debut={6} fin={84} />
      <LegendeJournal lignes={j.legendes.p14Reunions} duree={DUREE_I2} debut={90} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P15 — Imprimer ; les années rangées

/** Rangée de classeurs (pixels vidéo) : 2017 → 2024 déjà là, 2025 vient se ranger au bout. */
const RANGEE = { x: 560, y: 1060, pas: 56 };

export const I3Imprimer: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const j = useJournal();
  const vers = doux(f, [0, 10], [0, 1]);
  const dx = DEC_P14.dx + (DEC_P15.dx - DEC_P14.dx) * vers;
  const r = DEC_P14.r + (DEC_P15.r - DEC_P14.r) * vers;
  // Les pages se referment en classeur et glissent dans la rangée (i 30 → 54).
  const ferme = doux(f, [30, 50], [0, 1]);
  const page1 = { x: POSES[0].x, y: POSES[0].y, l: PAGE.largeur * E_PAGE, h: PAGE.hauteur * E_PAGE };
  const cible = { x: RANGEE.x + 8 * RANGEE.pas, y: RANGEE.y, l: 50, h: 300 };
  const sortie = doux(f, [78, 90], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: 1 - sortie, transform: `translateY(${sortie * 120}px)` }}>
      <Decale dx={dx} reduction={r}>
        <Plateau dessus={<Appui {...PT_PARTAGE.imprimer} a={26} />}>
          <FeuillePartage p={1} fichier={j.d.JOURNAL_2025.fichier} dessous={journalA(j, 1000)} haloImprimer={doux(f, [12, 18, 24, 30], [0, 1, 1, 0])} />
        </Plateau>
      </Decale>
      {/* La page 1 (les deux autres sont rangées derrière) devient le classeur « 2025 ». */}
      {ferme < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: page1.x + (cible.x - page1.x) * ferme,
            top: page1.y + (cible.y - page1.y) * ferme,
            width: page1.l,
            height: page1.h,
            transform: `scale(${1 + (cible.l / page1.l - 1) * ferme}, ${1 + (cible.h / page1.h - 1) * ferme})`,
            transformOrigin: '0 0',
            opacity: 1 - doux(f, [40, 50], [0, 1]),
          }}
        >
          <PageJournal numero={1} echelle={E_PAGE} />
        </div>
      ) : null}
      {Array.from({ length: 9 }, (_, i) => {
        const annee = 2017 + i;
        const a = annee === 2025 ? 44 : 30 + i * 2;
        const p = spring({ frame: f - a, fps, config: { damping: 14 } });
        if (f < a) return null;
        return (
          <div
            key={annee}
            style={{
              position: 'absolute',
              left: RANGEE.x + i * RANGEE.pas,
              top: RANGEE.y + (1 - p) * 40,
              opacity: borne(p * 1.5),
            }}
          >
            <Classeur annee={annee} />
          </div>
        );
      })}
      <LegendeJournal lignes={j.legendes.p15} duree={DUREE_I3} />
    </AbsoluteFill>
  );
};
