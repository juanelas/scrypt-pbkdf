import * as bigintConversion from 'bigint-conversion'
import * as _pkg from '#pkg'
import vectors from '../test-vectors/scryptROMix'

describe('testing scryptROMix', function () {
  this.timeout(360000)
  for (const vector of vectors) {
    describe(`${vector.comment} : B=${vector.input.B}, N=${vector.input.N}`, function () {
      const B = new Uint32Array(bigintConversion.hexToBuf(vector.input.B, true))
      it(`should match ${vector.output}`, function () {
        _pkg.scryptROMix(B, vector.input.N)
        chai.expect(bigintConversion.bufToHex(B)).to.equal(vector.output)
      })
    })
  }
})
