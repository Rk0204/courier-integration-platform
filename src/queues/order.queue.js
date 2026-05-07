const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

module.exports = new Queue('orders', { connection });