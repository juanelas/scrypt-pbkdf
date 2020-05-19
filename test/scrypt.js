// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->
const _pkg = require('../lib/index.node')
const chai = require('chai')
// <--

const bigintConversion = require('bigint-conversion')

const tests = [
  {
    // https://tools.ietf.org/html/rfc7914#section-12  #1
    P: new ArrayBuffer(),
    S: new TextEncoder().encode(''),
    N: 16,
    r: 1,
    p: 1,
    dkLen: 64,
    output: '77d6576238657b203b19ca42c18a0497f16b4844e3074ae8dfdffa3fede21442fcd0069ded0948f8326a753a0fc81f17e8d3e0fb2e0d3628cf35e20c38d18906'
  },
  {
    // https://tools.ietf.org/html/rfc7914#section-12  #2
    P: 'password',
    S: 'NaCl',
    N: 1024,
    r: 8,
    p: 16,
    dkLen: 64,
    output: 'fdbabe1c9d3472007856e7190d01e9fe7c6ad7cbc8237830e77376634b3731622eaf30d92e22a3886ff109279d9830dac727afb94a83ee6d8360cbdfa2cc0640'
  },
  {
    // https://tools.ietf.org/html/rfc7914#section-12  #3
    P: new TextEncoder().encode('pleaseletmein'),
    S: 'SodiumChloride',
    N: 16384,
    r: 8,
    p: 1,
    dkLen: 64,
    output: '7023bdcb3afd7348461c06cd81fd38ebfda8fbba904f8e3ea9b543f6545da1f2d5432955613f0fcf62d49705242a9af9e61e85dc0d651e40dfcf017b45575887'
  },
  // {
  //   // https://tools.ietf.org/html/rfc7914#section-12  #4
  //   P: 'pleaseletmein',
  //   S: 'SodiumChloride',
  //   N: 1048576,
  //   r: 8,
  //   p: 1,
  //   dkLen: 64,
  //   output: '2101cb9b6a511aaeaddbbe09cf70f881ec568d574a2ffd4dabe5ee9820adaa478e56fd8f4ba5d09ffa1c6d927c40f4c337304049e8a952fbcbf45c6fa77a41a4'
  // },
  {
    P: '',
    S: '',
    N: 1024,
    r: 8,
    p: 16,
    dkLen: 64,
    output: '7dd38537d71e6ae3a01205a801e3a6720ac1aa1aae0c32b8d583cc5e8c9a87e4a42eeac837ea1fec04f55d1c54057343b4b2c060e6996ff213a130563525ae88'
  },
  {
    P: new ArrayBuffer(),
    S: '',
    N: 1024,
    r: 1,
    p: 16,
    dkLen: 64,
    output: '0ba777e97ce849e631ea66c9c4d6762b04f9c8db865dad34f13de6947981d9b25b3dccc4d0a75c1b0230df22c179ae392dc867d798b11091cfc1cf06978b7c84'
  },
  {
    P: '',
    S: new ArrayBuffer(),
    N: 1024,
    r: 8,
    p: 1,
    dkLen: 64,
    output: '225009a832a3041c158e2ab8913019a27674c604d704a38ad1c7b58401a88b213b2a374d65016b82231fc469caf5b02134c8f52941d185e4b1d51fab0996eb46'
  }
]

describe('testing scrypt', function () {
  this.timeout(180000)
  for (const test of tests) {
    describe(`scrypt(${test.P}, ${test.S}, ${test.N}, ${test.r}, ${test.p}, ${test.dkLen})`, function () {
      it(`should match ${test.output}`, async function () {
        const ret = await _pkg.scrypt(test.P, test.S, test.N, test.r, test.p, test.dkLen)
        chai.expect(bigintConversion.bufToHex(ret)).to.equal(test.output)
      })
    })
  }
})
