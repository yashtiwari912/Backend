import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../config/redisClient.js';

// Wrap the Redis command executor for compatibility with rate-limit-redis
const redisCommand = async (...args) => {
  return await redisClient.sendCommand(args);
};

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: redisCommand,
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    message: 'Too many requests from this IP, please try again after a minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
