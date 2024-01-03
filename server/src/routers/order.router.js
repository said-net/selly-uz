const orderController = require('../controllers/order.controller');

module.exports = require('express').Router()
    .get('/get-stream/:id', orderController.getStream)
    .post('/create', orderController.createOrder)
    .post('/create-order-no-stream', orderController.createOrderNoStream)