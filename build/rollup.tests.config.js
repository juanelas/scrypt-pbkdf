'use strict'

import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import multi from '@rollup/plugin-multi-entry'

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { name, directories } from '../package.json'
import { dependencies } from '../package-lock.json'
const mochaVersion = dependencies.mocha.version
const chaiVersion = dependencies.chai.version
const pkgName = name

const rootDir = join(__dirname, '..')

// Let's first create the appropriate html file loading mocha, chai and a bundle of the tests
const templatePath = join(rootDir, directories.src, 'browser', 'tests-template.html')
const dstDir = join(rootDir, directories.test, 'browser')
const dstFileName = join(dstDir, 'index.html')

const template = readFileSync(templatePath, 'utf-8')

const testsJs = `
  <script type="module">
    import './tests.js'
    mocha.run()
  </script>`

writeFileSync(dstFileName,
  template.replace(/{{TESTS}}/g, testsJs).replace(/{{PKG_NAME}}/g, pkgName).replace(/{{MOCHA_VERSION}}/g, mochaVersion).replace(/{{CHAI_VERSION}}/g, chaiVersion)
)

const input = join(rootDir, directories.test, '*.js')
console.log(input)

export default [
  {
    input: input,
    plugins: [
      multi({ exports: false }),
      replace({
        '../lib/index.node': '../lib/index.browser.mod',
        'const chai = require(\'chai\')': '',
        delimiters: ['', ''],
        'process.browser': true
      }),
      commonjs(),
      resolve({
        browser: true
      })
    ],
    output: {
      file: join(dstDir, 'tests.js'),
      format: 'es'
    }
  }
]
