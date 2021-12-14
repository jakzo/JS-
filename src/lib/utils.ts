import fs from "fs";
import path from "path";

export const readFile = (relativePath: string): string => {
  const callerFile = getPathOfCallerFile();
  return fs
    .readFileSync(
      path.join(...(callerFile ? [callerFile, ".."] : []), relativePath),
      "utf8"
    )
    .trim();
};

const getPathOfCallerFile = (depth = 1): string | undefined => {
  let name: string | undefined;
  const originalPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_err, stackTraces) => {
    if (stackTraces.length > depth + 1)
      name = stackTraces[depth + 1].getFileName() || undefined;
  };
  try {
    // v8 only calls `Error.prepareStackTrace()` when the `.stack` property is accessed
    new Error().stack;
  } finally {
    Error.prepareStackTrace = originalPrepareStackTrace;
  }
  return name;
};
