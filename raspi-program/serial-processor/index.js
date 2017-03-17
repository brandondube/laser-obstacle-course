// data is a string with the following format:
// laserState_pr01_pr02_pr03...pr_10
// laserState is a boolean, pr01~pr10 are 10 bit integers, [0,1023]
// importantly, values are separated by an underscore.

// this results in 51 characters per message, at 8 bits per character this
// allows up to 23.5 'frames' per second.

function parsePhotoresistors(data) {
  var inputArray = data.split('_');

  // shiftremoves first value from the array
  inputArray.shift();

  return inputArray.map(v => parseInt(v)); // parse strings to ints
}

function parseLaserState(data) {
  return parseInt(data.split('_')[0]) > 0;
}

module.exports = {
  parsePhotoresistors,
  parseLaserState,
};
