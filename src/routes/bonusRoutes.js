const express = require('express');
const BonusController = require('../controllers/BonusController')
const router = express.Router()

router
	.get('/bonus', BonusController.showBonus)

module.exports = router
