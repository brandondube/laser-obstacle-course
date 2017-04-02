// returns the mean along the second dimension of an array,
// all elements of the first dimension must have common length
function mean2d(array) {
  var avgs = [];
  stds = [];
  for (let i = 0, len = array.length; ++i < len;) {
    var len2 = array[i].length;
    var workArr = [];
    for (let j = 0; ++j < len2;) {
      workArr.push(array[i][j]);
    }
    const currentAvg = workArr.reduce((x,y) => x+y, 0) / len2;
    avgs.push(currentAvg);
  }
  return avgs;
}