// data is a string with the following format:
// laserState_pr01_pr02_pr03...pr_10
// laserState is a boolean, pr01~pr10 are 10 bit integers, [0,1023]
// importantly, values are separated by an underscore.

// this results in 51 characters per message, at 8 bits per character this
// allows up to 23.5 'frames' per second.

// int parsing is extremely fast, coalescence to a bool is also fast
// these both happen within a single cycle on the CPU, so this bool parse is
// essentially free
function parseBool(val) {
  return parseInt(val) > 0;
}

function process(data) {
  var inputArray = data.split('_');

  // shiftremoves first value from the array
  var lasersOn = parseBool(inputArray.shift());

  return {
    lasersOn,
    prstates: inputArray.map(v => parseInt(v)), // parse strings to ints
  }
}

module.exports = process;