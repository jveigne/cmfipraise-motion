import React from 'react';
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoCalendarOutline, IoCloudOfflineOutline, IoLockClosed, IoPersonOutline } from 'react-icons/io5';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { APP, CARTONS, LEGENDES } from '../textes';
import {
  ASSEMBLEE,
  BADGE_REALISEES,
  CAMPAGNE_ELISE,
  CAMPAGNE_QUARTIER,
  COMPTEURS,
  CONCERT_ELISE,
  PERSONNES,
  REALISEES_PARIS_NORD,
} from '../donnees';
import { P, S } from '../theme';
import { EcranAccueil, TUILE_DECLARER } from '../ecrans/Accueil';
import { EcranConfirmation, EcranDeclarer } from '../ecrans/Declarer';
import { EcranVueMembre } from '../ecrans/VueMembre';
import { EcranProgrammer } from '../ecrans/Programmer';
import { BoutonRealise, DetailEvt, EcranCloture, EcranDetail } from '../ecrans/Detail';
import { Bouton, ONGLETS, PastilleProgramme, PastilleRealise, centreOnglet } from '../ui/app';
import { Bascule } from '../ui/Bascule';
import { Feuille } from '../ui/Feuille';
import { PastilleCoin } from '../ui/Habillage';
import { Appui, Fondu, LegendeShephr, Voile, lisse, montee, tape, voilePour } from './commun';

/**
 * Chapitre 1 — le membre (Élise, assemblée Paris Nord). Storyboard § 4, P1 à P7.
 * Chaque plan commence là où le précédent s'arrête : l'écran est continu d'un plan à l'autre.
 *
 * Rythme (retour JP 14/10, « ça avance trop rapidement ») : les gestes gardent leur vitesse
 * (montée de modale, défilement, bascule des compteurs) ; ce sont les poses qui s'allongent —
 * chaque information clé (date préremplie, bandeau de rattachement, compteur qui bascule,
 * pastille de statut) reste tenue ≈ 1 à 1,3 s, l'état final ≈ 1 s après la dernière animation.
 * Chapitre : 1 256 images (41,9 s) au lieu de 990 (33 s) — un premier passage à 1 510 images
 * menait le film à 147 s ; poses resserrées pour viser ≈ 2 min au total (JP 14/10). Revue du
 * 14/10 : P5 s'ouvre sur un appui sur « Accueil » (+ 10 images), pas sur une coupe sèche.
 */
export const DUREE_P1 = 116;
export const DUREE_P2 = 188;
export const DUREE_P3 = 176;
export const DUREE_P4 = 170;
/** Avant-plan de P5 : appui sur l'onglet « Accueil » depuis la vue membre de la fin de P4. */
const P5_ACCUEIL = 10;
/** Corps de P5 (de l'accueil jusqu'au détail « Programmé »), en images locales. */
const DUREE_P5_CORPS = 319;
export const DUREE_P5 = P5_ACCUEIL + DUREE_P5_CORPS;
export const DUREE_P6 = 171;
export const DUREE_P7 = 106;
/** P6 : fin de la légende « Le jour venu, marquez-la réalisée », au moment où s'ouvre la clôture. */
const P6_LEGENDE = 44;

/**
 * Légende d'un plan, posée à l'image 6 : son fondu de sortie s'achève sur la dernière image du
 * plan (`duree` - 1), comme dans `Dirigeant.tsx` — ni coupée à mi-fondu, ni figée en filigrane
 * sous l'intertitre qui suit P7 (le `Segment` gèle la dernière image ; revue du 14/10).
 */
const LegendePlan: React.FC<{ lignes: readonly string[]; duree: number }> = ({ lignes, duree }) => (
  <LegendeShephr lignes={lignes} duree={duree - 1 - 6} />
);

