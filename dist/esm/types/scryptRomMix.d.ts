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
declare const scryptROMix: (B: Uint32Array, N: number) => void;
export { scryptROMix };
//# sourceMappingURL=scryptRomMix.d.ts.map