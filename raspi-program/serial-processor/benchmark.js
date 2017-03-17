const parsePRs = require('./index').parsePhotoresistors;
const parseLaser = require('./index').parseLaserState;

const mockInput = '0_1023_1023_1023_1023_1023_1023_1023_1023_1023_1023';
const numTrials = 10000;

console.time('photoresistors');
for (let i = 0; i < numTrials; i++) {
  var prVals = parsePRs(mockInput);
}
console.timeEnd('photoresistors');

// photoressitor results:
// i7-7700HQ (4c/8t @ 2.8Ghz base, 3.6Ghz turbo)
// trial 1: 17.771ms
// trial 2: 17.455ms
// trial 3: 17.916ms
// average: 17.714ms
// per-execution time is 17μs.

// raspi is ~1/3 as fast, ~50μs per execution.
// fast enough for 2000 calls per second.  ✓

console.time('laserState');
for (let i = 0; i < numTrials; i++) {
  var laserState = parseLaser(mockInput);
}
console.timeEnd('laserState');

// laserstate results:
// i7-7700HQ (4c/8t @ 2.8Ghz base, 3.6Ghz turbo)
// trial 1: 17.771ms
// trial 2: 17.455ms
// trial 3: 17.916ms
// average: 17.714ms
// per-execution time is 17μs.

// raspi is ~1/3 as fast, ~50μs per execution.
// fast enough for 2000 calls per second.  ✓

// the reason we don't only go over the string once is because it takes too long
// for javascript to create an object.  Compare to 10,000 object creations:

console.time('object creation reference');
for (let i = 0; i < numTrials; i++) {
  var asdf = {
    'laserState': true,
    'prValues': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };
}
console.timeEnd('object creation reference');