import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH21 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh21FR" component={VIDEO_CH21.Composant} durationInFrames={VIDEO_CH21.duree} fps={30} width={1920} height={1080} />
));
