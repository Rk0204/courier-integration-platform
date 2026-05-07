const client = require('./urbanbolt.client');
const mapper = require('./urbanbolt.mapper');

class UrbaneBoltAdapter {
  async createOrder(data) {
    try {
      const payload = mapper.toCourier(data);

      console.log(
        'URBANEBOLT PAYLOAD:',
        JSON.stringify(payload, null, 2)
      );

      const response = await client.request({
        method: 'POST',
        url: '/services/manifest/',
        data: payload
      });

      console.log(
        'URBANEBOLT RESPONSE:',
        response.data
      );

      return mapper.toInternal(response.data);
    } catch (err) {
      console.error(
        'Create order failed:',
        err.response?.data || err.message
      );

      throw err;
    }
  }

  async trackOrder(awb) {
    try {
      const response = await client.request({
        method: 'GET',
        url: `/services/shipments/?awb=${awb}`
      });

      return response.data;
    } catch (err) {
      console.error(
        'Tracking failed:',
        err.response?.data || err.message
      );

      throw err;
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await client.request({
        method: 'POST',
        url: '/services/cancel/',
        data: {
          orderNumber: orderId
        }
      });

      return response.data;
    } catch (err) {
      console.error(
        ' Cancel failed:',
        err.response?.data || err.message
      );

      throw err;
    }
  }
}

module.exports = UrbaneBoltAdapter;