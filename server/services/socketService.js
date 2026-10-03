let io;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('join_order', (orderId) => {
      if (orderId) {
        socket.join(`order_${orderId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room order_${orderId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const notifyOrderUpdate = (orderId, orderData) => {
  if (io) {
    io.to(`order_${orderId}`).emit('order_status_updated', orderData);
    io.emit('global_order_update', orderData); // General broadcast for seller/admin live feeds
    console.log(`[Socket.IO] Emitted status update for order: ${orderId}`);
  }
};

module.exports = { initSocket, notifyOrderUpdate };
