import React from 'react';
import { P, S } from '../../evenements/theme';
import { PAGE_CAHIER } from '../../journal/ui/Illustrations';
import { useEtude } from '../langue';

/**
 * Répondre sans application (P11, JP 21/10) : la page du livret de l'étudiant de Paul — questions
 * imprimées, réponses écrites à la main dessous — et le crayon qui écrit. Le cahier d'Hélène est la
 * `PageLignee` de « Journal » (lignes manuscrites seules). Repère d'une page de cahier (480 × 640).
 */

const KRAFT = `linear-gradient(135deg, ${S.earth} 0%, #BE8A60 60%, ${S.earthDeep} 100%)`;

/** Haut de l'entrée `i` du livret et ordonnée de sa ligne de réponse (repère de la page). */
const HAUT_ENTREE = (i: number) => 128 + i * 124;
export const LIGNE_REPONSE_LIVRET = (i: number) => HAUT_ENTREE(i) + 92;

/** Page du livret : `ecrites` réponses écrites (fractionnaire : la dernière se révèle de gauche à droite). */
export const PageLivret: React.FC<{ ecrites: number }> = ({ ecrites }) => {
  const { cartons } = useEtude();
  const l = cartons.livretPaul;
  return (
    <div style={{ position: 'absolute', inset: 0, width: PAGE_CAHIER.largeur, height: PAGE_CAHIER.hauteur, borderRadius: '4px 14px 14px 4px', background: KRAFT, padding: 10, boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '2px 8px 8px 2px', background: S.paper2, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 30, right: 30, top: 34, fontFamily: P.mono, fontSize: 15, letterSpacing: 1.5, color: S.earthDeep }}>{cartons.livret[1]}</div>
        <div style={{ position: 'absolute', left: 30, right: 30, top: 60, fontFamily: P.serif, fontWeight: 600, fontSize: 26, color: S.ink }}>{l.entete}</div>
        {l.lignes.map((e, i) => {
          const p = Math.max(0, Math.min(1, ecrites - i));
          return (
            <div key={e.imprime} style={{ position: 'absolute', left: 30, right: 26, top: HAUT_ENTREE(i) }}>
              <div style={{ fontFamily: P.sans, fontSize: 18, lineHeight: '22px', color: S.ink2, height: 44 }}>{e.imprime}</div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 92, borderTop: `2px dotted ${S.hairStrong}` }} />
              {p > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 6,
                    top: 52,
                    fontFamily: P.serif,
                    fontStyle: 'italic',
                    fontSize: 29,
                    color: S.moss,
                    whiteSpace: 'nowrap',
                    clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
                  }}
                >
                  {e.main}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Crayon (bois terre, mine sombre), pointe en bas à gauche, posé par sa pointe (pixels). */
export const Crayon: React.FC<{ x: number; y: number; opacite?: number }> = ({ x, y, opacite = 1 }) =>
  opacite <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x - 7,
        top: y - 150,
        width: 14,
        height: 150,
        borderRadius: 4,
        background: S.earth,
        transform: 'rotate(28deg)',
        transformOrigin: '50% 100%',
        boxShadow: 'inset 0 -16px 0 rgba(42,38,32,0.35)',
        opacity: opacite,
      }}
    />
  );
