import React from 'react';
import { IoRadioButtonOff, IoRadioButtonOn } from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Bouton, Halo } from '../../evenements/ui/app';
import { useEtude } from '../../etude/langue';
import { TEXTES_GUIDE } from '../../guide/textes';

/**
 * « Passer à la correction » : la feuille `StopAfterSheet` (`session/[id].tsx`, D-ETU-40) —
 * « S'arrêter après la question : », une ligne par question de premier niveau de la plage, la
 * dernière cochée par défaut (« dernière ») ; le pied dit ce qui se passe (`toCorrectionConfirm`, ou
 * `stopAfterCut` si l'on s'arrête avant la fin). Même dessin que l'`EcranArret` de « Guide », avec
 * des hauteurs posées : la vidéo touche une ligne puis le bouton, il lui faut leurs positions.
 */

const G = TEXTES_GUIDE.fr.app;

const H = {
  titre: 28 + 4 + 19 + 12,
  ligne: 38,
  ecart: 6,
  ligneTexte: 18,
};
/** Lignes du pied : `toCorrectionConfirm` tient sur 2 lignes, `stopAfterCut` sur 6 (largeur 308). */
const lignesPied = (coupe: boolean) => (coupe ? 6 : 2);

const geometrie = (n: number, coupe: boolean) => {
  const liste = n * H.ligne + (n - 1) * H.ecart;
  const pied = 14 + lignesPied(coupe) * H.ligneTexte;
  const hauteur = 1 + 22 + H.titre + liste + pied + 14 + 48 + 8 + 44 + 18 + 1;
  return { hauteur, haut: (844 - hauteur) / 2, liste };
};

/** Points d'appui : la ligne `i` et le bouton « Passer à la correction ». */
export const ptArret = (n: number, coupe: boolean) => {
  const g = geometrie(n, coupe);
  const hautListe = g.haut + 1 + 22 + H.titre;
  return {
    ligne: (i: number) => ({ x: 195, y: hautListe + i * (H.ligne + H.ecart) + H.ligne / 2 }),
    passer: { x: 195, y: hautListe + g.liste + 14 + lignesPied(coupe) * H.ligneTexte + 14 + 24 },
  };
};

export const FeuilleArret: React.FC<{
  /** Numéro de la question choisie. */
  choix: string;
  /** Apparition (fondu, 0 → 1). */
  p: number;
  haloPied?: number;
  haloLigne?: number;
  /** Bouton « Passer à la correction » enfoncé (0 → 1). */
  appui?: number;
}> = ({ choix, p, haloPied = 0, haloLigne = 0, appui = 0 }) => {
  const { app: A, d } = useEtude();
  if (p <= 0.001) return null;
  const tete = d.QUESTIONS.filter((q) => !q.parent);
  const dernier = tete[tete.length - 1].numero;
  const coupe = choix !== dernier;
  const g = geometrie(tete.length, coupe);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(22,41,31,0.70)', opacity: p }}>
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: g.haut,
          height: g.hauteur,
          boxSizing: 'border-box',
          background: S.paper,
          borderRadius: R.lg,
          padding: '22px 20px 18px',
          border: `1px solid ${S.hair}`,
          fontFamily: P.sans,
          color: S.ink,
          overflow: 'hidden',
        }}
      >
        <div style={{ fontFamily: P.serif, fontSize: 22, lineHeight: '28px', letterSpacing: -0.3 }}>{A.leader.toCorrection}</div>
        <div style={{ marginTop: 4, marginBottom: 12, fontSize: 13, lineHeight: '19px', color: S.ink2 }}>{G.stopAfter}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: H.ecart }}>
          {tete.map((q) => {
            const on = q.numero === choix;
            const ligne = (
              <div
                style={{
                  height: H.ligne,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '0 12px',
                  borderRadius: R.sm,
                  border: `1px solid ${on ? S.moss : S.hair}`,
                  background: on ? S.mossTint : S.paper2,
                }}
              >
                {on ? <IoRadioButtonOn size={18} color={S.moss} /> : <IoRadioButtonOff size={18} color={S.ink3} />}
                <div style={{ fontFamily: P.mono, fontSize: 12.5, color: S.clay, width: 30 }}>{A.question.number(q.numero)}</div>
                <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: S.ink2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.enonce}</div>
                {q.numero === dernier ? <div style={{ fontSize: 11.5, fontWeight: 600, color: S.moss }}>{G.stopLast}</div> : null}
              </div>
            );
            return on ? (
              <Halo key={q.id} intensite={haloLigne} rayon={R.sm}>
                {ligne}
              </Halo>
            ) : (
              <div key={q.id}>{ligne}</div>
            );
          })}
        </div>
        <div style={{ marginTop: 14 }}>
          <Halo intensite={haloPied} rayon={8} marge={6} margeY={4} etalement={3}>
            <div style={{ height: lignesPied(coupe) * H.ligneTexte, fontSize: 12.5, lineHeight: `${H.ligneTexte}px`, color: S.ink3 }}>
              {coupe ? G.stopAfterCut(choix) : A.leader.toCorrectionConfirm}
            </div>
          </Halo>
        </div>
        <Bouton label={A.leader.toCorrection} hauteur={48} style={{ marginTop: 14, transform: `scale(${1 - 0.03 * Math.sin(Math.min(1, appui) * Math.PI)})` }} />
        <Bouton label={A.common.cancel} variante="ghost" hauteur={44} style={{ marginTop: 8 }} />
      </div>
    </div>
  );
};
