[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Node CI](https://github.com/juanelas/scrypt-pbkdf/workflows/Node%20CI/badge.svg)](https://github.com/juanelas/scrypt-pbkdf/actions?query=workflow%3A%22Node+CI%22)
[![Coverage Status](https://coveralls.io/repos/github/juanelas/scrypt-pbkdf/badge.svg?branch=master)](https://coveralls.io/github/juanelas/scrypt-pbkdf?branch=master)

# scrypt-pbkdf

A faster JS implementation of the scrypt password-based key derivation function defined in [RFC 7914](https://tools.ietf.org/html/rfc7914). It works with Node.js, and native JS, including React and Angular.

The code has been optimized using modern Javascript ArrayBuffers and views, and by using al the all the available native implementations in both Node.js and browsers.

> `scrypt-pbkdf2` runs slower in Firefox than it could run because scrypt internally uses pbkdf2, but the native Firefox implementation has an [issue](https://github.com/mdn/sprints/issues/3278) that prevents using it under some circumstances. Therefore a custom but slower fallback pbkdf2 function has been created

## Why another scrypt package?

> **`scrypt-pbkdf2` is 2 to 3 times faster in browsers than other state-of-the-art proposals (namely `scrypt-js` and `scryptsy`), and this means that it is 2 to 3 times more secure**.

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

You can easily create you own benchmark by cloning [this repo](https://github.com/juanelas/scrypt-pbkdf), running `npm install`, then `npm run build` and finally open `benchmark/browser/index.html` with your browser.

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

## Installation

`scrypt-pbkdf` can be imported to your project with `npm`:

```bash
npm install scrypt-pbkdf
```

NPM installation defaults to the ES6 module for browsers and the CJS one for Node.js. For web browsers, you can also directly download the [IIFE bundle](https://raw.githubusercontent.com/juanelas/scrypt-pbkdf/master/lib/index.browser.bundle.iife.js) or the [ESM bundle](https://raw.githubusercontent.com/juanelas/scrypt-pbkdf/master/lib/index.browser.bundle.mod.js) from the repository.

## Usage examples

Import your module as :

 - Node.js
   ```javascript
   const scryptPbkdf = require('scrypt-pbkdf')
   ... // your code here
   ```
 - JavaScript native or TypeScript project (including React and Angular)
   ```javascript
   import * as scryptPbkdf from 'scrypt-pbkdf'
   ... // your code here
   ```
 - JavaScript native browser ES module
   ```html
   <script type="module">
      import * as scryptPbkdf from 'lib/index.browser.bundle.mod.js'  // Use your actual path to the broser mod bundle
      ... // your code here
   </script>
   ```
 - JavaScript native browser IIFE
   ```html
   <head>
     ...
     <script src="../../lib/index.browser.bundle.iife.js"></script> <!-- Use your actual path to the browser bundle -->
   </head>
   <body>
     ...
     <script>
       ... // your code here
     </script>
   </body>
   ```

If you feel comfortable with *my* choice for scrypt default parameters (`N=131072`, `r=8`, `p=1`), you can easily derive a key (or 'digest') of 256 bits (32 bytes) from a password and a random salt as:

```javascript
const password = 'mySuperSecurePassword'
const salt = scryptPbkdf.salt()  // returns an ArrayBuffer filled with 16 random bytes
const derivedKeyLength = 32  // in bytes
const key = await scryptPbkdf.scrypt(password, salt, derivedKeyLength)  // key is an ArrayBuffer
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

<a name="module_scrypt-pbkdf"></a>

### scrypt-pbkdf
Scrypt password-based key derivation function (RFC 7914)


* [scrypt-pbkdf](#module_scrypt-pbkdf)
    * [~salsa208Core(arr)](#module_scrypt-pbkdf..salsa208Core)
    * [~salt([length])](#module_scrypt-pbkdf..salt) ⇒ <code>ArrayBuffer</code>
    * [~scrypt(P, S, dkLen, [scryptParams])](#module_scrypt-pbkdf..scrypt) ⇒ <code>ArrayBuffer</code>
    * [~scryptBlockMix(B)](#module_scrypt-pbkdf..scryptBlockMix)
    * [~scryptROMix(B, N)](#module_scrypt-pbkdf..scryptROMix)

<a name="module_scrypt-pbkdf..salsa208Core"></a>

#### scrypt-pbkdf~salsa208Core(arr)
Salsa20/8 Core is a round-reduced variant of the Salsa20 Core.  It is a
hash function from 64-octet strings to 64-octet strings.  Note that
Salsa20/8 Core is not a cryptographic hash function since it is not
collision resistant.

This function modifies the ArrayBuffer of the input UInt32Array

**Kind**: inner method of [<code>scrypt-pbkdf</code>](#module_scrypt-pbkdf)  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Uint32Array</code> | a binary array of 64 octets |

<a name="module_scrypt-pbkdf..salt"></a>

#### scrypt-pbkdf~salt([length]) ⇒ <code>ArrayBuffer</code>
Returns an ArrayBuffer of the desired length in bytes filled with cryptographically secure random bytes

**Kind**: inner method of [<code>scrypt-pbkdf</code>](#module_scrypt-pbkdf)  
**Throws**:

- <code>RangeError</code> length must be integer >= 0


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [length] | <code>number</code> | <code>16</code> | The length in bytes of the random salt |

<a name="module_scrypt-pbkdf..scrypt"></a>

#### scrypt-pbkdf~scrypt(P, S, dkLen, [scryptParams]) ⇒ <code>ArrayBuffer</code>
The scrypt Algorithm (RFC 7914)

**Kind**: inner method of [<code>scrypt-pbkdf</code>](#module_scrypt-pbkdf)  
**Returns**: <code>ArrayBuffer</code> - - a derived key of dKLen bytes  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| P | <code>string</code> \| <code>ArrayBuffer</code> \| <code>TypedArray</code> \| <code>DataView</code> |  | A unicode string with a passphrase. |
| S | <code>string</code> \| <code>ArrayBuffer</code> \| <code>TypedArray</code> \| <code>DataView</code> |  | A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16)) in browser's JS or with crypto.randomBytes(16).buffer in Node.js |
| dkLen | <code>number</code> |  | Intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32. |
| [scryptParams] | <code>Object</code> |  |  |
| [scryptParams.N] | <code>number</code> | <code>131072</code> | CPU/memory cost parameter - Must be a power of 2 (e.g. 1024) |
| [scryptParams.r] | <code>number</code> | <code>8</code> | The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used. |
| [scryptParams.p] | <code>number</code> | <code>1</code> | Parallelization parameter; a positive integer satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r. |

<a name="module_scrypt-pbkdf..scryptBlockMix"></a>

#### scrypt-pbkdf~scryptBlockMix(B)
The scryptBlockMix algorithm is the same as the BlockMix algorithm
described in the original scrypt paper but with Salsa20/8 Core used as
the hash function.

This function modifies the ArrayBuffer of the input BigUint64Array

**Kind**: inner method of [<code>scrypt-pbkdf</code>](#module_scrypt-pbkdf)  

| Param | Type | Description |
| --- | --- | --- |
| B | <code>Uint32Array</code> | B[0] || B[1] || ... || B[2 * r - 1]                          Input octet string (of size 128 * r octets),                          treated as 2 * r 64-octet blocks,                          where each element in B is a 64-octet block. |

<a name="module_scrypt-pbkdf..scryptROMix"></a>

#### scrypt-pbkdf~scryptROMix(B, N)
The scryptROMix algorithm

This function modifies the ArrayBuffer of the input BigInt64Array

**Kind**: inner method of [<code>scrypt-pbkdf</code>](#module_scrypt-pbkdf)  

| Param | Type | Description |
| --- | --- | --- |
| B | <code>Uint32Array</code> | Input octet vector of length 128 * r octets. |
| N | <code>number</code> | CPU/Memory cost parameter, must be larger than 1,                             a power of 2, and less than 2^(128 * r / 8). |

