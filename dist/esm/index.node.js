import 'pbkdf2-hmac';

/**
 * Salsa20/8 Core is a round-reduced variant of the Salsa20 Core.  It is a
 * hash function from 64-octet strings to 64-octet strings.  Note that
 * Salsa20/8 Core is not a cryptographic hash function since it is not
 * collision resistant.
 *
 * This function modifies the ArrayBuffer of the input UInt32Array
 *
 * @param arr - a binary array of 64 octets
 *
  */
const salsa208Core = function (arr) {
    function R(a, b) {
        return (a << b) | (a >>> (32 - b));
    }
    const x = arr.slice(0);
    for (let i = 8; i > 0; i -= 2) {
        x[4] ^= R(x[0] + x[12], 7);
        x[8] ^= R(x[4] + x[0], 9);
        x[12] ^= R(x[8] + x[4], 13);
        x[0] ^= R(x[12] + x[8], 18);
        x[9] ^= R(x[5] + x[1], 7);
        x[13] ^= R(x[9] + x[5], 9);
        x[1] ^= R(x[13] + x[9], 13);
        x[5] ^= R(x[1] + x[13], 18);
        x[14] ^= R(x[10] + x[6], 7);
        x[2] ^= R(x[14] + x[10], 9);
        x[6] ^= R(x[2] + x[14], 13);
        x[10] ^= R(x[6] + x[2], 18);
        x[3] ^= R(x[15] + x[11], 7);
        x[7] ^= R(x[3] + x[15], 9);
        x[11] ^= R(x[7] + x[3], 13);
        x[15] ^= R(x[11] + x[7], 18);
        x[1] ^= R(x[0] + x[3], 7);
        x[2] ^= R(x[1] + x[0], 9);
        x[3] ^= R(x[2] + x[1], 13);
        x[0] ^= R(x[3] + x[2], 18);
        x[6] ^= R(x[5] + x[4], 7);
        x[7] ^= R(x[6] + x[5], 9);
        x[4] ^= R(x[7] + x[6], 13);
        x[5] ^= R(x[4] + x[7], 18);
        x[11] ^= R(x[10] + x[9], 7);
        x[8] ^= R(x[11] + x[10], 9);
        x[9] ^= R(x[8] + x[11], 13);
        x[10] ^= R(x[9] + x[8], 18);
        x[12] ^= R(x[15] + x[14], 7);
        x[13] ^= R(x[12] + x[15], 9);
        x[14] ^= R(x[13] + x[12], 13);
        x[15] ^= R(x[14] + x[13], 18);
    }
    for (let i = 0; i < 16; i++) {
        arr[i] = x[i] + arr[i];
    }
};

/**
 * XORs arr2 to arr1. Both must be the same type of TypedArray
 * @private
 * @param arr1
 * @param arr2
 *
 */
