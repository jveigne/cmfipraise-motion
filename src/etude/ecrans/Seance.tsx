import React from 'react';
import { IoCloudOfflineOutline, IoEyeOutline, IoHourglassOutline, IoSwapHorizontal } from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Bouton, Carte, Ecran, Etiquette, Halo } from '../../evenements/ui/app';
import { useEtude } from '../langue';
import { Copie, Question, aRepondre, noteSur } from '../donnees';
import { TeteEtude } from './AccueilEtude';
import { Avis, Halos, ListeQuestions, Mode, miseEnPage } from './Questions';

/**
 * Une séance (`app/study/session/[id].tsx`) : un seul écran, trois temps selon l'état (RG-ETU-01) —
 * *Répondre* (`REPONSES_OUVERTES`) avec le compteur « n / 10 répondues · enregistré ✓ » ;
 * *Correction* avec la carte d'échange et « n réponses écrites restantes » ; *Terminée* avec « Ma
 * note ». En-tête : surtitre `code · nom` du module, leçon (Fraunces 26), portion en italique, pastille
 * d'état (`StatusPill` : mousse, terre profonde, encre 3) et nom de l'assemblée. Bandeau hors ligne
 * (terre à 10 %) après un échec d'envoi (D-ETU-11). Panneau du dirigeant (`LeaderPanel`, D-ETU-07) :
 * le lien « Résultats » est masqué en *Correction* (RG-ETU-08 / D-ETU-09, le téléphone peut être entre
 * les mains d'un voisin).
 *
 * Hauteurs explicites (styles de l'app) : `positionsSeance` donne les centres des éléments touchés.
 */

export type Statut = 'REPONSES_OUVERTES' | 'CORRECTION' | 'TERMINEE';

const TON_STATUT: Record<Statut, string> = { REPONSES_OUVERTES: S.moss, CORRECTION: S.earthDeep, TERMINEE: S.ink3 };

/** Hauteur du bandeau hors ligne (deux lignes) et de son écart. */
const H_HORS_LIGNE = 10 + 50;
/** Hauteurs du panneau du dirigeant selon l'état (marge haute de 14 comprise). */
const H_PANNEAU: Record<Statut, number> = { REPONSES_OUVERTES: 14 + 218, CORRECTION: 14 + 159, TERMINEE: 14 + 80 };
/** Bas de la ligne d'état (pastille + assemblée), marge basse comprise. */
const BAS_ENTETE = 227;

export interface OptionsSeance {
  statut: Statut;
  dirigeant?: boolean;
  /** Répondant qui a déjà des réponses (le dirigeant, lui, n'a rien saisi). */
  copie?: Copie;
  /** Bandeau hors ligne : 0 → 1 (il s'ouvre en glissant). */
  horsLigne?: number;
}

/** Positions (points d'écran, défilement nul) : en-tête, panneau, compteur, haut de la liste. */
export const positionsSeance = (questions: readonly Question[], { statut, dirigeant = false, copie = {}, horsLigne = 0 }: OptionsSeance) => {
  const hautPanneau = BAS_ENTETE + horsLigne * H_HORS_LIGNE + 14;
  const apresPanneau = BAS_ENTETE + horsLigne * H_HORS_LIGNE + (dirigeant ? H_PANNEAU[statut] : 0);
  const aDesReponses = Object.keys(copie).length > 0;
  const mode: Mode = statut === 'REPONSES_OUVERTES' ? 'answer' : statut === 'CORRECTION' ? 'review' : 'read';
  // Répondre : compteur (mt 14, 18, mb 10). Correction : carte d'échange (mt 14 + 83) puis
  // « n réponses écrites restantes » (mt 14, 18, mb 10).
  const compteur = apresPanneau + 14 + 9;
  const hautListe =
    statut === 'REPONSES_OUVERTES' ? apresPanneau + 42 : statut === 'CORRECTION' ? apresPanneau + 14 + 83 + 42 : apresPanneau + 16 + 173 + 16;
  return {
    hautPanneau,
    passerCorrection: { x: 195, y: hautPanneau + 128 },
    terminer: { x: 195, y: hautPanneau + 120 },
    resultats: { x: 320, y: hautPanneau + 24 },
    compteur: { x: 110, y: compteur },
    bandeau: { x: 195, y: BAS_ENTETE + 10 + 25 },
    noteFinale: { x: 110, y: apresPanneau + 16 + 1 + 20 + 15 + 6 + 26 },
    hautListe,
    liste: aDesReponses || mode === 'answer' ? miseEnPage(questions, mode, copie) : null,
  };
};

const Pastille: React.FC<{ statut: Statut; halo?: number }> = ({ statut, halo = 0 }) => {
  const { app: APP } = useEtude();
  return (
  <Halo intensite={halo} rayon={99} marge={4} margeY={3} etalement={4}>
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
      {APP.status[statut]}
    </div>
  </Halo>
  );
};

