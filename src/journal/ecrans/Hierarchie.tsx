import React from 'react';
import {
  IoAdd,
  IoArrowBack,
  IoArrowUp,
  IoBookOutline,
  IoChevronDown,
  IoChevronForward,
  IoDocumentTextOutline,
  IoFlag,
  IoGitNetworkOutline,
  IoMegaphoneOutline,
  IoPeopleCircleOutline,
  IoPeopleOutline,
} from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { BarreOnglets, Carte, Ecran, Halo, ONGLETS } from '../../evenements/ui/app';
import { useJournal } from '../langue';
import { Chargement, LignePeriode } from '../ui/elements';

/**
 * Accueil de Daniel, dirigeant de la ville de Paris (`app/(tabs)/home.tsx`), et sa Hiérarchie
 * (`app/hierarchie.tsx` + bloc « Vie d'assemblée » de `components/AssemblyHierarchyStats.tsx`).
 */

/** Positions d'appui (points), relevées sur les écrans redessinés. */
export const PT_HIER = {
  tuileHierarchie: { x: 280, y: 495 },
  /** Bouton « Journal PDF de ma hiérarchie », défilement nul. */
  journalTout: { x: 195, y: 650 },
  /** Centre des six cases, défilement nul. */
  cases: { x: 195, y: 468 },
} as const;

/** `Tile` de l'accueil : surface papier, icône sur sa teinte à 10 %, titre Fraunces 17. */
const Tuile: React.FC<{ label: string; indice: string; ton: string; icone: React.ReactNode; halo?: number }> = ({
  label,
  indice,
  ton,
  icone,
  halo = 0,
}) => (
  <Halo intensite={halo} rayon={R.lg}>
    <div
      style={{
        width: 169,
        minHeight: 138,
        padding: '16px 16px 14px',
        boxSizing: 'border-box',
        borderRadius: R.lg,
        background: S.paper,
        border: '1px solid rgba(42,38,32,0.07)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${ton}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icone}
      </div>
      <div>
        <div style={{ fontFamily: P.serif, fontSize: 17, lineHeight: '20px', letterSpacing: -0.2 }}>{label}</div>
        <div style={{ marginTop: 3, fontSize: 11.5, color: S.ink3 }}>{indice}</div>
      </div>
    </div>
  </Halo>
);

/**
 * Accueil de Daniel : tuiles d'un dirigeant (Évènements, Créer une assemblée, Membres, Hiérarchie ;
 * « Cantiques » suit, hors champ). Pas d'abonnement Dons dans le scénario.
 */
export const EcranAccueilDaniel: React.FC<{ haloHierarchie?: number }> = ({ haloHierarchie = 0 }) => {
  const { app, d } = useJournal();
  return (
    <>
      <Ecran>
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: S.ink3 }}>{app.dateAccueil}</div>
            <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '32px', marginTop: 4, letterSpacing: -0.45 }}>
              {app.welcomeBack}
              <br />
              <span style={{ fontStyle: 'italic' }}>{d.PERSONNES.daniel.prenom}</span>.
            </div>
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              background: S.moss,
              color: S.white,
              fontFamily: P.serif,
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {d.PERSONNES.daniel.initiales}
          </div>
        </div>

        <Carte style={{ marginTop: 18, padding: '14px 16px', background: S.moss, display: 'flex', alignItems: 'center', gap: 14 }}>
          <IoFlag size={26} color={S.white} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: P.serif, fontSize: 18, color: S.white, lineHeight: '23px' }}>{app.myGoals}</div>
            <div style={{ fontSize: 12, color: S.parchment, opacity: 0.85, lineHeight: '16px' }}>{app.myGoalsSub}</div>
          </div>
          <IoChevronForward size={18} color={S.white} />
        </Carte>

        <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Tuile label={app.tuiles.events} indice={app.tuiles.eventsHint} ton={S.clay} icone={<IoMegaphoneOutline size={22} color={S.clay} />} />
          <Tuile label={app.tuiles.structure} indice={app.tuiles.structureHint} ton={S.moss} icone={<IoAdd size={22} color={S.moss} />} />
          <Tuile label={app.tuiles.membres} indice={app.tuiles.membresHint} ton={S.earthDeep} icone={<IoPeopleOutline size={22} color={S.earthDeep} />} />
          <Tuile
            label={app.tuiles.hierarchie}
            indice={app.tuiles.hierarchieHint}
            ton={S.sauge}
            icone={<IoGitNetworkOutline size={22} color={S.sauge} />}
            halo={haloHierarchie}
          />
        </div>
      </Ecran>
      <BarreOnglets actif={ONGLETS.accueil} libelles={app.onglets} />
    </>
  );
};

/** Case de statistique (`Tile` d'AssemblyHierarchyStats) : valeur Fraunces 17 mousse (argile si alerte). */
const Case: React.FC<{ valeur: React.ReactNode; label: string; alerte?: boolean; halo?: number }> = ({ valeur, label, alerte, halo = 0 }) => (
  <div style={{ flexBasis: '31%', flexGrow: 1 }}>
    <Halo intensite={halo} rayon={10} marge={2} etalement={3}>
      <div style={{ background: S.paper2, border: `1px solid ${S.hair}`, borderRadius: 10, padding: '7px 8px', boxSizing: 'border-box', height: 56 }}>
        <div style={{ fontFamily: P.serif, fontSize: 17, lineHeight: '22px', color: alerte ? S.clay : S.moss }}>{valeur}</div>
        <div style={{ fontSize: 10.5, color: S.ink3, marginTop: 1, lineHeight: '13px' }}>{label}</div>
      </div>
    </Halo>
  </div>
);

