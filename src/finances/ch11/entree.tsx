import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH11 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh11FR" component={VIDEO_CH11.Composant} durationInFrames={VIDEO_CH11.duree} fps={30} width={1920} height={1080} />
));
