import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Plateau } from '../../ui/Plateau';
import { useEtude } from '../../etude/langue';
import type { Copie } from '../../etude/donnees';
import { EcranSeance, positionsSeance } from '../../etude/ecrans/Seance';
import { estRepondue } from '../../etude/ecrans/Questions';
import { P10HorsLigne } from '../../etude/plans/Repondre';
import { Appui, Decale, LegendeEtude, PastillePersonne, Voile, Y_PASTILLE, haloEntre, voilePour } from '../../etude/plans/commun';
import { APP, CARTONS, LEGENDES } from '../textes';

/**
 * Partie « 2 · Répondre ». Les plans P8 (les questions arrivent sur chaque téléphone), P9 (Marie
 * répond : écrite, oui / non, vrai / faux, consigne et sous-questions, personnelle, cases), P10 (Jean
 * sans réseau) et P11 (tout le salon répond, Paul dans son livret, Hélène dans un cahier) sont ceux
 * d'« Étude », repris tels quels. S'y ajoute B1 : Marie finit la leçon — l'exercice (*Fait*), la
 * question personnelle oui / non, le choix unique — puis la colonne des sept sortes de questions
 * (libellés `study.types.*` de l'app).
 */
export const DUREE_B1 = 330;
/** P10 d'« Étude » n'est plus le plan tampon du calage ici : sa durée d'origine. */
export const DUREE_P10 = 165;
export const P10: React.FC = () => <P10HorsLigne duree={DUREE_P10} />;

/** Appuis de Marie (images du plan) et délai d'enregistrement du brouillon (0,7 s). */
const M = { fait: 44, oui: 106, d: 184 } as const;
const ENREGISTREMENT = 21;

const TYPES = ['VRAI_FAUX', 'OUI_NON', 'CHOIX_UNIQUE', 'CHOIX_MULTIPLE', 'OUVERTE', 'PERSONNELLE', 'EXERCICE'] as const;

export const B1Types: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { d } = useEtude();
  const { QUESTIONS, SAISIE_MARIE } = d;
  const pts = positionsSeance(QUESTIONS, { statut: 'REPONSES_OUVERTES' });
  const blocs = pts.liste!.blocs;
  const vers = (id: string, y: number) => -(pts.hautListe + blocs[id].y - y);
  const def = { q11: vers('q11', 110), q12: vers('q12', 230), q13: vers('q13', 220), q31: vers('q31', 170) };
  const defilement = doux(f, [14, 34, 78, 94, 152, 168, 212, 230], [def.q11, def.q12, def.q12, def.q13, def.q13, def.q31, def.q31, 0]);
  const point = (id: string, el: string, dd: number) => ({ x: blocs[id].x.centre, y: pts.hautListe + blocs[id].el[el] + dd });

  // La copie de Marie à la fin de P9, puis ses trois dernières réponses.
  const copie: Copie = {
    q1: { texte: SAISIE_MARIE.q1 },
    q5: { options: ['OUI'] },
    q6: { options: ['VRAI'] },
    q7a: { texte: SAISIE_MARIE.q7a },
    q7b: { texte: SAISIE_MARIE.q7b },
    q10: { texte: SAISIE_MARIE.q10 },
    q11: { options: SAISIE_MARIE.q11 },
    ...(f >= M.fait ? { q12: { fait: true } } : {}),
    ...(f >= M.oui ? { q13: { options: ['OUI'] } } : {}),
    ...(f >= M.d ? { q31: { options: ['d'] } } : {}),
  };
  const repondues = QUESTIONS.filter((q) => estRepondue(q, copie[q.id])).length;
  const enregistre = Object.values(M).some((a) => f >= a && f < a + ENREGISTREMENT) ? 'saving' : 'saved';

  // La colonne des sortes de questions, à droite du téléphone qui se range à gauche.
  const range = doux(f, [236, 252], [0, 1]);
  const zoom = 1;
  return (
    <AbsoluteFill>
      <Decale dx={-235 * range} reduction={1 - 0.22 * range}>
        <Plateau
          zoom={zoom}
          foyer={{ x: 150, y: pts.compteur.y }}
          dessus={
            <>
              <Appui {...point('q12', 'choix:fait', def.q12)} a={M.fait} />
              <Appui {...point('q13', 'choix:OUI', def.q13)} a={M.oui} />
              <Appui {...point('q31', 'choix:d', def.q31)} a={M.d} />
            </>
          }
        >
          <EcranSeance
            statut="REPONSES_OUVERTES"
            copie={copie}
            defilement={defilement}
            repondues={repondues}
            enregistrement={enregistre}
            halos={{
              'q12:numero': haloEntre(f, 34, 76),
              'q13:tag': haloEntre(f, 96, 150),
              'q31:numero': haloEntre(f, 170, 210),
              compteur: haloEntre(f, 230, 320),
            }}
          />
        </Plateau>
        <Voile force={voilePour(zoom)} />
        <PastillePersonne x={540} y={Y_PASTILLE}>
          {CARTONS.pastilles.marie}
        </PastillePersonne>
      </Decale>

      {range > 0.001 ? (
        <div style={{ position: 'absolute', left: 620, top: 760, width: 430, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontFamily: P.mono, fontWeight: 500, fontSize: 24, letterSpacing: 3, color: S.clay, opacity: range }}>{CARTONS.typesTitre}</div>
          {TYPES.map((t, i) => {
            const p = spring({ frame: f - (250 + i * 6), fps, config: { damping: 14 } });
            return (
              <div
                key={t}
                style={{
                  alignSelf: 'flex-start',
                  padding: '14px 26px',
                  borderRadius: 99,
                  background: S.paper,
                  border: `2px solid ${S.mossTint2}`,
                  boxShadow: '0 10px 24px rgba(42,38,32,0.12)',
                  fontFamily: P.sans,
                  fontWeight: 600,
                  fontSize: 34,
                  color: S.moss,
                  opacity: Math.min(1, p),
                  transform: `translateX(${(1 - p) * 60}px)`,
                }}
              >
                {APP.types[t]}
              </div>
            );
          })}
        </div>
      ) : null}

      <LegendeEtude lignes={LEGENDES.b1Exercice} duree={DUREE_B1} fin={76} />
      <LegendeEtude lignes={LEGENDES.b1Perso} duree={DUREE_B1} debut={80} fin={150} />
      <LegendeEtude lignes={LEGENDES.b1Unique} duree={DUREE_B1} debut={154} fin={226} />
      <LegendeEtude lignes={LEGENDES.b1Types} duree={DUREE_B1} debut={230} />
    </AbsoluteFill>
  );
};
