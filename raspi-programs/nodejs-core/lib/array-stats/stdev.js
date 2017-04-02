function stdev(arr, avg) {
  const squareDiffs = arr.map(v => v-avg).map(v => v*v);
  return Math.sqrt(squareDiffs.reduce((x,y) => x+y) / squareDiffs.length);
}

module.exports = stdev;
