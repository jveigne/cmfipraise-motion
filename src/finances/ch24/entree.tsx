import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH24 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh24FR" component={VIDEO_CH24.Composant} durationInFrames={VIDEO_CH24.duree} fps={30} width={1920} height={1080} />
));
