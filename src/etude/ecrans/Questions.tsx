import React from 'react';
import {
  IoCheckbox,
  IoCheckmarkCircle,
  IoEllipseOutline,
  IoRadioButtonOff,
  IoRadioButtonOn,
  IoSquareOutline,
} from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Halo } from '../../evenements/ui/app';
import { useEtude } from '../langue';
import type { AppEtude } from '../textes';
import type { Avis, Copie, Question, Reponse } from '../donnees';

export type { Avis };

/**
 * `components/StudyQuestionList.tsx` redessiné (plan 21/10 § 6.3) : les questions d'une leçon sous
 * les formes que montre la vidéo —
 * - `answer` (*Répondre*) : saisie selon le type (contrat § 2.3), sous-questions en retrait sous
 *   leur parent (filet `mossTint2`, RG-ETU-20), consigne en Fraunces italique (RG-ETU-09) ;
 * - `review` (*Correction*) : fermées affichées corrigées (choix « faux » / « bonne réponse », seuls
 *   restent les choix cochés ou attendus), écrites avec « Réponse donnée », « Réponse du manuel »
 *   et *Juste* / *À préciser* / *À revoir* (RG-ETU-07) ; `PERSONNELLE` masquée (RG-ETU-08) ;
 * - `read` (copie corrigée, séance terminée) : comme `review`, l'avis écrit au lieu des boutons.
 *
 * Toutes les hauteurs sont posées explicitement (mêmes valeurs que les styles de l'app) : la
 * fonction `miseEnPage` en déduit la position de chaque carte et de ses éléments, qui sert aux
 * appuis du doigt et aux défilements des plans. Les nombres de lignes viennent de `donnees.ts`.
 */

export type Mode = 'answer' | 'review' | 'read';

/** Repère de l'écran (points) : marges de `ScreenShell`, cartes et sous-questions. */
const MARGE = 20;
const LARGEUR = 350;
const RETRAIT = 18;
const PAD = { v: 12, h: 14 };
const ECART = 8;
const ECART_LISTE = 10;

const H = {
  tete: 16,
  ligneEnonce: 21,
  bible: 18,
  champ: 84,
  choix: (l: number) => 22 + Math.max(20, 19 * l),
  ecartChoix: 6,
  boite: (l: number) => 40 + 20 * l,
  avis: 43,
  masque: 20,
  fait: 20,
} as const;

const estTextuelle = (q: Question) => q.type === 'OUVERTE' || (q.type === 'PERSONNELLE' && q.format !== 'YES_NO');
const estNotee = (q: Question) => q.type !== 'EXERCICE' && q.type !== 'CONSIGNE';

/** « Répondue » au sens du contrat § 2.3 (`isStudyAnswered`). */
export const estRepondue = (q: Question, r: Reponse | undefined) => {
  if (!r || q.type === 'CONSIGNE') return false;
  if (q.type === 'EXERCICE') return !!r.fait;
  if (estTextuelle(q)) return !!r.texte?.trim();
  return !!r.options && r.options.length > 0;
};

/**
 * Choix proposés : Vrai / Faux, Oui / Non, ou « a. … » du manuel (`choicesOf`). Sans `valeurs`
 * (mise en page seule), les libellés Vrai / Faux / Oui / Non restent leurs clés.
 */
const choixDe = (q: Question, valeurs?: AppEtude['values']): { cle: string; libelle: string; l: number; lNote: number }[] => {
  const v = (k: 'VRAI' | 'FAUX' | 'OUI' | 'NON') => (valeurs ? valeurs[k] : k);
  if (q.type === 'VRAI_FAUX') return (['VRAI', 'FAUX'] as const).map((k) => ({ cle: k, libelle: v(k), l: 1, lNote: 1 }));
  if (q.type === 'OUI_NON' || (q.type === 'PERSONNELLE' && q.format === 'YES_NO'))
    return (['OUI', 'NON'] as const).map((k) => ({ cle: k, libelle: v(k), l: 1, lNote: 1 }));
  return (q.options ?? []).map((o) => ({ cle: o.cle, libelle: `${o.cle}. ${o.libelle}`, l: o.l ?? 1, lNote: o.lNote ?? o.l ?? 1 }));
};

