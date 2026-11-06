import React from 'react';
import { P, S } from '../../evenements/theme';
import { useEtude } from '../langue';

/**
 * Le livre « Disciple coûte que coûte » et les livrets de l'étudiant, dessinés (aplats de la palette,
 * titre Fraunces) — pas les couvertures de l'éditeur (storyboard § 7.4). Pixels vidéo.
 */

const KRAFT = `linear-gradient(135deg, ${S.earth} 0%, #BE8A60 60%, ${S.earthDeep} 100%)`;

/** Couverture du livre : aplat mousse, filet terre, titre blanc cassé. */
export const CouvertureLivre: React.FC<{ largeur: number; hauteur: number; style?: React.CSSProperties }> = ({ largeur, hauteur, style }) => {
  const { cartons } = useEtude();
  return (
  <div
    style={{
      width: largeur,
      height: hauteur,
      boxSizing: 'border-box',
      borderRadius: Math.max(3, largeur * 0.03),
      background: S.moss,
      boxShadow: `inset ${largeur * 0.05}px 0 0 rgba(0,0,0,0.18), 0 ${hauteur * 0.06}px ${hauteur * 0.12}px rgba(42,38,32,0.22)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `0 ${largeur * 0.12}px`,
      ...style,
    }}
  >
    <div style={{ width: '60%', height: Math.max(1, hauteur * 0.012), background: S.earth, marginBottom: hauteur * 0.06 }} />
    <div style={{ fontFamily: P.serif, fontWeight: 500, fontSize: largeur * 0.15, lineHeight: 1.12, color: S.white, textAlign: 'center' }}>{cartons.livre}</div>
  </div>
  );
};

/** Livret de l'étudiant fermé : couverture kraft, étiquette « Livret de l'étudiant · UEMB002 ». */
export const LivretFerme: React.FC<{ largeur: number; style?: React.CSSProperties }> = ({ largeur, style }) => {
  const { cartons } = useEtude();
  const hauteur = largeur * 1.38;
  return (
    <div
      style={{
        width: largeur,
        height: hauteur,
        borderRadius: largeur * 0.05,
        background: KRAFT,
        boxShadow: `inset ${largeur * 0.06}px 0 0 rgba(42,38,32,0.16), 0 6px 14px rgba(42,38,32,0.18)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <div
        style={{
          width: '72%',
          padding: `${largeur * 0.06}px 0`,
          borderRadius: largeur * 0.03,
          background: S.paper2,
          textAlign: 'center',
          fontFamily: P.serif,
          fontStyle: 'italic',
          color: S.ink2,
          fontSize: largeur * 0.1,
          lineHeight: 1.2,
        }}
      >
        {cartons.livret[0]}
        <div style={{ fontFamily: P.mono, fontStyle: 'normal', fontSize: largeur * 0.085, letterSpacing: 1, marginTop: largeur * 0.03, color: S.earthDeep }}>
          {cartons.livret[1]}
        </div>
      </div>
    </div>
  );
};

/** Lignes de texte en aplats `hair` (page imprimée vue de loin). */
const LignesTexte: React.FC<{ n: number; largeur: number; haut: number; interligne: number; retrait?: number }> = ({ n, largeur, haut, interligne, retrait = 0 }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: retrait,
          top: haut + i * interligne,
          width: largeur * (i % 5 === 4 ? 0.55 : 0.92 - ((i * 37) % 9) / 100),
          height: interligne * 0.32,
          borderRadius: 2,
          background: S.hairStrong,
        }}
      />
    ))}
  </>
);

/**
 * Livre ouvert, double page : « Préface » à gauche, « Chapitre 1 » à droite (P3, P6).
 * `lecture` (0 → 1) : ligne de lecture surlignée (terre à 30 %) qui descend la page de droite.
 * `fermeture` (0 → 1) : la page de droite se rabat sur la gauche ; son verso est la couverture.
 * `surPageDroite` : ce qui est posé sur la page de droite (la feuille volante de P3).
 */
