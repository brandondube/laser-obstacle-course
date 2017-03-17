const process = require('./index')

const mockInput = '0_1023_1023_1023_1023_1023_1023_1023_1023_1023_1023';
const numTrials = 10000;

console.time('parse time');
for (let i = 0; i < numTrials; i++) {
  var state = process(mockInput);
}
console.timeEnd('parse time');

// results:
// i7-7700HQ (4c/8t @ 2.8Ghz base, 3.6Ghz turbo)
// trial 1: 17.502ms
// trial 2: 19.380ms
// trial 3: 18.837ms
// average: 18.573ms
// per-execution time is 18.5μs.

// raspi is ~1/3 as fast, ~55μs per execution.
// fast enough for 1800 calls per second.  ✓