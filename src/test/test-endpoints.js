require('dotenv').config();

const axios = require('axios');

(async () => {
  try {
    const auth = await axios.post(
      'https://uat.urbanebolt.in/api/v1/auth/getToken/',
      {
        username: process.env.UB_USERNAME,
        password: process.env.UB_PASSWORD
      }
    );

    const token = auth.data.access_token;

    console.log('TOKEN GENERATED');

    const endpoints = [
      '/services/manifest/',
      '/services/order/',
      '/services/create-order/',
      '/services/shipment/',
      '/services/shipments/'
    ];

    for (const ep of endpoints) {
      try {
        console.log(`\n Testing: ${ep}`);

        const res = await axios.get(
          `https://uat.urbanebolt.in/api/v1${ep}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('EXISTS:', ep);
      } catch (err) {
        console.log(
          `${ep}`,
          err.response?.status,
          err.response?.statusText
        );
      }
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
})();