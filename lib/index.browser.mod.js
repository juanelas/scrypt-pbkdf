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
    arr1[i] ^= arr2[i]
  }
}

/**
 * The PBKDF2-HMAC-SHA-256 function used below denotes the PBKDF2 algorithm
 * (RFC2898) used with HMAC-SHA-256 as the Pseudorandom Function (PRF)
 *
 * @param {string} P - A unicode string with a password
 * @param {ArrayBuffer | TypedArray} S - A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16))
 * @param {number} c - iteration count, a positive integer
 * @param {number} dkLen - intended length in octets of the derived key, a positive integer, at most (2^32 - 1) * hLen
 *
 * @returns {Promise<ArrayBuffer>}
 */
function pbkdf2HmacSha256 (P, S, c, dkLen) {
  P = new TextEncoder().encode(P) // encode pw as UTF-8
  return new Promise((resolve, reject) => {
    /* eslint-disable no-lone-blocks */
    {
      crypto.subtle.importKey('raw', P, 'PBKDF2', false, ['deriveBits']).then(
        PKey => {
          const params = { name: 'PBKDF2', hash: 'SHA-256', salt: S, iterations: c } // pbkdf2 params
          crypto.subtle.deriveBits(params, PKey, dkLen * 8).then(
            derivedKey => resolve(derivedKey),
            err => reject(err)
          )
        },
        err => reject(err)
      )
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

  const x = arr.slice(0)

  for (let i = 8; i > 0; i -= 2) {
    x[4] ^= R(x[0] + x[12], 7)
    x[8] ^= R(x[4] + x[0], 9)
    x[12] ^= R(x[8] + x[4], 13)
    x[0] ^= R(x[12] + x[8], 18)
    x[9] ^= R(x[5] + x[1], 7)
    x[13] ^= R(x[9] + x[5], 9)
    x[1] ^= R(x[13] + x[9], 13)
    x[5] ^= R(x[1] + x[13], 18)
    x[14] ^= R(x[10] + x[6], 7)
    x[2] ^= R(x[14] + x[10], 9)
    x[6] ^= R(x[2] + x[14], 13)
    x[10] ^= R(x[6] + x[2], 18)
    x[3] ^= R(x[15] + x[11], 7)
    x[7] ^= R(x[3] + x[15], 9)
    x[11] ^= R(x[7] + x[3], 13)
    x[15] ^= R(x[11] + x[7], 18)
    x[1] ^= R(x[0] + x[3], 7)
    x[2] ^= R(x[1] + x[0], 9)
    x[3] ^= R(x[2] + x[1], 13)
    x[0] ^= R(x[3] + x[2], 18)
    x[6] ^= R(x[5] + x[4], 7)
    x[7] ^= R(x[6] + x[5], 9)
    x[4] ^= R(x[7] + x[6], 13)
    x[5] ^= R(x[4] + x[7], 18)
    x[11] ^= R(x[10] + x[9], 7)
    x[8] ^= R(x[11] + x[10], 9)
    x[9] ^= R(x[8] + x[11], 13)
    x[10] ^= R(x[9] + x[8], 18)
    x[12] ^= R(x[15] + x[14], 7)
    x[13] ^= R(x[12] + x[15], 9)
    x[14] ^= R(x[13] + x[12], 13)
    x[15] ^= R(x[14] + x[13], 18)
  }

  for (let i = 0; i < 16; ++i) arr[i] = x[i] + arr[i]
}

/**
 * The scryptBlockMix algorithm is the same as the BlockMix algorithm
 * described in [SCRYPT] but with Salsa20/8 Core used as the hash function H.
 * Below, Salsa(T) corresponds to the Salsa20/8 Core function applied to the
 * octet vector T.
 *
 * This function modifies the ArrayBuffer of the input BigInt64Array
 *
 * @param {BigUint64Array} B - B[0] || B[1] || ... || B[2 * r - 1]
 *                          Input octet string (of size 128 * r octets),
 *                          treated as 2 * r 64-octet blocks,
 *                          where each element in B is a 64-octet block.
 *
 */
function scryptBlockMix (B) {
  const r = B.byteLength / 128 // block size parameter

  /*
  1.  X = B[2 * r - 1]
  */
  const offset = (2 * r - 1) * 8
  const X = B.slice(offset, offset + 8)

  /*
  2.  for i = 0 to 2 * r - 1 do
        T = X xor B[i]
        X = Salsa (T)
        Y[i] = X
      end for

  3.  B' = (Y[0], Y[2], ..., Y[2 * r - 2],
            Y[1], Y[3], ..., Y[2 * r - 1])
  */
  let odd = false
  for (let i = 0; i < 2 * r; i++) {
    const offset = i * 8
    const Bi = B.subarray(offset, offset + 8)
    typedArrayXor(X, Bi)
    salsa208Core(new Uint32Array(X.buffer))
    let k = i >> 1
    if (odd) k += r
    for (let j = 0; j < 8; j++) {
      B[8 * k + j] = X[j]
    }
    odd = !odd
  }
}

/**
 * The scryptROMix algorithm is the same as the ROMix algorithm described in
 * http://www.tarsnap.com/scrypt/scrypt.pdf but with scryptBlockMix used as
 * the hash function H and the Integerify function explained inline.
 *
 * This function modifies the ArrayBuffer of the input BigInt64Array
 *
 * @param {BigUint64Array} B - Input octet vector of length 128 * r octets.
 * @param {number} N         - CPU/Memory cost parameter, must be larger than 1,
 *                             a power of 2, and less than 2^(128 * r / 8).
 *
 */
function scryptROMix (B, N) {
  /*
  1.  X = B
  */

  /*
  2.  for i = 0 to N - 1 do
        V[i] = X
        X = scryptBlockMix (X)
      end for
  */
  const V = new Array(N)
  for (let i = 0; i < N; i++) {
    V[i] = B.slice(0)
    scryptBlockMix(B)
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
  function integerifyModN (arr) {
    const offset = (2 * B.byteLength / 128 - 1) * 64
    const lastBlock = new DataView(arr.buffer, offset, 64)
    const Nbi = BigInt(N)
    let ret = 0n
    for (let i = 7; i >= 0; i--) {
      ret = ((ret << 64n) + lastBlock.getBigUint64(i, true)) % Nbi
    }
    if (ret < 0) ret += Nbi
    return ret
  }
  for (let i = 0; i < N; i++) {
    const j = integerifyModN(B)
    typedArrayXor(B, V[j])
    scryptBlockMix(B)
  }
}

/**
 * The scrypt Algorithm (RFC 7914)
 *
 * @param {string} P - A unicode string with a passphrase.
 * @param {ArrayBuffer | TypedArray} S - A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16)).
 * @param {number} N - CPU/memory cost parameter - Must be a power of 2 (e.g. 1024)
 * @param {number} r - The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used.
 * @param {number} p - Parallelization parameter; a positive integer satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.
 * @param {number} dkLen - Intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32.
 */
async function scrypt (P, S, N, r, p, dkLen) {
  /*
  1.  Initialize an array B consisting of p blocks of 128 * r octets each:
      B[0] || B[1] || ... || B[p - 1] = PBKDF2-HMAC-SHA256 (P, S, 1, p * 128 * r)
  */
  const B = await pbkdf2HmacSha256(P, S, 1, p * 128 * r)

  /*
  2.  for i = 0 to p - 1 do
        B[i] = scryptROMix (r, B[i], N)
      end for
  */
  const B64 = new DataView(B)
  for (let i = 0; i < p; i++) {
    // TO-DO: activate web workers here!!
    const offset = i * 64
    const Bi = new BigUint64Array(B.slice(offset, offset + 64))
    scryptROMix(Bi, N)
    for (let j = 0; j < 8; j++) {
      B64.setBigUint64(i * 8 + j, Bi[j])
    }
  }

  /*
  3.  DK = PBKDF2-HMAC-SHA256 (P, B[0] || B[1] || ... || B[p - 1], 1, dkLen)
  */
  const DK = await pbkdf2HmacSha256(P, B, 1, dkLen)

  return DK
}

export { pbkdf2HmacSha256, salsa208Core, scrypt, scryptBlockMix, scryptROMix }
