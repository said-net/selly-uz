const authConfig = require('../configs/auth.config');
const sellerController = require('../controllers/seller.controller');

module.exports = require('express').Router()
    .get('/get-dashboard', authConfig.seller, sellerController.getDashboard)
    .get('/get-market', authConfig.seller, sellerController.getMarket)
    .post('/create-stream', authConfig.seller, sellerController.createStream)
    .get('/get-streams', authConfig.seller, sellerController.getStreams)
    .delete('/delete-stream/:_id', authConfig.seller, sellerController.deleteStream)
    .post('/set-telegram', authConfig.seller, sellerController.setTelegram)
    .get('/get-creative/:_id', authConfig.seller, sellerController.getCreative)
    .get('/get-stats', authConfig.seller, sellerController.getStats)
    .get('/get-balance', authConfig.seller, sellerController.getBalance)
    .post('/create-payment', authConfig.seller, sellerController.createPayment)
    .get('/get-orders/:page', authConfig.seller, sellerController.getOrders)
    .get('/get-market-place/:id', authConfig.seller, sellerController.getMarketPlace)