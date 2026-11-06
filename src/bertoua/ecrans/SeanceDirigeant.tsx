import React from 'react';
import { IoChevronDown, IoChevronUp, IoEyeOutline, IoHourglassOutline } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { Bouton, Carte, Ecran, Etiquette, Halo } from '../../evenements/ui/app';
import { TeteEtude } from '../../etude/ecrans/AccueilEtude';
import { ListeQuestions } from '../../etude/ecrans/Questions';
import type { Statut } from '../../etude/ecrans/Seance';
import { aRepondre } from '../../etude/donnees';
import { useEtude } from '../../etude/langue';
import { ActionsMembres, CarteActions } from '../../guide/ecrans/Etude';
import { NOTES_DIRIGEANT } from '../../guide/donnees';
import { TEXTES_GUIDE } from '../../guide/textes';
import { APP } from '../textes';

/**
 * La séance vue par le dirigeant (`app/study/session/[id].tsx`), telle que livrée après les
 * avenants 04 et 05 : en-tête avec la ligne « Leçon 1 · questions 1 à 31 » (`studyRangeOf`, toujours
 * affichée), pastille d'état, puis le panneau `LeaderPanel` AVEC le bloc repliable « Notes du
 * dirigeant » (D-ETU-35 : présentation de l'unité, recommandations pour la leçon, aperçu des actions
 * des membres ; replié par défaut, texte brut). L'écran de la vidéo « Étude » (`EcranSeance`) est
 * antérieur à l'avenant 04 et n'a pas ce bloc : on le redessine ici, mêmes styles, hauteurs posées
 * pour les appuis. Sous le panneau, ce que voit le dirigeant, répondant lui aussi (D-ETU-06) mais
 * qui pilote sans répondre : le compteur et les questions, « rien à corriger sur ce téléphone »,
 * puis « Ma note » sans copie et « Cette semaine, chaque membre doit : » à la fin (D-ETU-36).
 */

const G = TEXTES_GUIDE.fr.app;
const TON_STATUT: Record<Statut, string> = { REPONSES_OUVERTES: S.moss, CORRECTION: S.earthDeep, TERMINEE: S.ink3 };

/** Bas de la ligne d'état, sans puis avec la ligne de plage (6 + 17). */
const BAS_ENTETE = 227;
const H_PLAGE = 23;

/** Haut du bloc des notes dans le panneau (repère de la carte), selon l'état. */
const HAUT_NOTES: Record<Statut, number> = {
  REPONSES_OUVERTES: 14 + 18 + 8 + 24 + 8 + 18 + 12 + 48 + 8 + 44,
  CORRECTION: 14 + 18 + 8 + 24 + 2 + 17 + 12 + 48,
  TERMINEE: 14 + 18 + 8 + 24,
};
/** Bloc des notes replié : marge 12, filet 1, 4, puis le lien (marge 8, 18). */
const H_NOTES_REPLIE = 12 + 1 + 4 + 8 + 18;

/** Positions (points d'écran, défilement nul, notes repliées). */
export const positionsDirigeant = (statut: Statut, plage = true) => {
  const haut = BAS_ENTETE + (plage ? H_PLAGE : 0) + 14;
  return {
    hautPanneau: haut,
    passerCorrection: { x: 195, y: haut + 126 },
    terminer: { x: 195, y: haut + 119 },
    resultats: { x: 320, y: haut + 23 },
    notes: { x: 120, y: haut + HAUT_NOTES[statut] + 12 + 1 + 4 + 8 + 9 },
    basPanneau: haut + HAUT_NOTES[statut] + H_NOTES_REPLIE + 14,
  };
};

const Texte: React.FC<{ titre: string; texte: string }> = ({ titre, texte }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ fontFamily: P.serif, fontSize: 16, lineHeight: '21px', color: S.ink, letterSpacing: -0.1 }}>{titre}</div>
    <div style={{ fontSize: 14, lineHeight: '21px', color: S.ink2, whiteSpace: 'pre-wrap' }}>{texte}</div>
  </div>
);

const Lien: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: '18px', color: S.moss, whiteSpace: 'nowrap' }}>{children}</div>
);

