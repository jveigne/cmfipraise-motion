import React from 'react';
import { Composition } from 'remotion';
import { FPS } from './theme';
import { DUREE_TOTALE, Video } from './Video';

export const Root: React.FC = () => (
  <>
    <Composition id="CategoriesFR" component={Video} durationInFrames={DUREE_TOTALE} fps={FPS} width={1080} height={1920} defaultProps={{ langue: 'fr' as const }} />
    <Composition id="CategoriesEN" component={Video} durationInFrames={DUREE_TOTALE} fps={FPS} width={1080} height={1920} defaultProps={{ langue: 'en' as const }} />
  </>
);
