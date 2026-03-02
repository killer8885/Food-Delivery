const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const adminRoutes = require('./routes/adminRoutes');

const createApp = (io) => {
  const app = express();
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(helmet());
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('combined'));
  app.use(rateLimiter);

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/restaurants', restaurantRoutes);
  app.use('/api/v1/cart', cartRoutes);
  app.use('/api/v1/payments', paymentRoutes);
  app.use('/api/v1/orders', require('./routes/orderRoutes')(io));
  app.use('/api/v1/delivery', deliveryRoutes);
  app.use('/api/v1/admin', adminRoutes);

  app.use(errorHandler);
  return app;
};

module.exports = createApp;
