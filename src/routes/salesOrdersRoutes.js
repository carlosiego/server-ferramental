const express = require('express')
const SalesOrderController = require('../controllers/SalesOrderController')

const router = express.Router()

router
    .get(`/${process.env.SECRET_API}/salesorders/numberorder/:numberorder`, SalesOrderController.showByNum)


module.exports = router