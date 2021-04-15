/**
 * Returns an ArrayBuffer of the desired length in bytes filled with cryptographically secure random bytes
 * @param {number} [length=16] - The length in bytes of the random salt
 * @throws {RangeError} length must be integer >= 0
 * @returns {ArrayBuffer}
 */
declare const salt: (length?: number) => ArrayBuffer;
export { salt };
export default salt;
//# sourceMappingURL=salt.d.ts.map