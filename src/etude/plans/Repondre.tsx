import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoAirplane } from 'react-icons/io5';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { PastilleCoin } from '../../evenements/ui/Habillage';
import { PageLignee, PAGE_CAHIER, Silhouette } from '../../journal/ui/Illustrations';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { useEtude } from '../langue';
import type { CartonsEtude } from '../textes';
import { Copie, DonneesEtude, Question } from '../donnees';
import { Canne, CheveuxBlancs, Salon, SalonFlou, centrePersonne } from '../ui/Salon';
import { Crayon, LIGNE_REPONSE_LIVRET, PageLivret } from '../ui/Papier';
import { EcranAccueil, TUILE_ETUDE } from '../ecrans/Accueil';
import { EcranAccueilRepondant, PT_ACCUEIL_ETUDE } from '../ecrans/AccueilEtude';
import { EcranSeance, positionsSeance } from '../ecrans/Seance';
import { estRepondue } from '../ecrans/Questions';
import {
  Appui,
  AppuiLibre,
  LegendeEtude,
  PastillePersonne,
  Pose,
  Poses,
  REPOS,
  Ralenti,
  TelephoneLibre,
  Voile,
  Y_PASTILLE,
  borne,
  dureeRalentie,
  entre,
  haloEntre,
  imageRalentie,
  largeurTel,
  lisse,
  montee,
  tape,
  voilePour,
} from './commun';

/**
 * Partie « 2 · Répondre » (P8–P11) : la séance ouverte, les questions arrivent sur chaque téléphone
 * (pastille « En cours » de la tuile, carte « Répondre », la même Q1 sur les trois) ; Marie répond
 * (vrai / faux, oui / non, consigne et sous-questions, question personnelle, cases), chaque saisie
 * « enregistré ✓ » sur le téléphone (D-ETU-11) ; Jean répond sans réseau (P10, plan tampon du
 * calage musical) ; puis tout le salon répond, et ceux qui n'ont pas l'application répondent dans
 * leur livret (Paul) ou dans un cahier (Hélène), comme aujourd'hui (P11, D-ETU-13, JP 21/10) —
 * l'entrée de l'orchestre tombe sur ce plan.
 */
/** P8 : la pastille « En cours » et la même Q1 sur les trois téléphones, tenues. */
const POSES_P8: Poses = [
  [44, 15],
  [150, 30],
];
/** P9 : « enregistré ✓ » après Q1, le zoom sur « 5 / 10 répondues · enregistré ✓ », la question personnelle. */
const POSES_P9: Poses = [
  [74, 15],
  [166, 30],
  [214, 15],
];
export const DUREE_P8 = dureeRalentie(180, POSES_P8);
export const DUREE_P9 = dureeRalentie(255, POSES_P9);
/** P10 : durée calculée (`calage.ts`) ; 135 images au moins (le retour du réseau et sa légende). */
export const DUREE_P10_MIN = 135;
export const DUREE_P11 = 300;

/** Délai d'enregistrement du brouillon après la dernière frappe (`SAVE_DEBOUNCE_MS` 700 ms). */
const ENREGISTREMENT = 21;

/** Compteur « n / 10 répondues » d'une copie. */
const repondues = (questions: readonly Question[], copie: Copie) => questions.filter((q) => estRepondue(q, copie[q.id])).length;

/** État de l'enregistrement : « enregistrement… » de la première frappe à 0,7 s après la dernière. */
const etatEnregistrement = (f: number, saisies: readonly [number, number][]) => {
  const debut = Math.min(...saisies.map(([a]) => a));
  if (f < debut) return 'idle' as const;
  const enCours = saisies.some(([a, b]) => f >= a && f < b + ENREGISTREMENT);
  return enCours ? ('saving' as const) : ('saved' as const);
};

// ---------------------------------------------------------------------------------------------
// P8 — Les questions arrivent sur chaque téléphone

