import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { MONTEE_PAYSAGE, Plateau, paysageVersVideo } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { CoucheePaysage } from '../../ui/CoucheePaysage';
import { Toucher } from '../../ui/Toucher';
import { versVideo } from '../../ui/Scene';
import { Feuille } from '../../evenements/ui/Feuille';
import { TUILE_DECLARER } from '../../evenements/ecrans/Accueil';
import { EcranDeclarer } from '../../evenements/ecrans/Declarer';
import { EcranStats } from '../../evenements/ecrans/Stats';
import { STATS } from '../../evenements/donnees';
import { TEXTES_JOURNAL } from '../../journal/textes';
import { EcranAccueil } from '../../etude/ecrans/Accueil';
import { DOCS, DOSSIERS, DOSSIER_ENSEIGNEMENTS } from '../../documents/donnees';
import { EcranEspace, H_LIGNE, centreLigne, hauteurDoc } from '../../documents/ecrans/EspaceDocuments';
import { EcranLecteur, defilementPage } from '../../documents/ecrans/Lecteur';
import { SOUS_TITRE_UMPJ } from '../../documents/plans/Retrouver';
import { TEXTES } from '../../textes';
import { CONTENU } from '../../donnees';
import { BOUTON_PLEIN_ECRAN, EcranParoles } from '../../ui/EcranParoles';
import { EcranPresentation, FLECHE_SUIVANTE } from '../../ui/EcranPresentation';
import { REDUCTION_PAYSAGE } from '../../plans/Plan5Combat';
import { CARTONS, LEGENDES } from '../textes';
import { BERNARD_ACCUEIL } from '../donnees';
import { BarreOnglets6, ONGLETS6, TamponGratuit } from '../ui/Habillage';
import { Appui, DUREE_PLAN, DeuxLegendes, PastillePersonne, Y_PASTILLE, haloEntre, lisse, montee, opacitePersonne } from './commun';

/**
 * Partie « 3 · Et aussi » :
 * - P7 : créer, déclarer, programmer un évènement (la tuile « Déclarer une action » de l'accueil,
 *   la feuille de déclaration d'« Évènements »), puis les statistiques jusqu'à la ville (région
 *   Île-de-France, « Par ville » : toutes les villes comptées — D-OFF-12) ; sur le téléphone de
 *   Bernard Lemoine, dirigeant senior de l'Île-de-France : la région n'est lisible que par qui la
 *   voit (revue du 27/10 — un dirigeant d'unité n'y a pas accès, 403 du serveur) ;
 * - P8 : lire les documents (espace Documents, un dossier, le lecteur — écrans de « Documents ») ;
 * - P9 : CMFIPraise, les chants et la projection plein écran (écrans de « Catégories de chants »,
 *   onde bleue de CMFIPraise : c'est l'autre application).
 */
export const DUREE_P7 = DUREE_PLAN;
export const DUREE_P8 = DUREE_PLAN;
export const DUREE_P9 = DUREE_PLAN;

// ---------------------------------------------------------------------------------------------
// P7 — Créer, déclarer, programmer ; les statistiques jusqu'à la ville

const A7 = { tuile: 40, statistiques: 124 } as const;
/**
 * Date de l'accueil : celle que la feuille de déclaration d'« Évènements » préremplit (« 14 octobre
 * 2026 · Aujourd'hui »), au format de l'accueil (`home.tsx` : « Octobre 14, 2026 », comme dans
 * « Journal »).
 */
const DATE_DECLARATION = TEXTES_JOURNAL.fr.app.dateAccueil;
/** Défilement des statistiques : les cartes « Par ville » (repris de P15 d'« Évènements »). */
const DEFILEMENT_VILLES = -560;
/** Index de Paris dans « Par ville » de l'Île-de-France. */
const CARTE_PARIS = STATS.idf.enfants.findIndex((c) => c.nom === 'Paris');

