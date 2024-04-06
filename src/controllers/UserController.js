const client = require('../redis')
const UsersRepository = require('../repositories/UsersRepository')

class UserController {

	async showUsersWithRca(req, res) {

		let users = await UsersRepository.findUsersWithRca()

		return res.json({ users })
	}
}

module.exports = new UserController()
