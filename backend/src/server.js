const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const env = require('./config/env');
const createApp = require('./app');
const { registerOrderSocket } = require('./sockets/orderSocket');
const logger = require('./utils/logger');

(async () => {
  await connectDB();
  const server = http.createServer();
  const io = new Server(server, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });
  registerOrderSocket(io);
  const app = createApp(io);
  server.on('request', app);

  server.listen(env.PORT, () => logger.info(`Server running on ${env.PORT}`));
})();
