const registerOrderSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('join-order', ({ orderId }) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('join-user', ({ userId }) => {
      socket.join(`user:${userId}`);
    });
  });
};

const emitOrderUpdate = (io, order) => {
  io.to(`order:${order._id}`).emit('order-status-updated', order);
  io.to(`user:${order.user}`).emit('user-order-updated', order);
};

module.exports = { registerOrderSocket, emitOrderUpdate };
