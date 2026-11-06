import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH13 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh13FR" component={VIDEO_CH13.Composant} durationInFrames={VIDEO_CH13.duree} fps={30} width={1920} height={1080} />
));
