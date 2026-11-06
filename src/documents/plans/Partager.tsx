import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { DOCS, PAGES_OFFERTES } from '../donnees';
import { CARTONS, LEGENDES } from '../textes';
import { EcranAmi, EcranGroupe, PT_APERCU_RECU } from '../ecrans/ApercuLien';
import { EcranLecteur, PT_LECTEUR, defilementPage } from '../ecrans/Lecteur';
import { SOUS_TITRE_UMPJ } from './Retrouver';
import { Appui, LegendeDocuments, Voile, lisse, montee, voilePour } from './commun';

/**
 * Partie « 4 · Partager » (P9) : Marie partage l'enseignement depuis le lecteur ; le lien arrive
 * dans le groupe de P1, avec sa carte d'aperçu (couverture, titre, description, domaine). Puis le
 * téléphone d'un ami sans compte : il ouvre le lien, lit les 5 pages offertes (« Aperçu — page 5
 * sur 5 offertes »), et le mur l'invite à se connecter ou à créer son compte (RG-DOC-01).
 *
 * Écart assumé : entre l'appui sur « Partager » et la conversation, la feuille de partage du
 * système n'est pas montrée (storyboard : « appui sur Partager → bulle de conversation »).
 */
export const DUREE_P9 = 510;

const A = { partager: 46, apercu: 298 } as const;
/** Image du passage au téléphone de l'ami. */
const COUPE = 242;

export const P9Partager: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Téléphone de Marie (i 0 → 262).
  const versGroupe = lisse(f, fps, A.partager + 4, 16);
  const envoi = lisse(f, fps, 80, 14);
  const zoomA = doux(f, [100, 116, 206, 222], [1, 1.3, 1.3, 1]);
  const glisse = doux(f, [COUPE, COUPE + 20], [0, 1]);

  // Téléphone de l'ami (i 242 → 510).
  const versLecteur = lisse(f, fps, A.apercu + 4, 16);
  const defilement = doux(f, [326, 420], [0, defilementPage(PAGES_OFFERTES)]);
  const mur = lisse(f, fps, 426, 18);

  return (
    <AbsoluteFill>
      {f < COUPE + 20 ? (
        <AbsoluteFill style={{ transform: `translateX(${-glisse * 1100}px)` }}>
          <Plateau
            zoom={zoomA}
            foyer={{ x: 230, y: 560 }}
            decalageY={montee(f, fps)}
            dessus={<Appui {...PT_LECTEUR.partager} a={A.partager} coupe={A.partager + 6} />}
          >
            <Pile
              p={versGroupe}
              dessous={<EcranLecteur doc={DOCS.umpj} sousTitre={SOUS_TITRE_UMPJ} haloPartager={doux(f, [22, 32, 40, 46], [0, 1, 1, 0])} />}
              dessus={<EcranGroupe envoi={envoi} haloApercu={doux(f, [118, 130, 192, 204], [0, 1, 1, 0])} />}
            />
          </Plateau>
          <Voile force={voilePour(zoomA)} />
        </AbsoluteFill>
      ) : null}

      {f >= COUPE ? (
        <AbsoluteFill style={{ transform: `translateX(${(1 - glisse) * 1100}px)` }}>
          <Plateau dessus={<Appui {...PT_APERCU_RECU} a={A.apercu} coupe={A.apercu + 6} />}>
            <Pile
              p={versLecteur}
              dessous={<EcranAmi haloApercu={doux(f, [272, 282, 292, 298], [0, 1, 1, 0])} />}
              dessus={
                <EcranLecteur
                  doc={DOCS.umpj}
                  sousTitre={SOUS_TITRE_UMPJ}
                  apercu
                  offertes={PAGES_OFFERTES}
                  defilement={defilement}
                  mur={mur}
                  haloBoutons={doux(f, [452, 464, 494, 506], [0, 1, 1, 0])}
                />
              }
            />
          </Plateau>
          <div
            style={{
              position: 'absolute',
              top: 330,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              opacity: doux(f, [COUPE + 14, COUPE + 26], [0, 1]),
            }}
          >
            <div style={{ padding: '8px 22px', borderRadius: 99, border: `2px solid ${S.ink3}`, fontFamily: P.mono, fontSize: 26, letterSpacing: 2.5, color: S.ink2 }}>
              {CARTONS.ami}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      <LegendeDocuments lignes={LEGENDES.p9Lien} duree={DUREE_P9} fin={COUPE + 6} />
      <LegendeDocuments lignes={LEGENDES.p9Suite} duree={DUREE_P9} debut={COUPE + 20} />
    </AbsoluteFill>
  );
};
