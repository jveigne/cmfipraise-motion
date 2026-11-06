import React from 'react';
import {
  IoChevronForward,
  IoChevronUp,
  IoEllipseOutline,
  IoHomeOutline,
  IoPaperPlaneOutline,
  IoRadioButtonOff,
  IoRadioButtonOn,
  IoSchoolOutline,
  IoTimeOutline,
  IoTrendingUpOutline,
} from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Bouton, Carte, Ecran, Etiquette, Halo } from '../../evenements/ui/app';
import { Rangee, TeteEtude } from '../../etude/ecrans/AccueilEtude';
import { ListeQuestions } from '../../etude/ecrans/Questions';
import { aRepondre, Copie } from '../../etude/donnees';
import { useEtude } from '../../etude/langue';
import { useGuide } from '../langue';
import { DATES, NOTES_DIRIGEANT, NUMEROS_LECON, avancementAssemblee } from '../donnees';

/**
 * Écrans de l'étude ajoutés par les avenants 04 et 05 (23/10), que la vidéo « Étude » ne montre pas,
 * redessinés d'après shephr-app/mobile : feuille « À lire avant la leçon » et question de départ
 * (`app/study/index.tsx` › `BriefingSheet`), « S'arrêter après la question » (`session/[id].tsx` ›
 * `StopAfterSheet`), accueil de l'étude avec la suite d'une leçon et le bloc « À rattraper »,
 * séance en rattrapage, progression d'une leçon en cours (« 6 / 9 questions », `progress.tsx`),
 * avancement de l'assemblée au 2 novembre. Mêmes briques et mêmes styles que les écrans d'« Étude ».
 */

/** Libellé d'une leçon (`lessonLabelOf`). */
const useLecon1 = () => {
  const { app, d } = useEtude();
  return app.lessonTitled(1, d.UNITE.lecons[0].titre ?? '');
};

/** Fond assombri d'une modale (`backdrop` : mousse profonde à 70 %) et sa carte. */
const Modale: React.FC<{ hauteur?: number; children: React.ReactNode }> = ({ hauteur, children }) => (
  <div style={{ position: 'absolute', inset: 0, background: 'rgba(22,41,31,0.70)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 20px' }}>
    <div
      style={{
        height: hauteur,
        boxSizing: 'border-box',
        background: S.paper,
        borderRadius: R.lg,
        padding: '22px 20px 18px',
        border: `1px solid ${S.hair}`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: P.sans,
        color: S.ink,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  </div>
);

const TitreModale: React.FC<{ titre: string; indice: string }> = ({ titre, indice }) => (
  <>
    <div style={{ fontFamily: P.serif, fontSize: 22, lineHeight: '28px', letterSpacing: -0.3 }}>{titre}</div>
    <div style={{ marginTop: 4, marginBottom: 14, fontSize: 13, lineHeight: '19px', color: S.ink2 }}>{indice}</div>
  </>
);

/** `StudyNotesText` : titre Fraunces 16, texte brut (retours à la ligne gardés), Inter 14. */
const Notes: React.FC<{ titre: string; texte: string }> = ({ titre, texte }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ fontFamily: P.serif, fontSize: 16, lineHeight: '21px', color: S.ink, letterSpacing: -0.1 }}>{titre}</div>
    <div style={{ fontSize: 14, lineHeight: '21px', color: S.ink2, whiteSpace: 'pre-wrap' }}>{texte}</div>
  </div>
);

/** `StudyMemberActions` : titre, puis une puce mousse par action. */
export const ActionsMembres: React.FC<{ titre: string; actions: readonly string[] }> = ({ titre, actions }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ fontFamily: P.serif, fontSize: 16, lineHeight: '21px', color: S.ink, letterSpacing: -0.1 }}>{titre}</div>
    {actions.map((a) => (
      <div key={a} style={{ display: 'flex', gap: 8 }}>
        <div style={{ fontSize: 14, lineHeight: '21px', color: S.moss }}>•</div>
        <div style={{ flex: 1, fontSize: 14, lineHeight: '21px', color: S.ink2 }}>{a}</div>
      </div>
    ))}
  </div>
);

/** Carte « Cette semaine, chaque membre doit : » sous « Ma note » (`actionsCard`, teintée). */
export const CarteActions: React.FC<{ halo?: number }> = ({ halo = 0 }) => {
  const { app, langue } = useGuide();
  return (
    <div style={{ marginTop: 16 }}>
      <Halo intensite={halo} rayon={R.lg}>
        <Carte variante="tinted" style={{ padding: '14px 16px' }}>
          <ActionsMembres titre={app.memberActionsTitle} actions={NOTES_DIRIGEANT[langue].actions} />
        </Carte>
      </Halo>
    </div>
  );
};

