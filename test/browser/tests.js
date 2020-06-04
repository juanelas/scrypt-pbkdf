/**
 * Native JS implementation of scrypt using BigInt and BigUint64Arrays
 * @module scrypt-bigint
 */

/**
 * A TypedArray object describes an array-like view of an underlying binary data buffer.
 * @typedef {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|BigInt64Array|BigUint64Array} TypedArray
 */

/**
 * XORs arr2 to arr1
 *
 * @param {TypedArray} arr1
 * @param {TypedArray} arr2
 *
 */
function typedArrayXor (arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    arr1[i] ^= arr2[i];
  }
}

/**
 * The PBKDF2-HMAC-SHA-256 function used below denotes the PBKDF2 algorithm
 * (RFC2898) used with HMAC-SHA-256 as the Pseudorandom Function (PRF)
 *
 * @param {string | ArrayBuffer | TypedArray | DataView} P - A unicode string with a password
 * @param {string | ArrayBuffer | TypedArray | DataView} S - A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16))
 * @param {number} c - iteration count, a positive integer
 * @param {number} dkLen - intended length in octets of the derived key
 *
 * @returns {Promise<ArrayBuffer>}
 */
function pbkdf2HmacSha256 (P, S, c, dkLen) {
  if (typeof P === 'string') P = new TextEncoder().encode(P); // encode S as UTF-8
  else if (P instanceof ArrayBuffer) P = new Uint8Array(P);
  else if (!ArrayBuffer.isView(P)) throw RangeError('P should be string, ArrayBuffer, TypedArray, DataView')

  if (typeof S === 'string') S = new TextEncoder().encode(S); // encode S as UTF-8
  else if (S instanceof ArrayBuffer) S = new Uint8Array(S);
  else if (!ArrayBuffer.isView(S)) throw RangeError('S should be string, ArrayBuffer, TypedArray, DataView')

  if (!Number.isInteger(c) || c <= 0) throw RangeError('c must be a positive integer')
  if (!Number.isInteger(dkLen) || dkLen <= 0) throw RangeError('dkLen must be a positive integer')

  return new Promise((resolve, reject) => {
    /* eslint-disable no-lone-blocks */
    {
      crypto.subtle.importKey('raw', P, 'PBKDF2', false, ['deriveBits']).then(
        PKey => {
          const params = { name: 'PBKDF2', hash: 'SHA-256', salt: S, iterations: c }; // pbkdf2 params
          crypto.subtle.deriveBits(params, PKey, dkLen * 8).then(
            derivedKey => resolve(derivedKey),
            err => reject(err)
          );
        },
        err => reject(err)
      );
    }
    /* eslint-enable no-lone-blocks */
  })
}

/**
 * Salsa20/8 Core is a round-reduced variant of the Salsa20 Core.  It is a
 * hash function from 64-octet strings to 64-octet strings.  Note that
 * Salsa20/8 Core is not a cryptographic hash function since it is not
 * collision resistant.
 *
 * This function modifies the ArrayBuffer of the input UInt32Array
 *
 * @param {Uint32Array} arr - a binary array of 64 octets
 *
  */
function salsa208Core (arr) {
  function R (a, b) {
    return (a << b) | (a >>> (32 - b))
  }

  const x = arr.slice(0);

  for (let i = 8; i > 0; i -= 2) {
    x[4] ^= R(x[0] + x[12], 7);
    x[8] ^= R(x[4] + x[0], 9);
    x[12] ^= R(x[8] + x[4], 13);
    x[0] ^= R(x[12] + x[8], 18);
    x[9] ^= R(x[5] + x[1], 7);
    x[13] ^= R(x[9] + x[5], 9);
    x[1] ^= R(x[13] + x[9], 13);
    x[5] ^= R(x[1] + x[13], 18);
    x[14] ^= R(x[10] + x[6], 7);
    x[2] ^= R(x[14] + x[10], 9);
    x[6] ^= R(x[2] + x[14], 13);
    x[10] ^= R(x[6] + x[2], 18);
    x[3] ^= R(x[15] + x[11], 7);
    x[7] ^= R(x[3] + x[15], 9);
    x[11] ^= R(x[7] + x[3], 13);
    x[15] ^= R(x[11] + x[7], 18);
    x[1] ^= R(x[0] + x[3], 7);
    x[2] ^= R(x[1] + x[0], 9);
    x[3] ^= R(x[2] + x[1], 13);
    x[0] ^= R(x[3] + x[2], 18);
    x[6] ^= R(x[5] + x[4], 7);
    x[7] ^= R(x[6] + x[5], 9);
    x[4] ^= R(x[7] + x[6], 13);
    x[5] ^= R(x[4] + x[7], 18);
    x[11] ^= R(x[10] + x[9], 7);
    x[8] ^= R(x[11] + x[10], 9);
    x[9] ^= R(x[8] + x[11], 13);
    x[10] ^= R(x[9] + x[8], 18);
    x[12] ^= R(x[15] + x[14], 7);
    x[13] ^= R(x[12] + x[15], 9);
    x[14] ^= R(x[13] + x[12], 13);
    x[15] ^= R(x[14] + x[13], 18);
  }

  for (let i = 0; i < 16; i++) {
    arr[i] = x[i] + arr[i];
  }
}

