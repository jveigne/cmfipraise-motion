import React from 'react';
import { AbsoluteFill } from 'remotion';
import { P, S } from '../../evenements/theme';
import { PetitCahier, Silhouette } from '../../journal/ui/Illustrations';
import { useEtude } from '../langue';
import { CouvertureLivre, LivretFerme } from './Livre';

/**
 * Le salon de Samuel, un dimanche en journée (storyboard § 2, JP 21/10 : les réunions ont lieu le
 * dimanche, il fait jour) : un canapé et deux fauteuils (`parchmentDeep`, contours `ink3`), une table
 * basse, une lampe éteinte, une fenêtre de jour (ciel clair, soleil, un arbre) dont la lumière se pose
 * en biais sur le sol ; sur la table, le livre et la pile de livrets. Treize silhouettes assises en
 * arc (gabarit `Silhouette` de « Journal »), dont Hélène, l'aînée, dans le fauteuil (cheveux blancs,
 * canne) ; Samuel debout près de la lampe, le livre à la main. Pixels vidéo, cadre entier
 * (1080 × 1920). Revient flouté sous les téléphones (`SalonFlou`).
 */

/** Une place : centre et haut de la silhouette, taille, étiquette éventuelle, teinte. */
interface Place {
  x: number;
  y: number;
  nom?: NomPersonne;
}

export type NomPersonne = 'samuel' | 'marie' | 'jean' | 'esther' | 'paul' | 'helene';

/** Les treize présents assis (Rose Eyenga est absente), dans l'ordre où ils s'assoient. */
export const PLACES: readonly Place[] = [
  { x: 170, y: 1000, nom: 'helene' },
  { x: 350, y: 975, nom: 'esther' },
  { x: 470, y: 975, nom: 'marie' },
  { x: 590, y: 975, nom: 'jean' },
  { x: 710, y: 975 },
  { x: 125, y: 1250 },
  { x: 290, y: 1320, nom: 'paul' },
  { x: 790, y: 1320 },
  { x: 950, y: 1400 },
  { x: 290, y: 1520 },
  { x: 790, y: 1520 },
  { x: 540, y: 1580 },
  { x: 130, y: 1470 },
];
/** Les places des chaises et des poufs (les autres sont sur le canapé et le fauteuil). */
const PREMIERE_CHAISE = 5;
const TAILLE = 0.42;

/** Samuel, debout près de la lampe. */
export const SAMUEL = { x: 905, y: 820, taille: 0.6 } as const;

/** Centre (pixels) d'une personne nommée : sert aux travellings. */
export const centrePersonne = (nom: NomPersonne) => {
  if (nom === 'samuel') return { x: SAMUEL.x, y: SAMUEL.y + 120 };
  const p = PLACES.find((q) => q.nom === nom)!;
  return { x: p.x, y: p.y + 70 };
};

const TABLE = { x: 540, y: 1420, l: 420, h: 96 };

/** Petit téléphone tenu en main (P11) : écran clair qui s'allume. */
const PetitTelephone: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ position: 'absolute', left: 64, top: 92, width: 30, height: 52, borderRadius: 7, background: '#1B1F24', transform: 'rotate(8deg)', boxShadow: '0 4px 10px rgba(18,23,28,0.3)' }}>
    <div style={{ position: 'absolute', inset: 3, borderRadius: 4, background: S.paper2, opacity: 0.25 + 0.75 * p, boxShadow: p > 0.5 ? '0 0 14px rgba(251,245,230,0.9)' : undefined }} />
  </div>
);