const typedArrayXor = function (arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        // @ts-expect-error: different TypedArrays
        arr1[i] ^= arr2[i];
    }
};

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
const scryptBlockMix = function (B) {
    const r = B.byteLength / 128; // block size parameter
    /*
    1.  X = B[2 * r - 1]
    */
    const offset32 = (2 * r - 1) * 16;
    const X = B.slice(offset32, offset32 + 16);
    /*
    2.  for i = 0 to 2 * r - 1 do
          T = X xor B[i]
          X = Salsa (T)
          Y[i] = X
        end for
  
    3.  B' = (Y[0], Y[2], ..., Y[2 * r - 2],
              Y[1], Y[3], ..., Y[2 * r - 1])
    */
    const Yodd = new Uint32Array(B.length / 2);
    let even = true;
    for (let i = 0; i < 2 * r; i++) {
        const offset = i * 16;
        const Bi = B.subarray(offset, offset + 16);
        typedArrayXor(X, Bi);
        salsa208Core(X);
        const k = i >> 1;
        const off2 = 16 * k;
        if (even) {
            // we can safely overwrite B'[0], B'[1]...B'[r-1] since they are not accessed again after overwriting them
            for (let j = 0; j < 16; j++) {
                B[off2 + j] = X[j];
            }
        }
        else {
            // Y[1], Y[3], ..., Y[2 * r - 1] should go to the second half and therefore we can't overwrite them until the entire process is finished
            for (let j = 0; j < 16; j++) {
                Yodd[off2 + j] = X[j];
            }
        }
        even = !even;
    }
    // Update the second half of B: Y[1], Y[3], ..., Y[2 * r - 1]
    const halfIndex = 16 * r;
    for (let i = 0; i < halfIndex; i++) {
        B[halfIndex + i] = Yodd[i];
    }
};

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
const scryptROMix = function (B, N) {
    /*
    The scryptROMix algorithm is the same as the ROMix algorithm described in
    http://www.tarsnap.com/scrypt/scrypt.pdf but with scryptBlockMix used as the
    hash function H and the Integerify function explained inline.
    */
    const r = B.byteLength / 128;
    /*
    1.  X = B
    */
    /*
    2.  for i = 0 to N - 1 do
          V[i] = X
          X = scryptBlockMix (X)
        end for
    */
    const V = new Array(N);
    for (let i = 0; i < N; i++) {
        V[i] = B.slice(0);
        scryptBlockMix(B);
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
    function integerifyModN(Uint32arr) {
        const offset = (2 * r - 1) * 64;
        const lastBlock = new DataView(Uint32arr.buffer, offset, 64);
        // Since N is a power of 2 and assuming N <= 2**32, we can just take the first subblock (little endian) of 32 bits
        return lastBlock.getUint32(0, true) % N;
    }
    for (let i = 0; i < N; i++) {
        const j = integerifyModN(B);
        typedArrayXor(B, V[j]);
        scryptBlockMix(B);
    }
};

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
const scrypt = async function (P, S, dkLen, scryptParams) {
    if (typeof P === 'string')
        P = new TextEncoder().encode(P); // encode S as UTF-8
    else if (P instanceof ArrayBuffer)
        P = new Uint8Array(P);
    else if (!ArrayBuffer.isView(P))
        throw RangeError('P should be string, ArrayBuffer, TypedArray, DataView');
    if (typeof S === 'string')
        S = new TextEncoder().encode(S); // encode S as UTF-8
    else if (S instanceof ArrayBuffer)
        S = new Uint8Array(S);
    else if (!ArrayBuffer.isView(S))
        throw RangeError('S should be string, ArrayBuffer, TypedArray, DataView');
    if (!Number.isInteger(dkLen) || dkLen <= 0 || dkLen > 137438953440)
        throw RangeError('dkLen is the intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32');
    const N = (scryptParams !== undefined && scryptParams.N !== undefined) ? scryptParams.N : 131072; // eslint-disable-line
    const r = (scryptParams !== undefined && scryptParams.r !== undefined) ? scryptParams.r : 8; // eslint-disable-line
    const p = (scryptParams !== undefined && scryptParams.p !== undefined) ? scryptParams.p : 1; // eslint-disable-line
    if (!Number.isInteger(N) || N <= 0 || (N & (N - 1)) !== 0)
        throw RangeError('N must be a power of 2');
    if (!Number.isInteger(r) || r <= 0 || !Number.isInteger(p) || p <= 0 || p * r > 1073741823.75)
        throw RangeError('Parallelization parameter p and blocksize parameter r must be positive integers satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.');
    return require('crypto').scryptSync(P, S, dkLen, { N, r, p, maxmem: 256 * N * r }).buffer; // eslint-disable-line
};

/**
 * Returns an ArrayBuffer of the desired length in bytes filled with cryptographically secure random bytes
 * @param {number} [length=16] - The length in bytes of the random salt
 * @throws {RangeError} length must be integer >= 0
 * @returns {ArrayBuffer}
 */
const salt = function (length = 16) {
    if (!Number.isInteger(length) || length < 0)
        throw new RangeError('length must be integer >= 0');
    if (length === 0)
        return new ArrayBuffer(0);
    return require('crypto').randomBytes(length).buffer; // eslint-disable-line
};

export { salsa208Core, salt, scrypt, scryptBlockMix, scryptROMix };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL3NhbHNhMjA4Q29yZS50cyIsIi4uLy4uL3NyYy90cy90eXBlZEFycmF5WG9yLnRzIiwiLi4vLi4vc3JjL3RzL3NjcnlwdEJsb2NrTWl4LnRzIiwiLi4vLi4vc3JjL3RzL3NjcnlwdFJvbU1peC50cyIsIi4uLy4uL3NyYy90cy9zY3J5cHQudHMiLCIuLi8uLi9zcmMvdHMvc2FsdC50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7Ozs7TUFXTSxZQUFZLEdBQUcsVUFBVSxHQUFnQjtJQUM3QyxTQUFTLENBQUMsQ0FBRSxDQUFTLEVBQUUsQ0FBUztRQUM5QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDbkM7SUFFRCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM3QixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDMUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3pCLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUMzQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDM0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3pCLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMxQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDM0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDM0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUMzQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDM0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzFCLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3pCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN6QixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDMUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzFCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN6QixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDekIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzFCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUMxQixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDM0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzNCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxD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
