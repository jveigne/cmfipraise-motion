import { S } from '../evenements/theme';

/**
 * Données fictives de la vidéo « Documents » (storyboard § 4, titres finaux de JP le 20/10/2026).
 * Les fichiers du problème (P1–P3) reviennent rangés dans l'app sous ces titres.
 */

export type Portee = 'monde' | 'FR' | 'CM';

export interface Doc {
  titre: string;
  portee: Portee;
  pages: number;
  /** Couverture dessinée en code (aplats + titre Fraunces). */
  couverture: { fond: string; motif: string; surtitre: string; lignes: readonly string[] };
}

export const DOCS = {
  /** P1 `UMPJ_Retranscript_Enseignement_TA.pdf` → tout le ministère ; ouvert en P7, partagé en P9. */
  umpj: {
    titre: "UMPJ — Retranscription de l'enseignement TA",
    portee: 'monde',
    pages: 12,
    couverture: { fond: S.moss, motif: S.earth, surtitre: 'UMPJ', lignes: ['Retranscription', 'de l’enseignement', 'TA'] },
  },
  /** P2 `priere_JS_paris.pdf` et ses copies → France, une seule version (mise à jour en P8). */
  priere: {
    titre: 'Prière — JS Paris',
    portee: 'FR',
    pages: 4,
    couverture: { fond: S.earthDeep, motif: S.parchment, surtitre: 'JS Paris', lignes: ['Prière'] },
  },
  /** P3 `programme_national_france.pdf` → France. */
  programme: {
    titre: 'Programme national',
    portee: 'FR',
    pages: 6,
    couverture: { fond: S.clay, motif: S.parchment, surtitre: 'France', lignes: ['Programme', 'national'] },
  },
  convention: {
    titre: 'Convention nationale — Douala',
    portee: 'CM',
    pages: 8,
    couverture: { fond: S.mossSoft, motif: S.earth, surtitre: 'Cameroun', lignes: ['Convention', 'nationale', 'Douala'] },
  },
} as const satisfies Record<string, Doc>;

/** Pages offertes de l'aperçu (P9) : 5 sur 12, il en reste 7 (storyboard § 4). */
export const PAGES_OFFERTES = 5;

/** Libellé de portée sur une ligne (`scopeLabel` de app/documents/index.tsx l. 117-119). */
export const libellePortee = (p: Portee) => (p === 'monde' ? 'Tout le ministère' : p === 'FR' ? 'France' : 'Cameroun');

/** Ce que chacun voit dans son espace Documents (P6) : RG-FOLDER-02, le serveur filtre. */
export const VUE_MARIE = [DOCS.umpj, DOCS.priere, DOCS.programme] as const;
export const VUE_PAUL = [DOCS.umpj, DOCS.convention] as const;

/** Dossiers de l'espace (P7) et leur nombre de documents (récursif, visible par Marie). */
export const DOSSIERS = [
  { nom: 'Enseignements', compte: 2 },
  { nom: 'Formation des dirigeants', compte: 3 },
  { nom: 'Programmes', compte: 1 },
] as const;

/** Contenu du dossier « Enseignements » (P7) : l'enseignement mondial et la prière de la France. */
export const DOSSIER_ENSEIGNEMENTS = [DOCS.umpj, DOCS.priere] as const;

/** Lien de partage (fictif) : `https://www.shephr.org/d/{slug}`, slug base62 de 10 caractères. */
export const SLUG = 'k7Qm2xPa9T';
export const LIEN = `www.shephr.org/d/${SLUG}`;
export const URL_PARTAGE = `https://${LIEN}`;

/** Initiales de Marie (fictive : Marie Laurent) pour l'accueil. */
export const MARIE = { prenom: 'Marie', initiales: 'ML' } as const;
