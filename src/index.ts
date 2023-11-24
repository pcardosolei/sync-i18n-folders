import { areSameTypes, isArray, isObject } from "./utils";
import {
  getDirectories,
  getJSONDirectoryFiles,
  readFileToJSON,
} from "./common";
import { JSONObject, Options } from "./types";
import * as fs from "fs";

export type DirectoryMap = Record<string, FileMap>;
export type FileMap = Record<string, object>;

type LocalizationValue = Record<string, string> | string;

export default function sync({
  check: isReportMode = false,
  folder,
  primary: primaryLanguage = "en",
  createResources: createFiles = [],
  space: jsonSpacing = 4,
  lineEndings = "LF",
  finalNewline = false,
  newKeysEmpty = false,
}: Options) {
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
      syncObjects(sourceFile, targetFile);
      //const targetFile = readFileToJSON(`${folder}/${language}/${file}`);
      console.log("source:", sourceFile, "\ntarget:", targetFile);
    }
  }

  // let targetLanguage: string;
  // let hasAnyErrors = false;
  // let hasAnyChanges = false;
  // let hasValueChanges = false;
}
// for (const currentDirectory in Object.values(directories)) {
//   console.log(currentDirectory);
// const folder = new LocalizationFolder(
//   directories[currentDirectory],
//   primaryLanguage,
//   isReportMode
// );
// folder.populateFromDisk(createFiles);
// const sourceObject = folder.getSourceObject();

// if (!sourceObject) {
//   continue;
// }

// for (const filename of folder.getFilenames()) {
//   targetLanguage = normalizeLanguageFromFilename(filename);
//   record = new ActionRecorder(filename, isReportMode);
//   syncObjects(sourceObject, folder.getTargetObject(filename));
//   record.flushToConsole();
//   hasValueChanges = hasValueChanges || record.hasAnyActions();
//   hasAnyErrors = hasAnyErrors || record.hasAnyErrors();
// }

// const changedFiles = folder.flushToDisk(
//   jsonSpacing,
//   lineEndings.toUpperCase() as LineEndings,
//   finalNewline
// );
// hasAnyChanges = hasAnyChanges || changedFiles.length > 0;

// if (hasAnyErrors) {
//   throw new Error("[i18next-json-sync] found keys unsafe to synchronize");
// }

// if (isReportMode) {
//   if (hasValueChanges) {
//     throw new Error(
//       "[i18next-json-sync] check failed -- keys are out of sync. Run again without check mode to synchronize files"
//     );
//   }
//   if (hasAnyChanges) {
//     throw new Error(
//       "[i18next-json-sync] check failed -- files have unordered keys or unexpected whitespace. Run again without check mode to correct files"
//     );
//   }
// }

// function normalizeLanguageFromFilename(filename: string) {
//   return path.basename(filename, ".json").replace(/-/g, "_").toLowerCase();
// }

function syncObjects(source: JSONObject, target: JSONObject) {
  mergeKeys(source, target);

  for (const key of Object.keys(target)) {
    if (source.hasOwnProperty(key) && target.hasOwnProperty(key)) {
      // we should remove book_plural, book_1, etc if the language doesn't support singular forms
      // if (
      //   typeof target[key as keyof Object] === "string" &&
      //   keyIsOnlyPluralForPrimary(
      //     key,
      //     Object.keys(source),
      //     Object.keys(target)
      //   )
      // ) {
      // }
    } else {
    }
    // else if (!isValidMappedPluralForm(key, source, target)) {
    // }
  }
}

function mergeKeys(source: JSONObject, target: JSONObject) {
  for (const key of Object.keys(source)) {
    mergeKey(source, target, key);
  }
}

