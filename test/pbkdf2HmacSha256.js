// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

const bigintConversion = require('bigint-conversion')

const vectors = require('./vectors/pbkdf2HmacSha256')

describe('testing pbkdf2HmacSha256', function () {
  this.timeout(360000)
  for (const vector of vectors) {
    describe(`${vector.comment} : P=${vector.P}, S=${vector.S}, c=${vector.c}, dkLen=${vector.dkLen})`, function () {
      if ('error' in vector) {
        it(`should be rejected because of ${vector.error}`, async function () {
          try {
            await _pkg.pbkdf2HmacSha256(vector.P, vector.S, vector.c, vector.dkLen)
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(vector.error)
          }
        })
      } else {
        it(`should match ${vector.output}`, async function () {
          const ret = await _pkg.pbkdf2HmacSha256(vector.P, vector.S, vector.c, vector.dkLen)
          chai.expect(bigintConversion.bufToHex(ret)).to.equal(vector.output)
        })
      }
    })
  }
})
