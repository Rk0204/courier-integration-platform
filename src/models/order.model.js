const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  courierPartner: String,
  courierOrderId: String,
  awbNumber: String,
  status: String,
  requestPayload: Object,
  responsePayload: Object
}, { timestamps: true });

module.exports = mongoose.model('Order', schema);