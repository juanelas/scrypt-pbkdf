[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Node.js CI](https://github.com/juanelas/scrypt-pbkdf/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/juanelas/scrypt-pbkdf/actions/workflows/build-and-test.yml)
[![Coverage Status](https://coveralls.io/repos/github/juanelas/scrypt-pbkdf/badge.svg?branch=main)](https://coveralls.io/github/juanelas/scrypt-pbkdf?branch=main)

# scrypt-pbkdf

A faster JS implementation of the scrypt password-based key derivation function defined in [RFC 7914](https://tools.ietf.org/html/rfc7914). It works with Node.js, and modern browsers' JS, including React and Angular.

The code has been optimized using modern Javascript ArrayBuffers and views, and by using all the available native implementations in both Node.js and browsers.

> `scrypt-pbkdf` runs slower in Firefox than it could run because scrypt internally uses pbkdf2, but the native Firefox implementation has an [issue](https://github.com/mdn/sprints/issues/3278) that prevents using it under some circumstances. Therefore, a custom but slower fallback pbkdf2 function has been created.

## Why another scrypt package?

> **`scrypt-pbkdf` is 2 to 3 times faster in browsers than other state-of-the-art proposals (namely `scrypt-js` and `scryptsy`), and this means that it is 2 to 3 times more secure**.

Let me explain such a populist and utterly simplified answer.
The more secure scrypt is, the more time it needs to complete. Frontend developers know that usability comes first and time is crucial. Therefore, it is likely that they can't allow scrypt to last for more than a few seconds (at most)

Scrypt obviously can be tuned to accomplish such a goal. Quoting the [RFC](https://tools.ietf.org/html/rfc7914#section-2):

> Users of scrypt can tune the parameters N, r, and p according to the amount of memory and computing power available, the latency-bandwidth product of the memory subsystem, and the amount of parallelism desired.  At the current time, r=8 and p=1 appears to yield good results, but as memory latency and CPU parallelism increase, it is likely that the optimum values for both r and p will increase.

[Parameter recommendations](https://blog.filippo.io/the-scrypt-parameters/) rely on the idea of using fixed `r=8`and `p=1` and get the biggest `N` (the one and only work factor) that will make scrypt run in less than the desired time. Since memory and CPU usage scale linearly with `N`, so does time and security. Consequently (and oversimplifying), **being 2 to 3 times faster is being 2 to 3 times more secure**.

The following table summarizes benchmarks obtained with [Benchmark.js](https://benchmarkjs.com/) for fixed values `r=8`, `p=1` and varying `N` values. The benchmarks were run with Chrome 83 Linux 64 bits in an Intel Core i5-6200U with 8 GB of RAM. The comparison is similar in Firefox (although twice slower).

| N              | scrypt-pbkdf   | scrypt-js        | scryptsy         |
| :--------------| :--------------| :----------------| :----------------|
| 2**12=4096     | 85ms ±10.66%   | 438ms ±4.52%     | 190ms ±5.89%     |
| 2**13=8192     | 165ms ±4.47%   | 896ms ±2.10%     | 379ms ±1.35%     |
| 2**14=16384    | 336ms ±2.65%   | 1748ms ±2.29%    | 759ms ±1.47%     |
| 2**15=32768    | 648ms ±1.93%   | 3565ms ±2.04%    | 1516ms ±1.88%    |
| 2**16=65536    | 1297ms ±0.29%  | 7041ms ±2.43%    | 2988ms ±0.20%    |
| 2**17=131072   | 2641ms ±0.36%  | 14318ms ±0.67%   | 6014ms ±1.70%    |
| 2**18=262144   | 5403ms ±2.31%  | 28477ms ±1.22%   | 11917ms ±0.31%   |
| 2**19=524288   | 10949ms ±0.32% | 57097ms ±0.79%   | 23974ms ±1.56%   |
| 2**20=1048576  | 22882ms ±0.45% | 114637ms ±0.98%  | 47470ms ±0.15%   |

You can easily create your own benchmark by cloning [this repo](https://github.com/juanelas/scrypt-pbkdf), running `npm install`, then `npm run build` and finally open `benchmark/browser/index.html` with your browser.

Benchmarks for Node.js are way better than the ones obtained with browsers, probably because the different packages make use of native implementations. In the case of `scrypt-pbkdf` the performance is the same as the native Node.js `crypto.scrypt()`, since it is just a thin wrapper of it. The following table summarizes the benchmarks with Node 12 LTS in the same computer.

| N              | scrypt-pbkdf   | scrypt-js         | scryptsy           |
| :--------------| :--------------| :-----------------| :------------------|
| 2**12=4096     | 12ms ±6.45%    | 49ms ±8.74%       | 106ms ±2.88%       |
| 2**13=8192     | 23ms ±1.80%    | 96ms ±4.50%       | 212ms ±1.32%       |
| 2**14=16384    | 47ms ±2.82%    | 192ms ±2.67%      | 423ms ±1.86%       |
| 2**15=32768    | 94ms ±0.66%    | 387ms ±1.89%      | 849ms ±0.66%       |
| 2**16=65536    | 210ms ±0.77%   | 792ms ±0.96%      | 1699ms ±0.49%      |
| 2**17=131072   | 422ms ±1.81%   | 1561ms ±0.49%     | 3429ms ±0.54%      |
| 2**18=262144   | 847ms ±0.81%   | 3128ms ±0.97%     | 6826ms ±0.55%      |
| 2**19=524288   | 1704ms ±0.70%  | 6310ms ±0.37%     | 13754ms ±1.80%     |
| 2**20=1048576  | 3487ms ±3.42%  | 12516ms ±0.28%    | 27446ms ±1.34%     |
| 2**21=2097152  | 7031ms ±1.06%  | _- (N too large)_ | _- (N too large)_  |

## Usage

`scrypt-pbkdf` can be imported to your project with `npm`:

```console
npm install scrypt-pbkdf
```

Then either require (Node.js CJS):

```javascript
const scryptPbkdf = require('scrypt-pbkdf')
```

or import (JavaScript ES module):

```javascript
import * as scryptPbkdf from 'scrypt-pbkdf'
```

> The appropriate version for browser or node should be automatically chosen when importing. However, if your bundler does not import the appropriate module version (node esm, node cjs or browser esm), you can force it to use a specific one by just importing one of the followings:
>
> - `scrypt-pbkdf/dist/cjs/index.node`: for Node.js CJS module
> - `scrypt-pbkdf/dist/esm/index.node`: for Node.js ESM module
> - `scrypt-pbkdf/dist/esm/index.browser`: for browser ESM module
>
> If you are coding TypeScript, types will not be automatically detected when using the specific versions. You can easily get the types in by creating adding to a types declaration file (`.d.ts`) the following line:
>
> ```typescript
> declare module 'scrypt-pbkdf/dist/esm/index.browser' // use the specific file you were importing
> ```

You can also download the [IIFE bundle](https://raw.githubusercontent.com/juanelas/scrypt-pbkdf/main/dist/bundle.iife.js), the [ESM bundle](https://raw.githubusercontent.com/juanelas/scrypt-pbkdf/main/dist/bundle.esm.min.js) or the [UMD bundle](https://raw.githubusercontent.com/juanelas/scrypt-pbkdf/main/dist/bundle.umd.js) and manually add it to your project, or, if you have already installed `scrypt-pbkdf` in your project, just get the bundles from `node_modules/scrypt-pbkdf/dist/bundles/`.

If you feel comfortable with *my* choice for scrypt default parameters (`N=131072`, `r=8`, `p=1`), you can easily derive a key (or 'digest') of 256 bits (32 bytes) from a password and a random salt as:

```javascript
const password = 'mySuperSecurePassword'
const salt = scryptPbkdf.salt()  // returns an ArrayBuffer filled with 16 random bytes
const derivedKeyLength = 32  // in bytes
const key = await scryptPbkdf.scrypt(password, salt, derivedKeyLength)  // key is an ArrayBuffer
```

or using promises as:

```javascript
const password = 'mySuperSecurePassword'
const salt = scryptPbkdf.salt()  // returns an ArrayBuffer filled with 16 random bytes
const derivedKeyLength = 32  // in bytes
scryptPbkdf.scrypt(password, salt, derivedKeyLength).then(
  function(key) { // key is an ArrayBuffer
    /* do what you want with the key */
  }, 
  function(error) { /* handle an error */ }
) 
```

I have chosen a value of `N=131072` since, based on my own benchmarks, most browsers will likely compute it in no more than 5 seconds. However, it is likely that you want to tune the scrypt parameters.

An example of usage (from an async function) using scrypt parameters (`N=16384`, `r=8`, `p=2`) and a random salt of 32 bytes to derive a key of 256 bits (32 bytes) from password `mySuperSecurePassword`:

```javascript
const password = 'mySuperSecurePassword'
const salt = scryptPbkdf.salt(32)
const scryptParams = {
  N: 16384,
  r: 8,
  p: 2
}
const derivedKeyLength = 32
const key = await scryptPbkdf.scrypt(password, salt, derivedKeyLength, scryptParams)
```

## API reference documentation

[Check the API](./docs/API.md)
