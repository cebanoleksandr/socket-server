const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const PORT = 5000;

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

const users = [];

app.get('/api', (req, res) => {
  res.send({
    message: 'Hello, world!',
  });
});

io.on('connection', (socket) => {
  console.log(`${socket.id} user connected`);

  socket.on('message', (data) => {
    io.emit('response', data);
  });

  socket.on('typing', (data) => socket.broadcast.emit('responseTyping', data));

  socket.on('newUser', (data) => {
    users.push(data);
    io.emit('responseNewUser', users);
  });

  socket.on('logout', (data) => {
    users.filter(user => user.socketId !== data);
    io.emit('responseNewUser', users);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} user disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

