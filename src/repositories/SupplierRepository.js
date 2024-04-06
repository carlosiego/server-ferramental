const executeQuery = require('../database/executeQuery')

class SupplierRepository {

	async findByCode(code) {

		let supplier = await executeQuery(`
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

		let result = await executeQuery(`
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

		let supplier = await executeQuery(`
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

	async findByFantasy(fantasy) {

		fantasy = fantasy.toUpperCase()
		fantasy = fantasy.replaceAll(' ', '%')
		fantasy = fantasy.endsWith('%') ? fantasy : fantasy + '%'

		let result = await executeQuery(`
		SELECT
			PCFORNEC.CODFORNEC AS CÓDIGO,
			PCFORNEC.FORNECEDOR,
			PCFORNEC.CGC AS CNPJ,
			PCFORNEC.FANTASIA
		FROM PCFORNEC
		WHERE PCFORNEC.FANTASIA LIKE :fantasy
		`, {fantasy})

		return result;
	}

}

module.exports = new SupplierRepository();
