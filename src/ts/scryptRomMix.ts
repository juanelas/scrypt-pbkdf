import { scryptBlockMix } from './scryptBlockMix.js'
import { typedArrayXor } from './typedArrayXor.js'

/**
 * The scryptROMix algorithm
 *
 * This function modifies the ArrayBuffer of the input array
 *
 * @param {Uint32Array} B    - Input octet vector of length 128 * r octets.
 * @param {number} N         - CPU/Memory cost parameter, must be larger than 1,
 *                             a power of 2, and less than 2^(128 * r / 8).
 *
 */
const scryptROMix = function (B: Uint32Array, N: number): void {
  /*
  The scryptROMix algorithm is the same as the ROMix algorithm described in
  http://www.tarsnap.com/scrypt/scrypt.pdf but with scryptBlockMix used as the
  hash function H and the Integerify function explained inline.
  */
  const r = B.byteLength / 128
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
  function integerifyModN (Uint32arr: Uint32Array): number {
    const offset = (2 * r - 1) * 64
    const lastBlock = new DataView(Uint32arr.buffer, offset, 64)

    // Since N is a power of 2 and assuming N <= 2**32, we can just take the first subblock (little endian) of 32 bits
    return lastBlock.getUint32(0, true) % N
  }
  for (let i = 0; i < N; i++) {
    const j = integerifyModN(B)
    typedArrayXor(B, V[j])
    scryptBlockMix(B)
  }
}

export { scryptROMix }
