const executeQuery = require('../database/executeQuery')

class UsersRepository {

	async findUsersWithRca() {

		let users = await executeQuery(`
			SELECT CODUSUR, NOME FROM PCUSUARI WHERE BLOQUEIO = 'N' ORDER BY CODUSUR
		`)

		return users
	}

}

module.exports = new UsersRepository()
