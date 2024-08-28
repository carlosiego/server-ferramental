const express = require('express')
const ClientController = require('../controllers/ClientController')

const router = express.Router();

router
	.get('/clients/nameorfantasy/:nameorfantasy', ClientController.showByNameOrFantasy)

module.exports = router;