/** Choix montrés une fois corrigés (`CorrectedAnswer`) : cochés ou attendus ; `note` : « faux » ou « bonne réponse ». */
const choixCorriges = (q: Question, r: Reponse | undefined, valeurs?: AppEtude['values']) => {
  const coches = r?.options ?? [];
  return choixDe(q, valeurs)
    .map((c) => {
      const coche = coches.includes(c.cle);
      const juste = q.cle ? q.cle.includes(c.cle) : null;
      const note: 'wrong' | 'expected' | null = juste == null ? null : coche && !juste ? 'wrong' : !coche && juste ? 'expected' : null;
      const ton = juste == null ? undefined : coche ? (juste ? S.moss : S.clay) : juste ? S.moss : undefined;
      return { ...c, coche, juste, note, ton };
    })
    .filter((c) => c.coche || c.juste);
};

/** Éléments d'une carte dont les plans ont besoin (centre, en points, repère de la liste). */
export interface Bloc {
  q: Question;
  y: number;
  h: number;
  /** Centres verticaux : `champ`, `numero`, `choix:<clé>`, `avis`, `donnee`, `manuel`, `masque`, `note`. */
  el: Record<string, number>;
  /** Abscisses (points d'écran) : `centre`, `avis:<AVIS>`. */
  x: Record<string, number>;
}

const AVIS: Avis[] = ['JUSTE', 'A_PRECISER', 'A_REVOIR'];
const TON_AVIS: Record<Avis, string> = { JUSTE: S.moss, A_PRECISER: S.earthDeep, A_REVOIR: S.clay };

/** Hauteurs des enfants d'une carte, dans l'ordre (gap 8 entre eux) ; clé d'élément facultative. */
const enfants = (q: Question, mode: Mode, r: Reponse | undefined, masquer: boolean): [number, string | null][] => {
  if (q.type === 'CONSIGNE') return [];
  if (masquer && q.type === 'PERSONNELLE' && mode !== 'answer') return [[H.tete, 'numero'], [H.masque, 'masque']];
  const liste: [number, string | null][] = [[H.tete, 'numero'], [H.ligneEnonce * q.l, null]];
  if (q.bible) liste.push([H.bible, null]);
  const repondue = estRepondue(q, r);
  if (mode === 'answer') {
    if (q.type === 'EXERCICE') liste.push([H.choix(1), 'choix:fait']);
    else if (estTextuelle(q)) liste.push([H.champ, 'champ']);
    else choixDe(q).forEach((c, i) => liste.push([H.choix(c.l) + (i > 0 ? H.ecartChoix - ECART : 0), `choix:${c.cle}`]));
  } else {
    if (q.type === 'EXERCICE') liste.push([H.fait, null]);
    else if (estTextuelle(q)) {
      liste.push(repondue ? [H.boite(1), 'donnee'] : [H.fait, null]);
      if (q.manuel) liste.push([H.boite(q.lManuel ?? 1), 'manuel']);
      if (q.type === 'OUVERTE' && repondue) liste.push(mode === 'review' ? [H.avis, 'avis'] : [H.fait, 'avis']);
    } else choixCorriges(q, r).forEach((c, i) => liste.push([H.choix(c.note ? c.lNote : c.l) + (i > 0 ? H.ecartChoix - ECART : 0), `choix:${c.cle}`]));
  }
  return liste;
};

const hauteurConsigne = (q: Question) => 6 + H.tete + 4 + H.ligneEnonce * q.l + (q.bible ? 4 + H.bible : 0);

