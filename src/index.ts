import { renameSync } from 'node:fs';
import { mkdirpSync } from 'makedirp';
import { cpr } from 'node-cpr';
import { rmrfSync } from 'node-rmrf';
import { errorMsg, isExistedInDest, isPathExist } from './util.js';
import type { MvOption } from './type.js';

function moveFile(source: string, dest: string) {
  try {
    renameSync(source, dest);
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
  const exist = isPathExist(dest);
  const isStr = typeof source === 'string';
  const isArray = Array.isArray(source);
  if ((isArray && source.length > 1 && !exist && mkdirp) || (isStr && !exist)) {
    mkdirpSync(dest);
  }
  if (!errorMsg(source, dest)) {
    return;
  }
  if (
    !exist ||
    clobber ||
    (!clobber &&
      ((isStr && !isExistedInDest(source, dest)) ||
        (isArray && source.length === 1 && !isExistedInDest(source[0], dest))))
  ) {
    if (isStr) {
      moveFile(source, dest);
    } else {
      source.forEach((s) => {
        moveFile(s, dest);
      });
    }
  }
}
