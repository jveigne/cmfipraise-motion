import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { APP, CARTONS, LEGENDES } from '../textes';
import { A_VENIR_APRES_P9, CONCERT_LOUANGE, GRANDE_CAMPAGNE, IMPLANTATION_SUD, PERSONNES, VILLE } from '../donnees';
import { P, S } from '../theme';
import { EcranAgenda } from '../ecrans/Agenda';
import { EcranProgrammer, ListeSelection } from '../ecrans/Programmer';
import { BoutonRealise, DetailEvt, EcranCloture, EcranDetail } from '../ecrans/Detail';
import { Bouton, ONGLETS, centreOnglet, PastilleACloturer, PastilleAVerifier, PastilleProgramme, PastilleRealise } from '../ui/app';
import { Bascule } from '../ui/Bascule';
import { Feuille } from '../ui/Feuille';
import { Appui, Decale, Fondu, LegendeShephr, Voile, lisse, montee, tape, voilePour } from './commun';

/**
 * Chapitre 2 — le dirigeant (Daniel, dirigeant de la ville de Paris). Storyboard § 4, P8 à P11.
 * Retour JP 14/10 (« ça avance trop rapidement ») : les gestes gardent leur vitesse, seules les
 * poses s'allongent (légende + état final lisibles ≈ 1 s de plus). Chapitre porté de 621 à
 * 834 images (20,7 → 27,8 s ; P8 + 6 à la revue du 14/10 pour lire les blocs de l'agenda) — un premier passage à 950 images menait le film à 147 s ; poses
 * resserrées pour viser ≈ 2 min au total. P8 montre que l'agenda est l'onglet « Évènements » de
 * la barre du bas, P9 que « Programmer » se touche depuis cet agenda — plus brièvement que pour
 * le membre (P5).
 */
export const DUREE_P8 = 238;
export const DUREE_P9 = 256;
export const DUREE_P10 = 172;
export const DUREE_P11 = 168;

/** Fin du premier temps de P8 (légende « Son agenda : l'onglet Évènements »). */
const P8_LEGENDE = 72;
/** Fin du premier temps de P9 (légende « Depuis l'agenda : Programmer »). */
const P9_LEGENDE = 96;
/** Fin du premier temps de P10 (légende « Après l'évènement, il le clôture »), à l'ouverture de la clôture. */
const P10_LEGENDE = 56;

/**
 * Légende d'un plan dont le fondu de sortie s'achève sur la dernière image (`duree` - 1) : ni
 * coupée à mi-fondu, ni figée sous l'intertitre qui suit P11 (le `Segment` gèle la dernière image).
 * `debut` : image d'apparition (6 par défaut, comme `LegendeShephr`).
 */
const LegendePlan: React.FC<{ lignes: readonly string[]; fin: number; debut?: number }> = ({ lignes, fin, debut = 6 }) => (
  <LegendeShephr lignes={lignes} debut={debut} duree={fin - 1 - debut} />
);

const PT = {
  ongletEvenements: centreOnglet(ONGLETS.evenements),
  programmerAgenda: { x: 101, y: 262 },
  // D-EVT-15 : l'intro de « Programmer » a pris une ligne (+ 20 pt) — le formulaire descend d'autant.
  campagne: { x: 156, y: 347 },
  date: { x: 102, y: 610 },
  // D-EVT-16 : le champ « Prédicateur » (+ 91 pt) pousse le rattachement et le bandeau ; le
  // formulaire défile d'abord de `DEFILEMENT_PREDICATEUR` (P9, i 96 → 104).
  rattachement: { x: 195, y: 682 },
  optionVille: { x: 195, y: 350 },
  bandeau: { x: 195, y: 750 },
  boutonProgrammer: { x: 195, y: 614 },
  realise: { x: 195, y: 722 },
  /**
   * D-EVT-15 : la grille des compteurs de la clôture a une ligne de plus et son indication (+ 112 pt) ;
   * D-EVT-16 / D-EVT-17 : le champ « Prédicateur » et la ligne « Participants | Invités » (+ 197 pt).
   */
  realiseCloture: { x: 195, y: 766 },
  // Après le défilement de P11 (DEFILEMENT_A_VERIFIER, relevé à l'écran).
  aVerifier: { x: 195, y: 773 },
};