/** Positions d'écran relevées sur les écrans redessinés (points). */
const PT = {
  campagneDeclarer: { x: 156, y: 271 },
  dateDeclarer: { x: 195, y: 441 },
  enregistrer: { x: 195, y: 660 },
  bandeauDeclarer: { x: 195, y: 582 },
  titreConfirmation: { x: 195, y: 230 },
  mesActions: { x: 105, y: 387 },
  texteHorsLigne: { x: 195, y: 262 },
  compteurs: { x: 195, y: 263 },
  programmerMembre: { x: 284, y: 376 },
  ongletEvenements: centreOnglet(ONGLETS.evenements),
  ongletAccueil: centreOnglet(ONGLETS.accueil),
  // D-EVT-15 : l'intro de « Programmer » a pris une ligne (+ 20 pt) — tout ce qui la suit descend d'autant.
  campagneProgrammer: { x: 156, y: 347 },
  /**
   * D-EVT-16 : foyer du zoom de la saisie du prédicateur, à mi-chemin entre son champ (y 695) et
   * le bandeau « … pour l'assemblée Paris Nord. » (y 764), que le champ a fait descendre de 91 pt.
   */
  predicateurBandeauProgrammer: { x: 195, y: 730 },
  boutonProgrammer: { x: 195, y: 622 },
  realise: { x: 195, y: 722 },
  /**
   * D-EVT-15 : la grille des compteurs de la clôture a une ligne de plus et son indication (+ 112 pt) ;
   * D-EVT-16 / D-EVT-17 : le champ « Prédicateur » et la ligne « Participants | Invités » (+ 197 pt).
   */
  realiseCloture: { x: 195, y: 766 },
};

/**
 * Détail d'un évènement (P6) : défilement qui ramène « Marquer comme réalisé » à sa place d'avant
 * D-EVT-15 (deux lignes de plus dans la carte), puis cadrage du détail « Réalisé ».
 */
/**
 * Fin de P5 (détail « Programmé ») : « il comptera… », le bouton grisé et sa phrase d'attente.
 * D-EVT-16 / D-EVT-17 : la carte du prédicateur et la ligne « Invités » allongent le détail (+ 136 pt).
 */
const DEFILEMENT_PROGRAMME = -236;
const DEFILEMENT_DETAIL = -252;
/**
 * Détail « Réalisé » de fin de P6 : trop haut pour tenir d'un bloc depuis D-EVT-16 / D-EVT-17. Un
 * premier cadrage montre la pastille « Réalisé » et le prédicateur, puis la page défile jusqu'aux
 * chiffres saisis et à « il compte ».
 */
const DEFILEMENT_REALISE_HAUT = 0;
const DEFILEMENT_REALISE = -180;
const ZOOM_REALISE = 1.1;
const FOYER_REALISE = { x: 195, y: 450 };

/** Défilement de la vue membre qui montre à la fois les compteurs et le haut de la liste. */
const DEFILEMENT_VUE = -100;
/**
 * Défilement du formulaire de déclaration qui amène « Enregistrer » au centre. D-EVT-15 : avec un
 * type évangélique, la grille des compteurs a une ligne de plus et son indication (+ 112 pt) ;
 * D-EVT-16 / D-EVT-17 : le champ « Prédicateur » et la ligne « Participants | Invités » (+ 191 pt).
 */
const DEFILEMENT_DECLARER = -533;
/** Défilement du formulaire de programmation jusqu'au bouton « Programmer » (prédicateur compris). */
const DEFILEMENT_PROGRAMMER = -422;

const LISTE_APRES_P2 = [CAMPAGNE_ELISE, ...REALISEES_PARIS_NORD];
const LISTE_APRES_P4 = [CONCERT_ELISE, ...LISTE_APRES_P2];

/** Détail de la « Campagne de quartier » programmée par Élise. */
const DETAIL_QUARTIER: DetailEvt = {
  type: CAMPAGNE_QUARTIER.type,
  titre: CAMPAGNE_QUARTIER.titre,
  date: CAMPAGNE_QUARTIER.date,
  rattachement: `${ASSEMBLEE} · ${APP.levels.UNIT}`,
  // D-EVT-16 : saisi par Élise en programmant (P5), mis en évidence dans le détail.
  predicateur: CAMPAGNE_QUARTIER.predicateur,
  auteur: PERSONNES.membre.nom,
};

/**
 * Chiffres saisis par Élise à la clôture (P6) : les trois compteurs D-EVT-15 et les invités
 * (D-EVT-17, 8 sur 25 participants) sont remplis pour les montrer. Évènement du 17/10 : il n'entre
 * pas dans l'instantané statistique du 14/10 (§ 5.3).
 */
const REALISEE_QUARTIER = { participants: 25, invites: 8, conversions: 2, restaurations: 1, baptemes: 1 } as const;

