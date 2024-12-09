import { existsSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

export const name = 'nodemv';

export const errorLog = (str: string) => {
  console.log('\x1b[31m%s\x1b[0m', str);
};

export function isPathExist(path: string) {
  try {
    return existsSync(path);
  } catch {
    return false;
  }
}

export function isFile(path: string) {
  try {
    const stat = statSync(resolve(path));
    return stat.isFile();
  } catch {
    return false;
  }
}

export function isDirectory(path: string) {
  try {
    const stat = statSync(resolve(path));
    return stat.isDirectory();
  } catch {
    return false;
  }
}

export function isExistedInDest(source: string, dest: string) {
  if (isDirectory(dest) && isPathExist(`${dest}${sep}${source}`)) {
    return true;
  }
  return false;
}

export function errorMsg(
  source: string | string[],
  dest: string,
  mkdirp?: boolean
) {
  if (typeof source === 'string' || source.length === 1) {
    const sourcePath = typeof source === 'string' ? source : source[0];
    if (!isPathExist(sourcePath)) {
      errorLog(
        `${name}: cannot stat '${sourcePath}': No such file or directory`
      );
      return false;
    } else if (isDirectory(sourcePath) && !isDirectory(dest) && isFile(dest)) {
      errorLog(
        `${name}: cannot overwrite non-directory '${dest}' with directory '${sourcePath}'`
      );
      return false;
    } else if (
      isDirectory(sourcePath) &&
      isDirectory(dest) &&
      sourcePath === dest
    ) {
      errorLog(
        `${name}: cannot move '${sourcePath}' to a subdirectory of itself, '${dest}/${sourcePath}'`
      );
      return false;
    } else if (!isPathExist(sourcePath) && !mkdirp) {
      errorLog(
        `${name}: cannot move '${sourcePath}' to '${dest}': No such file or directory`
      );
      return false;
    }
    return true;
  } else {
    if (!isDirectory(dest) && !mkdirp) {
      errorLog(`${name}: target '${dest}' is not a directory`);
      return false;
    } else {
      source.forEach((s) => {
        errorMsg(s, dest);
      });
      return true;
    }
  }
}
