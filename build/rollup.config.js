'use strict'

import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'

import { join } from 'path'
import { directories, name as _name, browser as _browser, main } from '../package.json'
import ignore from 'rollup-plugin-ignore'

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
    external: ['pbkdf2-hmac']
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
      }),
      ignore(['pbkdf2-hmac'])
    ]
  }
]
