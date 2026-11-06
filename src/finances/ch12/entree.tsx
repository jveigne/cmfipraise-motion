import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH12 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh12FR" component={VIDEO_CH12.Composant} durationInFrames={VIDEO_CH12.duree} fps={30} width={1920} height={1080} />
));
