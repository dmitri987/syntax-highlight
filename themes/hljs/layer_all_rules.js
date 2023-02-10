
import { resolve } from 'node:path';
import { readdir, readFile, writeFile } from 'node:fs/promises';

const LAYER_NAME = 'hljs-theme';

const fileNames = (await readdir('.')).filter(name => name.endsWith('.css'));
for (const fileName of fileNames) {
  const path = resolve('.', fileName);
  const text = await readFile(path, 'utf8');
  let lines = text.split('\n');

  // lines[0] = lines[0].replace('prism-theme', 'hljs-theme');

  // wrap in '@layer' all rules
  if (!/@layer.*\{/m.test(text)) {
    lines = [
      `@layer ${LAYER_NAME} {`,
      ...lines.map(l => '  ' + l),
      '}'
    ];
  }
  await writeFile(path, lines.join('\n'));
}
