This file describes the signals sent between the Arduino and Raspberry Pi.

The `baudrate` is 9600 bytes/sec

## Arduino -> Pi

The Arduino communicates signals from photodiodes and buttons to the Pi.  The signals are sent as large _packets_ of information.  _Packets_ are demarkated by CRLF<sup>1</sup>.  There is internal demarkation between _fields_ of the packet.

A packet looks like the following:

`OSA-MILASER::__BUTTONS__0,0__PHOTORESISTORS__1024,1024,...,1024__LASERS__0`

It is broken into sections,

### `__BUTTONS__`

The status of the two buttons.  There is a start and stop button.  The values are `booleans` encoded as 0 (false/unpressed) or 1 (true/pressed).  The values are separated by a comma.

### `__PHOTORESISTORS__`

The bias voltage as modulated by each photoresistor.  The Arduino's analog input pins are connected to 8 bit ADCs<sup>2</sup> which encode the voltage 0~5V as values 0~1024, where 1024 corresponds to 5V.  The values are separated by a comma.

### `__LASERS__`

A single boolean value (0/off 1/on) indicating if the lasers are currently powered.

<sup>1</sup>Carriage Return Line Feed; one flavor of newline, that used by Arduinos.

<sup>2</sup>[Analog to Digital Converter](https://en.wikipedia.org/wiki/Analog-to-digital_converter)
