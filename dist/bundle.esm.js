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

const e={"SHA-1":{outputLength:20,blockSize:64},"SHA-256":{outputLength:32,blockSize:64},"SHA-384":{outputLength:48,blockSize:128},"SHA-512":{outputLength:64,blockSize:128}};function t(t,a,o,i,s="SHA-256"){return new Promise(((u,c)=>{s in e||c(new RangeError(`Valid hash algorithm values are any of ${Object.keys(e).toString()}`)),"string"==typeof t?t=(new TextEncoder).encode(t):t instanceof ArrayBuffer?t=new Uint8Array(t):ArrayBuffer.isView(t)||c(RangeError("P should be string, ArrayBuffer, TypedArray, DataView")),"string"==typeof a?a=(new TextEncoder).encode(a):a instanceof ArrayBuffer?a=new Uint8Array(a):ArrayBuffer.isView(a)?a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength):c(RangeError("S should be string, ArrayBuffer, TypedArray, DataView")),crypto.subtle.importKey("raw",t,"PBKDF2",!1,["deriveBits"]).then((f=>{const y={name:"PBKDF2",hash:s,salt:a,iterations:o};crypto.subtle.deriveBits(y,f,8*i).then((e=>u(e)),(f=>{(async function(t,a,o,i,s){if(!(s in e))throw new RangeError(`Valid hash algorithm values are any of ${Object.keys(e).toString()}`);if(!Number.isInteger(o)||o<=0)throw new RangeError("c must be a positive integer");const u=e[s].outputLength;if(!Number.isInteger(i)||i<=0||i>=(2**32-1)*u)throw new RangeError("dkLen must be a positive integer < (2 ** 32 - 1) * hLen");const c=Math.ceil(i/u),f=i-(c-1)*u,y=new Array(c);0===t.byteLength&&(t=new Uint8Array(e[s].blockSize));const w=await crypto.subtle.importKey("raw",t,{name:"HMAC",hash:{name:s}},!0,["sign"]),g=async function(e,t){const r=await crypto.subtle.sign("HMAC",e,t);return new Uint8Array(r)};for(let e=0;e<c;e++)y[e]=await h(w,a,o,e+1);async function h(e,t,a,o){function i(e){const t=new ArrayBuffer(4);return new DataView(t).setUint32(0,e,!1),new Uint8Array(t)}const s=await g(e,r(t,i(o)));let u=s;for(let t=1;t<a;t++)u=await g(e,u),n(s,u);return s}return y[c-1]=y[c-1].slice(0,f),r(...y).buffer})(t,a,o,i,s).then((e=>u(e)),(e=>c(e)));}));}),(e=>c(e)));}))}function r(...e){const t=e.reduce(((e,t)=>e+t.length),0);if(0===e.length)throw new RangeError("Cannot concat no arrays");const r=new Uint8Array(t);let n=0;for(const t of e)r.set(t,n),n+=t.length;return r}function n(e,t){for(let r=0;r<e.length;r++)e[r]^=t[r];}

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
    const B = await t(P, S, 1, p * 128 * r);
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
    const DK = await t(P, B32, 1, dkLen);
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
