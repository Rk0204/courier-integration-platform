require('dotenv').config();

const mongoose = require('mongoose');
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const OrderService = require('../services/order.service');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected (worker)');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

(async () => {
  await connectDB();

  console.log('Worker started...');

  // 🔗 Redis connection (BullMQ compatible)
  const connection = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,   
    enableReadyCheck: false
  });

  const worker = new Worker(
    'orders',
    async (job) => {
      console.log('Processing job:', job.data);

      try {
        const result = await OrderService.createOrder(job.data);

        console.log('Order processed:', result.orderId);

        return result;
      } catch (err) {
        console.error('Error processing job:', err.message);
        throw err; // required for retry/failure
      }
    },
    { connection }
  );

  worker.on('active', (job) => {
    console.log(`Job active: ${job.id}`);
  });

  worker.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job failed: ${job?.id}`, err.message);
  });

  worker.on('error', (err) => {
    console.error('Worker error:', err);
  });
})();