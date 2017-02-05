#include <Arduino.h>
#include <EventManager.h>   // Event-Based Arduino
#include <Adafruit_GFX.h>   // [Adafruit] Core graphics library
#include <RGBmatrixPanel.h> // [Adafruit] Hardware-specific library

// for details on EventManager, see github
// https://github.com/igormiktor/arduino-EventManager

// for details on reading analog voltages, see arduino references
// https://www.arduino.cc/en/Reference/AnalogRead

// /////////////////////////////////////////////////////////////////////////////
// LED matrix panel code
// /////////////////////////////////////////////////////////////////////////////

// Similar to F(), but for PROGMEM string pointers rather than literals
#define F2(progmem_ptr) (const __FlashStringHelper *)progmem_ptr

#define CLK 11
#define LAT 9
#define OE  10
#define A   A3
#define B   A2
#define C   A1
#define D   A0

// desfine pin layout for the RGB matrix
RGBmatrixPanel matrix(A, B, C, CLK, LAT, OE, true);

// magic code stolen from
const char str[] PROGMEM = "Adafruit 16x32 RGB LED Matrix";
int    textX   = matrix.width(),
       textMin = sizeof(str) * -12,
       hue     = 0;


void updateLEDMatrix(String time) {
  // set text position
  matrix.setCursor(textX, 1);

  // draw text
  matrix.print(time);

  // smoothly refresh the matrix display
  matrix.swapBuffers(false);
}

// /////////////////////////////////////////////////////////////////////////////
// Event Manager globals
// /////////////////////////////////////////////////////////////////////////////

// initialize a global instance of EventManager
EventManager gEM;

// /////////////////////////////////////////////////////////////////////////////
// operation globals
// /////////////////////////////////////////////////////////////////////////////

// current controller mode,
int CURRENT_MODE   = 0;
int MODE_STANDBY   = 0;
int MODE_ALIGNMENT = 1;
int MODE_GAME      = 2;
bool gameState = false;

// pin numbers
const int laserPin          =  2;  // pin that controls laser on/off
const int photoResPin       = A15; // analog voltage pin; 0~5V in 1024 steps
const int startPin          = 33;  // pin for start button
const int finishPin         = 31;  // pin for end game at end of course
const int startLightPin     = 4;   // pin that controls the light behind the btn
const int finishLightPin    = 6;   // pin that controls the light behind the btn
const int failureTriggerPin = 35;  // pin that manually triggers failure

int startVal       = 1; // state of start button
int startValLast   = 1;
int finishVal      = 1; // state of finish button
int finishValLast  = 1;
int manualfVal     = 1; // state of the manual failure switch
int manualfValLast = 1;

//
// photoresistor moving average filter, ul for very big numbers
//
//
unsigned long numCycles = 0;
unsigned long totalVal  = 0;

void updatePRWindow () {
  numCycles += 1;
  totalVal  += analogRead(photoResPin);
}

unsigned long getPRAvg() {
  return totalVal / numCycles;
}

bool isPRValueOk(unsigned long readValue, unsigned long avgValue) {
  // TODO: algorithm to check photoresistor value
}

//
// clock and timing functions
//
//
unsigned long startTime;
unsigned long currTime;

unsigned long getTimeDifference() {
  return currTime - startTime;
}

String timeToText(unsigned long time) {
  int seconds = time / 1000;
  int ms = time % 1000;
  return String(seconds) + ":" + String(ms);
}

//
// pulse code
//
//
unsigned long pulseInterval = 1250;
bool startBtnLightState = false;
bool finishBtnLightState = false;
unsigned long previousMS = 0;

unsigned long pulseLight (int pinNumber) {
  unsigned long currentMS = millis();

  // if the time since the last time this function ran is longer than the
  // interval, change the state of the light.
  if ((currentMS - previousMS) > pulseInterval) {
    if (pinNumber == startLightPin) {
      startBtnLightState = !startBtnLightState;
      digitalWrite(pinNumber, (startBtnLightState) ? HIGH : LOW);
      previousMS = currentMS;
    }
    else if (pinNumber == finishLightPin) {
      finishBtnLightState = !finishBtnLightState;
      digitalWrite(pinNumber, (finishBtnLightState) ? HIGH : LOW );
      previousMS = currentMS;
    }
  }
}

// /////////////////////////////////////////////////////////////////////////////
// event functions
// /////////////////////////////////////////////////////////////////////////////

