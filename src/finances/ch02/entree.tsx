import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH02 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh02FR" component={VIDEO_CH02.Composant} durationInFrames={VIDEO_CH02.duree} fps={30} width={1920} height={1080} />
));
