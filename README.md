# node-mv
The 'mv' command implementation for nodejs.It will create all the necessary directories and destination file which not exist.

## Installation

```js
npm install @lxf2513/node-mv
```

## Usage

```js
import { mv } from '@lxf2513/node-mv'
// or
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { mv } = require('@lxf2513/node-mv')

mv(source, dest, options?)

mv([source1, source2], dest, options?)

*/
```

## Options

* `clobber`: If the destination exists, overwrite it, default `true`
* `mkdirp`: It first created all the necessary directories recursively, default `false`

### Command Line Interface

```
Usage: nodemv [OPTION]... SOURCE... DIRECTORY
Rename SOURCE to DEST, or move SOURCE(s) to DIRECTORY.

  -h, --help         display this help and exit
  -v, --version      output version information and exit
  -n, --no-clobber   do not overwrite an existing file
  --mkdirp           make the dest directory recursively if it not exist
