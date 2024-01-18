const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order_controller');

router.get('/', orderController.getAllOrder);
router.route('/:art_id/order')
    .post(orderController.createOrder)

// api/orders/mine
router.get('/mine', orderController.getMine);

// api/orders/:order_id
router.route('/:order_id')
    .get(orderController.getOrderById)
    .post((req, res) => res.status(405).json({ message: 'Method not allowed' }))
    .put((req, res) => res.status(405).json({ message: 'Method not allowed' }))
    .delete(orderController.deleteOrder);

router.put('/:order_id/pay', orderController.updateOrderToPaid);
router.put('/:order_id/deliver', orderController.updateOrderToDelivered);

module.exports = router;