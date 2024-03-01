const express = require('express')
const SalesOrderController = require('../controllers/SalesOrderController')

const router = express.Router()

router
	.get(`/salesorders/numberorder/:numberorder`, SalesOrderController.showByNum)
	.put(`/salesorders/numberorder/:numberorder`, SalesOrderController.changePosition)


module.exports = router
