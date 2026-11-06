/**
 * Série « Enseignements sur les finances » : génère les textes d'un chapitre depuis son storyboard.
 *   node scripts/generer-finances.mjs 2 3 …   (sans argument : chapitres 2 à 25)
 *
 * `src/finances/chNN/textes.gen.ts` est réécrit à chaque fois : le texte à l'écran vient toujours du § 4
 * de `docs/storyboard-finances-chNN.md`, on ne le retape jamais. Les autres fichiers du dossier ne sont
 * créés que s'ils n'existent pas.
 */
import fs from 'node:fs';
import path from 'node:path';

const racine = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const liste = process.argv.slice(2).map(Number);
const chapitres = liste.length ? liste : Array.from({ length: 24 }, (_, i) => i + 2);

const typo = (t) => t.replace(/'/g, '’');

const ligne = (l) => {
  const m = l.slice(2).trim().match(/^(.*?)(?:\s+\[([^\]]+)\])?$/);
  const t = { texte: typo(m[1]) };
  if (m[2]) t.reference = typo(m[2]);
  return t;
};

export const lireStoryboard = (n) => {
  const nn = String(n).padStart(2, '0');
  const doc = fs.readFileSync(path.join(racine, 'docs', `storyboard-finances-ch${nn}.md`), 'utf8');
  const s4 = doc.split(/^## 4\..*$/m)[1].split(/^## 5\./m)[0];
  const plans = s4.split(/^### /m).slice(1).map((b) => {
    const [titre, ...reste] = b.split('\n');
    const m = titre.trim().match(/^Plan (\d+)\s*[—-]\s*(.*)$/);
    return { numero: Number(m[1]), nom: typo(m[2]), lignes: reste.filter((x) => x.startsWith('- ')).map(ligne) };
  });
  return { nn, plans };
};

const ecrireSiAbsent = (f, contenu) => {
  if (!fs.existsSync(f)) fs.writeFileSync(f, contenu);
};

for (const n of chapitres) {
  const { nn, plans } = lireStoryboard(n);
  const dossier = path.join(racine, 'src', 'finances', `ch${nn}`);
  fs.mkdirSync(dossier, { recursive: true });
  const titre = plans[0].lignes[0].texte.replace(/\*\*/g, '');
  const fin = plans[plans.length - 1].lignes[0];
  const parties = plans.slice(1, -1).map((p) => ({ id: `p${p.numero}`, etiquette: p.nom, mode: 'auto', temps: p.lignes }));
  fs.writeFileSync(
    path.join(dossier, 'textes.gen.ts'),
    `// Généré par scripts/generer-finances.mjs depuis docs/storyboard-finances-ch${nn}.md (§ 4). Ne pas modifier à la main.
import type { Partie } from '../moteur/frise';

export const OUVERTURE = ${JSON.stringify({ livre: 'Enseignements sur les finances', chapitre: `Chapitre ${n}`, titre, auteur: 'Théodore Andoseh', mention: 'UMPJ des finances' }, null, 2)};

export const FIN: { verset: string; reference?: string } = ${JSON.stringify({ verset: fin.texte, ...(fin.reference ? { reference: fin.reference } : {}) }, null, 2)};

export const PARTIES: Partie[] = ${JSON.stringify(parties, null, 2)};
`,
  );
  ecrireSiAbsent(
    path.join(dossier, 'reglages.ts'),
    `import type { Partie } from '../moteur/frise';

/**
 * Réglages de mise en page du texte, par plan (ex. p3 : { taille: 42 } ou { pages: [2] } ou { mode: 'remplace' }).
 * Le texte lui-même vient du storyboard et ne se règle pas ici.
 */
export const REGLAGES: Record<string, Partial<Pick<Partie, 'mode' | 'pages' | 'taille'>>> = {};
`,
  );
  ecrireSiAbsent(
    path.join(dossier, 'libelles.ts'),
    `/** Tous les mots écrits dans les illustrations de ce chapitre : ils doivent venir du texte du chapitre. */
export const LIBELLES = {} as const;
`,
  );
  ecrireSiAbsent(
    path.join(dossier, 'index.ts'),
    `import { creerVideo } from '../moteur/Video';
import { ILLUSTRATIONS } from './Illustrations';
import { REGLAGES } from './reglages';
import { FIN, OUVERTURE, PARTIES } from './textes.gen';

/** Chapitre ${n} d'« Enseignements sur les finances ». Storyboard : docs/storyboard-finances-ch${nn}.md. */
export const VIDEO_CH${nn} = creerVideo({
  ouverture: OUVERTURE,
  fin: FIN,
  parties: PARTIES.map((p) => ({ ...p, ...REGLAGES[p.id] })),
  illustrations: ILLUSTRATIONS,
});
`,
  );
  ecrireSiAbsent(
    path.join(dossier, 'entree.tsx'),
    `import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { VIDEO_CH${nn} } from './index';

/** Entrée isolée, pour contrôler ce chapitre sans dépendre des autres. */
registerRoot(() => (
  <Composition id="FinancesCh${nn}FR" component={VIDEO_CH${nn}.Composant} durationInFrames={VIDEO_CH${nn}.duree} fps={30} width={1920} height={1080} />
));
`,
  );
  console.log(`ch${nn} : ${parties.length} parties`);
}