/**
 * Feuille « À lire avant la leçon » (D-ETU-35) avec la question de départ (D-ETU-49) : notes de
 * l'unité (première séance de l'unité), de la leçon, aperçu des actions, puis « Question de
 * départ », la plage annoncée et les numéros de premier niveau. `defilement` : contenu défilé de la
 * zone centrale (points). `depart` : question choisie ; `couvertes` : plages déjà traitées.
 */
export const EcranBriefing: React.FC<{
  depart: string;
  couvertes?: string | null;
  defilement?: number;
  haloPlage?: number;
  haloNotes?: number;
}> = ({ depart, couvertes = null, defilement = 0, haloPlage = 0, haloNotes = 0 }) => {
  const { app, langue } = useGuide();
  const { app: APP } = useEtude();
  const lecon = useLecon1();
  const notes = NOTES_DIRIGEANT[langue];
  const premier = NUMEROS_LECON[0];
  const dernier = NUMEROS_LECON[NUMEROS_LECON.length - 1];
  const plage = depart === premier ? app.wholeLesson : app.range(depart, dernier);
  return (
    <Modale hauteur={844 - 96}>
      <TitreModale titre={app.briefingTitle} indice={lecon} />
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', margin: '0 -8px', padding: '0 8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 6, transform: `translateY(${defilement}px)` }}>
          <Halo intensite={haloNotes} rayon={10} marge={6}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Notes titre={app.unitNotes} texte={notes.unite} />
              <Notes titre={app.lessonNotes} texte={notes.lecon} />
            </div>
          </Halo>
          <ActionsMembres titre={app.memberActionsPreview} actions={notes.actions} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: P.serif, fontSize: 16, lineHeight: '21px', color: S.ink }}>{app.startPick}</div>
            <div style={{ display: 'flex' }}>
              <Halo intensite={haloPlage} rayon={6} marge={6} margeY={3} etalement={3}>
                <div style={{ fontFamily: P.mono, fontSize: 12.5, lineHeight: '17px', color: S.moss, letterSpacing: 0.4 }}>{app.sessionRange(plage)}</div>
              </Halo>
            </div>
            {couvertes ? <div style={{ fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{app.covered(couvertes)}</div> : null}
            <div style={{ fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{depart === premier ? app.startPickFirst : app.startPickNext(depart)}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {NUMEROS_LECON.map((n) => {
                const on = n === depart;
                return (
                  <div
                    key={n}
                    style={{
                      minWidth: 44,
                      boxSizing: 'border-box',
                      padding: '7px 10px',
                      borderRadius: R.sm,
                      border: `1px solid ${on ? S.moss : n === depart ? S.mossSoft : S.hair}`,
                      background: on ? S.moss : S.paper2,
                      textAlign: 'center',
                      fontFamily: P.mono,
                      fontSize: 12.5,
                      lineHeight: '17px',
                      color: on ? S.white : S.ink2,
                    }}
                  >
                    {n}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 12.5, lineHeight: '18px', color: S.ink3 }}>{APP.home.startConfirm(lecon)}</div>
      <Bouton label={APP.home.start} hauteur={48} style={{ marginTop: 14 }} />
      <Bouton label={APP.common.cancel} variante="ghost" hauteur={44} style={{ marginTop: 8 }} />
    </Modale>
  );
};

/** « Passer à la correction » : « S'arrêter après la question : » (D-ETU-40), défaut la dernière. */
export const EcranArret: React.FC<{ choix: string; haloPied?: number }> = ({ choix, haloPied = 0 }) => {
  const { app } = useGuide();
  const { app: APP, d } = useEtude();
  const tete = d.QUESTIONS.filter((q) => !q.parent);
  const dernier = tete[tete.length - 1].numero;
  const coupe = choix !== dernier;
  return (
    <Modale>
      <TitreModale titre={APP.leader.toCorrection} indice={app.stopAfter} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {tete.map((q) => {
          const on = q.numero === choix;
          return (
            <div
              key={q.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: R.sm,
                border: `1px solid ${on ? S.moss : S.hair}`,
                background: on ? S.mossTint : S.paper2,
              }}
            >
              {on ? <IoRadioButtonOn size={18} color={S.moss} /> : <IoRadioButtonOff size={18} color={S.ink3} />}
              <div style={{ fontFamily: P.mono, fontSize: 12.5, color: S.clay, width: 30 }}>{APP.question.number(q.numero)}</div>
              <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: S.ink2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.enonce}</div>
              {q.numero === dernier ? <div style={{ fontSize: 11.5, fontWeight: 600, color: S.moss }}>{app.stopLast}</div> : null}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14 }}>
        <Halo intensite={haloPied} rayon={8} marge={6} margeY={4} etalement={3}>
          <div style={{ fontSize: 12.5, lineHeight: '18px', color: S.ink3 }}>{coupe ? app.stopAfterCut(choix) : APP.leader.toCorrectionConfirm}</div>
        </Halo>
      </div>
      <Bouton label={APP.leader.toCorrection} hauteur={48} style={{ marginTop: 14 }} />
      <Bouton label={APP.common.cancel} variante="ghost" hauteur={44} style={{ marginTop: 8 }} />
    </Modale>
  );
};

/** Ligne d'une leçon dépliée (`lessonRow`). */
const LigneLecon: React.FC<{ icone: React.ReactNode; titre: string; metas: string[]; action: string; halo?: number }> = ({ icone, titre, metas, action, halo = 0 }) => (
  <Halo intensite={halo} rayon={R.sm}>
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: R.sm,
        background: S.paper2,
        border: `1px solid ${S.hair}`,
      }}
    >
      {icone}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, lineHeight: '19px', color: S.ink }}>{titre}</div>
        {metas.map((m) => (
          <div key={m} style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>
            {m}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: S.moss }}>{action}</div>
    </div>
  </Halo>
);

/**
 * Accueil de l'étude du dirigeant, le dimanche 1er novembre : la leçon 1 a été traitée de 1 à 11
 * (ligne « horloge », « Déjà traitées : questions 1 à 11 », « Suite : questions 12 à 31 »,
 * *Continuer*) ; « Séances terminées » montre la séance du 25 octobre et sa plage.
 */
export const EcranAccueilSuite: React.FC<{ haloLecon?: number }> = ({ haloLecon = 0 }) => {
  const { app, langue } = useGuide();
  const { app: APP, d } = useEtude();
  const lecon = useLecon1();
  const plage1 = app.range('1', '11');
  return (
    <Ecran>
      <TeteEtude kicker={APP.kicker} titre={APP.tile.title} />
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Etiquette style={{ color: S.mossSoft, lineHeight: '15px' }}>{d.ASSEMBLEE}</Etiquette>
        <Etiquette style={{ marginTop: 14, lineHeight: '15px' }}>{APP.home.startSession}</Etiquette>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Rangee hauteur={85}>
            <div style={{ width: 38, height: 38, borderRadius: R.sm, background: S.mossTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IoSchoolOutline size={19} color={S.moss} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: P.serif, fontSize: 16, lineHeight: '20px', color: S.ink, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {d.UNITE_LIBELLE}
              </div>
              <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{APP.home.lessonsDone(0, d.UNITE.lecons.length)}</div>
            </div>
            <IoChevronUp size={18} color={S.ink3} />
          </Rangee>
          <div style={{ marginLeft: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 13.5, lineHeight: '18px', color: S.ink2 }}>{d.UNITE.livre}</div>
            <LigneLecon
              icone={<IoTimeOutline size={20} color={S.moss} />}
              titre={lecon}
              metas={[d.UNITE.lecons[0].portion, app.covered(plage1), app.nextRange(app.range('12', '31'))]}
              action={app.continue}
              halo={haloLecon}
            />
            {d.UNITE.lecons.slice(1, 3).map((l) => (
              <LigneLecon key={l.numero} icone={<IoEllipseOutline size={20} color={S.ink3} />} titre={APP.lesson(l.numero)} metas={[l.portion]} action={APP.home.start} />
            ))}
          </div>
        </div>
        <Etiquette style={{ marginTop: 14, lineHeight: '15px' }}>{APP.home.sessions}</Etiquette>
        <Rangee hauteur={65}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: P.serif, fontSize: 16, lineHeight: '20px', color: S.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lecon}</div>
            <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {[d.UNITE.code, plage1, DATES(langue).seance1, app.copies(13)].join(' · ')}
            </div>
          </div>
          <IoChevronForward size={18} color={S.ink3} />
        </Rangee>
      </div>
    </Ecran>
  );
};

/**
 * Accueil de l'étude de Rose (répondante, pas de séance en cours) : « À rattraper » (D-ETU-44,
 * `catchUps` de `/study/me`), la séance du 25 octobre (plage 1 à 11), *Rattraper* ; « Ma progression ».
 */
export const EcranAccueilRose: React.FC<{ halo?: number }> = ({ halo = 0 }) => {
  const { app, langue } = useGuide();
  const { app: APP, d } = useEtude();
  const lecon = useLecon1();
  return (
    <Ecran>
      <TeteEtude kicker={APP.kicker} titre={APP.tile.title} />
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Etiquette style={{ marginTop: 14, lineHeight: '15px' }}>{app.catchUpTitle}</Etiquette>
        <div style={{ fontSize: 13, lineHeight: '18px', color: S.ink3 }}>{app.catchUpHint}</div>
        <Halo intensite={halo} rayon={R.md}>
          <Rangee hauteur={82}>
            <div style={{ width: 38, height: 38, borderRadius: R.sm, background: S.mossTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IoHomeOutline size={19} color={S.moss} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: P.serif, fontSize: 16, lineHeight: '20px', color: S.ink }}>{lecon}</div>
              <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {[d.UNITE.code, app.range('1', '11'), DATES(langue).seance1].join(' · ')}
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: S.moss }}>{app.catchUpAction}</div>
          </Rangee>
        </Halo>
      </div>
      <Bouton label={APP.home.myProgress} variante="ghost" hauteur={48} style={{ marginTop: 20 }} icone={<IoTrendingUpOutline size={18} color={S.moss} />} />
    </Ecran>
  );
};

