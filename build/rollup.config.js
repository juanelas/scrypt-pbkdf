'use strict'

import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'

import { join } from 'path'
import { directories, name as _name, browser as _browser, main } from '../package.json'

const rootDir = join(__dirname, '..')
const srcDir = join(rootDir, directories.src)
const dstDir = join(rootDir, directories.lib)

function camelise (str) {
  return str.replace(/-([a-z])/g,
    function (m, w) {
      return w.toUpperCase()
    })
}

const pkgName = _name
const pkgCamelisedName = camelise(pkgName)

const input = join(srcDir, 'js', 'index.js')
const input64 = join(srcDir, 'js', 'index64.js')

export default [
  { // Native JS
    input: input,
    output: [
      {
        file: join(rootDir, _browser),
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
        file: join(dstDir, 'index.browser.bundle.iife.js'),
        format: 'iife',
        name: pkgCamelisedName
      },
      {
        file: join(dstDir, 'index.browser.bundle.mod.js'),
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
      file: join(rootDir, main),
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
        file: join(dstDir, 'index.browser.mod.64bits.test.js'),
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
      file: join(rootDir, 'lib/index.node.64bits.test.js'),
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
