import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH15 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh15FR" component={VIDEO_CH15.Composant} durationInFrames={VIDEO_CH15.duree} fps={30} width={1920} height={1080} />
));
