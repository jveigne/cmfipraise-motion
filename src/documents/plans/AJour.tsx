import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoLinkOutline } from 'react-icons/io5';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Telephone } from '../../ui/Telephone';
import { DrapeauFR } from '../../ui/Drapeaux';
import { DOCS, LIEN } from '../donnees';
import { CARTONS, LEGENDES } from '../textes';
import { BASCULE_V2 } from '../calage';
import { EcranLecteur } from '../ecrans/Lecteur';
import { Couverture } from '../ui/Couverture';
import { Fondu, LegendeDocuments, borne } from './commun';

/**
 * Partie « 3 · Toujours à jour » (P8) : le document « Prière — JS Paris » est remplacé. La
 * pastille du lien ne bouge pas ; la couverture se retourne de v1 en v2 (sur l'entrée de
 * l'orchestre, `calage.ts`) ; dans deux téléphones de membres français, le lecteur passe à la v2
 * en même temps, et la v1 disparaît.
 *
 * Écart au storyboard : le storyboard reprenait les deux téléphones de P6 (Marie, Paul) pour un
 * document mondial ; le document mis à jour est désormais réservé à la France (titres de JP du
 * 20/10) — Paul ne le voit pas. Le second téléphone est donc celui de Lucie, à Lyon.
 */
export const DUREE_P8 = 270;

const COUV = { largeur: 360, x: 540 - 180, y: 690 };
const VIGNETTE = { echelle: 0.5, y: 1330, x: [210, 643] as const };

const Pastille: React.FC<{ texte: string; pouls: number }> = ({ texte, pouls }) => (
  <div style={{ position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 30px',
        borderRadius: 99,
        background: S.paper2,
        border: `2px solid ${S.moss}`,
        boxShadow: `0 12px 30px rgba(30,58,47,0.18), 0 0 0 ${pouls * 16}px rgba(30,58,47,${0.15 * (1 - pouls)})`,
        fontFamily: P.mono,
        fontWeight: 500,
        fontSize: 34,
        color: S.moss,
      }}
    >
      <IoLinkOutline size={40} color={S.moss} />
      {texte}
    </div>
  </div>
);

const Version: React.FC<{ texte: string; couleur: string }> = ({ texte, couleur }) => (
  <div
    style={{
      position: 'absolute',
      right: -26,
      top: -26,
      width: 96,
      height: 96,
      borderRadius: 48,
      background: couleur,
      color: S.white,
      fontFamily: P.mono,
      fontWeight: 500,
      fontSize: 38,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 24px rgba(42,38,32,0.25)',
    }}
  >
    {texte}
  </div>
);

export const P8Version: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const F = BASCULE_V2;
  const entree = spring({ frame: f, fps, config: { damping: 16 } });
  const vignettes = spring({ frame: f - 18, fps, config: { damping: 16 } });
  const angle = doux(f, [F, F + 18], [0, 180]);
  const v2 = angle >= 90;
  const pouls = f >= F ? borne((f - F) / 20) : 0;
  const maj = doux(f, [F + 10, F + 20], [0, 1]);
  const halo = doux(f, [F + 10, F + 18, F + 60, F + 76], [0, 1, 1, 0]);
  // La v1 se détache et tombe en s'effaçant (i F → F + 40).
  const chute = doux(f, [F + 2, F + 40], [0, 1]);
  const memeLien = doux(f, [F + 16, F + 28], [0, 1]);

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, opacity: borne(entree * 1.4), transform: `translateY(${(1 - entree) * 80}px)` }}>
        <Pastille texte={LIEN} pouls={pouls} />
        <div
          style={{
            position: 'absolute',
            top: 572,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: P.mono,
            fontSize: 26,
            letterSpacing: 3,
            color: S.mossSoft,
            opacity: memeLien,
          }}
        >
          {CARTONS.memeLien}
        </div>

        {/* La v1 qui s'en va. */}
        {chute > 0 && chute < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: COUV.x,
              top: COUV.y,
              transform: `translate(${-chute * 420}px, ${chute * 260}px) rotate(${-chute * 28}deg) scale(${1 - 0.45 * chute})`,
              opacity: 0.8 * (1 - chute),
              filter: `grayscale(${chute}) blur(${chute * 4}px)`,
            }}
          >
            <Couverture doc={DOCS.priere} largeur={COUV.largeur} version="v1" style={{ borderRadius: 10 }} />
          </div>
        ) : null}

        {/* La couverture qui se retourne. */}
        <div style={{ position: 'absolute', left: COUV.x, top: COUV.y, perspective: 1600 }}>
          <div style={{ transform: `rotateY(${v2 ? angle - 180 : angle}deg)`, position: 'relative' }}>
            <Couverture doc={DOCS.priere} largeur={COUV.largeur} version={v2 ? 'v2' : 'v1'} style={{ borderRadius: 10, boxShadow: '0 30px 60px rgba(42,38,32,0.28)' }} />
            <Version texte={v2 ? 'v2' : 'v1'} couleur={v2 ? S.moss : S.ink3} />
          </div>
        </div>
      </div>

      {/* Deux membres français, le lecteur ouvert sur le document. */}
      <div style={{ position: 'absolute', inset: 0, opacity: borne(vignettes * 1.4), transform: `translateY(${(1 - vignettes) * 200}px)` }}>
        {[CARTONS.marie, CARTONS.lucie].map((nom, i) => (
          <React.Fragment key={nom}>
            <div
              style={{
                position: 'absolute',
                left: VIGNETTE.x[i] - 40,
                width: 390 * VIGNETTE.echelle + 32 + 80,
                top: VIGNETTE.y - 56,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                fontFamily: P.sans,
                fontWeight: 600,
                fontSize: 28,
                color: S.ink,
              }}
            >
              <DrapeauFR largeur={34} />
              {nom}
            </div>
            <div
              style={{
                position: 'absolute',
                left: VIGNETTE.x[i] - 8,
                top: VIGNETTE.y - 8,
                width: 390 * VIGNETTE.echelle + 32 + 16,
                height: 844 * VIGNETTE.echelle + 32 + 16,
                borderRadius: 40,
                boxShadow: `0 0 0 4px rgba(184,106,74,${0.85 * halo}), 0 0 36px rgba(184,106,74,${0.45 * halo})`,
              }}
            />
            <Telephone x={VIGNETTE.x[i]} y={VIGNETTE.y} echelle={VIGNETTE.echelle}>
              <Fondu
                p={maj}
                avant={<EcranLecteur doc={DOCS.priere} sousTitre="Enseignements" version="v1" />}
                apres={<EcranLecteur doc={DOCS.priere} sousTitre="Enseignements" version="v2" />}
              />
            </Telephone>
          </React.Fragment>
        ))}
      </div>

      <LegendeDocuments lignes={LEGENDES.p8} duree={DUREE_P8} />
    </AbsoluteFill>
  );
};