/**
 * The scryptBlockMix algorithm is the same as the BlockMix algorithm
 * described in [SCRYPT] but with Salsa20/8 Core used as the hash function H.
 * Below, Salsa(T) corresponds to the Salsa20/8 Core function applied to the
 * octet vector T.
 *
 * This function modifies the ArrayBuffer of the input BigUint64Array
 *
 * @param {Uint32Array} B - B[0] || B[1] || ... || B[2 * r - 1]
 *                          Input octet string (of size 128 * r octets),
 *                          treated as 2 * r 64-octet blocks,
 *                          where each element in B is a 64-octet block.
 *
 */
function scryptBlockMix (B) {
  const r = B.byteLength / 128; // block size parameter

  /*
  1.  X = B[2 * r - 1]
  */
  const offset32 = (2 * r - 1) * 16;
  const X = B.slice(offset32, offset32 + 16);

  /*
  2.  for i = 0 to 2 * r - 1 do
        T = X xor B[i]
        X = Salsa (T)
        Y[i] = X
      end for

  3.  B' = (Y[0], Y[2], ..., Y[2 * r - 2],
            Y[1], Y[3], ..., Y[2 * r - 1])
  */
  const Yodd = new Uint32Array(B.length / 2);
  let even = true;
  for (let i = 0; i < 2 * r; i++) {
    const offset = i * 16;
    const Bi = B.subarray(offset, offset + 16);
    typedArrayXor(X, Bi);
    salsa208Core(X);
    const k = i >> 1;
    const off2 = 16 * k;
    if (even) {
      // we can safely overwrite B'[0], B'[1]...B'[r-1] since they are not accessed again after overwriting them
      for (let j = 0; j < 16; j++) {
        B[off2 + j] = X[j];
      }
    } else {
      // Y[1], Y[3], ..., Y[2 * r - 1] should go to the second half and therefore we can't overwrite them until the entire process is finished
      for (let j = 0; j < 16; j++) {
        Yodd[off2 + j] = X[j];
      }
    }
    even = !even;
  }
  // Update the second half of B: Y[1], Y[3], ..., Y[2 * r - 1]
  const halfIndex = 16 * r;
  for (let i = 0; i < halfIndex; i++) {
    B[halfIndex + i] = Yodd[i];
  }
}

/**
 * The scryptROMix algorithm
 *
 * This function modifies the ArrayBuffer of the input BigInt64Array
 *
 * @param {Uint32Array} B    - Input octet vector of length 128 * r octets.
 * @param {number} N         - CPU/Memory cost parameter, must be larger than 1,
 *                             a power of 2, and less than 2^(128 * r / 8).
 *
 */
function scryptROMix (B, N) {
  /*
  The scryptROMix algorithm is the same as the ROMix algorithm described in
  http://www.tarsnap.com/scrypt/scrypt.pdf but with scryptBlockMix used as the
  hash function H and the Integerify function explained inline.
  */
  const r = B.byteLength / 128;
  /*
  1.  X = B
  */

  /*
  2.  for i = 0 to N - 1 do
        V[i] = X
        X = scryptBlockMix (X)
      end for
  */
  const V = new Array(N);
  for (let i = 0; i < N; i++) {
    V[i] = B.slice(0);
    scryptBlockMix(B);
  }

  /*
  3.  for i = 0 to N - 1 do
        j = Integerify (X) mod N
                where Integerify (B[0] ... B[2 * r - 1]) is defined
                as the result of interpreting B[2 * r - 1] as a
                little-endian integer.
        T = X xor V[j]
        X = scryptBlockMix (T)
      end for
  */
  function integerifyModN (Uint32arr) {
    const offset = (2 * r - 1) * 64;
    const lastBlock = new DataView(Uint32arr.buffer, offset, 64);

    // Since N is a power of 2 and assuming N <= 2**32, we can just take the first subblock (little endian) of 32 bits
    return lastBlock.getUint32(0, true) % N
  }
  for (let i = 0; i < N; i++) {
    const j = integerifyModN(B);
    typedArrayXor(B, V[j]);
    scryptBlockMix(B);
  }
}

