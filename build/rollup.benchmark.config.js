'use strict'

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'

import { mkdirSync, copyFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { directories } from '../package.json'

const rootDir = join(__dirname, '..')
const benchmarkDir = join(rootDir, directories.benchmark)

const benchmarkBrowserDir = join(benchmarkDir, 'browser')
try { mkdirSync(benchmarkBrowserDir) } catch {}
copyFileSync(join(rootDir, 'node_modules', 'benchmark', 'benchmark.js'), join(benchmarkBrowserDir, 'benchmark.js'))
copyFileSync(join(rootDir, 'node_modules', 'lodash', 'lodash.js'), join(benchmarkBrowserDir, 'lodash.js'))
copyFileSync(join(rootDir, 'node_modules', 'platform', 'platform.js'), join(benchmarkBrowserDir, 'platform.js'))
writeFileSync(join(benchmarkBrowserDir, 'index.html'), `<!DOCTYPE html>
<html>

<head>
  <title>Benchmark</title>
  <script src="lodash.js"></script>
  <script src="platform.js"></script>
  <script src="benchmark.js"></script>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>

<body>
  <pre id="console" style="white-space: pre-wrap;"></pre>
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

const input = join(benchmarkDir, 'scryptParamTunning.js')

export default [
  { // Browser bundles
    input: input,
    output: [
      {
        file: join(benchmarkBrowserDir, 'tests.js'),
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