/** Boutons d'Élise sur son évènement programmé (`canEdit`, pas `canFlag`). */
const BoutonsProgrammeMembre: React.FC<{ attente: boolean }> = ({ attente }) => (
  <>
    <BoutonRealise inactif={attente ? 1 : 0} attente={attente} />
    <Bouton label={APP.edit} variante="soft" hauteur={48} />
    <Bouton label={APP.detail.cancel} variante="danger" hauteur={48} />
    <Bouton label={APP.delete} variante="danger" hauteur={48} />
  </>
);

// ---------------------------------------------------------------------------------------------
// P1 — La tuile de l'accueil

export const P1Accueil: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Zoom sur la tuile, tenu ≈ 0,6 s avant l'appui (i 81) ; la modale monte à i 89.
  const zoom = doux(f, [40, 65, 85, 109], [1, 1.3, 1.3, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: TUILE_DECLARER.y }}
        decalageY={montee(f, fps)}
        dessus={<Appui x={TUILE_DECLARER.x} y={TUILE_DECLARER.y} a={81} />}
      >
        <Feuille p={lisse(f, fps, 89, 22)} dessous={<EcranAccueil haloTuile={doux(f, [44, 54, 81, 89], [0, 1, 1, 0])} />}>
          <EcranDeclarer type={null} />
        </Feuille>
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendePlan lignes={LEGENDES.p1} duree={DUREE_P1} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P2 — Le type et la date suffisent

