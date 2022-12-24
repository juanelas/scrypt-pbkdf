import * as bigintConversion from 'bigint-conversion'
import * as _pkg from '#pkg'

import vectors from '../test-vectors/scrypt'

describe('testing scrypt', function () {
  this.timeout(360000)
  for (const vector of vectors) {
    describe(`${vector.comment} : P=${JSON.stringify(vector.input.P)}, S=${JSON.stringify(vector.input.S)}, N=${vector.input.N}, r=${vector.input.r}, p=${vector.input.p}, dkLen=${vector.input.dkLen})`, function () {
      if (vector.error !== undefined) {
        it(`should be rejected because of ${vector.error.toString()}`, async function () {
          try {
            await _pkg.scrypt(vector.input.P as any, vector.input.S as any, vector.input.dkLen, { N: vector.input.N, r: vector.input.r, p: vector.input.p })
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(vector.error)
          }
        })
      } else {
        it(`should match ${vector.output}`, async function () {
          const ret = await _pkg.scrypt(vector.input.P, vector.input.S, vector.input.dkLen, { N: vector.input.N, r: vector.input.r, p: vector.input.p })
          chai.expect(bigintConversion.bufToHex(ret)).to.equal(vector.output)
        })
        if (vector.input.N === 131072 && vector.input.r === 8 && vector.input.p === 1) {
          it(`should also match ${vector.output} calling scrypt with default scryptParams`, async function () {
            const ret = await _pkg.scrypt(vector.input.P, vector.input.S, vector.input.dkLen)
            chai.expect(bigintConversion.bufToHex(ret)).to.equal(vector.output)
          })
        }
      }
    })
  }
})
