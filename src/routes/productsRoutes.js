import express from 'express'
import productsController from '../controllers/productsController.js'

const router = express.Router()

router
    .get(`/${process.env.SECRET_API}/products/description/:description`, productsController.showProductsByDescription)
    .get(`/${process.env.SECRET_API}/products/code/:code`, productsController.showProductsByCode)

export default router