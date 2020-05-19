/**
 * A TypedArray object describes an array-like view of an underlying binary data buffer.
 * @typedef {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|BigInt64Array|BigUint64Array} TypedArray
 */

/**
 * Converts a bigint to an ArrayBuffer or a Buffer (default for Node.js)
 *
 * @param {bigint} a
 * @param {boolean} [returnArrayBuffer = false] In Node JS forces the output to be an ArrayBuffer instead of a Buffer (default).
 *
 * @returns {ArrayBuffer|Buffer} An ArrayBuffer or a Buffer with a binary representation of the input bigint
 */
function bigintToBuf (a, returnArrayBuffer = false) {
  return hexToBuf(bigintToHex(a), returnArrayBuffer)
}

/**
 * Converts an ArrayBuffer, TypedArray or Buffer (node.js) to a bigint
 *
 * @param {ArrayBuffer|TypedArray|Buffer} buf
 *
 * @returns {bigint} A BigInt
 */
function bufToBigint (buf) {
  // return BigInt('0x' + bufToHex(buf))
  let bits = 8n;
  if (ArrayBuffer.isView(buf)) bits = BigInt(buf.BYTES_PER_ELEMENT * 8);
  else buf = new Uint8Array(buf);

  let ret = 0n;
  for (const i of buf.values()) {
    const bi = BigInt(i);
    ret = (ret << bits) + bi;
  }
  return ret
}

/**
 * Converts a bigint to a hexadecimal string
 *
 * @param {bigint} a
 *
 * @returns {str} A hexadecimal representation of the input bigint
 */
function bigintToHex (a) {
  return a.toString(16)
}

/**
 * Converts a hexadecimal string to a bigint
 *
 * @param {string} hexStr
 *
 * @returns {bigint} A BigInt
 */
function hexToBigint (hexStr) {
  return BigInt('0x' + hexStr)
}

/**
 * Converts a bigint representing a binary array of utf-8 encoded text to a string of utf-8 text
 *
 * @param {bigint} a A bigint representing a binary array of utf-8 encoded text.
 *
 * @returns {string} A string text with utf-8 encoding
 */
function bigintToText (a) {
  return bufToText(hexToBuf(a.toString(16)))
}

/**
 * Converts a utf-8 string to a bigint (from its binary representaion)
 *
 * @param {string} text A string text with utf-8 encoding
 *
 * @returns {bigint} A bigint representing a binary array of the input utf-8 encoded text
 */
function textToBigint (text) {
  return hexToBigint(bufToHex(textToBuf(text)))
}

/**
 *Converts an ArrayBuffer, TypedArray or Buffer (in Node.js) containing utf-8 encoded text to a string of utf-8 text
 *
 * @param {ArrayBuffer|TypedArray|Buffer} buf A buffer containing utf-8 encoded text
 *
 * @returns {string} A string text with utf-8 encoding
 */
function bufToText (buf) {
  return new TextDecoder().decode(new Uint8Array(buf))
}

/**
 * Converts a string of utf-8 encoded text to an ArrayBuffer or a Buffer (default in Node.js)
 *
 * @param {string} str A string of text (with utf-8 encoding)
 * @param {boolean} [returnArrayBuffer = false] In Node JS forces the output to be an ArrayBuffer instead of a Buffer (default).
 *
 * @returns {ArrayBuffer|Buffer} An ArrayBuffer or a Buffer containing the utf-8 encoded text
 */
function textToBuf (str, returnArrayBuffer = false) {
  return new TextEncoder().encode(str).buffer
}

/**
 * Returns the hexadecimal representation of a buffer.
 *
 * @param {ArrayBuffer|TypedArray|Buffer} buf
 *
 * @returns {string} A string with a hexadecimal representation of the input buffer
 */
function bufToHex (buf) {
  /* eslint-disable no-lone-blocks */
  {
    let s = '';
    const h = '0123456789abcdef';
    if (ArrayBuffer.isView(buf)) buf = new Uint8Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
    else buf = new Uint8Array(buf);
    buf.forEach((v) => {
      s += h[v >> 4] + h[v & 15];
    });
    return s
  }
  /* eslint-enable no-lone-blocks */
}

/**
 * Converts a hexadecimal string to a buffer
 *
 * @param {string} hexStr A string representing a number with hexadecimal notation
 * @param {boolean} [returnArrayBuffer = false] In Node JS forces the output to be an ArrayBuffer instead of a Buffer (default).
 *
 * @returns {ArrayBuffer|Buffer} An ArrayBuffer or a Buffer
 */
