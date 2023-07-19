const SupplierRepository = require('../repositories/SupplierRepository')

class SupplierController {

	async showByCode(req, res) {

		let { code } = req.params

		code = Number(code)

		if(!code) return res.status(400).json({error: 'Código tem que ser do tipo número'})

		let { metaData, rows} = await SupplierRepository.findByCode(code)

		if(!rows.length) return res.status(404).json({error: 'Fornecedor não encontrado'})

		let [row] = rows
		let supplier = {}

		row.forEach((item, index) => {
			supplier[metaData[index].name] = item
		})

		return res.json(supplier);

	}

	async showByName(req, res) {

		let { name } = req.params

		let { metaData, rows } = await SupplierRepository.findByName(name)

		if(!rows.length) return res.status(404).json({error: 'Fornecedor não encontrado'})

		let suppliers = []

		rows.forEach((item) => {
			let sup = {}
			item.forEach((value, index) => {
				sup[metaData[index].name] = value
			})
			suppliers.push(sup)
		})

		return res.json(suppliers)
	}

	async showByCnpj(req, res) {

		let { cnpj } = req.params

		let { metaData, rows } = await SupplierRepository.findByCnpj(cnpj)

		if(!rows.length) return res.status(404).json({error: 'Fornecedor não encontrado'})

		let [row] = rows
		let supplier = {}

		row.forEach((item, index) => {
			supplier[metaData[index].name] = item
		})

		return res.json(supplier)
	}


}

module.exports = new SupplierController()
