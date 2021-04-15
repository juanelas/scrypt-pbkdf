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
declare const scryptBlockMix: (B: Uint32Array) => void;
export { scryptBlockMix };
//# sourceMappingURL=scryptBlockMix.d.ts.map