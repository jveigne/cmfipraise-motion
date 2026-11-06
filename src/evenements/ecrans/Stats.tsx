import React from 'react';
import { IoBusinessOutline, IoChevronForward, IoHomeOutline, IoMapOutline } from 'react-icons/io5';
import { APP, chiffres } from '../textes';
import { NiveauStats, PAR_MOIS_PARIS_NORD, PAR_TYPE_PARIS_NORD, Totaux } from '../donnees';
import { P, S } from '../theme';
import { BarreOnglets, Carte, Ecran, Etiquette, Halo, ONGLETS, TraitMain } from '../ui/app';
import { Periode, TeteOngletDirigeant } from './Agenda';

const ICONES = { carte: IoMapOutline, immeuble: IoBusinessOutline, maison: IoHomeOutline } as const;

/**
 * Statistiques d'évangélisation (`components/EventStatsDrill.tsx`), onglet « Statistiques » :
 * fil d'Ariane, sept KPI (actions, participants, invités — D-EVT-17 —, conversions, restaurations,
 * baptêmes — D-EVT-15 —, programmés à venir), règle de comptage, une carte par sous-niveau (touchée = descente),
 * la ligne « Dont N … rattachées directement à … » (D-EVT-04), puis par type et par mois.
 * Aucune cible ni barre de progression (D-EVT-06).
 */
export const EcranStats: React.FC<{
  niveau: NiveauStats;
  /** Niveau estompé pendant le chargement du suivant, comme dans l'app (opacité 0,6). */
  estompe?: number;
  /** 0 → 1 : le dernier maillon du fil d'Ariane apparaît. */
  maillon?: number;
  defilement?: number;
  haloOnglet?: number;
  haloKpi?: number;
  haloMaillon?: number;
  haloPropres?: number;
  haloParType?: number;
  haloOctobre?: number;
  /** Carte de sous-niveau à mettre en avant (index) et son intensité. */
  haloEnfant?: { index: number; intensite: number };
}> = ({
  niveau,
  estompe = 0,
  maillon = 1,
  defilement = 0,
  haloOnglet = 0,
  haloKpi = 0,
  haloMaillon = 0,
  haloPropres = 0,
  haloParType = 0,
  haloOctobre = 0,
  haloEnfant,
}) => {
  const ici = niveau.fil[niveau.fil.length - 1];
  const Icone = niveau.icone ? ICONES[niveau.icone] : IoHomeOutline;
  const assemblee = niveau.enfants.length === 0;
  return (
    <>
      <Ecran defilement={defilement}>
        <TeteOngletDirigeant onglet="stats" haloOnglet={haloOnglet} />
        <Periode />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 16 }}>
          {niveau.fil.map((nom, i) => {
            const dernier = i === niveau.fil.length - 1;
            const p = dernier && i > 0 ? maillon : 1;
            return (
              <div key={nom} style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: p }}>
                {i > 0 ? <IoChevronForward size={12} color={S.ink3} /> : null}
                {dernier ? (
                  <Halo intensite={haloMaillon} rayon={6} marge={4}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: S.ink }}>{nom}</div>
                  </Halo>
                ) : (
                  <div style={{ fontSize: 13, fontWeight: 600, color: S.moss, textDecoration: 'underline' }}>{nom}</div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ opacity: 1 - 0.4 * estompe }}>
          <Halo intensite={haloKpi} rayon={22} marge={6}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
              <Kpi label={APP.stats.kpiCount} valeur={niveau.kpi.nombre} fort />
              <Kpi label={APP.stats.kpiParticipants} valeur={niveau.kpi.participants} />
              {/* D-EVT-17 (JP 14/10) : somme des invités, déjà comptés dans les participants. */}
              <Kpi label={APP.stats.kpiGuests} valeur={niveau.kpi.invites} />
              <Kpi label={APP.stats.kpiConversions} valeur={niveau.kpi.conversions} />
              <Kpi label={APP.stats.kpiRestorations} valeur={niveau.kpi.restaurations} />
              <Kpi label={APP.stats.kpiBaptisms} valeur={niveau.kpi.baptemes} />
              <Kpi
                label={APP.stats.kpiAgenda}
                valeur={niveau.kpi.aVenir}
                indice={APP.stats.toClose(niveau.kpi.aCloturer)}
                alerte={niveau.kpi.aCloturer > 0}
              />
            </div>
          </Halo>
          <div style={{ marginTop: 10, fontSize: 11.5, color: S.ink3, lineHeight: '17px' }}>{APP.stats.countingRule}</div>

          {!assemblee ? (
            <>
              <div style={{ marginTop: 22, fontFamily: P.serif, fontSize: 20, lineHeight: '25px' }}>{niveau.parNiveau}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: S.ink3 }}>{APP.stats.drillHint}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                {niveau.enfants.map((c, i) => (
                  <Halo key={c.nom} intensite={haloEnfant?.index === i ? haloEnfant.intensite : 0} rayon={22}>
                    <Carte style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 11,
                            background: S.mossTint,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icone size={18} color={S.mossSoft} />
                        </div>
                        <div style={{ flex: 1, fontSize: 14.5, fontWeight: 600 }}>{c.nom}</div>
                        <div style={{ fontFamily: P.serif, fontSize: 22, color: c.nombre === 0 ? S.ink3 : S.ink }}>{c.nombre}</div>
                        <IoChevronForward size={16} color={S.ink3} />
                      </div>
                      <TraitMain />
                      <div style={{ fontSize: 12, color: S.ink3, marginTop: 2 }}>{chiffres(c)}</div>
                    </Carte>
                  </Halo>
                ))}
              </div>
              {niveau.propres > 0 ? (
                <Halo intensite={haloPropres} rayon={8} marge={6}>
                  <div style={{ marginTop: 10, fontSize: 12, color: S.ink2, lineHeight: '17px' }}>
                    {APP.stats.ownLevel(niveau.propres, ici)}
                  </div>
                </Halo>
              ) : null}
            </>
          ) : null}

          {/* « Par type » et « Par mois » existent à chaque niveau dans l'app ; la vidéo ne les
              montre qu'à l'assemblée (P17), les autres niveaux restent cadrés sur les cartes. */}
          {assemblee ? (
            <>
              <Halo intensite={haloParType} rayon={8} marge={6}>
                <div style={{ marginTop: 22, fontFamily: P.serif, fontSize: 20, lineHeight: '25px' }}>{APP.stats.byType}</div>
              </Halo>
              <ListeTotaux lignes={PAR_TYPE_PARIS_NORD} />
              <div style={{ marginTop: 22, fontFamily: P.serif, fontSize: 20, lineHeight: '25px' }}>{APP.stats.byMonth}</div>
              <ListeTotaux lignes={PAR_MOIS_PARIS_NORD} halo={{ index: 9, intensite: haloOctobre }} />
            </>
          ) : null}
        </div>
      </Ecran>
      <BarreOnglets actif={ONGLETS.evenements} />
    </>
  );
};

