// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node.64bits.test')
const chai = require('chai')
// <--

const bigintConversion = require('bigint-conversion')

const vectors = require('./vectors/scrypt')

describe('testing scrypt 64 bits', function () {
  this.timeout(360000)
  for (const vector of vectors) {
    describe(`${vector.comment} : P=${vector.input.P}, S=${vector.input.S}, N=${vector.input.N}, r=${vector.input.r}, p=${vector.input.p}, dkLen=${vector.input.dkLen})`, function () {
      if ('error' in vector) {
        it(`should be rejected because of ${vector.error}`, async function () {
          try {
            await _pkg.scrypt(vector.input.P, vector.input.S, vector.input.N, vector.input.r, vector.input.p, vector.input.dkLen)
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(vector.error)
          }
        })
      } else {
        it(`should match ${vector.output}`, async function () {
          const ret = await _pkg.scrypt(vector.input.P, vector.input.S, vector.input.N, vector.input.r, vector.input.p, vector.input.dkLen)
          chai.expect(bigintConversion.bufToHex(ret)).to.equal(vector.output)
        })
      }
    })
  }
})
