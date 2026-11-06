import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { P, S } from '../../evenements/theme';
import { Telephone } from '../../ui/Telephone';
import { AppuiLibre, Pose, versPose } from '../../etude/plans/commun';
import { useGuide } from '../langue';
import { etapeDe, partieDe } from '../frise';
import type { IdPlan } from '../textes';

/**
 * Mise en page 16:9 de la vidéo « Guide » (1920 × 1080) : le téléphone (ou deux) à gauche, le
 * panneau de texte à droite — partie, étape, qui tient le téléphone, titre, une phrase. Le repère
 * des écrans reste celui des vidéos 9:16 (390 × 844 points, `Telephone`) : seules l'échelle et la
 * position du téléphone changent.
 */

export const LARGEUR = 1920;
export const HAUTEUR = 1080;

/** Un téléphone : 1,12 pixel par point (texte de l'app à 13 pt → 14,6 px). */
export const POSE_SEULE: Pose = { x: 250, y: Math.round((HAUTEUR - (844 * 1.12 + 32)) / 2), e: 1.12 };
/** Deux téléphones côte à côte, 1 pixel par point. */
export const POSES_DEUX: [Pose, Pose] = [
  { x: 96, y: Math.round((HAUTEUR - (844 + 32)) / 2) + 20, e: 1 },
  { x: 560, y: Math.round((HAUTEUR - (844 + 32)) / 2) + 20, e: 1 },
];

/** Panneau de texte : à droite d'un téléphone, ou de deux. */
export const PANNEAU_SEUL = { x: 860, largeur: 960 };
export const PANNEAU_DEUX = { x: 1080, largeur: 760 };

/** Fond fixe (le fond animé d'« Évènements » sauterait d'un plan à l'autre) : papier, deux halos. */
export const Fond16: React.FC = () => (
  <AbsoluteFill style={{ background: S.paper2, overflow: 'hidden' }}>
    <div
      style={{
        position: 'absolute',
        width: 1300,
        height: 1300,
        borderRadius: '50%',
        left: -520,
        top: 260,
        background: 'radial-gradient(circle, rgba(30,58,47,0.10), rgba(30,58,47,0) 70%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 1100,
        height: 1100,
        borderRadius: '50%',
        right: -360,
        top: -420,
        background: 'radial-gradient(circle, rgba(201,149,107,0.13), rgba(201,149,107,0) 70%)',
      }}
    />
  </AbsoluteFill>
);

/** `*mot*` → argile. */
export const Accent: React.FC<{ texte: string }> = ({ texte }) => (
  <>
    {texte.split('*').map((t, i) =>
      i % 2 === 1 ? (
        <span key={i} style={{ color: S.clay }}>
          {t}
        </span>
      ) : (
        <React.Fragment key={i}>{t}</React.Fragment>
      ),
    )}
  </>
);

/** Apparition douce (opacité, glissement) à partir de l'image `a`. */
export const useEntree = (a: number, distance = 30) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - a, fps, config: { damping: 200 }, durationInFrames: 14 });
  return { opacity: p, transform: `translateY(${(1 - p) * distance}px)` };
};

const COULEUR_ROLE: Record<string, string> = {
  samuel: S.moss,
  marie: S.mossSoft,
  jean: S.earthDeep,
  rose: S.sauge,
  daniel: S.clay,
  papier: S.earthDeep,
  assemblee: S.ink2,
};

/** Le panneau de texte du plan `id`. */
export const PanneauTexte: React.FC<{ id: IdPlan; x: number; largeur: number }> = ({ id, x, largeur }) => {
  const { plans, cartons } = useGuide();
  const p = plans[id];
  const etape = etapeDe(id);
  const partie = partieDe(id);
  const e0 = useEntree(4, 16);
  const e1 = useEntree(8);
  const e2 = useEntree(14);
  const titre = p.titre.replace(/\*/g, '');
  const taille = titre.length > 34 ? 58 : titre.length > 22 ? 66 : 76;
  const lignes = Array.isArray(p.texte) ? p.texte : [p.texte];
  return (
    <div style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: largeur, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ ...e0, display: 'flex', alignItems: 'center', gap: 22, marginBottom: 34 }}>
        <div style={{ fontFamily: P.mono, fontWeight: 500, fontSize: 24, letterSpacing: 2.4, color: S.clay }}>{cartons.parties[partie]}</div>
        {etape.total > 1 ? (
          <>
            <div style={{ height: 2, width: 40, background: S.hairStrong }} />
            <div style={{ fontFamily: P.sans, fontWeight: 500, fontSize: 26, color: S.ink3 }}>{cartons.etape(etape.n, etape.total)}</div>
          </>
        ) : null}
      </div>
      {p.role ? (
        <div style={{ ...e0, display: 'flex', marginBottom: 26 }}>
          <div
            style={{
              padding: '10px 22px',
              borderRadius: 99,
              background: COULEUR_ROLE[p.role],
              color: S.white,
              fontFamily: P.mono,
              fontWeight: 500,
              fontSize: 25,
              letterSpacing: 2,
            }}
          >
            {cartons.roles[p.role]}
          </div>
        </div>
      ) : null}
      <div style={{ ...e1, fontFamily: P.serif, fontWeight: 600, fontSize: taille, lineHeight: 1.08, letterSpacing: -1.2, color: S.ink }}>
        <Accent texte={p.titre} />
      </div>
      {lignes.map((l) => (
        <div key={l} style={{ ...e2, marginTop: 30, fontFamily: P.sans, fontSize: 42, lineHeight: 1.32, color: S.ink2, maxWidth: largeur }}>
          {l}
        </div>
      ))}
    </div>
  );
};

