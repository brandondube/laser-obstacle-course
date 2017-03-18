// database
const Database = require('./database');

// Serial Port
const SerialPort = require('serialport');

// fancy websockets
const io = require('socket.io-client');

// serial communication processor
const process = require('./serial-processor');

// laser state checker
const checkLasers = require('.c/heck-if-lasers-are-broken');

// initialize components
const db = new Database('devdb/db.json');
const sp = new SerialPort('pathToPort', {
    baudrate: 9600,
    parser: SerialPort.parsers.readline('\n'),
});
const socket = io.connect('localhost', {
  port: 8080
  reconnect: true,
});

// formalize the different event listeners so that we can add and remove them
function playGameHandler(data) {
  // push the signals from the Arduino into the database
  var gameState = process(data);
  db.push(gameState);

  // check if the laser levels are good
  var playerLost = checkLasers(gameState.prStates);

  // handle if the player has lost
  if (playerLost) {
    socket.emit('STOP_CLOCK', {}) // stop the clock
    socket.emit('PLAYER_LOST', {})// tell the UI the player lost
  }
}
// configure serialPort
// sp.on('open', () => console.log('serial port listening'));
sp.on('data', playGameHandler);

// saving this syntax for later
// sp.removeListener('data', playGameHandler);
