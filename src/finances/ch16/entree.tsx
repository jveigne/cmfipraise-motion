import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH16 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh16FR" component={VIDEO_CH16.Composant} durationInFrames={VIDEO_CH16.duree} fps={30} width={1920} height={1080} />
));
