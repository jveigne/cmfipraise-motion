import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH08 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh08FR" component={VIDEO_CH08.Composant} durationInFrames={VIDEO_CH08.duree} fps={30} width={1920} height={1080} />
));
