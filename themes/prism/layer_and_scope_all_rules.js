
import { resolve } from 'node:path';
import { readdir, readFile, writeFile } from 'node:fs/promises';

const LAYER_NAME = 'prism-theme';
const CLASS_NAME = 'prism';

const fileNames = (await readdir('.')).filter(name => name.endsWith('.css'));
for (const fileName of fileNames) {
  const path = resolve('.', fileName);
  const text = await readFile(path, 'utf8');
  let lines = text.split('\n');

  // add '.prism' to all 'pre' and 'code' selectors
  const tag = /(?<=[^(])(pre|code)(?=[^.])/g;
  const selector = /.+[,{]\s*/;
  for (let i = 0; i < lines.length; i++) {
    if (!selector.test(lines[i])) continue;
    lines[i] = lines[i].replace(tag, `$&.${CLASS_NAME}`);
  }

  // wrap in '@layer' all rules
  if (!/@layer.*\{/m.test(text)) {
    lines = [
      `@layer ${LAYER_NAME} {`,
      ...lines.map(l => '  ' + l),
      '}'
    ];
  }

  await writeFile(path + '.foo', lines.join('\n'));
}