function mergeKey(source: JSONObject, target: JSONObject, key: string) {
  const sourceValue = source[key] as JSONObject;
  const targetValue = target[key] as JSONObject;

  console.log(`key ${key}, source ${sourceValue}, target ${targetValue}`);
  if (target.hasOwnProperty(key)) {
    if (areSameTypes(sourceValue, targetValue)) {
      if (isArray(sourceValue)) {
        // copyEmptyArray(targetValue, key);
        // compare length
      } else if (isObject(sourceValue)) {
        syncObjects(sourceValue, targetValue);
      } else {
        // ignoring the plurals
        copyValue(source, target, key);
      }
      // else if (
      //   keyMatchesPluralForLanguage(key, primaryLanguage) &&
      //   !keyMatchesPluralForLanguage(key, targetLanguage)
      // ) {
      //   mergeKeys(createPlurals(key, source), target);
      // }
      //base case: source and target agree on key name and value is string
    } else {
      //  record.error((file) => `${file} contains type mismatch on key ${key}`);
    }
  } else {
    copyValue(source, target, key);
  }
}

function copyEmptyArray(target: JSONObject, key: string) {
  target[key as keyof JSONObject] = [];
}

function copyValue(
  source: JSONObject,
  target: JSONObject,
  key: string,
  opts?: { newKeysEmpty: boolean }
) {
  const { newKeysEmpty } = opts || { newKeysEmpty: false };
  const sourceValue = source[key as keyof Object];
  if (isObject(sourceValue)) {
    target[key as keyof typeof target] = {} satisfies JSONObject;
    syncObjects(sourceValue, target[key] as JSONObject);
  } else if (isArray(sourceValue)) {
    copyEmptyArray(target, key);
  }
  // ignoring plurals and stuff. just to check if it works or not
  else {
    target[key as keyof Object] = newKeysEmpty ? "" : sourceValue;
    target[key as keyof Object] = "";
  }
}

// function targetPluralsPopulated(target: object, key: string) {
//   //given 'x' for key, do we have 'x' and 'x_plural' for en?
//   const singular = getSingularForm(key);
//   const pluralKeys = getPluralsForLanguage(targetLanguage).map(
//     (p) => p // p.replace("key", singular)
//   );
//   const targetKeys = Object.keys(target);
//   return pluralKeys.every(
//     (expectedPluralKeys) => targetKeys.indexOf(expectedPluralKeys) > -1
//   );
// }

// function copyPlurals(plurals: Object, target: Object) {
//   for (const key of Object.keys(plurals)) {
//     if (target.hasOwnProperty(key)) {
//       continue;
//     }
//     target[key] = target[key as keyof Object] = newKeysEmpty
//       ? ""
//       : plurals[key];
//     // record.keyAdded(key);
//   }
// }

// function keyIsOnlyPluralForPrimary(
//   key: string,
//   allPimaryKeys: string[],
//   allTargetKeys: string[]
// ) {
//   if (pluralFormsMatch()) {
//     return false;
//   }

//   if (languageOnlyHasOneForm(primaryLanguage)) {
//     return false;
//   }

//   return (
//     keyMatchesPluralForLanguageIncludingSingular(
//       key,
//       allPimaryKeys,
//       primaryLanguage
//     ) &&
//     !keyMatchesPluralForLanguageIncludingSingular(
//       key,
//       allTargetKeys,
//       targetLanguage
//     )
//   );
// }

// function pluralFormsMatch() {
//   const primaryForms = Object.keys(getPluralsForLanguage(primaryLanguage));
//   const targetForms = Object.keys(getPluralsForLanguage(targetLanguage));
//   return (
//     primaryForms.length === targetForms.length &&
//     primaryForms.every((form) => targetForms.indexOf(form) > -1)
//   );
// }

// function keyMatchesPluralForLanguageIncludingSingular(
//   key: string,
//   allKeys: string[],
//   language: string
// ) {
//   /**
//    * It's impossible to tell whether a key is a plural for a language with one form shared between singular and plurals.
//    * With other languages we can look for relationships between e.g. value and value_plural or value and value_0.
//    */

//   if (languageOnlyHasOneForm(language)) {
//     return true;
//   }

//   const matchesAPlural = keyMatchesPluralForLanguage(key, language);
//   if (matchesAPlural) {
//     return true;
//   }

//   //key is now a singular form
//   // if (!languageHasSingularForm(language)) {
//   //   return false;
//   // }

