import { creerVideo } from '../moteur/Video';
import { ILLUSTRATIONS } from './Illustrations';
import { REGLAGES } from './reglages';
import { FIN, OUVERTURE, PARTIES } from './textes.gen';

/** Chapitre 13 d'« Enseignements sur les finances ». Storyboard : docs/storyboard-finances-ch13.md. */
export const VIDEO_CH13 = creerVideo({
  ouverture: OUVERTURE,
  fin: FIN,
  parties: PARTIES.map((p) => ({ ...p, ...REGLAGES[p.id] })),
  illustrations: ILLUSTRATIONS,
});