/**
 * Séance en rattrapage (D-ETU-44) : séance `TERMINEE`, plage 1 à 11 ; carte « Rattrapage : … »,
 * compteur, questions en saisie (aucune réponse du manuel), « Envoyer ma copie ».
 */
export const EcranRattrapage: React.FC<{ copie: Copie; defilement?: number; haloEnvoi?: number; haloAvis?: number }> = ({
  copie,
  defilement = 0,
  haloEnvoi = 0,
  haloAvis = 0,
}) => {
  const { app } = useGuide();
  const { app: APP, d } = useEtude();
  const lecon = useLecon1();
  const repondues = Object.keys(copie).length;
  return (
    <Ecran defilement={defilement}>
      <TeteEtude kicker={d.UNITE_LIBELLE} titre={lecon} taille={26} lignesKicker={2} />
      <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 15, lineHeight: '20px', color: S.ink2, marginTop: 4 }}>{d.UNITE.lecons[0].portion}</div>
      <div style={{ fontFamily: P.mono, fontSize: 12, lineHeight: '17px', color: S.moss, letterSpacing: 0.4, marginTop: 6 }}>
        {[APP.lesson(1), app.range('1', '11')].join(' · ')}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, marginBottom: 6, height: 20 }}>
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
            border: `1px solid ${S.ink3}`,
            color: S.ink3,
          }}
        >
          {APP.status.TERMINEE}
        </div>
        <div style={{ flex: 1, fontSize: 13, color: S.ink3 }}>{d.ASSEMBLEE}</div>
      </div>
      <Halo intensite={haloAvis} rayon={R.lg}>
        <Carte variante="tinted" style={{ marginTop: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <IoHomeOutline size={20} color={S.moss} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: 13, lineHeight: '19px', color: S.ink2 }}>{app.catchUpSessionHint}</div>
        </Carte>
      </Halo>
      <div style={{ marginTop: 14, marginBottom: 10, fontSize: 13, fontWeight: 600, lineHeight: '18px', color: S.moss }}>
        {APP.session.answered(repondues, aRepondre(d.QUESTIONS))}
      </div>
      <ListeQuestions questions={d.QUESTIONS} copie={copie} mode="answer" />
      <div style={{ marginTop: 18 }}>
        <Halo intensite={haloEnvoi} rayon={18}>
          <Bouton label={app.catchUpSubmit} hauteur={50} icone={<IoPaperPlaneOutline size={18} color={S.white} />} />
        </Halo>
      </div>
    </Ecran>
  );
};

