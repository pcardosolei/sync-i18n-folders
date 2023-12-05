import * as path from 'path';
import * as fs from 'fs';

import sync from '../src/index';

const LOCALES_DIR = path.join(__dirname, 'locales');
const OUTPUT_DIR = path.join(__dirname, 'output');

afterEach(() => {
  cleanUpOutputFiles();
});

describe('checking folder and files creation', () => {
  const primaryLanguage = 'en';
  const allLanguagesFolder = fs.readdirSync(LOCALES_DIR);
  const primaryLanguageFolderFiles = fs.readdirSync(`${LOCALES_DIR}/${primaryLanguage}`);

  test('based on the example folder', () => {
    sync({
      folder: LOCALES_DIR,
      outputDirectory: OUTPUT_DIR,
      primaryLanguage,
    });
    console.log(fs.readdirSync(OUTPUT_DIR));
    expect(fs.readdirSync(OUTPUT_DIR).length).toBe(allLanguagesFolder.length - 1);

    const secondaryLanguagesFolder = allLanguagesFolder.filter((language) => language != primaryLanguage);

    for (let languageFolder of secondaryLanguagesFolder) {
      expect(fs.readdirSync(`${OUTPUT_DIR}/${languageFolder}`).length).toBe(primaryLanguageFolderFiles.length);
    }
  });

  test('based on the example folder plus requested new language', () => {
    sync({
      folder: LOCALES_DIR,
      outputDirectory: OUTPUT_DIR,
      primaryLanguage,
      createResources: ['de'],
    });

    expect(fs.readdirSync(OUTPUT_DIR).length).toBe(3);

    const secondaryLanguagesFolder = allLanguagesFolder.filter((language) => language != primaryLanguage);

    for (let languageFolder of secondaryLanguagesFolder) {
      expect(fs.readdirSync(`${OUTPUT_DIR}/${languageFolder}`).length).toBe(primaryLanguageFolderFiles.length);
    }
  });
});

function cleanUpOutputFiles() {
  fs.rm(OUTPUT_DIR, { recursive: true }, () => {});
}