function hexToBuf (hexStr, returnArrayBuffer = false) {
  hexStr = !(hexStr.length % 2) ? hexStr : '0' + hexStr;
  /* eslint-disable no-lone-blocks */
  {
    return Uint8Array.from(hexStr.trimLeft('0x').match(/[\da-f]{2}/gi).map((h) => {
      return parseInt(h, 16)
    })).buffer
  }
  /* eslint-enable no-lone-blocks */
}

var index_browser_mod = /*#__PURE__*/Object.freeze({
  __proto__: null,
  bigintToBuf: bigintToBuf,
  bigintToHex: bigintToHex,
  bigintToText: bigintToText,
  bufToBigint: bufToBigint,
  bufToHex: bufToHex,
  bufToText: bufToText,
  hexToBigint: hexToBigint,
  hexToBuf: hexToBuf,
  textToBigint: textToBigint,
  textToBuf: textToBuf
});

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->


// <--



const vectors = [
  {
    // https://tools.ietf.org/html/rfc7914#page-7 Scrypt PBKDF2 Test Vector #1
    P: 'passwd',
    S: 'salt',
    c: 1,
    dkLen: 64,
    output: '55ac046e56e3089fec1691c22544b605f94185216dde0465e68b9d57c20dacbc49ca9cccf179b645991664b39d77ef317c71b845b1e30bd509112041d3a19783'
  },
  {
    // https://tools.ietf.org/html/rfc7914#page-7 Scrypt PBKDF2 Test Vector #2
    P: 'Password',
    S: 'NaCl',
    c: 80000,
    dkLen: 64,
    output: '4ddcd8f60b98be21830cee5ef22701f9641a4418d04c0414aeff08876b34ab56a1d425a1225833549adb841b51c9b3176a272bdebba1d078478f62b397f33c8d'
  },
  {
    // http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 Test Vector #1
    P: new TextEncoder().encode('password'),
    S: 'salt',
    c: 1,
    dkLen: 32,
    output: '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b'
  },
  {
    // http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 Test Vector #2
    P: 'password',
    S: new TextEncoder().encode('salt'),
    c: 2,
    dkLen: 32,
    output: 'ae4d0c95af6b46d32d0adff928f06dd02a303f8ef3c251dfd6e2d85a95474c43',
    description: 'http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 Test Vector #2'
  },
  {
    // http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 Test Vector #3
    P: 'password',
    S: new TextEncoder().encode('salt'),
    c: 4096,
    dkLen: 32,
    output: 'c5e478d59288c841aa530db6845c4c8d962893a001ce4e11a4963873aa98134a'
  },
  {
    // http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 Test Vector #5
    P: 'passwordPASSWORDpassword',
    S: new TextEncoder().encode('saltSALTsaltSALTsaltSALTsaltSALTsalt'),
    c: 4096,
    dkLen: 40,
    output: '348c89dbcbd32b2f32d814b8116e84cf2b17347ebc1800181c4e2a1fb8dd53e1c635518c7dac47e9'
  },
  {
    P: new ArrayBuffer(),
    S: new TextEncoder().encode('salt'),
    c: 1024,
    dkLen: 32,
    output: '9e83f279c040f2a11aa4a02b24c418f2d3cb39560c9627fa4f47e3bcc2897c3d'
  },
  {
    P: 'password',
    S: new ArrayBuffer(),
    c: 1024,
    dkLen: 32,
    output: 'ea5808411eb0c7e830deab55096cee582761e22a9bc034e3ece925225b07bf46'
  }
];

describe('testing pbkdf2HmacSha256', function () {
  for (const vector of vectors) {
    describe(`pbkdf2HmacSha256(${vector.P}, ${vector.S}, ${vector.c}, ${vector.dkLen})`, function () {
      it(`should match ${vector.output}`, async function () {
        const ret = await _pkg.pbkdf2HmacSha256(vector.P, vector.S, vector.c, vector.dkLen);
        chai.expect(index_browser_mod.bufToHex(ret)).to.equal(vector.output);
      });
    });
  }
});

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->


// <--



