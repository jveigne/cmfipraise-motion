import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { S } from '../../evenements/theme';
import { Plateau } from '../../ui/Plateau';
import { Fondu } from '../../evenements/plans/commun';
import { useEtude } from '../langue';
import { Copie, DonneesEtude } from '../donnees';
import { SalonFlou } from '../ui/Salon';
import { Alerte, boutonsAlerte } from '../ui/Alerte';
import { EcranSeance, positionsSeance } from '../ecrans/Seance';
import {
  Appui,
  LegendeEtude,
  PastillePersonne,
  Pose,
  Poses,
  REPOS,
  Ralenti,
  TelephoneLibre,
  Voile,
  Y_PASTILLE,
  dureeRalentie,
  entre,
  haloEntre,
  imageRalentie,
  largeurTel,
  montee,
  voilePour,
} from './commun';

/**
 * Partie « 3 · Corriger » (P12–P14) : Samuel appuie sur *Passer à la correction* (alerte, RG-ETU-01) ;
 * la saisie se verrouille et les questions fermées se corrigent seules (RG-ETU-05/06, Q11 b, c, f, a
 * → 2 / 4) ; on échange les téléphones (RG-ETU-10) : Jean tient le téléphone de Marie, lit la réponse
 * donnée et la réponse du manuel, appuie sur *Juste*, *À préciser* (RG-ETU-07) ; la question
 * personnelle reste masquée (RG-ETU-08). Poses du retour JP du 21/10 (`Ralenti`) ; P13 n'est plus
 * le plan tampon du calage (c'est P10) : sa chorégraphie est écrite pour 8 s.
 */
/** P12 : « 11 répondants », l'alerte, la pastille « Correction » et « 30 avis restants » tenus. */
const POSES_P12: Poses = [
  [28, 15],
  [62, 15],
  [100, 15],
];
/** P14 : les pastilles « Copie de Marie · entre les mains de Jean », la réponse du manuel, la question masquée. */
const POSES_P14: Poses = [
  [52, 30],
  [112, 30],
  [220, 30],
];
export const DUREE_P12 = dureeRalentie(120, POSES_P12);
export const DUREE_P13 = 240;
export const DUREE_P14 = dureeRalentie(300, POSES_P14);

// ---------------------------------------------------------------------------------------------
// P12 — *Passer à la correction*

const LIGNES_ALERTE = 3;

export const P12Correction: React.FC = () => {
  const { legendes } = useEtude();
  const n = (a: number) => imageRalentie(a, POSES_P12);
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P12}>
        <P12Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p12Repondu} duree={DUREE_P12} fin={n(66)} />
      <LegendeEtude lignes={legendes.p12Verrou} duree={DUREE_P12} debut={n(70)} />
    </AbsoluteFill>
  );
};

const P12Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: APP, cartons: CARTONS, d } = useEtude();
  const { AVIS_RESTANTS, QUESTIONS, REPONDANTS } = d;
  const pts = positionsSeance(QUESTIONS, { statut: 'REPONSES_OUVERTES', dirigeant: true });
  const boutons = boutonsAlerte(LIGNES_ALERTE, true);
  const A = { passer: 40, confirmer: 70 };
  const alerte = doux(f, [44, 56], [0, 1]) * (1 - doux(f, [A.confirmer + 2, A.confirmer + 8], [0, 1]));
  const bascule = doux(f, [74, 84], [0, 1]);
  const zoom = 1.15;
  const avant = (
    <EcranSeance statut="REPONSES_OUVERTES" dirigeant repondants={REPONDANTS} halos={{ stat: haloEntre(f, 14, 36) }} />
  );
  const apres = (
    <EcranSeance
      statut="CORRECTION"
      dirigeant
      repondants={REPONDANTS}
      avisRestants={AVIS_RESTANTS}
      halos={{ pastille: haloEntre(f, 86, 118), stat: haloEntre(f, 90, 118) }}
    />
  );
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: 300 }}
        decalageY={montee(f, fps)}
        dessus={
          <>
            <Appui {...pts.passerCorrection} a={A.passer} />
            <Appui {...boutons.confirmer} a={A.confirmer} coupe={A.confirmer + 6} />
          </>
        }
      >
        <Fondu p={bascule} avant={avant} apres={apres} />
        <Alerte
          titre={APP.leader.toCorrection}
          message={APP.leader.toCorrectionConfirm}
          confirmer={APP.leader.toCorrection}
          lignes={LIGNES_ALERTE}
          empile
          p={alerte}
          appui={doux(f, [A.confirmer - 2, A.confirmer], [0, 1])}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <PastillePersonne x={540} y={Y_PASTILLE}>
        {CARTONS.pastilles.samuel}
      </PastillePersonne>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P13 — Les questions fermées se corrigent seules

