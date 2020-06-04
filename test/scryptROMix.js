// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

const bigintConversion = require('bigint-conversion')

const vectors = require('./vectors/scryptROMix')

describe('testing scryptROMix', function () {
  this.timeout(360000)
  for (const vector of vectors) {
    describe(`${vector.comment} : B=${vector.input.B}, N=${vector.input.N}`, function () {
      const B = new Uint32Array(bigintConversion.hexToBuf(vector.input.B, true))
      if ('error' in vector) {
        it(`should be rejected because of ${vector.error}`, function () {
          try {
            _pkg.scryptROMix(B, vector.input.N)
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(vector.error)
          }
        })
      } else {
        it(`should match ${vector.output}`, function () {
          _pkg.scryptROMix(B, vector.input.N)
          chai.expect(bigintConversion.bufToHex(B)).to.equal(vector.output)
        })
      }
    })
  }
})
