const app = require('express')();

//Socket IO
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.set('socketio', io);

//Database Connection
require('./startup/db')();

//Middleware
require('./startup/middleware')(app);

//PUBLIC ROUTES
// require('./routes')(app);

//ERROR HANDLER
app.use(require('./_utils/error_handler'));

//SOCKET IO
io.on('connection', socket => {
  console.log('A user connected');

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

//RUN SERVER
httpServer.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server running at ${process.env.PORT}`);
});
