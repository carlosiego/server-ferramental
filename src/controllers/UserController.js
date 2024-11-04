const client = require('../redis')
const UsersRepository = require('../repositories/UsersRepository')

class UserController {

	async showUsersWithRca(req, res) {

		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let usersFromCache = await client.get(fullUrl)

		if (usersFromCache) {
			return res.json(JSON.parse(usersFromCache))
		}

		let { metaData, rows} = await UsersRepository.findUsersWithRca()

		if(!rows.length) {
			await client.set(fullUrl, JSON.stringify({error: 'Usuários não encontrados'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Usuários não encontrados'})
		}

		let users = []

		rows.forEach(user => {
			let prop = {}
			user.forEach((value, index) => {
				prop[metaData[index].name] = value
			})
			users.push(prop)
		})

		await client.set(fullUrl, JSON.stringify(users), { EX: process.env.EXPIRATION })
		return res.json(users)
	}

	userIsActive(req, res) {
		let { username } = req.params

		username = username.toUpperCase()
		if(process.env.INVALID_USERS.includes(username)) {
			return res.status(401).json({
				message: 'Usuário não autorizado',
				isvalid: false
			})
		}

		return res.status(401).json({
			message: 'Usuário autorizado',
			isvalid: true
		})

	}
}

module.exports = new UserController()
