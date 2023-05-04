const express = require('express')
const productsController = require('../controllers/productsController.js')

const router = express.Router()

router
    .get(`/${process.env.SECRET_API}/products/description/:description`, productsController.showProductsByDescription)
    .get(`/${process.env.SECRET_API}/products/code/:code`, productsController.showProductsByCode)

module.exports = router