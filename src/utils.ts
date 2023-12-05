import * as fs from 'fs';
import * as path from 'path';

const JSON_EXTENSION = '.json';

export function getDirectories(folderName: string) {
  if (fs.existsSync(folderName)) {
    const paths = fs.readdirSync(folderName);
    return paths;
  }

  return [];
}

/**
 * Get JSON files from Directory
 * @param languageFolderName
 * @returns
 */
export function getJSONDirectoryFiles(languageFolderName: string) {
  const files = fs.readdirSync(languageFolderName);
  return files.filter((file) => path.extname(file).toLowerCase() === JSON_EXTENSION);
}

export function readFileToJSON(filename: string) {
  const file = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(file);
}

export function isObject(value: any): value is { [key: string]: string } {
  return getTypeName(value) === 'Object';
}

export function isArray(value: any): value is { [key: string]: string } {
  return Array.isArray(value);
}
export function areSameTypes(value: any, otherValue: any) {
  return getTypeName(value) === getTypeName(otherValue);
}

export function getTypeName(object: any) {
  const fullName: string = Object.prototype.toString.call(object);
  return fullName.split(' ')[1].slice(0, -1);
}
