const scrypt = require('..')

const Benchmark = require('benchmark')
const bigintConversion = require('bigint-conversion')

const tests = require('../test-vectors/scryptBlockMix')

const suite = new Benchmark.Suite('scryptBlockMix')
for (const test of tests) {
  // add tests
  const input = new Uint32Array(bigintConversion.hexToBuf(test.input.B, true))
  suite.add(test.comment, function () {
    scrypt.salsa208Core(input)
  })
}
// add listeners
suite.on('cycle', function (event) {
  console.log(String(event.target))
})
  .on('start', function () {
    console.log('Starting benchmarks for scryptBlockMix ... (keep calm)')
  })
  .on('complete', function () {
    console.log('Benchmark completed')
  })
// run
  .run()
