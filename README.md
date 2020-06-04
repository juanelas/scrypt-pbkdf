[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Node CI](https://github.com/juanelas/scrypt-pbkdf/workflows/Node%20CI/badge.svg)](https://github.com/juanelas/scrypt-pbkdf/actions?query=workflow%3A%22Node+CI%22)
[![Coverage Status](https://coveralls.io/repos/github/juanelas/scrypt-pbkdf/badge.svg?branch=master)](https://coveralls.io/github/juanelas/scrypt-pbkdf?branch=master)

# scrypt-pbkdf

*THIS PACKAGE IS NOT YET READY. I NEED TO FINISH IT FIRST*

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
      import * as scryptPbkdf from 'lib/index.browser.bundle.mod.js'  // Use you actual path to the broser mod bundle
      ... // your code here
    </script>
   ```
 - JavaScript native browser IIFE
   ```html
   <head>
     ...
     <script src="../../lib/index.browser.bundle.iife.js"></script> <!-- Use you actual path to the browser bundle -->
   </head>
   <body>
     ...
     <script>
       ... // your code here
     </script>
   </body>
   ```

An example of usage could be:

```javascript
YOUR JAVASCRIPT EXAMPLE CODE HERE
```

## API reference documentation

<a name="module_scrypt-bigint"></a>

### scrypt-bigint
Native JS implementation of scrypt using BigInt and BigUint64Arrays


* [scrypt-bigint](#module_scrypt-bigint)
    * [~TypedArray](#module_scrypt-bigint..TypedArray) : <code>Int8Array</code> \| <code>Uint8Array</code> \| <code>Uint8ClampedArray</code> \| <code>Int16Array</code> \| <code>Uint16Array</code> \| <code>Int32Array</code> \| <code>Uint32Array</code> \| <code>Float32Array</code> \| <code>Float64Array</code> \| <code>BigInt64Array</code> \| <code>BigUint64Array</code>
    * [~pbkdf2HmacSha256(P, S, c, dkLen)](#module_scrypt-bigint..pbkdf2HmacSha256) ⇒ <code>Promise.&lt;ArrayBuffer&gt;</code>
    * [~salsa208Core(arr)](#module_scrypt-bigint..salsa208Core)
    * [~scrypt(P, S, N, r, p, dkLen)](#module_scrypt-bigint..scrypt)
    * [~scryptBlockMix(B)](#module_scrypt-bigint..scryptBlockMix)
    * [~scryptROMix(B, N)](#module_scrypt-bigint..scryptROMix)
    * [~typedArrayXor(arr1, arr2)](#module_scrypt-bigint..typedArrayXor)

<a name="module_scrypt-bigint..TypedArray"></a>

#### scrypt-bigint~TypedArray : <code>Int8Array</code> \| <code>Uint8Array</code> \| <code>Uint8ClampedArray</code> \| <code>Int16Array</code> \| <code>Uint16Array</code> \| <code>Int32Array</code> \| <code>Uint32Array</code> \| <code>Float32Array</code> \| <code>Float64Array</code> \| <code>BigInt64Array</code> \| <code>BigUint64Array</code>
A TypedArray object describes an array-like view of an underlying binary data buffer.

**Kind**: inner typedef of [<code>scrypt-bigint</code>](#module_scrypt-bigint)  
<a name="module_scrypt-bigint..pbkdf2HmacSha256"></a>

#### scrypt-bigint~pbkdf2HmacSha256(P, S, c, dkLen) ⇒ <code>Promise.&lt;ArrayBuffer&gt;</code>
The PBKDF2-HMAC-SHA-256 function used below denotes the PBKDF2 algorithm
(RFC2898) used with HMAC-SHA-256 as the Pseudorandom Function (PRF)

**Kind**: inner method of [<code>scrypt-bigint</code>](#module_scrypt-bigint)  

| Param | Type | Description |
| --- | --- | --- |
| P | <code>string</code> \| <code>ArrayBuffer</code> \| <code>TypedArray</code> \| <code>DataView</code> | A unicode string with a password |
| S | <code>string</code> \| <code>ArrayBuffer</code> \| <code>TypedArray</code> \| <code>DataView</code> | A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16)) |
| c | <code>number</code> | iteration count, a positive integer |
| dkLen | <code>number</code> | intended length in octets of the derived key |

<a name="module_scrypt-bigint..salsa208Core"></a>

#### scrypt-bigint~salsa208Core(arr)
Salsa20/8 Core is a round-reduced variant of the Salsa20 Core.  It is a
hash function from 64-octet strings to 64-octet strings.  Note that
Salsa20/8 Core is not a cryptographic hash function since it is not
collision resistant.

This function modifies the ArrayBuffer of the input UInt32Array

**Kind**: inner method of [<code>scrypt-bigint</code>](#module_scrypt-bigint)  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Uint32Array</code> | a binary array of 64 octets |

<a name="module_scrypt-bigint..scrypt"></a>

#### scrypt-bigint~scrypt(P, S, N, r, p, dkLen)
The scrypt Algorithm (RFC 7914)

**Kind**: inner method of [<code>scrypt-bigint</code>](#module_scrypt-bigint)  

| Param | Type | Description |
| --- | --- | --- |
| P | <code>string</code> \| <code>ArrayBuffer</code> \| <code>TypedArray</code> \| <code>DataView</code> | A unicode string with a passphrase. |
| S | <code>string</code> \| <code>ArrayBuffer</code> \| <code>TypedArray</code> \| <code>DataView</code> | A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16)). |
| N | <code>number</code> | CPU/memory cost parameter - Must be a power of 2 (e.g. 1024) |
| r | <code>number</code> | The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used. |
| p | <code>number</code> | Parallelization parameter; a positive integer satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r. |
| dkLen | <code>number</code> | Intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32. |

<a name="module_scrypt-bigint..scryptBlockMix"></a>

#### scrypt-bigint~scryptBlockMix(B)
The scryptBlockMix algorithm is the same as the BlockMix algorithm
described in [SCRYPT] but with Salsa20/8 Core used as the hash function H.
Below, Salsa(T) corresponds to the Salsa20/8 Core function applied to the
octet vector T.

This function modifies the ArrayBuffer of the input BigUint64Array

**Kind**: inner method of [<code>scrypt-bigint</code>](#module_scrypt-bigint)  

| Param | Type | Description |
| --- | --- | --- |
| B | <code>Uint32Array</code> | B[0] || B[1] || ... || B[2 * r - 1]                          Input octet string (of size 128 * r octets),                          treated as 2 * r 64-octet blocks,                          where each element in B is a 64-octet block. |

<a name="module_scrypt-bigint..scryptROMix"></a>

#### scrypt-bigint~scryptROMix(B, N)
The scryptROMix algorithm

This function modifies the ArrayBuffer of the input BigInt64Array

**Kind**: inner method of [<code>scrypt-bigint</code>](#module_scrypt-bigint)  

| Param | Type | Description |
| --- | --- | --- |
| B | <code>Uint32Array</code> | Input octet vector of length 128 * r octets. |
| N | <code>number</code> | CPU/Memory cost parameter, must be larger than 1,                             a power of 2, and less than 2^(128 * r / 8). |

<a name="module_scrypt-bigint..typedArrayXor"></a>

#### scrypt-bigint~typedArrayXor(arr1, arr2)
XORs arr2 to arr1

**Kind**: inner method of [<code>scrypt-bigint</code>](#module_scrypt-bigint)  

| Param | Type |
| --- | --- |
| arr1 | <code>TypedArray</code> | 
| arr2 | <code>TypedArray</code> | 