/**
 * The scrypt Algorithm (RFC 7914)
 *
 * @param {string | ArrayBuffer | TypedArray | DataView} P - A unicode string with a passphrase.
 * @param {string | ArrayBuffer | TypedArray | DataView} S - A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16)).
 * @param {number} N - CPU/memory cost parameter - Must be a power of 2 (e.g. 1024)
 * @param {number} r - The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used.
 * @param {number} p - Parallelization parameter; a positive integer satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.
 * @param {number} dkLen - Intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32.
 */
async function scrypt (P, S, N, r, p, dkLen) {
  if (typeof P === 'string') P = new TextEncoder().encode(P); // encode S as UTF-8
  else if (P instanceof ArrayBuffer) P = new Uint8Array(P);
  else if (!ArrayBuffer.isView(P)) throw RangeError('P should be string, ArrayBuffer, TypedArray, DataView')

  if (typeof S === 'string') S = new TextEncoder().encode(S); // encode S as UTF-8
  else if (S instanceof ArrayBuffer) S = new Uint8Array(S);
  else if (!ArrayBuffer.isView(S)) throw RangeError('S should be string, ArrayBuffer, TypedArray, DataView')

  if (!Number.isInteger(N) || N <= 0 || (N & (N - 1)) !== 0) throw RangeError('N must be a power of 2')

  if (!Number.isInteger(r) || r <= 0 || !Number.isInteger(p) || p <= 0 || p * r > 1073741823.75) throw RangeError('Parallelization parameter p and blosize parameter r must be positive integers satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.')

  if (!Number.isInteger(dkLen) || dkLen <= 0 || dkLen > 137438953440) throw RangeError('dkLen is the intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32')

  // if (!true) return require('crypto').scryptSync(P, S, dkLen, { N, r, p })

  /*
  1.  Initialize an array B consisting of p blocks of 128 * r octets each:
      B[0] || B[1] || ... || B[p - 1] = PBKDF2-HMAC-SHA256 (P, S, 1, p * 128 * r)
  */
  const B = await pbkdf2HmacSha256(P, S, 1, p * 128 * r);

  /*
  2.  for i = 0 to p - 1 do
        B[i] = scryptROMix (r, B[i], N)
      end for
  */
  const B32 = new Uint32Array(B);
  for (let i = 0; i < p; i++) {
    // TO-DO: activate web workers here!!
    const blockLength32 = 32 * r;
    const offset = i * blockLength32;
    const Bi = B32.slice(offset, offset + blockLength32);
    scryptROMix(Bi, N);
    for (let j = 0; j < 32 * r; j++) {
      B32[offset + j] = Bi[j];
    }
  }

  /*
  3.  DK = PBKDF2-HMAC-SHA256 (P, B[0] || B[1] || ... || B[p - 1], 1, dkLen)
  */
  const DK = await pbkdf2HmacSha256(P, B32, 1, dkLen);

  return DK
}

var index_browser_mod = /*#__PURE__*/Object.freeze({
  __proto__: null,
  pbkdf2HmacSha256: pbkdf2HmacSha256,
  salsa208Core: salsa208Core,
  scrypt: scrypt,
  scryptBlockMix: scryptBlockMix,
  scryptROMix: scryptROMix
});

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

