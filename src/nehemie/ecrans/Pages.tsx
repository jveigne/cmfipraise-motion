import React from 'react';
import { IoChevronBack, IoChevronForward, IoDownloadOutline, IoWarningOutline } from 'react-icons/io5';
import { P } from '../../evenements/theme';
import { Halo } from '../../evenements/ui/app';
import {
  ANNEE,
  AVANCEMENT,
  EVTS_ASSEMBLEES,
  EVTS_TOTAL,
  EVTS_VILLE,
  JOURNAL,
  LigneMembre,
  PERIODE_JOURNAL,
  SYNTHESE,
  TOTAL_MEMBRES,
  UNITE,
  UNITE_LIBELLE,
  VILLE,
  decimal,
  entier,
} from '../donnees';
import { WEB } from '../textes';
import { W } from '../web';
import {
  BadgeWeb,
  Barre,
  BoutonWeb,
  CarteWeb,
  ChampWeb,
  ICONES_ONGLETS_VILLE,
  Kpi,
  Onglets,
  PageWeb,
  Section,
  Sections,
  TableWeb,
  TeteCarte,
} from '../ui/Web';

/**
 * Pages de « Suivi de la ville » sur l'espace web (`/study/city`), redessinées en px CSS (vue de
 * 600 px). Onglets Assemblées et Membres : `web/src/pages/CityStudy.tsx` (livré, lot « pro-plan »).
 * Parties « Vie d'assemblée » et « Évènements » : lot « Offres » (plan 05 § 3.3, § 3.5, P-08) pas
 * encore codé — dessinées avec les briques existantes (bloc « Vie d'assemblée · comptes rendus »
 * de la Hiérarchie, `EventStatsDrill`), aucun nom de personne dans le journal (D-OFF-05).
 */

const FIL = [WEB.marque, WEB.nav.study, WEB.ville.titreCourt];

const Entete: React.FC<{ section: Section; haloSection?: { section: Section; intensite: number }; children: React.ReactNode; defilement?: number }> = ({
  section,
  haloSection,
  children,
  defilement,
}) => (
  <PageWeb titre={WEB.ville.titre(VILLE)} fil={FIL} defilement={defilement}>
    <Sections active={section} halo={haloSection} />
    {children}
  </PageWeb>
);

const ONGLETS_VILLE = [
  { label: WEB.ville.onglets.overview, Icone: ICONES_ONGLETS_VILLE[0] },
  { label: WEB.ville.onglets.members, Icone: ICONES_ONGLETS_VILLE[1] },
  { label: WEB.ville.onglets.stats, Icone: ICONES_ONGLETS_VILLE[2] },
];

// ---------------------------------------------------------------------------------------------
// Le Message de Bertoua · Assemblées — grille assemblées × leçons (✓ / –)

/** Haut de la première ligne du tableau d'avancement, en px CSS de la page (relevé sur le rendu). */
export const PT_GRILLE = { premiereLigne: 330, hauteurLigne: 57 } as const;

