const authConfig = require('../configs/auth.config');
const supplierController = require('../controllers/supplier.controller');

module.exports = require('express').Router()
    .get('/get-navbar', authConfig.supplier, supplierController.getNavbar)
    .get('/get-dashboard', authConfig.supplier, supplierController.getDashboard)
    .post('/create-product', authConfig.supplier, supplierController.createProduct)
    .get('/get-products', authConfig.supplier, supplierController.getProducts)
    // 
    .get('/get-orders/:status', authConfig.supplier, supplierController.getOrders)
    .get('/get-balance', authConfig.seller, supplierController.getBalance)
    .post('/create-payment', authConfig.seller, supplierController.createPayment)