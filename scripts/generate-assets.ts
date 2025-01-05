import * as fs from 'fs';
import * as path from 'path';

const ASSETS_DIR = 'public/assets';
const OUTPUT_FILE = 'src/game/assets.ts';

const toCamelCase = (str: string): string => {
  return str.replace(/-./g, match => match.charAt(1).toUpperCase());
};

const formatFileName = (fileName: string): string => {
  const extIndex = fileName.lastIndexOf('.');
  if (extIndex === -1) return toCamelCase(fileName);
  const name = toCamelCase(fileName.substring(0, extIndex));
  const ext = fileName.substring(extIndex + 1).toUpperCase();
  return `${name}_${ext}`;
};

const listFiles = (dir: string, prefix: string, indent: string): string => {
  let result = `{\n`;
  const files = fs.readdirSync(dir);
  const newIndent = `${indent}  `;
  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    const formattedFile = formatFileName(file);
    if (isDirectory) {
      result += `${newIndent}"${formattedFile}": ${listFiles(filePath, `${prefix}/${file}`, newIndent)}`;
    } else {
      result += `${newIndent}"${formattedFile}": "assets${prefix}/${file}"`;
    }
    if (index < files.length - 1) {
      result += ',\n';
    }
  });
  result += `\n${indent}}`;
  return result;
};

// Generate the assets.ts file
console.log(`Generating ${OUTPUT_FILE}...`);
const assetsContent = `const assets = ${listFiles(ASSETS_DIR, '', '')} as const;\nexport default assets;\n`;
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, assetsContent);
console.log('Done.');