/** Trois téléphones côte à côte : Jean, Marie (au centre), Esther. */
const E3 = 0.8;
const Y3 = 720;
export const TROIS: readonly Pose[] = [
  { x: 540 - largeurTel(E3) * 1.5 - 12, y: Y3, e: E3 },
  { x: 540 - largeurTel(E3) / 2, y: Y3, e: E3 },
  { x: 540 + largeurTel(E3) / 2 + 12, y: Y3, e: E3 },
];
export const personnesTrois = (d: DonneesEtude) => [d.PERSONNES.jean, d.PERSONNES.marie, d.PERSONNES.esther] as const;
export const pastillesTrois = (c: CartonsEtude) => [c.pastilles.jean, c.pastilles.marie, c.pastilles.esther] as const;

export const P8Arrivee: React.FC = () => {
  const { legendes } = useEtude();
  const n = (a: number) => imageRalentie(a, POSES_P8);
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P8}>
        <P8Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p8EnCours} duree={DUREE_P8} fin={n(96)} />
      <LegendeEtude lignes={legendes.p8} duree={DUREE_P8} debut={n(98)} />
    </AbsoluteFill>
  );
};

const P8Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: APP, cartons, d } = useEtude();
  const PERSONNES_TROIS = personnesTrois(d);
  const PASTILLES_TROIS = pastillesTrois(cartons);
  const transition = doux(f, [166, 180], [0, 1]);
  const pulse = haloEntre(f, 26, 52) * (0.65 + 0.35 * Math.sin(((f - 26) / 26) * Math.PI * 4));
  const haloQ1 = haloEntre(f, 130, 172);
  return (
    <AbsoluteFill>
      <SalonFlou />
      {TROIS.map((pose0, i) => {
        const centre = i === 1;
        const a = 54 + i * 8;
        const r = 100 + i * 8;
        const pose = centre ? entre(pose0, REPOS, transition) : pose0;
        const monte = montee(f, fps, i * 6);
        const posee = { ...pose, y: pose.y + monte };
        const opacite = centre ? 1 : 1 - transition;
        const p = PERSONNES_TROIS[i];
        const ecran = (
          <Pile
            p={lisse(f, fps, a + 4, 16)}
            dessous={<EcranAccueil date={APP.dateSamuel} prenom={p.prenom} initiales={p.initiales} live={1} haloLive={pulse} />}
            dessus={
              <Pile
                p={lisse(f, fps, r + 4, 16)}
                dessous={<EcranAccueilRepondant />}
                dessus={<EcranSeance statut="REPONSES_OUVERTES" halos={{ 'q1:numero': haloQ1 }} />}
              />
            }
          />
        );
        return (
          <React.Fragment key={i}>
            <TelephoneLibre pose={posee} opacite={opacite}>
              {ecran}
            </TelephoneLibre>
            {!centre || transition < 1 ? (
              <>
                <AppuiLibre pose={posee} {...TUILE_ETUDE} a={a} coupe={a + 6} />
                <AppuiLibre pose={posee} {...PT_ACCUEIL_ETUDE.repondre} a={r} coupe={r + 6} />
              </>
            ) : null}
            <PastillePersonne
              x={posee.x + largeurTel(posee.e) / 2}
              y={centre ? Y3 - 46 + (Y_PASTILLE - (Y3 - 46)) * transition + monte : Y3 - 46 + monte}
              opacite={opacite * doux(f, [8 + i * 6, 18 + i * 6], [0, 1])}
              taille={centre ? 24 + 6 * transition : 24}
            >
              {PASTILLES_TROIS[i]}
            </PastillePersonne>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P9 — Marie répond

/** Appuis et saisies de Marie (images du plan). */
const M = {
  q1: 14,
  oui: 94,
  vrai: 108,
  q7a: 120,
  q7b: 134,
  q10: 192,
  cases: [234, 240, 246, 252] as const,
} as const;
/** Saisies (début, fin) : le brouillon s'enregistre 0,7 s après la dernière frappe. */
const SAISIES_MARIE: readonly [number, number][] = [
  [18, 50],
  [M.oui, M.oui],
  [M.vrai, M.vrai],
  [122, 132],
  [135, 140],
  [196, 214],
  [M.cases[0], M.cases[3]],
];

/** La copie de Marie à l'image `f` du plan. */
const copieMarie = (SAISIE_MARIE: DonneesEtude['SAISIE_MARIE'], f: number): Copie => {
  const c: Copie = {};
  const t1 = tape(SAISIE_MARIE.q1, f, 18, 1);
  if (t1) c.q1 = { texte: t1 };
  if (f >= M.oui) c.q5 = { options: ['OUI'] };
  if (f >= M.vrai) c.q6 = { options: ['VRAI'] };
  const t7a = tape(SAISIE_MARIE.q7a, f, 122, 1.5);
  if (t7a) c.q7a = { texte: t7a };
  const t7b = tape(SAISIE_MARIE.q7b, f, 135, 2);
  if (t7b) c.q7b = { texte: t7b };
  const t10 = tape(SAISIE_MARIE.q10, f, 196, 4);
  if (t10) c.q10 = { texte: t10 };
  const cases = SAISIE_MARIE.q11.filter((_, i) => f >= M.cases[i]);
  if (cases.length) c.q11 = { options: cases };
  return c;
};

export const P9Marie: React.FC = () => {
  const { legendes } = useEtude();
  const n = (a: number) => imageRalentie(a, POSES_P9);
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P9}>
        <P9Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p9Types} duree={DUREE_P9} fin={n(146)} />
      <LegendeEtude lignes={legendes.p9Enregistre} duree={DUREE_P9} debut={n(148)} fin={n(186)} />
      <LegendeEtude lignes={legendes.p9Perso} duree={DUREE_P9} debut={n(188)} />
    </AbsoluteFill>
  );
};

const P9Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { cartons: CARTONS, d: donnees } = useEtude();
  const { QUESTIONS, SAISIE_MARIE } = donnees;
  const pts = positionsSeance(QUESTIONS, { statut: 'REPONSES_OUVERTES' });
  const blocs = pts.liste!.blocs;
  const haut = pts.hautListe;
  /** Défilement qui amène la carte `id` à l'ordonnée `y` de l'écran. */
  const vers = (id: string, y: number) => -(haut + blocs[id].y - y);
  const d = {
    q5: vers('q5', 150),
    q7: vers('q7', 130),
    q10: vers('q10', 260),
    q11: vers('q11', 110),
  };
  const defilement = doux(
    f,
    [76, 90, 112, 124, 148, 158, 182, 192, 222, 232],
    [0, d.q5, d.q5, d.q7, d.q7, 0, 0, d.q10, d.q10, d.q11],
  );
  const zoom = doux(f, [148, 158, 180, 190], [1, 1.4, 1.4, 1]);
  const copie = copieMarie(SAISIE_MARIE, f);
  const point = (id: string, el: string, def: number) => ({ x: blocs[id].x.centre, y: haut + blocs[id].el[el] + def });
  const curseur = f >= M.q1 && f < 60 ? 'q1' : f >= M.q7a && f < M.q7b ? 'q7a' : f >= M.q7b && f < 146 ? 'q7b' : f >= M.q10 && f < 220 ? 'q10' : null;
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 150, y: pts.compteur.y }}
        dessus={
          <>
            <Appui {...point('q1', 'champ', 0)} a={M.q1} />
            <Appui {...point('q5', 'choix:OUI', d.q5)} a={M.oui} />
            <Appui {...point('q6', 'choix:VRAI', d.q5)} a={M.vrai} />
            <Appui {...point('q7a', 'champ', d.q7)} a={M.q7a} />
            <Appui {...point('q7b', 'champ', d.q7)} a={M.q7b} />
            <Appui {...point('q10', 'champ', d.q10)} a={M.q10} />
            {SAISIE_MARIE.q11.map((k, i) => (
              <Appui key={k} {...point('q11', `choix:${k}`, d.q11)} a={M.cases[i]} />
            ))}
          </>
        }
      >
        <EcranSeance
          statut="REPONSES_OUVERTES"
          copie={copie}
          defilement={defilement}
          repondues={repondues(QUESTIONS, copie)}
          enregistrement={etatEnregistrement(f, SAISIES_MARIE)}
          curseur={curseur}
          halos={{ compteur: haloEntre(f, 152, 182), 'q10:tag': haloEntre(f, 192, 224) }}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <PastillePersonne x={540} y={Y_PASTILLE}>
        {CARTONS.pastilles.marie}
      </PastillePersonne>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P10 — Sans réseau (plan tampon du calage musical)

