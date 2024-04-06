const express = require('express');
const UserController = require('../controllers/UserController')

const router = express.Router()

router
	.get('/users/rca', UserController.showUsersWithRca)

module.exports = router
