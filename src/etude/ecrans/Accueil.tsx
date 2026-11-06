import React from 'react';
import {
  IoAdd,
  IoChevronForward,
  IoFlag,
  IoGitNetworkOutline,
  IoLibraryOutline,
  IoMegaphoneOutline,
  IoMusicalNotesOutline,
  IoPeopleOutline,
  IoSchoolOutline,
} from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { BarreOnglets, Carte, Ecran, Halo, ONGLETS } from '../../evenements/ui/app';
import { Tuile } from '../../evenements/ecrans/Accueil';
import { useEtude } from '../langue';

/**
 * Accueil (`app/(tabs)/home.tsx`), gabarit des accueils d'« Évènements » et de « Documents » : date,
 * salutation, « Mes objectifs », puis les tuiles dans l'ordre du code — « Déclarer une action »
 * (EVENTS), « Documents » (DOCUMENTS + compte rattaché), **« Le Message de Bertoua »** (D-ETU-04 /
 * D-ETU-05 : ASSEMBLY + `isAttachedAccount`, icône `school-outline`, teinte `moss`), « Créer une
 * assemblée », « Membres » et « Hiérarchie » pour un dirigeant, « Cantiques ». La pastille « En
 * cours » (`livePill` : blanc sur argile) se pose en haut à droite de la tuile tant qu'une séance de
 * son assemblée est ouverte (`/study/me`).
 */

/** Centre de la tuile « Le Message de Bertoua » (première tuile de la deuxième rangée), en points. */
export const TUILE_ETUDE = { x: 104, y: 493 };

/** Tuile de l'étude (P5 : en grand, sans pastille). */
export const TuileEtude: React.FC<{ live?: number }> = ({ live = 0 }) => {
  const { app: APP } = useEtude();
  return (
  <div style={{ position: 'relative' }}>
    <Tuile label={APP.tile.title} indice={APP.tile.hint} ton={S.moss} icone={<IoSchoolOutline size={22} color={S.moss} />} />
    {live > 0.001 ? (
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          fontFamily: P.mono,
          fontSize: 9.5,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          padding: '3px 7px',
          borderRadius: 99,
          color: S.white,
          background: S.clay,
          border: `1px solid ${S.clay}`,
          lineHeight: '12px',
          opacity: Math.min(1, live),
          transform: `scale(${0.7 + 0.3 * Math.min(1, live)})`,
          transformOrigin: 'right center',
        }}
      >
        {APP.tile.live}
      </div>
    ) : null}
  </div>
  );
};

export const EcranAccueil: React.FC<{
  date: string;
  prenom: string;
  initiales: string;
  /** Dirigeant : tuiles « Membres » et « Hiérarchie » (`isLeader`). */
  dirigeant?: boolean;
  /** Pastille « En cours » (0 → 1). */
  live?: number;
  haloTuile?: number;
  /** Halo de la pastille seule (P8 : elle pulse). */
  haloLive?: number;
}> = ({ date, prenom, initiales, dirigeant = false, live = 0, haloTuile = 0, haloLive = 0 }) => {
  const { app: APP } = useEtude();
  return (
  <>
    <Ecran>
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: S.ink3 }}>{date}</div>
          <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '32px', marginTop: 4, letterSpacing: -0.45 }}>
            {APP.welcomeBack}
            <br />
            <span style={{ fontStyle: 'italic' }}>{prenom}</span>.
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
          {initiales}
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
        <Tuile label={APP.tuiles.events} indice={APP.tuiles.eventsHint} ton={S.clay} icone={<IoMegaphoneOutline size={22} color={S.clay} />} />
        <Tuile label={APP.tuiles.documents} indice={APP.tuiles.documentsHint} ton={S.mossSoft} icone={<IoLibraryOutline size={22} color={S.mossSoft} />} />
        <Halo intensite={haloTuile} rayon={R.lg}>
          <div style={{ position: 'relative' }}>
            <TuileEtude live={live} />
            {haloLive > 0.001 ? (
              <div style={{ position: 'absolute', top: 6, right: 6, width: 78, height: 26 }}>
                <Halo intensite={haloLive} rayon={13} marge={0} etalement={4}>
                  <div style={{ width: 78, height: 26 }} />
                </Halo>
              </div>
            ) : null}
          </div>
        </Halo>
        <Tuile label={APP.tuiles.structure} indice={APP.tuiles.structureHint} ton={S.moss} icone={<IoAdd size={22} color={S.moss} />} />
        {dirigeant ? (
          <>
            <Tuile label={APP.tuiles.membres} indice={APP.tuiles.membresHint} ton={S.earthDeep} icone={<IoPeopleOutline size={22} color={S.earthDeep} />} />
            <Tuile label={APP.tuiles.hierarchie} indice={APP.tuiles.hierarchieHint} ton={S.sauge} icone={<IoGitNetworkOutline size={22} color={S.sauge} />} />
          </>
        ) : null}
        <Tuile label={APP.tuiles.cantique} indice={APP.tuiles.cantiqueHint} ton={S.earth} icone={<IoMusicalNotesOutline size={22} color={S.earth} />} />
      </div>
    </Ecran>
    <BarreOnglets actif={ONGLETS.accueil} libelles={APP.onglets} />
  </>
  );
};
