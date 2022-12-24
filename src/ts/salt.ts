/**
 * Returns an ArrayBuffer of the desired length in bytes filled with cryptographically secure random bytes
 * @param {number} [length=16] - The length in bytes of the random salt
 * @throws {RangeError} length must be integer >= 0
 * @returns {ArrayBuffer}
 */
const salt = function (length: number = 16): ArrayBuffer {
  if (!Number.isInteger(length) || length < 0) throw new RangeError('length must be integer >= 0')

  if (length === 0) return new ArrayBuffer(0)

  return crypto.getRandomValues(new Uint8Array(length)).buffer
}

export { salt }
export default salt