const Kpi: React.FC<{ label: string; valeur: number; indice?: string; alerte?: boolean; fort?: boolean }> = ({
  label,
  valeur,
  indice,
  alerte,
  fort,
}) => (
  <Carte
    variante={fort ? 'tinted' : 'paper'}
    style={{ flexBasis: '47%', flexGrow: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4, boxSizing: 'border-box' }}
  >
    <Etiquette>{label}</Etiquette>
    <div style={{ fontFamily: P.serif, fontSize: 28, letterSpacing: -0.5, lineHeight: '34px' }}>{valeur}</div>
    {indice ? <div style={{ fontSize: 11.5, color: alerte ? S.clay : S.ink3 }}>{indice}</div> : null}
  </Carte>
);

/**
 * `ListLine` dans une carte papier 2 : libellé, les totaux (zéros compris : participants dont
 * invités — D-EVT-17 —, conversions, restaurations, baptêmes) s'il y a des
 * actions, nombre à droite.
 */
const ListeTotaux: React.FC<{ lignes: Totaux[]; halo?: { index: number; intensite: number } }> = ({ lignes, halo }) => (
  <Carte variante="paper2" style={{ padding: '4px 16px', marginTop: 10, overflow: 'visible' }}>
    {lignes.map((l, i) => (
      <Halo key={l.nom} intensite={halo?.index === i ? halo.intensite : 0} rayon={8} marge={7}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: i > 0 ? `1px solid ${S.hair}` : undefined }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500, lineHeight: '18px' }}>{l.nom}</div>
            {l.nombre > 0 ? <div style={{ fontSize: 12, color: S.ink3, marginTop: 2 }}>{chiffres(l)}</div> : null}
          </div>
          <div style={{ fontFamily: P.serif, fontSize: 18, color: l.nombre === 0 ? S.ink3 : S.ink }}>{l.nombre}</div>
        </div>
      </Halo>
    ))}
  </Carte>
);
