import React from 'react';
import { Composition } from 'remotion';
import { FPS } from './theme';
import { DUREE_TOTALE, Video } from './Video';
import { DUREE_EVENEMENTS, VideoEvenements } from './evenements/Video';
import { DUREE_JOURNAL, VideoJournal } from './journal/Video';
import { DUREE_DOCUMENTS, VideoDocuments } from './documents/Video';
import { DUREE_ETUDE, VideoEtude } from './etude/Video';
import { DUREE_GUIDE, PropsGuide, VideoGuide } from './guide/Video';
import { DUREE_BERTOUA, VideoBertoua } from './bertoua/Video';
import { DUREE_NEHEMIE, VideoNehemie } from './nehemie/Video';
import { DUREE_CALEB, VideoCaleb } from './caleb/Video';
import { DUREE_GRATUIT, VideoGratuit } from './gratuit/Video';
import { DUREE_FINANCES_CH1, VideoFinancesCh1 } from './finances/Video';

export const Root: React.FC = () => (
  <>
    <Composition id="CategoriesFR" component={Video} durationInFrames={DUREE_TOTALE} fps={FPS} width={1080} height={1920} defaultProps={{ langue: 'fr' as const }} />
    <Composition id="CategoriesEN" component={Video} durationInFrames={DUREE_TOTALE} fps={FPS} width={1080} height={1920} defaultProps={{ langue: 'en' as const }} />
    <Composition id="EvenementsFR" component={VideoEvenements} durationInFrames={DUREE_EVENEMENTS} fps={FPS} width={1080} height={1920} />
    <Composition id="JournalFR" component={VideoJournal} durationInFrames={DUREE_JOURNAL} fps={FPS} width={1080} height={1920} defaultProps={{ langue: 'fr' as const }} />
    <Composition id="JournalEN" component={VideoJournal} durationInFrames={DUREE_JOURNAL} fps={FPS} width={1080} height={1920} defaultProps={{ langue: 'en' as const }} />
    <Composition id="DocumentsFR" component={VideoDocuments} durationInFrames={DUREE_DOCUMENTS} fps={FPS} width={1080} height={1920} />
    <Composition id="EtudeFR" component={VideoEtude} durationInFrames={DUREE_ETUDE} fps={FPS} width={1080} height={1920} defaultProps={{ langue: 'fr' as const }} />
    <Composition id="EtudeEN" component={VideoEtude} durationInFrames={DUREE_ETUDE} fps={FPS} width={1080} height={1920} defaultProps={{ langue: 'en' as const }} />
    {/* Guide 16:9 (JP 26/10) : props facultatives `voix` (fichier de public/) et `musique` (défaut true). */}
    <Composition id="GuideFR" component={VideoGuide} durationInFrames={DUREE_GUIDE} fps={FPS} width={1920} height={1080} defaultProps={{ langue: 'fr', musique: true } as PropsGuide} />
    <Composition id="GuideEN" component={VideoGuide} durationInFrames={DUREE_GUIDE} fps={FPS} width={1920} height={1080} defaultProps={{ langue: 'en', musique: true } as PropsGuide} />
    {/* Offres Caleb / Néhémie (plan 05 du 27/10, §9) : 9:16, français, sans prix. */}
    <Composition id="BertouaFR" component={VideoBertoua} durationInFrames={DUREE_BERTOUA} fps={FPS} width={1080} height={1920} />
    <Composition id="NehemieFR" component={VideoNehemie} durationInFrames={DUREE_NEHEMIE} fps={FPS} width={1080} height={1920} />
    <Composition id="CalebFR" component={VideoCaleb} durationInFrames={DUREE_CALEB} fps={FPS} width={1080} height={1920} />
    <Composition id="GratuitFR" component={VideoGratuit} durationInFrames={DUREE_GRATUIT} fps={FPS} width={1080} height={1920} />
    {/* Enseignements sur les finances, chapitre 1 : YouTube, 16:9, sans voix ni musique. */}
    <Composition id="FinancesCh1FR" component={VideoFinancesCh1} durationInFrames={DUREE_FINANCES_CH1} fps={FPS} width={1920} height={1080} />
  </>
);
