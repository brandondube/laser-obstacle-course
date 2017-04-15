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
// const sp = new SerialPort('pathToPort', {
//     baudrate: 9600,
//     parser: SerialPort.parsers.readline('\n'),
// });
const socket = io.connect('http://localhost', {
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
var gameRunning = false;

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
      calVals = handleCalibrationMode(gameState, calVals, socket);
      calibrationSamplesRemaining--;
      if (calibrationSamplesRemaining === 0) {
        const { avgs, stds } = meanstd2d(calVals);
        db.push({
          prLowerBounds: avgs - 2 * stds,
          prUpperBounds: avgs + 2 * stds,
        });
        currentMode = gameModes.rest;
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
//  

// saving this syntax for later
// sp.removeListener('data', gameDataHandler);

// configure the socket
/// setting game mode
socket.on('setmode:rest', () => {
  currentMode = gameModes.rest;
});
socket.on('setmode:align', () => {
  currentMode = gameModes.align;
})
socket.on('setmode:cal', () => {
  currentMode = gameModes.calibrate;
};
socket.on('setmode:game', () => {
  currentMode = gameModes.game;
});
/// calibration events
socket.on('cal:init', () => {

})
//// no data or finish events, this program generates those and does not need
//// to listen to them.

/// game mode events
socket.on('game:forcestop', () => {
  // stop the game from running
  gameRunning = false;
})