/** Halo qui pulse doucement de `a` à la fin du plan (surbrillance d'un élément de l'écran). */
export const useHalo = (a: number, duree = 18) => {
  const f = useCurrentFrame();
  return interpolate(f, [a, a + duree], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

/** Zoom de caméra sur un point d'écran (points) : `z` 1 = pas de zoom. */
export interface Zoom {
  z: number;
  x: number;
  y: number;
}

/**
 * Un téléphone posé en `pose`, avec ses appuis, sous un zoom éventuel autour d'un point d'écran.
 * `etiquette` : pastille de personne au-dessus (deux téléphones).
 */
export const TelPose: React.FC<{
  pose: Pose;
  zoom?: Zoom;
  appuis?: readonly { x: number; y: number; a: number }[];
  etiquette?: string;
  children: React.ReactNode;
}> = ({ pose, zoom, appuis = [], etiquette, children }) => {
  const f = useCurrentFrame();
  const foyer = zoom ? versPose(pose, zoom.x, zoom.y) : { x: 0, y: 0 };
  // Le zoom s'installe en douceur sur les 20 premières images du plan.
  const z = zoom ? 1 + (zoom.z - 1) * interpolate(f, [2, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }) : 1;
  return (
    <AbsoluteFill style={z !== 1 ? { transform: `scale(${z})`, transformOrigin: `${foyer.x}px ${foyer.y}px` } : undefined}>
      <Telephone x={pose.x} y={pose.y} echelle={pose.e}>
        {children}
      </Telephone>
      {appuis.map((a, i) => (
        <AppuiLibre key={i} pose={pose} x={a.x} y={a.y} a={a.a} />
      ))}
      {etiquette ? (
        <div style={{ position: 'absolute', left: pose.x + (390 * pose.e + 32) / 2, top: pose.y - 34, transform: 'translate(-50%, -50%)', whiteSpace: 'nowrap' }}>
          <div
            style={{
              padding: '8px 20px',
              borderRadius: 99,
              background: S.paper,
              border: `2px solid ${S.mossTint2}`,
              boxShadow: '0 8px 20px rgba(42,38,32,0.12)',
              fontFamily: P.mono,
              fontWeight: 500,
              fontSize: 24,
              letterSpacing: 2,
              color: S.moss,
            }}
          >
            {etiquette}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Valeur interpolée bornée sur les images locales du plan. */
export const entre = (f: number, de: readonly number[], a: readonly number[]) =>
  interpolate(f, [...de], [...a], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/**
 * Le plan type : fond, un téléphone à gauche (ou deux, ou une illustration), le panneau de texte à
 * droite.
 */
export const Scene: React.FC<{
  id: IdPlan;
  tel?: React.ReactNode;
  zoom?: Zoom;
  appuis?: readonly { x: number; y: number; a: number }[];
  deux?: [{ contenu: React.ReactNode; etiquette?: string; zoom?: Zoom }, { contenu: React.ReactNode; etiquette?: string; zoom?: Zoom }];
  /** Illustration à la place du téléphone (zone gauche, 0 → 820 px). */
  gauche?: React.ReactNode;
}> = ({ id, tel, zoom, appuis, deux, gauche }) => (
  <AbsoluteFill>
    <Fond16 />
    {gauche ? <AbsoluteFill>{gauche}</AbsoluteFill> : null}
    {tel ? (
      <TelPose pose={POSE_SEULE} zoom={zoom} appuis={appuis}>
        {tel}
      </TelPose>
    ) : null}
    {deux
      ? deux.map((t, i) => (
          <TelPose key={i} pose={POSES_DEUX[i]} zoom={t.zoom} etiquette={t.etiquette}>
            {t.contenu}
          </TelPose>
        ))
      : null}
    <PanneauTexte id={id} {...(deux ? PANNEAU_DEUX : PANNEAU_SEUL)} />
  </AbsoluteFill>
);
