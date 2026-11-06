import React from 'react';
import {
  IoArrowBack,
  IoArrowForwardCircleOutline,
  IoArrowUp,
  IoBookOutline,
  IoChevronBack,
  IoChevronDown,
  IoChevronForward,
  IoDocumentTextOutline,
  IoHomeOutline,
  IoPeopleCircleOutline,
  IoSchoolOutline,
} from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Carte, Ecran, Halo } from '../../evenements/ui/app';
import { Chargement } from '../../journal/ui/elements';
import { APP } from '../textes';
import { ASSEMBLEES, CleAssemblee, ETUDE, ORDRE, PERSONNES, VIE } from '../donnees';

/**
 * Hiérarchie de Daniel Mercier (`app/hierarchie.tsx`) avec l'offre Caleb ouverte : en-tête, « Vous
 * rendez compte à », « Mon superviseur », bloc « Vie d'assemblée » (`AssemblyStatsBlock` de
 * components/AssemblyHierarchyStats.tsx), bloc « Le Message de Bertoua » (`StudyHierarchyStatsBlock`
 * de components/StudyHierarchyStats.tsx), segments Dirigeants | Assemblées, puis l'arbre
 * (`LeaderNodeRow` / `UnitRow`, résumé `LeaderAssemblySummary` et ligne `UnitAssemblyLine`).
 *
 * Un seul long écran : chaque plan y défile jusqu'à la partie qu'il montre. Toutes les hauteurs sont
 * posées explicitement (mêmes tailles en points que l'app) : les positions d'appui et de caméra
 * exportées (`Y_HIER`, `rangeeArbre`) en dépendent.
 */

const HAUT = 59 + 4;
const LARGEUR = 350;

// ---------------------------------------------------------------------------------------------
// Géométrie (points d'écran, défilement nul)

const H_VIE = 384;
const H_ETUDE = 831;
const H_LIGNE_ETUDE = 109;

const Y_TETE = HAUT;
const Y_RAPPORT = Y_TETE + 74 + 12;
const Y_SUPERVISEUR = Y_RAPPORT + 38 + 14;
const Y_VIE = Y_SUPERVISEUR + 66 + 14;
const Y_ETUDE = Y_VIE + H_VIE + 14;
const Y_SEGMENTS = Y_ETUDE + H_ETUDE + 14;
const Y_ARBRE = Y_SEGMENTS + 36 + 14;

/** Rangées de l'arbre, dans l'ordre d'affichage : dirigeant (carte) ou assemblée (ligne). */
type Rangee =
  | { type: 'dirigeant'; cle: keyof typeof PERSONNES; profondeur: number; ouvert: boolean; resume: { assemblees: number; alertes: number } }
  | { type: 'assemblee'; cle: CleAssemblee; profondeur: number };

const RANGEES: Rangee[] = [
  { type: 'dirigeant', cle: 'daniel', profondeur: 0, ouvert: true, resume: { assemblees: 5, alertes: 1 } },
  { type: 'dirigeant', cle: 'sophie', profondeur: 1, ouvert: true, resume: { assemblees: 1, alertes: 0 } },
  { type: 'assemblee', cle: 'est', profondeur: 2 },
  { type: 'dirigeant', cle: 'thomas', profondeur: 1, ouvert: true, resume: { assemblees: 1, alertes: 0 } },
  { type: 'assemblee', cle: 'nord', profondeur: 2 },
  { type: 'dirigeant', cle: 'samuel', profondeur: 1, ouvert: true, resume: { assemblees: 1, alertes: 0 } },
  { type: 'assemblee', cle: 'ouest', profondeur: 2 },
  { type: 'dirigeant', cle: 'marc', profondeur: 1, ouvert: true, resume: { assemblees: 2, alertes: 1 } },
  { type: 'assemblee', cle: 'sud', profondeur: 2 },
  // Nadège est à la profondeur 2 : fermée au chargement (`useState(depth < 2)`), Daniel l'ouvre (P4).
  { type: 'dirigeant', cle: 'nadege', profondeur: 2, ouvert: false, resume: { assemblees: 1, alertes: 0 } },
  { type: 'assemblee', cle: 'evry', profondeur: 3 },
];

const H_DIRIGEANT = 88;
/** Une assemblée : nom, membres, puis la ligne Vie d'assemblée sur deux lignes (`numberOfLines={2}`). */
const H_ASSEMBLEE = 90;
const hauteurRangee = (r: Rangee) => (r.type === 'dirigeant' ? H_DIRIGEANT : H_ASSEMBLEE);

