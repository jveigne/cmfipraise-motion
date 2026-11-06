import React from 'react';
import { P, S } from '../../evenements/theme';

/**
 * Illustrations de la partie « Le cahier » (P1–P5) et annotations vidéo (classeurs de P15) :
 * objets plats aux couleurs de la palette Shephr. Tout est en pixels vidéo. L'écriture « à la main »
 * est en Fraunces italique 400 (police déjà chargée : pas de nouvelle dépendance).
 */

/** Dimensions d'une page du cahier (pixels vidéo). */
export const PAGE_CAHIER = { largeur: 480, hauteur: 640, interligne: 62, hautLignes: 132 } as const;

/** Couverture kraft, légèrement texturée. */
const KRAFT = `linear-gradient(135deg, ${S.earth} 0%, #BE8A60 60%, ${S.earthDeep} 100%)`;

/** Page lignée, avec marge rouge pâle et lignes d'écriture. */
export const PageLignee: React.FC<{
  lignes?: readonly string[];
  /** Nombre de lignes écrites (fractionnaire : la dernière se révèle de gauche à droite). */
  ecrites?: number;
  /** Encre qui bave (0 → 1) : flou et pâleur. */
  bavure?: number;
  taille?: number;
  children?: React.ReactNode;
}> = ({ lignes = [], ecrites = lignes.length, bavure = 0, taille = 30, children }) => {
  const { largeur, hauteur, interligne, hautLignes } = PAGE_CAHIER;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: largeur,
        height: hauteur,
        background: S.paper2,
        borderRadius: '4px 14px 14px 4px',
        overflow: 'hidden',
        boxShadow: 'inset 10px 0 18px -10px rgba(42,38,32,0.25)',
      }}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: hautLignes + i * interligne, height: 2, background: S.hair }} />
      ))}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 58, width: 2, background: 'rgba(184,106,74,0.28)' }} />
      {lignes.map((l, i) => {
        const p = Math.max(0, Math.min(1, ecrites - i));
        if (p <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 74,
              right: 18,
              top: hautLignes + i * interligne - taille * 1.05,
              fontFamily: P.serif,
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: i === 0 ? taille * 1.08 : taille,
              color: S.ink2,
              whiteSpace: 'nowrap',
              clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
              filter: bavure > 0 ? `blur(${4 * bavure}px)` : undefined,
              opacity: 1 - 0.65 * bavure,
            }}
          >
            {l}
          </div>
        );
      })}
      {children}
    </div>
  );
};

/**
 * Cahier vu de dessus : fermé, la couverture kraft porte une étiquette ; `ouverture` (0 → 1) fait
 * pivoter la couverture vers la gauche et recentre la double page. `vierge` : page sans écriture.
 */
