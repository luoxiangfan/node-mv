#!/usr/bin/env node
import { createInterface } from 'readline';
import { mv } from './index.js';
import { version } from '../package.json';
import type { MvOption } from './type.js';
import { errorLog, name } from './util.js';

const helpInfo = () => {
  errorLog(`Try '${name} --help' for more information.`);
};

const help = `${name} ${version}

Usage: ${name} [OPTION]... SOURCE... DIRECTORY
Rename SOURCE to DEST, or move SOURCE(s) to DIRECTORY.

  -h, --help         display this help and exit
  -v, --version      output version information and exit
  -n, --no-clobber   do not overwrite an existing file
  --mkdirp           make the dest directory recursively if it not exist
`;

const validArgs = [
  '--',
  '-h',
  '-v',
  '-n',
  '--help',
  '--version',
  '--no-clobber',
  '--mkdirp'
];

const main = async (...args: string[]) => {
  const _args = args.filter((i) => i.trim());
  let paths: string[] = [];
  let options: string[] = [];
  const splitChar = '--';
  const idx = _args.findIndex((arg) => arg === splitChar);
  if (!_args.length || (_args.length === 1 && idx > -1)) {
    errorLog(`${name}: missing file operand`);
    helpInfo();
    return 1;
  }
  if (idx > -1 && _args.length > 1) {
    options = _args.slice(0, idx);
    paths = _args.slice(idx).filter((a) => a !== splitChar);
  }
  if (idx < 0 && _args.length) {
    options = _args.filter((a) => /^-/.test(a));
    paths = _args.filter((a) => !/^-/.test(a));
  }
  const mvOption: MvOption = {
    clobber: true,
    mkdirp: false
  };
  if (options.length) {
    const arg =
      options.length === 1
        ? options[0]
        : options.filter((o) => o !== '-m' && o !== '--mode')[0];
    if (validArgs.includes(arg)) {
      if (arg === '-h' || arg === '--help') {
        console.log(help);
        return 0;
      } else if (arg === '-v' || arg === '--version') {
        console.log(`${name} ${version}`);
        return 0;
      } else if (arg === '-n' || arg === '--no-clobber') {
        mvOption.clobber = false;
      } else if (arg === '--mkdirp') {
        mvOption.mkdirp = true;
      }
    } else {
      errorLog(`${name}: unknown option: ${arg}`);
      helpInfo();
      return 1;
    }
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  mv(paths.slice(0, -1), paths.slice(-1)[0], mvOption);

  rl.close();

  return 0;
};

const args = process.argv.slice(2);
main(...args).then(
  (code) => process.exit(code),
  (err) => {
    errorLog(err);
    process.exit(1);
  }
);
