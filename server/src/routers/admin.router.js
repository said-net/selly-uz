const authConfig = require('../configs/auth.config');
const adminController = require('../controllers/admin.controller');

module.exports = require('express').Router()
    .get('/get-navbar', authConfig.admin, adminController.getNavbar)
    .get('/get-dashboard', authConfig.admin, adminController.getDashboard)
    .get('/get-suppliers', authConfig.admin, adminController.getSuppliers)
    .post('/block-user', authConfig.admin, adminController.blockUser)
    // 
    .post('/set-supplier', authConfig.admin, adminController.setSupplier)
    .post('/remove-supplier', authConfig.admin, adminController.removeSupplier)
    // 
    .post('/set-operator', authConfig.admin, adminController.setOperator)
    .post('/remove-operator', authConfig.admin, adminController.removeOperator)
    .post('/set-freedom-operator', authConfig.admin, adminController.setFreedomOperator)
    // 
    .post('/set-courier', authConfig.admin, adminController.setCourier)
    .post('/remove-courier', authConfig.admin, adminController.removeCourier)
    // 
    .get('/get-sellers', authConfig.admin, adminController.getSellers)
    .get('/get-operators', authConfig.admin, adminController.getOperators)
    .get('/get-couriers', authConfig.admin, adminController.getCouriers)
    .put('/set-region-courier', authConfig.admin, adminController.setRegionCourier)
    // 
    .get('/get-products', authConfig.admin, adminController.getProducts)
    .put('/set-active-product', authConfig.admin, adminController.setActiveProduct)
    .get('/get-product-info/:_id', authConfig.admin, adminController.getProductInfo)
    .put('/set-product-info', authConfig.admin, adminController.setProductInfo)
    // PRODUCTS
    .get('/get-product-media/:_id', authConfig.admin, adminController.getProductMedia)
    .put('/edit-product-image', authConfig.admin, adminController.editProductImage)
    .delete('/delete-product-image/:_id/:index', authConfig.admin, adminController.deleteProductImage)
    .put('/edit-product-main-image', authConfig.admin, adminController.editProductMainImage)
    .post('/add-product-image', authConfig.admin, adminController.addProductImage)
    .put('/edit-product-video', authConfig.admin, adminController.editProductVideo)
    .post('/verify-product', authConfig.admin, adminController.verifyProduct)
    .post('/reject-product', authConfig.admin, adminController.rejectProduct)
    // ORDERS
    .get('/get-new-orders', authConfig.admin, adminController.getNewOrders)
    .get('/get-in-operator-orders', authConfig.admin, adminController.getInOperatorOrders)
    .get('/get-recontact-orders', authConfig.admin, adminController.getRecontactOrders)
    .get('/get-sended-orders', authConfig.admin, adminController.getSendedOrders)
    .get('/get-delivered-orders', authConfig.admin, adminController.getDeliveredOrders)
    .get('/get-rejected-orders', authConfig.admin, adminController.getRejectedOrders)
    .get('/get-archived-orders/:page', authConfig.admin, adminController.getArchivedOrders)
    .get('/get-history-orders/:page', authConfig.admin, adminController.getHistoryOrders)
    .get('/search-order/:type/:param', authConfig.admin, adminController.searchOrder)
    .get('/get-parties', authConfig.admin, adminController.getParties)
    .get('/get-party-orders/:id', authConfig.admin, adminController.getPartyOrders)
    .get('/get-success-orders', authConfig.admin, adminController.getSuccessOrders)
    .get('/get-cheques/:page', authConfig.admin, adminController.getCheques)
    // 
    .post('/set-status-to-orders', authConfig.admin, adminController.setStatusToOrders)
    .post('/set-operator-to-orders', authConfig.admin, adminController.setOperatorToOrders)
    .post('/set-courier-to-orders', authConfig.admin, adminController.setCourierToOrders)
    // 
    .put('/edit-party', authConfig.admin, adminController.editParty)
    .put('/edit-info-order', authConfig.admin, adminController.editInfoOrder)
    // 
    .get('/get-payments', authConfig.admin, adminController.getPayments)
    .post('/set-status-payment', authConfig.admin, adminController.setStatusPayment)