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

	async findByName(supplier) {

		supplier = supplier.toUpperCase()
		supplier = supplier.replaceAll(' ', '%')
		supplier = supplier.endsWith('%') ? supplier : supplier + '%'

		let result = executeQuery(`
		SELECT
			PCFORNEC.CODFORNEC AS CÓDIGO,
			PCFORNEC.FORNECEDOR,
			PCFORNEC.CGC AS CNPJ,
			PCFORNEC.FANTASIA
		FROM PCFORNEC
		WHERE PCFORNEC.FORNECEDOR LIKE :supplier
		`, {supplier})

		return result;
	}
}

module.exports = new SupplierRepository();
