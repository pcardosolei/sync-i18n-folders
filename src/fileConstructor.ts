import * as fs from "fs";
import { ArgumentOptions, JSONObject } from "./types";

class FileConstructor {
  private jsonSpacing: number = 4;
  private lineEndings = "LF";
  private addFinalNewline = false;
  private outputDirectory: string;

  constructor({
    space,
    lineEndings,
    finalNewline,
    outputDirectory,
  }: Pick<
    ArgumentOptions,
    "space" | "lineEndings" | "finalNewline" | "outputDirectory"
  >) {
    this.jsonSpacing = space || 4;
    this.lineEndings = lineEndings || "LF";
    this.addFinalNewline = finalNewline || false;
    this.outputDirectory = outputDirectory;
  }

  public flushToDisk(filename: string, language: string, content: JSONObject) {
    let fileJSON = JSON.stringify(content, null, this.jsonSpacing);
    if (this.lineEndings === "CRLF") {
      fileJSON = fileJSON.replace(/\n/g, "\r\n");
    }
    if (this.addFinalNewline) {
      switch (this.lineEndings) {
        case "LF":
          fileJSON += "\n";
          break;
        case "CRLF":
          fileJSON += "\r\n";
          break;
      }
    }

    this.createFolder(language);
    fs.writeFileSync(this.generateFilePath(filename, language), fileJSON, {
      encoding: "utf-8",
    });
  }

  private createFolder(language: string) {
    if (!fs.existsSync(`${this.outputDirectory}/${language}`)) {
      fs.mkdirSync(`${this.outputDirectory}/${language}`, { recursive: true });
    }
  }

  private generateFilePath(filename: string, language: string) {
    return `${this.outputDirectory}/${language}/${filename}`;
  }
}

export default FileConstructor;