var index_browser_mod$1 = /*#__PURE__*/Object.freeze({
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

var pbkdf2HmacSha256$1 = [
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-11 #1',
    P: 'passwd',
    S: 'salt',
    c: 1,
    dkLen: 64,
    output: '55ac046e56e3089fec1691c22544b605f94185216dde0465e68b9d57c20dacbc49ca9cccf179b645991664b39d77ef317c71b845b1e30bd509112041d3a19783'
  },
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-11 #2',
    P: 'Password',
    S: 'NaCl',
    c: 80000,
    dkLen: 64,
    output: '4ddcd8f60b98be21830cee5ef22701f9641a4418d04c0414aeff08876b34ab56a1d425a1225833549adb841b51c9b3176a272bdebba1d078478f62b397f33c8d'
  },
  {
    comment: 'http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 #1',
    P: new TextEncoder().encode('password'),
    S: 'salt',
    c: 1,
    dkLen: 32,
    output: '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b'
  },
  {
    comment: 'http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 #2',
    P: 'password',
    S: new TextEncoder().encode('salt'),
    c: 2,
    dkLen: 32,
    output: 'ae4d0c95af6b46d32d0adff928f06dd02a303f8ef3c251dfd6e2d85a95474c43'
  },
  {
    comment: 'http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 #3',
    P: 'password',
    S: new TextEncoder().encode('salt'),
    c: 4096,
    dkLen: 32,
    output: 'c5e478d59288c841aa530db6845c4c8d962893a001ce4e11a4963873aa98134a'
  },
  {
    comment: 'http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 #5',
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

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->


// <--





describe('testing pbkdf2HmacSha256', function () {
  this.timeout(360000);
  for (const vector of pbkdf2HmacSha256$1) {
    describe(`${vector.comment} : P=${vector.P}, S=${vector.S}, c=${vector.c}, dkLen=${vector.dkLen})`, function () {
      if ('error' in vector) {
        it(`should be rejected because of ${vector.error}`, async function () {
          try {
            await index_browser_mod.pbkdf2HmacSha256(vector.P, vector.S, vector.c, vector.dkLen);
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(vector.error);
          }
        });
      } else {
        it(`should match ${vector.output}`, async function () {
          const ret = await index_browser_mod.pbkdf2HmacSha256(vector.P, vector.S, vector.c, vector.dkLen);
          chai.expect(index_browser_mod$1.bufToHex(ret)).to.equal(vector.output);
        });
      }
    });
  }
});

var salsa208Core$1 = [
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-8',
    input: {
      input: '7e879a214f3ec9867ca940e641718f26baee555b8c61c1b50df846116dcd3b1dee24f319df9b3d8514121e4b5ac5aa3276021d2909c74829edebc68db8b8c25e'
    },
    output: 'a41f859c6608cc993b81cacb020cef05044b2181a2fd337dfd7b1c6396682f29b4393168e3c9e6bcfe6bc5b7a06d96bae424cc102c91745c24ad673dc7618f81'
  }
];

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->


// <--





describe('testing Salsa 20/8 Core', function () {
  this.timeout(360000);
  for (const vector of salsa208Core$1) {
    describe(`${vector.comment} : input=${vector.input.input}`, function () {
      const salsa = new Uint32Array(index_browser_mod$1.hexToBuf(vector.input.input, true));
      if ('error' in vector) {
        it(`should be rejected because of ${vector.error}`, function () {
          try {
            index_browser_mod.salsa208Core(salsa);
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(vector.error);
          }
        });
      } else {
        it(`should match ${vector.output}`, function () {
          index_browser_mod.salsa208Core(salsa);
          chai.expect(index_browser_mod$1.bufToHex(salsa)).to.equal(vector.output);
        });
      }
    });
  }
});

var scrypt$1 = [
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-12  #1',
    input: {
      P: new ArrayBuffer(),
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
    comment: 'https://tools.ietf.org/html/rfc7914#section-12  #3',
    input: {
      P: new TextEncoder().encode('pleaseletmein'),
      S: 'SodiumChloride',
      N: 16384,
      r: 8,
      p: 1,
      dkLen: 64
    },
    output: '7023bdcb3afd7348461c06cd81fd38ebfda8fbba904f8e3ea9b543f6545da1f2d5432955613f0fcf62d49705242a9af9e61e85dc0d651e40dfcf017b45575887'
  },
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-12  #4',
    input: {
      P: 'pleaseletmein',
      S: 'SodiumChloride',
      N: 1048576,
      r: 8,
      p: 1,
      dkLen: 64
    },
    output: '2101cb9b6a511aaeaddbbe09cf70f881ec568d574a2ffd4dabe5ee9820adaa478e56fd8f4ba5d09ffa1c6d927c40f4c337304049e8a952fbcbf45c6fa77a41a4'
  },
  {
    comment: '',
    input: {
      P: new ArrayBuffer(),
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
      P: new ArrayBuffer(),
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
      S: new ArrayBuffer(),
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
      P: new ArrayBuffer(),
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
      P: new ArrayBuffer(),
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
      S: new ArrayBuffer(),
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
      S: new ArrayBuffer(),
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
];

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->


// <--





describe('testing scrypt', function () {
  this.timeout(360000);
  for (const vector of scrypt$1) {
    describe(`${vector.comment} : P=${vector.input.P}, S=${vector.input.S}, N=${vector.input.N}, r=${vector.input.r}, p=${vector.input.p}, dkLen=${vector.input.dkLen})`, function () {
      if ('error' in vector) {
        it(`should be rejected because of ${vector.error}`, async function () {
          try {
            await index_browser_mod.scrypt(vector.input.P, vector.input.S, vector.input.N, vector.input.r, vector.input.p, vector.input.dkLen);
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(vector.error);
          }
        });
      } else {
        it(`should match ${vector.output}`, async function () {
          const ret = await index_browser_mod.scrypt(vector.input.P, vector.input.S, vector.input.N, vector.input.r, vector.input.p, vector.input.dkLen);
          chai.expect(index_browser_mod$1.bufToHex(ret)).to.equal(vector.output);
        });
      }
    });
  }
});

/**
 * Native JS implementation of scrypt using BigInt and BigUint64Arrays
 * @module scrypt-bigint
 */

/**
 * A TypedArray object describes an array-like view of an underlying binary data buffer.
 * @typedef {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|BigInt64Array|BigUint64Array} TypedArray
 */

/**
 * XORs arr2 to arr1
 *
 * @param {TypedArray} arr1
 * @param {TypedArray} arr2
 *
 */
function typedArrayXor$1 (arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    arr1[i] ^= arr2[i];
  }
}

/**
 * The PBKDF2-HMAC-SHA-256 function used below denotes the PBKDF2 algorithm
 * (RFC2898) used with HMAC-SHA-256 as the Pseudorandom Function (PRF)
 *
 * @param {string | ArrayBuffer | TypedArray | DataView} P - A unicode string with a password
 * @param {string | ArrayBuffer | TypedArray | DataView} S - A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16))
 * @param {number} c - iteration count, a positive integer
 * @param {number} dkLen - intended length in octets of the derived key
 *
 * @returns {Promise<ArrayBuffer>}
 */
function pbkdf2HmacSha256$2 (P, S, c, dkLen) {
  if (typeof P === 'string') P = new TextEncoder().encode(P); // encode S as UTF-8
  else if (P instanceof ArrayBuffer) P = new Uint8Array(P);
  else if (!ArrayBuffer.isView(P)) throw RangeError('P should be string, ArrayBuffer, TypedArray, DataView')

  if (typeof S === 'string') S = new TextEncoder().encode(S); // encode S as UTF-8
  else if (S instanceof ArrayBuffer) S = new Uint8Array(S);
  else if (!ArrayBuffer.isView(S)) throw RangeError('S should be string, ArrayBuffer, TypedArray, DataView')

  if (!Number.isInteger(c) || c <= 0) throw RangeError('c must be a positive integer')
  if (!Number.isInteger(dkLen) || dkLen <= 0) throw RangeError('dkLen must be a positive integer')

  return new Promise((resolve, reject) => {
    /* eslint-disable no-lone-blocks */
    {
      crypto.subtle.importKey('raw', P, 'PBKDF2', false, ['deriveBits']).then(
        PKey => {
          const params = { name: 'PBKDF2', hash: 'SHA-256', salt: S, iterations: c }; // pbkdf2 params
          crypto.subtle.deriveBits(params, PKey, dkLen * 8).then(
            derivedKey => resolve(derivedKey),
            err => reject(err)
          );
        },
        err => reject(err)
      );
    }
    /* eslint-enable no-lone-blocks */
  })
}

/**
 * Salsa20/8 Core is a round-reduced variant of the Salsa20 Core.  It is a
 * hash function from 64-octet strings to 64-octet strings.  Note that
 * Salsa20/8 Core is not a cryptographic hash function since it is not
 * collision resistant.
 *
 * This function modifies the ArrayBuffer of the input UInt32Array
 *
 * @param {Uint32Array} arr - a binary array of 64 octets
 *
  */
function salsa208Core$2 (arr) {
  function R (a, b) {
    return (a << b) | (a >>> (32 - b))
  }

  const x = arr.slice(0);

  for (let i = 8; i > 0; i -= 2) {
    x[4] ^= R(x[0] + x[12], 7);
    x[8] ^= R(x[4] + x[0], 9);
    x[12] ^= R(x[8] + x[4], 13);
    x[0] ^= R(x[12] + x[8], 18);
    x[9] ^= R(x[5] + x[1], 7);
    x[13] ^= R(x[9] + x[5], 9);
    x[1] ^= R(x[13] + x[9], 13);
    x[5] ^= R(x[1] + x[13], 18);
    x[14] ^= R(x[10] + x[6], 7);
    x[2] ^= R(x[14] + x[10], 9);
    x[6] ^= R(x[2] + x[14], 13);
    x[10] ^= R(x[6] + x[2], 18);
    x[3] ^= R(x[15] + x[11], 7);
    x[7] ^= R(x[3] + x[15], 9);
    x[11] ^= R(x[7] + x[3], 13);
    x[15] ^= R(x[11] + x[7], 18);
    x[1] ^= R(x[0] + x[3], 7);
    x[2] ^= R(x[1] + x[0], 9);
    x[3] ^= R(x[2] + x[1], 13);
    x[0] ^= R(x[3] + x[2], 18);
    x[6] ^= R(x[5] + x[4], 7);
    x[7] ^= R(x[6] + x[5], 9);
    x[4] ^= R(x[7] + x[6], 13);
    x[5] ^= R(x[4] + x[7], 18);
    x[11] ^= R(x[10] + x[9], 7);
    x[8] ^= R(x[11] + x[10], 9);
    x[9] ^= R(x[8] + x[11], 13);
    x[10] ^= R(x[9] + x[8], 18);
    x[12] ^= R(x[15] + x[14], 7);
    x[13] ^= R(x[12] + x[15], 9);
    x[14] ^= R(x[13] + x[12], 13);
    x[15] ^= R(x[14] + x[13], 18);
  }

  for (let i = 0; i < 16; ++i) arr[i] = x[i] + arr[i];
}

/**
 * The scryptBlockMix algorithm is the same as the BlockMix algorithm
 * described in [SCRYPT] but with Salsa20/8 Core used as the hash function H.
 * Below, Salsa(T) corresponds to the Salsa20/8 Core function applied to the
 * octet vector T.
 *
 * This function modifies the ArrayBuffer of the input BigUint64Array
 *
 * @param {BigUint64Array} B - B[0] || B[1] || ... || B[2 * r - 1]
 *                          Input octet string (of size 128 * r octets),
 *                          treated as 2 * r 64-octet blocks,
 *                          where each element in B is a 64-octet block.
 *
 */
function scryptBlockMix$1 (B) {
  const r = B.byteLength / 128; // block size parameter

  /*
  1.  X = B[2 * r - 1]
  */
  const offset64 = (2 * r - 1) * 8;
  const X = B.slice(offset64, offset64 + 8);

  /*
  2.  for i = 0 to 2 * r - 1 do
        T = X xor B[i]
        X = Salsa (T)
        Y[i] = X
      end for

  3.  B' = (Y[0], Y[2], ..., Y[2 * r - 2],
            Y[1], Y[3], ..., Y[2 * r - 1])
  */
  const Yodd = new BigUint64Array(B.length / 2);
  let even = true;
  for (let i = 0; i < 2 * r; i++) {
    const offset = i * 8;
    const Bi = B.subarray(offset, offset + 8);
    typedArrayXor$1(X, Bi);
    salsa208Core$2(new Uint32Array(X.buffer));
    const k = i >> 1;
    if (even) {
      // we can safely overwrite B'[0], B'[1]...B'[r-1] since they are not accessed again after overwriting them
      for (let j = 0; j < 8; j++) {
        B[8 * k + j] = X[j];
      }
    } else {
      // Y[1], Y[3], ..., Y[2 * r - 1] should go to the second half and therefore we can't overwrite them until the entire process is finished
      for (let j = 0; j < 8; j++) {
        Yodd[8 * k + j] = X[j];
      }
    }
    even = !even;
  }
  // Update the second half of B: Y[1], Y[3], ..., Y[2 * r - 1]
  const halfIndex = 8 * r;
  for (let i = 0; i < 8 * r; i++) {
    B[halfIndex + i] = Yodd[i];
  }
}

/**
 * The scryptROMix algorithm
 *
 * This function modifies the ArrayBuffer of the input BigInt64Array
 *
 * @param {BigUint64Array} B - Input octet vector of length 128 * r octets.
 * @param {number} N         - CPU/Memory cost parameter, must be larger than 1,
 *                             a power of 2, and less than 2^(128 * r / 8).
 *
 */
function scryptROMix$1 (B, N) {
  /*
  The scryptROMix algorithm is the same as the ROMix algorithm described in
  http://www.tarsnap.com/scrypt/scrypt.pdf but with scryptBlockMix used as the
  hash function H and the Integerify function explained inline.
  */
  const r = B.byteLength / 128;
  /*
  1.  X = B
  */

  /*
  2.  for i = 0 to N - 1 do
        V[i] = X
        X = scryptBlockMix (X)
      end for
  */
  const V = new Array(N);
  for (let i = 0; i < N; i++) {
    V[i] = B.slice(0);
    scryptBlockMix$1(B);
  }

  /*
  3.  for i = 0 to N - 1 do
        j = Integerify (X) mod N
                where Integerify (B[0] ... B[2 * r - 1]) is defined
                as the result of interpreting B[2 * r - 1] as a
                little-endian integer.
        T = X xor V[j]
        X = scryptBlockMix (T)
      end for
  */
  const Nbi = BigInt(N);
  function integerifyModN (bigUint64arr) {
    const offset = (2 * r - 1) * 64;
    const lastBlock = new DataView(bigUint64arr.buffer, offset, 64);

    // Since N is a power of 2 and N <= 2**64 I can just take the first subblock (little endian) of 64 bits
    return lastBlock.getBigUint64(0, true) % Nbi
  }
  for (let i = 0; i < N; i++) {
    const j = integerifyModN(B);
    typedArrayXor$1(B, V[j]);
    scryptBlockMix$1(B);
  }
}

/**
 * The scrypt Algorithm (RFC 7914)
 *
 * @param {string | ArrayBuffer | TypedArray | DataView} P - A unicode string with a passphrase.
 * @param {string | ArrayBuffer | TypedArray | DataView} S - A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16)).
 * @param {number} N - CPU/memory cost parameter - Must be a power of 2 (e.g. 1024)
 * @param {number} r - The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used.
 * @param {number} p - Parallelization parameter; a positive integer satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.
 * @param {number} dkLen - Intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32.
 */
async function scrypt$2 (P, S, N, r, p, dkLen) {
  if (typeof P === 'string') P = new TextEncoder().encode(P); // encode S as UTF-8
  else if (P instanceof ArrayBuffer) P = new Uint8Array(P);
  else if (!ArrayBuffer.isView(P)) throw RangeError('P should be string, ArrayBuffer, TypedArray, DataView')

  if (typeof S === 'string') S = new TextEncoder().encode(S); // encode S as UTF-8
  else if (S instanceof ArrayBuffer) S = new Uint8Array(S);
  else if (!ArrayBuffer.isView(S)) throw RangeError('S should be string, ArrayBuffer, TypedArray, DataView')

  if (!Number.isInteger(N) || N <= 0 || (N & (N - 1)) !== 0) throw RangeError('N must be a power of 2')

  if (!Number.isInteger(r) || r <= 0 || !Number.isInteger(p) || p <= 0 || p * r > 1073741823.75) throw RangeError('Parallelization parameter p and blosize parameter r must be positive integers satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.')

  if (!Number.isInteger(dkLen) || dkLen <= 0 || dkLen > 137438953440) throw RangeError('dkLen is the intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32')

  // if (!true) return require('crypto').scryptSync(P, S, dkLen, { N, r, p })

  /*
  1.  Initialize an array B consisting of p blocks of 128 * r octets each:
      B[0] || B[1] || ... || B[p - 1] = PBKDF2-HMAC-SHA256 (P, S, 1, p * 128 * r)
  */
  const B = await pbkdf2HmacSha256$2(P, S, 1, p * 128 * r);

  /*
  2.  for i = 0 to p - 1 do
        B[i] = scryptROMix (r, B[i], N)
      end for
  */
  const B64 = new BigUint64Array(B);
  for (let i = 0; i < p; i++) {
    // TO-DO: activate web workers here!!
    const blockLength64 = 16 * r;
    const offset = i * blockLength64;
    const Bi = B64.slice(offset, offset + blockLength64);
    scryptROMix$1(Bi, N);
    for (let j = 0; j < 16 * r; j++) {
      B64[offset + j] = Bi[j];
    }
  }

  /*
  3.  DK = PBKDF2-HMAC-SHA256 (P, B[0] || B[1] || ... || B[p - 1], 1, dkLen)
  */
  const DK = await pbkdf2HmacSha256$2(P, B64, 1, dkLen);

  return DK
}

var index_browser_mod_64bits_test = /*#__PURE__*/Object.freeze({
  __proto__: null,
  pbkdf2HmacSha256: pbkdf2HmacSha256$2,
  salsa208Core: salsa208Core$2,
  scrypt: scrypt$2,
  scryptBlockMix: scryptBlockMix$1,
  scryptROMix: scryptROMix$1
});

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->


// <--





describe('testing scrypt 64 bits', function () {
  this.timeout(360000);
  for (const vector of scrypt$1) {
    describe(`${vector.comment} : P=${vector.input.P}, S=${vector.input.S}, N=${vector.input.N}, r=${vector.input.r}, p=${vector.input.p}, dkLen=${vector.input.dkLen})`, function () {
      if ('error' in vector) {
        it(`should be rejected because of ${vector.error}`, async function () {
          try {
            await index_browser_mod_64bits_test.scrypt(vector.input.P, vector.input.S, vector.input.N, vector.input.r, vector.input.p, vector.input.dkLen);
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(vector.error);
          }
        });
      } else {
        it(`should match ${vector.output}`, async function () {
          const ret = await index_browser_mod_64bits_test.scrypt(vector.input.P, vector.input.S, vector.input.N, vector.input.r, vector.input.p, vector.input.dkLen);
          chai.expect(index_browser_mod$1.bufToHex(ret)).to.equal(vector.output);
        });
      }
    });
  }
});

var scryptBlockMix$2 = [
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-9',
    input: {
      B: 'f7ce0b653d2d72a4108cf5abe912ffdd777616dbbb27a70e8204f3ae2d0f6fad89f68f4811d1e87bcc3bd7400a9ffd29094f0184639574f39ae5a1315217bcd7894991447213bb226c25b54da86370fbcd984380374666bb8ffcb5bf40c254b067d27c51ce4ad5fed829c90b505a571b7f4d1cad6a523cda770e67bceaaf7e89'
    },
    output: 'a41f859c6608cc993b81cacb020cef05044b2181a2fd337dfd7b1c6396682f29b4393168e3c9e6bcfe6bc5b7a06d96bae424cc102c91745c24ad673dc7618f8120edc975323881a80540f64c162dcd3c21077cfe5f8d5fe2b1a4168f953678b77d3b3d803b60e4ab920996e59b4d53b65d2a225877d5edf5842cb9f14eefe425'
  }
];

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->


