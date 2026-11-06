import React from 'react';
import {
  IoBookOutline,
  IoBusinessOutline,
  IoChevronForward,
  IoFlagOutline,
  IoGlobeOutline,
  IoHomeOutline,
  IoLockClosedOutline,
  IoMedkitOutline,
  IoPaperPlaneOutline,
  IoPeopleOutline,
  IoTimeOutline,
  IoTrendingUpOutline,
} from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Bouton, Carte, Ecran, Etiquette, Halo, TraitMain } from '../../evenements/ui/app';
import { APP } from '../textes';
import { ANNEES, CleCategorie, DATE_LIMITE, META_CATEGORIES, OBJECTIFS } from '../donnees';
import { BarreOnglets6, ONGLETS6 } from '../ui/Habillage';

/**
 * « Mes objectifs » de Samuel (`app/(tabs)/goals/member.tsx`, chantier du 16/08 : tout compte
 * rattaché déclare ses objectifs personnels, dirigeant compris) : titre, « Vue : Personnelle »,
 * années, date limite, cartes de lecture du dirigeant (« Mes assemblées », « Relancer »), puis
 * « Mes objectifs » — une `GoalLineCard` par catégorie du But Quinquennal —, « Déclarer l'état
 * actuel », « Historique » et « Soumettre mes engagements ». Les catégories en euros restent « À
 * compléter » : aucun montant à l'image (plan § 9).
 */

const ICONES: Record<CleCategorie, React.ComponentType<{ size: number; color: string }>> = {
  LIVRES: IoBookOutline,
  MISSIONNAIRES: IoGlobeOutline,
  URGENCE: IoMedkitOutline,
  HALL: IoBusinessOutline,
  EFFECTIFS: IoPeopleOutline,
};

/** Index de la carte « Effectifs » (mise en avant en P5). */
export const LIGNE_EFFECTIFS = OBJECTIFS.findIndex((o) => o.cle === 'EFFECTIFS');

const CarteNav: React.FC<{ icone: React.ReactNode; titre: string; indice: string }> = ({ icone, titre, indice }) => (
  <Carte variante="tinted" style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
    {icone}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: S.ink }}>{titre}</div>
      <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2, lineHeight: '16px' }}>{indice}</div>
    </div>
    <IoChevronForward size={16} color={S.ink3} />
  </Carte>
);

/** `GoalLineCard` : icône teintée, nom, état ; engagé / versé, barre et pourcentage si un engagement existe. */
const LigneObjectif: React.FC<{ o: (typeof OBJECTIFS)[number]; remplissage: number; halo: number }> = ({ o, remplissage, halo }) => {
  const ton = META_CATEGORIES[o.cle].ton;
  const Icone = ICONES[o.cle];
  const engage = o.engage != null;
  const pct = engage && o.engage! > 0 ? Math.round(((o.verse ?? 0) / o.engage!) * 100) : 0;
  return (
    <Halo intensite={halo} rayon={R.lg}>
      <Carte style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: `${ton}1F`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icone size={18} color={ton} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink }}>{o.nom}</div>
            <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2 }}>{engage ? APP.goals.lineDraft : APP.goals.lineToComplete}</div>
          </div>
          <IoChevronForward size={16} color={S.ink3} />
        </div>
        {engage ? (
          <>
            <TraitMain marge={10} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Etiquette>{APP.goals.pledged}</Etiquette>
                <div style={{ fontFamily: P.serif, fontSize: 18, color: S.ink, marginTop: 2 }}>{`${o.engage} ${o.unite}`}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Etiquette>{APP.goals.given}</Etiquette>
                <div style={{ fontFamily: P.serif, fontSize: 18, color: S.ink, marginTop: 2 }}>{`${o.verse} ${o.unite}`}</div>
              </div>
            </div>
            <div style={{ height: 6, marginTop: 10, borderRadius: 99, background: 'rgba(42,38,32,0.05)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct * remplissage}%`, background: ton }} />
            </div>
            <div style={{ fontFamily: P.mono, fontSize: 10.5, color: S.ink3, marginTop: 4, textAlign: 'right' }}>{`${Math.round(pct * remplissage)}%`}</div>
          </>
        ) : null}
      </Carte>
    </Halo>
  );
};

export const EcranObjectifs: React.FC<{
  defilement?: number;
  /** Remplissage des barres (0 → 1). */
  remplissage?: number;
  haloLigne?: { index: number; intensite: number };
  haloEtat?: number;
  haloSoumettre?: number;
}> = ({ defilement = 0, remplissage = 1, haloLigne, haloEtat = 0, haloSoumettre = 0 }) => (
  <>
    <Ecran defilement={defilement}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <IoFlagOutline size={22} color={S.mossSoft} />
        <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '34px', letterSpacing: -0.4 }}>{APP.goals.title}</div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ marginTop: 8, padding: '4px 10px', borderRadius: 999, background: S.mossTint, fontSize: 11.5, fontWeight: 600, color: S.mossSoft }}>
          {APP.goals.viewBadge} : {APP.goals.viewMember}
        </div>
      </div>

      {/* `YearSelector` : l'année courante en mousse. */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {ANNEES.map((a, i) => (
          <div
            key={a}
            style={{
              padding: '6px 14px',
              borderRadius: 99,
              background: i === 0 ? S.moss : 'rgba(42,38,32,0.06)',
              fontSize: 13,
              fontWeight: 600,
              color: i === 0 ? S.white : S.ink2,
            }}
          >
            {a}
          </div>
        ))}
      </div>

      <Carte variante="paper2" style={{ marginTop: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <IoTimeOutline size={18} color={S.earthDeep} />
        <div style={{ flex: 1, fontSize: 12.5, color: S.ink2, lineHeight: '18px' }}>{APP.goals.deadlineFuture(DATE_LIMITE)}</div>
      </Carte>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
        <CarteNav icone={<IoHomeOutline size={18} color={S.mossDeep} />} titre={APP.goals.navUnits} indice={APP.goals.navUnitsHint} />
        <CarteNav icone={<IoPaperPlaneOutline size={18} color={S.mossDeep} />} titre={APP.goals.navRemind} indice={APP.goals.navRemindHint} />
      </div>

      <div style={{ marginTop: 22, fontFamily: P.serif, fontSize: 18, color: S.ink }}>{APP.goals.memberTitle}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
        {OBJECTIFS.map((o, i) => (
          <LigneObjectif key={o.cle} o={o} remplissage={remplissage} halo={haloLigne?.index === i ? haloLigne.intensite : 0} />
        ))}
      </div>

      <Halo intensite={haloEtat} rayon={18}>
        <Bouton label={APP.goals.addProgress} variante="soft" style={{ marginTop: 16 }} icone={<IoTrendingUpOutline size={18} color={S.mossDeep} />} />
      </Halo>
      <Bouton label={APP.goals.historyBtn} variante="ghost" style={{ marginTop: 10 }} />
      <div style={{ marginTop: 16 }}>
        <Halo intensite={haloSoumettre} rayon={18}>
          <Bouton label={APP.goals.submitCta} icone={<IoLockClosedOutline size={18} color={S.white} />} />
        </Halo>
      </div>
    </Ecran>
    <BarreOnglets6 actif={ONGLETS6.objectifs} />
  </>
);
