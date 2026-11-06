import React from 'react';
import { IoAdd, IoChevronForward, IoFlag, IoMegaphoneOutline, IoMusicalNotesOutline } from 'react-icons/io5';
import { APP } from '../textes';
import { PERSONNES } from '../donnees';
import { P, R, S } from '../theme';
import { BarreOnglets, Carte, Ecran, Halo, ONGLETS } from '../ui/app';

/** Centre de la tuile « Déclarer une action », en points d'écran (appui du doigt). */
export const TUILE_DECLARER = { x: 104, y: 343 };

/**
 * Accueil d'Élise, simple membre (`app/(tabs)/home.tsx`) : date, salutation, carte « Mes
 * objectifs », puis les tuiles visibles pour un membre — « Déclarer une action » (abonnement
 * EVENTS, compte rattaché), « Créer une assemblée », « Cantiques ». `haloOngletEvenements` :
 * surbrillance de l'onglet « Évènements » de la barre du bas (P5 : c'est par là qu'on programme).
 */
export const EcranAccueil: React.FC<{ haloTuile?: number; haloOngletEvenements?: number }> = ({
  haloTuile = 0,
  haloOngletEvenements = 0,
}) => (
  <>
    <Ecran>
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: S.ink3 }}>{APP.dateAccueil}</div>
          <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '32px', marginTop: 4, letterSpacing: -0.45 }}>
            {APP.welcomeBack}
            <br />
            <span style={{ fontStyle: 'italic' }}>{PERSONNES.membre.prenom}</span>.
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
          {PERSONNES.membre.initiales}
        </div>
      </div>

      <Carte style={{ marginTop: 18, padding: '14px 16px', background: S.moss, display: 'flex', alignItems: 'center', gap: 14 }}>
        <IoFlag size={26} color={S.white} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: P.serif, fontSize: 18, color: S.white, lineHeight: '23px' }}>{APP.myGoals}</div>
          <div style={{ fontSize: 12, color: S.parchment, opacity: 0.85, lineHeight: '16px' }}>{APP.myGoalsSub}</div>
        </div>
        <IoChevronForward size={18} color={S.white} />
      </Carte>

      <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Halo intensite={haloTuile} rayon={R.lg}>
          <Tuile label={APP.tuiles.events} indice={APP.tuiles.eventsHint} ton={S.clay} icone={<IoMegaphoneOutline size={22} color={S.clay} />} />
        </Halo>
        <Tuile label={APP.tuiles.structure} indice={APP.tuiles.structureHint} ton={S.moss} icone={<IoAdd size={22} color={S.moss} />} />
        <Tuile label={APP.tuiles.cantique} indice={APP.tuiles.cantiqueHint} ton={S.earth} icone={<IoMusicalNotesOutline size={22} color={S.earth} />} />
      </div>
    </Ecran>
    <BarreOnglets actif={ONGLETS.accueil} halo={{ onglet: ONGLETS.evenements, intensite: haloOngletEvenements }} />
  </>
);

/**
 * `Tile` de l'accueil : surface papier, icône sur sa teinte à 10 %, titre Fraunces 17. Exportée pour
 * l'accueil de la vidéo « Documents » (tuile « Documents »).
 */
export const Tuile: React.FC<{ label: string; indice: string; ton: string; icone: React.ReactNode }> = ({
  label,
  indice,
  ton,
  icone,
}) => (
  <div
    style={{
      width: 168,
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
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: `${ton}1A`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icone}
    </div>
    <div>
      <div style={{ fontFamily: P.serif, fontSize: 17, lineHeight: '20px', letterSpacing: -0.2 }}>{label}</div>
      <div style={{ marginTop: 3, fontSize: 11.5, color: S.ink3 }}>{indice}</div>
    </div>
  </div>
);
