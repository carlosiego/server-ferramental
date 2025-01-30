const express = require('express');
const router = express.Router();
const PrintController = require('../controllers/PrintController');

router
	.post('/print/withprice', PrintController.printWithPrice)
	.post('/print/withoutprice', PrintController.printWithoutPrice)

module.exports = router