/**
 * L'écran est déjà en *Correction* : le rafraîchissement ≈ 5 s l'a fait basculer (D-ETU-23), sans
 * geste. On lit d'abord la carte « Échangez les téléphones » et « 3 réponses écrites restantes »,
 * puis Q5 et Q6 corrigées, puis Q11 au prorata (2 / 4) ; le défilement remonte vers Q1 à la fin,
 * prêt pour l'échange.
 */
export const P13Fermees: React.FC = () => {
  const f = useCurrentFrame();
  const D = DUREE_P13;
  const { cartons: CARTONS, legendes, d } = useEtude();
  const { COPIE_MARIE, QUESTIONS } = d;
  const pts = positionsSeance(QUESTIONS, { statut: 'CORRECTION', copie: COPIE_MARIE });
  const blocs = pts.liste!.blocs;
  const vers = (id: string, y: number) => -(pts.hautListe + blocs[id].y - y);
  const dQ5 = vers('q5', 120);
  const dQ11 = vers('q11', 150);
  const dQ1 = vers('q1', 140);
  const defilement = doux(f, [80, 100, 140, 152, D - 12, D], [0, dQ5, dQ5, dQ11, dQ11, dQ1]);
  const zoom = doux(f, [140, 154, D - 14, D], [1, 1.35, 1.35, 1]);
  const halosQ11 = haloEntre(f, 156, D - 14);
  return (
    <AbsoluteFill>
      <Plateau zoom={zoom} foyer={{ x: 195, y: 420 }}>
        <EcranSeance
          statut="CORRECTION"
          copie={COPIE_MARIE}
          defilement={defilement}
          ecritesRestantes={3}
          halos={{
            ecrites: haloEntre(f, 24, 78),
            'q5:note': haloEntre(f, 100, 140),
            'q6:note': haloEntre(f, 100, 140),
            'q11:note': halosQ11,
            'q11:faux': halosQ11,
            'q11:attendu': halosQ11,
          }}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <PastillePersonne x={540} y={Y_PASTILLE}>
        {CARTONS.pastilles.marie}
      </PastillePersonne>
      <LegendeEtude lignes={legendes.p13Bascule} duree={D} fin={78} />
      <LegendeEtude lignes={legendes.p13Fermees} duree={D} debut={82} fin={152} />
      <LegendeEtude lignes={legendes.p13Cases} duree={D} debut={156} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P14 — On échange les téléphones

/** Les deux téléphones côte à côte (gabarit de P6 de « Documents ») : Marie à gauche, Jean à droite. */
const E2 = 1.24;
const Y2 = 620;
const GAUCHE: Pose = { x: 540 - largeurTel(E2) - 8, y: Y2, e: E2 };
const DROITE: Pose = { x: 548, y: Y2, e: E2 };

/** Appuis (images du plan). */
const A13 = { juste1: 130, juste7a: 170, preciser7b: 186 } as const;

/** La copie de Marie à l'image `f` : les avis de Jean se posent au moment des appuis. */
const copieMarie = ({ COPIE_MARIE, AVIS_JEAN }: DonneesEtude, f: number): Copie => ({
  ...COPIE_MARIE,
  ...(f >= A13.juste1 + 3 ? { q1: { ...COPIE_MARIE.q1, ...AVIS_JEAN.q1 } } : {}),
  ...(f >= A13.juste7a + 3 ? { q7a: { ...COPIE_MARIE.q7a, ...AVIS_JEAN.q7a } } : {}),
  ...(f >= A13.preciser7b + 3 ? { q7b: { ...COPIE_MARIE.q7b, ...AVIS_JEAN.q7b } } : {}),
});

/**
 * Pastille « Copie de Marie · entre les mains de Jean » : les prénoms en argile. `deuxLignes` :
 * pendant le croisement, deux pastilles côte à côte ne tiendraient pas sur une ligne chacune.
 */
const Copie2: React.FC<{ de: string; mains: string; deuxLignes?: boolean }> = ({ de, mains, deuxLignes = false }) => {
  const { cartons: CARTONS } = useEtude();
  const [a, b, sep, c, d] = CARTONS.copie(de, mains);
  return (
    <div style={{ textAlign: 'center', lineHeight: deuxLignes ? 1.35 : undefined }}>
      {a}
      <b style={{ color: S.clay, fontWeight: 600 }}>{b}</b>
      {deuxLignes ? <br /> : sep}
      {c}
      <b style={{ color: S.clay, fontWeight: 600 }}>{d}</b>
    </div>
  );
};

export const P14Echange: React.FC = () => {
  const { legendes } = useEtude();
  const n = (a: number) => imageRalentie(a, POSES_P14);
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P14}>
        <P14Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p14Echange} duree={DUREE_P14} fin={n(74)} />
      <LegendeEtude lignes={legendes.p14Manuel} duree={DUREE_P14} debut={n(76)} fin={n(128)} />
      <LegendeEtude lignes={legendes.p14Avis} duree={DUREE_P14} debut={n(130)} fin={n(200)} />
      <LegendeEtude lignes={legendes.p14Perso} duree={DUREE_P14} debut={n(204)} />
    </AbsoluteFill>
  );
};