export const Cahier: React.FC<{
  x: number;
  y: number;
  ouverture: number;
  etiquette?: readonly string[];
  lignes?: readonly string[];
  ecrites?: number;
  bavure?: number;
  echelle?: number;
  couleur?: string;
  children?: React.ReactNode;
}> = ({ x, y, ouverture, etiquette, lignes, ecrites, bavure, echelle = 1, couleur, children }) => {
  const { largeur, hauteur } = PAGE_CAHIER;
  const angle = -180 * ouverture;
  // Fermé, le cahier est centré sur `x` ; ouvert, c'est la double page qui l'est.
  const decalage = (largeur / 2) * ouverture;
  const fond = couleur ?? KRAFT;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - largeur / 2 + decalage,
        top: y - hauteur / 2,
        width: largeur,
        height: hauteur,
        transform: `scale(${echelle})`,
        transformOrigin: `${-decalage + largeur / 2}px 50%`,
        perspective: 2200,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, boxShadow: '0 30px 60px rgba(42,38,32,0.22)', borderRadius: '4px 14px 14px 4px' }} />
      <PageLignee lignes={lignes} ecrites={ecrites} bavure={bavure}>
        {children}
      </PageLignee>
      {/* Couverture : recto kraft (étiquette), verso uni. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '0 50%',
          transform: `rotateY(${angle}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: fond,
            borderRadius: '4px 14px 14px 4px',
            backfaceVisibility: 'hidden',
            boxShadow: 'inset 12px 0 0 rgba(42,38,32,0.18)',
          }}
        >
          {etiquette ? (
            <div
              style={{
                position: 'absolute',
                left: 60,
                right: 40,
                top: 150,
                padding: '26px 20px',
                borderRadius: 10,
                background: S.paper2,
                border: `2px solid ${S.hairStrong}`,
                textAlign: 'center',
                fontFamily: P.serif,
                fontStyle: 'italic',
                color: S.ink2,
              }}
            >
              <div style={{ fontSize: 40, lineHeight: '50px' }}>{etiquette[0]}</div>
              <div style={{ fontSize: 34, lineHeight: '44px', marginTop: 4 }}>{etiquette[1]}</div>
            </div>
          ) : null}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#D9C3A0',
            borderRadius: '14px 4px 4px 14px',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: 'inset -10px 0 18px -10px rgba(42,38,32,0.3)',
          }}
        />
      </div>
    </div>
  );
};

/** Silhouette simple : tête ronde + buste. `teinte` : couleur du buste ; étiquette dessous. */
export const Silhouette: React.FC<{
  x: number;
  y: number;
  teinte: string;
  etiquette?: string;
  taille?: number;
  opacite?: number;
  children?: React.ReactNode;
}> = ({ x, y, teinte, etiquette, taille = 1, opacite = 1, children }) => (
  <div style={{ position: 'absolute', left: x - 120 * taille, top: y, width: 240 * taille, opacity: opacite }}>
    <div style={{ position: 'relative', height: 340 * taille }}>
      <div
        style={{
          position: 'absolute',
          left: 70 * taille,
          top: 0,
          width: 100 * taille,
          height: 100 * taille,
          borderRadius: '50%',
          background: teinte,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 20 * taille,
          top: 116 * taille,
          width: 200 * taille,
          height: 224 * taille,
          borderRadius: `${100 * taille}px ${100 * taille}px ${24 * taille}px ${24 * taille}px`,
          background: teinte,
        }}
      />
      {children}
    </div>
    {etiquette ? (
      <div style={{ marginTop: 22, textAlign: 'center', fontFamily: P.sans, fontWeight: 600, fontSize: 30, color: S.ink2, whiteSpace: 'nowrap' }}>
        {etiquette}
      </div>
    ) : null}
  </div>
);

/** Petit cahier vu de face (pile de P4, sous le bras en P3) : couverture, dos, année. */
export const PetitCahier: React.FC<{ largeur: number; hauteur: number; couleur: string; annee?: string; style?: React.CSSProperties }> = ({
  largeur,
  hauteur,
  couleur,
  annee,
  style,
}) => (
  <div
    style={{
      width: largeur,
      height: hauteur,
      background: couleur,
      borderRadius: 8,
      boxShadow: '0 6px 14px rgba(42,38,32,0.18), inset 0 -6px 0 rgba(42,38,32,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: P.mono,
      fontWeight: 500,
      fontSize: Math.min(30, hauteur * 0.55),
      letterSpacing: 2,
      color: S.paper2,
      ...style,
    }}
  >
    {annee}
  </div>
);

/** Carton de déménagement : `fermeture` (0 → 1) rabat les deux volets. */
export const Carton: React.FC<{ x: number; y: number; fermeture: number; texte: string }> = ({ x, y, fermeture, texte }) => (
  <div style={{ position: 'absolute', left: x - 300, top: y, width: 600, height: 420 }}>
    {/* Volets, vus de face : ouverts, ils se dressent au-dessus du carton, inclinés vers
        l'extérieur ; en se fermant, ils se rabattent sur le dessus (ils disparaissent). */}
    {[0, 1].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: -170,
          left: i === 0 ? 0 : 300,
          width: 300,
          height: 170,
          background: '#B98A5E',
          borderRadius: '8px 8px 2px 2px',
          transformOrigin: i === 0 ? '0% 100%' : '100% 100%',
          transform: `rotate(${(i === 0 ? -1 : 1) * 22 * (1 - fermeture)}deg) scaleY(${Math.max(0.02, 1 - fermeture)})`,
          boxShadow: 'inset 0 0 0 2px rgba(42,38,32,0.10)',
        }}
      />
    ))}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, #C69A6E 0%, ${S.earth} 100%)`,
        borderRadius: 10,
        boxShadow: '0 30px 60px rgba(42,38,32,0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 280, width: 40, background: 'rgba(245,236,216,0.35)' }} />
      <div
        style={{
          fontFamily: P.mono,
          fontWeight: 500,
          fontSize: 44,
          letterSpacing: 4,
          color: S.earthDeep,
          border: `3px solid ${S.earthDeep}`,
          padding: '10px 22px',
          borderRadius: 8,
          background: 'rgba(251,245,230,0.7)',
          marginTop: 60,
        }}
      >
        {texte}
      </div>
    </div>
  </div>
);

