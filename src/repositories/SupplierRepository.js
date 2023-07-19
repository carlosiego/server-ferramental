const executeQuery = require('../database/executeQuery')

class SupplierRepository {

	async findByCode(code) {

		let supplier = executeQuery(`
			SELECT
				PCFORNEC.CODFORNEC AS CÓDIGO,
				PCFORNEC.FORNECEDOR,
				PCFORNEC.CGC AS CNPJ,
				PCFORNEC.FANTASIA
			FROM PCFORNEC
			WHERE PCFORNEC.CODFORNEC = :code
		`, { code })


		return supplier;
	}

	async findByName(name) {

		name = name.toUpperCase()
		name = name.replaceAll(' ', '%')
		name = name.endsWith('%') ? name : name + '%'

		let result = executeQuery(`
		SELECT
			PCFORNEC.CODFORNEC AS CÓDIGO,
			PCFORNEC.FORNECEDOR,
			PCFORNEC.CGC AS CNPJ,
			PCFORNEC.FANTASIA
		FROM PCFORNEC
		WHERE PCFORNEC.FORNECEDOR LIKE :name
		`, {name})

		return result;
	}

	async findByCnpj(cnpj) {

		let supplier = executeQuery(`
			SELECT
				PCFORNEC.CODFORNEC AS CÓDIGO,
				PCFORNEC.FORNECEDOR,
				PCFORNEC.CGC AS CNPJ,
				PCFORNEC.FANTASIA
				FROM PCFORNEC
			WHERE PCFORNEC.CGC = :cnpj
		`, { cnpj })

		return supplier;
	}

}

module.exports = new SupplierRepository();
