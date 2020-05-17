/**
 * My module description. Please update with your module data. YOU HAVE TO MANUALLY DO IT!
 * @module my-package-name
 */

/**
 * A TypedArray object describes an array-like view of an underlying binary data buffer.
 * @typedef {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|BigInt64Array|BigUint64Array} TypedArray
 */

/**
 * PBKBFD2
 * @param {string} P - A unicode string with a password
 * @param {ArrayBuffer | TypedArray} S - A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16))
 * @param {number} c - iteration count, a positive integer
 * @param {number} dkLen - intended length in octets of the derived key, a positive integer, at most (2^32 - 1) * hLen

 * @param {string} [PRF = 'SHA-256'] - Either of 'SHA-1' (not recommended), 'SHA-256', 'SHA-384', 'SHA-512'
 *
 * @returns {PromiseLike<ArrayBuffer>}
 */
async function pbkdf2 (P, S, c, dkLen, PRF = 'SHA-256') {
  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
  if (!algorithms.includes(PRF)) {
    throw new RangeError(`Valid hash algorith values are any of ${JSON.stringify(algorithms)}`)
  }
  const PBuff = new TextEncoder().encode(P) // encode pw as UTF-8
  const PKey = await crypto.subtle.importKey('raw', PBuff, 'PBKDF2', false, ['deriveBits']) // import P as key

  const params = { name: 'PBKDF2', hash: PRF, salt: S, iterations: c } // pbkdf2 params

  return crypto.subtle.deriveBits(params, PKey, dkLen) // derive key
}

/**
 * Salsa20/8 Core is a round-reduced variant of the Salsa20 Core.  It is a hash function from 64-octet strings to 64-octet strings.  Note that Salsa20/8 Core is not a cryptographic hash function since it is not collision resistant.
 *
 * @param {ArrayBuffer} buf - a binary array of 64 octets
 *
 * @returns {ArrayBuffer}
 */
function salsa208Core (buf) {
  function R (a, b) {
    return (a << b) | (a >> (32 - b))
  }
  const input = new Uint32Array(buf)
  const x = input.slice()

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
  const output = new Uint32Array(16)
  for (let i = 0; i < 16; ++i) output[i] = x[i] + input[i]

  return output.buffer
}

function scryptBlockMix (B) {
  // Input octet string (of size 128 * r octets)
  const r = B.length / 128
  const B64 = new BigUint64Array(B)
  const B64Length = B.length / 8
  const Bprime = new BigUint64Array(B64Length)
  /*
  B[0] || B[1] || ... || B[2 * r - 1]
  Input octet string (of size 128 * r octets),
  treated as 2 * r 64-octet blocks,
  where each element in B is a 64-octet block.
  */
  let X = B64.slice((2 * r - 1) * 8, 8)
  let odd = false
  for (let i = 0; i < 2 * r; i++) {
    const Bi = B64.subarray(i * 8, 8)
    const T = new BigUint64Array(8)
    for (let j = 0; j < 8; j++) {
      T[j] = X[j] ^ Bi[j]
    }
    X = salsa208Core(T.buffer)
    let k = i >> 1
    if (odd) {
      k += r + 1
    }
    for (let j = 0; j < 8; j++) {
      Bprime[8 * k + j] = X[j]
    }
    odd = !odd
  }
  return Bprime.buffer
}

/**
 * 
 * @param {number} r - Block size parameter.
 * @param {ArrayBuffer} B - Input octet vector of length 128 * r octets.
 * @param {number} N - CPU/Memory cost parameter, must be larger than 1, a power of 2, and less than 2^(128 * r / 8).
 * 
 * @returns {ArrayBuffer} - Output octet vector of length 128 * r octets.
 */
function scryptRomIx (r, B, N) {
  const X = B
  const V = new ArrayBuffer(B.length * N)
  const Bprime
  for (let i = 0; i < N; i++) {
    V[]
  }
  return Bprime
}

/**
 * scrypt
 *
 * @param {string} P - A unicode string with a passphrase
 * @param {ArrayBuffer | TypedArray} S - A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16))
 * @param {number} N - CPU/memory cost parameter - Must be a power of 2 (e.g. 1024)
 * @param {number} r - The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used
 * @param {number} p - Parallelization parameter; a positive integer satisfying p ≤ (232− 1) * hLen / MFLen.
 * @param {number} dkLen - Intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32.
 */
async function scrypt (P, S, N, r, p, dkLen) {
  const B64 = new BigUint64Array(await pbkdf2(P, S, 1, p * 128 * r, 'SHA-256'))
}
