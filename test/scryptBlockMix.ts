import * as bigintConversion from 'bigint-conversion'

import vectors from '../test-vectors/scryptBlockMix'

describe('testing scryptBlockMix', function () {
  this.timeout(360000)
  for (const vector of vectors) {
    describe(`${vector.comment} : B=${vector.input.B}`, function () {
      const B = new Uint32Array(bigintConversion.hexToBuf(vector.input.B, true))
      it(`should match ${vector.output}`, function () {
        _pkg.scryptBlockMix(B)
        chai.expect(bigintConversion.bufToHex(B)).to.equal(vector.output)
      })
    })
  }
})
