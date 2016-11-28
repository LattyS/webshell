const express = require('express');
const app = express();
const spawn = require('child_process').spawn;
var terminal = spawn('cmd');

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
    var  output = function (msg) {
        socket.emit('output', msg.toString());
      };

    terminal.stdout.on('data', output);
    terminal.stderr.on('data', output);
    terminal.on('close', function () {
    output('Exit');
    socket.disconnect(true);
  });

  socket.on('input', function (data) {
      terminal.stdin.write(data);
  });

  socket.on('disconnect', function () {
      terminal.kill('SIGKILL');
  });
});

server.listen(8080);