/** Étiquette carte (P5) : texte Inter 600, « ? » en argile. */
export const Question: React.FC<{ texte: string; echelle: number; style?: React.CSSProperties }> = ({ texte, echelle, style }) => {
  const [avant, ...reste] = texte.split('?');
  return (
    <div
      style={{
        position: 'absolute',
        padding: '16px 26px',
        borderRadius: 16,
        background: S.paper,
        border: '1px solid rgba(42,38,32,0.08)',
        boxShadow: '0 14px 30px rgba(42,38,32,0.14)',
        fontFamily: P.sans,
        fontWeight: 600,
        fontSize: 34,
        color: S.ink,
        whiteSpace: 'nowrap',
        transform: `scale(${echelle})`,
        opacity: Math.min(1, echelle),
        ...style,
      }}
    >
      {avant}
      {reste.length > 0 ? <span style={{ color: S.clay }}>?</span> : null}
    </div>
  );
};

/** Bâtons de comptage au crayon, regroupés par cinq (le 5ᵉ barre les quatre). `n` : nombre tracé. */
export const Batons: React.FC<{ n: number; x: number; y: number }> = ({ n, x, y }) => (
  <svg style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }} width={10} height={10}>
    {Array.from({ length: Math.floor(n) }, (_, i) => {
      const groupe = Math.floor(i / 5);
      const k = i % 5;
      const gx = (groupe % 3) * 92;
      const gy = Math.floor(groupe / 3) * 74;
      return k < 4 ? (
        <line key={i} x1={gx + k * 16} y1={gy} x2={gx + k * 16 + 3} y2={gy + 50} stroke={S.ink3} strokeWidth={4} strokeLinecap="round" />
      ) : (
        <line key={i} x1={gx - 8} y1={gy + 38} x2={gx + 62} y2={gy + 10} stroke={S.ink3} strokeWidth={4} strokeLinecap="round" />
      );
    })}
  </svg>
);

/** Classeur rangé (P15) : dos mousse, étiquette d'année. */
export const Classeur: React.FC<{ annee: number; style?: React.CSSProperties; teinte?: string }> = ({ annee, style, teinte = S.moss }) => (
  <div
    style={{
      width: 50,
      height: 300,
      borderRadius: 6,
      background: teinte,
      boxShadow: '0 10px 22px rgba(42,38,32,0.2), inset -6px 0 0 rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 22,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    <div
      style={{
        width: 36,
        padding: '10px 0',
        borderRadius: 4,
        background: S.paper2,
        fontFamily: P.mono,
        fontWeight: 500,
        fontSize: 19,
        color: S.ink,
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        textAlign: 'center',
        letterSpacing: 2,
        lineHeight: '36px',
      }}
    >
      {annee}
    </div>
    <div style={{ marginTop: 'auto', marginBottom: 26, width: 18, height: 18, borderRadius: 9, border: `3px solid ${S.paper2}`, opacity: 0.6 }} />
  </div>
);
