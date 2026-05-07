require('dotenv').config();

const client = require('../couriers/urbanbolt/urbanbolt.client');

(async () => {
  try {
    const token = await client.authenticate();

    console.log('TOKEN:', token);
  } catch (err) {
    console.error(
      'AUTH FAILED:',
      err.response?.data || err.message
    );
  }
})();