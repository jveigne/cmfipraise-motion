import React from 'react';
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoLogoApple, IoLogoGooglePlaystore } from 'react-icons/io5';
import { Textes } from '../textes';
import { Couleurs, Polices } from '../theme';
import { EcranRecueils } from '../ui/EcranRecueils';
import { Plateau } from '../ui/Plateau';
import { doux } from '../anim';

/** Plan 9 (40–45 s) : le téléphone s'efface, logo, nom, promesse, boutiques. */
export const DUREE_PLAN9 = 150;

export const Plan9Fin: React.FC<{ textes: Textes }> = ({ textes }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entree = (a: number) => spring({ frame: f - a, fps, config: { damping: 16 } });
  const glisse = (a: number) => {
    const p = spring({ frame: f - a, fps, config: { damping: 200 } });
    return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
  };

  return (
    <AbsoluteFill>
      <Plateau decalageY={doux(f, [0, 22], [0, 1400])} opacite={doux(f, [6, 22], [1, 0])}>
        <EcranRecueils textes={textes} onglet={2} tCategorie={1000} tFavoris={1000} bascule={1} />
      </Plateau>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 120 }}>
        <Img
          src={staticFile('logo.png')}
          style={{
            width: 300,
            height: 300,
            borderRadius: 68,
            boxShadow: '0 30px 70px rgba(22,104,184,0.30)',
            transform: `scale(${entree(14)})`,
          }}
        />
        <div
          style={{
            marginTop: 56,
            fontFamily: Polices.serif,
            fontWeight: 600,
            fontSize: 120,
            letterSpacing: -2,
            color: Couleurs.encre,
            ...glisse(24),
          }}
        >
          CMFIPraise
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: Polices.serif,
            fontSize: 58,
            color: Couleurs.bleuCmfi,
            textAlign: 'center',
            padding: '0 60px',
            ...glisse(34),
          }}
        >
          {textes.plan9}
        </div>
        <div style={{ marginTop: 90, display: 'flex', gap: 28, ...glisse(48) }}>
          <Boutique icone={<IoLogoApple size={52} />} haut={textes.disponibleSur} bas="App Store" />
          <Boutique icone={<IoLogoGooglePlaystore size={44} />} haut={textes.disponibleSur} bas="Google Play" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Boutique: React.FC<{ icone: React.ReactNode; haut: string; bas: string }> = ({ icone, haut, bas }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '18px 34px 18px 26px',
      borderRadius: 24,
      background: Couleurs.encre,
      color: '#fff',
      fontFamily: Polices.sans,
    }}
  >
    {icone}
    <div>
      <div style={{ fontSize: 22, opacity: 0.85 }}>{haut}</div>
      <div style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.1 }}>{bas}</div>
    </div>
  </div>
);
