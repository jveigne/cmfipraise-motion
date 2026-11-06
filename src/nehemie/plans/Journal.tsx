import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { PT_JOURNAL, PageJournal } from '../ecrans/Pages';
import { LARGEUR_PDF, PdfJournal } from '../ecrans/PdfJournal';
import { LEGENDES } from '../textes';
import { Curseur, trajet } from '../ui/Navigateur';
import { Fenetre, Legende, compteur, haloEntre } from './commun';

/**
 * Partie « 2 · Le journal de la ville » (P7) : la Vie d'assemblée de toute la ville en octobre
 * 2026 — réunions, présence, fractions de pain, l'alerte « Deïdo » — des nombres, jamais de noms
 * (D-OFF-05) ; puis le journal PDF de la ville (nombre de présents seulement).
 */
export const DUREE_P7 = 360;

/** Défilement (px CSS) qui amène le tableau « Par assemblée » sous les yeux. */
const DEFILEMENT_TABLE = -250;

export const P7Journal: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const A = { pdf: 262 };
  const defilement = DEFILEMENT_TABLE * doux(f, [104, 124, 226, 242], [0, 1, 1, 0]);
  const c = trajet(f, [236, A.pdf - 4], [{ x: 300, y: 520 }, PT_JOURNAL.boutonPdf]);
  const curseur = doux(f, [234, 240], [0, 1]) * (1 - doux(f, [A.pdf + 8, A.pdf + 14], [0, 1]));
  const pdf = spring({ frame: f - (A.pdf + 4), fps, config: { damping: 20, mass: 0.9 } });
  const voile = doux(f, [A.pdf + 2, A.pdf + 16], [0, 1]);
  return (
    <AbsoluteFill>
      <Fenetre dessus={<Curseur x={c.x} y={c.y} clic={A.pdf} opacite={curseur} />}>
        <PageJournal
          compte={compteur(f, 8, 40)}
          haloSection={haloEntre(f, 2, 44)}
          haloAlerte={haloEntre(f, 110, 186)}
          haloTable={haloEntre(f, 190, 232)}
          haloBouton={haloEntre(f, A.pdf - 12, A.pdf + 8)}
          defilement={defilement}
        />
      </Fenetre>
      {voile > 0.001 ? <AbsoluteFill style={{ background: `rgba(20,39,31,${0.38 * voile})` }} /> : null}
      {pdf > 0.001 ? (
        <div style={{ position: 'absolute', left: (1080 - LARGEUR_PDF) / 2, top: 440 + (1 - pdf) * 1500 }}>
          <PdfJournal haloPresents={haloEntre(f, 300, 356)} />
        </div>
      ) : null}
      <Legende lignes={LEGENDES.p7Reunions} duree={DUREE_P7} fin={100} />
      <Legende lignes={LEGENDES.p7Alerte} duree={DUREE_P7} debut={106} fin={184} />
      <Legende lignes={LEGENDES.p7Nombres} duree={DUREE_P7} debut={190} fin={258} />
      <Legende lignes={LEGENDES.p7Pdf} duree={DUREE_P7} debut={266} />
    </AbsoluteFill>
  );
};
