const executeQuery = require('../database/executeQuery');

class ProductsRepository {

	async findByNameOrFantasy(nameorfantasy, orderBy = 'ASC') {

		nameorfantasy = nameorfantasy.toUpperCase()
		nameorfantasy = nameorfantasy.replaceAll(' ', '%')
		nameorfantasy = nameorfantasy.endsWith('%') ? nameorfantasy : nameorfantasy + '%'

		let direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

		let clients = await executeQuery(`
			SELECT * FROM PCCLIENT
			WHERE CLIENTE LIKE :nameorfantasy OR FANTASIA LIKE :nameorfantasy
			ORDER BY CLIENTE ${direction}
		`, { nameorfantasy })

		return clients;

	}

}

module.exports = new ProductsRepository();
