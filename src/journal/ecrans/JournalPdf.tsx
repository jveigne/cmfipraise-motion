import React from 'react';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { BarreOnglets, Bouton, Ecran, Etiquette, Halo, ONGLETS, Pastille } from '../../evenements/ui/app';
import type { Langue } from '../../textes';
import { useJournal } from '../langue';
import { CarteForm, Chargement, Interrupteur, LignePeriode, Retour } from '../ui/elements';

/**
 * Écran « Journal de l'assemblée » (`app/(tabs)/assembly/journal.tsx`) : périodicité (Mois par
 * défaut), période ‹ › (pas de période future), nombre de comptes rendus, « Inclure la liste des
 * présents », phrase de contenu, « Générer le PDF » (chargement pendant la mise en page).
 */

/** Positions d'appui (points), relevées sur l'écran redessiné. */
export const PT_JOURNAL = {
  periodicite: { x: 195, y: 245 },
  /** « Année » passe à la ligne : quatre pastilles ne tiennent pas sur 318 points. */
  annee: { x: 74, y: 272 },
  precedente: { x: 74, y: 324 },
  contenu: { x: 195, y: 508 },
  generer: { x: 195, y: 601 },
} as const;

/**
 * Les mêmes en anglais (JournalEN, 14/10/2026) : « Month · Quarter · Half-year · Year » tiennent
 * sur une ligne — « Year » est la 4ᵉ pastille de la première ligne, et tout ce qui suit remonte de
 * 40 points (une rangée de pastilles). Relevées sur l'écran redessiné.
 */
const PT_JOURNAL_EN = {
  periodicite: PT_JOURNAL.periodicite,
  annee: { x: 320, y: 232 },
  precedente: { x: 74, y: 284 },
  contenu: { x: 195, y: 468 },
  generer: { x: 195, y: 561 },
} as const;

export const ptJournal = (langue: Langue) => (langue === 'en' ? PT_JOURNAL_EN : PT_JOURNAL);

export const EcranJournalPdf: React.FC<{
  /** Index de la périodicité choisie (0 Mois … 3 Année). */
  periodicite: number;
  periode: React.ReactNode;
  suivantInactif: boolean;
  compte: React.ReactNode;
  generation?: boolean;
  haloPastilles?: number;
  haloCompte?: number;
  haloContenu?: number;
  haloGenerer?: number;
}> = ({ periodicite, periode, suivantInactif, compte, generation = false, haloPastilles = 0, haloCompte = 0, haloContenu = 0, haloGenerer = 0 }) => {
  const { app, d } = useJournal();
  return (
    <>
      <Ecran>
        <Retour />
        <div style={{ marginTop: 8, fontFamily: P.serif, fontSize: 26, lineHeight: '32px', letterSpacing: -0.4 }}>{app.journal.title}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: S.ink3, lineHeight: '17px' }}>
          {d.ASSEMBLEE} · {d.VILLE}
        </div>

        <CarteForm>
          <Etiquette style={{ marginBottom: 10, lineHeight: '15px' }}>{app.journal.periodicity}</Etiquette>
          <Halo intensite={haloPastilles} rayon={18} marge={5}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {app.journal.kinds.map((k, i) => (
                <Pastille key={k} label={k} choisie={i === periodicite} />
              ))}
            </div>
          </Halo>
          <LignePeriode libelle={periode} suivantInactif={suivantInactif} largeur={170} haut={18} />
          <div style={{ marginTop: 14, minHeight: 20, display: 'flex', justifyContent: 'center' }}>
            <Halo intensite={haloCompte} rayon={8} marge={8} margeY={3} etalement={3}>
              <div style={{ fontSize: 13.5, color: S.ink2, lineHeight: '20px' }}>{compte}</div>
            </Halo>
          </div>
        </CarteForm>

        <CarteForm>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 31 }}>
            <div style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: S.ink }}>{app.reportUi.includeAttendees}</div>
            <Interrupteur p={1} />
          </div>
          <Halo intensite={haloContenu} rayon={8} marge={6} margeY={4} etalement={3}>
            <div style={{ marginTop: 10, fontSize: 12.5, color: S.ink3, lineHeight: '18px' }}>{app.journal.contentHint}</div>
          </Halo>
        </CarteForm>

        <div style={{ marginTop: 18 }}>
          <Halo intensite={haloGenerer} rayon={18}>
            {generation ? (
              <div style={{ height: 54, borderRadius: 18, background: S.moss, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Chargement couleur={S.white} />
              </div>
            ) : (
              <Bouton label={app.journal.generate} icone={<IoDocumentTextOutline size={18} color={S.white} />} />
            )}
          </Halo>
        </div>
      </Ecran>
      <BarreOnglets actif={ONGLETS.assemblee} libelles={app.onglets} />
    </>
  );
};