export const P2TypeDate: React.FC = () => {
  const f = useCurrentFrame();
  // Zoom tenu sur la date préremplie « Aujourd'hui » (i 60 → 90, 1 s), puis défilement vers le
  // bouton ; le bandeau « … pour l'assemblée Paris Nord. » reste éclairé ≈ 1 s.
  const zoom = doux(f, [44, 60, 90, 100], [1, 1.35, 1.35, 1]);
  const defilement = doux(f, [104, 134], [0, DEFILEMENT_DECLARER]);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={PT.dateDeclarer}
        dessus={
          <>
            <Appui {...PT.campagneDeclarer} a={28} />
            <Appui {...PT.enregistrer} a={164} coupe={169} />
          </>
        }
      >
        <Feuille p={1} dessous={<EcranAccueil />}>
          <Fondu
            p={doux(f, [169, 181], [0, 1])}
            avant={
              <EcranDeclarer
                type={f >= 30 ? 'Campagne' : null}
                defilement={defilement}
                haloDate={doux(f, [50, 58, 84, 92], [0, 1, 1, 0])}
                haloBandeau={doux(f, [128, 136, 158, 166], [0, 1, 1, 0])}
              />
            }
            apres={<EcranConfirmation />}
          />
        </Feuille>
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendePlan lignes={LEGENDES.p2} duree={DUREE_P2} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P3 — Elle compte tout de suite

export const P3Compte: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Confirmation lue ≈ 0,6 s (i 16 → 34) ; « Mes actions » à i 50 ; zoom sur les compteurs, qui
  // basculent à i 104 → 114 et restent tenus jusqu'à i 144 (1 s), puis la ligne d'Élise.
  const enConfirmation = f < 80;
  const zoom = enConfirmation ? doux(f, [0, 16, 34, 44], [1, 1.2, 1.2, 1]) : doux(f, [84, 98, 144, 158], [1, 1.5, 1.5, 1]);
  const foyer = enConfirmation ? PT.titreConfirmation : PT.compteurs;
  const flip = doux(f, [104, 114], [0, 1]);
  const vue = (
    <EcranVueMembre
      mois={<Bascule de={COMPTEURS.mois[0]} a={COMPTEURS.mois[1]} p={flip} hauteur={42} />}
      annee={<Bascule de={COMPTEURS.annee[0]} a={COMPTEURS.annee[1]} p={flip} hauteur={42} />}
      badge={<Bascule de={BADGE_REALISEES[0]} a={BADGE_REALISEES[1]} p={flip} hauteur={15} />}
      // La ligne d'Élise n'entre qu'à la bascule des compteurs (i 104 → 118) : avant, la liste et
      // les chiffres sont cohérents (2 / 9, badge 9, pas encore sa ligne).
      realisees={LISTE_APRES_P2}
      entreePremiere={doux(f, [104, 118], [0, 1])}
      haloCompteurs={doux(f, [90, 98, 138, 146], [0, 1, 1, 0])}
      eclat={doux(f, [114, 126], [0, 1]) * (f < 127 ? 1 : 0)}
      haloPremiere={doux(f, [156, 166], [0, 1])}
      defilement={doux(f, [146, 166], [0, DEFILEMENT_VUE])}
    />
  );
  return (
    <AbsoluteFill>
      <Plateau zoom={zoom} foyer={foyer} dessus={<Appui {...PT.mesActions} a={50} />}>
        <Feuille p={1 - lisse(f, fps, 56, 20)} dessous={vue}>
          <EcranConfirmation haloTexte={0} />
        </Feuille>
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendePlan lignes={LEGENDES.p3} duree={DUREE_P3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P4 — Même sans réseau

export const P4SansReseau: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Texte « hors ligne » de la confirmation tenu ≈ 1,3 s (i 46 → 84) ; retour du réseau à
  // i 100 ; la ligne arrive et les compteurs basculent (i 136 → 146), tenus ≈ 0,8 s jusqu'à la fin.
  const avion = spring({ frame: f, fps, config: { damping: 14 } }) * (1 - doux(f, [100, 108], [0, 1]));
  const badge = spring({ frame: f - 6, fps, config: { damping: 11 } }) * (1 - doux(f, [98, 108], [0, 1]));
  const zoom = doux(f, [30, 46, 84, 96], [1, 1.4, 1.4, 1]);
  const insertion = doux(f, [126, 144], [0, 1]);
  const flip = doux(f, [136, 146], [0, 1]);
  const vueAvant = (
    <EcranVueMembre
      mois={COMPTEURS.mois[1]}
      annee={COMPTEURS.annee[1]}
      badge={BADGE_REALISEES[1]}
      realisees={LISTE_APRES_P2}
      haloPremiere={1}
      defilement={DEFILEMENT_VUE}
    />
  );
  const vueApres = (
    <EcranVueMembre
      mois={<Bascule de={COMPTEURS.mois[1]} a={COMPTEURS.mois[2]} p={flip} hauteur={42} />}
      annee={<Bascule de={COMPTEURS.annee[1]} a={COMPTEURS.annee[2]} p={flip} hauteur={42} />}
      badge={<Bascule de={BADGE_REALISEES[1]} a={BADGE_REALISEES[2]} p={flip} hauteur={15} />}
      realisees={LISTE_APRES_P4}
      entreePremiere={insertion}
      haloPremiere={doux(f, [140, 150], [0, 1])}
      eclat={doux(f, [146, 160], [0, 1]) * (f < 161 ? 1 : 0)}
      defilement={DEFILEMENT_VUE}
    />
  );
  // Hors ligne : la confirmation dit que l'action part plus tard ; « Mes actions » n'est montrée
  // qu'au retour du réseau (hors ligne, l'app y afficherait des bandeaux d'erreur).
  const confirmation = (
    <Feuille p={1} dessous={vueAvant}>
      <EcranConfirmation horsLigne haloTexte={doux(f, [40, 50, 80, 90], [0, 1, 1, 0])} />
    </Feuille>
  );
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={PT.texteHorsLigne}
        avion={avion}
      >
        <Fondu
          p={doux(f, [106, 121], [0, 1])}
          avant={<Fondu p={doux(f, [18, 30], [0, 1])} avant={vueAvant} apres={confirmation} />}
          apres={vueApres}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      {/* Hors du zoom : la pastille reste entière sur le coin du téléphone. */}
      <PastilleCoin echelle={badge}>
        <IoCloudOfflineOutline size={84} color={S.moss} />
      </PastilleCoin>
      <LegendePlan lignes={LEGENDES.p4} duree={DUREE_P4} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P5 — Programmer une action à venir

/** Appui sur « Accueil » dans l'avant-plan (image 8 de P5 ; le doigt arrive dès l'image 0). */
const P5_APPUI_ACCUEIL = 8;
/** Image de l'appui sur l'onglet « Évènements », puis sur « Programmer » de la vue membre. */
const P5_ONGLET = 56;
const P5_PROGRAMMER = 112;
/** Décalage du formulaire par rapport à l'ancien P5 (qui s'ouvrait sur la vue membre, i 10). */
const P5_FORM = P5_PROGRAMMER - 10;
/** Fin de la légende « Pour programmer : l'onglet Évènements », début de « Programmez-la ». */
const P5_LEGENDE = 94;
// Ces images (sauf P5_APPUI_ACCUEIL) sont locales au corps de P5, qui commence après l'avant-plan.

/**
 * Retour JP 14/10 : « bien montrer que pour programmer un évènement, il faut cliquer sur
 * Évènements dans la bottom nav ». Le plan part donc de l'accueil (barre d'onglets visible,
 * zoom sur elle), l'onglet « Évènements » s'éclaire et le doigt le touche ; la vue membre de
 * l'onglet (`EventMemberView`) s'affiche, puis appui sur « Programmer » et le formulaire.
 * L'accueil n'a pas de tuile « Programmer » : la tuile « Déclarer une action » n'ouvre que
 * la déclaration.
 *
 * Revue du 14/10 : P4 finit déjà sur la vue membre (onglet « Évènements » actif) ; pour ne pas
 * revenir à l'accueil par une coupe sèche, P5 s'ouvre sur un appui sur « Accueil » (avant-plan
 * de 10 images), puis le corps du plan repart de l'accueil.
 */
export const P5Programmer: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {f < P5_ACCUEIL ? (
        <Plateau dessus={<Appui {...PT.ongletAccueil} a={P5_APPUI_ACCUEIL} />}>
          {/* L'état exact de la fin de P4. */}
          <EcranVueMembre
            mois={COMPTEURS.mois[2]}
            annee={COMPTEURS.annee[2]}
            badge={BADGE_REALISEES[2]}
            realisees={LISTE_APRES_P4}
            haloPremiere={1}
            defilement={DEFILEMENT_VUE}
          />
        </Plateau>
      ) : null}
      <Sequence from={P5_ACCUEIL} durationInFrames={DUREE_P5_CORPS}>
        <P5Corps />
      </Sequence>
    </AbsoluteFill>
  );
};

const P5Corps: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (i: number) => P5_FORM + i;
  // Premier temps : zoom 1,3 sur la barre d'onglets (i 14 → 34), l'onglet éclairé ≈ 0,8 s avant
  // l'appui, zoom tenu jusqu'après le changement d'onglet (i 68 → 86). Second temps : zoom 1,3
  // sur le bandeau « … pour l'assemblée Paris Nord. » tenu ≈ 1,1 s (elle programme dans SON
  // assemblée) ; le détail « Programmé » reste ≈ 1,2 s jusqu'à la coupe.
  // D-EVT-16 (JP 14/10) : le second zoom cadre ensemble le champ « Prédicateur », qu'Élise remplit
  // (« Pasteur Jean-Marc Lefort », t 86 → 110), et le bandeau d'assemblée qui s'éclaire ensuite
  // (t 114 → 144) ; l'intitulé s'écrit un peu plus vite (1 caractère par image) pour lui faire place.
  const surBarre = f < 150;
  const zoom = surBarre ? doux(f, [14, 34, 68, 86], [1, 1.3, 1.3, 1]) : doux(f, [t(80), t(92), t(140), t(148)], [1, 1.3, 1.3, 1]);
  const foyer = surBarre ? PT.ongletEvenements : PT.predicateurBandeauProgrammer;
  const defilement = doux(f, [t(150), t(162)], [0, DEFILEMENT_PROGRAMMER]);
  const vue = (
    <EcranVueMembre
      mois={COMPTEURS.mois[2]}
      annee={COMPTEURS.annee[2]}
      badge={BADGE_REALISEES[2]}
      realisees={LISTE_APRES_P4}
      haloProgrammer={doux(f, [90, 98, P5_PROGRAMMER, P5_PROGRAMMER + 6], [0, 1, 1, 0])}
    />
  );
  const formulaire = (
    <Feuille p={lisse(f, fps, t(14), 20)} dessous={vue}>
      <EcranProgrammer
        type={f >= t(42) ? 'Campagne' : null}
        intitule={tape(CAMPAGNE_QUARTIER.titre, f, t(48), 1)}
        curseur={f >= t(46) && f < t(70)}
        date={<Bascule de="14 octobre 2026" a={CAMPAGNE_QUARTIER.date} p={doux(f, [t(70), t(78)], [0, 1])} hauteur={20} />}
        noeud={APP.scopeOf.UNIT(ASSEMBLEE)}
        haloDate={doux(f, [t(70), t(76), t(86), t(92)], [0, 1, 1, 0])}
        predicateur={tape(CAMPAGNE_QUARTIER.predicateur, f, t(86), 1)}
        curseurPredicateur={f >= t(84) && f < t(112)}
        haloPredicateur={doux(f, [t(84), t(90), t(110), t(116)], [0, 1, 1, 0])}
        haloBandeau={doux(f, [t(114), t(120), t(138), t(144)], [0, 1, 1, 0])}
        defilement={defilement}
      />
    </Feuille>
  );
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={foyer}
        dessus={
          <>
            {/* Fin de l'onde de l'appui sur « Accueil » de l'avant-plan (image locale négative). */}
            <Appui {...PT.ongletAccueil} a={P5_APPUI_ACCUEIL - P5_ACCUEIL} />
            <Appui {...PT.ongletEvenements} a={P5_ONGLET} />
            <Appui {...PT.programmerMembre} a={P5_PROGRAMMER} coupe={P5_PROGRAMMER + 6} />
            <Appui {...PT.campagneProgrammer} a={t(40)} />
            <Appui {...PT.boutonProgrammer} a={t(168)} coupe={t(172)} />
          </>
        }
      >
        <Pile
          p={lisse(f, fps, t(172), 16)}
          dessous={
            // Changement d'onglet instantané, comme dans l'app : coupe franche, pas de fondu
            // (revue du 14/10 : la double exposition accueil / compteurs brouillait l'image).
            <Fondu
              p={f >= P5_ONGLET + 6 ? 1 : 0}
              avant={<EcranAccueil haloOngletEvenements={doux(f, [22, 32, P5_ONGLET + 4, P5_ONGLET + 10], [0, 1, 1, 0])} />}
              apres={formulaire}
            />
          }
          dessus={
            <EcranDetail
              evt={DETAIL_QUARTIER}
              pastilles={<PastilleProgramme />}
              indication={APP.detail.plannedHint}
              boutons={<BoutonsProgrammeMembre attente />}
              haloPastilles={doux(f, [t(180), t(188)], [0, 1])}
              // D-EVT-16 : le prédicateur saisi est là, en évidence sous la pastille.
              haloPredicateur={doux(f, [t(182), t(190)], [0, 1])}
              haloIndication={doux(f, [t(186), t(194)], [0, 1])}
              // D-EVT-15 / D-EVT-16 / D-EVT-17 : la carte a quatre lignes de plus et le prédicateur
              // s'ajoute ; le défilement amène « il comptera… », « Marquer comme réalisé » grisé et
              // « Disponible à partir de la date… ».
              defilement={doux(f, [t(194), t(206)], [0, DEFILEMENT_PROGRAMME])}
            />
          }
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendeShephr lignes={LEGENDES.p5Onglet} duree={P5_LEGENDE - 6} />
      <LegendeShephr lignes={LEGENDES.p5} debut={P5_LEGENDE + 4} duree={DUREE_P5_CORPS - 1 - (P5_LEGENDE + 4)} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P6 — Le jour venu, la marquer réalisée

export const P6Realisee: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // La pastille du saut de date est posée avant l'appui (i 28) et reste jusqu'à la sortie ; après
  // la clôture (i 88), la pastille « Réalisé » et « il compte » restent tenues ≈ 1 s sous le
  // zoom, puis le téléphone sort.
  const pastille = spring({ frame: f, fps, config: { damping: 12 } }) * (1 - doux(f, [146, 156], [0, 1]));
  // D-EVT-15 : la carte de détail a deux lignes de plus (restaurations, baptêmes, + 116 pt). Le
  // détail, repris où P5 l'a laissé, défile avant l'appui pour amener « Marquer comme réalisé » au
  // même endroit qu'avant (i 6 → 20) ;
  // après la clôture, le zoom passe de 1,35 à 1,2 pour tenir ensemble la pastille « Réalisé », les
  // quatre compteurs saisis et « il compte ». D-EVT-16 / D-EVT-17 : le détail « Réalisé » ne tient
  // plus d'un bloc (prédicateur, ligne « Invités ») ; zoom 1,1, la pastille et le prédicateur sont lus
  // d'abord (i 104 → 124), puis la page défile (i 124 → 136) jusqu'aux chiffres et à « il compte ».
  const zoom = doux(f, [104, 120, 142, 150], [1, ZOOM_REALISE, ZOOM_REALISE, 1]);
  const defilementApres = doux(f, [124, 136], [DEFILEMENT_REALISE_HAUT, DEFILEMENT_REALISE]);
  const defilementAvant = doux(f, [6, 20], [DEFILEMENT_PROGRAMME, DEFILEMENT_DETAIL]);
  const sortie = doux(f, [154, 171], [0, 1]);
  const realise: DetailEvt = { ...DETAIL_QUARTIER, ...REALISEE_QUARTIER };
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={FOYER_REALISE}
        decalageY={sortie * 1400}
        opacite={1 - doux(f, [158, 171], [0, 1])}
        dessus={
          <>
            <Appui {...PT.realise} a={28} />
            <Appui {...PT.realiseCloture} a={88} />
          </>
        }
      >
        <Fondu
          p={doux(f, [92, 100], [0, 1])}
          avant={
            <Fondu
              p={doux(f, [32, 40], [0, 1])}
              avant={
                <EcranDetail
                  evt={DETAIL_QUARTIER}
                  pastilles={<PastilleProgramme />}
                  indication={APP.detail.plannedHint}
                  boutons={<BoutonsProgrammeMembre attente={false} />}
                  defilement={defilementAvant}
                />
              }
              apres={
                <EcranCloture
                  type={CAMPAGNE_QUARTIER.type}
                  // D-EVT-16 : connu dès la programmation, le prédicateur est prérempli.
                  predicateur={CAMPAGNE_QUARTIER.predicateur}
                  haloPredicateur={doux(f, [40, 46, 60, 66], [0, 1, 1, 0])}
                  valeurs={{
                    participants: tape(String(REALISEE_QUARTIER.participants), f, 46, 0.25),
                    // D-EVT-17 : 8 invités parmi les 25 participants.
                    invites: tape(String(REALISEE_QUARTIER.invites), f, 54, 0.25),
                    conversions: tape(String(REALISEE_QUARTIER.conversions), f, 60, 0.25),
                    restaurations: tape(String(REALISEE_QUARTIER.restaurations), f, 66, 0.25),
                    baptemes: tape(String(REALISEE_QUARTIER.baptemes), f, 72, 0.25),
                  }}
                  curseur={
                    f < 54 ? 'participants' : f < 60 ? 'invites' : f < 66 ? 'conversions' : f < 72 ? 'restaurations' : f < 80 ? 'baptemes' : null
                  }
                />
              }
            />
          }
          apres={
            <EcranDetail
              evt={realise}
              pastilles={<PastilleRealise />}
              flash={APP.detail.markedDone}
              indication={APP.detail.counted}
              boutons={
                <>
                  <Bouton label={APP.edit} variante="soft" hauteur={48} />
                  <Bouton label={APP.delete} variante="danger" hauteur={48} />
                </>
              }
              haloPastilles={doux(f, [104, 110, 124, 130], [0, 1, 1, 0])}
              haloPredicateur={doux(f, [106, 112, 124, 130], [0, 1, 1, 0])}
              haloInvites={doux(f, [130, 136, 142, 148], [0, 1, 1, 0])}
              haloIndication={doux(f, [132, 138, 142, 148], [0, 1, 1, 0])}
              defilement={defilementApres}
            />
          }
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      {/* Saut dans le temps (annotation vidéo), hors du zoom. */}
      <PastilleCoin echelle={pastille}>
        <IoCalendarOutline size={50} color={S.moss} />
        <div style={{ marginTop: 4, fontFamily: P.mono, fontWeight: 500, fontSize: 25, color: S.moss }}>{CARTONS.sautDate}</div>
      </PastilleCoin>
      {/* Deux temps (D-EVT-15) : « Le jour venu… » jusqu'à l'ouverture de la clôture, puis les
          trois compteurs pendant leur saisie et sur le détail « Réalisé ». */}
      <LegendeShephr lignes={LEGENDES.p6} duree={P6_LEGENDE - 6} />
      <LegendeShephr lignes={LEGENDES.p6Compteurs} debut={P6_LEGENDE + 4} duree={DUREE_P6 - 1 - (P6_LEGENDE + 4)} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P7 — Le membre voit son assemblée (schéma)

/**
 * Schéma : nation et région en bandes pâles, la ville, puis ses trois assemblées. Paris Nord
 * s'allume ; tout le reste s'estompe sous un cadenas (D-EVT-14 : ni assemblée sœur, ni ville,
 * ni région, ni nation).
 */
export const P7SonAssemblee: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pose = (i: number) => {
    const p = spring({ frame: f - i * 4, fps, config: { damping: 200 }, durationInFrames: 18 });
    return { opacity: p, transform: `translateY(${(1 - p) * 30}px)` };
  };
  // Paris Nord s'allume une fois le schéma posé ; le reste s'estompe sous les cadenas, puis le
  // schéma est tenu ≈ 0,7 s (≈ 1 s avec le gel sous l'intertitre ; Paris Nord allumée ≈ 1,9 s).
  const allume = doux(f, [40, 50], [0, 1]);
  const estompe = doux(f, [56, 76], [0, 1]);
  const cadenas = spring({ frame: f - 62, fps, config: { damping: 12 } });
  const autres = 1 - 0.65 * estompe;

  const bande = (niveau: string, nom: string, top: number, i: number) => (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        top,
        height: 96,
        borderRadius: 28,
        border: `2px solid ${S.hairStrong}`,
        background: S.paper,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        ...pose(i),
        opacity: pose(i).opacity * autres,
      }}
    >
      <div style={{ fontFamily: P.mono, fontSize: 28, letterSpacing: 2, color: S.ink3 }}>{niveau}</div>
      <div style={{ fontFamily: P.sans, fontWeight: 600, fontSize: 36, color: S.ink2 }}>{nom}</div>
      <Cadenas echelle={cadenas} />
    </div>
  );

  const assemblees = ['Paris Est', ASSEMBLEE, 'Paris Sud'];
  return (
    <AbsoluteFill>
      {bande(CARTONS.niveaux.nation, 'France', 520, 0)}
      {bande(CARTONS.niveaux.region, 'Île-de-France', 650, 1)}
      {bande(CARTONS.niveaux.ville, 'Paris', 780, 2)}
      <Lien top={876} opacite={autres} />
      <div style={{ position: 'absolute', left: 60, right: 60, top: 1000, display: 'flex', gap: 24 }}>
        {assemblees.map((nom, i) => {
          const elle = nom === ASSEMBLEE;
          return (
            <div
              key={nom}
              style={{
                flex: 1,
                height: 400,
                borderRadius: 34,
                background: elle ? `rgba(30,58,47,${0.04 + 0.06 * allume})` : S.paper,
                border: `${elle ? 3 + 2 * allume : 2}px solid ${elle ? `rgba(30,58,47,${0.25 + 0.75 * allume})` : S.hairStrong}`,
                boxShadow: elle ? `0 24px 50px rgba(30,58,47,${0.18 * allume})` : undefined,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 22,
                position: 'relative',
                ...pose(3 + i),
                opacity: pose(3 + i).opacity * (elle ? 1 : autres),
              }}
            >
              <div style={{ fontFamily: P.mono, fontSize: 22, letterSpacing: 2, color: S.ink3 }}>{CARTONS.niveaux.assemblee}</div>
              <div style={{ fontFamily: P.serif, fontSize: 46, color: S.ink, textAlign: 'center', lineHeight: 1.05 }}>{nom}</div>
              {elle ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 18px',
                    borderRadius: 99,
                    background: S.moss,
                    color: S.white,
                    fontFamily: P.sans,
                    fontWeight: 600,
                    fontSize: 28,
                    opacity: allume,
                    transform: `scale(${0.8 + 0.2 * allume})`,
                  }}
                >
                  <IoPersonOutline size={28} />
                  {PERSONNES.membre.prenom}
                </div>
              ) : (
                <Cadenas echelle={cadenas} />
              )}
            </div>
          );
        })}
      </div>
      <LegendePlan lignes={LEGENDES.p7} duree={DUREE_P7} />
    </AbsoluteFill>
  );
};

const Cadenas: React.FC<{ echelle: number }> = ({ echelle }) =>
  echelle <= 0.001 ? null : (
    <div style={{ transform: `scale(${echelle})`, display: 'flex' }}>
      <IoLockClosed size={34} color={S.ink3} />
    </div>
  );

/** Trait vertical de la ville vers ses trois assemblées. */
const Lien: React.FC<{ top: number; opacite: number }> = ({ top, opacite }) => (
  <svg style={{ position: 'absolute', left: 0, top, opacity: opacite }} width={1080} height={124}>
    <path d="M540 0 V62 M190 62 H890 M190 62 V124 M540 62 V124 M890 62 V124" stroke={S.hairStrong} strokeWidth={3} fill="none" />
  </svg>
);
