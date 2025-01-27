const express = require('express');
const UserController = require('../controllers/UserController')
const router = express.Router()

router
	.get('/users/rca', UserController.showUsersWithRca)
	.get('/user/isactive/:username', UserController.userIsActive)
	.get('/user/isactive/:username', UserController.userIsActive)

module.exports = router
