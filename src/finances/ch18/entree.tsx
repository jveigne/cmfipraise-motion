import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH18 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh18FR" component={VIDEO_CH18.Composant} durationInFrames={VIDEO_CH18.duree} fps={30} width={1920} height={1080} />
));
