import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH20 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh20FR" component={VIDEO_CH20.Composant} durationInFrames={VIDEO_CH20.duree} fps={30} width={1920} height={1080} />
));