export const EcranSeanceDirigeant: React.FC<{
  statut: Statut;
  /** Ligne « Leçon 1 · questions … » (`study.lesson` · `study.range`). */
  plage: string;
  repondants?: number;
  avisRestants?: number;
  /** Ouverture du bloc « Notes du dirigeant » (0 → 1). */
  notes?: number;
  defilement?: number;
  halos?: { pastille?: number; stat?: number; notes?: number; corps?: number; plage?: number; resultats?: number };
}> = ({ statut, plage, repondants = 0, avisRestants = 0, notes = 0, defilement = 0, halos = {} }) => {
  const { app: A, d } = useEtude();
  const lecon = d.UNITE.lecons[0];
  const n = NOTES_DIRIGEANT.fr;
  const stat = (texte: string) => (
    <div style={{ marginTop: 8, height: 24, display: 'flex' }}>
      <Halo intensite={halos.stat ?? 0} rayon={8} marge={6} margeY={2} etalement={4}>
        <div style={{ fontFamily: P.serif, fontSize: 18, lineHeight: '24px', color: S.ink, whiteSpace: 'nowrap' }}>{texte}</div>
      </Halo>
    </div>
  );
  return (
    <Ecran defilement={defilement}>
      <TeteEtude kicker={d.UNITE_LIBELLE} titre={A.lessonTitled(1, lecon.titre ?? '')} taille={26} lignesKicker={2} />
      <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 15, lineHeight: '20px', color: S.ink2, marginTop: 4 }}>{lecon.portion}</div>
      <div style={{ marginTop: 6, height: 17, display: 'flex' }}>
        <Halo intensite={halos.plage ?? 0} rayon={6} marge={6} margeY={2} etalement={3}>
          <div style={{ fontFamily: P.mono, fontSize: 12, lineHeight: '17px', color: S.moss, letterSpacing: 0.4, whiteSpace: 'nowrap' }}>{plage}</div>
        </Halo>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, marginBottom: 6, height: 20 }}>
        <Halo intensite={halos.pastille ?? 0} rayon={99} marge={4} margeY={3} etalement={4}>
          <div
            style={{
              height: 20,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              fontFamily: P.mono,
              fontSize: 10,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              padding: '0 8px',
              borderRadius: 99,
              border: `1px solid ${TON_STATUT[statut]}`,
              color: TON_STATUT[statut],
              whiteSpace: 'nowrap',
            }}
          >
            {A.status[statut]}
          </div>
        </Halo>
        <div style={{ flex: 1, fontSize: 13, color: S.ink3 }}>{d.ASSEMBLEE}</div>
      </div>

      {/* LeaderPanel */}
      <Carte style={{ marginTop: 14, padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 18 }}>
          <Etiquette style={{ color: S.mossSoft }}>{A.leader.panel}</Etiquette>
          {/* RG-ETU-08 / D-ETU-09 : pas de lien vers les résultats en correction. */}
          {statut !== 'CORRECTION' ? (
            <Halo intensite={halos.resultats ?? 0} rayon={8} marge={6} margeY={2} etalement={4}>
              <Lien>{A.leader.results}</Lien>
            </Halo>
          ) : null}
        </div>
        {statut === 'REPONSES_OUVERTES' ? (
          <>
            {stat(A.leader.respondents(repondants))}
            <div style={{ marginTop: 8, height: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IoEyeOutline size={16} color={S.moss} />
              <Lien>{A.leader.showKey}</Lien>
            </div>
            <Bouton label={A.leader.toCorrection} hauteur={48} style={{ marginTop: 12 }} />
            <Bouton label={A.leader.cancel} variante="danger" hauteur={44} style={{ marginTop: 8 }} />
          </>
        ) : null}
        {statut === 'CORRECTION' ? (
          <>
            {stat(avisRestants > 0 ? A.leader.reviewsLeft(avisRestants) : A.leader.reviewsDone)}
            <div style={{ marginTop: 2, height: 17, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{A.leader.respondents(repondants)}</div>
            <Bouton label={A.leader.finish} hauteur={48} style={{ marginTop: 12 }} />
          </>
        ) : null}
        {statut === 'TERMINEE' ? stat(A.leader.finished(repondants)) : null}

        {/* D-ETU-35 : « Notes du dirigeant », repliées par défaut. */}
        <div style={{ marginTop: 12, borderTop: `1px solid ${S.hair}`, paddingTop: 4 }}>
          <div style={{ marginTop: 8, height: 18, display: 'flex' }}>
            <Halo intensite={halos.notes ?? 0} rayon={8} marge={6} margeY={3} etalement={4}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {notes > 0.5 ? <IoChevronUp size={16} color={S.moss} /> : <IoChevronDown size={16} color={S.moss} />}
                <Lien>{APP.leaderNotes}</Lien>
              </div>
            </Halo>
          </div>
          {notes > 0.001 ? (
            <div style={{ maxHeight: 640 * notes, overflow: 'hidden', opacity: Math.min(1, notes * 1.4) }}>
              <Halo intensite={halos.corps ?? 0} rayon={10} marge={6} margeY={6} etalement={4}>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Texte titre={G.unitNotes} texte={n.unite} />
                  <Texte titre={G.lessonNotes} texte={n.lecon} />
                  {/* À TERMINEE, les actions ont leur propre bloc, pour tous (D-ETU-36). */}
                  {statut !== 'TERMINEE' ? <ActionsMembres titre={G.memberActionsPreview} actions={n.actions} /> : null}
                </div>
              </Halo>
            </div>
          ) : null}
        </div>
      </Carte>

      {statut === 'REPONSES_OUVERTES' ? (
        <>
          <div style={{ marginTop: 14, marginBottom: 10, height: 18, fontSize: 13, fontWeight: 600, lineHeight: '18px', color: S.moss }}>
            {A.session.answered(0, aRepondre(d.QUESTIONS))}
          </div>
          <ListeQuestions questions={d.QUESTIONS} copie={{}} mode="answer" />
        </>
      ) : null}
      {statut === 'CORRECTION' ? (
        <Carte variante="paper2" style={{ marginTop: 20, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <IoHourglassOutline size={26} color={S.ink3} />
          <div style={{ fontSize: 13.5, lineHeight: '20px', color: S.ink2, textAlign: 'center' }}>{A.session.noAnswerCorrection}</div>
        </Carte>
      ) : null}
      {statut === 'TERMINEE' ? (
        <>
          <Carte style={{ marginTop: 16, padding: 20 }}>
            <Etiquette style={{ color: S.mossSoft, lineHeight: '15px' }}>{A.session.myScore}</Etiquette>
            <div style={{ marginTop: 8, fontFamily: P.serif, fontStyle: 'italic', fontSize: 16, lineHeight: '22px', color: S.ink3 }}>{A.session.noCopy}</div>
            <Bouton label={A.home.myProgress} variante="ghost" hauteur={44} style={{ marginTop: 14, alignSelf: 'flex-start', display: 'inline-flex' }} />
          </Carte>
          <CarteActions />
        </>
      ) : null}
    </Ecran>
  );
};