/**
 * Hiérarchie de Daniel : retour, titre, introduction, « Vous rendez compte à », « Mon superviseur »,
 * le bloc « Vie d'assemblée » (pas de bloc « Ce que porte mon leadership » : aucun But actif dans le
 * scénario), puis les segments Dirigeants | Assemblées et le haut de l'arbre.
 */
export const EcranHierarchie: React.FC<{
  defilement?: number;
  haloCases?: number;
  haloAlerte?: number;
  haloJournal?: number;
  generation?: boolean;
}> = ({ defilement = 0, haloCases = 0, haloAlerte = 0, haloJournal = 0, generation = false }) => {
  const { app, d } = useJournal();
  const th = app.hierarchy;
  return (
    <Ecran defilement={defilement} haut={59 + 4}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
        <IoArrowBack size={24} color={S.ink2} />
        <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '34px', letterSpacing: -0.4 }}>{app.hierarchie.title}</div>
      </div>
      <div style={{ marginTop: 4, fontSize: 12.5, color: S.ink3, lineHeight: '18px' }}>{app.hierarchie.intro}</div>

      <div
        style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderRadius: 12,
          background: 'rgba(201,149,107,0.14)',
        }}
      >
        <IoArrowUp size={14} color={S.earthDeep} />
        <div style={{ flex: 1, fontSize: 13, color: S.ink2 }}>
          {app.hierarchie.reportsTo} <span style={{ fontWeight: 700, color: S.ink }}>{d.PERSONNES.bernard.nom}</span>
        </div>
      </div>

      <Carte variante="paper2" style={{ marginTop: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <IoPeopleCircleOutline size={18} color={S.mossDeep} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: S.earthDeep }}>{app.hierarchie.supervisorTitle}</div>
          <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2 }}>{app.hierarchie.supervisorHint}</div>
        </div>
        <IoChevronForward size={16} color={S.ink3} />
      </Carte>

      {/* Bloc « Vie d'assemblée » (D-ASM-18) : que des nombres. */}
      <Carte style={{ marginTop: 14, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <IoBookOutline size={18} color={S.mossDeep} />
          <div style={{ fontSize: 13, fontWeight: 700, color: S.ink }}>{th.title}</div>
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 3, borderRadius: 10, background: S.mossTint }}>
          {app.journal.kinds.map((k, i) => (
            <div
              key={k}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '6px 0',
                borderRadius: 8,
                background: i === 0 ? S.moss : 'transparent',
                fontSize: 12,
                fontWeight: 600,
                color: i === 0 ? S.white : S.ink2,
              }}
            >
              {k}
            </div>
          ))}
        </div>
        <LignePeriode libelle={d.HIERARCHIE.periode} suivantInactif taille={28} ecart={12} largeur={140} police={16} haut={8} />

        <Halo intensite={haloCases} rayon={12} marge={4}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            <Case valeur={d.HIERARCHIE.reunions} label={th.statMeetings} />
            <Case valeur={d.HIERARCHIE.actives} label={th.statActive} />
            <Case valeur={d.HIERARCHIE.moyenne} label={th.statAverage} />
            <Case valeur={d.HIERARCHIE.distinctes} label={th.statDistinct} />
            <Case valeur={d.HIERARCHIE.pain} label={th.statBread} />
            <Case valeur={d.HIERARCHIE.alertes} label={th.statAlert} alerte halo={haloAlerte} />
          </div>
        </Halo>

        <Halo intensite={haloAlerte} rayon={10} marge={3} etalement={3}>
          <div style={{ marginTop: 8, padding: '7px 10px', borderRadius: 10, border: `1px solid ${S.clay}`, background: S.paper2 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: S.clay }}>⚠ {th.alertTitle}</div>
            <div style={{ fontSize: 11.5, color: S.ink2, marginTop: 2, lineHeight: '16px' }}>{d.HIERARCHIE.alerteNoms}</div>
          </div>
        </Halo>

        <div style={{ fontSize: 10.5, color: S.ink3, lineHeight: '14px', marginTop: 8 }}>{th.distinctNote}</div>

        <div style={{ marginTop: 10 }}>
          <Halo intensite={haloJournal} rayon={18}>
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
                  <span>{th.journalAll}</span>
                </>
              )}
            </div>
          </Halo>
        </div>
      </Carte>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        {[app.hierarchie.viewLeaders, app.hierarchie.viewUnits].map((v, i) => (
          <div
            key={v}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 99,
              textAlign: 'center',
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

      {/* Haut de l'arbre : Daniel (« Vous »), puis les trois dirigeants d'assemblée. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
        <Carte style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <IoChevronDown size={15} color={S.ink3} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink }}>{d.PERSONNES.daniel.nom}</div>
              <div
                style={{
                  fontFamily: P.mono,
                  fontSize: 9,
                  color: S.white,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                  padding: '2px 7px',
                  borderRadius: 99,
                  background: S.moss,
                }}
              >
                {app.hierarchie.you}
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2 }}>{app.hierarchie.roleDirigeant}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <div style={{ flex: 1, fontSize: 11.5, color: S.ink2 }}>
                {th.leaderSummary(3)}
                <span style={{ color: S.clay }}> · {th.alertCount(1)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 99, background: S.mossTint }}>
                <IoDocumentTextOutline size={14} color={S.moss} />
                <div style={{ fontSize: 11, fontWeight: 600, color: S.moss }}>{app.journal.open}</div>
              </div>
            </div>
          </div>
        </Carte>
        {d.HIERARCHIE.equipe.map((d) => (
          <Carte key={d.nom} style={{ marginLeft: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <IoChevronForward size={15} color={S.ink3} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink }}>{d.nom}</div>
              <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2 }}>{app.hierarchie.roleDirigeantUnite} · {app.hierarchie.unitsCount(1)}</div>
            </div>
          </Carte>
        ))}
      </div>
    </Ecran>
  );
};