//   for (const _key of allKeys) {
//     // if (key !== _key && isPluralFormForSingular(_key, key, language)) {
//     //   return true;
//     // }
//   }

//   return false;
// }

// function keyMatchesPluralForLanguage(key: string, language: string) {
//   const forms = getPluralsForLanguage(language).map(
//     (form) => form // form.replace("key", "")
//   );

//   for (const form of forms) {
//     if (form && key.endsWith(form)) {
//       return true;
//     }
//   }

//   return false;
// }

// function isValidMappedPluralForm(
//   key: string,
//   sourceObject: Object,
//   targetObject: Object
// ) {
//   const singular = getSingularForm(key);
//   const isPluralForPrimaryLanguage = Object.keys(sourceObject).some((key) =>
//     isPluralFormForSingular(key, singular, primaryLanguage)
//   );

//   if (languageOnlyHasOneForm(targetLanguage)) {
//     return singular === key && isPluralForPrimaryLanguage;
//   }

//   const isPluralForTargetLanguage = Object.keys(targetObject).some((key) =>
//     isPluralFormForSingular(key, singular, targetLanguage)
//   );
//   return isPluralForPrimaryLanguage && isPluralForTargetLanguage;
// }

// function getSingularForm(key: string) {
//   return key.replace(/_(plural|\d)$/, "");
// }

// function isPluralFormForSingular(
//   key: string,
//   singular: string,
//   language: string
// ) {
//   // return (
//   //   getPluralsForLanguage(language)
//   //     .map((form) => form.replace("key", singular))
//   //     .indexOf(key) > -1
//   // );
// }

// function languageHasSingularForm(language: string) {
//   // return (
//   //   getPluralsForLanguage(language)
//   //     .map((form) => form.replace("key", ""))
//   //     .indexOf("") > -1
//   // );
// }

// function languageOnlyHasOneForm(language: string) {
//   return getPluralsForLanguage(language).length === 1;
// }

// function getPluralsForLanguage(language: string) {
//   // if (pluralForms.hasOwnProperty(language)) {
//   //   return pluralForms[language];
//   // }

//   // if (language.indexOf("_") > -1 || language.indexOf("-") > -1) {
//   //   const baseLanguage = language.split(/-|_/)[0];
//   //   if (pluralForms.hasOwnProperty(baseLanguage)) {
//   //     return pluralForms[baseLanguage];
//   //   }
//   // }

//   return [];
// }

// function createPlurals(key: string, source: Object) {
//   const singular = getSingularForm(key);
//   const plurals = {};

//   if (languageOnlyHasOneForm(primaryLanguage)) {
//     plurals[key] = source[key as keyof Object];
//   } else {
//     const fillValue = getPluralFillValue(singular, source);
//     for (const form of getPluralsForLanguage(targetLanguage)) {
//       //   plurals[form.replace("key", singular)] = fillValue;
//     }
//   }

//   return plurals;
// }

// function getPluralFillValue(singular: string, source: Object) {
//   if (languageOnlyHasOneForm(primaryLanguage)) {
//     return source[singular as keyof Object];
//   }

//   //prefer plural fill values because they're more likely to have
//   //interpolations like {{ count }}, but fall back to singular
//   const sourceKeys = Object.keys(source).filter((k) => k !== singular);
//   for (const form of getPluralsForLanguage(primaryLanguage)) {
//     // const pluralKey = form.replace("key", singular);
//     // if (sourceKeys.indexOf(pluralKey) > -1) {
//     //   return source[pluralKey];
//     // }
//   }

//   return source[singular as keyof Object];
// }

// function gatherKeysFor(object: Object) {
//   return Object.keys(object)
//     .map((key) => gatherPrimitivesForSingleKey(object, key))
//     .reduce((all, next) => all.concat(next), []);
// }

// function gatherPrimitivesForSingleKey(object: Object, key: string): string[] {
//   if (isObject(object[key as keyof Object])) {
//     return gatherKeysFor(object[key as keyof Object]);
//   } else {
//     return [key];
//   }
// }

// sync({ folder: "/Users/paulocardoso/Projects/HawkStars/i18n/locales" });
sync({ folder: "./locales" });