export const PageAssemblees: React.FC<{
  /** Apparition d'une coche (0 → 1) : ligne, leçon. */
  coche?: (ligne: number, lecon: number) => number;
  halos?: Partial<Record<number, number>>;
  teinteHalo?: string;
  haloOnglet?: number;
}> = ({ coche = () => 1, halos, teinteHalo, haloOnglet = 0 }) => (
  <Entete section="bertoua">
    <Onglets items={ONGLETS_VILLE} actif={0} halo={{ i: 0, intensite: haloOnglet }} />
    <CarteWeb style={{ padding: '14px 10px 6px' }}>
      <div style={{ margin: '0 6px 8px', fontSize: 15, fontFamily: P.serif, color: W.green800, fontWeight: 500, lineHeight: 1.3 }}>
        {UNITE_LIBELLE}{' '}
        <span style={{ fontSize: 12.5, color: W.ink500, fontFamily: P.sans }}>{WEB.ville.lecons(UNITE.lecons)}</span>
      </div>
      <TableWeb
        padX={7}
        padY={9}
        halos={halos}
        teinteHalo={teinteHalo}
        lignes={AVANCEMENT}
        colonnes={[
          {
            label: WEB.ville.assemblee,
            largeur: 150,
            rendu: (a) => (
              <div>
                <div style={{ fontWeight: 500 }}>{a.nom}</div>
                <div style={{ color: W.ink500, fontSize: 12 }}>{WEB.ville.membres(a.membres)}</div>
              </div>
            ),
          },
          {
            label: WEB.ville.avancement,
            largeur: 145,
            rendu: (a, i) => {
              const n = a.faites.filter((l) => coche(i, l) > 0.5).length;
              const p = a.faites.reduce((s, l) => s + coche(i, l), 0) / UNITE.lecons;
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Barre p={p} />
                  <span style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
                    {n}/{UNITE.lecons}
                  </span>
                </div>
              );
            },
          },
          ...[1, 2, 3, 4, 5].map((l) => ({
            label: String(l),
            largeur: 49,
            align: 'center' as const,
            rendu: (a: (typeof AVANCEMENT)[number], i: number) => {
              const fait = a.faites.includes(l);
              const c = fait ? coche(i, l) : 1;
              return fait ? (
                <span style={{ color: W.ok, fontWeight: 700, fontSize: 16, display: 'inline-block', opacity: Math.min(1, c * 1.5), transform: `scale(${0.4 + 0.6 * c})` }}>✓</span>
              ) : (
                <span style={{ color: W.ink300, fontSize: 15 }}>–</span>
              );
            },
          })),
        ]}
      />
    </CarteWeb>
  </Entete>
);

// ---------------------------------------------------------------------------------------------
// Le Message de Bertoua · Membres — enseigné / non enseigné

export const PageMembres: React.FC<{
  statut: string;
  compte: number;
  lignes: readonly LigneMembre[];
  haloStatut?: number;
  haloCompte?: number;
  haloOnglet?: number;
  opaciteLignes?: number;
}> = ({ statut, compte, lignes, haloStatut = 0, haloCompte = 0, haloOnglet = 0, opaciteLignes = 1 }) => (
  <Entete section="bertoua">
    <Onglets items={ONGLETS_VILLE} actif={1} halo={{ i: 1, intensite: haloOnglet }} />
    <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
      <ChampWeb label={WEB.ville.filtreStatut} valeur={statut} largeur={210} halo={haloStatut} />
      <ChampWeb label={WEB.ville.filtreAssemblee} valeur={WEB.ville.toutesAssemblees} largeur={220} />
    </div>
    <div style={{ display: 'inline-block', marginBottom: 10 }}>
      <Halo intensite={haloCompte} rayon={8} marge={5} margeY={2} etalement={3}>
        <div style={{ color: W.ink500, fontSize: 13 }}>{WEB.ville.compteMembres(compte)}</div>
      </Halo>
    </div>
    <CarteWeb>
      <div style={{ opacity: opaciteLignes }}>
        <TableWeb
          padX={10}
          lignes={lignes}
          colonnes={[
            { label: WEB.ville.membre, rendu: (m) => <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{m.nom}</span> },
            { label: WEB.ville.assemblee, largeur: 122, rendu: (m) => <span style={{ whiteSpace: 'nowrap' }}>{m.assemblee}</span> },
            {
              label: WEB.ville.enseigne,
              largeur: 128,
              rendu: (m) => <BadgeWeb ton={m.enseigne ? 'ok' : 'gray'}>{m.enseigne ? WEB.ville.statut.TAUGHT : WEB.ville.statut.NOT_TAUGHT}</BadgeWeb>,
            },
            {
              label: WEB.ville.leconsFaites,
              largeur: 64,
              align: 'right',
              rendu: (m) => (
                <span>
                  {m.faites}/{UNITE.lecons}
                </span>
              ),
            },
          ]}
        />
      </div>
    </CarteWeb>
  </Entete>
);

