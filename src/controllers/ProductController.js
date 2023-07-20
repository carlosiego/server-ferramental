const ProductsRepository = require('../repositories/ProductsRepository.js');

class ProductsController {

	async showByCode(req, res) {

		let { code } = req.params

		let { metaData, rows } = await ProductsRepository.findByCode(code)
		let [row] = rows

		if (!row) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		let product = {}
		row.forEach((item, index) => {
			product[metaData[index].name] = item
		})

		res.json(product)
	}

	async showByDescription(req, res) {

		let { description } = req.params
		let { orderBy } = req.query

		let { metaData, rows } = await ProductsRepository.findByDescription(description, orderBy)

		let products = []

		rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[metaData[index].name] = value
			})
			products.push(prod)
		})

		res.json(products)

	}

	async showByCodeBar(req, res) {

		let { codebar: codeBar } = req.params

		let { metaData, rows } = await ProductsRepository.findByCodeBar(codeBar)
		let [row] = rows

		if (!row) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		let products = {}

		row.forEach((item, index) => {
			products[metaData[index].name] = item
		})

		res.json(products)

	}

	async showBySection(req, res) {

		let { codesection: codeSection } = req.params

		let { metaData, rows } = await ProductsRepository.findBySection(codeSection)

		let products = []

		rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[metaData[index].name] = value
			})
			products.push(prod)
		})

		res.json(products)
	}

	async showPromotions(req, res) {


		let { metaData, rows } = await ProductsRepository.findPromotions()

		// if(!rows) return res.status(404).json({ error: 'Não há promoções'})

		let promotions = []

		rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[metaData[index].name] = value
			})
			promotions.push(prod)
		})

		res.json(promotions)

	}

	async showEstMinBySupplier(req, res) {

		let { code } = req.params

		let { metaData, rows } = await ProductsRepository.findEstMinBySupplier(code)

		if(!rows.length) return res.status(404).json({error: 'Fornecedor não encontrado'})

		let products = []

		rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[metaData[index].name] = value
			})
			products.push(prod)
		})

		return res.json(products)

	}
}


module.exports = new ProductsController();
