import { scryptROMix } from './scryptRomMix.js'
import pbkdf2Hmac from 'pbkdf2-hmac'
import { TypedArray } from './shared-types.js'

/**
 * scrypt configuration parameters
 */
export interface ScryptParams {
  /** CPU/memory cost parameter - Must be a power of 2 (e.g. 1024) */
  N: number
  /** The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used. */
  r: number
  /** Parallelization parameter; a positive integer satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen */
  p: number
}

/**
 * The scrypt Algorithm (RFC 7914)
 *
 * @param P - A unicode string with a passphrase.
 * @param S - A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16)) in browser's JS or with crypto.randomBytes(16).buffer in Node.js
 * @param dkLen - Intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32.
 * @param scryptParams - scrypt configuration parameters: N, p, r
 *
 * @returns {ArrayBuffer} - a derived key of dKLen bytes
 */
const scrypt = async function (P: string | ArrayBuffer | TypedArray | DataView, S: string | ArrayBuffer | TypedArray | DataView, dkLen: number, scryptParams?: ScryptParams): Promise<ArrayBuffer> {
  if (typeof P === 'string') P = new TextEncoder().encode(P) // encode P as UTF-8
  else if (P instanceof ArrayBuffer) P = new Uint8Array(P)
  else if (!ArrayBuffer.isView(P)) throw RangeError('P should be string, ArrayBuffer, TypedArray, DataView')

  if (typeof S === 'string') S = new TextEncoder().encode(S) // encode S as UTF-8
  else if (S instanceof ArrayBuffer) S = new Uint8Array(S)
  else if (!ArrayBuffer.isView(S)) throw RangeError('S should be string, ArrayBuffer, TypedArray, DataView')

  if (!Number.isInteger(dkLen) || dkLen <= 0 || dkLen > 137438953440) throw RangeError('dkLen is the intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32')

  const N = (scryptParams !== undefined && scryptParams.N !== undefined) ? scryptParams.N : 131072 // eslint-disable-line
  const r = (scryptParams !== undefined && scryptParams.r !== undefined) ? scryptParams.r : 8 // eslint-disable-line
  const p = (scryptParams !== undefined && scryptParams.p !== undefined) ? scryptParams.p : 1 // eslint-disable-line

  if (!Number.isInteger(N) || N <= 0 || (N & (N - 1)) !== 0) throw RangeError('N must be a power of 2')

  if (!Number.isInteger(r) || r <= 0 || !Number.isInteger(p) || p <= 0 || p * r > 1073741823.75) throw RangeError('Parallelization parameter p and blocksize parameter r must be positive integers satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.')

  if (!IS_BROWSER) return (await import('crypto')).scryptSync(P as TypedArray, S as TypedArray, dkLen, { N, r, p, maxmem: 160 * N * r }).buffer

  /*
  1.  Initialize an array B consisting of p blocks of 128 * r octets each:
      B[0] || B[1] || ... || B[p - 1] = PBKDF2-HMAC-SHA256 (P, S, 1, p * 128 * r)
  */
  const B = await pbkdf2Hmac(P, S, 1, p * 128 * r)

  /*
  2.  for i = 0 to p - 1 do
        B[i] = scryptROMix (r, B[i], N)
      end for
  */
  const B32 = new Uint32Array(B)
  for (let i = 0; i < p; i++) {
    // TO-DO: activate web workers here!!
    const blockLength32 = 32 * r
    const offset = i * blockLength32
    const Bi = B32.slice(offset, offset + blockLength32)
    scryptROMix(Bi, N)
    for (let j = 0; j < 32 * r; j++) {
      B32[offset + j] = Bi[j]
    }
  }

  /*
  3.  DK = PBKDF2-HMAC-SHA256 (P, B[0] || B[1] || ... || B[p - 1], 1, dkLen)
  */
  const DK = await pbkdf2Hmac(P, B32, 1, dkLen)

  return DK
}

export { scrypt }
export default scrypt
