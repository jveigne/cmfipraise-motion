import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH23 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh23FR" component={VIDEO_CH23.Composant} durationInFrames={VIDEO_CH23.duree} fps={30} width={1920} height={1080} />
));