/**
 * Détails d'évènement (P10, P11) : D-EVT-15 ajoute deux lignes à la carte (+ 116 pt), D-EVT-17 la
 * ligne « Invités » (+ 58 pt). Le détail défile pour ramener le bouton touché à sa place d'avant,
 * puis se cadre sur l'état final.
 */
const DEFILEMENT_DETAIL = -174;
/**
 * P11 : détail marqué « à vérifier » — la pastille et « il reste compté » ensemble (- 100 au lieu
 * de - 60 depuis la ligne « Invités », D-EVT-17).
 */
const DEFILEMENT_REALISE = -100;
/**
 * P10, détail « Réalisé » du concert : D-EVT-16 y ajoute la carte du prédicateur saisi à la
 * clôture. Trop haut pour tenir d'un bloc : premier cadrage sur la pastille et le prédicateur, puis
 * défilement jusqu'aux chiffres et à « il compte » (zoom 1,1 au lieu de 1,2).
 */
const DEFILEMENT_CONCERT_REALISE = -180;
const ZOOM_REALISE = 1.1;
const FOYER_REALISE = { x: 195, y: 450 };
/** P11 : « Marquer « à vérifier » » est le 2ᵉ bouton d'un réalisé, plus bas que « Marquer réalisé ». */
const DEFILEMENT_A_VERIFIER = -184;

/**
 * Défilements de l'agenda : trois arrêts sur « À clôturer », « À venir », « Réalisés ». D-EVT-16 : la
 * ligne « Prédicateur » de la « Campagne de quartier » allonge « À venir » (+ 20 pt) ; le dernier
 * arrêt descend un peu plus (- 580) pour lire « 40 participants dont 12 invités · … » (D-EVT-17).
 */
const ARRETS_AGENDA = [0, -250, -580];
/** P9 : premier défilement, qui ramène le rattachement et le bandeau sous le champ « Prédicateur » (D-EVT-16). */
const DEFILEMENT_PREDICATEUR = -100;
const DEFILEMENT_PROGRAMMER = -511;

/** La « Grande campagne de Paris » programmée par Daniel en P9 (détail, refermé au début de P10). */
const DETAIL_GRANDE_CAMPAGNE: DetailEvt = {
  type: GRANDE_CAMPAGNE.type,
  titre: GRANDE_CAMPAGNE.titre,
  date: GRANDE_CAMPAGNE.date,
  rattachement: `${VILLE} · ${APP.levels.LOCALITY}`,
  auteur: PERSONNES.dirigeant.nom,
};

const RATTACHEMENTS = ['Ville · Paris', 'Assemblée · Paris Est', 'Assemblée · Paris Nord', 'Assemblée · Paris Sud'];

/** Gestes d'un dirigeant sur un programmé de son périmètre (`canEdit`, `canFlag`). */
const BoutonsProgrammeDirigeant: React.FC<{ attente: boolean }> = ({ attente }) => (
  <>
    <BoutonRealise inactif={attente ? 1 : 0} attente={attente} />
    <Bouton label={APP.edit} variante="soft" hauteur={48} />
    <Bouton label={APP.detail.flag} variante="ghost" hauteur={48} />
    <Bouton label={APP.detail.cancel} variante="danger" hauteur={48} />
    <Bouton label={APP.delete} variante="danger" hauteur={48} />
  </>
);

/** Gestes d'un dirigeant sur un réalisé de son périmètre. */
const BoutonsRealiseDirigeant: React.FC<{ marque?: boolean }> = ({ marque }) => (
  <>
    <Bouton label={APP.edit} variante="soft" hauteur={48} />
    <Bouton label={marque ? APP.detail.unflag : APP.detail.flag} variante="ghost" hauteur={48} />
    <Bouton label={APP.delete} variante="danger" hauteur={48} />
  </>
);

/** Détail de la « Grande campagne de Paris » (fin de P9, début de P10). */
const DetailGrandeCampagne: React.FC<{ haloRattachement: number }> = ({ haloRattachement }) => (
  <EcranDetail
    evt={DETAIL_GRANDE_CAMPAGNE}
    pastilles={<PastilleProgramme />}
    indication={APP.detail.plannedHint}
    boutons={<BoutonsProgrammeDirigeant attente />}
    haloRattachement={haloRattachement}
  />
);

