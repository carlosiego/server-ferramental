const express = require('express');
const SupplierController = require('../controllers/SupplierController')

const router = express.Router();

router
	.get(`/supplier/code/:code`, SupplierController.showByCode)
	.get(`/supplier/name/:name`, SupplierController.showByName)
	.get(`/supplier/cnpj/:cnpj`, SupplierController.showByCnpj)

module.exports = router;
