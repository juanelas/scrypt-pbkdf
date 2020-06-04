// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

const bigintConversion = require('bigint-conversion')

const vectors = require('./vectors/salsa208Core')

describe('testing Salsa 20/8 Core', function () {
  this.timeout(360000)
  for (const vector of vectors) {
    describe(`${vector.comment} : input=${vector.input.input}`, function () {
      const salsa = new Uint32Array(bigintConversion.hexToBuf(vector.input.input, true))
      if ('error' in vector) {
        it(`should be rejected because of ${vector.error}`, function () {
          try {
            _pkg.salsa208Core(salsa)
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(vector.error)
          }
        })
      } else {
        it(`should match ${vector.output}`, function () {
          _pkg.salsa208Core(salsa)
          chai.expect(bigintConversion.bufToHex(salsa)).to.equal(vector.output)
        })
      }
    })
  }
})
