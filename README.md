# Laser Obstacle Course

This project contains both code written in NodeJS and C++ that as a whole is the "brain" of a laser obstacle course made by OSA Student Chapter students at the University of Rochester.  The NodeJS code runs on a Raspberry Pi and does the heavy lifting.  The C++ code runs on an arduino and is used to gather real-world inputs and bring them to the the Pi over the serial ports of both the machines.  Some basic processing is performed on the Arduino before passing signals.

## Why an Arduino _and_ a Pi?

We are utilizing both platforms because of the large amount of I/O available on the [Arduino Mega](https://www.arduino.cc/en/Main/arduinoBoardMega2560) as compared to the GPIO of the RasPi.  Without multiplexing, there are insufficient inputs to the Pi.  We indend to use some graphical output, which is outside the range of capabilities of an Arduino.

## What is in this repository

This repository contains several folders.  `Documentation` contains the documentation for the project, written in LaTeX.  `arduino-program` and `raspi-program` each contain the programs that run on their respective platforms.

The arduino program has zero dependencies.  The raspi program depends on the NodeJS runtime, as well as the `serialport` module.

## The future
The NodeJS program may be expanded into an [Electron](http://electron.atom.io/) application for Rasbian, or a server may be added with a separate web app interface.
