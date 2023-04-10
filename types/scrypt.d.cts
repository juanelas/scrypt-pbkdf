import { TypedArray } from './shared-types.js';
export interface ScryptParams {
    N: number;
    r: number;
    p: number;
}
declare const scrypt: (P: string | ArrayBuffer | TypedArray | DataView, S: string | ArrayBuffer | TypedArray | DataView, dkLen: number, scryptParams?: ScryptParams) => Promise<ArrayBuffer>;
export { scrypt };
export default scrypt;
//# sourceMappingURL=scrypt.d.ts.map