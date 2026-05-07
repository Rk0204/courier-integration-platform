const router = require('express').Router();
const ctrl = require('../controllers/order.controller');

const validate = require('../middlewares/validate.middlewares');
const {
  createOrderSchema,
  bulkOrderSchema
} = require('../validators/order.validator');

router.post('/', validate(createOrderSchema), ctrl.createOrder);
router.get('/:orderId/track', ctrl.trackOrder);
router.post('/:orderId/cancel', ctrl.cancelOrder);
router.post('/bulk', validate(bulkOrderSchema), ctrl.bulkCreate);

module.exports = router;