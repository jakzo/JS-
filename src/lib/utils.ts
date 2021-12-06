import fs from "fs";

export const readFile = (relativePath: string): string =>
  fs.readFileSync(relativePath, "utf8").trim();
