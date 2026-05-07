const Joi = require('joi');

exports.createOrderSchema = Joi.object({
  orderId: Joi.string().required(),
  courierPartner: Joi.string().required(),
  pickupAddress: Joi.string().required(),
  deliveryAddress: Joi.string().required()
});

exports.bulkOrderSchema = Joi.object({
  orders: Joi.array().max(100).items(exports.createOrderSchema)
});