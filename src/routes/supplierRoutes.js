const express = require('express');
const SupplierController = require('../controllers/SupplierController')

const router = express.Router();

router
	.get(`/supplier/code/:code`, SupplierController.showByCode)
	.get(`/supplier/:supplier`, SupplierController.showByName)

module.exports = router;
