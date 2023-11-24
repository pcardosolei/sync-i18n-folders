import {
  getDirectories,
  getJSONDirectoryFiles,
  readFileToJSON,
} from "./common";
import { ArgumentOptions, JSONObject } from "./types";
import FileConstructor from "./fileConstructor";
import * as fs from "fs";
import JSONConstructor from "./jsonConstructor";

export default function sync({
  check: isReportMode = false,
  folder,
  primary: primaryLanguage = "en",
  createResources: createFiles = [],
  space,
  lineEndings = "LF",
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

  const primaryLanguageFiles = getJSONDirectoryFiles(
    `${folder}/${primaryLanguage}`
  );

  const secondaryLanguages = directories.filter(
    (language) => language != primaryLanguage
  );

  for (const file of primaryLanguageFiles) {
    console.log("-----", file);
    const sourceFile = readFileToJSON(`${folder}/${primaryLanguage}/${file}`);
    for (const language of secondaryLanguages) {
      const targetFileName = `${folder}/${language}/${file}`;

      const checkTargetFile = fs.existsSync(targetFileName);
      let targetFile = {};
      if (!checkTargetFile) {
        console.log(
          `need to create file - ${targetFileName} as it does not exist`
        );
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

sync({
  folder: "./locales",
  outputDirectory: "./output-sync",
  generateBoilerplate: true,
});
