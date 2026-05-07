require('dotenv').config();

const axios = require('axios');

class UrbaneBoltClient {
  constructor() {
    this.baseURL = process.env.UB_BASE_URL;
    this.username = process.env.UB_USERNAME;
    this.password = process.env.UB_PASSWORD;

    this.token = null;
  }

  async authenticate() {
    try {
      const response = await axios.post(
        `${this.baseURL}/auth/getToken/`,
        {
          username: this.username,
          password: this.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('AUTH RESPONSE:', response.data);

      this.token =
  response.data.access_token ||
  response.data.token ||
  response.data.access ||
  response.data.data?.token;

      console.log('✅ UrbaneBolt token generated');

      return this.token;
    } catch (err) {
      console.error(
        'UrbaneBolt auth failed:',
        err.response?.data || err.message
      );

      throw err;
    }
  }

  //Generic request
  async request(config) {
    try {
      // generate token if missing
      if (!this.token) {
        await this.authenticate();
      }

      return await axios({
        baseURL: this.baseURL,
        ...config,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          ...(config.headers || {})
        }
      });
    } catch (err) {
      // retry once on 401
      if (err.response?.status === 401) {
        console.log('🔄 Token expired, regenerating...');

        await this.authenticate();

        return axios({
          baseURL: this.baseURL,
          ...config,
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            ...(config.headers || {})
          }
        });
      }

      console.error(
        'UrbaneBolt API error:',
        err.response?.data || err.message
      );

      throw err;
    }
  }
}

module.exports = new UrbaneBoltClient();