const P14Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { cartons: CARTONS, d } = useEtude();
  const { COPIE_JEAN_CORRECTION, COPIE_MARIE, PERSONNES, QUESTIONS } = d;
  const croise = doux(f, [0, 30], [0, 1]);
  const arc = Math.sin(croise * Math.PI);
  const noms = doux(f, [30, 50], [0, 1]);
  const devant = doux(f, [56, 74], [0, 1]);
  const pts = positionsSeance(QUESTIONS, { statut: 'CORRECTION', copie: COPIE_MARIE });
  const blocs = pts.liste!.blocs;
  const vers = (id: string, y: number) => -(pts.hautListe + blocs[id].y - y);
  const dQ1 = vers('q1', 200);
  const d7 = vers('q7a', 150);
  const dQ10 = vers('q10', 380);
  const defilement = doux(f, [56, 72, 152, 166, 192, 206], [0, dQ1, dQ1, d7, d7, dQ10]);
  // Au premier plan (i 74), le téléphone est au repos ; la caméra s'approche ensuite de Q1.
  const zoom = doux(f, [74, 88, 206, 220], [1, 1.3, 1.3, 1.45]);
  const copie = copieMarie(d, f);
  const ecritesRestantes = 3 - [A13.juste1, A13.juste7a, A13.preciser7b].filter((a) => f >= a + 3).length;
  const point = (id: string, avis: string, def: number) => ({ x: blocs[id].x[`avis:${avis}`], y: pts.hautListe + blocs[id].el.avis + def });
  const appuiAvis =
    f >= A13.preciser7b - 2 ? { id: 'q7b', avis: 'A_PRECISER' as const, p: doux(f, [A13.preciser7b, A13.preciser7b + 6], [0, 1]) }
    : f >= A13.juste7a - 2 ? { id: 'q7a', avis: 'JUSTE' as const, p: doux(f, [A13.juste7a, A13.juste7a + 6], [0, 1]) }
    : f >= A13.juste1 - 2 ? { id: 'q1', avis: 'JUSTE' as const, p: doux(f, [A13.juste1, A13.juste1 + 6], [0, 1]) }
    : null;

  const ecranMarie = (
    <EcranSeance
      statut="CORRECTION"
      copie={copie}
      defilement={defilement}
      ecritesRestantes={ecritesRestantes}
      appuiAvis={appuiAvis}
      halos={{
        'q1:donnee': haloEntre(f, 78, 102),
        'q1:manuel': haloEntre(f, 98, 124),
        'q1:note': haloEntre(f, 132, 150),
        ecrites: haloEntre(f, 136, 152),
        'q10:masque': haloEntre(f, 208, 292),
      }}
    />
  );

  // Avant d'être au premier plan, les deux téléphones se croisent (Marie passe à droite, chez Jean).
  if (f < 74) {
    const poseMarie = entre({ x: GAUCHE.x + (DROITE.x - GAUCHE.x) * croise, y: Y2 - 160 * arc, e: E2 * (1 + 0.06 * arc) }, REPOS, devant);
    const poseJean: Pose = { x: DROITE.x + (GAUCHE.x - DROITE.x) * croise, y: Y2 + 70 * arc, e: E2 * (1 - 0.06 * arc) };
    const centreX = (p: Pose) => p.x + largeurTel(p.e) / 2;
    return (
      <AbsoluteFill>
        <SalonFlou />
        <TelephoneLibre pose={poseJean} opacite={1 - devant}>
          <EcranSeance statut="CORRECTION" copie={COPIE_JEAN_CORRECTION} ecritesRestantes={3} />
        </TelephoneLibre>
        <TelephoneLibre pose={poseMarie}>{ecranMarie}</TelephoneLibre>
        <PastillePersonne x={centreX(poseJean)} y={poseJean.y - 44} opacite={(1 - devant) * (1 - noms)} taille={26}>
          {CARTONS.pastilles.jean}
        </PastillePersonne>
        <PastillePersonne x={centreX(poseJean)} y={poseJean.y - 58} opacite={(1 - devant) * noms} taille={20}>
          <Copie2 de={PERSONNES.jean.prenom} mains={PERSONNES.marie.prenom} deuxLignes />
        </PastillePersonne>
        <PastillePersonne x={centreX(poseMarie)} y={poseMarie.y - 44 + (Y_PASTILLE - poseMarie.y + 44) * devant} opacite={1 - noms} taille={26}>
          {CARTONS.pastilles.marie}
        </PastillePersonne>
        <PastillePersonne
          x={centreX(poseMarie) + (540 - centreX(poseMarie)) * devant}
          y={poseMarie.y - 58 + (Y_PASTILLE - (poseMarie.y - 58)) * devant}
          opacite={noms}
          taille={20 + 4 * devant}
        >
          <Copie2 de={PERSONNES.marie.prenom} mains={PERSONNES.jean.prenom} deuxLignes={devant < 0.5} />
        </PastillePersonne>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <SalonFlou />
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: 330 }}
        dessus={
          <>
            <Appui {...point('q1', 'JUSTE', dQ1)} a={A13.juste1} />
            <Appui {...point('q7a', 'JUSTE', d7)} a={A13.juste7a} />
            <Appui {...point('q7b', 'A_PRECISER', d7)} a={A13.preciser7b} />
          </>
        }
      >
        {ecranMarie}
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <PastillePersonne x={540} y={Y_PASTILLE} taille={24}>
        <Copie2 de={PERSONNES.marie.prenom} mains={PERSONNES.jean.prenom} />
      </PastillePersonne>
    </AbsoluteFill>
  );
};
