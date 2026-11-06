import React from 'react';
import { IoBookOutline, IoChevronDown, IoDocumentTextOutline, IoPersonOutline, IoRestaurantOutline } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { Ecran, Etiquette, Halo } from '../../evenements/ui/app';
import { BoutonListe, CarteForm, LignePeriode, LignesReunions, Retour, Segments } from '../../journal/ui/elements';
import { APP } from '../textes';
import { ASSEMBLEES, CR_OUEST, REUNIONS_OUEST } from '../donnees';
import { BarreOnglets6, ONGLETS6 } from '../ui/Onglets';

/**
 * Onglet « Assemblée » de Daniel ouvert depuis la Hiérarchie sur Paris Ouest
 * (`app/(tabs)/assembly/index.tsx`, `?unitId=`) : avec l'offre Caleb, `GET /units` rend les
 * assemblées de sa chaîne (plan 27/10 § 3.3), d'où la liste déroulante « Assemblée » (`SelectField`) ;
 * Daniel n'en est pas le dirigeant : pas de « Nouveau CR », la ligne « Lecture seule » à la place
 * (`canWrite` faux, D-ASM-03), « Journal PDF », puis les réunions (`MeetingRows` de « Journal »).
 * Puis le compte rendu du 8 novembre (`assembly/meeting/[id].tsx`) : ni modifier ni supprimer.
 */

/** Positions (points, défilement nul), relevées sur l'écran redessiné. */
export const PT_ASSEMBLEE = {
  selecteur: { x: 195, y: 203 },
  lectureSeule: { x: 195, y: 368 },
  journal: { x: 195, y: 418 },
  /** Deuxième réunion de la liste (8 novembre) : 454 + 65 + 81 / 2. */
  reunion8: { x: 195, y: 560 },
} as const;

export const EcranAssembleeOuest: React.FC<{ haloSelecteur?: number; haloLecture?: number; haloJournal?: number; haloReunion?: number }> = ({
  haloSelecteur = 0,
  haloLecture = 0,
  haloJournal = 0,
  haloReunion = 0,
}) => {
  const t = APP.assemblee;
  const a = ASSEMBLEES.ouest;
  return (
    <>
      <Ecran>
        <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '34px', letterSpacing: -0.4 }}>{t.title}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: S.ink3, lineHeight: '19px' }}>{t.subtitle}</div>

        {/* `SelectField` : libellé, champ de 50, chevron. */}
        <div style={{ marginTop: 10 }}>
          <Etiquette style={{ marginBottom: 6 }}>{t.unitPicker}</Etiquette>
          <Halo intensite={haloSelecteur} rayon={12} marge={3}>
            <div
              style={{
                height: 50,
                boxSizing: 'border-box',
                padding: '0 14px',
                borderRadius: 12,
                border: '1px solid rgba(42,38,32,0.15)',
                background: S.paper,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ flex: 1, fontSize: 14.5, color: S.ink }}>{a.libelle}</div>
              <IoChevronDown size={18} color={S.ink3} />
            </div>
          </Halo>
        </div>

        <Segments actif={0} />
        <LignePeriode libelle={2026} suivantInactif largeur={56} />

        <Halo intensite={haloLecture} rayon={8} marge={4} margeY={2} etalement={3}>
          <div style={{ marginTop: 14, fontSize: 12.5, color: S.ink3, lineHeight: '18px', height: 36 }}>{t.readOnly}</div>
        </Halo>
        <BoutonListe label={t.journalOpen} haut={10} halo={haloJournal} icone={<IoDocumentTextOutline size={17} color={S.moss} />} />

        <div style={{ position: 'relative' }}>
          <LignesReunions reunions={REUNIONS_OUEST} />
          {haloReunion > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 14 + 65,
                height: 81,
                background: `rgba(184,106,74,${0.1 * haloReunion})`,
                border: `2px solid rgba(184,106,74,${0.7 * haloReunion})`,
                boxSizing: 'border-box',
              }}
            />
          ) : null}
        </div>
      </Ecran>
      <BarreOnglets6 actif={ONGLETS6.assemblee} />
    </>
  );
};

const InfoLigne: React.FC<{ icone: React.ReactNode; label: string; valeur: string }> = ({ icone, label, valeur }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
    {icone}
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11.5, color: S.ink3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ marginTop: 2, fontSize: 14, color: S.ink, lineHeight: '19px' }}>{valeur}</div>
    </div>
  </div>
);

/** Compte rendu du 8 novembre, lu par Daniel : pas de bouton modifier / supprimer (`canWrite` faux). */
export const EcranCompteRenduOuest: React.FC<{ defilement?: number; haloInfos?: number; haloPresents?: number }> = ({
  defilement = 0,
  haloInfos = 0,
  haloPresents = 0,
}) => {
  const t = APP.assemblee;
  return (
    <>
      <Ecran defilement={defilement}>
        <Retour hauteur={34} />
        <Etiquette style={{ marginTop: 8 }}>{t.detailTitle}</Etiquette>
        <div style={{ marginTop: 4, fontFamily: P.serif, fontSize: 26, lineHeight: '32px', letterSpacing: -0.4 }}>{CR_OUEST.date}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: S.ink3 }}>{CR_OUEST.assemblee}</div>

        <Halo intensite={haloInfos} rayon={22} marge={3}>
          <CarteForm style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InfoLigne icone={<IoRestaurantOutline size={17} color={S.mossSoft} />} label={t.breadBreaking} valeur={t.yes} />
            <InfoLigne icone={<IoBookOutline size={17} color={S.mossSoft} />} label={t.reading} valeur={CR_OUEST.lecture} />
          </CarteForm>
        </Halo>

        <Halo intensite={haloPresents} rayon={22} marge={3}>
          <CarteForm style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Etiquette>
              {t.attendees} · {CR_OUEST.presents.length}
            </Etiquette>
            {CR_OUEST.presents.map((n) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IoPersonOutline size={15} color={S.mossSoft} />
                <div style={{ fontSize: 14, color: S.ink }}>{n}</div>
              </div>
            ))}
          </CarteForm>
        </Halo>
      </Ecran>
      <BarreOnglets6 actif={ONGLETS6.assemblee} />
    </>
  );
};
