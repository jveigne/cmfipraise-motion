/**
 * Images fixes de contrôle de la vidéo « Finances, chapitre 1 » : pour chaque plan, une image vers la
 * fin de chaque phrase et une juste avant la sortie, dans out/stills/finances-ch1/. Usage :
 *   node scripts/stills-finances.mjs [id1,id2,…]
 */
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const seuls = process.argv[2] ? process.argv[2].split(',') : null;
const racine = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const sortie = path.join(racine, 'out', 'stills', 'finances-ch1');
fs.mkdirSync(sortie, { recursive: true });

const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR ?? '/tmp', 'frise-'));
execFileSync('npx', ['tsc', 'src/finances/frise.ts', '--outDir', tmp, '--module', 'commonjs', '--target', 'es2020', '--skipLibCheck'], { cwd: racine, stdio: 'ignore' });
const { FRISE, DUREE_FINANCES_CH1 } = createRequire(import.meta.url)(path.join(tmp, 'frise.js'));

const serveUrl = await bundle({ entryPoint: path.join(racine, 'src', 'index.ts') });
const composition = await selectComposition({ serveUrl, id: 'FinancesCh1FR' });
for (const [n, e] of FRISE.entries()) {
  if (seuls && !seuls.includes(e.id)) continue;
  const images = e.debuts.length
    ? e.debuts.map((d, i) => (i + 1 < e.debuts.length ? e.debuts[i + 1] - 12 : e.duree - 4))
    : [Math.round(e.duree * 0.2), e.duree - 4];
  for (const [i, image] of images.entries()) {
    await renderStill({ serveUrl, composition, frame: e.debut + image, output: path.join(sortie, `${String(n).padStart(2, '0')}-${e.id}-${i}.png`) });
  }
  process.stdout.write(`${e.id}:${e.debut}+${e.duree} `);
}
console.log(`\ntotal ${DUREE_FINANCES_CH1} images = ${(DUREE_FINANCES_CH1 / 30).toFixed(1)} s\n${sortie}`);
