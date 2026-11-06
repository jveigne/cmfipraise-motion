import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH25 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh25FR" component={VIDEO_CH25.Composant} durationInFrames={VIDEO_CH25.duree} fps={30} width={1920} height={1080} />
));