/**
 * Position de chaque carte (repère de la liste : 0 = haut de la première carte) et de ses éléments.
 * `masquer` : `maskPersonal` (correction).
 */
export const miseEnPage = (questions: readonly Question[], mode: Mode, copie: Copie, masquer = mode === 'review') => {
  let y = 0;
  const blocs: Record<string, Bloc> = {};
  for (const q of questions) {
    const sous = !!q.parent;
    const gauche = MARGE + (sous ? RETRAIT + 3 : 1) + PAD.h;
    const largeur = LARGEUR - (sous ? RETRAIT + 3 + 1 : 2) - 2 * PAD.h;
    const el: Record<string, number> = {};
    const x: Record<string, number> = { centre: gauche + largeur / 2 };
    let h: number;
    if (q.type === 'CONSIGNE') h = hauteurConsigne(q);
    else {
      const liste = enfants(q, mode, copie[q.id], masquer);
      let yy = 1 + PAD.v;
      liste.forEach(([hh, cle], i) => {
        if (i > 0) yy += ECART;
        // Les choix sont séparés de 6 (et non 8) : l'écart est déjà compté dans leur hauteur.
        const decal = cle?.startsWith('choix:') && i > 0 && liste[i - 1][1]?.startsWith('choix:') ? H.ecartChoix - ECART : 0;
        if (cle) el[cle] = y + yy + (hh - decal) / 2 + decal;
        yy += hh;
      });
      h = yy + PAD.v + 1;
      const w = (largeur - 16) / 3;
      AVIS.forEach((a, i) => (x[`avis:${a}`] = gauche + w / 2 + i * (w + 8)));
    }
    blocs[q.id] = { q, y, h, el, x };
    y += h + ECART_LISTE;
  }
  return { blocs, hauteur: y - ECART_LISTE };
};

// ---------------------------------------------------------------------------------------------

export type Halos = Partial<Record<string, number>>;

export const ListeQuestions: React.FC<{
  questions: readonly Question[];
  copie: Copie;
  mode: Mode;
  masquer?: boolean;
  /** Surbrillances (annotation vidéo), clé `<id>:<élément>` — `numero`, `champ`, `tag`, `note`, `donnee`, `manuel`, `masque`, `faux`, `attendu`. */
  halos?: Halos;
  /** Curseur de saisie dans le champ de la question `id`. */
  curseur?: string | null;
  /** Avis en train d'être posé (bouton qui se remplit) : `p` de 0 à 1. */
  appuiAvis?: { id: string; avis: Avis; p: number } | null;
  /** Note d'une question qui bascule (annotation : dans l'app, elle s'affiche à jour). */
  notes?: Partial<Record<string, React.ReactNode>>;
}> = ({ questions, copie, mode, masquer = mode === 'review', halos = {}, curseur = null, appuiAvis = null, notes = {} }) => {
  const { blocs } = miseEnPage(questions, mode, copie, masquer);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: ECART_LISTE }}>
      {questions.map((q) => (
        <BlocQuestion
          key={q.id}
          q={q}
          r={copie[q.id]}
          h={blocs[q.id].h}
          mode={mode}
          masquer={masquer}
          halo={(k) => halos[`${q.id}:${k}`] ?? 0}
          curseur={curseur === q.id}
          appuiAvis={appuiAvis && appuiAvis.id === q.id ? appuiAvis : null}
          note={notes[q.id]}
        />
      ))}
    </div>
  );
};

const Numero: React.FC<{ q: Question }> = ({ q }) => {
  const { app: APP } = useEtude();
  return <span style={{ fontFamily: P.mono, fontSize: 12, color: S.clay, letterSpacing: 0.6, lineHeight: '16px' }}>{APP.question.number(q.numero)}</span>;
};

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      fontFamily: P.mono,
      fontSize: 9.5,
      color: S.ink3,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      padding: '2px 6px',
      borderRadius: 99,
      background: S.mossTint,
      lineHeight: '12px',
    }}
  >
    {children}
  </span>
);

