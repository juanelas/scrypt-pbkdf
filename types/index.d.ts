/**
 * A TypedArray object describes an array-like view of an underlying binary data buffer.
 */
export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;
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
export function pbkdf2HmacSha256(P: string | ArrayBuffer | TypedArray | DataView, S: string | ArrayBuffer | TypedArray | DataView, c: number, dkLen: number): Promise<ArrayBuffer>;
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
 * The scrypt Algorithm (RFC 7914)
 *
 * @param {string | ArrayBuffer | TypedArray | DataView} P - A unicode string with a passphrase.
 * @param {string | ArrayBuffer | TypedArray | DataView} S - A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16)).
 * @param {number} N - CPU/memory cost parameter - Must be a power of 2 (e.g. 1024)
 * @param {number} r - The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used.
 * @param {number} p - Parallelization parameter; a positive integer satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.
 * @param {number} dkLen - Intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32.
 */
export function scrypt(P: string | ArrayBuffer | TypedArray | DataView, S: string | ArrayBuffer | TypedArray | DataView, N: number, r: number, p: number, dkLen: number): Promise<ArrayBuffer>;
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
