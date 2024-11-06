import fs from 'node:fs';
import { mkdirpSync } from 'makedirp';
import { cpr } from 'node-cpr';
import { rmrfSync } from 'node-rmrf';
import { errorMsg, isArray, isExistedInDest, isPathExist } from './util.js';
import type { MvOption } from './type.js';

function moveFile(source: string, dest: string) {
  try {
    fs.renameSync(source, dest);
  } catch (error) {
    const err = error as NodeJS.ErrnoException | null;
    if (
      err?.code === 'EPERM' ||
      err?.code === 'EISDIR' ||
      err?.code === 'EXDEV'
    ) {
      cpr(source, dest);
      rmrfSync(source);
    }
  }
}

export function mv(source: string | string[], dest: string, options: MvOption) {
  const { clobber = true, mkdirp } = options;
  const destExist = isPathExist(dest);
  const isSourceString = typeof source === 'string';
  const isSourceArray = isArray(source);
  if (
    (isSourceArray && source.length > 1 && !destExist && mkdirp) ||
    (isSourceString && !destExist)
  ) {
    mkdirpSync(dest);
  }
  if (!errorMsg(source, dest)) {
    return;
  }
  if (
    !destExist ||
    clobber ||
    (!clobber &&
      ((isSourceString && !isExistedInDest(source, dest)) ||
        (isSourceArray &&
          source.length === 1 &&
          !isExistedInDest(source[0], dest))))
  ) {
    if (isSourceString) {
      moveFile(source, dest);
    } else {
      source.forEach((s) => {
        moveFile(s, dest);
      });
    }
  }
}
