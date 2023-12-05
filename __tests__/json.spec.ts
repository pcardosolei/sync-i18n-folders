import * as path from 'path';
import * as fs from 'fs';

import sync from '../src/index';

const LOCALES_DIR = path.join(__dirname, 'locales');
const OUTPUT_DIR = path.join(__dirname, 'output');

afterEach(() => {
  cleanUpOutputFiles();
});

describe('using boilerplate', () => {
  test('singular key with string', () => {});
  test('key with array', () => {});
  test('key with nested object', () => {});

  test('key in two different files are different types', () => {});
  test('key does not exist in one of the files', () => {});
});

describe('with boilerplate turned off', () => {
  test('singular key with string', () => {});
  test('key with array', () => {});
  test('key with nested object', () => {});

  test('key in two different files are different types', () => {});
  test('key does not exist in one of the files', () => {});
});

function cleanUpOutputFiles() {
  fs.rm(OUTPUT_DIR, { recursive: true }, () => {});
}
