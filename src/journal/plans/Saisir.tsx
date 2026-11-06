import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { ONGLETS, centreOnglet } from '../../evenements/ui/app';
import type { Langue } from '../../textes';
import { formatChapitres } from '../textes';
import { Journal, useJournal } from '../langue';
import { EcranVieAssemblee, PT_VIE } from '../ecrans/VieAssemblee';
import { EcranFormulaire, PT_FORM, texteCR } from '../ecrans/Formulaire';
import { EcranCompteRendu, PT_CR } from '../ecrans/CompteRendu';
import { Appui, LegendeJournal, Voile, lisse, montee, voilePour } from './commun';

/**
 * Partie « 1 · Saisir » (P7–P10) : Thomas Lefèvre, dirigeant de Paris Nord (EN : Thomas Walker,
 * Leeds North), fait le compte rendu
 * de la réunion du jour (mercredi 14 octobre 2026) — présents cochés, fraction de pain, chapitres
 * lus ; le texte s'écrit tout seul et se copie pour WhatsApp.
 */
export const DUREE_S1 = 120;
export const DUREE_S2 = 180;
export const DUREE_S3 = 210;
export const DUREE_S4 = 105;

/**
 * Positions du formulaire relevées sur l'écran redessiné (points, défilement nul) : pastille du
 * livre en cours, cases 13 et 14, centre de la grille, aperçu, bouton « Enregistrer le CR ».
 */
const PT = {
  ongletAssemblee: centreOnglet(ONGLETS.assemblee),
  livre: { x: 195, y: 977 },
  chapitre: (n: number) => ({ x: 36 + 22 + ((n - 1) % 6) * 52, y: 1187 + 22 + Math.floor((n - 1) / 6) * 52 }),
  grille: { x: 195, y: 1290 },
  apercu: { x: 195, y: 1800 },
  enregistrer: { x: 195, y: 2072 },
};

/** Défilements du formulaire : fraction de pain (P8), lecture, aperçu, bouton (P9). */
const DEF = { pain: -230, lecture: -700, apercu: -1420, bouton: -1640 };
/**
 * En anglais, l'aide sous la grille (« A dot marks a chapter the assembly has already read. »)
 * passe sur deux lignes : tout ce qui la suit descend de 18 points, l'aperçu et le bouton
 * défilent d'autant de plus pour rester à la même place à l'image (JournalEN, 14/10/2026).
 */
const decalageAide = (langue: Langue) => (langue === 'en' ? -18 : 0);
/** Défilement du compte rendu enregistré jusqu'à l'aperçu (P10). */
const DEF_CR = -700;

/** Texte du CR du jour, selon l'avancement de la saisie (l'aperçu suit chaque geste). */
const texteDuJour = (j: Journal, presents: readonly string[], pain: boolean, chapitres: readonly number[]) =>
  texteCR(j, {
    date: j.d.DATE_CR,
    presents,
    pain,
    livre: chapitres.length === 0 ? null : j.d.LIVRES.eglise,
    chapitres: formatChapitres(j.app, chapitres),
    avecNoms: true,
  });

// ---------------------------------------------------------------------------------------------
// P7 — L'onglet Assemblée, « Nouveau CR »

export const S1NouveauCr: React.FC = () => {
  const f = useCurrentFrame();
  const j = useJournal();
  const { fps } = useVideoConfig();
  const zoom = doux(f, [14, 30, 44, 58], [1, 1.3, 1.3, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: PT.ongletAssemblee.y - 60 }}
        decalageY={montee(f, fps)}
        dessus={<Appui {...PT_VIE.nouveauCr} a={84} coupe={92} />}
      >
        <Pile
          p={lisse(f, fps, 88, 16)}
          dessous={
            <EcranVieAssemblee
              onglet="reunions"
              reunions={j.d.REUNIONS_2026}
              haloOnglet={doux(f, [20, 28, 40, 48], [0, 1, 1, 0])}
              haloNouveau={doux(f, [58, 66, 82, 88], [0, 1, 1, 0])}
            />
          }
          dessus={<EcranFormulaire coches={[]} pain={0} livreChoisi={false} chapitres={[]} texte={texteDuJour(j, [], false, [])} />}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendeJournal lignes={j.legendes.p7} duree={DUREE_S1} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P8 — Présents cochés, fraction de pain

export const S2Presents: React.FC = () => {
  const f = useCurrentFrame();
  const j = useJournal();
  const { ROSTER, ABSENTS_DU_JOUR } = j.d;
  // « Tout cocher » à i 40 : les 11 cases se cochent en cascade (1 image d'écart). Puis Hugo
  // Chevalier / Henry Cooper (i 64) et Léa Bonnet / Lucy Bennett (i 80) sont décochés : 9 présents.
  const cascade = Math.max(0, Math.min(ROSTER.length, f - 40));
  let coches = ROSTER.slice(0, cascade).map((p) => p.nom);
  if (f >= 64) coches = coches.filter((n) => n !== ABSENTS_DU_JOUR[0]);
  if (f >= 80) coches = coches.filter((n) => n !== ABSENTS_DU_JOUR[1]);
  const zoom = doux(f, [30, 44, 92, 104], [1, 1.25, 1.25, 1]);
  const defilement = doux(f, [104, 124], [0, DEF.pain]);
  const pain = doux(f, [136, 142], [0, 1]);
  const hugo = PT_FORM.personne(4);
  const lea = PT_FORM.personne(6);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: 520 }}
        dessus={
          <>
            <Appui {...PT_FORM.toutCocher} a={40} />
            <Appui {...hugo} a={64} />
            <Appui {...lea} a={80} />
            <Appui x={PT_FORM.interrupteurPain.x} y={PT_FORM.interrupteurPain.y + DEF.pain} a={136} />
          </>
        }
      >
        <EcranFormulaire
          defilement={defilement}
          coches={coches}
          pain={pain}
          livreChoisi={false}
          chapitres={[]}
          texte={texteDuJour(j, coches, pain > 0.5, [])}
          haloDate={doux(f, [6, 12, 24, 30], [0, 1, 1, 0])}
          haloPain={doux(f, [140, 148, 166, 174], [0, 1, 1, 0])}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendeJournal lignes={j.legendes.p8} duree={DUREE_S2} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P9 — Chapitres lus ; le texte s'écrit seul ; enregistrer

