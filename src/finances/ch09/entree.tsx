import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH09 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh09FR" component={VIDEO_CH09.Composant} durationInFrames={VIDEO_CH09.duree} fps={30} width={1920} height={1080} />
));
