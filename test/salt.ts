import * as _pkg from '#pkg'

describe('testing random salt generation', function () {
  for (let i = -1; i < 32; i++) {
    describe(`salt(${i})`, function () {
      if (i < 0) {
        it(`should be rejected because of ${i} < 0`, function () {
          try {
            _pkg.salt(i)
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(RangeError)
          }
        })
      } else {
        it(`should return an ArrayBuffer with ${i} random bytes`, function () {
          const salt = _pkg.salt(i)
          chai.expect(salt.byteLength).to.equal(i)
        })
      }
    })
  }
  describe('salt()', function () {
    it('should return an ArrayBuffer with 16 random bytes', function () {
      const salt = _pkg.salt()
      chai.expect(salt.byteLength).to.equal(16)
    })
  })
})
