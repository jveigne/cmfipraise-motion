import { creerVideo } from '../moteur/Video';
import { ILLUSTRATIONS } from './Illustrations';
import { REGLAGES } from './reglages';
import { FIN, OUVERTURE, PARTIES } from './textes.gen';

/** Chapitre 15 d'« Enseignements sur les finances ». Storyboard : docs/storyboard-finances-ch15.md. */
export const VIDEO_CH15 = creerVideo({
  ouverture: OUVERTURE,
  fin: FIN,
  parties: PARTIES.map((p) => ({ ...p, ...REGLAGES[p.id] })),
  illustrations: ILLUSTRATIONS,
});
