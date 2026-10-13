/**
 * Tous les textes de la vidéo, par langue. La version anglaise traduit directement la
 * française (brief monteur, 13/10/2026). Les libellés d'écran sont ceux de l'app
 * (utils/i18n/locales/*.json).
 */
export type Langue = 'fr' | 'en';

export type Textes = {
  /** Cartons : `*mot*` = mis en avant en bleu. Un élément = une ligne. */
  plan1: string[];
  plan2: string[];
  plan3: string[];
  plan4: string[];
  plan5: string[];
  plan6: string[];
  plan7: string[];
  plan8: string[];
  plan9: string;
  ecran: {
    titre: string;
    langue: string;
    categorie: string;
    favoris: string;
    chants: (n: number) => string;
    rechercher: string;
    zoom: string;
    pleinEcran: string;
    accords: string;
    couplet: string;
    refrain: string;
    onglets: [string, string, string, string];
  };
  /** Langue de la liste de catégories à l'ouverture (la bascule du plan 7 passe à l'autre). */
  langueListe: Langue;
  disponibleSur: string;
};

export const TEXTES: Record<Langue, Textes> = {
  fr: {
    plan1: ['Quel chant', 'pour ce *moment* ?'],
    plan2: ['*Nouveau :*', 'les chants par thème'],
    plan3: ['Trouvez vos chants', 'par *thème*'],
    plan4: ['Culte de *reconnaissance* ?', '36 chants, prêts en un geste'],
    plan5: ['Temps de *prière* et de combat ?', 'Le bon chant, tout de suite'],
    plan6: ['Même *sans connexion*'],
    plan7: ['En *français*', 'et en *anglais*'],
    plan8: ['Vos *favoris*,', 'à portée de main'],
    plan9: 'Le bon chant, au bon moment',
    ecran: {
      titre: 'Recueils',
      langue: 'Langue',
      categorie: 'Catégorie',
      favoris: 'Favoris',
      chants: (n) => `${n} chants`,
      rechercher: 'Rechercher un cantique...',
      zoom: 'Zoom',
      pleinEcran: 'Plein écran',
      accords: 'Accords',
      couplet: 'Couplet',
      refrain: 'Refrain',
      onglets: ['Accueil', 'Recueils', 'Vidéos', 'Plus'],
    },
    langueListe: 'fr',
    disponibleSur: 'Disponible sur',
  },
  en: {
    plan1: ['Which song', 'for this *moment*?'],
    plan2: ['*New:*', 'songs by theme'],
    plan3: ['Find your songs', 'by *theme*'],
    plan4: ['*Thanksgiving* service?', '36 songs, ready in one tap'],
    plan5: ['Time of *prayer* and battle?', 'The right song, right away'],
    plan6: ['Even *without a connection*'],
    plan7: ['In *French*', 'and *English*'],
    plan8: ['Your *favorites*,', 'at your fingertips'],
    plan9: 'The right song, at the right time',
    ecran: {
      titre: 'Songbooks',
      langue: 'Language',
      categorie: 'Category',
      favoris: 'Favorites',
      chants: (n) => `${n} songs`,
      rechercher: 'Search for a song...',
      zoom: 'Zoom',
      pleinEcran: 'Full screen',
      accords: 'Chords',
      couplet: 'Verse',
      refrain: 'Chorus',
      onglets: ['Home', 'Songbooks', 'Videos', 'More'],
    },
    langueListe: 'en',
    disponibleSur: 'Available on',
  },
};
