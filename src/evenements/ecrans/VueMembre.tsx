import React from 'react';
import { IoCalendarOutline, IoHomeOutline, IoMegaphoneOutline } from 'react-icons/io5';
import { APP } from '../textes';
import { ASSEMBLEE, LigneEvenement, RETRAITE } from '../donnees';
import { P, S } from '../theme';
import { BarreOnglets, Bouton, Carte, Ecran, Etiquette, Halo, LigneEvt, ONGLETS, Surtitre, TeteBloc, Titre } from '../ui/app';

/**
 * Onglet « Évènements » du simple membre (`components/EventMemberView.tsx`, D-EVT-14) : sa vue
 * d'assemblée. Compteurs du mois et de l'année de SON assemblée (`EventCounters`), boutons
 * « Déclarer » / « Programmer », programmés à venir puis actions d'évangélisation réalisées de
 * l'assemblée, les siennes marquées « Mon action ».
 */
export const EcranVueMembre: React.FC<{
  mois: React.ReactNode;
  annee: React.ReactNode;
  badge: React.ReactNode;
  realisees: LigneEvenement[];
  /** 0 → 1 : la première ligne réalisée se glisse en tête de liste (P4). */
  entreePremiere?: number;
  haloCompteurs?: number;
  haloPremiere?: number;
  /** Petit éclat mousse autour des compteurs (annotation vidéo). */
  eclat?: number;
  /** Surbrillance du bouton « Programmer » (P5, juste avant l'appui). */
  haloProgrammer?: number;
  defilement?: number;
}> = ({
  mois,
  annee,
  badge,
  realisees,
  entreePremiere = 1,
  haloCompteurs = 0,
  haloPremiere = 0,
  eclat = 0,
  haloProgrammer = 0,
  defilement = 0,
}) => (
  <>
    <Ecran defilement={defilement}>
      <Surtitre haut={0}>{APP.mine.kicker}</Surtitre>
      <Titre>{APP.mine.title}</Titre>
      <div style={{ fontSize: 13, color: S.ink3, marginTop: 4, lineHeight: '19px' }}>{APP.mine.subtitle}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
        <IoHomeOutline size={14} color={S.moss} />
        <div style={{ fontSize: 13.5, fontWeight: 600, color: S.moss }}>{ASSEMBLEE}</div>
      </div>

      <Halo intensite={haloCompteurs} rayon={22}>
        <div style={{ position: 'relative' }}>
          <Carte style={{ marginTop: 16, padding: '18px 16px', display: 'flex', alignItems: 'center' }}>
            <Compteur valeur={mois} label={APP.mine.thisMonth} />
            <div style={{ width: 1, alignSelf: 'stretch', background: S.hair }} />
            <Compteur valeur={annee} label={APP.mine.thisYear} />
          </Carte>
          {eclat > 0 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                top: 16,
                borderRadius: 22,
                boxShadow: `0 0 0 ${2 + 14 * eclat}px rgba(30,58,47,${0.22 * (1 - eclat)})`,
              }}
            />
          ) : null}
        </div>
      </Halo>
      <div style={{ marginTop: 8, fontSize: 11.5, color: S.ink3, textAlign: 'center', lineHeight: '17px' }}>
        {APP.mine.countedHint}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <Bouton label={APP.mine.declare} hauteur={46} style={{ flex: 1 }} icone={<IoMegaphoneOutline size={17} />} />
        <div style={{ flex: 1 }}>
          <Halo intensite={haloProgrammer} rayon={18}>
            <Bouton label={APP.mine.plan} variante="soft" hauteur={46} icone={<IoCalendarOutline size={17} />} />
          </Halo>
        </div>
      </div>

      <TeteBloc titre={APP.mine.upcoming} compte={1} ton={S.earthDeep} sous={APP.mine.plannedSub} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
        <LigneEvt evt={RETRAITE} />
      </div>

      <TeteBloc titre={APP.mine.doneTitle} compte={badge} ton={S.moss} sous={APP.mine.doneSub} />
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
        {realisees.map((evt, i) => {
          const p = i === 0 ? entreePremiere : 1;
          return (
            <div
              key={`${evt.type}-${evt.dates}-${i}`}
              style={{
                maxHeight: i === 0 && p < 1 ? 110 * p : undefined,
                overflow: i === 0 && p < 1 ? 'hidden' : 'visible',
                opacity: i === 0 ? p : 1,
                transform: i === 0 ? `translateY(${(1 - p) * -20}px)` : undefined,
                marginBottom: 8 * p,
              }}
            >
              <LigneEvt evt={evt} halo={i === 0 ? haloPremiere : 0} />
            </div>
          );
        })}
      </div>
    </Ecran>
    <BarreOnglets actif={ONGLETS.evenements} />
  </>
);

const Compteur: React.FC<{ valeur: React.ReactNode; label: string }> = ({ valeur, label }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
    <div style={{ fontFamily: P.serif, fontSize: 34, letterSpacing: -0.6, lineHeight: '42px', height: 42 }}>{valeur}</div>
    <Etiquette>{label}</Etiquette>
  </div>
);
