import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Silhouette } from '../../journal/ui/Illustrations';
import { ASSEMBLEES } from '../donnees';
import { PageAssemblees } from '../ecrans/Pages';
import { CARTONS, LEGENDES, WEB } from '../textes';
import { Maison } from '../ui/Decor';
import { Curseur, trajet } from '../ui/Navigateur';
import { CENTRE_ENTREE_VILLE, ENTREE_VILLE, PageWeb, Tiroir } from '../ui/Web';
import { W } from '../web';
import { Fenetre, FonduPage, Legende, haloEntre, monteeFenetre } from './commun';

/**
 * « Pour qui » : P3, le pasteur et les responsables au-dessus de la ville de Douala et de ses six
 * assemblées ; P4, l'espace web : le menu, « Suivi de la ville ».
 */
export const DUREE_P3 = 180;
export const DUREE_P4 = 135;

/** Centres des six maisons (3 × 2) dans la carte de la ville. */
const MAISONS = ASSEMBLEES.map((nom, i) => ({ nom, x: 250 + (i % 3) * 290, y: 1150 + Math.floor(i / 3) * 300 }));
const CARTE = { x: 70, y: 880, l: 940, h: 760 };
const RESPONSABLES = [
  { x: 270, taille: 0.46, teinte: S.mossSoft, etiquette: CARTONS.responsable, a: 18 },
  { x: 540, taille: 0.56, teinte: S.moss, etiquette: CARTONS.pasteur, a: 10 },
  { x: 810, taille: 0.46, teinte: S.mossSoft, etiquette: CARTONS.responsable, a: 24 },
];

export const P3PourQui: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sortie = doux(f, [166, 180], [0, 1]);
  const regard = haloEntre(f, 100, 176);
  const traits = doux(f, [58, 80], [0, 1]);
  const carte = spring({ frame: f - 26, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - sortie }}>
        {/* Traits du regard : de chaque responsable à la ville. */}
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {RESPONSABLES.map((r) => (
            <line
              key={r.x}
              x1={r.x}
              y1={790}
              x2={r.x + (540 - r.x) * 0.35}
              y2={790 + (CARTE.y - 790) * traits}
              stroke={S.moss}
              strokeOpacity={0.45}
              strokeWidth={5}
              strokeDasharray="4 14"
              strokeLinecap="round"
            />
          ))}
        </svg>
        {RESPONSABLES.map((r) => {
          const s = spring({ frame: f - r.a, fps, config: { damping: 15 } });
          return (
            <div key={r.x} style={{ position: 'absolute', inset: 0, opacity: Math.min(1, s), transform: `translateY(${(1 - s) * 40}px)` }}>
              <Silhouette x={r.x} y={790 - 340 * r.taille - 70} teinte={r.teinte} taille={r.taille} etiquette={r.etiquette} />
            </div>
          );
        })}
        {/* La ville et ses assemblées. */}
        <div
          style={{
            position: 'absolute',
            left: CARTE.x,
            top: CARTE.y + (1 - carte) * 60,
            width: CARTE.l,
            height: CARTE.h,
            borderRadius: 36,
            background: S.paper,
            border: `3px solid rgba(184,106,74,${0.15 + 0.7 * regard})`,
            boxShadow: `0 30px 60px rgba(42,38,32,0.12), 0 0 0 ${10 * regard}px rgba(184,106,74,${0.15 * regard})`,
            opacity: carte,
          }}
        >
          <div style={{ marginTop: 34, textAlign: 'center', fontFamily: P.mono, fontWeight: 500, fontSize: 32, letterSpacing: 4, color: S.moss }}>{CARTONS.villeEtiquette}</div>
        </div>
        {MAISONS.map((m, i) => (
          <Maison key={m.nom} x={m.x} y={m.y} nom={m.nom} echelle={spring({ frame: f - 34 - i * 5, fps, config: { damping: 12 } })} teinte={i % 2 ? S.mossSoft : S.moss} />
        ))}
      </AbsoluteFill>
      <Legende lignes={LEGENDES.p3PourQui} duree={DUREE_P3} fin={92} />
      <Legende lignes={LEGENDES.p3Regard} duree={DUREE_P3} debut={96} />
    </AbsoluteFill>
  );
};

/** Page vue sous le menu : l'accueil de l'étude (contenu estompé, le menu passe devant). */
const PageSous: React.FC = () => (
  <PageWeb titre={WEB.nav.study} fil={[WEB.marque, WEB.nav.study]}>
    {[120, 90, 160].map((h, i) => (
      <div key={i} style={{ height: h, borderRadius: 14, background: W.ivoryCard, border: `1px solid ${W.line}`, marginBottom: 14, opacity: 0.8 }} />
    ))}
  </PageWeb>
);

/** Bouton menu de la barre mobile (px CSS). */
const BURGER = { x: 33, y: 29 };

export const P4Menu: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const A = { burger: 34, entree: 86 };
  const ouverture = doux(f, [A.burger + 2, A.burger + 14], [0, 1]) * (1 - doux(f, [A.entree + 6, A.entree + 18], [0, 1]));
  const page = doux(f, [A.entree + 8, A.entree + 20], [0, 1]);
  const c = trajet(f, [14, A.burger - 4, 50, A.entree - 6, 120], [{ x: 300, y: 420 }, BURGER, BURGER, CENTRE_ENTREE_VILLE, { x: 360, y: 420 }]);
  const curseur = doux(f, [12, 18], [0, 1]) * (1 - doux(f, [118, 126], [0, 1]));
  return (
    <AbsoluteFill>
      <Fenetre
        decalageY={monteeFenetre(f, fps, 0)}
        // D-FIX vidéos (JP 29/10) : page d'origine avant le clic sur l'entrée, `/study/city` après.
        chemin={f >= A.entree ? WEB.chemin : WEB.cheminEtude}
        dessus={
          <>
            <Curseur x={c.x} y={c.y} clic={f < 60 ? A.burger : A.entree} opacite={curseur} />
          </>
        }
      >
        <FonduPage
          p={page}
          avant={
            <>
              <PageSous />
              <Tiroir p={ouverture} actif={f >= A.entree ? ENTREE_VILLE : -1} halo={haloEntre(f, 58, A.entree + 6)} />
            </>
          }
          apres={<PageAssemblees coche={() => 0} />}
        />
      </Fenetre>
      <Legende lignes={LEGENDES.p4Menu} duree={DUREE_P4} />
    </AbsoluteFill>
  );
};