const Barre: React.FC<{ pct: number }> = ({ pct }) => (
  <div style={{ height: 6, borderRadius: 3, background: S.mossTint2, overflow: 'hidden' }}>
    <div style={{ height: 6, width: `${pct}%`, borderRadius: 3, background: S.moss }} />
  </div>
);

/**
 * « Ma progression » de Marie le 25 octobre au soir : aucune leçon faite (0 / 5), la leçon 1 en
 * cours — « 6 / 9 questions » et sa note en cours « 8,5 / 13 » (D-ETU-42/43, `coveredQuestions`,
 * `bestScore` sur le `maxScore` de la leçon).
 */
export const EcranProgressionPartielle: React.FC<{ halo?: number }> = ({ halo = 0 }) => {
  const { app } = useGuide();
  const { app: APP, d } = useEtude();
  const fmt = APP.fmtPoints;
  return (
    <Ecran>
      <TeteEtude kicker={APP.tile.title} titre={APP.progress.mineTitle} />
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Carte style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: P.serif, fontSize: 18, lineHeight: '23px', color: S.ink, letterSpacing: -0.2, height: 46 }}>{d.UNITE_LIBELLE}</div>
          <div style={{ fontSize: 13, fontWeight: 600, lineHeight: '18px', color: S.moss }}>{APP.home.lessonsDone(0, d.UNITE.lecons.length)}</div>
          <Barre pct={0} />
        </Carte>
        {d.UNITE.lecons.map((l) => {
          const enCours = l.numero === 1;
          const ligne = (
            <Rangee hauteur={64} style={{ gap: 10 }}>
              <IoEllipseOutline size={20} color={S.ink3} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, lineHeight: '19px', color: S.ink }}>{l.titre ? APP.lessonTitled(l.numero, l.titre) : APP.lesson(l.numero)}</div>
                <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: enCours ? S.ink2 : S.ink3, fontWeight: enCours ? 600 : 400 }}>
                  {enCours ? app.questionsCovered(6, NUMEROS_LECON.length) : APP.progress.notDone}
                </div>
              </div>
              {enCours ? <div style={{ fontFamily: P.mono, fontSize: 13.5, color: S.moss }}>{APP.score(fmt(8.5), fmt(13))}</div> : null}
              {enCours ? <IoChevronForward size={18} color={S.ink3} /> : null}
            </Rangee>
          );
          return enCours ? (
            <Halo key={l.numero} intensite={halo} rayon={R.md}>
              {ligne}
            </Halo>
          ) : (
            <div key={l.numero}>{ligne}</div>
          );
        })}
      </div>
    </Ecran>
  );
};

