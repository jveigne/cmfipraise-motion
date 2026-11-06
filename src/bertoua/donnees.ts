/**
 * Données fictives de la vidéo « Le Message de Bertoua en détail » (toutes inventées). Une seule
 * assemblée, celle des vidéos « Étude » et « Guide » : Paris Ouest, le dimanche chez Samuel, avec
 * Marie, Jean, Esther, Paul (son livret), Hélène (un cahier) et Rose (absente le 25 octobre).
 * Chronologie, celle de « Guide » (leçon en plusieurs séances, avenant 05) :
 * - dimanche 25 octobre 2026 : leçon 1 d'UEMB002, séance arrêtée après la question 11 (D-ETU-40) ;
 *   Joël et Rose absents ; 10 copies dans l'app ; Marie 8,5 / 11, Jean 8 / 11, Esther 10,5 / 11 ;
 *   copies papier de Paul (9) et d'Hélène (8) ;
 * - mercredi 28 octobre : Rose rattrape la séance à la maison (D-ETU-44) ;
 * - dimanche 1er novembre : la suite, questions 12 à 31 ; Marie retrouve ses réponses (D-ETU-41) ;
 *   leçon 1 faite pour l'assemblée (D-ETU-42), Marie 10,5 / 13 (D-ETU-43 : 8,5 + 2) ;
 * - lundi 2 novembre : progression de Marie, avancement de l'assemblée (Samuel).
 *
 * Les écrans repris d'« Étude » et de « Guide » lisent leurs données par `useEtude()` : on leur
 * passe ici des jeux complets (`FournisseurEtude`), construits sur ceux de « Guide »
 * (`etudeGuide`), sans toucher à ces fichiers.
 *
 * Correctif propre à cette vidéo : « Guide » note Jean 7 / 11 sur la plage 1 à 11, mais sa copie
 * (`COPIES_FINALES.jean` d'« Étude », restreinte aux questions 1 à 11) vaut 1 + 1 + 1 + 1 + 0 + 1 + 3
 * = 8. On affiche 8 (sa note de la séance, ses résultats) ; sa note cumulée reste 9 / 13 (8 + Q13
 * personnelle 1 + Q31 « a » 0), celle que montre l'avancement de « Guide » (`avancementAssemblee`).
 */
import type { Etude } from '../etude/langue';
import { DONNEES as DONNEES_ETUDE, LigneCopie } from '../etude/donnees';
import { etudeGuide } from '../guide/donnees';
import { CARTONS as CARTONS_BERTOUA } from './textes';

const E = DONNEES_ETUDE.fr!;

/**
 * Les plans repris d'« Étude » (P16Resultats…) lisent la pastille de Samuel dans `cartons` du
 * contexte (« SAMUEL · DIRIGEANT » d'Étude) : on la remplace par celle de cette vidéo
 * (« SAMUEL · DIRIGEANT D'UNITÉ »), sans toucher à EtudeFR — D-FIX vidéos, JP 29/10 (constat de
 * revue : P16 de BertouaFR, ≈ 151 à 167 s, affichait encore l'ancien libellé).
 */
const avecSamuelUnite = (e: Etude): Etude => ({
  ...e,
  cartons: { ...e.cartons, pastilles: { ...e.cartons.pastilles, samuel: CARTONS_BERTOUA.pastilles.samuel } },
});

/** Le jeu de la leçon entière (réponses ouvertes : toutes les questions sont à l'écran). */
export const ETUDE_LECON: Etude = avecSamuelUnite(etudeGuide('fr', 'lecon'));

const corrigeJean = (l: readonly LigneCopie[]): LigneCopie[] => l.map((c) => (c.nom === E.PERSONNES.jean.nom ? { ...c, note: 8 } : c));

const base1 = avecSamuelUnite(etudeGuide('fr', 'plage1'));

/**
 * Séance du 25 octobre arrêtée après la question 11 : questions 1 à 11 (note sur 11), 10 copies
 * dans l'app, puis les deux copies papier ; 3 réponses écrites par copie, David et Sylvain en ont
 * laissé une sans réponse : 10 × 3 − 2 = 28 avis à poser.
 */
export const ETUDE_PLAGE1: Etude = {
  ...base1,
  d: {
    ...base1.d,
    COPIES: corrigeJean(base1.d.COPIES),
    COPIES_AVEC_PAUL: corrigeJean(base1.d.COPIES_AVEC_PAUL),
    COPIES_AVEC_PAPIER: corrigeJean(base1.d.COPIES_AVEC_PAPIER),
    SANS_COPIE_APRES_PAUL: base1.d.SANS_COPIE.filter((n) => n !== E.PERSONNES.paul.nom),
    NOTES: { marie: 8.5, jean: 8, esther: 10.5 },
    AVIS_RESTANTS: 28,
  },
};

/** Séance du 1er novembre : questions 12 à 31 (Q12 exercice, Q13 personnelle, Q31 choix unique). */
export const ETUDE_PLAGE2: Etude = avecSamuelUnite(etudeGuide('fr', 'plage2'));

/**
 * Après le 1er novembre : la leçon 1 est faite (D-ETU-42). Progression de Marie (D-ETU-43, meilleur
 * résultat par question) : 8,5 sur la plage 1 à 11, + 2 sur la plage 12 à 31 = 10,5 / 13 ; la date
 * de la leçon est celle de sa dernière séance.
 */
export const ETUDE_APRES: Etude = {
  ...ETUDE_LECON,
  d: {
    ...ETUDE_LECON.d,
    PROGRESSION_MARIE: {
      faites: 1,
      note: 10.5,
      sur: 13,
      lecons: [
        { numero: 1, titre: 'Le prix à payer', date: '1 novembre 2026', note: 10.5, max: 13 },
        { numero: 2, titre: null, date: null, note: null, max: 6 },
        { numero: 3, titre: null, date: null, note: null, max: 3 },
        { numero: 4, titre: null, date: null, note: null, max: 1 },
        { numero: 5, titre: null, date: null, note: null, max: 1 },
      ],
    },
  },
};

/** Les copies de Jean, Marie et Esther à la fin de la séance du 25 octobre (P15 d'« Étude », restreintes aux questions 1 à 11 par le jeu). */
export const COPIES_TROIS = [E.COPIES_FINALES.jean, E.COPIES_FINALES.marie, E.COPIES_FINALES.esther] as const;
export const NOTES_TROIS = [ETUDE_PLAGE1.d.NOTES.jean, ETUDE_PLAGE1.d.NOTES.marie, ETUDE_PLAGE1.d.NOTES.esther] as const;

/**
 * Le programme (accueil de l'étude du dirigeant) : l'unité du jour, UEMB002, puis une unité dont
 * elle est le prérequis, verrouillée dans l'assemblée (D-ETU-19). Nom de la seconde unité : celui
 * que le tableau du manuel réserve à l'UE suivante (note du fichier `uemb03-extrait.json` du
 * backend) — illustratif.
 */
export const UNITE_SUIVANTE = { code: 'UEMB003', nom: 'Délivrance de tout amour du moi' };
export const UNITE_SUIVANTE_LIBELLE = `${UNITE_SUIVANTE.code} · ${UNITE_SUIVANTE.nom}`;
