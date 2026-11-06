import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Logotype, TuileLogo } from '../../evenements/ui/Habillage';
import { PetitCahier } from '../../journal/ui/Illustrations';
import { useEtude } from '../langue';
import { TuileEtude } from '../ecrans/Accueil';
import { Poses, Ralenti, dureeRalentie } from './commun';

/**
 * Cartons sans téléphone (gabarits de « Documents ») : P5, la bascule « problème → l'app », sur la
 * montée du chant (24,0 s du fichier) ; P19, la fin, « Le Message de Bertoua, simplement. » (JP 21/10).
 */
/** P5 : la phrase tenue une demi-seconde de plus (retour JP du 21/10). */
const POSES_P5: Poses = [[90, 15]];
export const DUREE_P5 = dureeRalentie(135, POSES_P5);
/** P19 : phrase, tuile et logotype ; la musique s'éteint sur les 2,5 dernières secondes. */
export const DUREE_P19 = 180;

const glisse = (f: number, fps: number, a: number) => {
  const p = spring({ frame: f - a, fps, config: { damping: 200 } });
  return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
};

/** Centre de la tuile de la bascule (pixels vidéo) et son agrandissement (gabarit de P4 de « Documents »). */
const CENTRE = { x: 540, y: 1220 };
const GRAND = 2.6;

/** Une étiquette « ? » flottante (P4) et la feuille volante (P3), réduites. */
const Interro: React.FC = () => (
  <div style={{ padding: '12px 26px', borderRadius: 16, background: S.paper, boxShadow: '0 14px 30px rgba(42,38,32,0.14)', fontFamily: P.serif, fontWeight: 600, fontSize: 60, color: S.clay }}>?</div>
);
const Feuillet: React.FC = () => {
  const { cartons: CARTONS } = useEtude();
  return (
  <div style={{ width: 150, height: 200, borderRadius: 6, background: S.paper2, boxShadow: '0 14px 30px rgba(42,38,32,0.18)', padding: '30px 16px', boxSizing: 'border-box' }}>
    {CARTONS.feuille.map((l) => (
      <div key={l} style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 20, lineHeight: '34px', color: S.ink2, whiteSpace: 'nowrap' }}>
        {l}
      </div>
    ))}
  </div>
  );
};

/** Les objets du problème, épars autour du centre : cahiers, feuille volante, « ? ». */
const epars = (etiquette: string): { x: number; y: number; r: number; noeud: React.ReactNode }[] => [
  { x: 220, y: 700, r: -8, noeud: <PetitCahier largeur={200} hauteur={140} couleur={S.earth} annee={etiquette} /> },
  { x: 860, y: 820, r: 6, noeud: <PetitCahier largeur={190} hauteur={130} couleur={S.mossSoft} annee={etiquette} /> },
  { x: 200, y: 1620, r: 5, noeud: <Feuillet /> },
  { x: 880, y: 1660, r: -6, noeud: <PetitCahier largeur={200} hauteur={140} couleur={S.clay} annee={etiquette} /> },
  { x: 860, y: 1300, r: 4, noeud: <Interro /> },
  { x: 190, y: 1180, r: -4, noeud: <Interro /> },
];

/** P5 — « On lit, on répond, on corrige ensemble. » */
export const P5Bascule: React.FC = () => (
  <Ralenti poses={POSES_P5}>
    <P5Coeur />
  </Ralenti>
);

const P5Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons: CARTONS } = useEtude();
  const EPARS = epars(CARTONS.cahierEtiquette);
  const [l1, debut, mot, point] = CARTONS.bascule;
  const aspire = doux(f, [4, 34], [0, 1]);
  const tuile = spring({ frame: f - 28, fps, config: { damping: 13 } });
  // La phrase s'efface, la tuile se réduit vers le haut (elle sera celle de l'accueil de P7).
  const sortie = doux(f, [125, 135], [0, 1]);
  return (
    <AbsoluteFill>
      {aspire < 1
        ? EPARS.map((e, i) => {
            const x = e.x + (CENTRE.x - e.x) * aspire;
            const y = e.y + (CENTRE.y - e.y) * aspire;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: `translate(-50%, -50%) scale(${1 - 0.85 * aspire}) rotate(${e.r + aspire * 40 * (i % 2 ? 1 : -1)}deg)`,
                  opacity: 1 - doux(f, [24, 34], [0, 1]),
                }}
              >
                {e.noeud}
              </div>
            );
          })
        : null}
      <div
        style={{
          position: 'absolute',
          left: CENTRE.x,
          top: CENTRE.y - 500 * sortie,
          transform: `translate(-50%, -50%) scale(${GRAND * tuile * (1 - 0.55 * sortie)})`,
          opacity: 1 - sortie,
          fontFamily: P.sans,
          color: S.ink,
          filter: 'drop-shadow(0 10px 18px rgba(42,38,32,0.16))',
        }}
      >
        <TuileEtude />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 440,
          left: 30,
          right: 30,
          textAlign: 'center',
          fontFamily: P.serif,
          fontWeight: 600,
          fontSize: 98,
          lineHeight: 1.1,
          letterSpacing: -2.5,
          color: S.ink,
          opacity: 1 - sortie,
        }}
      >
        <div style={glisse(f, fps, 40)}>{l1}</div>
        <div style={glisse(f, fps, 50)}>
          {debut}
          <span style={{ color: S.clay }}>{mot}</span>
          {point}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * P19 — « Le Message de Bertoua, simplement. » (JP 21/10, à la place de « Votre réunion,
 * simplement. ») puis l'icône et le logotype (gabarit de la fin d'« Évènements »). Phrase à 88 px :
 * « Le Message de Bertoua, » tient sur une ligne.
 */
export const P19Fin: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons: CARTONS } = useEtude();
  const [l1, mot, point] = CARTONS.fin;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
      <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 88, letterSpacing: -2, color: S.ink, textAlign: 'center', lineHeight: 1.15, padding: '0 40px', ...glisse(f, fps, 8) }}>
        {l1}
        <br />
        <span style={{ color: S.clay }}>{mot}</span>
        {point}
      </div>
      <div style={{ marginTop: 110 }}>
        <TuileLogo taille={220} echelle={spring({ frame: f - 30, fps, config: { damping: 14 } })} />
      </div>
      <Logotype taille={64} style={{ marginTop: 40, ...glisse(f, fps, 42) }} />
    </AbsoluteFill>
  );
};
