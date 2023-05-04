const express = require('express')
const products = require('./productsRoutes.js')

const routes = (app) =>{
    app.use(
        express.json(),
        products
    )
}

module.exports = routes