const BlocQuestion: React.FC<{
  q: Question;
  r: Reponse | undefined;
  h: number;
  mode: Mode;
  masquer: boolean;
  halo: (k: string) => number;
  curseur: boolean;
  appuiAvis: { avis: Avis; p: number } | null;
  note?: React.ReactNode;
}> = ({ q, r, h, mode, masquer, halo, curseur, appuiAvis, note }) => {
  const { app: APP } = useEtude();
  const fmtPoints = APP.fmtPoints;
  const sous = !!q.parent;
  const repondue = estRepondue(q, r);

  if (q.type === 'CONSIGNE') {
    return (
      <div style={{ height: h, boxSizing: 'border-box', padding: '6px 4px 0', display: 'flex', flexDirection: 'column', gap: 4, marginLeft: sous ? RETRAIT : 0 }}>
        <div style={{ height: H.tete }}>
          <Numero q={q} />
        </div>
        <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 15, lineHeight: '21px', color: S.ink2 }}>{q.enonce}</div>
        {q.bible ? <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 13, lineHeight: '18px', color: S.ink3 }}>{q.bible}</div> : null}
      </div>
    );
  }

  const carte: React.CSSProperties = {
    height: h,
    boxSizing: 'border-box',
    padding: `${PAD.v}px ${PAD.h}px`,
    borderRadius: R.md,
    background: S.paper,
    border: `1px solid ${S.hair}`,
    borderLeft: sous ? `3px solid ${S.mossTint2}` : `1px solid ${S.hair}`,
    marginLeft: sous ? RETRAIT : 0,
    display: 'flex',
    flexDirection: 'column',
    gap: ECART,
    overflow: 'hidden',
  };

  // RG-ETU-08 : jamais affichée pendant l'échange des téléphones.
  if (masquer && q.type === 'PERSONNELLE' && mode !== 'answer') {
    return (
      <div style={carte}>
        <div style={{ height: H.tete, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Numero q={q} />
          {repondue ? <IoCheckmarkCircle size={16} color={S.moss} /> : <IoEllipseOutline size={16} color={S.ink3} />}
        </div>
        <Halo intensite={halo('masque')} rayon={8} marge={6} margeY={3} etalement={3}>
          <div style={{ fontFamily: P.sans, fontSize: 14, lineHeight: '20px', color: S.ink2 }}>{APP.question.personalAnswered}</div>
        </Halo>
      </div>
    );
  }

  const corrigee = mode !== 'answer';
  const enAttente = q.type === 'OUVERTE' && repondue && !r?.avis && r?.points == null;
  const avisPose = appuiAvis && appuiAvis.p >= 0.5 ? appuiAvis.avis : r?.avis;

  return (
    <div style={carte}>
      <div style={{ height: H.tete, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Halo intensite={halo('numero')} rayon={6} marge={5} margeY={2} etalement={3}>
          <Numero q={q} />
        </Halo>
        {q.type === 'PERSONNELLE' ? (
          <Halo intensite={halo('tag')} rayon={10} marge={3} margeY={2} etalement={3}>
            <Tag>{APP.types.PERSONNELLE}</Tag>
          </Halo>
        ) : null}
        {q.type === 'EXERCICE' ? <Tag>{APP.types.EXERCICE}</Tag> : null}
        <div style={{ flex: 1 }} />
        {estNotee(q) && !corrigee ? (
          <span style={{ fontFamily: P.sans, fontSize: 12, color: S.ink3, lineHeight: '16px' }}>{APP.points(q.points)}</span>
        ) : null}
        {estNotee(q) && corrigee ? (
          <Halo intensite={halo('note')} rayon={6} marge={5} margeY={2} etalement={3}>
            <span style={{ fontFamily: P.mono, fontSize: 12.5, color: enAttente && !note ? S.earthDeep : S.moss, lineHeight: '16px' }}>
              {note ?? APP.score(fmtPoints(r?.points ?? (enAttente ? null : 0)), fmtPoints(q.points))}
            </span>
          </Halo>
        ) : null}
      </div>
      <div style={{ fontFamily: P.sans, fontSize: 15, lineHeight: '21px', color: S.ink, height: H.ligneEnonce * q.l }}>{q.enonce}</div>
      {q.bible ? <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 13, lineHeight: '18px', color: S.ink3 }}>{q.bible}</div> : null}

      {mode === 'answer' ? (
        <Saisie q={q} r={r} curseur={curseur} halo={halo('champ')} />
      ) : (
        <Corrigee q={q} r={r} repondue={repondue} halo={halo} />
      )}

      {corrigee && estTextuelle(q) && q.manuel ? (
        <Halo intensite={halo('manuel')} rayon={R.sm} marge={4} etalement={4}>
          <Boite libelle={APP.question.manual} texte={q.manuel} manuel l={q.lManuel ?? 1} />
        </Halo>
      ) : null}

      {mode === 'review' && q.type === 'OUVERTE' && repondue ? (
        <div style={{ display: 'flex', gap: 8, marginTop: 2, height: H.avis - 2 }}>
          {AVIS.map((a) => {
            const choisi = avisPose === a;
            const ton = TON_AVIS[a];
            const presse = appuiAvis && appuiAvis.avis === a ? Math.sin(Math.min(1, appuiAvis.p) * Math.PI) * 0.04 : 0;
            return (
              <div
                key={a}
                style={{
                  flex: 1,
                  boxSizing: 'border-box',
                  borderRadius: R.sm,
                  border: `1.5px solid ${ton}`,
                  background: choisi ? ton : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: P.sans,
                  fontSize: 13.5,
                  fontWeight: 600,
                  lineHeight: '18px',
                  color: choisi ? S.white : ton,
                  transform: `scale(${1 - presse})`,
                }}
              >
                {APP.verdict[a]}
              </div>
            );
          })}
        </div>
      ) : null}
      {mode === 'read' && q.type === 'OUVERTE' && repondue && r?.avis ? (
        <div style={{ fontFamily: P.sans, fontSize: 13, fontWeight: 600, lineHeight: '20px', color: TON_AVIS[r.avis] }}>{APP.verdict[r.avis]}</div>
      ) : null}
    </div>
  );
};

/** `Field` multiligne de la saisie (papier 2, rayon 14, Inter 15, hauteur 84). */
const Champ: React.FC<{ valeur?: string; curseur?: boolean }> = ({ valeur, curseur }) => {
  const { app: APP } = useEtude();
  return (
  <div
    style={{
      height: H.champ,
      boxSizing: 'border-box',
      background: S.paper2,
      border: `1px solid ${S.hair}`,
      borderRadius: 14,
      padding: '14px 16px',
      fontFamily: P.sans,
      fontSize: 15,
      lineHeight: '20px',
      color: valeur ? S.ink : S.ink3,
      overflow: 'hidden',
    }}
  >
    {valeur || (curseur ? '' : APP.question.placeholder)}
    {curseur ? <span style={{ display: 'inline-block', width: 2, height: 18, marginLeft: 1, background: S.moss, verticalAlign: -3 }} /> : null}
  </div>
  );
};

/** `ChoiceRow` : radio ou case, libellé, note (« faux », « bonne réponse »). */
const Choix: React.FC<{ libelle: string; coche: boolean; multi: boolean; ton?: string; note?: string | null; l: number; halo?: number }> = ({
  libelle,
  coche,
  multi,
  ton,
  note,
  l,
  halo = 0,
}) => {
  const couleur = ton ?? (coche ? S.moss : S.ink3);
  const Icone = multi ? (coche ? IoCheckbox : IoSquareOutline) : coche ? IoRadioButtonOn : IoRadioButtonOff;
  return (
    <div
      style={{
        height: H.choix(l),
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: R.sm,
        border: `1px solid ${coche ? couleur : S.hair}`,
        background: coche ? S.mossTint : S.paper2,
      }}
    >
      <Icone size={20} color={couleur} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontFamily: P.sans, fontSize: 14, lineHeight: '19px', color: S.ink }}>{libelle}</div>
      {note ? (
        <Halo intensite={halo} rayon={6} marge={5} margeY={3} etalement={3}>
          <span style={{ fontFamily: P.sans, fontSize: 11.5, fontWeight: 600, color: couleur, whiteSpace: 'nowrap' }}>{note}</span>
        </Halo>
      ) : null}
    </div>
  );
};

