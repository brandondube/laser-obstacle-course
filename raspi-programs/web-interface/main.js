// web stack
const express = require('express')
  ,      app  = express()
  ,    server = require('http').Server(app)
  ,      path = require('path')
  ,      io   = require('socket.io')(server)

// express setup
app.use(express.static(path.join(__dirname, 'www-root')));
app.get('/', (req, res) => res.sendFile('index.html'));
server.listen(80, () => console.log('web server listening on port 80'));

// socket setup
io.on('connection', socket => {
  // log connections and disconnections
  console.log('new socket connection');
  socket.on('disconnect', () => console.log('socket connection closed'));

  // forward events
  /// setting game mode
  socket.on('setmode:rest', () => {
    io.emit('setmode:rest');
  });
  socket.on('setmode:align', () => {
    io.emit('setmode:align');
  });
  socket.on('setmode:cal', () => {
    io.emit('setmode:cal');
  });
  socket.on('setmode:game', () => {
    io.emit('setmode:game');
  });
  /// calibration events
  socket.on('cal:init', (numDiodes) => {
    io.emit('cal:init', numDiodes);
  });
  socket.on('cal:data', ({diodeIndex, data}) => {
    io.emit('cal:data', {diodeIndex, data});
  });
  socket.on('cal:finish', () => {
    io.emit('cal:finish');
  });
  /// game events
  socket.on('game:start', () => {
    io.emit('game:start');
  });
  socket.on('game:end', (winner) => {
    io.emit('game:end', winner);
  });
  socket.on('game:forcestop', () => {
    io.emit('game:forcestop');
  });
});
