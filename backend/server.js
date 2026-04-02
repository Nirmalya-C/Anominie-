// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Store connected users
const users = new Map();
const onlineUsers = new Set();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Anominie Chat Server', online: onlineUsers.size });
});

app.get('/api/stats', (req, res) => {
  res.json({
    onlineUsers: onlineUsers.size,
    totalConnections: users.size
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user login
  socket.on('user_login', (userData) => {
    const { username, country, email, phone } = userData;

    users.set(socket.id, {
      id: socket.id,
      username,
      country,
      email,
      phone,
      joinedAt: new Date()
    });

    onlineUsers.add(socket.id);

    // Notify all clients about new user
    io.emit('user_joined', {
      username,
      country,
      onlineCount: onlineUsers.size
    });

    // Send online count to the new user
    socket.emit('online_count', { count: onlineUsers.size });

    // Send welcome message
    socket.emit('system_message', {
      message: `Welcome to Anominie, ${username}! You are now chatting anonymously.`,
      timestamp: new Date()
    });

    console.log(`User logged in: ${username} (${country})`);
  });

  // Handle chat messages
  socket.on('chat_message', (data) => {
    const user = users.get(socket.id);

    if (user) {
      const messageData = {
        id: Date.now().toString(),
        username: user.username,
        country: user.country,
        message: data.message,
        timestamp: new Date()
      };

      // Broadcast message to all connected clients
      io.emit('new_message', messageData);

      console.log(`Message from ${user.username}: ${data.message}`);
    }
  });

  // Handle typing indicator
  socket.on('typing', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('user_typing', {
        username: user.username
      });
    }
  });

  // Handle stop typing
  socket.on('stop_typing', () => {
    socket.broadcast.emit('user_stop_typing');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);

    if (user) {
      onlineUsers.delete(socket.id);
      users.delete(socket.id);

      // Notify all clients about user leaving
      io.emit('user_left', {
        username: user.username,
        onlineCount: onlineUsers.size
      });

      console.log(`User disconnected: ${user.username}`);
    }

    console.log('Client disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
