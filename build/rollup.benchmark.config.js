'use strict'

const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')

const fs = require('fs')
const path = require('path')

const pkgJson = require('../package.json')

const rootDir = path.join(__dirname, '..')
const benchmarkDir = path.join(rootDir, pkgJson.directories.benchmark)

const benchmarkBrowserDir = path.join(benchmarkDir, 'browser')
try { fs.mkdirSync(benchmarkBrowserDir) } catch {}
fs.copyFileSync(path.join(rootDir, 'node_modules', 'benchmark', 'benchmark.js'), path.join(benchmarkBrowserDir, 'benchmark.js'))
fs.copyFileSync(path.join(rootDir, 'node_modules', 'lodash', 'lodash.js'), path.join(benchmarkBrowserDir, 'lodash.js'))
fs.copyFileSync(path.join(rootDir, 'node_modules', 'platform', 'platform.js'), path.join(benchmarkBrowserDir, 'platform.js'))
fs.writeFileSync(path.join(benchmarkBrowserDir, 'index.html'), `<!DOCTYPE html>
<html>

<head>
  <title>Benchmark</title>
  <script src="lodash.js"></script>
  <script src="platform.js"></script>
  <script src="benchmark.js"></script>
</head>

<body>
  <pre id="console"></pre>
  <script defer>
  console.error = console.warn = console.trace = console.info = console.log = (function (old_function, div_log) { 
    return function (text) {
      old_function(text)
      div_log.innerHTML += text + '<br />'
    }
  } (console.log.bind(console), document.getElementById('console')))
  </script>
  <script src="./tests.js" defer></script>
</body>

</html>
`)

const input = path.join(benchmarkDir, 'scrypt.js')

module.exports = [
  { // Browser bundles
    input: input,
    output: [
      {
        file: path.join(benchmarkBrowserDir, 'tests.js'),
        format: 'es'
      }
    ],
    plugins: [
      replace({
        '../lib/index.node': '../lib/index.browser.mod',
        'const Benchmark = require(\'benchmark\')': '',
        'require(\'scryptsy\')': 'require(\'./browserified/scryptsy.js\')',
        'process.browser = true;': '',
        delimiters: ['', ''],
        'process.browser': true
      }),
      commonjs(),
      resolve({
        browser: true
      })
    ],
    external: []
  }
]
