import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoCheckmark, IoHome, IoLockClosed } from 'react-icons/io5';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { LegendeEtude, lisse } from '../../etude/plans/commun';
import { CARTONS, LEGENDES } from '../textes';
import { ASSEMBLEES, PERSONNES } from '../donnees';

/**
 * Partie « 4 · Chacun pour soi » (P9, illustration) : l'offre Caleb est personnelle (D-ABO-36) —
 * Bernard, Daniel et Marc, l'un sous l'autre ; seule la pastille de Daniel s'allume, et elle éclaire
 * ce que Daniel suit (Marc et les assemblées sous lui). Puis Marc : sa pastille se ferme d'un
 * cadenas, l'offre de Daniel ne lui ouvre rien (et celle de Daniel n'ouvre rien à Bernard non plus :
 * sa pastille reste éteinte).
 */
export const DUREE_P9 = 225;

const CARTES: { cle: 'bernard' | 'daniel' | 'marc'; y: number }[] = [
  { cle: 'bernard', y: 540 },
  { cle: 'daniel', y: 860 },
  { cle: 'marc', y: 1180 },
];
const X = 110;
const LARGEUR = 860;
const HAUTEUR = 200;

/** La pastille « Offre Caleb » d'une carte : éteinte, allumée (✓) ou fermée (cadenas). */
const PastilleOffre: React.FC<{ allumee: number; cadenas: number }> = ({ allumee, cadenas }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 22px',
      borderRadius: 99,
      background: allumee > 0.5 ? S.moss : 'rgba(42,38,32,0.06)',
      border: `2px solid ${allumee > 0.5 ? S.mossDeep : cadenas > 0.5 ? 'rgba(184,106,74,0.6)' : S.hair}`,
      color: allumee > 0.5 ? S.white : S.ink3,
      fontFamily: P.sans,
      fontWeight: 600,
      fontSize: 30,
      transform: `scale(${1 + 0.12 * Math.sin(Math.PI * Math.min(1, allumee))})`,
    }}
  >
    {allumee > 0.5 ? <IoCheckmark size={30} color={S.white} /> : null}
    {cadenas > 0.01 && allumee <= 0.5 ? (
      <span style={{ display: 'flex', opacity: cadenas, transform: `scale(${0.6 + 0.4 * cadenas})` }}>
        <IoLockClosed size={28} color={S.clay} />
      </span>
    ) : null}
    {CARTONS.pastilleOffre}
  </div>
);

export const P9Chacun: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const daniel = spring({ frame: f - 40, fps, config: { damping: 14 }, durationInFrames: 20 });
  // Ce que Daniel suit : sa carte, celle de Marc et les assemblées sous Marc.
  const zone = doux(f, [56, 76], [0, 1]);
  const cadenas = doux(f, [122, 136], [0, 1]);
  const sortie = doux(f, [212, 225], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: 1 - sortie }}>
      {/* La zone éclairée par l'offre de Daniel. */}
      <div
        style={{
          position: 'absolute',
          left: X - 30,
          top: CARTES[1].y - 30,
          width: LARGEUR + 60,
          height: 1560 - CARTES[1].y + 30,
          borderRadius: 48,
          background: 'rgba(122,139,111,0.16)',
          border: `3px solid rgba(122,139,111,${0.6 * zone})`,
          opacity: zone,
        }}
      />
      {/* Traits de la chaîne. */}
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
        {[0, 1].map((i) => (
          <line
            key={i}
            x1={X + 70}
            x2={X + 70}
            y1={CARTES[i].y + HAUTEUR}
            y2={CARTES[i + 1].y}
            stroke={S.sauge}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={lisse(f, fps, 14 + i * 6, 12)}
          />
        ))}
      </svg>

      {CARTES.map((c, i) => {
        const p = lisse(f, fps, 4 + i * 6, 14);
        const personne = PERSONNES[c.cle];
        return (
          <div
            key={c.cle}
            style={{
              position: 'absolute',
              left: X,
              top: c.y,
              width: LARGEUR,
              height: HAUTEUR,
              boxSizing: 'border-box',
              padding: '0 34px',
              borderRadius: 36,
              background: S.paper,
              border: '1px solid rgba(42,38,32,0.08)',
              boxShadow: '0 16px 40px rgba(42,38,32,0.10)',
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              opacity: p,
              transform: `translateY(${(1 - p) * 40}px)`,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                background: c.cle === 'daniel' ? S.moss : S.sauge,
                color: S.white,
                fontFamily: P.serif,
                fontSize: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {personne.initiales}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 46, letterSpacing: -1, color: S.ink, whiteSpace: 'nowrap' }}>{personne.nom}</div>
              <div style={{ fontFamily: P.sans, fontSize: 30, color: S.ink3, marginTop: 4 }}>{personne.role}</div>
            </div>
            <PastilleOffre allumee={c.cle === 'daniel' ? daniel : 0} cadenas={c.cle === 'marc' ? cadenas : 0} />
          </div>
        );
      })}

      {/* Sous Marc : ses deux assemblées (Paris Sud, et Évry Centre par Nadège). */}
      <div style={{ position: 'absolute', left: X + 150, top: 1420, display: 'flex', gap: 40, opacity: lisse(f, fps, 22, 14) }}>
        {[ASSEMBLEES.sud, ASSEMBLEES.evry].map((a) => (
          <div key={a.cle} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: S.paper,
                border: `3px solid ${S.earthDeep}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <IoHome size={26} color={S.earthDeep} />
            </div>
            <div style={{ fontFamily: P.sans, fontWeight: 600, fontSize: 32, color: S.earthDeep, whiteSpace: 'nowrap' }}>{a.nom}</div>
          </div>
        ))}
      </div>

      <LegendeEtude lignes={LEGENDES.p9Chacun} duree={DUREE_P9} debut={6} fin={112} />
      <LegendeEtude lignes={LEGENDES.p9Marc} duree={DUREE_P9} debut={116} />
    </AbsoluteFill>
  );
};
