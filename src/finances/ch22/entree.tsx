import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH22 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh22FR" component={VIDEO_CH22.Composant} durationInFrames={VIDEO_CH22.duree} fps={30} width={1920} height={1080} />
));
