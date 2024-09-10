const executeQuery = require('../database/executeQuery')

class UsersRepository {

	async findUsersWithRca() {

		let users = await executeQuery(`
			SELECT CODUSUR, NOME, NVL(USURDIRFV, 'not-found.png') AS USURDIRFV FROM PCUSUARI WHERE BLOQUEIO = 'N' ORDER BY CODUSUR
		`)

		return users
	}

}

module.exports = new UsersRepository()
