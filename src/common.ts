import * as fs from "fs";
import * as path from "path";

const JSON_EXTENSION = ".json";

export function getDirectories(folderName: string) {
  if (checkIfDirectoryExists(folderName)) {
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

function checkIfDirectoryExists(folderName: string) {
  if (!fs.existsSync(folderName)) {
    return false;
  }
  return true;
}

export function readFileToJSON(filename: string) {
  const file = fs.readFileSync(filename, "utf-8");
  return JSON.parse(file);
}

// export function getAllKeysJson()