/** Avancement de l'assemblée au 2 novembre (`UnitView`) : 1 / 5 leçons, dernière séance, membres. */
export const EcranAvancementGuide: React.FC<{ defilement?: number; haloCarte?: number; haloMembres?: number }> = ({ defilement = 0, haloCarte = 0, haloMembres = 0 }) => {
  const { langue } = useGuide();
  const { app: APP, d } = useEtude();
  const fmt = APP.fmtPoints;
  const membres = avancementAssemblee(langue);
  return (
    <Ecran defilement={defilement}>
      <TeteEtude kicker={APP.progress.unitTitle} titre={d.ASSEMBLEE} />
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Halo intensite={haloCarte} rayon={R.lg}>
          <Carte style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: P.serif, fontSize: 18, lineHeight: '23px', color: S.ink, letterSpacing: -0.2, height: 46 }}>{d.UNITE_LIBELLE}</div>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: '18px', color: S.moss }}>{APP.home.lessonsDone(1, d.UNITE.lecons.length)}</div>
            <Barre pct={20} />
            <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{APP.progress.lastSession(DATES(langue).seance2)}</div>
          </Carte>
        </Halo>
        <Etiquette style={{ marginTop: 8, lineHeight: '15px' }}>{APP.progress.members}</Etiquette>
        <Halo intensite={haloMembres} rayon={R.md} marge={6}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {membres.map((m) => (
              <Rangee key={m.nom} hauteur={65} style={{ gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: P.serif, fontSize: 16, lineHeight: '20px', color: S.ink }}>{m.nom}</div>
                  <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{APP.home.lessonsDone(m.faites, d.UNITE.lecons.length)}</div>
                </div>
                <div style={{ fontFamily: P.mono, fontSize: 13.5, color: S.moss }}>{m.faites > 0 && m.note != null ? APP.score(fmt(m.note), fmt(m.sur)) : '–'}</div>
                <IoChevronForward size={18} color={S.ink3} />
              </Rangee>
            ))}
          </div>
        </Halo>
      </div>
    </Ecran>
  );
};
