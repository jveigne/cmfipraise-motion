/**
 * Textes de la vidéo du chapitre 1 d'« Enseignements sur les finances » (Théodore Andoseh), repris du
 * livre sans reformulation. Seules retouches : majuscule en début de phrase et coupes dans une phrase
 * (voir docs/storyboard-finances-ch1.md, § 4). `**…**` = mots mis en valeur.
 */
import type { Partie } from './moteur/frise';

export const OUVERTURE = {
  livre: 'Enseignements sur les finances',
  chapitre: 'Chapitre 1',
  titre: 'L’argent, test et thermomètre de la vie spirituelle',
  auteur: 'Théodore Andoseh',
  mention: 'UMPJ des finances',
};

export const FIN = {
  verset: 'Car là où est ton trésor, là aussi sera ton cœur.',
  reference: 'Matthieu 6.21',
};

export const PARTIES: Partie[] = [
  {
    id: 'facile',
    etiquette: 'Le plus facile',
    mode: 'pile',
    temps: [
      { texte: 'Avoir de l’argent est plus facile que la prière, plus facile que le jeûne, plus facile que l’évangélisation, plus facile que la sainteté.' },
      { texte: 'C’est pourquoi **Dieu le prend tellement au sérieux.**' },
    ],
  },
  {
    id: 'test',
    etiquette: 'Le test',
    mode: 'pile',
    temps: [
      { texte: '« Celui qui a été infidèle dans les petites choses sera infidèle dans les grandes ; et celui qui a été infidèle dans le mammon injuste sera infidèle dans les vraies richesses. »' },
      { texte: 'L’argent est **le test le plus décisif** de la spiritualité.' },
    ],
  },
  {
    id: 'polices',
    etiquette: 'Les polices d’assurance',
    mode: 'remplace',
    temps: [
      { texte: 'J’ai trouvé près de **sept polices d’assurance** dans la Bible.' },
      { texte: '« Quand tout est obscur, une lumière se lève pour l’homme droit »', reference: 'Psaume 112.4' },
      { texte: '« Il est bon que l’homme prête généreusement et gère ses affaires avec équité, car rien ne pourra jamais l’ébranler »', reference: 'Psaume 112.5-6' },
      { texte: '« On se souviendra pour toujours du juste ; il donne largement aux indigents, sa justice subsiste à toujours »', reference: 'Psaume 112.6 et 112.9' },
      { texte: '« Cherchez premièrement le royaume de Dieu et sa justice, et toutes ces choses vous seront données par-dessus »', reference: 'Matthieu 6.33' },
      { texte: '« Jette ton pain sur la face des eaux, et après plusieurs jours tu le retrouveras »', reference: 'Ecclésiaste 11.1' },
      { texte: '« Heureux les débonnaires, car ils hériteront la terre »', reference: 'Matthieu 5.5' },
      { texte: '« Je bénirai ceux qui te béniront, et je maudirai ceux qui te maudiront »', reference: 'Genèse 12.3' },
      { texte: 'La parole de Dieu dans le cœur est **une police d’assurance.**' },
    ],
  },
  {
    id: 'dime',
    etiquette: 'La dîme',
    mode: 'pile',
    temps: [
      { texte: 'La Bible dit que, à ceux qui ne donnent pas leurs dîmes, Dieu met **des trous dans leurs poches.**' },
      { texte: 'Après avoir donné la dîme, ce qu’un homme garde dans ses mains **va plus loin** que s’il avait tout l’argent.' },
      { texte: 'Ce n’est pas que ton argent soit divisé en deux parts, une pour Satan et une pour Dieu ; c’est que tu dois **détruire l’autorité de Satan sur ton argent.**' },
    ],
  },
  {
    id: 'relation',
    etiquette: 'La valeur relationnelle',
    mode: 'pile',
    temps: [
      { texte: 'On peut considérer l’argent en termes de son pouvoir d’achat ; mais il faut le considérer dans sa **valeur relationnelle.**' },
      { texte: 'Nous ne donnons pas à Dieu parce qu’il aurait besoin de cet argent.' },
      { texte: 'De la même manière qu’on prend du temps pour prier seul, nous donnons à Dieu comme un moyen de **bâtir la relation avec lui.**' },
    ],
  },
  {
    id: 'volant',
    etiquette: 'Le volant',
    mode: 'pile',
    temps: [
      { texte: 'Le cœur ne dirige pas l’argent : **c’est l’argent qui dirige le cœur.**' },
      { texte: 'Car là où est ton trésor, là aussi sera ton cœur.', reference: 'Matthieu 6.21' },
      { texte: 'Ton cœur, c’est la voiture ; l’argent que tu as, c’est le volant.' },
      { texte: '**Envoie l’argent là où tu veux que ton cœur aille.**' },
    ],
  },
  {
    id: 'revelateur',
    etiquette: 'Le révélateur',
    mode: 'pile',
    temps: [
      { texte: 'La manière dont un homme utilise son argent t’ouvre **une fenêtre sur son âme.**' },
      { texte: 'L’argent est le **papier de tournesol** qui révèle ce qu’un homme est vraiment.' },
      { texte: 'L’argent est **le langage du réveil.**' },
    ],
  },
  {
    id: 'budget',
    etiquette: 'Le budget',
    mode: 'pile',
    temps: [
      { texte: '**Regarde le budget d’un homme, et tu verras son dieu,** son amour, sa passion, son but, ce qui compte pour lui.' },
    ],
  },
];

/** Libellés écrits dans les illustrations : tous repris du texte du chapitre. */
export const LIBELLES = {
  marches: ['la prière', 'le jeûne', 'l’évangélisation', 'la sainteté'],
  balance: [
    ['les petites choses', 'les grandes'],
    ['le mammon injuste', 'les vraies richesses'],
  ],
  police: 'Police',
  avant: 'pouvoir d’achat',
  apres: 'valeur relationnelle',
  coeur: 'ton cœur',
  argent: 'l’argent',
  tresor: 'ton trésor',
  budget: 'Budget',
  lignes: ['son dieu', 'son amour', 'sa passion', 'son but', 'ce qui compte pour lui'],
};
