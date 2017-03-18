// web stack
const app  = require('express')();
const http = require('http').Server(app);
const path = require('path');
const io   = require('socket.io').listen(8080);

// express setup
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'www-root', 'index.html')));
app.listen(80, () => console.log('web server listening on port 80'));

// socket setup
io.on('connection', socket => {
  console.log('new socket connection');
  socket.on('disconnect', () => console.log('socket connection closed'));

  // these events should be refactored so that the inner block is a single line function call
  socket.on('STOP_CLOCK', () => {
    // send clock stop command to the client who was served over port 80
  });
  socket.on('PLAYER_LOST', () => {
    // send player lost command to the client who was served over port 80
  });
});
