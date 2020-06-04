const scrypt = require('../lib/index.node')

const Benchmark = require('benchmark')
const bigintConversion = require('bigint-conversion')

const tests = require('../test/vectors/salsa208Core')

const suite = new Benchmark.Suite('Salsa 20/8 Core')
for (const test of tests) {
  // add tests
  const input = new Uint32Array(bigintConversion.hexToBuf(test.input.input, true))
  suite.add(test.comment, function () {
    scrypt.salsa208Core(input)
  })
}
// add listeners
suite.on('cycle', function (event) {
  console.log(String(event.target))
})
  .on('start', function () {
    console.log('Starting benchmarks for Salsa 20/8 Core... (keep calm)')
  })
  .on('complete', function () {
    console.log('Benchmark completed')
  })
// run
  .run()
