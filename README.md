[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Node CI](https://github.com/juanelas/scrypt-pbkdf/workflows/Node%20CI/badge.svg)](https://github.com/juanelas/scrypt-pbkdf/actions?query=workflow%3A%22Node+CI%22)
[![Coverage Status](https://coveralls.io/repos/github/juanelas/scrypt-pbkdf/badge.svg?branch=master)](https://coveralls.io/github/juanelas/scrypt-pbkdf?branch=master)

# scrypt-pbkdf

A faster JS implementation of the scrypt password-based key derivation function

## Why another scrypt package

**Efficiency and speed**.

The following are benchmarks obtained with the [test vectors defined in the RFC](https://tools.ietf.org/html/rfc7914#section-12) with Chrome 83 Linux 64 bits. The comparisson is similar in Firefox.

```
Input: {"P":"","S":"","N":16,"r":1,"p":1,"dkLen":64} https://tools.ietf.org/html/rfc7914#section-12  #1
  scrypt-pbkdf x 4,692 ops/sec ±5.19% (53 runs sampled)
  scrypt-js x 8,821 ops/sec ±3.04% (59 runs sampled)
  scryptsy x 90.03 ops/sec ±2.28% (48 runs sampled)

Input: {"P":"password","S":"NaCl","N":1024,"r":8,"p":16,"dkLen":64} https://tools.ietf.org/html/rfc7914#section-12  #2
  scrypt-pbkdf x 3.08 ops/sec ±0.71% (20 runs sampled)
  scrypt-js x 0.50 ops/sec ±4.78% (7 runs sampled)
  scryptsy x 1.13 ops/sec ±0.54% (10 runs sampled)

Input: {"P":"pleaseletmein","S":"SodiumChloride","N":16384,"r":8,"p":1,"dkLen":64} https://tools.ietf.org/html/rfc7914#section-12  #3
  scrypt-pbkdf x 2.89 ops/sec ±1.52% (19 runs sampled)
  scrypt-js x 0.53 ops/sec ±9.85% (7 runs sampled)
  scryptsy x 1.27 ops/sec ±0.66% (11 runs sampled)

Input: {"P":"pleaseletmein","S":"SodiumChloride","N":1048576,"r":8,"p":1,"dkLen":64} https://tools.ietf.org/html/rfc7914#section-12  #4
  scrypt-pbkdf x 0.04 ops/sec ±1.25% (5 runs sampled)
  scrypt-js x 0.01 ops/sec ±3.21% (5 runs sampled)
  scryptsy x 0.02 ops/sec ±0.74% (5 runs sampled)
```

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
   import scryptPbkdf from 'scrypt-pbkdf'
   ... // your code here
   ```
 - JavaScript native browser ES module
   ```html
   <script type="module">
      import scryptPbkdf from 'lib/index.browser.bundle.mod.js'  // Use your actual path to the broser mod bundle
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

An example of usage could be (from an async function):

```javascript
YOUR JAVASCRIPT EXAMPLE CODE HERE
```

## API reference documentation

<a name="module_scrypt-pbkdf"></a>

### scrypt-pbkdf
Scrypt password-based key derivation function (RFC 7914)


* [scrypt-pbkdf](#module_scrypt-pbkdf)
    * [~salsa208Core(arr)](#module_scrypt-pbkdf..salsa208Core)
    * [~scrypt(P, S, N, r, p, dkLen)](#module_scrypt-pbkdf..scrypt)
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

<a name="module_scrypt-pbkdf..scrypt"></a>

#### scrypt-pbkdf~scrypt(P, S, N, r, p, dkLen)
The scrypt Algorithm (RFC 7914)

**Kind**: inner method of [<code>scrypt-pbkdf</code>](#module_scrypt-pbkdf)  

| Param | Type | Description |
| --- | --- | --- |
| P | <code>string</code> \| <code>ArrayBuffer</code> \| <code>TypedArray</code> \| <code>DataView</code> | A unicode string with a passphrase. |
| S | <code>string</code> \| <code>ArrayBuffer</code> \| <code>TypedArray</code> \| <code>DataView</code> | A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16)). |
| N | <code>number</code> | CPU/memory cost parameter - Must be a power of 2 (e.g. 1024) |
| r | <code>number</code> | The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used. |
| p | <code>number</code> | Parallelization parameter; a positive integer satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r. |
| dkLen | <code>number</code> | Intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32. |

<a name="module_scrypt-pbkdf..scryptBlockMix"></a>

#### scrypt-pbkdf~scryptBlockMix(B)
The scryptBlockMix algorithm is the same as the BlockMix algorithm
described in [SCRYPT] but with Salsa20/8 Core used as the hash function H.
Below, Salsa(T) corresponds to the Salsa20/8 Core function applied to the
octet vector T.

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

