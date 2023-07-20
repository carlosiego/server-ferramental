const express = require('express');
const ProductsController = require('../controllers/ProductController.js');

const router = express.Router();

router
	.get(`/products/code/:code`, ProductsController.showByCode)
	.get(`/products/description/:description`, ProductsController.showByDescription)
	.get(`/products/codebar/:codebar`, ProductsController.showByCodeBar)
	.get(`/products/codesection/:codesection`, ProductsController.showBySection)
	.get(`/products/promotions`, ProductsController.showPromotions)
	.get(`/products/estmin/supplier/code/:code`, ProductsController.showEstMinBySupplier)

module.exports = router;
