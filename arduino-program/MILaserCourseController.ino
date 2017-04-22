#include "Arduino.h"

// globals
String serialRx = "";    // incoming data on serial port
String serialTx = "";    // outgoing data on serial port
bool RxComplete = false; // whether we have finished recieving data
int currentMode = 0;     // game mode, 0,1,2,3 rest,align,cal,play
int gameSubMode = 0;     // sub-game mode, 0 for "rest" 1 for "play"

// pins
const int laserOut = 3;
const int startButton = 4;
const int finishButton = 5;
const int prPins[] = {
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15
};
const int numPrPins = sizeof(prPins) / sizeof(int);

int lasersOn = 0;
int startVal = 0;
int finishVal = 0;
int prValues[numPrPins];

void setup() {
  // begin serial communication
  Serial.begin(9600);
  // reserve 200 bytes for the recieved string (this is just optimimzation)
  serialRx.reserve(200);

  pinMode(laserOut, OUTPUT);
}

// this function is called whenever a new byte is available on the serial port,
// it runs "in parallel" to the main loop()
void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == "\n") {
      // if we recieve a newline, mark the transfer as complete and return
      RxComplete = true;
      return;
    }
    serialRx += inChar;
  }
}

void loop() {
  // if we've recieved information, use it
  if (RxComplete) {
    if (serialRx == "setmode:rest") {
      currentMode = 0;
    }
    else if (serialRx == "setmode:align") {
      currentMode = 1;
    }
    else if (serialRx == "setmode:calibrate") {
      currentMode = 2;
    }
    else if (serialRx == "setmode:game") {
      currentMode = 3;
    }
    RxComplete = true;
  }

  if (currentMode == 0) { // rest - do nothing
    return;
  }
  if (currentMode == 1) { // align - lasers on, nothing else
    digitalWrite(laserOut, HIGH);
    return;
  }
  if (currentMode == 2) { // calibrate - send data out
    for(int i = 0; i < numPrPins; i++) {
      prValues[i] = analogRead(prPins[i]);
    }
    serialTx = constructSerialTx();
    Serial.write(serialTx);
    return;
  }
  if (currentMode == 3) { // game - branch on rest state then return values
    if (gameSubMode == 0) {
      // evaluate if the start button is pushed, if it is, change the submode to
      // "play," the next loop() will pick up the state
      startVal = digitalRead(startButton);
      if (startVal == HIGH) {
        gameSubMode = 1;
      }
      // also notify the Pi
      serialTx = constructSerialTx();
      Serial.write(serialTx);
      return
    }
    if (gameSubMode == 1) {
      // evaluate the photoresistor values
      finishVal = digitalRead(finishButton);
      for(int i = 0; i < numPrPins; i++) {
        prValues[i] = analogRead(prPins[i]);
      }
      serialTx = constructSerialTx();
      Serial.write(serialTx);
    }
  }
}
String constructSerialTx() {
  serialTx += finishPushed + "_" + startPushed + "_" + lasersOn;
  for(int i=0; i < numPrPins; i++) {
      serialTx += prValues[i];
  }
  return serialTx;
}
