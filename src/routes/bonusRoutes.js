const express = require('express');
const BonusController = require('../controllers/BonusController')
const router = express.Router()

router
	.get('/bonus', BonusController.showBonus)
	.get('/bonus/itens/:numbonus', BonusController.showItensByNumBonus)

module.exports = router
