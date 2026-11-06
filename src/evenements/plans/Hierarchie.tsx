import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoMegaphoneOutline } from 'react-icons/io5';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { CARTONS, LEGENDES } from '../textes';
import { STATS } from '../donnees';
import { P, S } from '../theme';
import { EcranStats } from '../ecrans/Stats';
import { LegendeShephr, Voile, montee, voilePour } from './commun';

/**
 * Chapitre 3 — la hiérarchie. P12 : à chaque dirigeant, le périmètre de son niveau (D-EVT-07,
 * la géographie du rôle — pas la chaîne des superviseurs de Member Care). P13 : le secrétariat
 * arrive directement sur les statistiques de tout le ministère (D-EVT-09).
 */
export const DUREE_P12 = 238;
export const DUREE_P13 = 162;

interface Boite {
  niveau: string;
  role: string;
  x: number;
  y: number;
  l: number;
  h: number;
  /**
   * Autres sous-niveaux de la boîte (frères de la boîte intérieure), avec leurs actions comptées
   * (données § 5.3). Pâles tant que le rôle de la boîte n'est pas allumé, puis en plein contraste :
   * ils font partie de son périmètre (D-EVT-07).
   */
  soeurs: { nom: string; n: number }[];
}

/** Les quatre boîtes emboîtées, de l'intérieur vers l'extérieur (repère vidéo, plan large). */
const BOITES: Boite[] = [
  { niveau: `${CARTONS.niveaux.assemblee} · PARIS NORD`, role: CARTONS.roles.assemblee, x: 160, y: 1110, l: 760, h: 600, soeurs: [] },
  { niveau: `${CARTONS.niveaux.ville} · PARIS`, role: CARTONS.roles.ville, x: 120, y: 900, l: 840, h: 850, soeurs: [{ nom: 'Paris Est', n: 7 }, { nom: 'Paris Sud', n: 8 }] },
  { niveau: `${CARTONS.niveaux.region} · ÎLE-DE-FRANCE`, role: CARTONS.roles.region, x: 80, y: 690, l: 920, h: 1100, soeurs: [{ nom: 'Créteil', n: 11 }, { nom: 'Versailles', n: 9 }] },
  { niveau: `${CARTONS.niveaux.nation} · FRANCE`, role: CARTONS.roles.nation, x: 40, y: 480, l: 1000, h: 1350, soeurs: [{ nom: 'Auvergne-Rhône-Alpes', n: 31 }, { nom: 'Hauts-de-France', n: 24 }] },
];

/**
 * Image d'apparition de chaque boîte (la caméra recule en trois temps). Retour JP 14/10 (« ça
 * avance trop vite ») : le recul garde sa vitesse (`TRANSITION`), mais chaque rôle allumé reste
 * seul à l'écran ≈ 1,1 s avant le recul suivant (écart de 54 images au lieu de 40–45 ; 70 au
 * premier passage, resserré pour tenir ≈ 2 min au total).
 */
const APPARITIONS = [0, 54, 108, 162];
const TRANSITION = 25;

/** Échelle et centre de caméra qui cadrent la boîte `k` sous la légende. */
const cadrage = (k: number) => {
  const b = BOITES[k];
  const echelle = Math.min(1.37, 1040 / b.l, 1440 / b.h);
  return { echelle: Math.max(1, echelle), cx: b.x + b.l / 2, cy: b.y + b.h / 2 };
};