export const S3Chapitres: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const j = useJournal();
  /** Formulaire en fin de P8 (et tout au long de P9) : les 9 présents. */
  const cochesFin = j.d.PRESENTS_DU_JOUR;
  const livreChoisi = f >= 22;
  const chapitres = [...(f >= 54 ? [13] : []), ...(f >= 66 ? [14] : [])];
  const da = decalageAide(j.langue);
  const defilement = doux(f, [0, 14, 112, 132, 178, 192], [DEF.pain, DEF.lecture, DEF.lecture, DEF.apercu + da, DEF.apercu + da, DEF.bouton + da]);
  // Deux zooms : sur la grille (i 36 → 112), puis sur le texte du CR (i 132 → 178).
  const zoomGrille = doux(f, [36, 50, 100, 112], [1, 1.3, 1.3, 1]);
  const zoomTexte = doux(f, [132, 146, 172, 184], [1, 1.35, 1.35, 1]);
  const zoom = f < 120 ? zoomGrille : zoomTexte;
  const foyer = f < 120 ? { x: 195, y: PT.grille.y + DEF.lecture } : { x: 195, y: PT.apercu.y + DEF.apercu };
  const formulaire = (
    <EcranFormulaire
      defilement={defilement}
      coches={cochesFin}
      pain={1}
      livreChoisi={livreChoisi}
      grille={doux(f, [26, 36], [0, 1])}
      chapitres={chapitres}
      texte={texteDuJour(j, cochesFin, true, chapitres)}
      haloPoints={doux(f, [72, 80, 94, 100], [0, 1, 1, 0])}
      haloLignes={doux(f, [148, 156, 172, 178], [0, 1, 1, 0])}
    />
  );
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={foyer}
        dessus={
          <>
            <Appui x={PT.livre.x} y={PT.livre.y + DEF.lecture} a={22} />
            <Appui x={PT.chapitre(13).x} y={PT.chapitre(13).y + DEF.lecture} a={54} />
            <Appui x={PT.chapitre(14).x} y={PT.chapitre(14).y + DEF.lecture} a={66} />
            <Appui x={PT.enregistrer.x} y={PT.enregistrer.y + DEF.bouton} a={196} coupe={202} />
          </>
        }
      >
        {/* Enregistrer : on arrive sur le compte rendu (`router.replace` vers `meeting/[id]`). */}
        <Pile p={doux(f, [198, 210], [0, 1])} dessous={formulaire} dessus={<EcranCompteRendu />} />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendeJournal lignes={j.legendes.p9} duree={DUREE_S3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P10 — Copier pour WhatsApp

export const S4Copier: React.FC = () => {
  const f = useCurrentFrame();
  const { legendes } = useJournal();
  const defilement = doux(f, [10, 30], [0, DEF_CR]);
  const zoom = doux(f, [50, 62, 90, 104], [1, 1.3, 1.3, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: PT_CR.copier.y + DEF_CR + 40 }}
        dessus={<Appui x={PT_CR.copier.x} y={PT_CR.copier.y + DEF_CR} a={44} />}
      >
        <EcranCompteRendu defilement={defilement} copie={doux(f, [46, 52], [0, 1])} haloCopie={doux(f, [54, 62, 86, 94], [0, 1, 1, 0])} />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendeJournal lignes={legendes.p10} duree={DUREE_S4} />
    </AbsoluteFill>
  );
};
