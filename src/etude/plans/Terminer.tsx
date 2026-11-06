import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Fondu } from '../../evenements/plans/commun';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { useEtude } from '../langue';
import { LigneCopie } from '../donnees';
import { SalonFlou } from '../ui/Salon';
import { Alerte, boutonsAlerte } from '../ui/Alerte';
import { EcranSeance, positionsSeance } from '../ecrans/Seance';
import { EcranResultats, ModalePapier, PT_RESULTATS, centreCopie, ptModale } from '../ecrans/Resultats';
import { TROIS, pastillesTrois } from './Repondre';
import {
  Appui,
  LegendeEtude,
  PastillePersonne,
  Poses,
  Ralenti,
  TelephoneLibre,
  Voile,
  Y_PASTILLE,
  dureeRalentie,
  haloEntre,
  imageRalentie,
  largeurTel,
  lisse,
  montee,
  tape,
  voilePour,
} from './commun';

/**
 * Partie « 4 · Terminer » (P15–P16) : Samuel appuie sur *Terminer* (alerte) ; la séance passe
 * « Terminée » (RG-ETU-01, RG-ETU-11) et chacun voit sa note (« Ma note » 10,5 / 13, 9 / 13,
 * 12,5 / 13) ; puis les résultats de l'assemblée (RG-ETU-14) et les deux copies papier (D-ETU-13 :
 * la note seule) — Paul (son livret), puis Hélène (son cahier).
 */
/** P15 : l'alerte, « Séance terminée — 11 copies » et les trois notes tenues (retour JP du 21/10). */
const POSES_P15: Poses = [
  [46, 15],
  [96, 30],
  [150, 15],
];
export const DUREE_P15 = dureeRalentie(210, POSES_P15);
export const DUREE_P16 = 495;

// ---------------------------------------------------------------------------------------------
// P15 — *Terminer* : chacun voit sa note

const LIGNES_ALERTE = 3;
const T = { terminer: 26, confirmer: 56 } as const;

export const P15Notes: React.FC = () => {
  const { legendes } = useEtude();
  const n = (a: number) => imageRalentie(a, POSES_P15);
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P15}>
        <P15Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p15Terminer} duree={DUREE_P15} fin={n(97)} />
      <LegendeEtude lignes={legendes.p15Note} duree={DUREE_P15} debut={n(100)} />
    </AbsoluteFill>
  );
};

