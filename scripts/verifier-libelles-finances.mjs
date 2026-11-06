/**
 * Série « Enseignements sur les finances » : contrôle automatique d'un chapitre.
 *   node scripts/verifier-libelles-finances.mjs N
 *
 * 1. Les textes générés correspondent toujours au storyboard.
 * 2. Tous les mots de `libelles.ts` se retrouvent dans le texte du chapitre.
 * 3. `Illustrations.tsx` n'écrit aucun mot en dur.
 * 4. Chaque plan a son illustration.
 *
 * Le texte du chapitre est lu dans le dossier passé par la variable CHAPITRES_FINANCES.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const n = Number(process.argv[2]);
const nn = String(n).padStart(2, '0');
const racine = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dossier = path.join(racine, 'src', 'finances', `ch${nn}`);
const norme = (t) => t.toLowerCase().replace(/[’ʼ]/g, "'").replace(/[  ]/g, ' ').replace(/[«»“”"]/g, '').replace(/\s+/g, ' ').trim();
const erreurs = [];

// 1. Textes générés.
const avant = fs.readFileSync(path.join(dossier, 'textes.gen.ts'), 'utf8');
execFileSync('node', [path.join(racine, 'scripts', 'generer-finances.mjs'), String(n)], { stdio: 'ignore' });
if (fs.readFileSync(path.join(dossier, 'textes.gen.ts'), 'utf8') !== avant) erreurs.push('textes.gen.ts ne correspondait pas au storyboard (il vient d’être régénéré).');

// 2. Libellés.
const source = norme(fs.readFileSync(path.join(process.env.CHAPITRES_FINANCES, `ch${nn}.md`), 'utf8'));
const libelles = fs.readFileSync(path.join(dossier, 'libelles.ts'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const chaines = [...libelles.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)].map((m) => (m[1] ?? m[2]).replace(/\\(.)/g, '$1'));
for (const c of chaines) if (c.trim() && !source.includes(norme(c))) erreurs.push(`Libellé absent du chapitre : « ${c} »`);

// 3. Mots en dur dans les illustrations.
const illu = fs.readFileSync(path.join(dossier, 'Illustrations.tsx'), 'utf8');
const durs = [...illu.matchAll(/>\s*([A-Za-zÀ-ÿ][^<>{}]*?)\s*</g)].map((m) => m[1]).filter((t) => /[a-zà-ÿ]{2}/i.test(t) && !/=>|\b(const|return|Record|React)\b/.test(t));
for (const d of durs) erreurs.push(`Mot écrit en dur dans Illustrations.tsx : « ${d} »`);

// 4. Illustration de chaque plan.
const ids = [...avant.matchAll(/"id": "(p\d+)"/g)].map((m) => m[1]);
for (const id of ['ouverture', ...ids, 'fin']) if (!new RegExp(`\\b${id}\\s*:`).test(illu)) erreurs.push(`Pas d’illustration pour ${id}`);

console.log(erreurs.length ? `À CORRIGER (${erreurs.length}) :\n${erreurs.join('\n')}` : `Chapitre ${n} : contrôle automatique sans erreur (${chaines.length} libellés).`);
process.exit(erreurs.length ? 1 : 0);
