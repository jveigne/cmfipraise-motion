import { creerVideo } from '../moteur/Video';
import { ILLUSTRATIONS } from './Illustrations';
import { REGLAGES } from './reglages';
import { FIN, OUVERTURE, PARTIES } from './textes.gen';

/** Chapitre 20 d'« Enseignements sur les finances ». Storyboard : docs/storyboard-finances-ch20.md. */
export const VIDEO_CH20 = creerVideo({
  ouverture: OUVERTURE,
  fin: FIN,
  parties: PARTIES.map((p) => ({ ...p, ...REGLAGES[p.id] })),
  illustrations: ILLUSTRATIONS,
});
