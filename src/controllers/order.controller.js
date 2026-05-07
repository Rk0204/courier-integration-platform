const Service = require('../services/order.service');

exports.createOrder = async (req, res, next) => {
  try {
    res.json(await Service.createOrder(req.body));
  } catch (e) { next(e); }
};

exports.trackOrder = async (req, res, next) => {
  try {
    res.json(await Service.trackOrder(req.params.orderId));
  } catch (e) { next(e); }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    res.json(await Service.cancelOrder(req.params.orderId));
  } catch (e) { next(e); }
};

exports.bulkCreate = async (req, res, next) => {
  try {
    res.json(await Service.bulkCreate(req.body.orders));
  } catch (e) { next(e); }
};