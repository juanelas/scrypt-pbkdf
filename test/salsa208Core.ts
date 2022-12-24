import * as bigintConversion from 'bigint-conversion'
import * as _pkg from '#pkg'
import vectors from '../test-vectors/salsa208Core'

describe('testing Salsa 20/8 Core', function () {
  this.timeout(360000)
  for (const vector of vectors) {
    describe(`${vector.comment} : input=${vector.input.input}`, function () {
      const salsa = new Uint32Array(bigintConversion.hexToBuf(vector.input.input, true))
      it(`should match ${vector.output}`, function () {
        _pkg.salsa208Core(salsa)
        chai.expect(bigintConversion.bufToHex(salsa)).to.equal(vector.output)
      })
    })
  }
})
