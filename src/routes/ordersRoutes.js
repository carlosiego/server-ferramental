const express = require('express')
const OrderController = require('../controllers/OrderController')

const router = express.Router()

router
    .get(`/${process.env.SECRET_API}/orders/numberorder/:numberorder`, OrderController.showByNum)


module.exports = router