const Etiquette: React.FC<{ texte: string; x: number; y: number; p: number }> = ({ texte, x, y, p }) =>
  p <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, 0) scale(${p})`,
        opacity: Math.min(1, p * 1.5),
        padding: '8px 16px',
        borderRadius: 16,
        background: S.paper,
        border: '1px solid rgba(42,38,32,0.08)',
        boxShadow: '0 10px 22px rgba(42,38,32,0.16)',
        fontFamily: P.sans,
        fontWeight: 600,
        fontSize: 28,
        color: S.ink,
        whiteSpace: 'nowrap',
      }}
    >
      {texte}
    </div>
  );

export const Salon: React.FC<{
  /** Apparition du décor (0 → 1). */
  pose?: number;
  /** Assise de chaque présent (0 → 1, ressort) : `(i) => p`. */
  assis?: (i: number) => number;
  /** Étiquettes (0 → 1) par nom. */
  etiquettes?: Partial<Record<NomPersonne, number>>;
  /** Cahiers sortis (0 → 1) et trait d'écriture (0 → 1). */
  cahiers?: number;
  ecriture?: number;
  /** Samuel visible (0 → 1). */
  samuel?: number;
  /** P11 : téléphones en main, écrans allumés (0 → 1), sauf Paul (livret) et Hélène (cahier). */
  telephones?: number;
}> = ({ pose = 1, assis = () => 1, etiquettes = {}, cahiers = 0, ecriture = 0, samuel = 1, telephones = 0 }) => {
  const { cartons } = useEtude();
  return (
  <AbsoluteFill style={{ opacity: pose, transform: `translateY(${(1 - pose) * 60}px)` }}>
    {/* La pièce : mur, plinthe, sol. */}
    <div style={{ position: 'absolute', left: 40, right: 40, top: 470, bottom: 90, borderRadius: 40, overflow: 'hidden', background: S.paper, boxShadow: '0 30px 70px rgba(42,38,32,0.10)' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 790, bottom: 0, background: `linear-gradient(180deg, ${S.parchment}, ${S.parchmentDeep})` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 782, height: 10, background: S.parchmentDeep }} />
    </div>

    {/* Fenêtre de jour : ciel clair, soleil, un arbre ; la lumière se pose en biais sur le sol. */}
    <div style={{ position: 'absolute', left: 110, top: 560, width: 250, height: 280, borderRadius: 10, background: `linear-gradient(180deg, #DCE6E0 0%, ${S.paper2} 100%)`, border: `10px solid ${S.paper2}`, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 140, top: 26, width: 56, height: 56, borderRadius: 28, background: S.earth, opacity: 0.55, boxShadow: '0 0 40px rgba(201,149,107,0.6)' }} />
      <div style={{ position: 'absolute', left: -20, top: 150, width: 150, height: 150, borderRadius: '50%', background: S.sauge, opacity: 0.55 }} />
      <div style={{ position: 'absolute', left: 50, top: 210, width: 12, height: 80, background: S.earthDeep, opacity: 0.5 }} />
      <div style={{ position: 'absolute', left: 110, top: 0, bottom: 0, width: 10, background: S.paper2 }} />
      <div style={{ position: 'absolute', top: 120, left: 0, right: 0, height: 10, background: S.paper2 }} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        top: 1260,
        height: 520,
        background: 'linear-gradient(100deg, rgba(251,245,230,0) 0%, rgba(251,245,230,0.55) 18%, rgba(251,245,230,0.55) 42%, rgba(251,245,230,0) 60%)',
        clipPath: 'polygon(6% 0, 34% 0, 62% 100%, 18% 100%)',
      }}
    />

    {/* Lampe sur pied, éteinte : il fait jour. */}
    <div style={{ position: 'absolute', left: 986, top: 640, width: 8, height: 620, background: S.ink3 }} />
    <div style={{ position: 'absolute', left: 950, top: 1250, width: 80, height: 14, borderRadius: 7, background: S.ink3 }} />
    <div
      style={{
        position: 'absolute',
        left: 925,
        top: 560,
        width: 130,
        height: 90,
        background: S.parchmentDeep,
        clipPath: 'polygon(22% 0, 78% 0, 100% 100%, 0 100%)',
      }}
    />

    {/* Dossiers du canapé et des fauteuils (derrière les personnes). */}
    <div style={{ position: 'absolute', left: 270, top: 1040, width: 540, height: 150, borderRadius: '40px 40px 12px 12px', background: S.parchmentDeep, border: `4px solid ${S.ink3}`, boxSizing: 'border-box' }} />
    <div style={{ position: 'absolute', left: 80, top: 1070, width: 180, height: 140, borderRadius: '40px 40px 12px 12px', background: S.parchmentDeep, border: `4px solid ${S.ink3}`, boxSizing: 'border-box' }} />

    {/* Les présents assis. */}
    {PLACES.map((p, i) => {
      const a = assis(i);
      if (a <= 0.001) return null;
      // Hélène ne passe en mousse (personne suivie) qu'en P11, où elle est présentée.
      const teinte = p.nom && (p.nom !== 'helene' || telephones > 0) ? S.mossSoft : S.ink3;
      const papier = p.nom === 'paul' || p.nom === 'helene';
      return (
        <div key={i} style={{ position: 'absolute', inset: 0, opacity: Math.min(1, a * 2), transform: `translateY(${(1 - a) * 40}px)` }}>
          {p.nom === 'helene' ? <Canne x={p.x + 58} y={p.y + 40} /> : null}
          <Silhouette x={p.x} y={p.y} teinte={teinte} taille={TAILLE}>
            {p.nom === 'helene' ? <CheveuxBlancs taille={TAILLE} /> : null}
            {/* Livret ouvert sur les genoux, puis le cahier où l'on écrit ; en P11, le téléphone. */}
            <LivretFerme largeur={34} style={{ position: 'absolute', left: 14, top: 104, transform: 'rotate(-6deg)' }} />
            {telephones > 0.001 && !papier ? <PetitTelephone p={telephones} /> : null}
            {cahiers > 0.001 || (telephones > 0.001 && papier) ? (
              <div style={{ position: 'absolute', left: 46, top: 96 + (1 - Math.max(cahiers, telephones)) * 20, opacity: Math.max(cahiers, telephones) }}>
                <PetitCahier largeur={42} hauteur={32} couleur={S.paper2} />
                <div style={{ position: 'absolute', left: 6, top: 10, width: 30 * ecriture, height: 3, borderRadius: 2, background: S.ink2 }} />
                <div style={{ position: 'absolute', left: 6, top: 18, width: 22 * Math.max(0, ecriture * 2 - 1), height: 3, borderRadius: 2, background: S.ink2 }} />
              </div>
            ) : null}
          </Silhouette>
          {/* Chaise ou pouf, devant le bas du buste. */}
          {i >= PREMIERE_CHAISE ? (
            <div
              style={{
                position: 'absolute',
                left: p.x - 64,
                top: p.y + 122,
                width: 128,
                height: 44,
                borderRadius: i >= 9 ? 22 : 10,
                background: i >= 9 ? S.earth : S.parchmentDeep,
                border: `4px solid ${S.ink3}`,
                boxSizing: 'border-box',
              }}
            />
          ) : null}
        </div>
      );
    })}

    {/* Assise du canapé (devant les personnes). */}
    <div style={{ position: 'absolute', left: 260, top: 1150, width: 560, height: 70, borderRadius: 18, background: S.parchmentDeep, border: `4px solid ${S.ink3}`, boxSizing: 'border-box' }} />
    <div style={{ position: 'absolute', left: 70, top: 1170, width: 200, height: 64, borderRadius: 18, background: S.parchmentDeep, border: `4px solid ${S.ink3}`, boxSizing: 'border-box' }} />

    {/* Table basse, le livre et la pile de livrets. */}
    <div style={{ position: 'absolute', left: TABLE.x - TABLE.l / 2, top: TABLE.y - TABLE.h / 2, width: TABLE.l, height: TABLE.h, borderRadius: '50%', background: S.earthDeep, boxShadow: 'inset 0 -14px 0 rgba(42,38,32,0.18), 0 18px 30px rgba(42,38,32,0.18)' }} />
    <CouvertureLivre largeur={70} hauteur={96} style={{ position: 'absolute', left: TABLE.x - 110, top: TABLE.y - 70, transform: 'rotate(-8deg)' }} />
    {[0, 1, 2].map((k) => (
      <LivretFerme key={k} largeur={60} style={{ position: 'absolute', left: TABLE.x + 30 + k * 4, top: TABLE.y - 80 - k * 6, transform: `rotate(${6 - k * 4}deg)` }} />
    ))}

    {/* Samuel, debout près de la lampe, le livre à la main. */}
    {samuel > 0.001 ? (
      <div style={{ position: 'absolute', inset: 0, opacity: samuel }}>
        <div style={{ position: 'absolute', left: SAMUEL.x - 44, top: SAMUEL.y + 190, width: 88, height: 250, borderRadius: '0 0 14px 14px', background: S.mossDeep }} />
        <Silhouette x={SAMUEL.x} y={SAMUEL.y} teinte={S.moss} taille={SAMUEL.taille}>
          <CouvertureLivre largeur={54} hauteur={74} style={{ position: 'absolute', left: 6, top: 120, transform: 'rotate(10deg)' }} />
        </Silhouette>
      </div>
    ) : null}

    {/* Étiquettes des cinq personnages. */}
    <Etiquette texte={cartons.etiquettes.samuel} x={SAMUEL.x - 60} y={SAMUEL.y - 72} p={etiquettes.samuel ?? 0} />
    {PLACES.filter((p) => p.nom).map((p) => (
      <Etiquette key={p.nom} texte={cartons.etiquettes[p.nom!]} x={p.x} y={p.y + 150} p={etiquettes[p.nom!] ?? 0} />
    ))}
  </AbsoluteFill>
  );
};

