'use strict'

const resolve = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const commonjs = require('@rollup/plugin-commonjs')
const multi = require('@rollup/plugin-multi-entry')

const fs = require('fs')
const path = require('path')
const pkgJson = require('../package.json')
const pkgJsonLock = require('../package-lock.json')
const mochaVersion = pkgJsonLock.dependencies.mocha.version
const chaiVersion = pkgJsonLock.dependencies.chai.version
const pkgName = pkgJson.name

const rootDir = path.join(__dirname, '..')

// Let's first create the appropriate html file loading mocha, chai and a bundle of the tests
const templatePath = path.join(rootDir, pkgJson.directories.src, 'browser', 'tests-template.html')
const dstDir = path.join(rootDir, pkgJson.directories.test, 'browser')
const dstFileName = path.join(dstDir, 'index.html')

const template = fs.readFileSync(templatePath, 'utf-8')

const testsJs = `
  <script type="module">
    import './tests.js'
    mocha.run()
  </script>`

fs.writeFileSync(dstFileName,
  template.replace(/{{TESTS}}/g, testsJs).replace(/{{PKG_NAME}}/g, pkgName).replace(/{{MOCHA_VERSION}}/g, mochaVersion).replace(/{{CHAI_VERSION}}/g, chaiVersion)
)

const input = path.join(rootDir, pkgJson.directories.test, '*.js')
console.log(input)

module.exports = [
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
      file: path.join(dstDir, 'tests.js'),
      format: 'es'
    }
  }
]
