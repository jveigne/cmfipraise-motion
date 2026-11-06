import React from 'react';
import { IoBookOutline, IoCreateOutline, IoPersonOutline, IoRestaurantOutline, IoTrashOutline } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { BarreOnglets, Ecran, Etiquette, ONGLETS } from '../../evenements/ui/app';
import { useJournal } from '../langue';
import { CarteForm, Retour } from '../ui/elements';
import { CarteApercu, texteCR } from './Formulaire';

/**
 * Compte rendu enregistré (`app/(tabs)/assembly/meeting/[id].tsx`) : modifier / supprimer (dirigeant
 * de l'assemblée), « COMPTE RENDU », date, assemblée, fraction de pain et lecture, présents, puis la
 * carte « Aperçu du CR » avec Copier / Partager.
 */

/** Bouton « Copier » de l'aperçu, en points, défilement nul (relevé sur l'écran redessiné). */
export const PT_CR = { copier: { x: 103, y: 1211 } } as const;

const InfoLigne: React.FC<{ icone: React.ReactNode; label: string; valeur: string }> = ({ icone, label, valeur }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
    {icone}
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11.5, color: S.ink3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ marginTop: 2, fontSize: 14, color: S.ink, lineHeight: '19px' }}>{valeur}</div>
    </div>
  </div>
);

const RondIcone: React.FC<{ fond: string; children: React.ReactNode }> = ({ fond, children }) => (
  <div style={{ width: 34, height: 34, borderRadius: 17, background: fond, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </div>
);

export const EcranCompteRendu: React.FC<{ defilement?: number; copie?: number; haloCopie?: number }> = ({
  defilement = 0,
  copie = 0,
  haloCopie = 0,
}) => {
  const j = useJournal();
  const { app, d } = j;
  return (
    <>
      <Ecran defilement={defilement}>
        <Retour hauteur={34}>
          <RondIcone fond={S.mossTint2}>
            <IoCreateOutline size={16} color={S.moss} />
          </RondIcone>
          <RondIcone fond={S.mossTint}>
            <IoTrashOutline size={16} color={S.clay} />
          </RondIcone>
        </Retour>
        <Etiquette style={{ marginTop: 8 }}>{app.detail.title}</Etiquette>
        <div style={{ marginTop: 4, fontFamily: P.serif, fontSize: 26, lineHeight: '32px', letterSpacing: -0.4 }}>{d.REUNION_DU_JOUR.date}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: S.ink3 }}>{d.ASSEMBLEE}</div>

        <CarteForm style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <InfoLigne icone={<IoRestaurantOutline size={17} color={S.mossSoft} />} label={app.breadBreaking} valeur={app.detail.yes} />
          <InfoLigne
            icone={<IoBookOutline size={17} color={S.mossSoft} />}
            label={app.detail.reading}
            valeur={`${d.REUNION_DU_JOUR.livre} — ${d.REUNION_DU_JOUR.chapitres}`}
          />
        </CarteForm>

        <CarteForm style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Etiquette>
            {app.detail.attendees} · {d.PRESENTS_DU_JOUR.length}
          </Etiquette>
          {d.PRESENTS_DU_JOUR.map((n) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IoPersonOutline size={15} color={S.mossSoft} />
              <div style={{ fontSize: 14, color: S.ink }}>{n}</div>
            </div>
          ))}
        </CarteForm>

        <CarteApercu
          texte={texteCR(j, { date: d.DATE_CR, presents: d.PRESENTS_DU_JOUR, pain: true, livre: d.REUNION_DU_JOUR.livre ?? null, chapitres: d.REUNION_DU_JOUR.chapitres ?? '', avecNoms: true })}
          copie={copie}
          haloCopie={haloCopie}
        />
      </Ecran>
      <BarreOnglets actif={ONGLETS.assemblee} libelles={app.onglets} />
    </>
  );
};
