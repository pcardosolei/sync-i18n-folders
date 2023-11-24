import { json } from "stream/consumers";
import { LineEndings } from "./types";

class RunProperties {
  private isReportMode: boolean = false;
  private folder: string;
  private primaryLanguage: string = "en";
  private createResources: boolean = false;
  private jsonSpacing: number = 4;
  private lineEndings = "LF";
  private finalNewline = false;
  private newKeysEmpty = false;
  private outputDirectory: string = "./output-sync/";

  public flushToDisk(filename: string, content: any) {
    const changedFiles: string[] = [];

    JSON.stringify(content, { space: this.jsonSpacing });
    fs.writeFileSync(generateFilePath);
    Object.keys(this.files).forEach((name) => {
      let fileContent = JSON.stringify(this.files[name], { space });
      if (lineEnding === "CRLF") {
        fileContent = fileContent.replace(/\n/g, "\r\n");
      }

      if (addFinalNewline) {
        switch (lineEnding) {
          case "LF":
            fileContent += "\n";
            break;
          case "CRLF":
            fileContent += "\r\n";
            break;
        }
      }

      if (!this.isReportMode) {
        fs.writeFileSync(name, fileContent, { encoding: "utf8" });
      }

      this.hashes[name] = null;
      this.files[name] = null;
    });

    return changedFiles;
  }

  private generateFilePath(filename: string) {
    return `${this.outputDirectory}${this.outputDirectory}`;
  }
}
