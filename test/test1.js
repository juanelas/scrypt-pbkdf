// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

const inputs = ['Hello!', 'Goodbye']

describe('testing function echo()', function () {
  for (const input of inputs) {
    describe(`echo(${input})`, function () {
      it(`should echo ${input}`, function () {
        const ret = _pkg.echo(input) // always call you package as _pkg
        chai.expect(ret).to.equal(input)
      })
    })
  }
})
