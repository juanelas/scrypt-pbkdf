'use strict'

const resolve = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const { terser } = require('rollup-plugin-terser')

const path = require('path')
const pkgJson = require('../package.json')

const rootDir = path.join(__dirname, '..')
const srcDir = path.join(rootDir, pkgJson.directories.src)
const dstDir = path.join(rootDir, pkgJson.directories.lib)

function camelise (str) {
  return str.replace(/-([a-z])/g,
    function (m, w) {
      return w.toUpperCase()
    })
}

const pkgName = pkgJson.name
const pkgCamelisedName = camelise(pkgName)

const input = path.join(srcDir, 'js', 'index.js')
const input64 = path.join(srcDir, 'js', 'index64.js')

module.exports = [
  { // Native JS
    input: input,
    output: [
      {
        file: path.join(rootDir, pkgJson.browser),
        format: 'es'
      }
    ],
    plugins: [
      replace({
        'process.browser': true
      })
    ],
    external: ['bigint-mod-arith']
  },
  { // Browser bundles
    input: input,
    output: [
      {
        file: path.join(dstDir, 'index.browser.bundle.iife.js'),
        format: 'iife',
        name: pkgCamelisedName
      },
      {
        file: path.join(dstDir, 'index.browser.bundle.mod.js'),
        format: 'es'
      }
    ],
    plugins: [
      replace({
        'process.browser': true
      }),
      resolve({
        browser: true
      }),
      terser()
    ]
  },
  { // Node
    input: input,
    output: {
      file: path.join(rootDir, pkgJson.main),
      format: 'cjs',
      esModule: false,
      externalLiveBindings: false
    },
    plugins: [
      replace({
        'process.browser': false
      })
    ],
    external: ['bigint-mod-arith']
  },
  { // Test 64 bits (BigUint64Array) browser
    input: input64,
    output: [
      {
        file: path.join(dstDir, 'index.browser.mod.64bits.test.js'),
        format: 'es'
      }
    ],
    plugins: [
      replace({
        'process.browser': true
      })
    ],
    external: ['bigint-mod-arith']
  },
  { // Test Node 64 bits (BigUint64Array)
    input: input64,
    output: {
      file: path.join(rootDir, 'lib/index.node.64bits.test.js'),
      format: 'cjs',
      esModule: false,
      externalLiveBindings: false
    },
    plugins: [
      replace({
        'process.browser': false
      })
    ],
    external: ['bigint-mod-arith']
  }
]