// <--





describe('testing scryptBlockMix', function () {
  this.timeout(360000);
  for (const vector of scryptBlockMix$2) {
    describe(`${vector.comment} : B=${vector.input.B}`, function () {
      const B = new Uint32Array(index_browser_mod$1.hexToBuf(vector.input.B, true));
      if ('error' in vector) {
        it(`should be rejected because of ${vector.error}`, function () {
          try {
            index_browser_mod.scryptBlockMix(B);
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(vector.error);
          }
        });
      } else {
        it(`should match ${vector.output}`, function () {
          index_browser_mod.scryptBlockMix(B);
          chai.expect(index_browser_mod$1.bufToHex(B)).to.equal(vector.output);
        });
      }
    });
  }
});

var scryptROMix$2 = [
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-10',
    input: {
      B: 'f7ce0b653d2d72a4108cf5abe912ffdd777616dbbb27a70e8204f3ae2d0f6fad89f68f4811d1e87bcc3bd7400a9ffd29094f0184639574f39ae5a1315217bcd7894991447213bb226c25b54da86370fbcd984380374666bb8ffcb5bf40c254b067d27c51ce4ad5fed829c90b505a571b7f4d1cad6a523cda770e67bceaaf7e89',
      N: 16
    },
    output: '79ccc193629debca047f0b70604bf6b62ce3dd4a9626e355fafc6198e6ea2b46d58413673b99b029d665c357601fb426a0b2f4bba200ee9f0a43d19b571a9c71ef1142e65d5a266fddca832ce59faa7cac0b9cf1be2bffca300d01ee387619c4ae12fd4438f203a0e4e1c47ec314861f4e9087cb33396a6873e8f9d2539a4b8e'
  }
];

// Every test file (you can create as many as you want) should start like this
// Please, do NOT touch. They will be automatically removed for browser tests -->


// <--





describe('testing scryptROMix', function () {
  this.timeout(360000);
  for (const vector of scryptROMix$2) {
    describe(`${vector.comment} : B=${vector.input.B}, N=${vector.input.N}`, function () {
      const B = new Uint32Array(index_browser_mod$1.hexToBuf(vector.input.B, true));
      if ('error' in vector) {
        it(`should be rejected because of ${vector.error}`, function () {
          try {
            index_browser_mod.scryptROMix(B, vector.input.N);
            throw new Error('should have failed')
          } catch (err) {
            chai.expect(err).to.be.instanceOf(vector.error);
          }
        });
      } else {
        it(`should match ${vector.output}`, function () {
          index_browser_mod.scryptROMix(B, vector.input.N);
          chai.expect(index_browser_mod$1.bufToHex(B)).to.equal(vector.output);
        });
      }
    });
  }
});
