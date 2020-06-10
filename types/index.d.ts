/**
 * A TypedArray object describes an array-like view of an underlying binary data buffer.
 */
export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;
/**
 * Scrypt password-based key derivation function (RFC 7914)
 * @module scrypt-pbkdf
 */
/**
 * A TypedArray object describes an array-like view of an underlying binary data buffer.
 * @typedef {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|BigInt64Array|BigUint64Array} TypedArray
 * @private
 */
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
export function salsa208Core(arr: Uint32Array): void;
/**
 * Returns an ArrayBuffer of the desired length in bytes filled with cryptographically secure random bytes
 * @param {number} [length=16] - The length in bytes of the random salt
 * @throws {RangeError} length must be integer >= 0
 * @returns {ArrayBuffer}
 */
export function salt(length?: number): ArrayBuffer;
/**
 * The scrypt Algorithm (RFC 7914)
 *
 * @param {string | ArrayBuffer | TypedArray | DataView} P - A unicode string with a passphrase.
 * @param {string | ArrayBuffer | TypedArray | DataView} S - A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16)) in browser's JS or with crypto.randomBytes(16).buffer in Node.js
 * @param {number} dkLen - Intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32.
 * @param {Object} [scryptParams]
 * @param {number} [scryptParams.N=131072] - CPU/memory cost parameter - Must be a power of 2 (e.g. 1024)
 * @param {number} [scryptParams.r=8] - The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used.
 * @param {number} [scryptParams.p=1] - Parallelization parameter; a positive integer satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.
 *
 * @returns {ArrayBuffer} - a derived key of dKLen bytes
 */
export function scrypt(P: string | ArrayBuffer | TypedArray | DataView, S: string | ArrayBuffer | TypedArray | DataView, dkLen: number, scryptParams?: {
    N: number;
    r: number;
    p: number;
}): ArrayBuffer;
/**
 * The scryptBlockMix algorithm is the same as the BlockMix algorithm
 * described in the original scrypt paper but with Salsa20/8 Core used as
 * the hash function.
 *
 * This function modifies the ArrayBuffer of the input BigUint64Array
 *
 * @param {Uint32Array} B - B[0] || B[1] || ... || B[2 * r - 1]
 *                          Input octet string (of size 128 * r octets),
 *                          treated as 2 * r 64-octet blocks,
 *                          where each element in B is a 64-octet block.
 *
 */
export function scryptBlockMix(B: Uint32Array): void;
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
export function scryptROMix(B: Uint32Array, N: number): void;