export const LivreOuvert: React.FC<{
  largeur: number;
  lecture?: number | null;
  fermeture?: number;
  surPageDroite?: React.ReactNode;
  titres?: boolean;
}> = ({ largeur, lecture = null, fermeture = 0, surPageDroite, titres = true }) => {
  const { cartons } = useEtude();
  const page = largeur / 2;
  const hauteur = largeur * 0.66;
  const marge = page * 0.12;
  const interligne = hauteur * 0.062;
  const haut = hauteur * 0.24;
  const n = 11;
  const titre = (t: string) =>
    titres ? (
      <div style={{ position: 'absolute', left: marge, top: hauteur * 0.08, fontFamily: P.serif, fontWeight: 600, fontSize: page * 0.09, color: S.ink }}>{t}</div>
    ) : null;
  return (
    <div style={{ position: 'relative', width: largeur, height: hauteur, perspective: largeur * 3 }}>
      {/* Ombre portée et tranche de la couverture sous les pages. */}
      <div style={{ position: 'absolute', left: -8, top: -8, bottom: -8, width: largeur + 16 - page * fermeture, borderRadius: 14, background: S.mossDeep, boxShadow: '0 30px 60px rgba(42,38,32,0.25)' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: page, height: hauteur, background: S.paper2, borderRadius: '8px 2px 2px 8px', overflow: 'hidden', boxShadow: `inset -${page * 0.08}px 0 ${page * 0.08}px -${page * 0.05}px rgba(42,38,32,0.22)` }}>
        {titre(cartons.pagesLivre[0])}
        <LignesTexte n={n} largeur={page - 2 * marge} haut={haut} interligne={interligne} retrait={marge} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: page,
          top: 0,
          width: page,
          height: hauteur,
          transformOrigin: '0 50%',
          transform: `rotateY(${-180 * fermeture}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: S.paper2, borderRadius: '2px 8px 8px 2px', overflow: 'hidden', backfaceVisibility: 'hidden', boxShadow: `inset ${page * 0.08}px 0 ${page * 0.08}px -${page * 0.05}px rgba(42,38,32,0.22)` }}>
          {titre(cartons.pagesLivre[1])}
          {lecture != null ? (
            <div
              style={{
                position: 'absolute',
                left: marge * 0.6,
                right: marge * 0.6,
                top: haut - interligne * 0.32 + Math.min(n - 1, Math.floor(lecture * n)) * interligne,
                height: interligne * 0.95,
                borderRadius: 4,
                background: 'rgba(201,149,107,0.30)',
              }}
            />
          ) : null}
          <LignesTexte n={n} largeur={page - 2 * marge} haut={haut} interligne={interligne} retrait={marge} />
          {surPageDroite}
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <CouvertureLivre largeur={page} hauteur={hauteur} />
        </div>
      </div>
    </div>
  );
};

/** Livret ouvert vu de loin (P6, autour du livre) : deux pages, la leçon en tête. */
export const LivretOuvert: React.FC<{ largeur: number; style?: React.CSSProperties }> = ({ largeur, style }) => {
  const { cartons } = useEtude();
  const hauteur = largeur * 0.7;
  return (
    <div style={{ position: 'relative', width: largeur, height: hauteur, ...style }}>
      <div style={{ position: 'absolute', inset: -5, borderRadius: 8, background: KRAFT, boxShadow: '0 10px 20px rgba(42,38,32,0.2)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 2 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ position: 'relative', flex: 1, background: S.paper2, borderRadius: i === 0 ? '5px 1px 1px 5px' : '1px 5px 5px 1px', overflow: 'hidden' }}>
            {i === 0 ? (
              <div style={{ position: 'absolute', left: '10%', right: '6%', top: '9%', fontFamily: P.serif, fontWeight: 600, fontSize: largeur * 0.052, lineHeight: 1.15, color: S.ink }}>
                {cartons.leconLivret}
              </div>
            ) : null}
            <LignesTexte n={6} largeur={largeur * 0.4} haut={hauteur * (i === 0 ? 0.42 : 0.14)} interligne={hauteur * 0.11} retrait={largeur * 0.05} />
          </div>
        ))}
      </div>
    </div>
  );
};
