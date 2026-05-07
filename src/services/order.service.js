const Order = require('../models/order.model');
const Tracking = require('../models/tracking.model');
const Factory = require('../couriers/courier.factory');
const queue = require('../queues/order.queue');

class Service {
  static async createOrder(data) {
    const exists = await Order.findOne({ orderId: data.orderId });
    if (exists) return exists;

    const courier = Factory.getCourier(data.courierPartner);
    const res = await courier.createOrder(data);

    const order = await Order.create({
      orderId: data.orderId,
      courierPartner: data.courierPartner,
      courierOrderId: res.courierOrderId,
      awbNumber: res.awb,
      status: res.status,
      requestPayload: data,
      responsePayload: res
    });

    await Tracking.create({
      orderId: data.orderId,
      status: res.status,
      rawPayload: res
    });

    return order;
  }

  static async trackOrder(orderId) {
    const order = await Order.findOne({ orderId });
    const courier = Factory.getCourier(order.courierPartner);
    return courier.trackOrder(order.awbNumber);
  }

  static async cancelOrder(orderId) {
    const order = await Order.findOne({ orderId });
    const courier = Factory.getCourier(order.courierPartner);
    return courier.cancelOrder(order.courierOrderId);
  }

  static async bulkCreate(orders) {
    const batchId = Date.now();
    for (const o of orders) {
      await queue.add('create', o);
    }
    return { batchId };
  }
}

module.exports = Service;
