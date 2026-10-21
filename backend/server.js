require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db.js');
const errorHandler = require('./middlewares/errorHandler.js');
const logger = require('./utils/logger.js');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 2000,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Hospital Management System API v1 Running.' });
});

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes.js'));
app.use('/api/v1', require('./routes/appointmentRoutes.js'));
app.use('/api/v1', require('./routes/recordsRoutes.js'));
app.use('/api/v1', require('./routes/billingRoutes.js'));
app.use('/api/v1', require('./routes/notificationRoutes.js'));
app.use('/api/v1', require('./routes/patientRoutes.js'));
app.use('/api/v1', require('./routes/doctorRoutes.js'));
app.use('/api/v1', require('./routes/adminRoutes.js'));
app.use('/api/v1', require('./routes/chatRoutes.js'));
app.use('/api/v1', require('./routes/aiRoutes.js'));
app.use(errorHandler);

// Socket.io Authentication Middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication token missing'));

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    next(new Error('Authentication failed'));
  }
});

// Socket.io Event Handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id} (userId: ${socket.userId})`);

  socket.join(socket.userId);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    logger.info(`User joined room: ${roomId}`);
  });

  // ===== Chat events =====
  socket.on('send_message', async (data) => {
    try {
      const Message = require('./models/Message.js');
      const { conversationId, text, receiverId } = data;

      const message = await Message.create({
        conversation: conversationId,
        sender: socket.userId,
        text,
      });

      const payload = {
        _id: message._id,
        conversationId,
        text: message.text,
        senderId: socket.userId,
        createdAt: message.createdAt,
      };

      io.to(socket.userId).to(receiverId).emit('receive_message', payload);
    } catch (err) {
      logger.error(`send_message error: ${err.message}`);
      socket.emit('message_error', { message: 'Could not send message.' });
    }
  });

  socket.on('typing', ({ receiverId, conversationId }) => {
    io.to(receiverId).emit('user_typing', { conversationId, userId: socket.userId });
  });

  socket.on('stop_typing', ({ receiverId, conversationId }) => {
    io.to(receiverId).emit('user_stop_typing', { conversationId, userId: socket.userId });
  });

  // ===== Video Call (WebRTC signaling) events =====
  // These just relay signaling data between two peers — no media
  // passes through the server, only connection-setup metadata.

  socket.on('call_user', ({ receiverId, offer, callerName, appointmentId }) => {
    io.to(receiverId).emit('incoming_call', {
      callerId: socket.userId,
      callerName,
      offer,
      appointmentId,
    });
  });

  socket.on('answer_call', ({ callerId, answer }) => {
    io.to(callerId).emit('call_answered', { answer });
  });

  socket.on('ice_candidate', ({ receiverId, candidate }) => {
    io.to(receiverId).emit('ice_candidate', { candidate, from: socket.userId });
  });

  socket.on('reject_call', ({ callerId }) => {
    io.to(callerId).emit('call_rejected');
  });

  socket.on('end_call', ({ receiverId }) => {
    io.to(receiverId).emit('call_ended');
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  logger.info(`HMS Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});