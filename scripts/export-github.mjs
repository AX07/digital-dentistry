// Builds github/: exactly the files to upload to the site's GitHub repository.
// Run with `npm run export`. The folder is rebuilt from scratch each time, so edit
// the project files, never the copies inside github/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'github');

// the settings file: clinic.config.js for the clinic templates, site.config.js for the others
const configFile = ['clinic.config.js', 'site.config.js'].find(f => fs.existsSync(path.join(root, f)));
const files = [
  'index.html',
  configFile,
  'vercel.json',
  'README.md',
  'package.json',
  'tailwind.config.js',
  'src/tailwind.css',
  'scripts/serve.mjs',
  'scripts/export-github.mjs',
];
const folders = ['assets'];

// what the site needs at runtime; the rest is tooling that stays in the repo but is not published
const vercelignore = `# Only the website is published: index.html, ${configFile}, assets/ and vercel.json.
src/
scripts/
node_modules/
package.json
package-lock.json
tailwind.config.js
README.md
assets/credits.json
`;
const gitignore = `node_modules/
.vercel/
.DS_Store
Thumbs.db
`;

// clear the folder but keep its git history and Vercel link, so github/ can be the repository itself
const keep = new Set(['.git', '.vercel']);
if (fs.existsSync(out)) for (const f of fs.readdirSync(out)) if (!keep.has(f)) fs.rmSync(path.join(out, f), { recursive: true, force: true });
const copy = rel => {
  const from = path.join(root, rel), to = path.join(out, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
};
files.forEach(copy);
folders.forEach(copy);
fs.writeFileSync(path.join(out, '.vercelignore'), vercelignore);
fs.writeFileSync(path.join(out, '.gitignore'), gitignore);

// sanity check: every local file the page references is in the export
const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
const config = fs.readFileSync(path.join(out, configFile), 'utf8').replace(/\/\/[^\n]*/g, '');   // ignore examples in comments
const refs = [
  ...[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]),
  ...[...html.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g)].flatMap(m => m[1].split(',').map(s => s.trim().split(' ')[0])),
  ...[...config.matchAll(/'(assets\/[^']+)'/g)].map(m => m[1]),
].filter(r => r && !/^(https?:|mailto:|tel:|#|data:)/.test(r) && !r.includes('${'));
const missing = [...new Set(refs)].filter(r => !fs.existsSync(path.join(out, r.split('?')[0])));

let total = 0, count = 0;
const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else { total += fs.statSync(p).size; count++; } });
walk(out);
console.log(`github/ ready: ${count} files, ${(total / 1024 / 1024).toFixed(1)} MB`);
if (missing.length) { console.error('Missing files referenced by the page:\n  ' + missing.join('\n  ')); process.exitCode = 1; }
