import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Textes } from '../textes';
import { CAT_COMBAT, CHANT_OUVERT, CONTENU } from '../donnees';
import { Legende } from '../ui/Legende';
import { EcranRecueils } from '../ui/EcranRecueils';
import { EcranListe } from '../ui/EcranListe';
import { EcranParoles, BOUTON_PLEIN_ECRAN } from '../ui/EcranParoles';
import { EcranPresentation, FLECHE_SUIVANTE } from '../ui/EcranPresentation';
import { CoucheePaysage } from '../ui/CoucheePaysage';
import { Pile } from '../ui/Pile';
import { MONTEE_PAYSAGE, Plateau, paysageVersVideo } from '../ui/Plateau';
import { Toucher } from '../ui/Toucher';
import { versVideo } from '../ui/Scene';
import { centreCategorie, doux } from '../anim';

/**
 * Plan 5 (19–26 s) : « Actions et combats », un chant, puis Plein écran : le téléphone
 * passe en paysage et affiche les paroles partie par partie.
 */
export const DUREE_PLAN5 = 210;

const APPUI_CAT = 10;
const OUVERTURE_CAT = 14;
const APPUI_CHANT = 48;
const OUVERTURE_CHANT = 52;
const APPUI_PLEIN_ECRAN = 98;
const ROTATION = [104, 130] as const;
const APPUI_SUIVANT = 164;

/** Réduction du téléphone en paysage, pour qu'il tienne dans la largeur de l'image. */
export const REDUCTION_PAYSAGE = 0.7;

export const Plan5Combat: React.FC<{ textes: Textes }> = ({ textes }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const langue = textes.langueListe;
  const categorie = CONTENU.categories[langue][CAT_COMBAT];
  const iChant = CHANT_OUVERT[langue];
  const paroles = CONTENU.paroles[langue];

  const ouvert = (a: number) => spring({ frame: f - a, fps, config: { damping: 200 }, durationInFrames: 18 });
  const pCat = ouvert(OUVERTURE_CAT);
  const pChant = ouvert(OUVERTURE_CHANT);

  const zoom = doux(f, [70, 88, 100, 112], [1, 1.3, 1.3, 1]);
  const rotation = doux(f, [...ROTATION], [0, 90]);
  const reduction = doux(f, [...ROTATION], [1, REDUCTION_PAYSAGE]);
  const paysage = doux(f, [112, 126], [0, 1]);
  const diapo = doux(f, [APPUI_SUIVANT + 2, APPUI_SUIVANT + 16], [0, 1]);
  const pression = doux(f, [APPUI_PLEIN_ECRAN - 2, APPUI_PLEIN_ECRAN, APPUI_PLEIN_ECRAN + 6], [0, 1, 0]);

  const appuiCat = versVideo(195, centreCategorie(CAT_COMBAT));
  const appuiChant = versVideo(195, 224 + 80 * iChant);
  const appuiPleinEcran = versVideo(BOUTON_PLEIN_ECRAN.x, BOUTON_PLEIN_ECRAN.y);
  const appuiSuivant = paysageVersVideo(FLECHE_SUIVANTE.x, FLECHE_SUIVANTE.y, REDUCTION_PAYSAGE, MONTEE_PAYSAGE);

  const liste = (
    <EcranListe
      textes={textes}
      titre={categorie.nom}
      total={categorie.chants}
      chants={CONTENU.combat[langue]}
      t={f - OUVERTURE_CAT}
      surbrillance={f > APPUI_CHANT - 6 ? iChant : null}
    />
  );

  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={BOUTON_PLEIN_ECRAN}
        rotation={rotation}
        reduction={reduction}
        decalageY={doux(f, [...ROTATION], [0, MONTEE_PAYSAGE])}
        barreEtat={1 - paysage}
        dessus={
          <>
            <Toucher x={appuiCat.x} y={appuiCat.y} a={APPUI_CAT} taille={40} />
            <Toucher x={appuiChant.x} y={appuiChant.y} a={APPUI_CHANT} taille={40} />
            <Toucher x={appuiPleinEcran.x} y={appuiPleinEcran.y} a={APPUI_PLEIN_ECRAN} taille={40} />
            <Toucher x={appuiSuivant.x} y={appuiSuivant.y} a={APPUI_SUIVANT} taille={36} />
          </>
        }
      >
        {paysage < 1 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - paysage }}>
            <Pile
              p={pChant}
              dessous={
                <Pile
                  p={pCat}
                  dessous={<EcranRecueils textes={textes} onglet={1} tCategorie={1000} />}
                  dessus={liste}
                />
              }
              dessus={<EcranParoles textes={textes} paroles={paroles} pressionPleinEcran={pression} />}
            />
          </div>
        ) : null}
        {paysage > 0 ? (
          <CoucheePaysage opacite={paysage}>
            <EcranPresentation textes={textes} paroles={paroles} diapo={diapo} />
          </CoucheePaysage>
        ) : null}
      </Plateau>
      <Legende lignes={textes.plan5} duree={DUREE_PLAN5} debut={2} delais={[0, 100]} taille={72} />
    </AbsoluteFill>
  );
};
