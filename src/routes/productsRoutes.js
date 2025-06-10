const express = require('express');
const ProductsController = require('../controllers/ProductController.js');

const router = express.Router();

router
	.get(`/products/code/:code`, ProductsController.showByCode)
	.get(`/products/description/:description`, ProductsController.showByDescription)
	.get(`/products/minimum/description/:description`, ProductsController.showMinimumByDescription)
	.get(`/products/codebar/:codebar`, ProductsController.showByCodeBar)
	.get(`/products/minimum/codebar/:codebar`, ProductsController.showMinimumByCodeBar)
	.get(`/products/codesection/:codesection`, ProductsController.showBySection)
	.get(`/products/minimum/codesection/:codesection`, ProductsController.showMinimumBySection)
	.get(`/products/promotions`, ProductsController.showPromotions)
	.get(`/products/supplier/code/:code`, ProductsController.showBySupplier)
	.get(`/products/morecodaux/code/:code`, ProductsController.showMoreCodAuxiliar)

module.exports = router;
