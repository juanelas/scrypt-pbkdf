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

const typedArrayXor = function (arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        arr1[i] ^= arr2[i];
    }
};

const scryptBlockMix = function (B) {
    const r = B.byteLength / 128;
    const offset32 = (2 * r - 1) * 16;
    const X = B.slice(offset32, offset32 + 16);
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
            for (let j = 0; j < 16; j++) {
                B[off2 + j] = X[j];
            }
        }
        else {
            for (let j = 0; j < 16; j++) {
                Yodd[off2 + j] = X[j];
            }
        }
        even = !even;
    }
    const halfIndex = 16 * r;
    for (let i = 0; i < halfIndex; i++) {
        B[halfIndex + i] = Yodd[i];
    }
};

const scryptROMix = function (B, N) {
    const r = B.byteLength / 128;
    const V = new Array(N);
    for (let i = 0; i < N; i++) {
        V[i] = B.slice(0);
        scryptBlockMix(B);
    }
    function integerifyModN(Uint32arr) {
        const offset = (2 * r - 1) * 64;
        const lastBlock = new DataView(Uint32arr.buffer, offset, 64);
        return lastBlock.getUint32(0, true) % N;
    }
    for (let i = 0; i < N; i++) {
        const j = integerifyModN(B);
        typedArrayXor(B, V[j]);
        scryptBlockMix(B);
    }
};

const HASHALGS = {
    'SHA-1': { outputLength: 20, blockSize: 64 },
    'SHA-256': { outputLength: 32, blockSize: 64 },
    'SHA-384': { outputLength: 48, blockSize: 128 },
    'SHA-512': { outputLength: 64, blockSize: 128 }
};
function pbkdf2Hmac(P, S, c, dkLen, hash = 'SHA-256') {
    return new Promise((resolve, reject) => {
        if (!(hash in HASHALGS)) {
            reject(new RangeError(`Valid hash algorithm values are any of ${Object.keys(HASHALGS).toString()}`));
        }
        if (typeof P === 'string')
            P = new TextEncoder().encode(P);
        else if (P instanceof ArrayBuffer)
            P = new Uint8Array(P);
        else if (!ArrayBuffer.isView(P))
            reject(RangeError('P should be string, ArrayBuffer, TypedArray, DataView'));
        if (typeof S === 'string')
            S = new TextEncoder().encode(S);
        else if (S instanceof ArrayBuffer)
            S = new Uint8Array(S);
        else if (ArrayBuffer.isView(S))
            S = new Uint8Array(S.buffer, S.byteOffset, S.byteLength);
        else
            reject(RangeError('S should be string, ArrayBuffer, TypedArray, DataView'));
        {
            crypto.subtle.importKey('raw', P, 'PBKDF2', false, ['deriveBits']).then((PKey) => {
                const params = { name: 'PBKDF2', hash, salt: S, iterations: c };
                crypto.subtle.deriveBits(params, PKey, dkLen * 8).then(derivedKey => resolve(derivedKey), err => {
                    _pbkdf2(P, S, c, dkLen, hash).then(derivedKey => resolve(derivedKey), error => reject(error));
                });
            }, err => reject(err));
        }
    });
}
async function _pbkdf2(P, S, c, dkLen, hash) {
    if (!(hash in HASHALGS)) {
        throw new RangeError(`Valid hash algorithm values are any of ${Object.keys(HASHALGS).toString()}`);
    }
    if (!Number.isInteger(c) || c <= 0)
        throw new RangeError('c must be a positive integer');
    const hLen = HASHALGS[hash].outputLength;
    if (!Number.isInteger(dkLen) || dkLen <= 0 || dkLen >= (2 ** 32 - 1) * hLen)
        throw new RangeError('dkLen must be a positive integer < (2 ** 32 - 1) * hLen');
    const l = Math.ceil(dkLen / hLen);
    const r = dkLen - (l - 1) * hLen;
    const T = new Array(l);
    if (P.byteLength === 0)
        P = new Uint8Array(HASHALGS[hash].blockSize);
    const Pkey = await crypto.subtle.importKey('raw', P, {
        name: 'HMAC',
        hash: { name: hash }
    }, true, ['sign']);
    const HMAC = async function (key, arr) {
        const hmac = await crypto.subtle.sign('HMAC', key, arr);
        return new Uint8Array(hmac);
    };
    for (let i = 0; i < l; i++) {
        T[i] = await F(Pkey, S, c, i + 1);
    }
    async function F(P, S, c, i) {
        function INT(i) {
            const buf = new ArrayBuffer(4);
            const view = new DataView(buf);
            view.setUint32(0, i, false);
            return new Uint8Array(buf);
        }
        const Uacc = await HMAC(P, concat(S, INT(i)));
        let UjMinus1 = Uacc;
        for (let j = 1; j < c; j++) {
            UjMinus1 = await HMAC(P, UjMinus1);
            xorMe(Uacc, UjMinus1);
        }
        return Uacc;
    }
    T[l - 1] = T[l - 1].slice(0, r);
    return concat(...T).buffer;
}
function concat(...arrs) {
    const totalLength = arrs.reduce((acc, value) => acc + value.length, 0);
    if (arrs.length === 0)
        throw new RangeError('Cannot concat no arrays');
    const result = new Uint8Array(totalLength);
    let length = 0;
    for (const array of arrs) {
        result.set(array, length);
        length += array.length;
    }
    return result;
}
function xorMe(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        arr1[i] ^= arr2[i];
    }
}

