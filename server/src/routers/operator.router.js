const authConfig = require('../configs/auth.config');
const operatorController = require('../controllers/operator.controller');

module.exports = require('express').Router()
    .get('/get-navbar', authConfig.operator, operatorController.getNavbar)
    .get('/get-dashboard', authConfig.operator, operatorController.getDashboard)
    .get('/get-balance', authConfig.operator, operatorController.getBalance)
    .post('/create-payment', authConfig.operator, operatorController.createPayment)
    .get('/get-my-orders', authConfig.operator, operatorController.getMyOrders)
    .get('/get-new-orders', authConfig.operator, operatorController.getNewOrders)
    .get('/get-recontact-orders', authConfig.operator, operatorController.getRecontactOrders)
    .get('/get-success-orders', authConfig.operator, operatorController.getSuccessOrders)
    .get('/get-sended-orders', authConfig.operator, operatorController.getSendedOrders)
    .get('/get-rejected-orders', authConfig.operator, operatorController.getRejectedOrders)
    .get('/take-order/:_id', authConfig.operator, operatorController.takeOrder)

    // UPDATE STATUS
    .post('/set-status-success', authConfig.operator, operatorController.setStatusSuccess)
    .post('/set-status-recontact', authConfig.operator, operatorController.setStatusRecontact)
    .post('/set-status-archive', authConfig.operator, operatorController.setStatusArchive)
    .post('/set-status-copy', authConfig.operator, operatorController.setStatusCopy)
    // UPDATE COURIER STATUS & OPERATOR VERIFIED
    .post('/set-status-rejected-order', authConfig.operator, operatorController.setStatusRejectedOrder)