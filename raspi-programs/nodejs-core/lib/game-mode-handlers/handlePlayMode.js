const checkLasers = require('../check-if-lasers-are-broken');

function handlePlayMode(gameState, socket) {
  // TODO: handle game mode
  if (gameState.startPushed) {
    socket.emit('game:start');
    return;
  }
  if (gameState.finishPushed) {
    socket.emit('game:finish_won');
    return;
  }
  var playerLost = checkLasers(gameState.prStates);
  if (playerLost) {
    socket.emit('game:finish_lost');
    return;
  }
}

module.exports = handlePlayMode;
