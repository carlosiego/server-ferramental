const express = require('express')
const SalesOrderController = require('../controllers/SalesOrderController')

const router = express.Router()

router
	.get(`/salesorders/numberorder/:numberorder`, SalesOrderController.showByNum)
	.get(`/salesorders/numberorder/toconfer/:numberorder`, SalesOrderController.showByNumToConfer)
	.get(`/salesorders/rca/:rca`, SalesOrderController.showByRca)
	.put(`/salesorders/telemarketing/numberorder/:numberorder`, SalesOrderController.modifyPositionOfTelemarketingBtoL)
	.put(`/salesorders/balcaoreserva/numberorder/:numberorder`, SalesOrderController.modifyPositionOfBalcaoReservaBtoM)
	.put(`/salesorders/block/:numberorder`, SalesOrderController.blockSalesOrder)
	.put(`/salesorders/fix/:numberorder`, SalesOrderController.fixSalesOrder)

module.exports = router
