// testRedis.js
const redis = require('../config/redis');

(async () => {
  await redis.set('test_key', 'hello');
  const value = await redis.get('test_key');
  console.log(value);
})();