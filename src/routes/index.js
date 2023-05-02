import express from 'express'
import products from './productsRoutes.js'

const routes = (app) =>{
    app.use(
        express.json(),
        products
    )
}

export default routes