const scrypt32 = require('../lib/index.node')
const scryptsy = require('scryptsy')
const scryptjs = require('scrypt-js')

const bigintConversion = require('bigint-conversion')

const Benchmark = require('benchmark')

const tests = require('../test/vectors/scrypt').filter(val => !('error' in val) && (val.comment))

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
      scrypt32.scrypt(P, S, N, r, p, dkLen).then(ret => deferred.resolve())
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
        require('crypto').scrypt(P, S, dkLen, { N, r, p },
          (err, derivedKey) => {
            if (err) deferred.reject()
            deferred.resolve()
          }
        )
      }
    })
      .add('  Node\'s scryptSync', function () {
        require('crypto').scryptSync(P, S, dkLen, { N, r, p })
      })
  }
}
// add listeners
suite.on('cycle', function (event) {
  console.log(String(event.target))
})
  .on('start', function () {
    console.log('Starting benchmarks for scrypt... (keep calm)')
  })
  .on('complete', function () {
    console.log('\nBenchmark completed')
  })
// run
  .run()
