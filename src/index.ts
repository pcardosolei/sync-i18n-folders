import { getDirectories, getJSONDirectoryFiles, readFileToJSON } from './utils';
import { ArgumentOptions } from './types';
import * as fs from 'fs';
import JSONConstructor from './jsonConstructor';
import FileConstructor from './fileConstructor';

export default function sync({
  check: isReportMode = false,
  folder,
  primaryLanguage = 'en',
  createResources = [],
  space,
  lineEndings = 'LF',
  finalNewline = false,
  generateBoilerplate = false,
  outputDirectory,
}: ArgumentOptions) {
  const fileConstrutor = new FileConstructor({
    space,
    outputDirectory,
    lineEndings,
    finalNewline,
  });
  const jsonConstructor = new JSONConstructor({ generateBoilerplate });
  const directories = getDirectories(folder);
  const primaryLanguageExists = directories.includes(primaryLanguage);
  if (!primaryLanguageExists) {
    console.warn(`${primaryLanguage} does not exist`);
  }

  const primaryLanguageFiles = getJSONDirectoryFiles(`${folder}/${primaryLanguage}`);

  let existingLanguages = directories.filter((language) => language != primaryLanguage);
  let secondaryLanguages = new Set([...existingLanguages, ...createResources]);
  for (const file of primaryLanguageFiles) {
    const sourceFile = readFileToJSON(`${folder}/${primaryLanguage}/${file}`);
    for (const language of secondaryLanguages) {
      const targetFileName = `${folder}/${language}/${file}`;

      const checkTargetFile = fs.existsSync(targetFileName);
      let targetFile = {};
      if (!checkTargetFile) {
        console.log(`need to create file - ${targetFileName} as it does not exist`);
      } else {
        targetFile = readFileToJSON(targetFileName);
      }
      jsonConstructor.syncObjects(sourceFile, targetFile);
      fileConstrutor.flushToDisk(file, language, targetFile);
    }
    const pr = new Intl.PluralRules();
    pr.resolvedOptions;
  }
}
