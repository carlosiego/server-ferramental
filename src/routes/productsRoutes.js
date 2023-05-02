import express from 'express'
import productsController from '../controllers/productsController.js'

const router = express.Router()

router
    .get('/products/description/:description', productsController.showProductsByDescription)
    .get('/products/code/:code', productsController.showProductsByCode)

export default router