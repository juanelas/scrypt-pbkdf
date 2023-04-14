# Interface: ScryptParams

scrypt configuration parameters

## Table of contents

### Properties

- [N](ScryptParams.md#n)
- [p](ScryptParams.md#p)
- [r](ScryptParams.md#r)

## Properties

### N

• **N**: `number`

CPU/memory cost parameter - Must be a power of 2 (e.g. 1024)

#### Defined in

[scrypt.ts:10](https://github.com/juanelas/scrypt-bigint/blob/6bffee4/src/ts/scrypt.ts#L10)

___

### p

• **p**: `number`

Parallelization parameter; a positive integer satisfying p ≤ (2^32− 1) * hLen / MFLen where hLen is 32 and MFlen

#### Defined in

[scrypt.ts:14](https://github.com/juanelas/scrypt-bigint/blob/6bffee4/src/ts/scrypt.ts#L14)

___

### r

• **r**: `number`

The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used.

#### Defined in

[scrypt.ts:12](https://github.com/juanelas/scrypt-bigint/blob/6bffee4/src/ts/scrypt.ts#L12)
