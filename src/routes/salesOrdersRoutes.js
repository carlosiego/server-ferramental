const express = require('express')
const SalesOrderController = require('../controllers/SalesOrderController')

const router = express.Router()

router
	.get(`/salesorders/numberorder/:numberorder`, SalesOrderController.showByNum)
	.get(`/salesorders/rca/:rca`, SalesOrderController.showByRca)
	.put(`/salesorders/numberorder/:numberorder`, SalesOrderController.modifyPositionOfTelemarketing)


module.exports = router
