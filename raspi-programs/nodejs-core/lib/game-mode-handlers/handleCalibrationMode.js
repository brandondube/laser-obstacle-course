function handleCalibrationMode(gameState, workArray, socket) {
  const { prStates } = gameState;
  socket.emit('cal:data', prStates); // send the data to the GUI

  // immutably merge the new data onto the work array in 2D, this might be buggy
  workArray = [...workArray, prStates];
  return workArray;
}

module.exports = handleCalibrationMode;
