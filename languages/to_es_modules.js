import { resolve } from "node:path";
import { readdir, readFile, writeFile } from "node:fs/promises";

const getDefaultFunctionName = (line) =>
  line
    .match(/(?<=^module\.exports\s*=\s*).+/)?.[0]
    .replaceAll(";", "")
    .trim();

const fileNames = await readdir("hljs/original_languages");
for (const fileName of fileNames) {
  const originalPath = resolve("./hljs/original_languages", fileName);
  const text = await readFile(originalPath, "utf8");

  const lines = text.split("\n");
  let defaultFunctionName,
    re,
    defaultExport = false;
  const esModule = [];
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!defaultFunctionName) {
      defaultFunctionName = getDefaultFunctionName(lines[i]);
      if (defaultFunctionName){
        re = new RegExp(`^function ${defaultFunctionName}`);
      }
      continue;
    }

    if (!defaultExport && re.test(lines[i])) {
      esModule.unshift("export default " + lines[i]);
      defaultExport = true;
      console.log('Successfully processed:', defaultFunctionName)
      continue;
    }

    if (lines[i]) esModule.unshift(lines[i]);
  }

  // console.log(esModule)
  const path = resolve("./hljs", fileName);
  await writeFile(path, esModule.join("\n"));
}
