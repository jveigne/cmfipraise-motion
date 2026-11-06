import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH05 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh05FR" component={VIDEO_CH05.Composant} durationInFrames={VIDEO_CH05.duree} fps={30} width={1920} height={1080} />
));
