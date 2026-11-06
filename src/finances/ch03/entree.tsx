import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH03 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh03FR" component={VIDEO_CH03.Composant} durationInFrames={VIDEO_CH03.duree} fps={30} width={1920} height={1080} />
));
