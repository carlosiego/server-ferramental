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

		let { metaData, rows} = await SupplierRepository.findByCode(code)

		if(!rows.length) {
			await client.set(fullUrl, JSON.stringify({error: 'Fornecedor não encontrado'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Fornecedor não encontrado'})
		}

		let [row] = rows
		let supplier = {}

		row.forEach((item, index) => {
			supplier[metaData[index].name] = item
		})
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

		let { metaData, rows } = await SupplierRepository.findByName(name)

		if(!rows.length) {
			await client.set(fullUrl, JSON.stringify({error: 'Fornecedor não encontrado'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Fornecedor não encontrado'})
		}

		let suppliers = []

		rows.forEach((item) => {
			let sup = {}
			item.forEach((value, index) => {
				sup[metaData[index].name] = value
			})
			suppliers.push(sup)
		})
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

		let { metaData, rows } = await SupplierRepository.findByCnpj(cnpj)

		if(!rows.length) {
			await client.set(fullUrl, JSON.stringify({error: 'Fornecedor não encontrado'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Fornecedor não encontrado'})
		}

		let [row] = rows
		let supplier = {}

		row.forEach((item, index) => {
			supplier[metaData[index].name] = item
		})
		await client.set(fullUrl, JSON.stringify(supplier), { EX: process.env.EXPIRATION})
		return res.json(supplier)
	}

	async showByFantasy(req, res) {

		let { fantasy } = req.params

		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let supplierFromCache = await client.get(fullUrl)
		if (supplierFromCache) {
			return res.json(JSON.parse(supplierFromCache))
		}

		let { metaData, rows } = await SupplierRepository.findByFantasy(fantasy)

		if(!rows.length) {
			await client.set(fullUrl, JSON.stringify({error: 'Fornecedor não encontrado'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Fornecedor não encontrado'})
		}

		let suppliers = []

		rows.forEach((item) => {
			let sup = {}
			item.forEach((value, index) => {
				sup[metaData[index].name] = value
			})
			suppliers.push(sup)
		})
		await client.set(fullUrl, JSON.stringify(suppliers), { EX: process.env.EXPIRATION})
		return res.json(suppliers)
	}

}

module.exports = new SupplierController()
