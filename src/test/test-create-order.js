require('dotenv').config();

const UrbaneBoltAdapter = require('../couriers/urbanbolt/urbanbolt.adapter');

(async () => {
  try {
    const adapter = new UrbaneBoltAdapter();

    const result = await adapter.createOrder({
      orderId: `TEST-${Date.now()}`,

      paymentType: 'COD',
      collectableValue: 100,
      customerName: 'Roshan Kumar',
      customerPhone: 9999999999,
      customerEmail: 'customer@test.com',

      deliveryAddress:
        'Delhi Sector 21',

      deliveryCity: 'Delhi',

      deliveryState: 'DL',

      deliveryPincode: 110001
    });

    console.log(
      'ORDER CREATED:',
      JSON.stringify(result, null, 2)
    );
  } catch (err) {
    console.error(
      'ORDER FAILED:',
      err.response?.data || err.message
    );
  }
})();