export const EcranSeance: React.FC<
  OptionsSeance & {
    defilement?: number;
    /**
     * Ligne « Leçon 1 · questions 1 à 11 » sous la portion (avenant 05, D-ETU-38), facultative :
     * vidéo « Guide » (26/10). Absente, l'écran est celui de la vidéo « Étude ».
     */
    plage?: string;
    /** Terminée : bloc posé sous « Ma note » (« Cette semaine, chaque membre doit : », avenant 04), facultatif (« Guide »). */
    apresNote?: React.ReactNode;
    /** Répondre : nombre de questions répondues et état de l'enregistrement. */
    repondues?: number;
    enregistrement?: 'idle' | 'saving' | 'saved';
    /** Correction : réponses écrites encore sans avis. */
    ecritesRestantes?: number;
    /** Panneau du dirigeant : répondants, avis restants. */
    repondants?: number;
    avisRestants?: number;
    /** Terminée : note de la copie (null : pas de copie), et son apparition (ressort 0 → 1). */
    note?: number | null;
    apparitionNote?: number;
    curseur?: string | null;
    appuiAvis?: { id: string; avis: Avis; p: number } | null;
    notes?: Partial<Record<string, React.ReactNode>>;
    halos?: Halos & {
      pastille?: number;
      stat?: number;
      compteur?: number;
      bandeau?: number;
      ecrites?: number;
      noteFinale?: number;
      resultats?: number;
    };
  }
> = ({
  statut,
  dirigeant = false,
  copie = {},
  horsLigne = 0,
  defilement = 0,
  plage,
  apresNote,
  repondues = 0,
  enregistrement = 'idle',
  ecritesRestantes = 3,
  repondants = 0,
  avisRestants = 0,
  note = null,
  apparitionNote = 1,
  curseur = null,
  appuiAvis = null,
  notes = {},
  halos = {},
}) => {
  const { app: APP, d } = useEtude();
  const { ASSEMBLEE, QUESTIONS, UNITE, UNITE_LIBELLE } = d;
  const fmtPoints = APP.fmtPoints;
  const A_REPONDRE = aRepondre(QUESTIONS);
  const NOTE_SUR = noteSur(QUESTIONS);
  const aDesReponses = Object.keys(copie).length > 0;
  const lecon = UNITE.lecons[0];
  return (
    <Ecran defilement={defilement}>
      <TeteEtude kicker={UNITE_LIBELLE} titre={APP.lessonTitled(1, lecon.titre ?? '')} taille={26} lignesKicker={2} />
      <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 15, lineHeight: '20px', color: S.ink2, marginTop: 4 }}>{lecon.portion}</div>
      {plage ? <div style={{ fontFamily: P.mono, fontSize: 12, lineHeight: '17px', color: S.moss, letterSpacing: 0.4, marginTop: 6 }}>{plage}</div> : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, marginBottom: 6, height: 20 }}>
        <Pastille statut={statut} halo={halos.pastille} />
        <div style={{ flex: 1, fontSize: 13, color: S.ink3 }}>{ASSEMBLEE}</div>
      </div>

      {horsLigne > 0.001 ? (
        <div style={{ height: H_HORS_LIGNE * horsLigne, overflow: horsLigne < 0.999 ? 'hidden' : 'visible' }}>
          <Halo intensite={halos.bandeau ?? 0} rayon={R.sm}>
            <div
              style={{
                marginTop: 10,
                height: 50,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: R.sm,
                background: 'rgba(201,149,107,0.10)',
                opacity: horsLigne,
              }}
            >
              <IoCloudOfflineOutline size={16} color={S.earthDeep} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 12.5, lineHeight: '17px', color: S.ink2 }}>{APP.session.offlinePending}</div>
            </div>
          </Halo>
        </div>
      ) : null}

      {dirigeant ? <PanneauDirigeant statut={statut} repondants={repondants} avisRestants={avisRestants} halos={halos} /> : null}

      {statut === 'REPONSES_OUVERTES' ? (
        <>
          <div style={{ marginTop: 14, marginBottom: 10, height: 18, display: 'flex' }}>
            <Halo intensite={halos.compteur ?? 0} rayon={8} marge={6} margeY={3} etalement={4}>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: '18px', color: S.moss, whiteSpace: 'nowrap' }}>
                {APP.session.answered(repondues, A_REPONDRE)}
                {enregistrement !== 'idle' ? ` · ${enregistrement === 'saving' ? APP.session.saving : APP.session.saved}` : ''}
              </div>
            </Halo>
          </div>
          <ListeQuestions questions={QUESTIONS} copie={copie} mode="answer" halos={halos} curseur={curseur} />
        </>
      ) : null}

      {statut === 'CORRECTION' ? (
        aDesReponses ? (
          <>
            <Carte variante="tinted" style={{ marginTop: 14, height: 83, boxSizing: 'border-box', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <IoSwapHorizontal size={20} color={S.moss} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13, lineHeight: '19px', color: S.ink2 }}>{APP.session.correctionHint}</div>
            </Carte>
            <div style={{ marginTop: 14, marginBottom: 10, height: 18, display: 'flex' }}>
              <Halo intensite={halos.ecrites ?? 0} rayon={8} marge={6} margeY={3} etalement={4}>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: '18px', color: S.moss, whiteSpace: 'nowrap' }}>
                  {ecritesRestantes > 0 ? APP.session.writtenLeft(ecritesRestantes) : APP.session.writtenDone}
                </div>
              </Halo>
            </div>
            <ListeQuestions questions={QUESTIONS} copie={copie} mode="review" halos={halos} appuiAvis={appuiAvis} notes={notes} />
          </>
        ) : (
          <Carte variante="paper2" style={{ marginTop: 20, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <IoHourglassOutline size={26} color={S.ink3} />
            <div style={{ fontSize: 13.5, lineHeight: '20px', color: S.ink2, textAlign: 'center' }}>{APP.session.noAnswerCorrection}</div>
          </Carte>
        )
      ) : null}

      {statut === 'TERMINEE' ? (
        <>
          <Carte style={{ marginTop: 16, padding: 20, height: 173, boxSizing: 'border-box' }}>
            <Etiquette style={{ color: S.mossSoft, lineHeight: '15px' }}>{APP.session.myScore}</Etiquette>
            {note != null ? (
              <div style={{ marginTop: 6, height: 52, display: 'flex', alignItems: 'center' }}>
                <Halo intensite={halos.noteFinale ?? 0} rayon={12} marge={8} margeY={2} etalement={5}>
                  <div
                    style={{
                      fontFamily: P.serif,
                      fontSize: 44,
                      lineHeight: '52px',
                      color: S.moss,
                      letterSpacing: -0.6,
                      transform: `scale(${apparitionNote})`,
                      transformOrigin: 'left center',
                      opacity: Math.min(1, apparitionNote * 1.5),
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {APP.score(fmtPoints(note), fmtPoints(NOTE_SUR))}
                  </div>
                </Halo>
              </div>
            ) : (
              <div style={{ marginTop: 8, height: 50, fontFamily: P.serif, fontStyle: 'italic', fontSize: 16, lineHeight: '22px', color: S.ink3 }}>
                {APP.session.noCopy}
              </div>
            )}
            <Bouton label={APP.home.myProgress} variante="ghost" hauteur={44} style={{ marginTop: 14, alignSelf: 'flex-start', display: 'inline-flex' }} />
          </Carte>
          {apresNote}
          {aDesReponses ? (
            <div style={{ marginTop: 16 }}>
              <ListeQuestions questions={QUESTIONS} copie={copie} mode="read" />
            </div>
          ) : null}
        </>
      ) : null}
    </Ecran>
  );
};