const tests = [
  {
    // https://tools.ietf.org/html/rfc7914#section-8
    input: '7e879a214f3ec9867ca940e641718f26baee555b8c61c1b50df846116dcd3b1dee24f319df9b3d8514121e4b5ac5aa3276021d2909c74829edebc68db8b8c25e',
    output: 'a41f859c6608cc993b81cacb020cef05044b2181a2fd337dfd7b1c6396682f29b4393168e3c9e6bcfe6bc5b7a06d96bae424cc102c91745c24ad673dc7618f81'
  }
];

describe('testing Salsa 20/8 Core', function () {
  for (const test of tests) {
    describe(`salsa208Core(${test.input})`, function () {
      it(`should match ${test.output}`, async function () {
        const salsa = new Uint32Array(index_browser_mod.hexToBuf(test.input, true));
        await _pkg.salsa208Core(salsa);
        chai.expect(index_browser_mod.bufToHex(salsa)).to.equal(test.output);
      });
    });
  }
});

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->


// <--



const tests$1 = [
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
];

describe('testing scrypt', function () {
  this.timeout(180000);
  for (const test of tests$1) {
    describe(`scrypt(${test.P}, ${test.S}, ${test.N}, ${test.r}, ${test.p}, ${test.dkLen})`, function () {
      it(`should match ${test.output}`, async function () {
        const ret = await _pkg.scrypt(test.P, test.S, test.N, test.r, test.p, test.dkLen);
        chai.expect(index_browser_mod.bufToHex(ret)).to.equal(test.output);
      });
    });
  }
});

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->


// <--



const tests$2 = [
  {
    // https://tools.ietf.org/html/rfc7914#section-9
    input: 'f7ce0b653d2d72a4108cf5abe912ffdd777616dbbb27a70e8204f3ae2d0f6fad89f68f4811d1e87bcc3bd7400a9ffd29094f0184639574f39ae5a1315217bcd7894991447213bb226c25b54da86370fbcd984380374666bb8ffcb5bf40c254b067d27c51ce4ad5fed829c90b505a571b7f4d1cad6a523cda770e67bceaaf7e89',
    output: 'a41f859c6608cc993b81cacb020cef05044b2181a2fd337dfd7b1c6396682f29b4393168e3c9e6bcfe6bc5b7a06d96bae424cc102c91745c24ad673dc7618f8120edc975323881a80540f64c162dcd3c21077cfe5f8d5fe2b1a4168f953678b77d3b3d803b60e4ab920996e59b4d53b65d2a225877d5edf5842cb9f14eefe425'
  }
];

describe('testing scryptBlockMix', function () {
  for (const test of tests$2) {
    describe(`scryptBlockMix(${test.input})`, function () {
      it(`should match ${test.output}`, async function () {
        const input = new BigUint64Array(index_browser_mod.hexToBuf(test.input, true));
        const output = await _pkg.scryptBlockMix(input);
        chai.expect(index_browser_mod.bufToHex(output)).to.equal(test.output);
      });
    });
  }
});

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->


// <--



const tests$3 = [
  {
    // https://tools.ietf.org/html/rfc7914#section-10
    input: 'f7ce0b653d2d72a4108cf5abe912ffdd777616dbbb27a70e8204f3ae2d0f6fad89f68f4811d1e87bcc3bd7400a9ffd29094f0184639574f39ae5a1315217bcd7894991447213bb226c25b54da86370fbcd984380374666bb8ffcb5bf40c254b067d27c51ce4ad5fed829c90b505a571b7f4d1cad6a523cda770e67bceaaf7e89',
    N: 16,
    output: '79ccc193629debca047f0b70604bf6b62ce3dd4a9626e355fafc6198e6ea2b46d58413673b99b029d665c357601fb426a0b2f4bba200ee9f0a43d19b571a9c71ef1142e65d5a266fddca832ce59faa7cac0b9cf1be2bffca300d01ee387619c4ae12fd4438f203a0e4e1c47ec314861f4e9087cb33396a6873e8f9d2539a4b8e'
  }
];

describe('testing scryptROMix', function () {
  for (const test of tests$3) {
    describe(`scryptROMix(${test.input})`, function () {
      it(`should match ${test.output}`, async function () {
        const input = new BigUint64Array(index_browser_mod.hexToBuf(test.input, true));
        const output = await _pkg.scryptROMix(input, test.N);
        chai.expect(index_browser_mod.bufToHex(output)).to.equal(test.output);
      });
    });
  }
});
