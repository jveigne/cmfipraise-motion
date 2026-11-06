import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { useEtude } from '../langue';
import { Salon } from '../ui/Salon';
import { LivreOuvert, LivretOuvert } from '../ui/Livre';
import { Alerte, boutonsAlerte } from '../ui/Alerte';
import { EcranAccueil, TUILE_ETUDE } from '../ecrans/Accueil';
import { EcranAccueilDirigeant, PT_ACCUEIL_ETUDE } from '../ecrans/AccueilEtude';
import { EcranSeance } from '../ecrans/Seance';
import {
  Appui,
  Decale,
  LegendeEtude,
  PastillePersonne,
  Poses,
  Ralenti,
  Voile,
  Y_PASTILLE,
  dureeRalentie,
  haloEntre,
  imageRalentie,
  lisse,
  montee,
  voilePour,
} from './commun';

/**
 * Partie « 1 · Lire » (P6–P7) : on lit la portion ensemble dans le livre (illustration, le salon de
 * P1) ; puis Samuel touche la tuile « Le Message de Bertoua », ouvre l'unité UEMB002, la leçon 1
 * « Le prix à payer » et appuie sur *Commencer* (D-ETU-07, RG-ETU-02b) ; l'alerte de confirmation,
 * puis la séance « Réponses ouvertes », « 0 répondant ». Poses du retour JP du 21/10 (`Ralenti`) :
 * la lecture s'attarde ; la tuile, les cinq leçons, l'alerte et la séance ouverte sont tenues.
 */
const POSES_P6: Poses = [[60, 30]];
const POSES_P7: Poses = [
  [34, 15],
  [124, 15],
  [163, 15],
  [230, 15],
];
export const DUREE_P6 = dureeRalentie(120, POSES_P6);
export const DUREE_P7 = dureeRalentie(255, POSES_P7);

// ---------------------------------------------------------------------------------------------
// P6 — On lit ensemble

const LIVRE = { x: 160, y: 900, largeur: 760 };
/** Les quatre livrets suivis, sous le livre, avec le prénom de chacun. */
const LIVRETS = [
  { nom: 'marie', x: 40, y: 1500 },
  { nom: 'jean', x: 292, y: 1540 },
  { nom: 'esther', x: 544, y: 1540 },
  { nom: 'paul', x: 796, y: 1500 },
] as const;

export const P6Lecture: React.FC = () => {
  const { legendes } = useEtude();
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P6}>
        <P6Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p6} duree={DUREE_P6} />
    </AbsoluteFill>
  );
};

const P6Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { cartons } = useEtude();
  const entree = doux(f, [0, 14], [0, 1]);
  const lecture = doux(f, [16, 100], [0, 1]);
  const pose = doux(f, [90, 104], [0, 1]);
  const tel = doux(f, [96, 110], [0, 1]);
  const vers = doux(f, [110, 120], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: entree }}>
      {/* Le salon, cadré sur Samuel et la table basse, un peu en retrait. */}
      <AbsoluteFill style={{ transform: 'scale(1.3)', transformOrigin: '760px 1250px', opacity: 0.45, filter: 'blur(3px)' }}>
        <Salon />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: LIVRE.x, top: LIVRE.y + pose * 40, transform: `rotate(${-2 * pose}deg)` }}>
        <LivreOuvert largeur={LIVRE.largeur} lecture={lecture < 1 ? lecture : null} />
      </div>
      {LIVRETS.map((l, i) => (
        <div key={l.nom} style={{ position: 'absolute', left: l.x, top: l.y, opacity: doux(f, [4 + i * 4, 16 + i * 4], [0, 1]) }}>
          <LivretOuvert largeur={240} style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }} />
          <div style={{ marginTop: 14, textAlign: 'center', fontFamily: P.sans, fontWeight: 600, fontSize: 28, color: S.ink2 }}>{cartons.etiquettes[l.nom]}</div>
        </div>
      ))}
      {/* Samuel pose le livre et sort son téléphone, qui monte remplir le cadre (raccord P7). */}
      {tel > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 860 - (860 - 480) * vers,
            top: 760 + 500 * vers,
            width: 110,
            height: 220,
            borderRadius: 22,
            background: '#1B1F24',
            boxShadow: '0 18px 36px rgba(18,23,28,0.3), inset 0 0 0 3px #3A4048',
            opacity: tel * (1 - vers),
            transform: `scale(${(0.6 + 0.4 * tel) * (1 + 3 * vers)})`,
          }}
        >
          <div style={{ position: 'absolute', inset: 7, borderRadius: 16, background: S.parchment }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P7 — La tuile, la leçon 1, *Commencer*

/** Appuis (images du plan). */
const A = { tuile: 46, unite: 90, commencer: 140, confirmer: 172 } as const;
const LIGNES_ALERTE = 3;

export const P7Commencer: React.FC = () => {
  const { legendes } = useEtude();
  const n = (a: number) => imageRalentie(a, POSES_P7);
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P7}>
        <P7Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p7Tuile} duree={DUREE_P7} fin={n(86)} />
      <LegendeEtude lignes={legendes.p7Lecon} duree={DUREE_P7} debut={n(88)} fin={n(138)} />
      <LegendeEtude lignes={legendes.p7Geste} duree={DUREE_P7} debut={n(140)} fin={n(196)} />
      <LegendeEtude lignes={legendes.p7Ouverte} duree={DUREE_P7} debut={n(198)} />
    </AbsoluteFill>
  );
};

