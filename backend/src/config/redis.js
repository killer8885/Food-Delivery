const Redis = require('ioredis');
const env = require('./env');

let redisClient;
if (env.REDIS_URL) {
  redisClient = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });
  redisClient.on('error', () => {});
}

module.exports = redisClient;