const J = { b: 28, c: 36 } as const;
const AVION = 10;

/**
 * Jean répond en mode avion : « enregistré ✓ » quand même, puis le bandeau « Hors ligne » ; le
 * réseau revient et les réponses partent. La durée est calculée (`calage.ts`) pour que P11 tombe
 * sur l'entrée de l'orchestre : le début est fixe, la fin (retour du réseau) est posée depuis la FIN
 * du plan (`D − n`).
 */
export const P10HorsLigne: React.FC<{ duree: number }> = ({ duree: D }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons: CARTONS, legendes, d } = useEtude();
  const { QUESTIONS, COPIE_JEAN } = d;
  const RETOUR = D - 34;
  // Pastille « mode avion » sur le coin du téléphone (gabarit de P7 de « Documents »).
  const badge = spring({ frame: f - AVION, fps, config: { damping: 12 } }) * (1 - doux(f, [RETOUR, RETOUR + 10], [0, 1]));
  const avion = doux(f, [AVION, AVION + 10], [0, 1]) * (1 - doux(f, [RETOUR, RETOUR + 12], [0, 1]));
  const horsLigne = doux(f, [40, 50], [0, 1]) * (1 - doux(f, [RETOUR + 2, RETOUR + 14], [0, 1]));
  const ptsAvant = positionsSeance(QUESTIONS, { statut: 'REPONSES_OUVERTES' });
  const blocs = ptsAvant.liste!.blocs;
  const dQ11 = -(ptsAvant.hautListe + blocs.q11.y - 110);
  const defilement = doux(f, [40, 56], [dQ11, 0]);
  const zoom = doux(f, [46, 58, D - 50, D - 38], [1, 1.3, 1.3, 1]);
  const copie: Copie = { ...COPIE_JEAN, ...(f >= J.b ? { q11: { options: f >= J.c ? ['b', 'c'] : ['b'] } } : {}) };
  const point = (k: string) => ({ x: blocs.q11.x.centre, y: ptsAvant.hautListe + blocs.q11.el[`choix:${k}`] + dQ11 });
  const pts = positionsSeance(QUESTIONS, { statut: 'REPONSES_OUVERTES', horsLigne });
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: (pts.bandeau.y + pts.compteur.y) / 2 }}
        avion={avion}
        dessus={
          <>
            <Appui {...point('b')} a={J.b} />
            <Appui {...point('c')} a={J.c} />
          </>
        }
      >
        <EcranSeance
          statut="REPONSES_OUVERTES"
          copie={copie}
          horsLigne={horsLigne}
          defilement={defilement}
          repondues={repondues(QUESTIONS, copie)}
          enregistrement={etatEnregistrement(f, [[J.b, J.c]])}
          halos={{ compteur: haloEntre(f, 50, D - 52), bandeau: haloEntre(f, 50, D - 52) * horsLigne }}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <PastilleCoin echelle={badge}>
        <IoAirplane size={80} color={S.moss} />
      </PastilleCoin>
      <PastillePersonne x={540} y={Y_PASTILLE}>
        {CARTONS.pastilles.jean}
      </PastillePersonne>
      <LegendeEtude lignes={legendes.p10Reseau} duree={D} fin={84} />
      <LegendeEtude lignes={legendes.p10Retour} duree={D} debut={88} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P11 — Tout le monde répond : sur son téléphone, dans son livret, dans un cahier (orchestre à i 0)