const P7Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: APP, cartons: CARTONS, d } = useEtude();
  const { PERSONNES, UNITE } = d;
  const p1 = lisse(f, fps, A.tuile + 4, 16);
  const p2 = lisse(f, fps, A.confirmer + 6, 16);
  const ouverture = doux(f, [92, 104], [0, 1]);
  const zoom = doux(f, [106, 120, 178, 194], [1, 1.3, 1.3, 1]);
  const alerte = doux(f, [144, 156], [0, 1]) * (1 - doux(f, [A.confirmer + 2, A.confirmer + 8], [0, 1]));
  const sortie = doux(f, [245, 255], [0, 1]);
  const boutons = boutonsAlerte(LIGNES_ALERTE);
  const lecon = APP.lessonTitled(1, UNITE.lecons[0].titre ?? '');

  const accueil = <EcranAccueil date={APP.dateSamuel} prenom={PERSONNES.samuel.prenom} initiales={PERSONNES.samuel.initiales} dirigeant haloTuile={haloEntre(f, 22, 46)} />;
  const etude = (
    <>
      <EcranAccueilDirigeant ouverture={ouverture} haloUnite={haloEntre(f, 72, 90)} haloLecon1={haloEntre(f, 112, 138)} />
      <Alerte titre={APP.home.startTitle} message={APP.home.startConfirm(lecon)} confirmer={APP.home.start} lignes={LIGNES_ALERTE} p={alerte} appui={doux(f, [A.confirmer - 2, A.confirmer], [0, 1])} />
    </>
  );
  const seance = (
    <EcranSeance statut="REPONSES_OUVERTES" dirigeant repondants={0} halos={{ pastille: haloEntre(f, 198, 222), stat: haloEntre(f, 218, 244) }} />
  );

  return (
    <AbsoluteFill>
      <Decale dx={-900 * sortie} reduction={1 - 0.3 * sortie}>
        <Plateau
          zoom={zoom}
          foyer={{ x: 195, y: 420 }}
          decalageY={montee(f, fps)}
          dessus={
            <>
              <Appui {...TUILE_ETUDE} a={A.tuile} coupe={A.tuile + 6} />
              <Appui {...PT_ACCUEIL_ETUDE.unite} a={A.unite} coupe={A.unite + 8} />
              <Appui {...PT_ACCUEIL_ETUDE.commencer1} a={A.commencer} />
              <Appui {...boutons.confirmer} a={A.confirmer} coupe={A.confirmer + 6} />
            </>
          }
        >
          <Pile p={p1} dessous={accueil} dessus={<Pile p={p2} dessous={etude} dessus={seance} />} />
        </Plateau>
        <Voile force={voilePour(zoom)} />
        <PastillePersonne x={540} y={Y_PASTILLE} opacite={doux(f, [4, 14], [0, 1])}>
          {CARTONS.pastilles.samuel}
        </PastillePersonne>
      </Decale>
    </AbsoluteFill>
  );
};