// codes for events
// 00 - standby button pushed
// 01 - alignment button pushed
// 02 - game mode button pushed
//
// 10 - reserved for future use
// 11 - game start button pushed
// 12 - game finish button pushed
// 13 - game photoresistor tripped

void MODE_ENTER_STANDBY( int event, int param ) {
  // DEBUG: serial print statements are used for debugging
  Serial.print("sby :: 0 - disable lasers...");

  // turn off lasers
  digitalWrite( laserPin, HIGH );

  Serial.println("done.");

  // turn off Arduino onBoard LED
  digitalWrite( 13, LOW );

  // handle clock
  // TODO: clock function

  Serial.print("sby :: 1 - disable game mode event listeners...");

  // disable events for gameplay
  gEM.enableListener( 11, gameStartListener,       false);
  gEM.enableListener( 12, gameFinishListener,      false);
  gEM.enableListener( 13, gameLaserBrokenListener, false);

  Serial.println("done.");

  // set mode
  CURRENT_MODE = MODE_STANDBY;

  Serial.println("sby :: Successfully entered standby mode.");
  return;
}

void MODE_ENTER_ALIGNMENT( int event, int param ) {
  // DEBUG: serial print statements are used for deugging
  Serial.print("aln :: 0 - enable lasers...");

  // turn on lasers
  digitalWrite( laserPin, LOW );

  Serial.println("done.");

  // turn on Arduino's onBoard LED
  digitalWrite(13, HIGH);

  // handle clock
  // TODO: clock function

  Serial.print("aln :: 1 - disable game mode event listeners...");

  // disable events for gameplay
  gEM.enableListener( 11, gameStartListener,       false);
  gEM.enableListener( 12, gameFinishListener,      false);
  gEM.enableListener( 13, gameLaserBrokenListener, false);

  Serial.println("done.");

  // set mode
  CURRENT_MODE = MODE_ALIGNMENT;

  Serial.println("aln :: Successfully entered alignment mode.");
  return;
}

void MODE_ENTER_GAME( int event, int param ) {
  // DEBUG: serial print statements are used for debugging
  Serial.print("gme :: 0 - disable lasers until start button is pushed.");

  // turn off lasers until begin course button pushed
  digitalWrite( laserPin, HIGH );
  digitalWrite( 13, HIGH );

  Serial.println("done.");

  // set game state
  gameState = false;

  // handle clock
  // TODO: clock functions

  Serial.print("gme :: 1 - enable game mode event listeners...");

  // enable events for gameplay
  gEM.enableListener( 11, gameStartListener,       true);
  gEM.enableListener( 12, gameFinishListener,      true);
  gEM.enableListener( 13, gameLaserBrokenListener, true);

  Serial.println("done.");


  // turn on lights on start and end button
  Serial.print("gme :: 2 - turn on lights between s and f btns...");

  digitalWrite(startLightPin,  HIGH);
  digitalWrite(finishLightPin, HIGH);

  Serial.println("done.");

  // set mode
  CURRENT_MODE = MODE_GAME;

  Serial.println("gme :: Successfully entered game mode.");
  return;
}

void gameStartListener( int event, int param ) {
  // DEBUG : serial print statements are used for debugging
  Serial.println("gme :: starting.");

  // set game state;
  gameState = true;

  // turn on lasers
  digitalWrite( laserPin, LOW );

  // set start time
  unsigned long stime = millis();
  Serial.print("gme :: t0 = ");
  Serial.println(stime);
  startTime = stime;

  // start clock
  // TODO: clock function
}

void gameFinishListener( int event, int param ) {
  // DEBUG : serial print statements are used for debugging
  Serial.println("gme :: finishing, player success.");

  // get finish time
  currTime = millis();

  // freeze clock
  // TODO: clock function
  //

  // do something with lasers?
  // TODO: laser function
  digitalWrite(laserPin, HIGH);
  delay(10000);
  MODE_ENTER_GAME(0 ,0);
}

void gameLaserBrokenListener( int event, int param ) {
  // DEBUG : serial print statements are used for debugging
  Serial.println("gme :: finishing, player failure.");

  // get finish time
  currTime = millis();

  // handle clock
  // TODO: clock function

  // handle lasers
  // TODO: laser function
  for (int i = 0; i < 2; i++) {
    digitalWrite(laserPin, HIGH);
    delay(500);
    digitalWrite(laserPin, LOW);
    delay(500);
    digitalWrite(laserPin, HIGH);
    delay(500);
    digitalWrite(laserPin, LOW);
  }
  MODE_ENTER_GAME(0, 0);
}

