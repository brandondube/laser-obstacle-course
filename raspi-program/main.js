// database
const Database = require('./database');
const db = new Database('db.json');

// Serial Port
const SerialPort = require("serialport");
const sp = new SerialPort('pathToPort', {
    baudrate: 9600,
    parser: SerialPort.parsers.readline('\n'),
});

// configure serialPort
sp.on('open', () => { console.log('serial port listening') });
sp.on('data', data => process(data));

function process(data) {
    return data;
}