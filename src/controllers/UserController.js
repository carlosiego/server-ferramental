const client = require('../redis')
const UsersRepository = require('../repositories/UsersRepository')

class UserController {

	async showUsersWithRca(req, res) {

		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let usersFromCache = await client.get(fullUrl)

		if (usersFromCache) {
			return res.json(JSON.parse(usersFromCache))
		}

		let { rows: users } = await UsersRepository.findUsersWithRca()

		if(!users?.length) {
			await client.set(fullUrl, JSON.stringify({error: 'Usuários não encontrados'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Usuários não encontrados'})
		}

		await client.set(fullUrl, JSON.stringify(users), { EX: process.env.EXPIRATION })
		return res.json(users)
	}

	async userIsActive(req, res) {
		let { username } = req.params

		username = username.toUpperCase()

		if(process.env.INVALID_USERS.includes(username)) {
			return res.status(401).json({
				message: 'Usuário não autorizado',
				isvalid: false,
				codUser: 0
			})
		}

		let codUser = await UsersRepository.findUser({username})

		if(!codUser) {
			return res.status(404).json({
				message: 'Usuário não encontrado',
				isvalid: false,
				codUser: 0
			})
		}

		return res.json({
			message: 'Usuário autorizado',
			isvalid: true,
			codUser
		})

	}
}

module.exports = new UserController()
