import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { IoArrowBack, IoArrowForward, IoLockClosed, IoRefresh } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { WEB } from '../textes';

/**
 * Fenêtre de navigateur (annotation vidéo, sans marque) qui montre l'espace web Shephr. La page
 * est dessinée en pixels CSS dans une vue de `VUE.largeur` px (600 : mise en page « étroite » du
 * web, `@media (max-width: 900px)` de styles.css — barre `.mobile-topbar`, menu en tiroir), mise à
 * l'échelle `K` dans la vidéo (1,6 : la taille du texte des téléphones des autres vidéos).
 */
export const FENETRE = { x: 60, y: 452, largeur: 960, hauteur: 1388, chrome: 92 } as const;
export const K = 1.6;
export const VUE = { largeur: FENETRE.largeur / K, hauteur: (FENETRE.hauteur - FENETRE.chrome) / K } as const;

/** Point de la page (px CSS) → pixels vidéo, fenêtre au repos. */
export const versVideoWeb = (x: number, y: number) => ({ x: FENETRE.x + x * K, y: FENETRE.y + FENETRE.chrome + y * K });

const Chrome: React.FC<{ chemin: string }> = ({ chemin }) => (
  <div style={{ height: FENETRE.chrome, background: S.paper, borderBottom: `2px solid ${S.hair}`, boxSizing: 'border-box' }}>
    {/* Rangée de l'onglet. */}
    <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', padding: '0 22px', gap: 22 }}>
      <div style={{ display: 'flex', gap: 10, alignSelf: 'center', marginTop: 6 }}>
        {[S.clay, S.earth, S.sauge].map((c) => (
          <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c, opacity: 0.8 }} />
        ))}
      </div>
      <div
        style={{
          height: 36,
          padding: '0 22px',
          borderRadius: '14px 14px 0 0',
          background: S.paper2,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: P.sans,
          fontSize: 19,
          color: S.ink2,
        }}
      >
        <Img src={staticFile('shephr/logo.png')} style={{ width: 22, height: 22 }} />
        {WEB.ongletNavigateur}
      </div>
    </div>
    {/* Barre d'adresse. */}
    <div style={{ height: 46, background: S.paper2, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px' }}>
      <IoArrowBack size={22} color={S.ink3} />
      <IoArrowForward size={22} color={S.ink3} style={{ opacity: 0.5 }} />
      <IoRefresh size={21} color={S.ink3} />
      <div
        style={{
          flex: 1,
          height: 34,
          borderRadius: 17,
          background: S.paper,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 18px',
          fontFamily: P.sans,
          fontSize: 19,
          color: S.ink3,
        }}
      >
        <IoLockClosed size={16} color={S.ink3} />
        <span style={{ color: S.ink }}>{WEB.domaine}</span>
        <span>{chemin}</span>
      </div>
    </div>
  </div>
);

/** La fenêtre et sa page (`children`, en px CSS dans une vue de 600 × `VUE.hauteur`) ; `chemin` de
 * la barre d'adresse, `/study/city` par défaut (P4 montre d'abord la page d'origine). */
export const Navigateur: React.FC<{ fond?: string; chemin?: string; children: React.ReactNode }> = ({ fond = '#E8DCC4', chemin = WEB.chemin, children }) => (
  <div
    style={{
      position: 'absolute',
      left: FENETRE.x,
      top: FENETRE.y,
      width: FENETRE.largeur,
      height: FENETRE.hauteur,
      borderRadius: 26,
      overflow: 'hidden',
      background: fond,
      boxShadow: '0 40px 90px rgba(18,23,28,0.22), 0 0 0 2px rgba(42,38,32,0.10)',
    }}
  >
    <Chrome chemin={chemin} />
    <div style={{ position: 'relative', width: FENETRE.largeur, height: FENETRE.hauteur - FENETRE.chrome, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: VUE.largeur, height: VUE.hauteur, transform: `scale(${K})`, transformOrigin: '0 0' }}>
        {children}
      </div>
    </div>
  </div>
);

/**
 * Caméra sur la fenêtre (gabarit du `Plateau`) : `zoom` autour de `foyer` (px CSS de la page),
 * `decalageY` (montée depuis le bas), `dessus` : calques posés au-dessus dans le repère vidéo
 * (curseur, halos), qui suivent le zoom.
 */
export const CameraWeb: React.FC<{
  zoom?: number;
  foyer?: { x: number; y: number };
  decalageY?: number;
  opacite?: number;
  dessus?: React.ReactNode;
  children: React.ReactNode;
}> = ({ zoom = 1, foyer = { x: VUE.largeur / 2, y: VUE.hauteur / 2 }, decalageY = 0, opacite = 1, dessus, children }) => {
  const f = versVideoWeb(foyer.x, foyer.y);
  if (opacite <= 0.001) return null;
  return (
    <AbsoluteFill style={{ transform: `translateY(${decalageY}px) scale(${zoom})`, transformOrigin: `${f.x}px ${f.y}px`, opacity: opacite }}>
      {children}
      {dessus}
    </AbsoluteFill>
  );
};

/**
 * Pointeur de souris (la page web se pilote à la souris, pas au doigt) : flèche, et une onde au
 * clic (`clic` : image du clic, locale au plan). Position en px CSS de la page.
 */
export const Curseur: React.FC<{ x: number; y: number; clic?: number; opacite?: number }> = ({ x, y, clic, opacite = 1 }) => {
  const f = useCurrentFrame();
  const v = versVideoWeb(x, y);
  const onde = clic === undefined ? 0 : interpolate(f, [clic, clic + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const visibleOnde = clic !== undefined && f >= clic && f <= clic + 16;
  const presse = clic !== undefined && f >= clic - 2 && f <= clic + 4 ? 0.88 : 1;
  if (opacite <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: opacite, pointerEvents: 'none' }}>
      {visibleOnde ? (
        <div
          style={{
            position: 'absolute',
            left: v.x - 50 * onde,
            top: v.y - 50 * onde,
            width: 100 * onde,
            height: 100 * onde,
            borderRadius: '50%',
            border: `4px solid rgba(30,58,47,${0.7 * (1 - onde)})`,
            background: `rgba(30,58,47,${0.12 * (1 - onde)})`,
          }}
        />
      ) : null}
      <svg
        width={46}
        height={62}
        viewBox="0 0 23 31"
        style={{ position: 'absolute', left: v.x - 3, top: v.y - 2, transform: `scale(${presse})`, transformOrigin: '3px 2px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))' }}
      >
        <path d="M2 1 L2 25 L8 19.5 L12 29 L16 27.4 L12 18 L20 18 Z" fill={S.ink} stroke={S.paper2} strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Position du curseur interpolée entre des points (px CSS) aux images données, adoucie. */
export const trajet = (f: number, images: number[], points: { x: number; y: number }[]) => {
  const opts = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) };
  return {
    x: interpolate(f, images, points.map((p) => p.x), opts),
    y: interpolate(f, images, points.map((p) => p.y), opts),
  };
};