export const STATUT_TOUS = WEB.ville.tousStatuts;
export const STATUT_NON = WEB.ville.statut.NOT_TAUGHT;
export { TOTAL_MEMBRES };

// ---------------------------------------------------------------------------------------------
// Vie d'assemblée · journal de la ville (octobre 2026) — nombres seulement

/** Centre du bouton « Journal PDF » (px CSS de la page, défilement nul). */
export const PT_JOURNAL = { boutonPdf: { x: 524, y: 200 }, alerte: 498 } as const;

export const PageJournal: React.FC<{
  compte?: number;
  haloAlerte?: number;
  haloBouton?: number;
  haloSection?: number;
  haloTable?: number;
  defilement?: number;
}> = ({ compte = 1, haloAlerte = 0, haloBouton = 0, haloSection = 0, haloTable = 0, defilement = 0 }) => {
  const s = SYNTHESE;
  const n = (v: number) => Math.round(v * compte);
  return (
    <Entete section="journal" haloSection={{ section: 'journal', intensite: haloSection }} defilement={defilement}>
      <CarteWeb>
        <TeteCarte
          titre={WEB.journal.titre}
          droite={<BoutonWeb label={WEB.journal.pdf} icone={<IoDownloadOutline size={13} />} halo={haloBouton} />}
        />
        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Rond>
              <IoChevronBack size={14} />
            </Rond>
            <div style={{ fontFamily: P.serif, fontSize: 16, color: W.green800 }}>{PERIODE_JOURNAL}</div>
            <Rond>
              <IoChevronForward size={14} />
            </Rond>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <KpiEtroit label={WEB.journal.reunions} valeur={String(n(s.reunions))} />
            <KpiEtroit label={WEB.journal.actives} valeur={String(n(s.actives))} />
            <KpiEtroit label={WEB.journal.alerte} valeur={String(n(s.alertes))} alerte />
            <KpiEtroit label={WEB.journal.moyenne} valeur={decimal(Math.round(s.moyenne * compte * 10) / 10)} />
            <KpiEtroit label={WEB.journal.distinctes} valeur={String(n(s.distinctes))} />
            <KpiEtroit label={WEB.journal.pain} valeur={String(n(s.pain))} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Halo intensite={haloAlerte} rayon={8} marge={6} margeY={4} etalement={3}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: W.warn }}>
                <IoWarningOutline size={15} />
                {WEB.journal.alerteListe(JOURNAL.filter((l) => l.alerte).map((l) => l.nom).join(', '))}
              </div>
            </Halo>
          </div>
        </div>
      </CarteWeb>
      <div style={{ height: 14 }} />
      <Halo intensite={haloTable} rayon={14} marge={3}>
        <CarteWeb>
          <TeteCarte titre={WEB.journal.parAssemblee} />
          <TableWeb
            padX={8}
            padY={10}
            lignes={JOURNAL}
            halos={{ 4: haloAlerte }}
            colonnes={[
              { label: WEB.journal.colAssemblee, rendu: (l) => <span style={{ fontWeight: 500 }}>{l.nom}</span> },
              { label: WEB.journal.colReunions, largeur: 86, align: 'right', rendu: (l) => l.reunions },
              { label: WEB.journal.colMoyenne, largeur: 104, align: 'right', rendu: (l) => (l.moyenne === null ? '—' : decimal(l.moyenne)) },
              { label: WEB.journal.colPain, largeur: 134, align: 'right', rendu: (l) => l.pain },
              {
                label: WEB.journal.colDernier,
                largeur: 100,
                align: 'right',
                rendu: (l) => <span style={{ fontSize: 12.5, color: l.alerte ? W.warn : W.ink500, whiteSpace: 'nowrap' }}>{l.dernier}</span>,
              },
            ]}
          />
        </CarteWeb>
      </Halo>
    </Entete>
  );
};

