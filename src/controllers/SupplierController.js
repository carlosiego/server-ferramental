const SupplierRepository = require('../repositories/SupplierRepository')
const client = require('../redis')

class SupplierController {

	async showByCode(req, res) {

		let { code } = req.params

		code = Number(code)

		if(!code) return res.status(400).json({error: 'Código tem que ser do tipo número'})

		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let supplierFromCache = await client.get(fullUrl)
		if (supplierFromCache) {
			return res.json(JSON.parse(supplierFromCache))
		}

		let { rows: [ supplier ] } = await SupplierRepository.findByCode(code)

		if(!supplier) {
			await client.set(fullUrl, JSON.stringify({error: 'Fornecedor não encontrado'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Fornecedor não encontrado'})
		}

		await client.set(fullUrl, JSON.stringify(supplier), { EX: process.env.EXPIRATION })
		return res.json(supplier);

	}

	async showByName(req, res) {

		let { name } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let supplierFromCache = await client.get(fullUrl)

		if (supplierFromCache) {
			return res.json(JSON.parse(supplierFromCache))
		}

		let { rows: suppliers } = await SupplierRepository.findByName(name)

		if(!suppliers.length) {
			await client.set(fullUrl, JSON.stringify({error: 'Fornecedor não encontrado'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Fornecedor não encontrado'})
		}

		await client.set(fullUrl, JSON.stringify(suppliers), { EX: process.env.EXPIRATION })
		return res.json(suppliers)
	}

	async showByCnpj(req, res) {

		let { cnpj } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let supplierFromCache = await client.get(fullUrl)

		if (supplierFromCache) {
			return res.json(JSON.parse(supplierFromCache))
		}

		let { rows: [supplier] } = await SupplierRepository.findByCnpj(cnpj)

		if(!supplier) {
			await client.set(fullUrl, JSON.stringify({error: 'Fornecedor não encontrado'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Fornecedor não encontrado'})
		}

		await client.set(fullUrl, JSON.stringify(supplier), { EX: process.env.EXPIRATION})
		res.json(supplier)
	}

	async showByFantasy(req, res) {

		let { fantasy } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let supplierFromCache = await client.get(fullUrl)

		if (supplierFromCache) {
			return res.json(JSON.parse(supplierFromCache))
		}

		let { rows: suppliers } = await SupplierRepository.findByFantasy(fantasy)

		if(!suppliers.length) {
			await client.set(fullUrl, JSON.stringify({error: 'Fornecedor não encontrado'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Fornecedor não encontrado'})
		}

		await client.set(fullUrl, JSON.stringify(suppliers), { EX: process.env.EXPIRATION})
		return res.json(suppliers)
	}

}

module.exports = new SupplierController()
