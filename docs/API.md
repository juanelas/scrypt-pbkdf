scrypt-pbkdf

# scrypt-pbkdf

Scrypt password-based key derivation function (RFC 7914)

## Table of contents

### Interfaces

- [ScryptParams](interfaces/scryptparams.md)

### Functions

- [salsa208Core](API.md#salsa208core)
- [salt](API.md#salt)
- [scrypt](API.md#scrypt)
- [scryptBlockMix](API.md#scryptblockmix)
- [scryptROMix](API.md#scryptromix)

## Functions

### salsa208Core

▸ `Const`**salsa208Core**(`arr`: *Uint32Array*): *void*

Salsa20/8 Core is a round-reduced variant of the Salsa20 Core.  It is a
hash function from 64-octet strings to 64-octet strings.  Note that
Salsa20/8 Core is not a cryptographic hash function since it is not
collision resistant.

This function modifies the ArrayBuffer of the input UInt32Array

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`arr` | *Uint32Array* | a binary array of 64 octets     |

**Returns:** *void*

Defined in: [salsa208Core.ts:12](https://github.com/juanelas/scrypt-bigint/blob/df7163d/src/ts/salsa208Core.ts#L12)

___

### salt

▸ `Const`**salt**(`length?`: *number*): ArrayBuffer

Returns an ArrayBuffer of the desired length in bytes filled with cryptographically secure random bytes

**`throws`** {RangeError} length must be integer >= 0

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`length` | *number* | 16 |

**Returns:** ArrayBuffer

Defined in: [salt.ts:7](https://github.com/juanelas/scrypt-bigint/blob/df7163d/src/ts/salt.ts#L7)

___

### scrypt

▸ `Const`**scrypt**(`P`: *string* \| ArrayBuffer \| TypedArray \| DataView, `S`: *string* \| ArrayBuffer \| TypedArray \| DataView, `dkLen`: *number*, `scryptParams?`: [*ScryptParams*](interfaces/scryptparams.md)): *Promise*<ArrayBuffer\>

The scrypt Algorithm (RFC 7914)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`P` | *string* \| ArrayBuffer \| TypedArray \| DataView | A unicode string with a passphrase.   |
`S` | *string* \| ArrayBuffer \| TypedArray \| DataView | A salt. This should be a random or pseudo-random value of at least 16 bytes. You can easily get one with crypto.getRandomValues(new Uint8Array(16)) in browser's JS or with crypto.randomBytes(16).buffer in Node.js   |
`dkLen` | *number* | Intended output length in octets of the derived key; a positive integer less than or equal to (2^32 - 1) * hLen where hLen is 32.   |
`scryptParams?` | [*ScryptParams*](interfaces/scryptparams.md) | scrypt configuration parameters: N, p, r    |

**Returns:** *Promise*<ArrayBuffer\>

- a derived key of dKLen bytes

Defined in: [scrypt.ts:26](https://github.com/juanelas/scrypt-bigint/blob/df7163d/src/ts/scrypt.ts#L26)

___

### scryptBlockMix

▸ `Const`**scryptBlockMix**(`B`: *Uint32Array*): *void*

The scryptBlockMix algorithm is the same as the BlockMix algorithm
described in the original scrypt paper but with Salsa20/8 Core used as
the hash function.

This function modifies the ArrayBuffer of the input BigUint64Array

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`B` | *Uint32Array* | B[0] \|\| B[1] \|\| ... \|\| B[2 * r - 1]                          Input octet string (of size 128 * r octets),                          treated as 2 * r 64-octet blocks,                          where each element in B is a 64-octet block.     |

**Returns:** *void*

Defined in: [scryptBlockMix.ts:17](https://github.com/juanelas/scrypt-bigint/blob/df7163d/src/ts/scryptBlockMix.ts#L17)

___

### scryptROMix

▸ `Const`**scryptROMix**(`B`: *Uint32Array*, `N`: *number*): *void*

The scryptROMix algorithm

This function modifies the ArrayBuffer of the input array

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`B` | *Uint32Array* | Input octet vector of length 128 * r octets.   |
`N` | *number* | CPU/Memory cost parameter, must be larger than 1,                             a power of 2, and less than 2^(128 * r / 8).     |

**Returns:** *void*

Defined in: [scryptRomMix.ts:14](https://github.com/juanelas/scrypt-bigint/blob/df7163d/src/ts/scryptRomMix.ts#L14)