// /////////////////////////////////////////////////////////////////////////////
// Arduino run code
// /////////////////////////////////////////////////////////////////////////////

void setup() {
  // DEBUG : begin serial stream
  Serial.begin(9600);
  Serial.println("Board booting...");
  Serial.print("assigning pin modes...");

  // set up button and laser control pins
  pinMode( 13,              OUTPUT );
  pinMode( laserPin,        OUTPUT );
  pinMode( photoResPin,     INPUT  );
  pinMode( startLightPin,   OUTPUT );
  pinMode( finishLightPin,  OUTPUT );
  pinMode( startPin,  INPUT_PULLUP );
  pinMode( finishPin, INPUT_PULLUP );
  pinMode( failureTriggerPin, INPUT_PULLUP );

  Serial.println("done.");
  Serial.print("Initializing LED matrix...");

  // initialize matrix
  matrix.begin();
  matrix.setTextWrap(true); // Don't allow text to run off right edge
  matrix.setTextSize(2);

  // fill LED display with white for 1 second
  matrix.fillScreen(1);
  delay(1000);
  matrix.fillScreen(0);

  // pre-program matrix
  matrix.setTextColor(matrix.ColorHSV(hue, 255, 255, true));
  matrix.setCursor(textX, 1);

  Serial.println("done.");
  Serial.print("Registering listeners to mode switch event codes...");

  // register listeners for mode switch events
  gEM.addListener(  0, MODE_ENTER_STANDBY);
  gEM.addListener(  1, MODE_ENTER_ALIGNMENT);
  gEM.addListener(  2, MODE_ENTER_GAME);

  Serial.println("done.");
  Serial.print("Registering listeners to game event codes...");

  // register listeners for game functions
  gEM.addListener( 11, gameStartListener);
  gEM.addListener( 12, gameFinishListener);
  gEM.addListener( 13, gameLaserBrokenListener);

  Serial.println("done.");
  Serial.println("Entering standby mode:");

  // go into standby mode
  MODE_ENTER_STANDBY(0, 0);

  Serial.println("Board booted successfully.");
}

void loop() {
  // poll input pins for states
  finishVal  = digitalRead(finishPin);
  startVal   = digitalRead(startPin);
  manualfVal = digitalRead(failureTriggerPin);

  // check if button  / switch states changed
  bool finishedHit = ( finishVal  != finishValLast )  ? true : false;
  bool startHit    = ( startVal   != startValLast  )  ? true : false;
  bool failureHit  = ( manualfVal != manualfValLast)  ? true : false;

  // read photoresistor-modulated voltage
  int prVoltage         = analogRead(photoResPin);
  unsigned long prAvg   = getPRAvg();
  bool lasersAreTripped = isPRValueOk(prVoltage, prAvg);
  // Serial.print("Photoresistor voltage = ");
  // Serial.println(prVoltage);

  // Event queue is determined by priority.
  // Priority is determined by user experience.
  // Priority 0 is highest.
  // 0 - finish button
  // 1 - laser broken
  // 2 - start button

  // If the state has changed and the state is on, fire an event.
  if ( finishedHit && finishVal == 0 ) {
    if      ( CURRENT_MODE == MODE_STANDBY   ) { MODE_ENTER_ALIGNMENT(0 ,0); }
    else if ( CURRENT_MODE == MODE_ALIGNMENT ) { MODE_ENTER_GAME(0, 0); }
    else if ( CURRENT_MODE == MODE_GAME      ) {
      if    ( gameState = false ) { MODE_ENTER_ALIGNMENT(0, 0); }
      else                        { gEM.queueEvent( 12, 0, EventManager::kHighPriority ); }
    }
  }

  if ( lasersAreTripped ) {
    gEM.queueEvent( 13, 0, EventManager::kHighPriority );
  }
  if ( failureHit && manualfVal == 0 ) {
    gEM.queueEvent( 13, 0, EventManager::kHighPriority );
  }

  if ( startHit && startVal == 0 ) {
    if      ( CURRENT_MODE == MODE_STANDBY ) { MODE_ENTER_GAME(0, 0); }
    else if ( CURRENT_MODE == MODE_GAME ) { gEM.queueEvent( 11, 0, EventManager::kHighPriority ); }
  }

	// process the event queue
	gEM.processEvent();

  // update the LED matrix display
  // matrix.swapBuffers(false);

  // pulse lights in various modes
  if (CURRENT_MODE == MODE_STANDBY) { pulseLight(startLightPin); }

  // update last states for the next cycle
  finishValLast  = finishVal;
  startValLast   = startVal;
}
