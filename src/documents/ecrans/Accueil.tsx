import React from 'react';
import { IoAdd, IoChevronForward, IoFlag, IoLibraryOutline, IoMegaphoneOutline, IoMusicalNotesOutline } from 'react-icons/io5';
import { APP as APP_EVT } from '../../evenements/textes';
import { P, R, S } from '../../evenements/theme';
import { BarreOnglets, Carte, Ecran, Halo, ONGLETS } from '../../evenements/ui/app';
import { Tuile } from '../../evenements/ecrans/Accueil';
import { MARIE } from '../donnees';
import { APP } from '../textes';

/**
 * Accueil de Marie, membre rattachée (`app/(tabs)/home.tsx`), même gabarit que l'accueil d'Élise
 * d'« Évènements » : date, salutation, « Mes objectifs », puis les tuiles d'un membre dans l'ordre
 * du code — « Déclarer une action » (EVENTS), « Documents » (DOCUMENTS + compte rattaché,
 * `library-outline`, teinte `mossSoft`), « Créer une assemblée », « Cantiques ».
 */

/** Centre de la tuile « Documents » (seconde tuile de la première rangée), en points d'écran. */
export const TUILE_DOCUMENTS = { x: 286, y: 343 };

export const EcranAccueil: React.FC<{ haloTuile?: number }> = ({ haloTuile = 0 }) => (
  <>
    <Ecran>
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: S.ink3 }}>{APP.dateAccueil}</div>
          <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '32px', marginTop: 4, letterSpacing: -0.45 }}>
            {APP_EVT.welcomeBack}
            <br />
            <span style={{ fontStyle: 'italic' }}>{MARIE.prenom}</span>.
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
          {MARIE.initiales}
        </div>
      </div>

      <Carte style={{ marginTop: 18, padding: '14px 16px', background: S.moss, display: 'flex', alignItems: 'center', gap: 14 }}>
        <IoFlag size={26} color={S.white} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: P.serif, fontSize: 18, color: S.white, lineHeight: '23px' }}>{APP_EVT.myGoals}</div>
          <div style={{ fontSize: 12, color: S.parchment, opacity: 0.85, lineHeight: '16px' }}>{APP_EVT.myGoalsSub}</div>
        </div>
        <IoChevronForward size={18} color={S.white} />
      </Carte>

      <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Tuile label={APP_EVT.tuiles.events} indice={APP_EVT.tuiles.eventsHint} ton={S.clay} icone={<IoMegaphoneOutline size={22} color={S.clay} />} />
        <Halo intensite={haloTuile} rayon={R.lg}>
          <Tuile label={APP.tuileDocuments} indice={APP.tuileDocumentsHint} ton={S.mossSoft} icone={<IoLibraryOutline size={22} color={S.mossSoft} />} />
        </Halo>
        <Tuile label={APP_EVT.tuiles.structure} indice={APP_EVT.tuiles.structureHint} ton={S.moss} icone={<IoAdd size={22} color={S.moss} />} />
        <Tuile label={APP_EVT.tuiles.cantique} indice={APP_EVT.tuiles.cantiqueHint} ton={S.earth} icone={<IoMusicalNotesOutline size={22} color={S.earth} />} />
      </div>
    </Ecran>
    <BarreOnglets actif={ONGLETS.accueil} />
  </>
);

/**
 * Tuile « Documents » seule, en grand (P4, la bascule) : même dessin que dans l'accueil.
 */
export const TuileDocuments: React.FC = () => (
  <Tuile label={APP.tuileDocuments} indice={APP.tuileDocumentsHint} ton={S.mossSoft} icone={<IoLibraryOutline size={22} color={S.mossSoft} />} />
);
