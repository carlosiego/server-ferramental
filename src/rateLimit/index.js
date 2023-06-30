const rateLimit = require('express-rate-limit')


const limiter = rateLimit({
	windows: 60 * 60 * 1000, // 1 hour
	max: 150,
	message: 'Limite de solicitações excedido'

})

module.exports = limiter
