// database
const Database = require('./lib/database');

// Serial Port
const SerialPort = require('serialport');

// fancy websockets
const io = require('socket.io-client');

// serial communication processor
const process = require('./lib/serial-processor');

// laser state checker
const checkLasers = require('./lib/check-if-lasers-are-broken');

// initialize components
const db = new Database('devdb/db.json');
const sp = new SerialPort('pathToPort', {
    baudrate: 9600,
    parser: SerialPort.parsers.readline('\n'),
});
const socket = io.connect('localhost', {
  port: 80,
  reconnect: true,
});

// game modes enum
const gameModes = Object.freeze({
  rest: 1,
  align: 2,
  calibrate: 3,
  play: 4,
});

// initialize the game in its rest mode
var currentMode = gameModes.rest;
var calibrationSamplesRemaining = 100;
var calVals = []; // columns of 'data frames'

// formalize the different event listeners so that we can add and remove them
function gameDataHandler(data) {
  // push the signals from the Arduino into the database
  var gameState = process(data);
  db.push(gameState);
  switch (currentMode) {
    case gameModes.rest:
      handleRestMode(gameState);
      break;
    case gameModes.align:
      handleAlignMode(gameState);
      break;
    case gameModes.calibrate:
      handleCalibrationMode(gameState, calVals, socket);
      calibrationSamplesRemaining--;
      if (calibrationSamplesRemaining === 0) {

      }
      break;
    case gameModes.play:
      handlePlayMode(gameState);
      break;

    default:
      return;
  }  
}
// configure serialPort
// sp.on('open', () => console.log('serial port listening'));
sp.on('data', gameDataHandler);

// saving this syntax for later
// sp.removeListener('data', gameDataHandler);
