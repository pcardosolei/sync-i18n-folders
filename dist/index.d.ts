import { Options } from "./types";
export type DirectoryMap = Record<string, FileMap>;
export type FileMap = Record<string, object>;
export default function sync({ check: isReportMode, folder, primary: primaryLanguage, createResources, space, lineEndings, finalNewline, newKeysEmpty, }: Options): void;
