import React from 'react';
import { IoAdd, IoDocumentTextOutline } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { BarreOnglets, Carte, Ecran, ONGLETS } from '../../evenements/ui/app';
import { Reunion } from '../donnees';
import { useJournal } from '../langue';
import { BlocAvancement, BoutonListe, LignePeriode, LignesReunions, Segments } from '../ui/elements';

/**
 * Onglet « Assemblée » de Thomas (`app/(tabs)/assembly/index.tsx`) : titre, sous-titre, une seule
 * assemblée visible (pas de liste déroulante : « Paris Nord · Paris », « Leeds North · Leeds »), segments Réunions /
 * Avancement, puis soit l'année ‹ › + « Nouveau CR » + « Journal PDF » + la liste des réunions
 * (`MeetingsView`), soit l'avancement des modules (`UnitProgressView`).
 */

/** Positions d'appui relevées sur l'écran (points, défilement nul). */
export const PT_VIE = {
  segmentReunions: { x: 109, y: 225 },
  segmentAvancement: { x: 281, y: 225 },
  anneePrecedente: { x: 137, y: 278 },
  nouveauCr: { x: 195, y: 333 },
  journalPdf: { x: 195, y: 387 },
  premiereReunion: { x: 195, y: 463 },
  avancement: { x: 195, y: 330 },
} as const;

export const EcranVieAssemblee: React.FC<{
  onglet: 'reunions' | 'avancement';
  annee?: React.ReactNode;
  /** L'année affichée est l'année en cours : › est grisé (pas d'année future). */
  anneeCourante?: boolean;
  reunions?: readonly Reunion[];
  defilement?: number;
  haloNouveau?: number;
  haloJournal?: number;
  haloPremiere?: number;
  entreePremiere?: number;
  haloSegmentAvancement?: number;
  haloOnglet?: number;
  remplissage?: number;
  haloAvancement?: number;
  /** Opacité de la liste (fondu de 4 images au changement d'année). */
  opaciteListe?: number;
}> = ({
  onglet,
  annee = 2026,
  anneeCourante = true,
  reunions = [],
  defilement = 0,
  haloNouveau = 0,
  haloJournal = 0,
  haloPremiere = 0,
  entreePremiere = 1,
  haloSegmentAvancement = 0,
  haloOnglet = 0,
  remplissage = 1,
  haloAvancement = 0,
  opaciteListe = 1,
}) => {
  const { app, d } = useJournal();
  return (
    <>
      <Ecran defilement={defilement}>
        <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '34px', letterSpacing: -0.4 }}>{app.title}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: S.ink3, lineHeight: '19px' }}>{app.subtitle}</div>
        <div style={{ marginTop: 16, fontFamily: P.serif, fontSize: 19, lineHeight: '24px' }}>
          {d.ASSEMBLEE}
          <span style={{ fontFamily: P.sans, fontSize: 13, color: S.ink3 }}> · {d.VILLE}</span>
        </div>
        <Segments actif={onglet === 'reunions' ? 0 : 1} halo={haloSegmentAvancement} />

        {onglet === 'reunions' ? (
          <>
            <LignePeriode libelle={annee} suivantInactif={anneeCourante} largeur={56} />
            <BoutonListe label={app.newReport} plein haut={16} halo={haloNouveau} icone={<IoAdd size={18} color={S.white} />} />
            <BoutonListe label={app.journal.open} haut={10} halo={haloJournal} icone={<IoDocumentTextOutline size={17} color={S.moss} />} />
            <div style={{ opacity: opaciteListe }}>
              <LignesReunions reunions={reunions} haloPremiere={haloPremiere} entreePremiere={entreePremiere} />
            </div>
          </>
        ) : (
          <Carte style={{ marginTop: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {d.AVANCEMENT.map((a, i) => (
              <BlocAvancement key={a.livre} {...a} remplissage={remplissage} halo={i === 0 ? haloAvancement : 0} />
            ))}
          </Carte>
        )}
      </Ecran>
      <BarreOnglets actif={ONGLETS.assemblee} halo={{ onglet: ONGLETS.assemblee, intensite: haloOnglet }} libelles={app.onglets} />
    </>
  );
};
