const authConfig = require('../configs/auth.config');
const courierController = require('../controllers/courier.controller');

module.exports = require('express').Router()
    .get('/get-navbar', authConfig?.courier, courierController?.getNavbar)
    .get('/get-dashboard', authConfig?.courier, courierController?.getDashboard)
    .get('/get-balance', authConfig.courier, courierController.getBalance)
    .post('/create-payment', authConfig.courier, courierController.createPayment)
    .get('/get-my-orders', authConfig.courier, courierController.getMyOrders)
    .get('/get-recontact-orders', authConfig.courier, courierController.getRecontactOrders)
    .get('/get-rejected-orders', authConfig.courier, courierController.getRejectedOrders)
    .get('/get-delivered-orders', authConfig.courier, courierController.getDeliveredOrders)
    .get('/get-parties', authConfig.courier, courierController.getParties)
    .get('/get-party-orders/:id', authConfig.courier, courierController.getPartyOrders)
    .post('/set-status-to-order', authConfig.courier, courierController.setStatusToOrder)
