import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { CARTONS } from '../textes';
import { CHAPITRES, P, S } from '../theme';
import { versVideo } from '../../ui/Scene';

/**
 * Habillage de la vidéo « Évènements » (hors écrans de l'app) : fond, pastille de chapitre,
 * intertitres, logo Shephr, pastille posée sur le coin du téléphone.
 */

/** Fond `paper2` avec deux halos lents, mousse et terre (modèle de `src/ui/Fond.tsx`). */
export const FondShephr: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: S.paper2, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          left: -420 + Math.sin(f / 90) * 40,
          top: 900 + Math.cos(f / 110) * 40,
          background: 'radial-gradient(circle, rgba(30,58,47,0.10), rgba(30,58,47,0) 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          right: -380 + Math.cos(f / 100) * 40,
          top: -260 + Math.sin(f / 80) * 30,
          background: 'radial-gradient(circle, rgba(201,149,107,0.12), rgba(201,149,107,0) 70%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Pastille de chapitre en haut de l'image (« 1 · MEMBRE »…), visible tout le chapitre. */
export const PastilleChapitre: React.FC<{ chapitre: number; duree: number }> = ({ chapitre, duree }) => {
  const f = useCurrentFrame();
  const c = CHAPITRES[chapitre - 1];
  const opacite = interpolate(f, [0, 10, duree - 8, duree], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{ position: 'absolute', top: 56, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: opacite }}>
      <div
        style={{
          padding: '10px 26px',
          borderRadius: 99,
          background: c.couleur,
          color: S.white,
          fontFamily: P.mono,
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: 2.5,
        }}
      >
        {c.pastille}
      </div>
    </div>
  );
};

/** 2,5 s (retour JP 14/10, « ça avance trop rapidement ») : 1,8 s de lecture une fois les textes posés. */
export const DUREE_INTERTITRE = 75;

/**
 * Intertitre plein cadre : l'aplat de la couleur du chapitre monte du bas (i 0 → 10), les textes
 * arrivent (i 6 → 18), puis l'aplat repart vers le haut en découvrant le plan suivant (sur les
 * 10 dernières images, i 65 → 75).
 */
export const Intertitre: React.FC<{ chapitre: number }> = ({ chapitre }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = CHAPITRES[chapitre - 1];
  const entree = interpolate(f, [0, 10], [1920, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const sortie = interpolate(f, [DUREE_INTERTITRE - 10, DUREE_INTERTITRE], [0, -1920], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const texte = (a: number) => {
    const p = spring({ frame: f - a, fps, config: { damping: 200 }, durationInFrames: 12 });
    return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
  };
  return (
    <AbsoluteFill style={{ transform: `translateY(${entree + sortie}px)`, background: c.couleur }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
        <div
          style={{
            fontFamily: P.serif,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 300,
            lineHeight: 1,
            // `earth` à 60 % : l'opacité de l'élément sert déjà à son entrée.
            color: 'rgba(201,149,107,0.6)',
            ...texte(6),
          }}
        >
          {c.numero}
        </div>
        <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 110, letterSpacing: -2, color: S.white, marginTop: 10, ...texte(9) }}>
          {c.titre}
        </div>
        <div style={{ fontFamily: P.mono, fontSize: 28, letterSpacing: 3, color: 'rgba(232,220,196,0.7)', marginTop: 28, ...texte(13) }}>
          {CARTONS.chapitre(c.numero)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Icône Shephr présentée en tuile blanche arrondie. */
export const TuileLogo: React.FC<{ taille: number; echelle?: number }> = ({ taille, echelle = 1 }) => (
  <div
    style={{
      width: taille,
      height: taille,
      borderRadius: taille * 0.23,
      background: '#FFFFFF',
      boxShadow: '0 30px 70px rgba(30,58,47,0.22)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${echelle})`,
    }}
  >
    <Img src={staticFile('shephr/logo.png')} style={{ width: taille * 1.08, height: taille * 1.08 }} />
  </div>
);

/** Logotype « shephr » + point terre (`components/Wordmark.tsx`). */
export const Logotype: React.FC<{ taille: number; style?: React.CSSProperties }> = ({ taille, style }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', ...style }}>
    <div style={{ fontFamily: P.serif, fontWeight: 500, fontSize: taille, color: S.moss, letterSpacing: -taille * 0.025, lineHeight: 1 }}>
      shephr
    </div>
    <div
      style={{
        width: taille * 0.18,
        height: taille * 0.18,
        borderRadius: taille * 0.09,
        background: S.earth,
        marginLeft: taille * 0.12,
        marginBottom: taille * 0.12,
      }}
    />
  </div>
);

/**
 * Pastille ronde posée sur le coin du téléphone (gabarit du `Badge` de Plan6HorsLigne) :
 * « hors connexion » (P4), saut de date (P6).
 */
export const PastilleCoin: React.FC<{ echelle: number; children: React.ReactNode }> = ({ echelle, children }) => {
  // Décalée vers la droite et vers le haut, hors du téléphone en partie : elle ne recouvre pas
  // les icônes de la barre d'état (réseau, batterie, avion).
  const coin = { x: versVideo(372, 70).x + 70, y: versVideo(372, 70).y - 60 };
  if (echelle <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: coin.x - 80,
        top: coin.y - 80,
        width: 160,
        height: 160,
        borderRadius: 80,
        background: S.paper2,
        boxShadow: '0 18px 40px rgba(42,38,32,0.22)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${echelle})`,
      }}
    >
      {children}
    </div>
  );
};