const P15Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: APP, cartons, d } = useEtude();
  const { COPIES_FINALES, NOTES, QUESTIONS, REPONDANTS } = d;
  const NOTES_TROIS = [NOTES.jean, NOTES.marie, NOTES.esther] as const;
  const COPIES_TROIS = [COPIES_FINALES.jean, COPIES_FINALES.marie, COPIES_FINALES.esther] as const;
  const PASTILLES_TROIS = pastillesTrois(cartons);
  const pts = positionsSeance(QUESTIONS, { statut: 'CORRECTION', dirigeant: true });
  const boutons = boutonsAlerte(LIGNES_ALERTE);
  const alerte = doux(f, [30, 42], [0, 1]) * (1 - doux(f, [T.confirmer + 2, T.confirmer + 8], [0, 1]));
  const bascule = doux(f, [60, 70], [0, 1]);
  const sortie = doux(f, [98, 112], [0, 1]);
  return (
    <AbsoluteFill>
      {sortie > 0.001 ? <SalonFlou opacite={sortie} /> : null}
      {sortie < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - sortie, transform: `translateY(${sortie * 120}px)` }}>
          <Plateau
            zoom={1.15}
            foyer={{ x: 195, y: 300 }}
            decalageY={montee(f, fps)}
            dessus={
              <>
                <Appui {...pts.terminer} a={T.terminer} />
                <Appui {...boutons.confirmer} a={T.confirmer} coupe={T.confirmer + 6} />
              </>
            }
          >
            <Fondu
              p={bascule}
              avant={<EcranSeance statut="CORRECTION" dirigeant repondants={REPONDANTS} avisRestants={0} />}
              apres={<EcranSeance statut="TERMINEE" dirigeant repondants={REPONDANTS} halos={{ stat: haloEntre(f, 72, 98), pastille: haloEntre(f, 64, 90) }} />}
            />
            <Alerte
              titre={APP.leader.finish}
              message={APP.leader.finishConfirm}
              confirmer={APP.leader.finish}
              lignes={LIGNES_ALERTE}
              p={alerte}
              appui={doux(f, [T.confirmer - 2, T.confirmer], [0, 1])}
            />
          </Plateau>
          <Voile force={voilePour(1.15)} />
          <PastillePersonne x={540} y={Y_PASTILLE}>
            {cartons.pastilles.samuel}
          </PastillePersonne>
        </AbsoluteFill>
      ) : null}

      {/* Les trois téléphones montent, chacun sur sa séance terminée : « Ma note ». */}
      {f >= 100
        ? TROIS.map((pose0, i) => {
            const monte = montee(f, fps, 104 + i * 6);
            const pose = { ...pose0, y: pose0.y + monte };
            const note = spring({ frame: f - (120 + i * 8), fps, config: { damping: 11 } });
            return (
              <React.Fragment key={i}>
                <TelephoneLibre pose={pose}>
                  <EcranSeance statut="TERMINEE" copie={COPIES_TROIS[i]} note={NOTES_TROIS[i]} apparitionNote={note} halos={{ noteFinale: haloEntre(f, 140, 198) }} />
                </TelephoneLibre>
                <PastillePersonne x={pose.x + largeurTel(pose.e) / 2} y={pose.y - 46} taille={24}>
                  {PASTILLES_TROIS[i]}
                </PastillePersonne>
              </React.Fragment>
            );
          })
        : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P16 — Les résultats ; les copies papier de Paul et d'Hélène

/**
 * Images du plan : le dirigeant ouvre les résultats ; puis deux fois « Ajouter une copie papier » —
 * Paul (2ᵉ de la liste des membres sans copie : Hélène, Paul, Rose, Samuel), puis Hélène (1ʳᵉ de la
 * liste qui reste) ; enfin les deux lignes « papier » dans les résultats.
 */
const R = {
  resultats: 14,
  paul: { ajouter: 136, modale: 140, choisir: 190, membre: 214, note: 228, frappe: 232, enregistrer: 252, ferme: 256 },
  helene: { ajouter: 300, modale: 304, choisir: 324, membre: 342, note: 356, frappe: 360, enregistrer: 380, ferme: 384 },
  final: 420,
} as const;
const DEF_LEGER = -100;

/** État de la modale pendant une saisie (`s` : images de cette saisie). */
const modale = (f: number, s: (typeof R)['paul'] | (typeof R)['helene'], nom: string, note: string, liste: readonly string[]) => ({
  liste,
  p: f >= s.ajouter && f < s.ferme + 12 ? Math.min(1, Math.max(0, (f - s.modale) / 10)) * (1 - Math.min(1, Math.max(0, (f - s.ferme) / 10))) : 0,
  ouverte: Math.min(1, Math.max(0, (f - s.choisir - 2) / 8)) * (1 - Math.min(1, Math.max(0, (f - s.membre - 2) / 6))),
  membre: f >= s.membre + 2 ? nom : null,
  note: tape(note, f, s.frappe, 0.25),
  curseurNote: f >= s.note && f < s.enregistrer,
});

export const P16Resultats: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons: CARTONS, legendes, d } = useEtude();
  const { COPIES, COPIES_AVEC_PAUL, COPIES_AVEC_PAPIER, NOTES_PAPIER, PERSONNES, QUESTIONS, REPONDANTS, SANS_COPIE, SANS_COPIE_APRES_PAUL } = d;
  const pts = positionsSeance(QUESTIONS, { statut: 'TERMINEE', dirigeant: true });
  const p = lisse(f, fps, R.resultats + 4, 16);
  const copies: readonly LigneCopie[] = f >= R.helene.ferme + 4 ? COPIES_AVEC_PAPIER : f >= R.paul.ferme + 4 ? COPIES_AVEC_PAUL : COPIES;

  // À la fin, les deux lignes « papier » dans le champ : Hélène vers le haut, Paul plus bas.
  const iHelene = COPIES_AVEC_PAPIER.findIndex((c) => c.nom === PERSONNES.helene.nom);
  const DEF_FINAL = -(centreCopie(COPIES_AVEC_PAPIER, iHelene) - 230);
  const defilement = doux(f, [50, 64, R.final, R.final + 16], [0, DEF_LEGER, DEF_LEGER, DEF_FINAL]);

  const enPaul = f < R.helene.ajouter - 4;
  const m = enPaul
    ? modale(f, R.paul, PERSONNES.paul.nom, NOTES_PAPIER.paul, SANS_COPIE)
    : modale(f, R.helene, PERSONNES.helene.nom, NOTES_PAPIER.helene, SANS_COPIE_APRES_PAUL);
  const ptP = ptModale(SANS_COPIE.length);
  const ptH = ptModale(SANS_COPIE_APRES_PAUL.length);
  const nom = (n: string) => COPIES.findIndex((c) => c.nom === n);
  const halos: Partial<Record<string, number>> = {
    [COPIES[nom(PERSONNES.esther.nom)].nom]: haloEntre(f, 66, 112),
    [COPIES[nom(PERSONNES.jean.nom)].nom]: haloEntre(f, 72, 118),
    [COPIES[nom(PERSONNES.marie.nom)].nom]: haloEntre(f, 78, 124),
    [PERSONNES.helene.nom]: haloEntre(f, R.final + 18, DUREE_P16 - 2),
    [PERSONNES.paul.nom]: haloEntre(f, R.final + 24, DUREE_P16 - 2),
  };
  const ajouter = { x: PT_RESULTATS.ajouterPapier.x, y: PT_RESULTATS.ajouterPapier.y + DEF_LEGER };
  // Le nom choisi dans la liste déroulée : 2ᵉ ligne (Paul) puis 1ʳᵉ (Hélène), d'après l'ordre des listes.
  const lignePaul = ptP.ligne(SANS_COPIE.indexOf(PERSONNES.paul.nom));
  const ligneHelene = ptH.ligne(SANS_COPIE_APRES_PAUL.indexOf(PERSONNES.helene.nom));
  return (
    <AbsoluteFill>
      <Plateau
        foyer={{ x: 195, y: 520 }}
        dessus={
          <>
            <Appui {...pts.resultats} a={R.resultats} coupe={R.resultats + 6} />
            <Appui {...ajouter} a={R.paul.ajouter} />
            <Appui {...ptP.choisir} a={R.paul.choisir} />
            <Appui {...lignePaul} a={R.paul.membre} coupe={R.paul.membre + 6} />
            <Appui {...ptP.note} a={R.paul.note} />
            <Appui {...ptP.enregistrer} a={R.paul.enregistrer} coupe={R.paul.enregistrer + 6} />
            <Appui {...ajouter} a={R.helene.ajouter} />
            <Appui {...ptH.choisir} a={R.helene.choisir} />
            <Appui {...ligneHelene} a={R.helene.membre} coupe={R.helene.membre + 6} />
            <Appui {...ptH.note} a={R.helene.note} />
            <Appui {...ptH.enregistrer} a={R.helene.enregistrer} coupe={R.helene.enregistrer + 6} />
          </>
        }
      >
        <Pile
          p={p}
          dessous={<EcranSeance statut="TERMINEE" dirigeant repondants={REPONDANTS} halos={{ resultats: haloEntre(f, 0, 16) }} />}
          dessus={
            <>
              <EcranResultats
                copies={copies}
                defilement={defilement}
                halos={halos}
                haloEtiquette={haloEntre(f, R.paul.ferme + 8, R.paul.ferme + 40) + haloEntre(f, R.helene.ferme + 6, R.final)}
              />
              <ModalePapier {...m} />
            </>
          }
        />
      </Plateau>
      <PastillePersonne x={540} y={Y_PASTILLE}>
        {CARTONS.pastilles.samuel}
      </PastillePersonne>
      <LegendeEtude lignes={legendes.p16Resultats} duree={DUREE_P16} fin={126} />
      <LegendeEtude lignes={legendes.p16Papier} duree={DUREE_P16} debut={130} fin={210} />
      <LegendeEtude lignes={legendes.p16Paul} duree={DUREE_P16} debut={214} fin={296} />
      <LegendeEtude lignes={legendes.p16Helene} duree={DUREE_P16} debut={300} fin={R.final - 2} />
      <LegendeEtude lignes={legendes.p16Resultat} duree={DUREE_P16} debut={R.final + 2} />
    </AbsoluteFill>
  );
};