const Saisie: React.FC<{ q: Question; r: Reponse | undefined; curseur: boolean; halo: number }> = ({ q, r, curseur, halo }) => {
  const { app: APP } = useEtude();
  if (q.type === 'EXERCICE') return <Choix libelle={APP.question.exerciseDone} coche={!!r?.fait} multi l={1} />;
  if (estTextuelle(q))
    return (
      <Halo intensite={halo} rayon={14} marge={4} etalement={4}>
        <Champ valeur={r?.texte} curseur={curseur} />
      </Halo>
    );
  const coches = r?.options ?? [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: H.ecartChoix }}>
      {choixDe(q, APP.values).map((c) => (
        <Choix key={c.cle} libelle={c.libelle} coche={coches.includes(c.cle)} multi={q.type === 'CHOIX_MULTIPLE'} l={c.l} />
      ))}
    </div>
  );
};

const Corrigee: React.FC<{ q: Question; r: Reponse | undefined; repondue: boolean; halo: (k: string) => number }> = ({ q, r, repondue, halo }) => {
  const { app: APP } = useEtude();
  if (q.type === 'EXERCICE')
    return <div style={{ fontFamily: P.sans, fontSize: 14, lineHeight: '20px', color: S.ink2 }}>{r?.fait ? APP.question.exerciseDoneMark : ''}</div>;
  if (estTextuelle(q))
    return repondue ? (
      <Halo intensite={halo('donnee')} rayon={R.sm} marge={4} etalement={4}>
        <Boite libelle={APP.question.given} texte={r?.texte ?? ''} l={1} />
      </Halo>
    ) : (
      <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 14, lineHeight: '20px', color: S.ink3 }}>{APP.question.noAnswer}</div>
    );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: H.ecartChoix }}>
      {choixCorriges(q, r, APP.values).map((c) => (
        <Choix
          key={c.cle}
          libelle={c.libelle}
          coche={c.coche}
          multi={q.type === 'CHOIX_MULTIPLE'}
          ton={c.ton}
          note={c.note ? APP.question[c.note] : null}
          l={c.note ? c.lNote : c.l}
          halo={c.note === 'wrong' ? halo('faux') : halo('attendu')}
        />
      ))}
    </div>
  );
};

/** Encadré « Réponse donnée » / « Réponse du manuel » (`answerBox`, `manualBox`). */
const Boite: React.FC<{ libelle: string; texte: string; manuel?: boolean; l: number }> = ({ libelle, texte, manuel, l }) => (
  <div
    style={{
      height: H.boite(l),
      boxSizing: 'border-box',
      padding: '10px 12px',
      borderRadius: R.sm,
      background: manuel ? S.mossTint : S.paper2,
      border: `1px solid ${manuel ? S.mossTint2 : S.hair}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}
  >
    <div style={{ fontFamily: P.sans, fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', lineHeight: '14px', color: manuel ? S.moss : S.ink3 }}>
      {libelle}
    </div>
    <div style={{ fontFamily: P.sans, fontSize: 14.5, lineHeight: '20px', color: S.ink }}>{texte}</div>
  </div>
);
