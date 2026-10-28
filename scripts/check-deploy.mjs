import { readdir, stat, readFile, access } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
for (const file of ['index.html', 'directors/index.html', '404.html', '_headers']) await access(path.join(root, file));
let count = 0;
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await inspect(file);
    else {
      count++;
      if ((await stat(file)).size > 25 * 1024 * 1024) throw new Error(`Cloudflare Pages file exceeds 25 MiB: ${file}`);
      if (/\.(html|css|js)$/.test(file)) {
        const content = await readFile(file, 'utf8');
        for (const match of content.matchAll(/["'`(](\/assets\/[^"'`)\s?#]+)/g)) {
          if (!match[1].includes('${')) await access(path.join(root, match[1]));
        }
      }
    }
  }
}
await inspect(root);
if (count > 20000) throw new Error('Build exceeds the Pages free-plan file limit.');
console.log(`Deploy check passed: ${count} files, both routes and 404 present, local asset references valid, files within 25 MiB.`);
