const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  orderId: String,
  status: String,
  rawPayload: Object,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tracking', schema);