const PanneauDirigeant: React.FC<{
  statut: Statut;
  repondants: number;
  avisRestants: number;
  halos: { stat?: number; resultats?: number };
}> = ({ statut, repondants, avisRestants, halos }) => {
  const { app: APP } = useEtude();
  const stat = (texte: string) => (
    <div style={{ marginTop: 8, height: 24, display: 'flex' }}>
      <Halo intensite={halos.stat ?? 0} rayon={8} marge={6} margeY={2} etalement={4}>
        <div style={{ fontFamily: P.serif, fontSize: 18, lineHeight: '24px', color: S.ink, whiteSpace: 'nowrap' }}>{texte}</div>
      </Halo>
    </div>
  );
  const lien = (
    <Halo intensite={halos.resultats ?? 0} rayon={8} marge={6} margeY={2} etalement={4}>
      <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: '18px', color: S.moss }}>{APP.leader.results}</div>
    </Halo>
  );
  return (
    <Carte style={{ marginTop: 14, padding: '14px 16px', height: H_PANNEAU[statut] - 14, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 18 }}>
        <Etiquette style={{ color: S.mossSoft }}>{APP.leader.panel}</Etiquette>
        {statut !== 'CORRECTION' ? lien : null}
      </div>
      {statut === 'REPONSES_OUVERTES' ? (
        <>
          {/* RG-ETU-14b : le nombre de répondants est réservé au dirigeant (`copyCount`). */}
          {stat(APP.leader.respondents(repondants))}
          <div style={{ marginTop: 8, height: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
            <IoEyeOutline size={16} color={S.moss} />
            <div style={{ fontSize: 13.5, fontWeight: 600, color: S.moss }}>{APP.leader.showKey}</div>
          </div>
          <Bouton label={APP.leader.toCorrection} hauteur={48} style={{ marginTop: 12 }} />
          <Bouton label={APP.leader.cancel} variante="danger" hauteur={44} style={{ marginTop: 8 }} />
        </>
      ) : null}
      {statut === 'CORRECTION' ? (
        <>
          {stat(avisRestants > 0 ? APP.leader.reviewsLeft(avisRestants) : APP.leader.reviewsDone)}
          <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{APP.leader.respondents(repondants)}</div>
          <Bouton label={APP.leader.finish} hauteur={48} style={{ marginTop: 12 }} />
        </>
      ) : null}
      {statut === 'TERMINEE' ? stat(APP.leader.finished(repondants)) : null}
    </Carte>
  );
};