/** Haut de chaque rangée (la dernière, Évry Centre, n'existe qu'une fois Nadège ouverte). */
const HAUTS = RANGEES.reduce<number[]>((acc, r, i) => [...acc, i === 0 ? Y_ARBRE : acc[i - 1] + hauteurRangee(RANGEES[i - 1]) + 8], []);

/** Centre d'une rangée de l'arbre (points, défilement nul) : un dirigeant ou une assemblée. */
export const rangeeArbre = (cle: keyof typeof PERSONNES | CleAssemblee) => {
  const i = RANGEES.findIndex((r) => r.cle === cle);
  const r = RANGEES[i];
  return { x: 195 + r.profondeur * 7, y: HAUTS[i] + hauteurRangee(r) / 2, haut: HAUTS[i], hauteur: hauteurRangee(r) };
};

/** Ligne `UnitAssemblyLine` d'une assemblée de l'arbre (centre, défilement nul). */
export const ligneArbre = (cle: CleAssemblee) => {
  const r = rangeeArbre(cle);
  return { x: 195 + 14, y: r.haut + 10 + 18 + 2 + 16 + 4 + 8 };
};

/** Haut d'une ligne d'assemblée du bloc Bertoua. */
const yLigneEtude = (i: number) => Y_ETUDE + 222 + i * H_LIGNE_ETUDE;

/** Repères de l'écran (points, défilement nul). */
export const Y_HIER = {
  vie: Y_VIE,
  /** Centre des six cases. */
  cases: Y_VIE + 116 + 59,
  alerte: Y_VIE + 242 + 23,
  journal: { x: 195, y: Y_VIE + 334 + 19 },
  etude: Y_ETUDE,
  casesEtude: Y_ETUDE + 66 + 59,
  ligneEtude: (cle: CleAssemblee) => yLigneEtude(ORDRE.indexOf(cle)) + 8 + H_LIGNE_ETUDE / 2,
  noteEtude: Y_ETUDE + 777 + 21,
  arbre: Y_ARBRE,
} as const;

// ---------------------------------------------------------------------------------------------
// Briques

export type HalosHier = Partial<
  Record<'vous' | 'equipe' | 'evry' | 'reunions' | 'moyenne' | 'pain' | 'alerte' | 'journal' | 'casesEtude' | 'etudeOuest' | 'etudeEvry' | 'noteEtude' | 'ligneOuest', number>
>;

/** `Tile` des deux blocs : valeur Fraunces 17 mousse (argile si alerte), libellé 10,5 encre 3. */
const Case: React.FC<{ valeur: React.ReactNode; label: string; base: string; alerte?: boolean; halo?: number }> = ({ valeur, label, base, alerte, halo = 0 }) => (
  <div style={{ flexBasis: base, flexGrow: 1 }}>
    <Halo intensite={halo} rayon={10} marge={2} etalement={3}>
      <div style={{ background: S.paper2, border: `1px solid ${S.hair}`, borderRadius: 10, padding: '7px 8px', boxSizing: 'border-box', height: 56 }}>
        <div style={{ fontFamily: P.serif, fontSize: 17, lineHeight: '22px', color: alerte ? S.clay : S.moss }}>{valeur}</div>
        <div style={{ fontSize: 10.5, color: S.ink3, marginTop: 1, lineHeight: '13px' }}>{label}</div>
      </div>
    </Halo>
  </div>
);

const TeteBloc: React.FC<{ icone: React.ReactNode; titre: string; bas: number }> = ({ icone, titre, bas }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 18, marginBottom: bas }}>
    {icone}
    <div style={{ fontSize: 13, fontWeight: 700, color: S.ink }}>{titre}</div>
  </div>
);

const LibelleSection: React.FC<{ children: React.ReactNode; hauteur?: number }> = ({ children, hauteur = 14 }) => (
  <div
    style={{
      marginTop: 10,
      height: hauteur,
      fontFamily: P.mono,
      fontSize: 10.5,
      lineHeight: '14px',
      color: S.ink3,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

const Pilule: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: P.mono, fontSize: 9, color: S.white, letterSpacing: 0.6, textTransform: 'uppercase', padding: '2px 7px', borderRadius: 99, background: S.moss }}>
    {children}
  </div>
);

