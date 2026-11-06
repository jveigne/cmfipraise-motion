import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { P, S } from '../../evenements/theme';
import { CARTONS } from '../textes';

/**
 * Illustrations et habillage propres à « Offre Néhémie » : la muraille que l'on bâtit (le verset,
 * puis la ville faite de ses assemblées), une maison d'assemblée, l'intertitre (gabarit de
 * l'`Intertitre` d'« Étude », avec les textes de cette vidéo).
 */

// ---------------------------------------------------------------------------------------------
// La muraille

/** Teintes des pierres, prises dans la palette de l'app. */
const TEINTES = [S.parchmentDeep, S.earth, S.parchment, S.paper, S.earthDeep, S.parchmentDeep];

export interface Pierre {
  x: number;
  y: number;
  l: number;
  h: number;
  teinte: string;
  /** Ordre de pose (0 = la première). */
  ordre: number;
}

/** Appareil de pierres en quinconce : `rangs` rangées de hauteur `h`, du bas (`bas`) vers le haut. */
export const appareil = (rangs: number, bas: number, h = 92, largeur = 1080): Pierre[] => {
  const pierres: Pierre[] = [];
  let ordre = 0;
  for (let r = 0; r < rangs; r++) {
    const y = bas - (r + 1) * h;
    const decale = r % 2 === 0 ? 0 : -95;
    let x = decale - 20;
    let k = r * 3;
    while (x < largeur + 20) {
      const l = 170 + ((k * 37) % 4) * 22;
      pierres.push({ x, y, l, h, teinte: TEINTES[(k + r) % TEINTES.length], ordre: ordre++ });
      x += l;
      k++;
    }
  }
  return pierres;
};

/** Une pierre : posée en ressort depuis le haut à l'image `a`, ombre douce, joint clair. */
export const PierreVue: React.FC<{ p: Pierre; a: number; children?: React.ReactNode }> = ({ p, a, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - a, fps, config: { damping: 14, mass: 0.8 } });
  if (f < a) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: p.x + 4,
        top: p.y + 4 - (1 - s) * 160,
        width: p.l - 8,
        height: p.h - 8,
        borderRadius: 14,
        background: p.teinte,
        border: `2px solid ${S.hairStrong}`,
        boxShadow: 'inset 0 -8px 0 rgba(42,38,32,0.08), 0 8px 14px rgba(42,38,32,0.10)',
        opacity: Math.min(1, s * 1.4),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
};

/** La muraille du verset : les pierres se posent une à une de `debut` à `debut + duree`. */
export const Muraille: React.FC<{ debut: number; duree: number; rangs?: number; bas?: number; opacite?: number }> = ({
  debut,
  duree,
  rangs = 4,
  bas = 1920,
  opacite = 1,
}) => {
  const pierres = appareil(rangs, bas);
  const n = pierres.length;
  return (
    <AbsoluteFill style={{ opacity: opacite }}>
      {pierres.map((p) => (
        <PierreVue key={p.ordre} p={p} a={debut + Math.round((p.ordre / Math.max(1, n - 1)) * duree)} />
      ))}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Une maison d'assemblée (P3)

export const Maison: React.FC<{ x: number; y: number; nom: string; echelle?: number; teinte?: string }> = ({ x, y, nom, echelle = 1, teinte = S.mossSoft }) =>
  echelle <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${echelle})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={120} height={110} viewBox="0 0 120 110">
        <path d="M10 52 L60 10 L110 52" fill="none" stroke={teinte} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={24} y={48} width={72} height={56} rx={6} fill={teinte} />
        <rect x={50} y={70} width={20} height={34} rx={3} fill={S.paper2} />
      </svg>
      <div style={{ marginTop: 8, fontFamily: P.sans, fontWeight: 600, fontSize: 28, color: S.ink2, whiteSpace: 'nowrap' }}>{nom}</div>
    </div>
  );

// ---------------------------------------------------------------------------------------------
// Intertitre (gabarit d'« Étude » : 2,5 s, aplat de la couleur de la partie)

export const DUREE_INTERTITRE = 75;
export type PartieIntertitre = keyof typeof CARTONS.intertitres;

export const Intertitre: React.FC<{ partie: PartieIntertitre; couleur: string }> = ({ partie, couleur }) => {
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
        <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontWeight: 300, fontSize: 300, lineHeight: 1, color: 'rgba(201,149,107,0.6)', ...texte(6) }}>{t.numero}</div>
        <div
          style={{
            fontFamily: P.serif,
            fontWeight: 600,
            fontSize: t.titre.length > 16 ? 92 : 110,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: S.white,
            marginTop: 10,
            textAlign: 'center',
            ...texte(9),
          }}
        >
          {t.titre}
        </div>
        <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontWeight: 400, fontSize: 46, lineHeight: 1.25, color: S.parchment, marginTop: 34, textAlign: 'center', ...texte(14) }}>
          {t.phrase}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Glissement montant en fondu (titres des cartons). */
export const glisse = (f: number, fps: number, a: number) => {
  const p = spring({ frame: f - a, fps, config: { damping: 200 } });
  return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
};
