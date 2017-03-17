/*
data is a string with the following format:
finishedPushed_startPushed_laserState_pr01_pr02_pr03...pr_10
finished, start, and laserState are 0/1 booleans, 
pr01~pr10 are 10 bit integers, [0,1023]

values are separated by an underscore.

this results in 55 characters per message, at 8 bits per character this
allows up to 22 'frames' per second at a baudrate of 9600.
*/

// because modern CPUs can perform many different instructions in a single cycle
// this function is free under most CPU loads for a single value
function parseBool(val) {
  return parseInt(val) > 0;
}

function process(data) {
  var inputArray = data.split('_');

  // shift removes first value from the array
  var startPushed = parseBool(inputArray.shift());
  var finishPushed = parseBool(inputArray.shift());
  var lasersOn = parseBool(inputArray.shift());
  var prStates = inputArray.map(v => parseInt(v));

  return {
    startPushed,
    finishPushed,
    lasersOn,
    prStates,
  };
}

module.exports = process;