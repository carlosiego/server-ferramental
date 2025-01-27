const express = require('express');
const router = express.Router()
const PrintController = require('../controllers/PrintController')

router
	.post('/print', PrintController.print)

module.exports = router
