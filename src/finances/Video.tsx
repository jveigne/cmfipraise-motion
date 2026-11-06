import { creerVideo } from './moteur/Video';
import { FIN, OUVERTURE, PARTIES } from './textes';
import { ILLUSTRATIONS } from './ui/Illustrations';

/** Chapitre 1 d'« Enseignements sur les finances ». Storyboard : docs/storyboard-finances-ch1.md. */
const VIDEO = creerVideo({ ouverture: OUVERTURE, fin: FIN, parties: PARTIES, illustrations: ILLUSTRATIONS });

export const VideoFinancesCh1 = VIDEO.Composant;
export const DUREE_FINANCES_CH1 = VIDEO.duree;