export const P12Perimetres: React.FC = () => {
  const f = useCurrentFrame();
  // Caméra : interpolation douce entre les cadrages successifs.
  const temps = APPARITIONS.flatMap((a, k) => (k === 0 ? [0] : [a, a + TRANSITION]));
  const valeurs = (cle: 'echelle' | 'cx' | 'cy') =>
    APPARITIONS.flatMap((_, k) => (k === 0 ? [cadrage(0)[cle]] : [cadrage(k - 1)[cle], cadrage(k)[cle]]));
  const echelle = doux(f, temps, valeurs('echelle'));
  const cx = doux(f, temps, valeurs('cx'));
  const cy = doux(f, temps, valeurs('cy'));
  // Plan large : les quatre rôles se rallument (i 200 → 214) et restent posés ≈ 0,8 s (≈ 1,1 s
  // avec le gel sous l'intertitre qui suit).
  const tout = doux(f, [200, 214], [0, 1]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${540 - cx}px, ${1160 - cy}px) scale(${echelle})`, transformOrigin: `${cx}px ${cy}px` }}>
        {[...BOITES].reverse().map((b) => {
          const k = BOITES.indexOf(b);
          const a = APPARITIONS[k];
          const trace = doux(f, [a + 5, a + 20], [0, 1]);
          const soeurs = doux(f, [a + 12, a + 24], [0, 1]);
          const allume = doux(f, [a + 14, a + 22], [0, 1]);
          const suivant = k < 3 ? doux(f, [APPARITIONS[k + 1] + 14, APPARITIONS[k + 1] + 22], [0, 1]) : 0;
          const etiquette = allume * (1 - 0.5 * suivant + 0.5 * suivant * tout);
          return (
            <React.Fragment key={b.niveau}>
              <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1080} height={1920}>
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.l}
                  height={b.h}
                  rx={40}
                  fill={k === 0 ? `rgba(122,139,111,${0.12 * trace})` : `rgba(251,245,230,${0.5 * trace})`}
                  stroke={S.sauge}
                  strokeWidth={4}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - trace}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  left: b.x + 34,
                  top: b.y + 30,
                  fontFamily: P.mono,
                  fontWeight: 500,
                  fontSize: 26,
                  letterSpacing: 2,
                  color: S.ink2,
                  opacity: trace,
                }}
              >
                {b.niveau}
              </div>
              {b.soeurs.length > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: b.x + 34,
                    top: b.y + 84,
                    display: 'flex',
                    gap: 16,
                    opacity: soeurs * (0.55 + 0.45 * allume),
                  }}
                >
                  {b.soeurs.map((s) => (
                    <div
                      key={s.nom}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 14,
                        padding: '14px 24px',
                        borderRadius: 22,
                        background: `rgba(245,236,216,${allume})`,
                        border: `2px ${allume > 0.5 ? 'solid' : 'dashed'} ${allume > 0.5 ? S.sauge : S.hairStrong}`,
                        fontFamily: P.sans,
                        fontWeight: allume > 0.5 ? 600 : 500,
                        fontSize: 28,
                        color: allume > 0.5 ? S.ink : S.ink3,
                      }}
                    >
                      {s.nom}
                      <span style={{ fontFamily: P.serif, fontSize: 32, color: S.clay, opacity: allume }}>{s.n}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              {k === 0 ? <ActionsAssemblee x={b.x + 34} y={b.y + 110} opacite={doux(f, [10, 24], [0, 1])} /> : null}
              <div
                style={{
                  position: 'absolute',
                  right: 1080 - (b.x + b.l - 34),
                  top: b.y - 30,
                  padding: '12px 26px',
                  borderRadius: 99,
                  background: S.sauge,
                  color: S.white,
                  fontFamily: P.sans,
                  fontWeight: 600,
                  fontSize: 32,
                  lineHeight: '36px',
                  boxShadow: '0 10px 24px rgba(42,38,32,0.12)',
                  opacity: etiquette,
                  transform: `scale(${0.85 + 0.15 * allume})`,
                }}
              >
                {b.role}
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      {/* `duree` = DUREE - 1 - `debut` (6) : le fondu s'achève sur la dernière image du plan. */}
      <LegendeShephr lignes={LEGENDES.p12} duree={DUREE_P12 - 7} />
    </AbsoluteFill>
  );
};

/** Ce qui se passe dans l'assemblée : trois actions récentes, en petites cartes. */
const ActionsAssemblee: React.FC<{ x: number; y: number; opacite: number }> = ({ x, y, opacite }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 692, display: 'flex', flexDirection: 'column', gap: 18, opacity: opacite }}>
    {[
      ['Campagne', '14 oct.'],
      ['Concert', '14 oct.'],
      ['Action de grâce', '11 oct.'],
    ].map(([type, date]) => (
      <div
        key={type}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '20px 26px',
          borderRadius: 26,
          background: S.paper,
          border: '2px solid rgba(42,38,32,0.07)',
        }}
      >
        <IoMegaphoneOutline size={38} color={S.clay} />
        <div style={{ flex: 1, fontFamily: P.serif, fontSize: 38, color: S.ink }}>{type}</div>
        <div style={{ fontFamily: P.sans, fontSize: 28, color: S.ink3 }}>{date}</div>
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------------------------
// P13 — Le secrétariat suit tout le ministère
//
// Retour JP 14/10 : le téléphone monte déjà sur l'onglet « Évènements » de la barre du bas, ouvert
// sur « Statistiques », l'onglet par défaut du secrétariat (D-EVT-09) — halo tenu i 52 → 72 —,
// puis zoom sur les KPI, tenus ≈ 1,3 s (i 96 → 136). Revue du 14/10 : plus d'appui sur
// « Évènements » (i 34) — l'écran y était déjà, le geste ne produisait rien. D-EVT-17 : la grille
// compte sept tuiles (« Invités » après « Participants ») sur quatre rangées ; le foyer descend
// (y 464 → 640) pour la cadrer entière.

export const P13Secretariat: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = doux(f, [76, 96, 136, 156], [1, 1.45, 1.45, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: 640 }}
        decalageY={montee(f, fps)}
      >
        <EcranStats
          niveau={STATS.france}
          haloOnglet={doux(f, [44, 52, 72, 80], [0, 1, 1, 0])}
          haloKpi={doux(f, [98, 108, 130, 138], [0, 1, 1, 0])}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      {/* Fondu achevé sur la dernière image, gelée sous l'intertitre qui suit. */}
      <LegendeShephr lignes={LEGENDES.p13} duree={DUREE_P13 - 7} />
    </AbsoluteFill>
  );
};
