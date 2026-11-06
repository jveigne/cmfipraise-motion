import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH06 } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh06FR" component={VIDEO_CH06.Composant} durationInFrames={VIDEO_CH06.duree} fps={30} width={1920} height={1080} />
));
