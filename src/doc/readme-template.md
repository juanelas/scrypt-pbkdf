[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
{{GITHUB_ACTIONS_BADGES}}

# {{PKG_NAME}}

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

An example of usage could be (from an async function):

```javascript
await {{PKG_CAMELCASE}}.scrypt('password', 'salt', 1024, 8, 16, 32)
```

## API reference documentation

{{>main}}
