declare const salsa208Core: (arr: Uint32Array) => void;
//# sourceMappingURL=salsa208Core.d.ts.map

declare const scryptBlockMix: (B: Uint32Array) => void;
//# sourceMappingURL=scryptBlockMix.d.ts.map

declare const scryptROMix: (B: Uint32Array, N: number) => void;
//# sourceMappingURL=scryptRomMix.d.ts.map

type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;

interface ScryptParams {
    N: number;
    r: number;
    p: number;
}
declare const scrypt: (P: string | ArrayBuffer | TypedArray | DataView, S: string | ArrayBuffer | TypedArray | DataView, dkLen: number, scryptParams?: ScryptParams) => Promise<ArrayBuffer>;

declare const salt: (length?: number) => ArrayBuffer;
//# sourceMappingURL=salt.d.ts.map

export { ScryptParams, TypedArray, salsa208Core, salt, scrypt, scryptBlockMix, scryptROMix };