const Rond: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: 28, height: 28, borderRadius: 14, border: `1px solid ${W.line}`, display: 'grid', placeItems: 'center', color: W.green800, background: W.ivoryRaised }}>
    {children}
  </div>
);

/** Indicateur à libellé sur deux lignes (grille de trois en étroit). */
const KpiEtroit: React.FC<{ label: string; valeur: string; alerte?: boolean }> = ({ label, valeur, alerte }) => (
  <div style={{ background: W.ivoryRaised, border: `1px solid ${W.lineSoft}`, borderRadius: 10, padding: '10px 12px', minHeight: 82, boxSizing: 'border-box' }}>
    <div style={{ fontSize: 10.5, color: W.ink500, textTransform: 'uppercase', letterSpacing: '.06em', lineHeight: 1.3 }}>{label}</div>
    <div style={{ fontFamily: P.serif, fontWeight: 500, fontSize: 24, color: alerte ? W.warn : W.green800, marginTop: 4 }}>{valeur}</div>
  </div>
);

// ---------------------------------------------------------------------------------------------
// Évènements · statistiques à l'intérieur de la ville (année 2026)

export const PageEvenements: React.FC<{
  compte?: number;
  haloSection?: number;
  haloTable?: number;
  haloKpis?: number;
  halos?: Partial<Record<number, number>>;
  defilement?: number;
}> = ({ compte = 1, haloSection = 0, haloTable = 0, haloKpis = 0, halos, defilement = 0 }) => {
  const t = EVTS_TOTAL;
  const n = (v: number) => entier(Math.round(v * compte));
  return (
    <Entete section="evenements" haloSection={{ section: 'evenements', intensite: haloSection }} defilement={defilement}>
      <div style={{ marginBottom: 14 }}>
        <ChampWeb label={WEB.evenements.periode} valeur={`${WEB.evenements.annee} · ${ANNEE}`} largeur={200} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <Kpi label={WEB.evenements.actions} valeur={n(t.actions)} />
        <Kpi label={WEB.evenements.participants} valeur={n(t.participants)} />
        <Kpi label={WEB.evenements.invites} valeur={n(t.invites)} />
        <Kpi label={WEB.evenements.conversions} valeur={n(t.conversions)} halo={haloKpis} />
        <Kpi label={WEB.evenements.restaurations} valeur={n(t.restaurations)} />
        <Kpi label={WEB.evenements.baptemes} valeur={n(t.baptemes)} halo={haloKpis} />
      </div>
      <div style={{ height: 14 }} />
      <Halo intensite={haloTable} rayon={14} marge={3}>
        <CarteWeb>
          <TeteCarte titre={WEB.evenements.parAssemblee} sous={WEB.evenements.descendre} />
          <TableWeb
            padX={9}
            padY={10}
            lignes={EVTS_ASSEMBLEES}
            halos={halos}
            colonnes={[
              { label: WEB.evenements.colNiveau, rendu: (l) => <span style={{ fontWeight: 500 }}>{l.nom}</span> },
              { label: WEB.evenements.colActions, largeur: 92, align: 'right', rendu: (l) => <strong>{l.actions}</strong> },
              { label: WEB.evenements.participants, largeur: 128, align: 'right', rendu: (l) => entier(l.participants) },
              { label: WEB.evenements.conversions, largeur: 126, align: 'right', rendu: (l) => l.conversions },
              { label: '', largeur: 34, align: 'right', rendu: () => <IoChevronForward size={14} color={W.ink500} /> },
            ]}
          />
          <div style={{ padding: '10px 14px', fontSize: 12, color: W.ink500, borderTop: `1px solid ${W.lineSoft}`, lineHeight: 1.4 }}>
            {WEB.evenements.propres(EVTS_VILLE.actions, VILLE)}
          </div>
        </CarteWeb>
      </Halo>
    </Entete>
  );
};
