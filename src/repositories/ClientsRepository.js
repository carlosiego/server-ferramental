const executeQuery = require('../database/executeQuery');

class ProductsRepository {

	async findByCodcli(codcli) {

		let client = executeQuery(`
			SELECT
			CODCLI,
			CLIENTE,
			FANTASIA,
			ENDERENT,
			BAIRROENT,
			TELENT,
			MUNICENT,
			ESTENT,
			CEPENT,
			CGCENT,
			IEENT,
			DTULTCOMP,
			BLOQUEIO
			OBS,
			OBS2,
			OBS3,
			OBS4,
			OBS5,
			CODCOB,
			DTBLOQ,
			EMAIL,
			NVL(REGEXP_SUBSTR(DIRETORIOCLIENTE, '[^\\]+$'), 'not-found.png') AS DIRETORIOCLIENTE
			FROM PCCLIENT
			WHERE CODCLI = :codcli`, { codcli }
		)

		return client;

	}

	async findByNameOrFantasy(nameorfantasy, orderBy = 'ASC') {

		nameorfantasy = nameorfantasy.toUpperCase()
		nameorfantasy = nameorfantasy.replaceAll(' ', '%')
		nameorfantasy = nameorfantasy.endsWith('%') ? nameorfantasy : nameorfantasy + '%'

		let direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

		let clients = await executeQuery(`
			SELECT
				CODCLI,
				CLIENTE,
				FANTASIA,
				ENDERENT,
				BAIRROENT,
				TELENT,
				MUNICENT,
				ESTENT,
				CEPENT,
				CGCENT,
				IEENT,
				DTULTCOMP,
				BLOQUEIO
				OBS,
				OBS2,
				OBS3,
				OBS4,
				OBS5,
				CODCOB,
				DTBLOQ,
				EMAIL,
				NVL(REGEXP_SUBSTR(DIRETORIOCLIENTE, '[^\\]+$'), 'not-found.png') AS DIRETORIOCLIENTE
			FROM PCCLIENT
			WHERE CLIENTE LIKE :nameorfantasy OR FANTASIA LIKE :nameorfantasy
			ORDER BY CLIENTE ${direction}
		`, { nameorfantasy })

		return clients;

	}
}

module.exports = new ProductsRepository();
