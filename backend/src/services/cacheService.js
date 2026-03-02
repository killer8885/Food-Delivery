const redis = require('../config/redis');

const getCache = async (key) => {
  if (!redis) return null;
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
};

const setCache = async (key, value, ttl = 60) => {
  if (!redis) return;
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
};

module.exports = { getCache, setCache };
