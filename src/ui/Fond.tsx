import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Couleurs } from '../theme';

/** Fond clair de l'app, avec deux halos bleus qui dérivent lentement. */
export const Fond: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: Couleurs.page, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          left: -420 + Math.sin(f / 90) * 40,
          top: 900 + Math.cos(f / 110) * 40,
          background: 'radial-gradient(circle, rgba(22,104,184,0.13), rgba(22,104,184,0) 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          right: -380 + Math.cos(f / 100) * 40,
          top: -260 + Math.sin(f / 80) * 30,
          background: 'radial-gradient(circle, rgba(22,104,184,0.10), rgba(22,104,184,0) 70%)',
        }}
      />
    </AbsoluteFill>
  );
};
