[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
{{GITHUB_ACTIONS_BADGES}}

# {{PKG_NAME}}

A faster JS implementation of the scrypt password-based key derivation function

## Why another scrypt package?

> **`scrypt-pbkdf2` is 2 to 3 times faster in browsers than other state-of-the-art proposals (namely `scrypt-js` and `scryptsy`), and this means that it is 2 to 3 times more secure**.

Let me explain such a populist and utterly simplified answer.
The more secure scrypt is, the more time it needs to complete. Frontend developers know that usability comes first and time is crucial. Therefore, it is likely that they can't allow scrypt to last for more than a few seconds (at most)

Scrypt obviously can be tuned to accomplish such a goal. Quoting the [RFC](https://tools.ietf.org/html/rfc7914#section-2):

> Users of scrypt can tune the parameters N, r, and p according to the amount of memory and computing power available, the latency-bandwidth product of the memory subsystem, and the amount of parallelism desired.  At the current time, r=8 and p=1 appears to yield good results, but as memory latency and CPU parallelism increase, it is likely that the optimum values for both r and p will increase.

[Parameter recommendations](https://blog.filippo.io/the-scrypt-parameters/) rely on the idea of using fixed `r=8`and `p=1` and get the biggest `N` (the one and only work factor) that will make scrypt run in less than the desired time. Since memory and CPU usage scale linearly with `N`, so does time and security. Consequently (and oversimplifying), **being 2 to 3 times faster is being 2 to 3 times more secure**

The following table summarizes benchmarks obtained with [Benchmark.js](https://benchmarkjs.com/) with Chrome 83 Linux 64 bits for fixed values `r=8`, `p=1` and varying `N` values. The comparison is similar in Firefox (although twice slower).

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

Benchmarks for Node.js are way better than the ones obtained with browsers, probably because the different packages make use of native implementations. In the case of `scrypt-pbkdf` the performance shoudl be the same as the Node's `crypto.scrypt()`.

## Installation

`{{PKG_NAME}}` can be imported to your project with `npm`:

```bash
npm install {{PKG_NAME}}
```

NPM installation defaults to the ES6 module for browsers and the CJS one for Node.js. For web browsers, you can also directly download the {{IIFE_BUNDLE}} or the {{ESM_BUNDLE}} from the repository.

## Usage examples

Import your module as :

 - Node.js
   ```javascript
   const {{PKG_CAMELCASE}} = require('{{PKG_NAME}}')
   ... // your code here
   ```
 - JavaScript native or TypeScript project (including React and Angular)
   ```javascript
   import {{PKG_CAMELCASE}} from '{{PKG_NAME}}'
   ... // your code here
   ```
 - JavaScript native browser ES module
   ```html
   <script type="module">
      import {{PKG_CAMELCASE}} from 'lib/index.browser.bundle.mod.js'  // Use your actual path to the broser mod bundle
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
const salt = {{PKG_CAMELCASE}}.salt()  // returns an ArrayBuffer filled with 16 random bytes
const derivedKeyLength = 32  // in bytes
const key = await {{PKG_CAMELCASE}}.scrypt(password, salt, derivedKeyLength)  // key is an ArrayBuffer
```

I have chosen a value of `N=131072` since, based in my own benchmarks, a browser should be able to compute in 5 seconds. However, it is likely that you want to tune the scrypt parameters.

An example of usage (from an async function) using scrypt parameters (`N=16384`, `r=8`, `p=2`) and a random salt of 32 bytes to derive a key of 256 bits (32 bytes) from password 'mySuperSecurePassword':

```javascript
const password = 'mySuperSecurePassword'
const salt = {{PKG_CAMELCASE}}.salt(32)
const scryptParams = {
  N: 16384,
  r: 8,
  p: 2
}
const derivedKeyLength = 32
const key = await {{PKG_CAMELCASE}}.scrypt(password, salt, derivedKeyLength, scryptParams)
```

## API reference documentation

{{>main}}