const scrypt = async function (P, S, dkLen, scryptParams) {
    if (typeof P === 'string')
        P = new TextEncoder().encode(P);
    else if (P instanceof ArrayBuffer)
        P = new Uint8Array(P);
    else if (!ArrayBuffer.isView(P))
        throw RangeError('P should be string, ArrayBuffer, TypedArray, DataView');
    if (typeof S === 'string')
        S = new TextEncoder().encode(S);
    else if (S instanceof ArrayBuffer)
        S = new Uint8Array(S);
    else if (!ArrayBuffer.isView(S))
        throw RangeError('S should be string, ArrayBuffer, TypedArray, DataView');
    if (!Number.isInteger(dkLen) || dkLen <= 0 || dkLen > 137438953440)
        throw RangeError('dkLen is the intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32');
    const N = (scryptParams !== undefined && scryptParams.N !== undefined) ? scryptParams.N : 131072;
    const r = (scryptParams !== undefined && scryptParams.r !== undefined) ? scryptParams.r : 8;
    const p = (scryptParams !== undefined && scryptParams.p !== undefined) ? scryptParams.p : 1;
    if (!Number.isInteger(N) || N <= 0 || (N & (N - 1)) !== 0)
        throw RangeError('N must be a power of 2');
    if (!Number.isInteger(r) || r <= 0 || !Number.isInteger(p) || p <= 0 || p * r > 1073741823.75)
        throw RangeError('Parallelization parameter p and blocksize parameter r must be positive integers satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen is 128 * r.');
    const B = await pbkdf2Hmac(P, S, 1, p * 128 * r);
    const B32 = new Uint32Array(B);
    for (let i = 0; i < p; i++) {
        const blockLength32 = 32 * r;
        const offset = i * blockLength32;
        const Bi = B32.slice(offset, offset + blockLength32);
        scryptROMix(Bi, N);
        for (let j = 0; j < 32 * r; j++) {
            B32[offset + j] = Bi[j];
        }
    }
    const DK = await pbkdf2Hmac(P, B32, 1, dkLen);
    return DK;
};

const salt = function (length = 16) {
    if (!Number.isInteger(length) || length < 0)
        throw new RangeError('length must be integer >= 0');
    if (length === 0)
        return new ArrayBuffer(0);
    return crypto.getRandomValues(new Uint8Array(length)).buffer;
};

export { salsa208Core, salt, scrypt, scryptBlockMix, scryptROMix };
