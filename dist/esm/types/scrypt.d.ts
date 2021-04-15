import { TypedArray } from './shared-types';
/**
 * scrypt configuration parameters
 */
export interface ScryptParams {
    /** CPU/memory cost parameter - Must be a power of 2 (e.g. 1024) */
    N: number;
    /** The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used. */
    r: number;
    /** Parallelization parameter; a positive integer satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen */
    p: number;
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
declare const scrypt: (P: string | ArrayBuffer | TypedArray | DataView, S: string | ArrayBuffer | TypedArray | DataView, dkLen: number, scryptParams?: ScryptParams | undefined) => Promise<ArrayBuffer>;
export { scrypt };
export default scrypt;
//# sourceMappingURL=scrypt.d.ts.map