const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error({ message: err.message, stack: err.stack });
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
};
