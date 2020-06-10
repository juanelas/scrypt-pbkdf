const crypto = require('crypto')
const bigintConversion = require('bigint-conversion')

const vector = {}
vector.input = {
  P: 'pleaseletmein',
  S: 'SodiumChloride',
  N: 131072,
  r: 8,
  p: 1,
  dkLen: 64
}
vector.output = bigintConversion.bufToHex(crypto.scryptSync(vector.input.P, vector.input.S, vector.input.dkLen, { N: vector.input.N, r: vector.input.r, p: vector.input.p, maxmem: 256 * vector.input.N * vector.input.r }))

console.log(JSON.stringify(vector))
