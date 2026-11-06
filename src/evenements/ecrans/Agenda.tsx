import React from 'react';
import { IoCalendarOutline, IoChevronBack, IoChevronForward, IoMegaphoneOutline } from 'react-icons/io5';
import { APP } from '../textes';
import { AGENDA, LigneEvenement } from '../donnees';
import { P, S } from '../theme';
import { BarreOnglets, Bouton, Ecran, Etiquette, Halo, LigneEvt, ONGLETS, Pastille, Surtitre, TeteBloc, Titre } from '../ui/app';
import { ChampSelection } from './Programmer';

/**
 * En-tête de l'onglet « Évènements » d'un dirigeant (`app/(tabs)/events/index.tsx`,
 * `LeaderEventsTab`) : surtitre, titre, sous-titre et sélecteur « Agenda | Statistiques ».
 */
export const TeteOngletDirigeant: React.FC<{ onglet: 'agenda' | 'stats'; haloOnglet?: number }> = ({ onglet, haloOnglet = 0 }) => (
  <>
    <Surtitre haut={0}>{APP.mine.kicker}</Surtitre>
    <Titre>{APP.tab.title}</Titre>
    <div style={{ fontSize: 13, color: S.ink3, marginTop: 4, lineHeight: '19px' }}>{APP.tab.subtitle}</div>
    <div style={{ display: 'flex', marginTop: 18, background: S.mossTint, borderRadius: 99, padding: 3 }}>
      {(['agenda', 'stats'] as const).map((k) => {
        const actif = k === onglet;
        const bouton = (
          <div
            style={{
              padding: '9px 0',
              borderRadius: 99,
              textAlign: 'center',
              background: actif ? S.paper : 'transparent',
              boxShadow: actif ? '0 1px 3px rgba(42,38,32,0.08)' : undefined,
              fontSize: 13,
              fontWeight: 600,
              color: actif ? S.moss : S.ink3,
              lineHeight: '16px',
            }}
          >
            {k === 'agenda' ? APP.tab.agenda : APP.tab.stats}
          </div>
        );
        return (
          <div key={k} style={{ flex: 1 }}>
            {actif ? (
              <Halo intensite={haloOnglet} rayon={99} marge={3}>
                {bouton}
              </Halo>
            ) : (
              bouton
            )}
          </div>
        );
      })}
    </div>
  </>
);

/** Sélecteur de période (`EventPeriodPicker`) : Mois / Année / Plage, puis « ‹ 2026 › ». */
export const Periode: React.FC = () => (
  <div style={{ marginTop: 14 }}>
    <div style={{ display: 'flex', gap: 8 }}>
      <Pastille label={APP.period.month} />
      <Pastille label={APP.period.year} choisie />
      <Pastille label={APP.period.range} />
    </div>
    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
      <div style={{ padding: 6 }}>
        <IoChevronBack size={18} color={S.ink2} />
      </div>
      <div style={{ fontFamily: P.serif, fontSize: 18, minWidth: 150, textAlign: 'center' }}>2026</div>
      <div style={{ padding: 6, opacity: 0.3 }}>
        <IoChevronForward size={18} color={S.ink2} />
      </div>
    </div>
  </div>
);

/**
 * Agenda du dirigeant de la ville de Paris (`EventAgenda`) : « À clôturer », « À venir »,
 * « Réalisés » sur tout son périmètre (D-EVT-07), boutons « Programmer » / « Déclarer ».
 * `haloOnglet` : surbrillance de l'onglet actif « Évènements » de la barre du bas (P8 : c'est là
 * qu'est l'agenda) ; `haloProgrammer` : surbrillance du bouton « Programmer » (P9, avant l'appui).
 */
export const EcranAgenda: React.FC<{
  defilement?: number;
  haloBlocs?: [number, number, number];
  haloCampagne?: number;
  haloOnglet?: number;
  haloProgrammer?: number;
  /** Bloc « À venir » (facultatif) : par défaut celui d'avant P9 (`AGENDA.aVenir`). */
  aVenir?: LigneEvenement[];
}> = ({ defilement = 0, haloBlocs = [0, 0, 0], haloCampagne = 0, haloOnglet = 0, haloProgrammer = 0, aVenir = AGENDA.aVenir }) => (
  <>
    <Ecran defilement={defilement}>
      <TeteOngletDirigeant onglet="agenda" />
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <div style={{ flex: 1 }}>
          <Halo intensite={haloProgrammer} rayon={18}>
            <Bouton label={APP.mine.plan} hauteur={46} icone={<IoCalendarOutline size={17} />} />
          </Halo>
        </div>
        <Bouton label={APP.mine.declare} variante="soft" hauteur={46} style={{ flex: 1 }} icone={<IoMegaphoneOutline size={17} />} />
      </div>
      <div style={{ marginTop: 10 }}>
        <Etiquette style={{ marginBottom: 6 }}>{APP.agenda.node}</Etiquette>
        <ChampSelection valeur={APP.agenda.allPerimeter} />
      </div>

      <TeteBloc titre={APP.agenda.toClose} compte={AGENDA.aCloturer.length} ton={S.clay} sous={APP.agenda.toCloseSub} halo={haloBlocs[0]} />
      <Liste>
        {AGENDA.aCloturer.map((e, i) => (
          <LigneEvt key={i} evt={e} />
        ))}
      </Liste>

      <TeteBloc titre={APP.agenda.upcoming} compte={aVenir.length} ton={S.earthDeep} sous={APP.agenda.upcomingSub} halo={haloBlocs[1]} />
      <Liste>
        {aVenir.map((e, i) => (
          <LigneEvt key={i} evt={e} halo={i === 0 ? haloCampagne : 0} />
        ))}
      </Liste>

      <TeteBloc titre={APP.agenda.done} sous={APP.agenda.doneSub} halo={haloBlocs[2]} />
      <Periode />
      <Liste>
        {AGENDA.realises.map((e, i) => (
          <LigneEvt key={i} evt={e} />
        ))}
      </Liste>
    </Ecran>
    <BarreOnglets actif={ONGLETS.evenements} halo={{ onglet: ONGLETS.evenements, intensite: haloOnglet }} />
  </>
);

const Liste: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>{children}</div>
);
