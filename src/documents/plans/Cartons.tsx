import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Logotype, TuileLogo } from '../../evenements/ui/Habillage';
import { CARTONS, FIL } from '../textes';
import { TuileDocuments } from '../ecrans/Accueil';
import { BulleFichier, BulleTexte } from '../ui/Conversation';

/**
 * Cartons sans téléphone (gabarits de « Journal ») : P4, la bascule « problème → l'app », sur la
 * montée du chant (24,0 s du fichier) ; P10, la fin.
 */
export const DUREE_P4 = 150;
/** P10 : phrase, tuile et logotype posés ≈ 2 s ; la musique s'éteint sur les 2,5 dernières secondes. */
export const DUREE_P10 = 180;

const glisse = (f: number, fps: number, a: number) => {
  const p = spring({ frame: f - a, fps, config: { damping: 200 } });
  return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
};

/** Centre de la tuile « Documents » de la bascule (pixels vidéo) et son agrandissement. */
const CENTRE = { x: 540, y: 1180 };
const GRAND = 2.6;

/** Les bulles et fichiers du problème, épars autour du centre (points de la conversation × 1,9). */
const EPARS: { x: number; y: number; r: number; noeud: React.ReactNode }[] = [
  { x: 250, y: 620, r: -6, noeud: <BulleFichier de="Jean" fichier={FIL.fichierUmpj} meta="PDF · 12 pages · 1,8 Mo" heure="21:02" /> },
  { x: 830, y: 760, r: 5, noeud: <BulleFichier de="Sophie" fichier={FIL.fichiersPriere[1]} meta="PDF · 4 pages · 312 ko" heure="mar. 09:40" /> },
  { x: 230, y: 1560, r: 4, noeud: <BulleFichier de="Marc" fichier={FIL.fichiersPriere[2]} meta="PDF · 4 pages · 318 ko" heure="jeu. 21:17" /> },
  { x: 850, y: 1640, r: -5, noeud: <BulleFichier fichier={FIL.fichierProgramme} meta="PDF · 6 pages · 2,4 Mo" heure="08:12" /> },
  { x: 820, y: 1300, r: 3, noeud: <BulleTexte de={FIL.questions[0].de} texte={FIL.questions[0].texte} heure="10:42" /> },
  { x: 240, y: 1120, r: -3, noeud: <BulleTexte de={FIL.questions[1].de} texte={FIL.questions[1].texte} heure="10:45" /> },
];

/** P4 — « Tous vos documents, au même endroit. » */
export const P4Bascule: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [l1, l2, point] = CARTONS.bascule;
  const aspire = doux(f, [4, 34], [0, 1]);
  const tuile = spring({ frame: f - 28, fps, config: { damping: 13 } });
  const sortie = doux(f, [138, 150], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: 1 - sortie }}>
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
                  width: 390,
                  transform: `translate(-50%, -50%) scale(${1.9 * (1 - 0.85 * aspire)}) rotate(${e.r + aspire * 40 * (i % 2 ? 1 : -1)}deg)`,
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
          top: CENTRE.y,
          transform: `translate(-50%, -50%) scale(${GRAND * tuile})`,
          fontFamily: P.sans,
          color: S.ink,
          filter: 'drop-shadow(0 10px 18px rgba(42,38,32,0.16))',
        }}
      >
        <TuileDocuments />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 470,
          left: 40,
          right: 40,
          textAlign: 'center',
          fontFamily: P.serif,
          fontWeight: 600,
          fontSize: 100,
          lineHeight: 1.08,
          letterSpacing: -2.5,
          color: S.ink,
        }}
      >
        <div style={glisse(f, fps, 44)}>{l1}</div>
        <div style={glisse(f, fps, 54)}>
          <span style={{ color: S.clay }}>{l2}</span>
          {point}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** P10 — « Mondial ou par pays. » / « Chacun voit ce qui le concerne. » puis l'icône et le logotype. */
export const P10Fin: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [l1, debut, mot, point] = CARTONS.fin;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
      <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 96, letterSpacing: -2.5, color: S.ink, textAlign: 'center', lineHeight: 1.12, padding: '0 50px' }}>
        <div style={glisse(f, fps, 8)}>{l1}</div>
        <div style={{ marginTop: 26, ...glisse(f, fps, 22) }}>
          {debut}
          <br />
          <span style={{ color: S.clay }}>{mot}</span>
          {point}
        </div>
      </div>
      <div style={{ marginTop: 110 }}>
        <TuileLogo taille={220} echelle={spring({ frame: f - 44, fps, config: { damping: 14 } })} />
      </div>
      <Logotype taille={64} style={{ marginTop: 40, ...glisse(f, fps, 56) }} />
    </AbsoluteFill>
  );
};
