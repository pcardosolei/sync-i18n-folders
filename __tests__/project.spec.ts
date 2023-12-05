import * as path from 'path';
import * as fs from 'fs';

import sync from '../src/index';

const LOCALES_DIR = path.join(__dirname, 'locales');
const OUTPUT_DIR = path.join(__dirname, 'output');

afterEach(() => {
  cleanUpOutputFiles();
});

describe('checking folder creation', () => {
  const primaryLanguage = 'en';
  const languages = fs.readdirSync(LOCALES_DIR);

  test('based on the example folder', () => {
    sync({
      folder: LOCALES_DIR,
      outputDirectory: OUTPUT_DIR,
      primaryLanguage,
    });

    expect(fs.readdirSync(OUTPUT_DIR).length).toBe(languages.length - 1);
  });

  test('based on the example folder plus requested new language', () => {
    sync({
      folder: LOCALES_DIR,
      outputDirectory: OUTPUT_DIR,
      primaryLanguage,
      createResources: ['de'],
    });

    expect(fs.readdirSync(OUTPUT_DIR).length).toBe(3);
  });
});

function cleanUpOutputFiles() {
  fs.rm(OUTPUT_DIR, { recursive: true }, () => {});
}
