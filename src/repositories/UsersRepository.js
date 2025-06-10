const executeQuery = require('../database/executeQuery')

class UsersRepository {

	async findUser({ username}) {

		let codUser = await executeQuery(`
			SELECT MATRICULA FROM PCEMPR WHERE NOME_GUERRA = :username
		`, { username })

		return codUser?.rows.length > 0 ? codUser?.rows[0]?.MATRICULA : null
	}

	async findUsersWithRca() {

		let users = await executeQuery(`
			SELECT CODUSUR, NOME, NVL(USURDIRFV, 'not-found.png') AS USURDIRFV FROM PCUSUARI WHERE BLOQUEIO = 'N' ORDER BY CODUSUR
		`)

		return users
	}

}

module.exports = new UsersRepository()
