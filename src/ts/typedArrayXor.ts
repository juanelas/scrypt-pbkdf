import { TypedArray } from './shared-types.js'
/**
 * XORs arr2 to arr1. Both must be the same type of TypedArray
 * @private
 * @param arr1
 * @param arr2
 *
 */
const typedArrayXor = function (arr1: TypedArray, arr2: TypedArray): void {
  for (let i = 0; i < arr1.length; i++) {
    // @ts-expect-error: different TypedArrays
    arr1[i] ^= arr2[i]
  }
}

export { typedArrayXor }