/** Cheveux blancs d'Hélène, en chignon (posés sur la tête de la silhouette). */
export const CheveuxBlancs: React.FC<{ taille: number }> = ({ taille }) => (
  <>
    <div style={{ position: 'absolute', left: 66 * taille, top: -6 * taille, width: 108 * taille, height: 58 * taille, borderRadius: `${54 * taille}px ${54 * taille}px ${14 * taille}px ${14 * taille}px`, background: S.white, border: `${3 * taille}px solid ${S.parchmentDeep}`, boxSizing: 'border-box' }} />
    <div style={{ position: 'absolute', left: 98 * taille, top: -36 * taille, width: 44 * taille, height: 40 * taille, borderRadius: '50%', background: S.white, border: `${3 * taille}px solid ${S.parchmentDeep}`, boxSizing: 'border-box' }} />
  </>
);

/** La canne d'Hélène, appuyée contre le fauteuil. */
export const Canne: React.FC<{ x: number; y: number; echelle?: number }> = ({ x, y, echelle = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 10 * echelle, height: 150 * echelle, borderRadius: 5 * echelle, background: S.earthDeep, transform: 'rotate(-10deg)', transformOrigin: '50% 100%' }}>
    <div style={{ position: 'absolute', left: -18 * echelle, top: -6 * echelle, width: 30 * echelle, height: 14 * echelle, borderRadius: `${10 * echelle}px ${10 * echelle}px 0 0`, border: `${8 * echelle}px solid ${S.earthDeep}`, borderBottom: 'none', boxSizing: 'border-box' }} />
  </div>
);

/** Le salon en fond, flouté et assombri, sous les téléphones (P8, P14, P15) : la même pièce, le même dimanche. */
export const SalonFlou: React.FC<{ opacite?: number }> = ({ opacite = 1 }) => (
  <AbsoluteFill style={{ opacity: opacite, filter: 'blur(14px) saturate(0.9)' }}>
    <Salon />
    <AbsoluteFill style={{ background: 'rgba(42,38,32,0.18)' }} />
  </AbsoluteFill>
);
