import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH19 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh19FR" component={VIDEO_CH19.Composant} durationInFrames={VIDEO_CH19.duree} fps={30} width={1920} height={1080} />
));
