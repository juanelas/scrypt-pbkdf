const scryptPbkdf = require('../lib/index.node')
const scryptsy = require('scryptsy')
const scryptjs = require('scrypt-js')

const bigintConversion = require('bigint-conversion')

const Benchmark = require('benchmark')

const test = {
  P: new TextEncoder().encode('pleaseletmein'),
  S: 'SodiumChloride',
  r: 8,
  p: 1,
  dkLen: 64
}

const suite = new Benchmark.Suite('scrypt')

let { P, S, r, p, dkLen } = test
if (typeof P === 'string') {
  P = new TextEncoder().encode(P)
}
if (typeof S === 'string') {
  S = new TextEncoder().encode(S)
}
const Pstr = bigintConversion.bufToText(P)
const Sstr = bigintConversion.bufToText(S)
P = new Uint8Array(P)
S = new Uint8Array(S)

const limit = 2 ** 20
for (let N = 2 ** 12; N <= limit; N <<= 1) {
  // add tests
  const testDataStr = JSON.stringify({ P: Pstr, S: Sstr, N, r, p, dkLen })
  suite.add(`\nInput: ${testDataStr}\n  scrypt-pbkdf`, {
    defer: true,
    fn: function (deferred) {
      scryptPbkdf.scrypt(P, S, dkLen, { N, r, p }).then(ret => deferred.resolve())
    }
  })
    .add('  scrypt-js', {
      defer: true,
      fn: function (deferred) {
        scryptjs.scrypt(P, S, N, r, p, dkLen).then(ret => deferred.resolve())
      }
    })
    .add('  scryptsy', {
      defer: true,
      fn: function (deferred) {
        scryptsy.async(Pstr, Sstr, N, r, p, dkLen).then(ret => deferred.resolve())
      }
    })
}

// add listeners
suite.on('cycle', function (event) {
  console.log(`${event.target.name} — mean time: ${(event.target.stats.mean * 1000).toFixed(0)}ms ±${(100 * event.target.stats.deviation / event.target.stats.mean).toFixed(2)}% (${event.target.stats.sample.length} runs sampled)`)
})
  .on('start', function () {
    console.log('Starting benchmarks for scrypt... (keep calm). The rule of thumb is to use r=8, p=1 and choose N as the highest power of 2 that allows to derive a key in less than:\n  - 100ms for interactive login\n  - 5s for file encryption')
  })
  .on('complete', function () {
    console.log('\nBenchmark completed')
  })
// run
  .run()