/** Bloc « Vie d'assemblée » (AssemblyStatsBlock) : que des nombres, période « Novembre 2026 ». */
const BlocVie: React.FC<{ h: HalosHier; generation: boolean }> = ({ h, generation }) => {
  const v = APP.vie;
  return (
    <Carte style={{ marginTop: 14, padding: '12px 14px', height: H_VIE, boxSizing: 'border-box' }}>
      <TeteBloc icone={<IoBookOutline size={18} color={S.mossDeep} />} titre={v.title} bas={10} />
      <div style={{ display: 'flex', gap: 4, padding: 3, height: 30, boxSizing: 'border-box', borderRadius: 10, background: S.mossTint }}>
        {v.kinds.map((k, i) => (
          <div
            key={k}
            style={{
              flex: 1,
              textAlign: 'center',
              borderRadius: 8,
              background: i === 0 ? S.moss : 'transparent',
              fontSize: 12,
              lineHeight: '24px',
              fontWeight: 600,
              color: i === 0 ? S.white : S.ink2,
            }}
          >
            {k}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Rond>
          <IoChevronBack size={16} color={S.ink2} />
        </Rond>
        <div style={{ fontFamily: P.serif, fontSize: 16, color: S.ink, minWidth: 140, textAlign: 'center' }}>{VIE.periode}</div>
        <Rond inactif>
          <IoChevronForward size={16} color={S.ink2} />
        </Rond>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, height: 118 }}>
        <Case base="31%" valeur={VIE.reunions} label={v.statMeetings} halo={h.reunions} />
        <Case base="31%" valeur={VIE.actives} label={v.statActive} />
        <Case base="31%" valeur={VIE.moyenne} label={v.statAverage} halo={h.moyenne} />
        <Case base="31%" valeur={VIE.distinctes} label={v.statDistinct} />
        <Case base="31%" valeur={VIE.pain} label={v.statBread} halo={h.pain} />
        <Case base="31%" valeur={VIE.alertes} label={v.statAlert} alerte halo={h.alerte} />
      </div>
      <div style={{ marginTop: 8 }}>
        <Halo intensite={h.alerte ?? 0} rayon={10} marge={3} etalement={3}>
          <div style={{ height: 46, boxSizing: 'border-box', padding: '7px 10px', borderRadius: 10, border: `1px solid ${S.clay}`, background: S.paper2 }}>
            <div style={{ fontSize: 11.5, lineHeight: '15px', fontWeight: 700, color: S.clay }}>⚠ {v.alertTitle}</div>
            <div style={{ fontSize: 11.5, color: S.ink2, marginTop: 2, lineHeight: '15px' }}>{VIE.alerteNoms}</div>
          </div>
        </Halo>
      </div>
      <div style={{ marginTop: 8, height: 28, fontSize: 10.5, color: S.ink3, lineHeight: '14px' }}>{v.distinctNote}</div>
      <div style={{ marginTop: 10 }}>
        <Halo intensite={h.journal ?? 0} rayon={18}>
          <div
            style={{
              height: 38,
              borderRadius: 18,
              background: S.parchmentDeep,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              color: S.mossDeep,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: -0.1,
            }}
          >
            {generation ? (
              <Chargement couleur={S.mossDeep} />
            ) : (
              <>
                <IoDocumentTextOutline size={15} color={S.moss} />
                <span>{v.journalAll}</span>
              </>
            )}
          </div>
        </Halo>
      </div>
    </Carte>
  );
};

const Rond: React.FC<{ inactif?: boolean; children: React.ReactNode }> = ({ inactif, children }) => (
  <div
    style={{
      width: 28,
      height: 28,
      borderRadius: 14,
      background: S.mossTint,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: inactif ? 0.3 : 1,
    }}
  >
    {children}
  </div>
);

/** Une assemblée du bloc Bertoua (`UnitLine`). */
const LigneEtude: React.FC<{ cle: CleAssemblee; halo?: number }> = ({ cle, halo = 0 }) => {
  const a = ASSEMBLEES[cle];
  const e = a.etude;
  const via = ETUDE.via[cle];
  return (
    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${S.hair}`, height: H_LIGNE_ETUDE - 8, boxSizing: 'border-box' }}>
      <Halo intensite={halo} rayon={8} marge={5} margeY={3} etalement={3}>
        <div style={{ fontSize: 13.5, lineHeight: '18px', fontWeight: 600, color: S.earthDeep, whiteSpace: 'nowrap' }}>
          {a.nom}
          {`  ·  ${a.ville}`}
        </div>
        <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2, lineHeight: '16px', whiteSpace: 'nowrap' }}>
          {APP.hierarchie.leaderPrefix(a.dirigeant)}
          {via ? ` · ${APP.etude.via(via.join(' › '))}` : ''}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 10, rowGap: 2, marginTop: 4, height: 34, fontSize: 12, lineHeight: '16px', color: S.ink2 }}>
          <span>{e.lecons}</span>
          <span>
            {e.enseignes}
            {e.nonEnseignes ? <span style={{ color: S.clay }}>{` · ${e.nonEnseignes}`}</span> : null}
          </span>
          <span>{e.moyenne}</span>
        </div>
        <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2, lineHeight: '16px' }}>{e.derniere}</div>
      </Halo>
    </div>
  );
};

/** Bloc « Le Message de Bertoua » (StudyHierarchyStatsBlock), une seule unité d'étude : pas de pastilles. */
const BlocEtude: React.FC<{ h: HalosHier }> = ({ h }) => {
  const t = APP.etude;
  return (
    <Carte style={{ marginTop: 14, padding: '12px 14px', height: H_ETUDE, boxSizing: 'border-box' }}>
      <TeteBloc icone={<IoSchoolOutline size={18} color={S.mossDeep} />} titre={t.title} bas={6} />
      <LibelleSection>{t.yearTitle(ETUDE.annee)}</LibelleSection>
      <div style={{ marginTop: 6 }}>
        <Halo intensite={h.casesEtude ?? 0} rayon={12} marge={4}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, height: 118 }}>
            <Case base="45%" valeur={ETUDE.seances} label={t.statSessions} />
            <Case base="45%" valeur={ETUDE.lecons} label={t.statLessons} />
            <Case base="45%" valeur={ETUDE.enseignes} label={t.statTaught} />
            <Case base="45%" valeur={ETUDE.moyenne} label={t.statAverage} />
          </div>
        </Halo>
      </div>
      <LibelleSection hauteur={28}>{ETUDE.unite}</LibelleSection>
      {ORDRE.map((k) => (
        <LigneEtude key={k} cle={k} halo={k === 'ouest' ? h.etudeOuest : k === 'evry' ? h.etudeEvry : 0} />
      ))}
      <div style={{ marginTop: 10 }}>
        <Halo intensite={h.noteEtude ?? 0} rayon={8} marge={5} margeY={3} etalement={3}>
          <div style={{ height: 42, fontSize: 10.5, color: S.ink3, lineHeight: '14px' }}>{t.note}</div>
        </Halo>
      </div>
    </Carte>
  );
};

/** Carte d'un dirigeant de l'arbre (`LeaderNodeRow`), avec son résumé Vie d'assemblée. */
const CarteDirigeant: React.FC<{ r: Extract<Rangee, { type: 'dirigeant' }>; ouvert: boolean; halo: number }> = ({ r, ouvert, halo }) => {
  const p = PERSONNES[r.cle];
  const vous = r.cle === 'daniel';
  // Daniel ne dirige aucune assemblée lui-même ; chacun des autres dirige la sienne.
  const propres = vous ? 0 : 1;
  return (
    <div style={{ marginLeft: r.profondeur * 14 }}>
      <Halo intensite={halo} rayon={R.lg} marge={3}>
        <Carte style={{ height: H_DIRIGEANT, boxSizing: 'border-box', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          {ouvert ? <IoChevronDown size={15} color={S.ink3} /> : <IoChevronForward size={15} color={S.ink3} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 19 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink, whiteSpace: 'nowrap' }}>{p.nom}</div>
              {vous ? <Pilule>{APP.hierarchie.you}</Pilule> : null}
            </div>
            <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2, lineHeight: '16px', whiteSpace: 'nowrap' }}>
              {p.role}
              {propres ? ` · ${APP.hierarchie.unitsCount(propres)}` : ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, height: 24 }}>
              <div style={{ flex: 1, fontSize: 11.5, color: S.ink2 }}>
                {APP.vie.leaderSummary(r.resume.assemblees)}
                {r.resume.alertes > 0 ? <span style={{ color: S.clay }}> · {APP.vie.alertCount(r.resume.alertes)}</span> : null}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 99, background: S.mossTint }}>
                <IoDocumentTextOutline size={14} color={S.moss} />
                <div style={{ fontSize: 11, fontWeight: 600, color: S.moss }}>{APP.vie.journalOpen}</div>
              </div>
            </div>
          </div>
        </Carte>
      </Halo>
    </div>
  );
};

/** Ligne d'une assemblée de l'arbre (`UnitRow` + `UnitAssemblyLine`). */
const LigneAssemblee: React.FC<{ r: Extract<Rangee, { type: 'assemblee' }>; halo: number; haloLigne: number }> = ({ r, halo, haloLigne }) => {
  const a = ASSEMBLEES[r.cle];
  return (
    <div style={{ marginLeft: r.profondeur * 14 }}>
      <Halo intensite={halo} rayon={R.lg} marge={3}>
        <Carte variante="paper2" style={{ height: hauteurRangee(r), boxSizing: 'border-box', padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ paddingTop: 2 }}>
            <IoHomeOutline size={14} color={S.earthDeep} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, lineHeight: '18px', fontWeight: 600, color: S.earthDeep, whiteSpace: 'nowrap' }}>
              {a.nom}
              {`  ·  ${a.ville}`}
            </div>
            <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2, lineHeight: '16px' }}>{APP.hierarchie.membersCount(a.membres)}</div>
            <Halo intensite={haloLigne} rayon={8} marge={4} margeY={2} etalement={3}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 4 }}>
                <div style={{ flex: 1, fontSize: 11.5, lineHeight: '16px', color: a.alerte ? S.clay : S.ink2 }}>{a.ligne}</div>
                <IoArrowForwardCircleOutline size={15} color={a.alerte ? S.clay : S.moss} />
              </div>
            </Halo>
          </div>
          <IoChevronForward size={14} color={S.ink3} style={{ marginTop: 2 }} />
        </Carte>
      </Halo>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// L'écran

export const EcranHierarchieCaleb: React.FC<{
  defilement?: number;
  halos?: HalosHier;
  /** Nadège dépliée (0 → 1) : la ligne « Évry Centre · Évry » s'ouvre sous elle. */
  ouvertureNadege?: number;
  generation?: boolean;
}> = ({ defilement = 0, halos = {}, ouvertureNadege = 0, generation = false }) => {
  const h = APP.hierarchie;
  const equipe = halos.equipe ?? 0;
  return (
    <Ecran defilement={defilement} haut={HAUT}>
      <div style={{ width: LARGEUR }}>
        <div style={{ height: 74 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 34 }}>
            <IoArrowBack size={24} color={S.ink2} />
            <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '34px', letterSpacing: -0.4 }}>{h.title}</div>
          </div>
          <div style={{ marginTop: 4, fontSize: 12.5, color: S.ink3, lineHeight: '18px' }}>{h.intro}</div>
        </div>

        <div style={{ marginTop: 12, height: 38, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', borderRadius: 12, background: 'rgba(201,149,107,0.14)' }}>
          <IoArrowUp size={14} color={S.earthDeep} />
          <div style={{ flex: 1, fontSize: 13, color: S.ink2 }}>
            {h.reportsTo} <span style={{ fontWeight: 700, color: S.ink }}>{PERSONNES.bernard.nom}</span>
          </div>
        </div>

        <Carte variante="paper2" style={{ marginTop: 14, height: 66, boxSizing: 'border-box', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <IoPeopleCircleOutline size={18} color={S.mossDeep} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: S.earthDeep }}>{h.supervisorTitle}</div>
            <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2, lineHeight: '16px' }}>{h.supervisorHint}</div>
          </div>
          <IoChevronForward size={16} color={S.ink3} />
        </Carte>

        <BlocVie h={halos} generation={generation} />
        <BlocEtude h={halos} />

        <div style={{ display: 'flex', gap: 8, marginTop: 14, height: 36 }}>
          {[h.viewLeaders, h.viewUnits].map((v, i) => (
            <div
              key={v}
              style={{
                flex: 1,
                borderRadius: 99,
                textAlign: 'center',
                lineHeight: '36px',
                background: i === 0 ? S.moss : 'rgba(42,38,32,0.06)',
                fontSize: 13,
                fontWeight: 600,
                color: i === 0 ? S.white : S.ink2,
              }}
            >
              {v}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RANGEES.map((r) => {
            if (r.type === 'dirigeant') {
              const ouvert = r.cle === 'nadege' ? ouvertureNadege > 0.5 : r.ouvert;
              const halo = r.cle === 'daniel' ? halos.vous ?? 0 : r.profondeur === 1 ? equipe : 0;
              return <CarteDirigeant key={r.cle} r={r} ouvert={ouvert} halo={halo} />;
            }
            const ligne = <LigneAssemblee r={r} halo={r.cle === 'evry' ? halos.evry ?? 0 : 0} haloLigne={r.cle === 'ouest' ? halos.ligneOuest ?? 0 : 0} />;
            if (r.cle !== 'evry') return <div key={r.cle}>{ligne}</div>;
            // Dépliement : la ligne glisse sous la carte de Nadège (hauteur et opacité).
            return (
              <div key={r.cle} style={{ height: hauteurRangee(r) * ouvertureNadege, marginTop: -8 * (1 - ouvertureNadege), opacity: ouvertureNadege, overflow: 'visible' }}>
                {ouvertureNadege > 0.01 ? ligne : null}
              </div>
            );
          })}
        </div>
      </div>
    </Ecran>
  );
};
