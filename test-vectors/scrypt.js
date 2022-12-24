export default [
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-12  #1',
    input: {
      P: new ArrayBuffer(0),
      S: new TextEncoder().encode(''),
      N: 16,
      r: 1,
      p: 1,
      dkLen: 64
    },
    output: '77d6576238657b203b19ca42c18a0497f16b4844e3074ae8dfdffa3fede21442fcd0069ded0948f8326a753a0fc81f17e8d3e0fb2e0d3628cf35e20c38d18906'
  },
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-12  #2',
    input: {
      P: 'password',
      S: 'NaCl',
      N: 1024,
      r: 8,
      p: 16,
      dkLen: 64
    },
    output: 'fdbabe1c9d3472007856e7190d01e9fe7c6ad7cbc8237830e77376634b3731622eaf30d92e22a3886ff109279d9830dac727afb94a83ee6d8360cbdfa2cc0640'
  },
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-12  #3\nRecommended parameters for interactive login as of 2009 ("check what you can run within 100 ms")',
    input: {
      P: new TextEncoder().encode('pleaseletmein'),
      S: 'SodiumChloride',
      N: 16384,
      r: 8,
      p: 1,
      dkLen: 64
    },
    output: '7023bdcb3afd7348461c06cd81fd38ebfda8fbba904f8e3ea9b543f6545da1f2d5432955613f0fcf62d49705242a9af9e61e85dc0d651e40dfcf017b45575887',
    benchmark: true
  },
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-12  #4\nRecommended parameters for file encryption as of 2009 ("check what you can run within 5 s")',
    input: {
      P: 'pleaseletmein',
      S: 'SodiumChloride',
      N: 1048576,
      r: 8,
      p: 1,
      dkLen: 64
    },
    output: '2101cb9b6a511aaeaddbbe09cf70f881ec568d574a2ffd4dabe5ee9820adaa478e56fd8f4ba5d09ffa1c6d927c40f4c337304049e8a952fbcbf45c6fa77a41a4',
    benchmark: true
  },
  {
    comment: 'Recommended parameters for interactive login as of 2020? ("check what you can run within 100 ms")',
    input: {
      P: 'pleaseletmein',
      S: 'SodiumChloride',
      N: 32768,
      r: 8,
      p: 1,
      dkLen: 64
    },
    output: 'f72cbc204bdcfc3ff5b115d8508aec1566ff0ef3f658388601a3933078ef7ac8198154d9cdb167f8c1cbf22b25eb4934e2c8a98dd8e1a4cbf0c31d2f961a7f22'
  },
  {
    comment: '',
    input: {
      P: 'pleaseletmein',
      S: 'SodiumChloride',
      N: 131072,
      r: 8,
      p: 1,
      dkLen: 64
    },
    output: '2f10fcda14532d6543334cd899776407ff0ae879c370372de5b4e39d4d2d21edcd5d7f191f94407a6f2e8a2430a1258f2e653c55e40531318baafdda82c60cd4'
  },
  {
    comment: '',
    input: {
      P: new ArrayBuffer(0),
      S: new TextEncoder().encode(''),
      N: 16,
      r: 2,
      p: 1,
      dkLen: 64
    },
    output: '5517696d05d1df94fb42f067d9fcdb14d9effe8ac37500957e1b6f1d383ea02961accf2409bba1ae87c94c6fc69f9b32393eea0b877eb7803c2f151a888acdb6'
  },
  {
    comment: '',
    input: {
      P: '',
      S: '',
      N: 1024,
      r: 8,
      p: 16,
      dkLen: 64
    },
    output: '7dd38537d71e6ae3a01205a801e3a6720ac1aa1aae0c32b8d583cc5e8c9a87e4a42eeac837ea1fec04f55d1c54057343b4b2c060e6996ff213a130563525ae88'
  },
  {
    comment: '',
    input: {
      P: new ArrayBuffer(0),
      S: '',
      N: 1024,
      r: 1,
      p: 16,
      dkLen: 64
    },
    output: '0ba777e97ce849e631ea66c9c4d6762b04f9c8db865dad34f13de6947981d9b25b3dccc4d0a75c1b0230df22c179ae392dc867d798b11091cfc1cf06978b7c84'
  },
  {
    comment: '',
    input: {
      P: '',
      S: new ArrayBuffer(0),
      N: 1024,
      r: 8,
      p: 1,
      dkLen: 64
    },
    output: '225009a832a3041c158e2ab8913019a27674c604d704a38ad1c7b58401a88b213b2a374d65016b82231fc469caf5b02134c8f52941d185e4b1d51fab0996eb46'
  },
  {
    comment: 'invalid N = 15',
    input: {
      P: new ArrayBuffer(0),
      S: new TextEncoder().encode(''),
      N: 15,
      r: 1,
      p: 1,
      dkLen: 64
    },
    output: '77d6576238657b203b19ca42c18a0497f16b4844e3074ae8dfdffa3fede21442fcd0069ded0948f8326a753a0fc81f17e8d3e0fb2e0d3628cf35e20c38d18906',
    error: RangeError
  },
  {
    comment: 'invalid dkLen = 0',
    input: {
      P: 'password',
      S: 'NaCl',
      N: 1024,
      r: 8,
      p: 16,
      dkLen: 0
    },
    output: 'fdbabe1c9d3472007856e7190d01e9fe7c6ad7cbc8237830e77376634b3731622eaf30d92e22a3886ff109279d9830dac727afb94a83ee6d8360cbdfa2cc0640',
    error: RangeError
  },
  {
    comment: 'invalid dkLen < 0',
    input: {
      P: new TextEncoder().encode('pleaseletmein'),
      S: 'SodiumChloride',
      N: 16384,
      r: 8,
      p: 1,
      dkLen: -1
    },
    output: '7023bdcb3afd7348461c06cd81fd38ebfda8fbba904f8e3ea9b543f6545da1f2d5432955613f0fcf62d49705242a9af9e61e85dc0d651e40dfcf017b45575887',
    error: RangeError
  },
  {
    comment: 'invalid r = 8.2',
    input: {
      P: '',
      S: '',
      N: 1024,
      r: 8.2,
      p: 16,
      dkLen: 64
    },
    output: '7dd38537d71e6ae3a01205a801e3a6720ac1aa1aae0c32b8d583cc5e8c9a87e4a42eeac837ea1fec04f55d1c54057343b4b2c060e6996ff213a130563525ae88',
    error: RangeError
  },
  {
    comment: 'invalid p = 16.1',
    input: {
      P: new ArrayBuffer(0),
      S: '',
      N: 1024,
      r: 1,
      p: 16.1,
      dkLen: 64
    },
    output: '0ba777e97ce849e631ea66c9c4d6762b04f9c8db865dad34f13de6947981d9b25b3dccc4d0a75c1b0230df22c179ae392dc867d798b11091cfc1cf06978b7c84',
    error: RangeError
  },
  {
    comment: 'invalid N = 0',
    input: {
      P: '',
      S: new ArrayBuffer(0),
      N: 0,
      r: 8,
      p: 1,
      dkLen: 64
    },
    output: '225009a832a3041c158e2ab8913019a27674c604d704a38ad1c7b58401a88b213b2a374d65016b82231fc469caf5b02134c8f52941d185e4b1d51fab0996eb46',
    error: RangeError
  },
  {
    comment: 'invalid password (entered as integer)',
    input: {
      P: 1234,
      S: new ArrayBuffer(0),
      N: 1024,
      r: 8,
      p: 1,
      dkLen: 64
    },
    output: '225009a832a3041c158e2ab8913019a27674c604d704a38ad1c7b58401a88b213b2a374d65016b82231fc469caf5b02134c8f52941d185e4b1d51fab0996eb46',
    error: RangeError
  },
  {
    comment: 'invalid salt (entered as integer)',
    input: {
      P: '',
      S: 1234,
      N: 1024,
      r: 8,
      p: 1,
      dkLen: 64
    },
    output: '225009a832a3041c158e2ab8913019a27674c604d704a38ad1c7b58401a88b213b2a374d65016b82231fc469caf5b02134c8f52941d185e4b1d51fab0996eb46',
    error: RangeError
  }
]
