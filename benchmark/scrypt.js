const scryptPbkdf = require('../lib/index.node')
const scryptsy = require('scryptsy')
const scryptjs = require('scrypt-js')

const bigintConversion = require('bigint-conversion')

const Benchmark = require('benchmark')

const tests = require('../test/vectors/scrypt').filter(val => (val.benchmark))

const suite = new Benchmark.Suite('scrypt')
for (const test of tests) {
  // add tests
  let { P, S, N, r, p, dkLen } = test.input
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
  const testDataStr = JSON.stringify({ P: Pstr, S: Sstr, N, r, p, dkLen })
  suite.add(`\nInput: ${testDataStr} ${test.comment}\n  scrypt-pbkdf`, {
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
  if (!process.browser) {
    suite.add('  Node\'s scrypt', {
      defer: true,
      fn: function (deferred) {
        require('crypto').scrypt(P, S, dkLen, { N, r, p, maxmem: 256 * N * r },
          (err, derivedKey) => {
            if (!err) deferred.resolve()
          }
        )
      }
    })
      .add('  Node\'s scryptSync', function () {
        require('crypto').scryptSync(P, S, dkLen, { N, r, p, maxmem: 256 * N * r })
      })
  }
}
// add listeners
suite.on('cycle', function (event) {
  console.log(`${event.target.name} — mean time: ${(event.target.stats.mean * 1000).toFixed(2)}ms ±${(100 * event.target.stats.deviation / event.target.stats.mean).toFixed(2)}% (${event.target.stats.sample.length} runs sampled)`)
})
  .on('start', function () {
    console.log('Starting benchmarks for scrypt... (keep calm). The rule of thumb is to use r=8, p=1 and choose N as the highest power of 2 that allows to derive a key in less than:\n  - 100ms for interactive login\n  - 5s for file encryption')
  })
  .on('complete', function () {
    console.log('\nBenchmark completed')
    console.log('Fastest is ' + this.filter('fastest').map('name'))
    console.log('Slowest is ' + this.filter('slowest').map('name'))
  })
// run
  .run()
