const express = require('express');
const AddressController = require('../controllers/AddressController.js');

const router = express.Router();

router
	.get(`/addresses`, AddressController.showAllAddresses)
	.get(`/address`, AddressController.showAddress)
	.put(`/address/:code`, AddressController.bindAddress)

module.exports = router;
