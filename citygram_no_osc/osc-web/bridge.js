var osc = require('node-osc'),
    io = require('socket.io').listen(8081);

var oscServer, oscClient;

oscServer = new osc.Server(3333, 'localhost');

io.sockets.on('connection', function (socket) {
  socket.on("config", function (obj) {
    console.log('config');
    oscServer.on('message', function(msg, rinfo) {
      socket.emit("message", msg);
    });
    // oscClient = new osc.Client(obj.client.host, obj.client.port);

    // oscClient.send('/status', socket.sessionId + ' connected');
  });
  socket.on("message", function (obj) {
    // oscClient.send(obj);
  });
});


