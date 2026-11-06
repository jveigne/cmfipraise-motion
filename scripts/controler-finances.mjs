/**
 * Série « Enseignements sur les finances » : images de contrôle d'un chapitre, depuis son entrée isolée.
 *   node scripts/controler-finances.mjs N [--plans p3,p4,fin] [--pas K]
 *
 * Pour chaque plan : une image à la fin de chaque phrase (`-tI`), et, avec `--pas K`, K images
 * réparties pendant chaque phrase pour voir le mouvement (`-tI-mJ`). Sortie : out/stills/finances-chNN/.
 * Affiche aussi le chemin de chaque image et les pages calculées pour le texte.
 */
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const args = process.argv.slice(2);
const n = Number(args[0]);
const nn = String(n).padStart(2, '0');
const opt = (nom) => (args.includes(nom) ? args[args.indexOf(nom) + 1] : null);
const seuls = opt('--plans')?.split(',') ?? null;
const pas = Number(opt('--pas') ?? 0);

const racine = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const sortie = path.join(racine, 'out', 'stills', `finances-ch${nn}`);
fs.mkdirSync(sortie, { recursive: true });

const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR ?? '/tmp', 'frise-'));
try {
  execFileSync('npx', ['tsc', `src/finances/ch${nn}/textes.gen.ts`, 'src/finances/moteur/frise.ts', '--outDir', tmp, '--rootDir', 'src/finances', '--module', 'commonjs', '--target', 'es2020', '--skipLibCheck'], { cwd: racine, stdio: 'ignore' });
} catch {
  /* tsc signale des erreurs de types mais écrit quand même les fichiers. */
}
const req = createRequire(import.meta.url);
const { construireFrise, paginer } = req(path.join(tmp, 'moteur', 'frise.js'));
const { PARTIES } = req(path.join(tmp, `ch${nn}`, 'textes.gen.js'));
const FRISE = construireFrise(PARTIES);

const serveUrl = await bundle({ entryPoint: path.join(racine, 'src', 'finances', `ch${nn}`, 'entree.tsx') });
const composition = await selectComposition({ serveUrl, id: `FinancesCh${nn}FR` });
console.log(`Durée : ${composition.durationInFrames} images = ${(composition.durationInFrames / 30).toFixed(1)} s`);

for (const e of FRISE) {
  if (seuls && !seuls.includes(e.id)) continue;
  const bornes = e.debuts.length ? e.debuts.map((d, i) => [d, i + 1 < e.debuts.length ? e.debuts[i + 1] - 12 : e.duree - 4]) : [[0, e.duree - 30]];
  for (const [i, [a, b]] of bornes.entries()) {
    const images = [[`t${i}`, b]];
    for (let k = 1; k <= pas; k++) images.push([`t${i}-m${k}`, Math.round(a + ((b - a) * k) / (pas + 1))]);
    for (const [nom, image] of images) {
      const f = path.join(sortie, `${e.id}-${nom}.png`);
      await renderStill({ serveUrl, composition, frame: e.debut + image, output: f });
      console.log(f);
    }
  }
  if (e.partie) console.log(`${e.id} : pages estimées qui commencent aux phrases ${JSON.stringify(paginer(e.partie))}`);
}

// Ne laisse rien dans le dossier temporaire : chaque bundle pèse plusieurs dizaines de Mo.
fs.rmSync(serveUrl, { recursive: true, force: true });
fs.rmSync(tmp, { recursive: true, force: true });
