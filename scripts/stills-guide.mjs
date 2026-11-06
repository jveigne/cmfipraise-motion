/**
 * Images fixes de contrôle de la vidéo « Guide » : un seul bundle, une image au milieu de chaque
 * plan (et une près de la fin), dans out/stills/guide-<langue>/. Usage :
 *   node scripts/stills-guide.mjs fr|en [id1,id2,…]
 */
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const langue = process.argv[2] ?? 'fr';
const seuls = process.argv[3] ? process.argv[3].split(',') : null;
const racine = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const sortie = path.join(racine, 'out', 'stills', `guide-${langue}`);
fs.mkdirSync(sortie, { recursive: true });

// La frise (timecodes) : compilée à la volée par tsc dans un dossier temporaire.
const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR ?? '/tmp', 'frise-'));
execFileSync('npx', ['tsc', 'src/guide/frise.ts', '--outDir', tmp, '--module', 'commonjs', '--target', 'es2020', '--skipLibCheck'], { cwd: racine, stdio: 'ignore' });
const { createRequire } = await import('node:module');
const { FRISE } = createRequire(import.meta.url)(path.join(tmp, 'guide', 'frise.js'));

const serveUrl = await bundle({ entryPoint: path.join(racine, 'src', 'index.ts') });
const id = langue === 'en' ? 'GuideEN' : 'GuideFR';
const composition = await selectComposition({ serveUrl, id, inputProps: { langue } });
for (const e of FRISE) {
  if (seuls && !seuls.includes(e.id)) continue;
  for (const [suffixe, image] of [['a', e.debut + Math.round(e.duree * 0.55)], ['b', e.debut + e.duree - 4]]) {
    await renderStill({ serveUrl, composition, frame: image, output: path.join(sortie, `${String(FRISE.indexOf(e)).padStart(2, '0')}-${e.id}-${suffixe}.png`), inputProps: { langue } });
  }
  process.stdout.write(`${e.id} `);
}
console.log('\n' + sortie);
