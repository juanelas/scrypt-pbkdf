'use strict'

import inject from '@rollup/plugin-inject'
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import typescriptPlugin from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

import { dirname, join } from 'path'
import { existsSync } from 'fs-extra'
import { browser, name as _name, exports } from '../package.json'
import { compile } from './rollup-plugin-dts.js'

const rootDir = join(__dirname, '..')
// const dstDir = join(rootDir, directories.dist)
const srcDir = join(rootDir, 'src', 'ts')

function camelise (str) {
  return str.replace(/-([a-z])/g,
    function (m, w) {
      return w.toUpperCase()
    })
}

const regex = /^(?:(?<scope>@.*?)\/)?(?<name>.*)/ // We are going to take only the package name part if there is a scope, e.g. @my-org/package-name
const { name } = _name.match(regex).groups
const pkgCamelisedName = camelise(name)

const input = join(srcDir, 'index.ts')
if (existsSync(input) !== true) throw new Error('The entry point should be index.ts')

const tsBundleOptions = {
  tsconfig: join(rootDir, 'tsconfig.json'),
  outDir: undefined, // ignore outDir in tsconfig.json
  include: ['src/ts/**/*', 'build/typings/is-browser.d.ts'],
  exclude: ['src/**/*.spec.ts']
}

const sourcemapOutputOptions = {
  sourcemap: 'inline',
  sourcemapExcludeSources: true
}

function compileDts () {
  return {
    name: 'compile-dts',
    closeBundle () {
      compile()
    }
  }
}

export default [
  { // Browser ESM bundle
    input: input,
    output: [
      {
        file: join(rootDir, browser),
        ...sourcemapOutputOptions,
        format: 'es'
      }
    ],
    plugins: [
      replace({
        IS_BROWSER: true,
        preventAssignment: true
      }),
      typescriptPlugin(tsBundleOptions),
      commonjs({ extensions: ['.js', '.cjs', '.ts', '.jsx', '.cjsx', '.tsx'] }), // the ".ts" extension is required
      json()
    ]
  },
  { // Browser bundles
    input: input,
    output: [
      {
        file: join(rootDir, exports['./esm-browser-bundle']),
        format: 'es',
        plugins: [terser()]
      },
      {
        file: join(rootDir, exports['./iife-browser-bundle']),
        format: 'iife',
        name: pkgCamelisedName,
        plugins: [terser()]
      },
      {
        file: join(rootDir, exports['./umd-browser-bundle']),
        format: 'umd',
        name: pkgCamelisedName,
        plugins: [terser()]
      }
    ],
    plugins: [
      replace({
        IS_BROWSER: true,
        preventAssignment: true
      }),
      typescriptPlugin({
        ...tsBundleOptions,
        sourceMap: false
      }),
      resolve({
        browser: true,
        exportConditions: ['browser', 'default'],
        mainFields: ['browser', 'module', 'main']
      }),
      commonjs({ extensions: ['.js', '.cjs', '.ts', '.jsx', '.cjsx', '.tsx'] }), // the ".ts" extension is required
      json()
    ]
  },
  { // Node CJS
    input: input,
    output: [
      {
        file: join(rootDir, exports['.'].node.require),
        ...sourcemapOutputOptions,
        format: 'cjs',
        exports: 'auto',
        plugins: [
          terser()
        ]
      }
    ],
    plugins: [
      replace({
        IS_BROWSER: false,
        preventAssignment: true
      }),
      inject({
        crypto: 'crypto'
      }),
      typescriptPlugin(tsBundleOptions),
      // resolve({
      //   browser: false,
      //   exportConditions: ['require', 'node', 'module', 'import']
      // }),
      commonjs({ extensions: ['.js', '.cjs', '.ts', '.jsx', '.cjsx', '.tsx'] }), // the ".ts" extension is required
      json()
    ]
  },
  { // Node ESM and type declarations
    input: input,
    output: [
      {
        file: join(rootDir, exports['.'].node.import),
        ...sourcemapOutputOptions,
        format: 'es',
        plugins: [
          terser()
        ]
      }
    ],
    plugins: [
      replace({
        IS_BROWSER: false,
        __filename: `'${exports['.'].node.import}'`,
        __dirname: `'${dirname(exports['.'].node.import)}'`,
        preventAssignment: true
      }),
      inject({
        crypto: 'crypto'
      }),
      typescriptPlugin(tsBundleOptions),
      // resolve({
      //   browser: false,
      //   exportConditions: ['node']
      // }),
      compileDts(),
      commonjs({ extensions: ['.js', '.cjs', '.ts', '.jsx', '.cjsx', '.tsx'] }), // the ".ts" extension is required
      json()
    ]
  }
]
