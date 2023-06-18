const express = require('express');
const ProductsController = require('../controllers/ProductController.js');

const router = express.Router();

router
    .get(`/${process.env.SECRET_API}/products/code/:code`, ProductsController.showByCode)
    .get(`/${process.env.SECRET_API}/products/description/:description`, ProductsController.showByDescription)
    .get(`/${process.env.SECRET_API}/products/codebar/:codebar`, ProductsController.showByCodeBar)


module.exports = router;