export const P7Evenements: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const feuille = lisse(f, fps, A7.tuile + 4, 22);
  const p = lisse(f, fps, A7.statistiques, 18);
  const accueil = (
    <>
      {/* D-OFF-12 (JP 27/10) : statistiques gratuites jusqu'à la ville, DANS le périmètre de lecture
          géographique de chacun. La région Île-de-France n'est lisible que par son dirigeant senior
          (ou LEADER / SECRETARIAT) : P7 se joue donc sur le téléphone de Bernard, pas de Samuel. */}
      <EcranAccueil date={DATE_DECLARATION} prenom={BERNARD_ACCUEIL.prenom} initiales={BERNARD_ACCUEIL.initiales} dirigeant />
      <BarreOnglets6 actif={ONGLETS6.accueil} />
    </>
  );
  return (
    <AbsoluteFill>
      <Plateau decalageY={montee(f, fps)} dessus={<Appui {...TUILE_DECLARER} a={A7.tuile} coupe={A7.tuile + 6} />}>
        <Pile
          p={p}
          dessous={
            <Feuille p={feuille} dessous={accueil}>
              <EcranDeclarer type="Campagne" haloDate={haloEntre(f, 72, 118)} />
            </Feuille>
          }
          dessus={
            <>
              <EcranStats niveau={STATS.idf} defilement={DEFILEMENT_VILLES} haloEnfant={{ index: CARTE_PARIS, intensite: haloEntre(f, 164, 238) }} />
              <BarreOnglets6 actif={ONGLETS6.evenements} />
            </>
          }
        />
      </Plateau>
      <TamponGratuit a={22} />
      <PastillePersonne x={540} y={Y_PASTILLE} opacite={opacitePersonne(f, DUREE_P7)}>
        {CARTONS.personnes.bernard}
      </PastillePersonne>
      <DeuxLegendes idee={LEGENDES.p7} explication={LEGENDES.p7Explication} bascule={A7.statistiques} duree={DUREE_P7} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P8 — Lire les documents

const A8 = { dossier: 56, doc: 112 } as const;

export const P8Documents: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dossier = centreLigne(DOSSIERS.map(() => H_LIGNE), 0);
  const doc = centreLigne(DOSSIER_ENSEIGNEMENTS.map(hauteurDoc), 0);
  const p1 = lisse(f, fps, A8.dossier + 4, 16);
  const p2 = lisse(f, fps, A8.doc + 4, 16);
  const defilement = doux(f, [150, 178, 206, 232], [0, defilementPage(2), defilementPage(2), defilementPage(3)]);
  return (
    <AbsoluteFill>
      <Plateau
        dessus={
          <>
            <Appui {...dossier} a={A8.dossier} coupe={A8.dossier + 6} />
            <Appui {...doc} a={A8.doc} coupe={A8.doc + 6} />
          </>
        }
      >
        <Pile
          p={p1}
          dessous={<EcranEspace dossiers={DOSSIERS} haloDossier={haloEntre(f, 24, 58)} />}
          dessus={
            <Pile
              p={p2}
              dessous={<EcranEspace dossier={DOSSIERS[0].nom} docs={DOSSIER_ENSEIGNEMENTS} halos={[haloEntre(f, 82, 114)]} />}
              dessus={<EcranLecteur doc={DOCS.umpj} sousTitre={SOUS_TITRE_UMPJ} defilement={defilement} />}
            />
          }
        />
      </Plateau>
      <TamponGratuit a={22} />
      <DeuxLegendes idee={LEGENDES.p8} explication={LEGENDES.p8Explication} bascule={130} duree={DUREE_P8} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P9 — CMFIPraise : les chants et la projection

const A9 = { pleinEcran: 104, suivant: 176 } as const;
const ROTATION = [110, 136] as const;

export const P9Chants: React.FC = () => {
  const f = useCurrentFrame();
  const textes = TEXTES.fr;
  const paroles = CONTENU.paroles.fr;
  const rotation = doux(f, [...ROTATION], [0, 90]);
  const reduction = doux(f, [...ROTATION], [1, REDUCTION_PAYSAGE]);
  const paysage = doux(f, [116, 130], [0, 1]);
  const diapo = doux(f, [A9.suivant + 2, A9.suivant + 16], [0, 1]);
  const pression = doux(f, [A9.pleinEcran - 2, A9.pleinEcran, A9.pleinEcran + 6], [0, 1, 0]);
  const appuiPleinEcran = versVideo(BOUTON_PLEIN_ECRAN.x, BOUTON_PLEIN_ECRAN.y);
  const appuiSuivant = paysageVersVideo(FLECHE_SUIVANTE.x, FLECHE_SUIVANTE.y, REDUCTION_PAYSAGE, MONTEE_PAYSAGE);
  return (
    <AbsoluteFill>
      <Plateau
        rotation={rotation}
        reduction={reduction}
        decalageY={doux(f, [...ROTATION], [0, MONTEE_PAYSAGE])}
        barreEtat={1 - paysage}
        dessus={
          <>
            <Toucher x={appuiPleinEcran.x} y={appuiPleinEcran.y} a={A9.pleinEcran} taille={40} />
            <Toucher x={appuiSuivant.x} y={appuiSuivant.y} a={A9.suivant} taille={36} />
          </>
        }
      >
        {paysage < 1 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - paysage }}>
            <EcranParoles textes={textes} paroles={paroles} pressionPleinEcran={pression} />
          </div>
        ) : null}
        {paysage > 0 ? (
          <CoucheePaysage opacite={paysage}>
            <EcranPresentation textes={textes} paroles={paroles} diapo={diapo} />
          </CoucheePaysage>
        ) : null}
      </Plateau>
      <TamponGratuit a={22} sortie={ROTATION[0] - 8} />
      <DeuxLegendes idee={LEGENDES.p9} explication={LEGENDES.p9Explication} bascule={A9.pleinEcran} duree={DUREE_P9} />
    </AbsoluteFill>
  );
};
