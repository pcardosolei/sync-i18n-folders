import * as fs from "fs";
import * as path from "path";

const JSON_EXTENSION = ".json";

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
  return files.filter(
    (file) => path.extname(file).toLowerCase() === JSON_EXTENSION
  );
}

export function readFileToJSON(filename: string) {
  const file = fs.readFileSync(filename, "utf-8");
  return JSON.parse(file);
}

export function checkIfFileExists(filename: string) {
  const fileExists = fs.existsSync(filename);
}
