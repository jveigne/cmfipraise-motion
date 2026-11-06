import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Logotype, TuileLogo } from '../../evenements/ui/Habillage';
import { Silhouette } from '../../journal/ui/Illustrations';
import { ASSEMBLEES } from '../donnees';
import { CARTONS, LEGENDES } from '../textes';
import { Pierre, PierreVue, glisse } from '../ui/Decor';
import { Legende, PastillePersonne } from './commun';

/**
 * P9 — « Une ville, tous ses responsables » (sur l'entrée de l'orchestre, 70,5 s du fichier) : la
 * ville se bâtit de ses six assemblées (rappel de la muraille du verset), l'offre la couvre, et
 * ses responsables — de la ville à la nation (D-ABO-21 : tout compte qui voit la ville) — la
 * suivent. P10 — la fin : « Disponible sur l'espace web Shephr ».
 */
export const DUREE_P9 = 255;
export const DUREE_P10 = 180;

/** Pyramide de six pierres nommées (3, 2, 1), base à y = 1700. */
const L = 300;
const H = 132;
const PIERRES: (Pierre & { nom: string })[] = ASSEMBLEES.map((nom, i) => {
  const rang = i < 3 ? 0 : i < 5 ? 1 : 2;
  const dans = i < 3 ? i : i < 5 ? i - 3 : 0;
  const n = 3 - rang;
  const x0 = (1080 - n * L) / 2;
  return { nom, x: x0 + dans * L, y: 1700 - (rang + 1) * H, l: L, h: H, teinte: [S.parchmentDeep, S.earth, S.paper][(i + rang) % 3], ordre: i };
});
const SOMMET = { x: 540, y: 1700 - 3 * H };

const RESPONSABLES = CARTONS.niveaux.map((niveau, i) => ({ niveau, x: 230 + i * 310, a: 66 + i * 10 }));
const BAS_SILHOUETTES = 830;

export const P9Responsables: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceau = spring({ frame: f - 46, fps, config: { damping: 9, mass: 0.8 } });
  const traits = doux(f, [100, 128], [0, 1]);
  const sortie = doux(f, [240, 255], [0, 1]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - sortie }}>
        {/* Liens : chaque responsable regarde toute la ville ; une lueur descend le long du trait. */}
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {RESPONSABLES.map((r, i) => {
            const x2 = SOMMET.x + (r.x - SOMMET.x) * 0.25;
            const y2 = SOMMET.y - 70;
            const yb = BAS_SILHOUETTES + 60 + (y2 - BAS_SILHOUETTES - 60) * traits;
            const xb = r.x + (x2 - r.x) * traits;
            const t = ((f - 130 - i * 12) % 60) / 60;
            return (
              <g key={r.niveau}>
                <line x1={r.x} y1={BAS_SILHOUETTES + 60} x2={xb} y2={yb} stroke={S.moss} strokeOpacity={0.4} strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" />
                {f > 130 + i * 12 ? (
                  <circle cx={r.x + (x2 - r.x) * t} cy={BAS_SILHOUETTES + 60 + (y2 - BAS_SILHOUETTES - 60) * t} r={11} fill={S.clay} opacity={Math.sin(Math.PI * t) * 0.9} />
                ) : null}
              </g>
            );
          })}
        </svg>
        {RESPONSABLES.map((r) => {
          const s = spring({ frame: f - r.a, fps, config: { damping: 15 } });
          return (
            <div key={r.niveau} style={{ position: 'absolute', inset: 0, opacity: Math.min(1, s), transform: `translateY(${(1 - s) * 40}px)` }}>
              <Silhouette x={r.x} y={BAS_SILHOUETTES - 340 * 0.46} teinte={S.moss} taille={0.46} />
              <PastillePersonne x={r.x} y={BAS_SILHOUETTES + 34} taille={28}>
                {r.niveau}
              </PastillePersonne>
            </div>
          );
        })}
        {PIERRES.map((p, i) => (
          <PierreVue key={p.nom} p={p} a={2 + i * 6}>
            <span style={{ fontFamily: P.sans, fontWeight: 600, fontSize: 36, color: S.ink }}>{p.nom}</span>
          </PierreVue>
        ))}
        {/* Le sceau de l'offre, posé sur la ville. */}
        <div
          style={{
            position: 'absolute',
            left: SOMMET.x,
            top: SOMMET.y - 60,
            transform: `translate(-50%, -50%) scale(${sceau}) rotate(${-4 * sceau}deg)`,
            opacity: Math.min(1, sceau),
            padding: '14px 30px',
            borderRadius: 18,
            border: `4px solid ${S.clay}`,
            background: S.paper2,
            fontFamily: P.serif,
            fontWeight: 600,
            fontSize: 44,
            color: S.clay,
            whiteSpace: 'nowrap',
            boxShadow: '0 16px 30px rgba(42,38,32,0.16)',
          }}
        >
          {CARTONS.offre.join('')}
        </div>
      </AbsoluteFill>
      <Legende lignes={LEGENDES.p9Responsables} duree={DUREE_P9} fin={122} />
      <Legende lignes={LEGENDES.p9Chacun} duree={DUREE_P9} debut={128} />
    </AbsoluteFill>
  );
};

export const P10Fin: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [l1, l2] = CARTONS.fin;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
      <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 52, color: S.ink2, marginBottom: 30, ...glisse(f, fps, 4) }}>{CARTONS.offre.join('')}</div>
      <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 88, letterSpacing: -2, color: S.ink, textAlign: 'center', lineHeight: 1.15, padding: '0 40px', ...glisse(f, fps, 10) }}>
        {l1}
        <br />
        <span style={{ color: S.clay }}>{l2}</span>
      </div>
      <div style={{ marginTop: 110 }}>
        <TuileLogo taille={220} echelle={spring({ frame: f - 30, fps, config: { damping: 14 } })} />
      </div>
      <Logotype taille={64} style={{ marginTop: 40, ...glisse(f, fps, 42) }} />
    </AbsoluteFill>
  );
};
