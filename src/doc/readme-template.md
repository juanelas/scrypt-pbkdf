[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
{{GITHUB_ACTIONS_BADGES}}

# {{PKG_NAME}}

*THIS PACKAGE IS NOT YET READY. I NEED TO FINISH IT FIRST*

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
   import * as {{PKG_CAMELCASE}} from '{{PKG_NAME}}'
   ... // your code here
   ```
 - JavaScript native browser ES module
   ```html
   <script type="module">
      import * as {{PKG_CAMELCASE}} from 'lib/index.browser.bundle.mod.js'  // Use you actual path to the broser mod bundle
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

{{>main}}
