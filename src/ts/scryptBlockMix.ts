import { salsa208Core } from './salsa208Core.js'
import { typedArrayXor } from './typedArrayXor.js'

/**
 * The scryptBlockMix algorithm is the same as the BlockMix algorithm
 * described in the original scrypt paper but with Salsa20/8 Core used as
 * the hash function.
 *
 * This function modifies the ArrayBuffer of the input BigUint64Array
 *
 * @param B - B[0] || B[1] || ... || B[2 * r - 1]
 *                          Input octet string (of size 128 * r octets),
 *                          treated as 2 * r 64-octet blocks,
 *                          where each element in B is a 64-octet block.
 *
 */
const scryptBlockMix = function (B: Uint32Array): void {
  const r = B.byteLength / 128 // block size parameter

  /*
  1.  X = B[2 * r - 1]
  */
  const offset32 = (2 * r - 1) * 16
  const X = B.slice(offset32, offset32 + 16)

  /*
  2.  for i = 0 to 2 * r - 1 do
        T = X xor B[i]
        X = Salsa (T)
        Y[i] = X
      end for

  3.  B' = (Y[0], Y[2], ..., Y[2 * r - 2],
            Y[1], Y[3], ..., Y[2 * r - 1])
  */
  const Yodd = new Uint32Array(B.length / 2)
  let even = true
  for (let i = 0; i < 2 * r; i++) {
    const offset = i * 16
    const Bi = B.subarray(offset, offset + 16)
    typedArrayXor(X, Bi)
    salsa208Core(X)
    const k = i >> 1
    const off2 = 16 * k
    if (even) {
      // we can safely overwrite B'[0], B'[1]...B'[r-1] since they are not accessed again after overwriting them
      for (let j = 0; j < 16; j++) {
        B[off2 + j] = X[j]
      }
    } else {
      // Y[1], Y[3], ..., Y[2 * r - 1] should go to the second half and therefore we can't overwrite them until the entire process is finished
      for (let j = 0; j < 16; j++) {
        Yodd[off2 + j] = X[j]
      }
    }
    even = !even
  }
  // Update the second half of B: Y[1], Y[3], ..., Y[2 * r - 1]
  const halfIndex = 16 * r
  for (let i = 0; i < halfIndex; i++) {
    B[halfIndex + i] = Yodd[i]
  }
}

export { scryptBlockMix }
