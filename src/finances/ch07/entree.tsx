import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH07 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh07FR" component={VIDEO_CH07.Composant} durationInFrames={VIDEO_CH07.duree} fps={30} width={1920} height={1080} />
));
