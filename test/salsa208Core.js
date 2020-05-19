// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

const bigintConversion = require('bigint-conversion')

const tests = [
  {
    // https://tools.ietf.org/html/rfc7914#section-8
    input: '7e879a214f3ec9867ca940e641718f26baee555b8c61c1b50df846116dcd3b1dee24f319df9b3d8514121e4b5ac5aa3276021d2909c74829edebc68db8b8c25e',
    output: 'a41f859c6608cc993b81cacb020cef05044b2181a2fd337dfd7b1c6396682f29b4393168e3c9e6bcfe6bc5b7a06d96bae424cc102c91745c24ad673dc7618f81'
  }
]

describe('testing Salsa 20/8 Core', function () {
  for (const test of tests) {
    describe(`salsa208Core(${test.input})`, function () {
      it(`should match ${test.output}`, async function () {
        const salsa = new Uint32Array(bigintConversion.hexToBuf(test.input, true))
        await _pkg.salsa208Core(salsa)
        chai.expect(bigintConversion.bufToHex(salsa)).to.equal(test.output)
      })
    })
  }
})