/** Mise en page des deux pages (pixels vidéo) : livret de Paul à gauche, cahier d'Hélène à droite. */
const PAGE_ECHELLE = 0.97;
const PAGE_L = PAGE_CAHIER.largeur * PAGE_ECHELLE;
const PAGE_H = PAGE_CAHIER.hauteur * PAGE_ECHELLE;
const HAUT_PAGES = 960;
const GAUCHE_PAUL = 44;
const GAUCHE_HELENE = 1080 - 44 - PAGE_L;
const TETE_SILHOUETTES = 630;

/** Écriture : une réponse du livret toutes les 26 images, une ligne du cahier toutes les 22. */
const ECRIT = { debut: 150, livret: 26, cahier: 22 } as const;

export const P11Papier: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons: CARTONS, legendes } = useEtude();
  // Le salon, plan large : chacun répond ; les écrans s'allument sur l'orchestre.
  const salon = 1 - doux(f, [104, 124], [0, 1]);
  const telephones = doux(f, [8, 40], [0, 1]);
  const anneaux = doux(f, [50, 64], [0, 1]) * salon;
  const etiquettes = spring({ frame: f - 54, fps, config: { damping: 12 } });
  // Les deux pages : Paul, son livret ; Hélène, un cahier.
  const pages = doux(f, [116, 140], [0, 1]);
  const ecritesLivret = Math.max(0, (f - ECRIT.debut) / ECRIT.livret);
  const ecritesCahier = Math.max(0, (f - ECRIT.debut) / ECRIT.cahier);
  const supports = doux(f, [140, 156], [0, 1]);
  const accentLivret = doux(f, [150, 160, 204, 212], [0, 1, 1, 0]);
  const accentCahier = doux(f, [208, 218, 290, 300], [0, 1, 1, 0]);

  // Pointes des crayons : au bout de la réponse (ou de la ligne) en cours.
  const nLivret = CARTONS.livretPaul.lignes.length;
  const iL = Math.min(nLivret - 1, Math.floor(ecritesLivret));
  const pL = ecritesLivret >= nLivret ? 1 : ecritesLivret - iL;
  const crayonLivret = {
    x: GAUCHE_PAUL + (46 + pL * Math.min(360, CARTONS.livretPaul.lignes[iL].main.length * 14)) * PAGE_ECHELLE,
    y: HAUT_PAGES + (LIGNE_REPONSE_LIVRET(iL) - 6) * PAGE_ECHELLE,
  };
  const nCahier = CARTONS.cahierHelene.length;
  const iC = Math.min(nCahier - 1, Math.floor(ecritesCahier));
  const pC = ecritesCahier >= nCahier ? 1 : ecritesCahier - iC;
  const crayonCahier = {
    x: GAUCHE_HELENE + (76 + pC * Math.min(370, CARTONS.cahierHelene[iC].length * 12.5)) * PAGE_ECHELLE,
    y: HAUT_PAGES + (PAGE_CAHIER.hautLignes + iC * PAGE_CAHIER.interligne - 8) * PAGE_ECHELLE,
  };

  const anneau = (nom: 'paul' | 'helene') => {
    const c = centrePersonne(nom);
    return (
      <div
        style={{
          position: 'absolute',
          left: c.x - 80,
          top: c.y - 108,
          width: 160,
          height: 180,
          borderRadius: 80,
          border: `6px solid ${S.clay}`,
          boxShadow: '0 0 30px rgba(184,106,74,0.45)',
          opacity: anneaux,
          transform: `scale(${0.9 + 0.1 * anneaux})`,
        }}
      />
    );
  };

  const accent = (p: number) => ({
    boxShadow: `0 30px 60px rgba(42,38,32,0.22), 0 0 0 ${8 * p}px rgba(184,106,74,${0.55 * p})`,
  });

  return (
    <AbsoluteFill>
      {salon > 0.001 ? (
        <AbsoluteFill style={{ opacity: salon, transform: `scale(${1.06 - 0.06 * doux(f, [0, 24], [0, 1]) + 0.1 * (1 - salon)})`, transformOrigin: '540px 1200px' }}>
          <Salon telephones={telephones} etiquettes={{ paul: etiquettes, helene: etiquettes }} />
          {anneau('paul')}
          {anneau('helene')}
        </AbsoluteFill>
      ) : null}

      {pages > 0.001 ? (
        <AbsoluteFill style={{ opacity: pages, transform: `translateY(${(1 - pages) * 80}px)` }}>
          {/* Paul, son livret de l'étudiant. */}
          <PastillePersonne x={GAUCHE_PAUL + PAGE_L / 2} y={TETE_SILHOUETTES - 70}>
            {CARTONS.pastilles.paul}
          </PastillePersonne>
          <Silhouette x={GAUCHE_PAUL + PAGE_L / 2} y={TETE_SILHOUETTES} teinte={S.mossSoft} taille={0.72} />
          <div style={{ position: 'absolute', left: GAUCHE_PAUL, top: HAUT_PAGES, width: PAGE_CAHIER.largeur, height: PAGE_CAHIER.hauteur, transform: `scale(${PAGE_ECHELLE}) rotate(-2deg)`, transformOrigin: '0 0', borderRadius: '4px 14px 14px 4px', ...accent(accentLivret) }}>
            <PageLivret ecrites={ecritesLivret} />
          </div>
          {/* Hélène, sans smartphone : un simple cahier. */}
          <PastillePersonne x={GAUCHE_HELENE + PAGE_L / 2} y={TETE_SILHOUETTES - 70}>
            {CARTONS.pastilles.helene}
          </PastillePersonne>
          <Canne x={GAUCHE_HELENE + PAGE_L / 2 + 120} y={TETE_SILHOUETTES + 70} echelle={1.3} />
          <Silhouette x={GAUCHE_HELENE + PAGE_L / 2} y={TETE_SILHOUETTES} teinte={S.mossSoft} taille={0.72}>
            <CheveuxBlancs taille={0.72} />
          </Silhouette>
          <div style={{ position: 'absolute', left: GAUCHE_HELENE, top: HAUT_PAGES, width: PAGE_CAHIER.largeur, height: PAGE_CAHIER.hauteur, transform: `scale(${PAGE_ECHELLE}) rotate(2deg)`, transformOrigin: '0 0', borderRadius: '4px 14px 14px 4px', ...accent(accentCahier) }}>
            <PageLignee lignes={CARTONS.cahierHelene} ecrites={ecritesCahier} taille={26} />
          </div>
          {/* Ce sur quoi chacun répond (annotation vidéo). */}
          {[
            { x: GAUCHE_PAUL + PAGE_L / 2, texte: CARTONS.supports[0] },
            { x: GAUCHE_HELENE + PAGE_L / 2, texte: CARTONS.supports[1] },
          ].map((e) => (
            <div
              key={e.texte}
              style={{
                position: 'absolute',
                left: e.x,
                top: HAUT_PAGES + PAGE_H + 50,
                transform: 'translateX(-50%)',
                fontFamily: P.mono,
                fontWeight: 500,
                fontSize: 30,
                letterSpacing: 3,
                color: S.earthDeep,
                whiteSpace: 'nowrap',
                opacity: supports,
              }}
            >
              {e.texte}
            </div>
          ))}
          <Crayon x={crayonLivret.x} y={crayonLivret.y} opacite={borne((f - ECRIT.debut + 4) / 4) * (1 - doux(f, [ECRIT.debut + nLivret * ECRIT.livret, ECRIT.debut + nLivret * ECRIT.livret + 8], [0, 1]))} />
          <Crayon x={crayonCahier.x} y={crayonCahier.y} opacite={borne((f - ECRIT.debut + 4) / 4) * (1 - doux(f, [ECRIT.debut + nCahier * ECRIT.cahier, ECRIT.debut + nCahier * ECRIT.cahier + 8], [0, 1]))} />
        </AbsoluteFill>
      ) : null}

      <LegendeEtude lignes={legendes.p11Tous} duree={DUREE_P11} fin={106} />
      <LegendeEtude lignes={legendes.p11Livret} duree={DUREE_P11} debut={110} fin={206} />
      <LegendeEtude lignes={legendes.p11Cahier} duree={DUREE_P11} debut={210} />
    </AbsoluteFill>
  );
};
