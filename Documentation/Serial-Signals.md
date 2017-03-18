This file describes the signals sent between the Arduino and Raspberry Pi.

The `baudrate` is 9600 bytes/sec

## Arduino -> Pi

The Arduino communicates signals from photodiodes and buttons to the Pi.  The signals are sent as large _packets_ of information.  _Packets_ are demarkated by CRLF<sup>1</sup>.  There is internal demarkation between _fields_ of the packet.

A packet looks like the following:

`finishedPushed_startPushed_laserState_pr01_pr02_pr03...pr_10`

<sup>1</sup>Carriage Return Line Feed; one flavor of newline, that used by Arduinos.

<sup>2</sup>[Analog to Digital Converter](https://en.wikipedia.org/wiki/Analog-to-digital_converter)
