const authConfig = require('../configs/auth.config');
const categoryController = require('../controllers/category.controller');

module.exports = require('express').Router()
    .get('/get-all-to-admin', authConfig.admin, categoryController.getAllToAdmin)
    .post('/create', authConfig.admin, categoryController.create)
    .put('/edit-title', authConfig.admin, categoryController.editTitle)
    .put('/edit-image', authConfig.admin, categoryController.editImage)
    .put('/edit-color', authConfig.admin, categoryController.editColor)
    .put('/set-active', authConfig.admin, categoryController.setActive)
    // 
    .get('/get-all', categoryController.getAll)