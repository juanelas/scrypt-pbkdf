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
declare const salsa208Core: (arr: Uint32Array) => void;
export { salsa208Core };
//# sourceMappingURL=salsa208Core.d.ts.map