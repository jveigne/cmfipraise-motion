import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  IoBookOutline,
  IoCheckmarkCircle,
  IoFlagOutline,
  IoHeartOutline,
  IoHomeOutline,
  IoMegaphoneOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { PastilleCoin } from '../../evenements/ui/Habillage';
import { Halo } from '../../evenements/ui/app';
import { APP, CARTONS } from '../textes';

/**
 * Habillage propre à la vidéo « Gratuit » (hors écrans de l'app) : intertitre (gabarit de l'`Intertitre`
 * d'« Étude », avec les textes de cette vidéo), tampon « Gratuit » posé sur le coin du téléphone,
 * barre d'onglets à six onglets d'un dirigeant d'assemblée.
 */

/** 2,5 s (retour JP 14/10 et 21/10). */
export const DUREE_INTERTITRE = 75;

export type PartieGratuit = 'assemblee' | 'objectifs' | 'aussi';

/**
 * Intertitre plein cadre : l'aplat monte du bas (i 0 → 10), le numéro, le titre et la phrase
 * arrivent (i 6 → 22), puis l'aplat repart vers le haut en découvrant le plan suivant (i 65 → 75).
 */
export const Intertitre: React.FC<{ partie: PartieGratuit; couleur: string }> = ({ partie, couleur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = CARTONS.intertitres[partie];
  const entree = interpolate(f, [0, 10], [1920, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const sortie = interpolate(f, [DUREE_INTERTITRE - 10, DUREE_INTERTITRE], [0, -1920], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const texte = (a: number) => {
    const p = spring({ frame: f - a, fps, config: { damping: 200 }, durationInFrames: 12 });
    return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
  };
  return (
    <AbsoluteFill style={{ transform: `translateY(${entree + sortie}px)`, background: couleur }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 60px 60px' }}>
        <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontWeight: 300, fontSize: 300, lineHeight: 1, color: 'rgba(201,149,107,0.6)', ...texte(6) }}>
          {t.numero}
        </div>
        <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 110, lineHeight: 1.05, letterSpacing: -2, color: S.white, marginTop: 10, textAlign: 'center', ...texte(9) }}>
          {t.titre}
        </div>
        <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontWeight: 400, fontSize: 46, lineHeight: 1.25, color: S.parchment, marginTop: 34, textAlign: 'center', ...texte(14) }}>
          {t.phrase}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Tampon « Gratuit » sur le coin du téléphone (la `PastilleCoin` d'« Évènements » : mode avion,
 * saut de date) : coche mousse et mot en JetBrains Mono. Il arrive en ressort à l'image `a` ;
 * `sortie` (facultative) : image où il s'efface (P9, avant que le téléphone tourne).
 */
export const TamponGratuit: React.FC<{ a?: number; sortie?: number }> = ({ a = 24, sortie }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entree = spring({ frame: f - a, fps, config: { damping: 12 } });
  const efface = sortie === undefined ? 0 : interpolate(f, [sortie, sortie + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <PastilleCoin echelle={entree * (1 - efface)}>
      <IoCheckmarkCircle size={62} color={S.moss} />
      <div style={{ marginTop: 4, fontFamily: P.mono, fontWeight: 500, fontSize: 21, letterSpacing: 1.6, color: S.moss }}>{CARTONS.gratuit}</div>
    </PastilleCoin>
  );
};

/** Géométrie de la barre de l'app (`(tabs)/_layout.tsx`) : `left/right/bottom` 14, hauteur 60 + 34. */
const BARRE = { marge: 14, hauteur: 94, haut: 8 };

/**
 * Barre d'onglets d'un dirigeant d'assemblée qui a la Vie d'assemblée, les Évènements et Member
 * Care : Accueil, Objectifs, Assemblée, Évènements, Brebis (`heart-outline`), Profil. Posée PAR-DESSUS
 * la barre à cinq onglets des écrans repris (`BarreOnglets` d'« Évènements », qui ne connaît pas
 * « Brebis ») : même géométrie, fond opaque pour la recouvrir entièrement.
 */
export const ONGLETS6 = { accueil: 0, objectifs: 1, assemblee: 2, evenements: 3, brebis: 4, profil: 5 } as const;

export const centreOnglet6 = (i: number) => {
  const largeur = (390 - 2 * BARRE.marge) / APP.onglets.length;
  return { x: BARRE.marge + largeur * (i + 0.5), y: 844 - BARRE.marge - BARRE.hauteur + BARRE.haut + 18 };
};

export const BarreOnglets6: React.FC<{ actif: number; halo?: { onglet: number; intensite: number } }> = ({ actif, halo }) => {
  const icones = [IoHomeOutline, IoFlagOutline, IoBookOutline, IoMegaphoneOutline, IoHeartOutline, IoPersonOutline];
  return (
    <div
      style={{
        position: 'absolute',
        left: BARRE.marge,
        right: BARRE.marge,
        bottom: BARRE.marge,
        height: BARRE.hauteur,
        borderRadius: 24,
        border: '1px solid rgba(42,38,32,0.08)',
        background: S.paper,
        boxShadow: '0 8px 24px rgba(42,38,32,0.08)',
        display: 'flex',
        padding: `${BARRE.haut}px 0 38px`,
        boxSizing: 'border-box',
      }}
    >
      {APP.onglets.map((nom, i) => {
        const Icone = icones[i];
        const couleur = i === actif ? S.moss : S.ink3;
        const intensite = halo && halo.onglet === i ? halo.intensite : 0;
        return (
          <div key={nom} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Halo intensite={intensite} rayon={10} marge={2} margeY={4} etalement={3}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Icone size={23} color={couleur} />
                <div style={{ fontFamily: P.sans, fontSize: 9.5, fontWeight: 600, letterSpacing: -0.2, color: couleur, whiteSpace: 'nowrap' }}>{nom}</div>
              </div>
            </Halo>
          </div>
        );
      })}
    </div>
  );
};
