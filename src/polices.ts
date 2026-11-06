/**
 * Chargement des polices depuis `public/fonts/` (fichiers latin des paquets `@fontsource/*`).
 *
 * Remplace `@remotion/google-fonts` (14/10/2026) : ce dernier télécharge les polices sur
 * fonts.gstatic.com à chaque rendu, et un réseau sans accès à Google faisait échouer le rendu
 * (« Timeout … Fetching … font »). En local, le rendu ne dépend plus d'Internet. Pour ajouter une
 * graisse : copier `node_modules/@fontsource/<police>/files/<police>-latin-<graisse>-<style>.woff2`
 * dans `public/fonts/` et l'ajouter à l'appel ci-dessous.
 */
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

type Style = 'normal' | 'italic';

/** Charge les graisses d'une police et renvoie son nom de famille CSS. */
export const chargerPolice = (
  famille: string,
  fichier: string,
  graisses: Partial<Record<Style, string[]>>,
): string => {
  for (const [style, liste] of Object.entries(graisses) as [Style, string[]][]) {
    for (const graisse of liste) {
      loadFont({
        family: famille,
        url: staticFile(`fonts/${fichier}-latin-${graisse}-${style}.woff2`),
        weight: graisse,
        style,
      });
    }
  }
  return famille;
};
