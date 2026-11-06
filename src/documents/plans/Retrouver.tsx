import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoAirplane } from 'react-icons/io5';
import { doux } from '../../anim';
import { S } from '../../evenements/theme';
import { PastilleCoin } from '../../evenements/ui/Habillage';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { DOCS, DOSSIERS, DOSSIER_ENSEIGNEMENTS } from '../donnees';
import { LEGENDES } from '../textes';
import { EcranAccueil, TUILE_DOCUMENTS } from '../ecrans/Accueil';
import { EcranEspace, H_LIGNE, centreLigne, hauteurDoc } from '../ecrans/EspaceDocuments';
import { EcranLecteur, defilementPage } from '../ecrans/Lecteur';
import { Appui, LegendeDocuments, Voile, lisse, montee, voilePour } from './commun';

/**
 * Partie « 2 · Retrouver » (P7) : Marie ouvre l'espace Documents depuis la tuile de l'accueil,
 * entre dans le dossier « Enseignements », ouvre l'enseignement de l'UMPJ ; le lecteur l'affiche,
 * puis le téléphone passe en mode avion et la lecture continue (le document lu en entier est gardé
 * sur l'appareil, D-DOC-13).
 */
export const DUREE_P7 = 420;

/** Appuis (images du plan). */
const A = { tuile: 46, dossier: 112, doc: 172 } as const;
/** Mode avion. */
const AVION = 252;

/** Sous-titre du lecteur : la catégorie (pas d'auteur dans les données fictives). */
export const SOUS_TITRE_UMPJ = 'Enseignements';

export const P7Dossiers: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dossier = centreLigne(DOSSIERS.map(() => H_LIGNE), 0);
  const doc = centreLigne(DOSSIER_ENSEIGNEMENTS.map(hauteurDoc), 0);
  const p1 = lisse(f, fps, A.tuile + 4, 16);
  const p2 = lisse(f, fps, A.dossier + 4, 16);
  const p3 = lisse(f, fps, A.doc + 4, 16);
  const zoom = doux(f, [56, 72, 196, 212], [1, 1.28, 1.28, 1]);
  const defilement = doux(f, [214, 244, 290, 318, 350, 380], [0, defilementPage(2), defilementPage(2), defilementPage(3), defilementPage(3), defilementPage(4)]);
  const avion = doux(f, [AVION, AVION + 10], [0, 1]);
  const badge = spring({ frame: f - AVION, fps, config: { damping: 12 } });

  const racine = <EcranEspace dossiers={DOSSIERS} haloDossier={doux(f, [84, 94, 106, 112], [0, 1, 1, 0])} />;
  const dansDossier = <EcranEspace dossier={DOSSIERS[0].nom} docs={DOSSIER_ENSEIGNEMENTS} halos={[doux(f, [146, 156, 166, 172], [0, 1, 1, 0])]} />;
  const lecteur = <EcranLecteur doc={DOCS.umpj} sousTitre={SOUS_TITRE_UMPJ} defilement={defilement} />;

  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: 330 }}
        decalageY={montee(f, fps)}
        avion={avion}
        dessus={
          <>
            <Appui {...TUILE_DOCUMENTS} a={A.tuile} coupe={A.tuile + 6} />
            <Appui {...dossier} a={A.dossier} coupe={A.dossier + 6} />
            <Appui {...doc} a={A.doc} coupe={A.doc + 6} />
          </>
        }
      >
        <Pile
          p={p1}
          dessous={<EcranAccueil haloTuile={doux(f, [20, 30, 40, 46], [0, 1, 1, 0])} />}
          dessus={<Pile p={p2} dessous={racine} dessus={<Pile p={p3} dessous={dansDossier} dessus={lecteur} />} />}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <PastilleCoin echelle={badge}>
        <IoAirplane size={80} color={S.moss} />
      </PastilleCoin>
      <LegendeDocuments lignes={LEGENDES.p7Dossiers} duree={DUREE_P7} fin={210} />
      <LegendeDocuments lignes={LEGENDES.p7HorsLigne} duree={DUREE_P7} debut={AVION - 6} />
    </AbsoluteFill>
  );
};
