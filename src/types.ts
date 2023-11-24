export type LineEndings = "LF" | "CRLF";

export interface Options {
  /** Audit files in memory instead of changing them on the filesystem and throw an error if any changes would be made */
  check?: boolean;
  /** Locale folders where all the languages are hosted */
  folder: string;
  /** Primary localization language. Other language files will be changed to match */
  primary?: string;
  /** Language files to create if they don't exist, e.g. ['es, 'pt-BR', 'fr'] */
  createResources?: string[];
  /** Space value used for JSON.stringify when writing JSON files to disk */
  space?: string | number;
  /** Line endings used when writing JSON files to disk */
  lineEndings?: LineEndings;
  /** Insert a final newline when writing JSON files to disk */
  finalNewline?: boolean;
  /** Use empty string for new keys instead of the primary language value */
  newKeysEmpty?: boolean;
}

// I can ignore number and boolean ? hmm
export type JSONValue = string | number | boolean | JSONObject | JSONArray;

export type JSONObject = {
  [x: string]: JSONValue;
};

type JSONArray = Array<JSONValue>;
