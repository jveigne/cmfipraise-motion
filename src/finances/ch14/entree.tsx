import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH14 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh14FR" component={VIDEO_CH14.Composant} durationInFrames={VIDEO_CH14.duree} fps={30} width={1920} height={1080} />
));
