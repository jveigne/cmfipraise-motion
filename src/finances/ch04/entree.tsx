import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH04 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh04FR" component={VIDEO_CH04.Composant} durationInFrames={VIDEO_CH04.duree} fps={30} width={1920} height={1080} />
));
