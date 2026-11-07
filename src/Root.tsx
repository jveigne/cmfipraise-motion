import React from 'react';
import { Composition, Still } from 'remotion';
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
import { DUREE_FINANCES_CH1, VideoFinancesCh1, VignetteFinancesCh1 } from './finances/Video';
import { VIDEO_CH02 } from './finances/ch02/index';
import { VIDEO_CH03 } from './finances/ch03/index';
import { VIDEO_CH04 } from './finances/ch04/index';
import { VIDEO_CH05 } from './finances/ch05/index';
import { VIDEO_CH06 } from './finances/ch06/index';
import { VIDEO_CH07 } from './finances/ch07/index';
import { VIDEO_CH08 } from './finances/ch08/index';
import { VIDEO_CH09 } from './finances/ch09/index';
import { VIDEO_CH10 } from './finances/ch10/index';
import { VIDEO_CH11 } from './finances/ch11/index';
import { VIDEO_CH12 } from './finances/ch12/index';
import { VIDEO_CH13 } from './finances/ch13/index';
import { VIDEO_CH14 } from './finances/ch14/index';
import { VIDEO_CH15 } from './finances/ch15/index';
import { VIDEO_CH16 } from './finances/ch16/index';
import { VIDEO_CH17 } from './finances/ch17/index';
import { VIDEO_CH18 } from './finances/ch18/index';
import { VIDEO_CH19 } from './finances/ch19/index';
import { VIDEO_CH20 } from './finances/ch20/index';
import { VIDEO_CH21 } from './finances/ch21/index';
import { VIDEO_CH22 } from './finances/ch22/index';
import { VIDEO_CH23 } from './finances/ch23/index';
import { VIDEO_CH24 } from './finances/ch24/index';
import { VIDEO_CH25 } from './finances/ch25/index';

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
    <Composition id="FinancesCh02FR" component={VIDEO_CH02.Composant} durationInFrames={VIDEO_CH02.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh03FR" component={VIDEO_CH03.Composant} durationInFrames={VIDEO_CH03.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh04FR" component={VIDEO_CH04.Composant} durationInFrames={VIDEO_CH04.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh05FR" component={VIDEO_CH05.Composant} durationInFrames={VIDEO_CH05.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh06FR" component={VIDEO_CH06.Composant} durationInFrames={VIDEO_CH06.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh07FR" component={VIDEO_CH07.Composant} durationInFrames={VIDEO_CH07.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh08FR" component={VIDEO_CH08.Composant} durationInFrames={VIDEO_CH08.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh09FR" component={VIDEO_CH09.Composant} durationInFrames={VIDEO_CH09.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh10FR" component={VIDEO_CH10.Composant} durationInFrames={VIDEO_CH10.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh11FR" component={VIDEO_CH11.Composant} durationInFrames={VIDEO_CH11.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh12FR" component={VIDEO_CH12.Composant} durationInFrames={VIDEO_CH12.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh13FR" component={VIDEO_CH13.Composant} durationInFrames={VIDEO_CH13.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh14FR" component={VIDEO_CH14.Composant} durationInFrames={VIDEO_CH14.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh15FR" component={VIDEO_CH15.Composant} durationInFrames={VIDEO_CH15.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh16FR" component={VIDEO_CH16.Composant} durationInFrames={VIDEO_CH16.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh17FR" component={VIDEO_CH17.Composant} durationInFrames={VIDEO_CH17.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh18FR" component={VIDEO_CH18.Composant} durationInFrames={VIDEO_CH18.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh19FR" component={VIDEO_CH19.Composant} durationInFrames={VIDEO_CH19.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh20FR" component={VIDEO_CH20.Composant} durationInFrames={VIDEO_CH20.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh21FR" component={VIDEO_CH21.Composant} durationInFrames={VIDEO_CH21.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh22FR" component={VIDEO_CH22.Composant} durationInFrames={VIDEO_CH22.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh23FR" component={VIDEO_CH23.Composant} durationInFrames={VIDEO_CH23.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh24FR" component={VIDEO_CH24.Composant} durationInFrames={VIDEO_CH24.duree} fps={FPS} width={1920} height={1080} />
    <Composition id="FinancesCh25FR" component={VIDEO_CH25.Composant} durationInFrames={VIDEO_CH25.duree} fps={FPS} width={1920} height={1080} />
    {/* Vignettes YouTube de la série finances (rendues par scripts/vignettes-finances.sh). */}
    <Still id="VignetteFinancesCh01" component={VignetteFinancesCh1} width={1920} height={1080} />
    <Still id="VignetteFinancesCh02" component={VIDEO_CH02.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh03" component={VIDEO_CH03.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh04" component={VIDEO_CH04.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh05" component={VIDEO_CH05.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh06" component={VIDEO_CH06.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh07" component={VIDEO_CH07.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh08" component={VIDEO_CH08.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh09" component={VIDEO_CH09.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh10" component={VIDEO_CH10.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh11" component={VIDEO_CH11.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh12" component={VIDEO_CH12.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh13" component={VIDEO_CH13.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh14" component={VIDEO_CH14.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh15" component={VIDEO_CH15.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh16" component={VIDEO_CH16.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh17" component={VIDEO_CH17.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh18" component={VIDEO_CH18.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh19" component={VIDEO_CH19.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh20" component={VIDEO_CH20.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh21" component={VIDEO_CH21.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh22" component={VIDEO_CH22.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh23" component={VIDEO_CH23.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh24" component={VIDEO_CH24.Vignette} width={1920} height={1080} />
    <Still id="VignetteFinancesCh25" component={VIDEO_CH25.Vignette} width={1920} height={1080} />
  </>
);