// ---------------------------------------------------------------------------------------------
// P8 — L'agenda de son périmètre

export const P8Agenda: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [a0, a1, a2] = ARRETS_AGENDA;
  // Premier temps : zoom 1,3 sur la barre du bas, l'onglet actif « Évènements » s'éclaire (tenu
  // i 28 → 48, ≈ 0,7 s, zoom tenu 0,7 s). Second temps : lecture de l'agenda. Revue du 14/10 :
  // halos pleins ≈ 0,8 s sur « À clôturer » (i 86 → 110, il annonce P10) et « À venir »
  // (i 142 → 166), ≈ 0,7 s sur « Réalisés » (i 193 → 213) ; les arrêts de défilement sont décalés
  // d'autant, à la même vitesse ; le recul du zoom se fait pendant le retour en haut (pour P9).
  const surBarre = f < 66;
  const zoom = surBarre ? doux(f, [14, 30, 50, 64], [1, 1.3, 1.3, 1]) : doux(f, [68, 82, 222, 236], [1, 1.2, 1.2, 1]);
  const defilement = doux(f, [114, 134, 170, 185, 217, 237], [a0, a1, a1, a2, a2, a0]);
  return (
    <AbsoluteFill>
      <Plateau zoom={zoom} foyer={surBarre ? PT.ongletEvenements : { x: 195, y: 470 }} decalageY={montee(f, fps)}>
        <EcranAgenda
          defilement={defilement}
          haloOnglet={doux(f, [20, 28, 48, 56], [0, 1, 1, 0])}
          haloBlocs={[
            doux(f, [80, 86, 110, 116], [0, 1, 1, 0]),
            doux(f, [136, 142, 166, 172], [0, 1, 1, 0]),
            doux(f, [187, 193, 213, 219], [0, 1, 1, 0]),
          ]}
          haloCampagne={doux(f, [142, 148, 166, 172], [0, 1, 1, 0])}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendePlan lignes={LEGENDES.p8Onglet} fin={P8_LEGENDE} />
      <LegendePlan lignes={LEGENDES.p8} debut={P8_LEGENDE + 6} fin={DUREE_P8} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P9 — Programmer à son niveau : une campagne de ville

export const P9SonNiveau: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Premier temps, bref : zoom 1,25 sur « Programmer » de l'agenda, qui s'éclaire puis est touché
  // (i 30). Saisie à la même vitesse qu'avant ; la date reste éclairée ≈ 0,6 s, le bandeau « … pour
  // la ville Paris. » zoomé ≈ 1,2 s (i 150 → 186) ; le détail et son rattachement « Paris · Ville »
  // (halo dès i 224) restent lisibles jusqu'à la fin (≈ 1,1 s).
  const surProgrammer = f < 80;
  const zoom = surProgrammer ? doux(f, [2, 14, 32, 44], [1, 1.25, 1.25, 1]) : doux(f, [142, 150, 186, 194], [1, 1.35, 1.35, 1]);
  // D-EVT-16 : le champ « Prédicateur » (laissé vide par Daniel, il est facultatif) fait descendre
  // le rattachement et le bandeau ; un court défilement (i 96 → 104) les ramène dans le cadre.
  const defilement = doux(f, [96, 104, 193, 201], [0, DEFILEMENT_PREDICATEUR, DEFILEMENT_PREDICATEUR, DEFILEMENT_PROGRAMMER]);
  const liste = lisse(f, fps, 112, 12) - lisse(f, fps, 136, 10);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={surProgrammer ? PT.programmerAgenda : PT.bandeau}
        dessus={
          <>
            <Appui {...PT.programmerAgenda} a={30} coupe={40} />
            <Appui {...PT.campagne} a={54} />
            <Appui {...PT.rattachement} a={110} coupe={114} />
            {/* Les ondes s'effacent avec l'écran touché : ni sur les types, ni sur le détail. */}
            <Appui {...PT.optionVille} a={134} coupe={135} />
            <Appui {...PT.boutonProgrammer} a={206} coupe={210} />
          </>
        }
      >
        <Pile
          p={lisse(f, fps, 210, 16)}
          dessous={
            <>
              <Feuille p={lisse(f, fps, 34, 18)} dessous={<EcranAgenda haloProgrammer={doux(f, [6, 14, 30, 36], [0, 1, 1, 0])} />}>
                <EcranProgrammer
                  type={f >= 56 ? 'Campagne' : null}
                  intitule={tape(GRANDE_CAMPAGNE.titre, f, 60, 1)}
                  curseur={f >= 58 && f < 86}
                  date={<Bascule de="14 octobre 2026" a={GRANDE_CAMPAGNE.date} p={doux(f, [86, 94], [0, 1])} hauteur={20} />}
                  rattachement={RATTACHEMENTS[0]}
                  noeud={APP.scopeOf.LOCALITY(VILLE)}
                  haloDate={doux(f, [86, 90, 104, 108], [0, 1, 1, 0])}
                  haloRattachement={doux(f, [104, 110, 136, 140], [0, 1, 1, 0])}
                  haloBandeau={doux(f, [146, 152, 182, 190], [0, 1, 1, 0])}
                  defilement={defilement}
                />
              </Feuille>
              <ListeSelection
                p={liste}
                titre={APP.form.scope}
                options={RATTACHEMENTS}
                choisie={RATTACHEMENTS[0]}
                haloOption={doux(f, [122, 128], [0, 1])}
              />
            </>
          }
          dessus={<DetailGrandeCampagne haloRattachement={doux(f, [224, 232], [0, 1])} />}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendePlan lignes={LEGENDES.p9Agenda} fin={P9_LEGENDE} />
      <LegendePlan lignes={LEGENDES.p9} debut={P9_LEGENDE + 6} fin={DUREE_P9} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P10 — Après l'évènement, il le clôture

export const P10Cloture: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // L'agenda derrière compte désormais 3 « À venir » : la campagne de P9 y figure (revue du 14/10).
  // Ouverture sans coupe : le détail de P9 recule vers l'agenda (retour arrière, i 0 → 12), puis
  // le concert « À clôturer » s'ouvre (i 14 → 28). Le détail se lit ≈ 0,5 s avant l'appui sur
  // « Marquer réalisé » (i 44), les chiffres saisis ≈ 0,5 s avant la confirmation (i 100) ; l'état
  // « Réalisé · compté » est zoomé à partir de i 132 et tenu jusqu'à la fin (≈ 1,3 s).
  const retour = 1 - lisse(f, fps, 0, 12);
  // D-EVT-15 / D-EVT-17 : la carte de détail a trois lignes de plus (+ 174 pt) — elle défile une
  // fois ouverte (i 28 → 40) pour ramener « Marquer comme réalisé » à sa place.
  // D-EVT-16 (JP 14/10) : à la clôture, Daniel saisit le prédicateur, inconnu à la programmation
  // (i 58 → 72, avant les chiffres, dont 45 invités) ; le détail « Réalisé » le met en évidence.
  // L'état final ne tient plus d'un bloc : zoom 1,1 sur la pastille et le prédicateur
  // (i 112 → 140), puis défilement (i 140 → 152) jusqu'aux chiffres et à « il compte », tenus
  // jusqu'à la fin.
  const zoom = doux(f, [118, 132], [1, ZOOM_REALISE]);
  const defilementAvant = doux(f, [28, 40], [0, DEFILEMENT_DETAIL]);
  const defilementApres = doux(f, [140, 152], [0, DEFILEMENT_CONCERT_REALISE]);
  const concert: DetailEvt = {
    type: CONCERT_LOUANGE.type,
    titre: CONCERT_LOUANGE.titre,
    date: CONCERT_LOUANGE.date,
    rattachement: `${VILLE} · ${APP.levels.LOCALITY}`,
    lieu: CONCERT_LOUANGE.lieu,
    auteur: PERSONNES.dirigeant.nom,
  };
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={FOYER_REALISE}
        dessus={
          <>
            <Appui {...PT.realise} a={44} coupe={48} />
            <Appui {...PT.realiseCloture} a={100} coupe={104} />
          </>
        }
      >
        {retour > 0.005 ? (
          <Pile
            p={retour}
            dessous={<EcranAgenda aVenir={A_VENIR_APRES_P9} />}
            dessus={<DetailGrandeCampagne haloRattachement={1 - doux(f, [0, 6], [0, 1])} />}
          />
        ) : (
          <Pile
            p={lisse(f, fps, 14, 14)}
            dessous={<EcranAgenda aVenir={A_VENIR_APRES_P9} />}
            dessus={
              <Fondu
                p={doux(f, [104, 112], [0, 1])}
                avant={
                  <Fondu
                    p={doux(f, [48, 56], [0, 1])}
                    avant={
                      <EcranDetail
                        evt={concert}
                        pastilles={<PastilleACloturer />}
                        indication={APP.detail.plannedHint}
                        boutons={<BoutonsProgrammeDirigeant attente={false} />}
                        defilement={defilementAvant}
                      />
                    }
                    apres={
                      <EcranCloture
                        type={CONCERT_LOUANGE.type}
                        // D-EVT-16 : saisi après coup, à « Marquer comme réalisé ».
                        predicateur={tape(CONCERT_LOUANGE.predicateur, f, 58, 1.6)}
                        curseurPredicateur={f >= 56 && f < 72}
                        haloPredicateur={doux(f, [56, 62, 72, 78], [0, 1, 1, 0])}
                        valeurs={{
                          participants: tape(String(CONCERT_LOUANGE.participants), f, 72, 0.5),
                          // D-EVT-17 : 45 invités parmi les 150 participants.
                          invites: tape(String(CONCERT_LOUANGE.invites), f, 78, 0.5),
                          conversions: tape(String(CONCERT_LOUANGE.conversions), f, 84, 0.5),
                          restaurations: tape(String(CONCERT_LOUANGE.restaurations), f, 88, 0.5),
                          baptemes: tape(String(CONCERT_LOUANGE.baptemes), f, 92, 0.5),
                        }}
                        curseur={
                          f < 72
                            ? null
                            : f < 78
                              ? 'participants'
                              : f < 84
                                ? 'invites'
                                : f < 88
                                  ? 'conversions'
                                  : f < 92
                                    ? 'restaurations'
                                    : f < 96
                                      ? 'baptemes'
                                      : null
                        }
                      />
                    }
                  />
                }
                apres={
                  <EcranDetail
                    evt={{
                      ...concert,
                      participants: CONCERT_LOUANGE.participants,
                      invites: CONCERT_LOUANGE.invites,
                      predicateur: CONCERT_LOUANGE.predicateur,
                      conversions: CONCERT_LOUANGE.conversions,
                      restaurations: CONCERT_LOUANGE.restaurations,
                      baptemes: CONCERT_LOUANGE.baptemes,
                    }}
                    pastilles={<PastilleRealise />}
                    flash={APP.detail.markedDone}
                    indication={APP.detail.counted}
                    boutons={<BoutonsRealiseDirigeant />}
                    haloPastilles={doux(f, [114, 120, 138, 144], [0, 1, 1, 0])}
                    haloPredicateur={doux(f, [116, 122, 138, 144], [0, 1, 1, 0])}
                    haloInvites={doux(f, [150, 156], [0, 1])}
                    haloIndication={doux(f, [152, 158], [0, 1])}
                    defilement={defilementApres}
                  />
                }
              />
            }
          />
        )}
      </Plateau>
      <Voile force={voilePour(zoom)} />
      {/* Deux temps (D-EVT-16 / D-EVT-17) : « Après l'évènement… » jusqu'à l'ouverture de la clôture,
          puis le prédicateur et les invités pendant leur saisie et sur le détail « Réalisé ». */}
      <LegendePlan lignes={LEGENDES.p10} fin={P10_LEGENDE} />
      <LegendePlan lignes={LEGENDES.p10Ajouts} debut={P10_LEGENDE + 4} fin={DUREE_P10} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P11 — « À vérifier » ne retire jamais l'action du total

export const P11AVerifier: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Le détail se lit ≈ 0,7 s avant l'appui « Marquer à vérifier » (i 35) ; la pastille et
  // « Compté · à vérifier » restent seuls ≈ 1,1 s avant que la carte du total n'arrive (i 81) ;
  // « Inchangé » (i 119) reste lisible jusqu'à la fin (≈ 1,6 s).
  const marque = f >= 39;
  const pastille = spring({ frame: f - 39, fps, config: { damping: 11 } });
  const decalage = doux(f, [77, 93], [0, 1]);
  const carte = lisse(f, fps, 81, 16);
  // Le chiffre « tressaille » sans changer (annotation vidéo) : RG-ACT-07.
  const tressaille = f >= 99 && f <= 119 ? Math.sin((f - 99) * 1.6) * 6 * (1 - (f - 99) / 20) : 0;
  const coche = spring({ frame: f - 119, fps, config: { damping: 12 } });
  // D-EVT-15 / D-EVT-17 : le détail défile jusqu'au bouton (i 16 → 30), puis remonte juste assez, une fois
  // marqué (i 40 → 54), pour montrer ensemble la pastille « À vérifier » et « il reste compté ».
  const defilementDetail =
    doux(f, [16, 30], [0, DEFILEMENT_A_VERIFIER]) + doux(f, [40, 54], [0, DEFILEMENT_REALISE - DEFILEMENT_A_VERIFIER]);
  const detail: DetailEvt = {
    type: IMPLANTATION_SUD.type,
    date: IMPLANTATION_SUD.date,
    rattachement: `${IMPLANTATION_SUD.noeud} · ${APP.levels.UNIT}`,
    lieu: IMPLANTATION_SUD.lieu,
    participants: IMPLANTATION_SUD.participants,
    invites: IMPLANTATION_SUD.invites,
    conversions: IMPLANTATION_SUD.conversions,
    auteur: IMPLANTATION_SUD.auteur,
  };
  return (
    <AbsoluteFill>
      <Decale dx={-175 * decalage} reduction={1 - 0.14 * decalage}>
        <Plateau dessus={<Appui {...PT.aVerifier} a={35} />}>
          <Pile
            p={lisse(f, fps, 0, 15)}
            dessous={<EcranAgenda aVenir={A_VENIR_APRES_P9} />}
            dessus={
              <EcranDetail
                evt={detail}
                pastilles={
                  <>
                    {marque ? <PastilleAVerifier echelle={pastille} /> : null}
                    <PastilleRealise />
                  </>
                }
                flash={marque ? APP.detail.flagged : undefined}
                flashP={doux(f, [39, 49], [0, 1])}
                indication={marque ? APP.detail.countedToVerify : APP.detail.counted}
                boutons={<BoutonsRealiseDirigeant marque={marque} />}
                haloPastilles={doux(f, [43, 51, 156, 166], [0, 1, 1, 0])}
                haloIndication={doux(f, [47, 55, 156, 166], [0, 1, 1, 0])}
                defilement={defilementDetail}
              />
            }
          />
        </Plateau>
      </Decale>

      {/* Annotation vidéo, au style d'une carte KPI de l'app : le total de la ville ne bouge pas. */}
      <div
        style={{
          position: 'absolute',
          left: 700,
          top: 820,
          width: 340,
          padding: '30px 30px 34px',
          boxSizing: 'border-box',
          borderRadius: 36,
          background: '#EEE6D2',
          border: `2px solid ${S.mossTint2}`,
          boxShadow: '0 24px 60px rgba(42,38,32,0.16)',
          transform: `translateX(${(1 - carte) * 500}px)`,
          opacity: carte,
        }}
      >
        <div style={{ fontFamily: P.sans, fontWeight: 600, fontSize: 24, letterSpacing: 1.4, color: S.ink3, lineHeight: 1.35 }}>
          {CARTONS.kpiParis}
        </div>
        <div style={{ fontFamily: P.serif, fontSize: 150, lineHeight: 1, color: S.ink, marginTop: 14, transform: `translateX(${tressaille}px)` }}>
          28
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 700,
          top: 1160,
          width: 340,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          fontFamily: P.sans,
          fontWeight: 600,
          fontSize: 38,
          color: S.moss,
          opacity: coche,
          transform: `scale(${0.6 + 0.4 * coche})`,
        }}
      >
        <IoCheckmarkCircle size={48} />
        {CARTONS.inchange}
      </div>
      <LegendePlan lignes={LEGENDES.p11} fin={DUREE_P11} />
    </AbsoluteFill>
  );
};
