const ProductsRepository = require('../repositories/ProductsRepository.js');
const client = require('../redis')

class ProductsController {

	async showByCode(req, res) {

		let { code } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let productFromCache = await client.get(fullUrl)
		if (productFromCache) {
			return res.json(JSON.parse(productFromCache))
		}
		let { metaData, rows } = await ProductsRepository.findByCode(code)
		let [row] = rows

		if (!row) {
			await client.set(fullUrl, JSON.stringify({ error: 'Produto não encontrado' }), { EX: process.env.EXPIRATION })
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		let product = {}
		row.forEach((item, index) => {
			product[metaData[index].name] = item
		})
		await client.set(fullUrl, JSON.stringify(product), { EX: process.env.EXPIRATION })
		res.json(product)
	}

	async showByDescription(req, res) {

		let { description } = req.params
		let { orderBy } = req.query
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let productsFromCache = await client.get(fullUrl)
		if(productsFromCache) {
			return res.json(JSON.parse(productsFromCache))
		}
		let { metaData, rows } = await ProductsRepository.findByDescription(description, orderBy)

		if(!rows.length) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		let products = []

		rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[metaData[index].name] = value
			})
			products.push(prod)
		})

		await client.set(fullUrl, JSON.stringify(products), { EX: process.env.EXPIRATION})
		res.json(products)

	}

	async showMinimumByDescription(req, res) {

		let { description } = req.params
		let { orderBy } = req.query
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let productsFromCache = await client.get(fullUrl)
		if(productsFromCache) {
			return res.json(JSON.parse(productsFromCache))
		}
		let { metaData, rows } = await ProductsRepository.findMinimumByDescription(description, orderBy)

		if(!rows.length) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		let products = []

		rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[metaData[index].name] = value
			})
			products.push(prod)
		})
		await client.set(fullUrl, JSON.stringify(products), { EX: process.env.EXPIRATION})
		res.json(products)

	}

	async showByCodeBar(req, res) {

		let { codebar: codeBar } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let productsFromCache = await client.get(fullUrl)
		if(productsFromCache) {
			return res.json(JSON.parse(productsFromCache))
		}
		let { metaData, rows } = await ProductsRepository.findByCodeBar(codeBar)
		let [row] = rows

		if (!row) {
			await client.set(fullUrl, JSON.stringify({ error: 'Produto não encontrado' }), { EX: process.env.EXPIRATION })
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		let products = {}

		row.forEach((item, index) => {
			products[metaData[index]?.name] = item
		})

		await client.set(fullUrl, JSON.stringify(products), { EX: process.env.EXPIRATION})

		res.json(products)

	}

	async showMinimumByCodeBar(req, res) {

		let { codebar: codeBar } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let productsFromCache = await client.get(fullUrl)
		if(productsFromCache) {
			return res.json(JSON.parse(productsFromCache))
		}
		let { metaData, rows } = await ProductsRepository.findMinimumByCodeBar(codeBar)
		let [row] = rows

		if (!row) {
			await client.set(fullUrl, JSON.stringify({ error: 'Produto não encontrado' }), { EX: process.env.EXPIRATION })
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		let products = {}

		row.forEach((item, index) => {
			products[metaData[index].name] = item
		})

		await client.set(fullUrl, JSON.stringify(products), { EX: process.env.EXPIRATION})

		res.json(products)

	}

	async showBySection(req, res) {

		let { codesection: codeSection } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let productsFromCache = await client.get(fullUrl)
		if(productsFromCache) {
			return res.json(JSON.parse(productsFromCache))
		}
		let { metaData, rows } = await ProductsRepository.findBySection(codeSection)

		if(!rows.length) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		let products = []

		rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[metaData[index].name] = value
			})
			products.push(prod)
		})
		await client.set(fullUrl, JSON.stringify(products), { EX: process.env.EXPIRATION})
		res.json(products)
	}

	async showMinimumBySection(req, res) {

		let { codesection: codeSection } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let productsFromCache = await client.get(fullUrl)
		if(productsFromCache) {
			return res.json(JSON.parse(productsFromCache))
		}
		let { metaData, rows } = await ProductsRepository.findMinimumBySection(codeSection)

		if(!rows.length) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		let products = []

		rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[metaData[index].name] = value
			})
			products.push(prod)
		})
		await client.set(fullUrl, JSON.stringify(products), { EX: process.env.EXPIRATION})
		res.json(products)
	}

	async showPromotions(req, res) {

		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let promotionsFromCache = await client.get(fullUrl)
		if(promotionsFromCache) {
			return res.json(JSON.parse(promotionsFromCache))
		}

		let { metaData, rows } = await ProductsRepository.findPromotions()

		if(!rows.length) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		if(!rows) return res.json([])

		let promotions = []

		rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[metaData[index].name] = value
			})
			promotions.push(prod)
		})

		await client.set(fullUrl, JSON.stringify(promotions), { EX: process.env.EXPIRATION})
		res.json(promotions)

	}

	async showBySupplier(req, res) {

		let { code } = req.params

		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let productsFromCache = await client.get(fullUrl)
		if(productsFromCache) {
			return res.json(JSON.parse(productsFromCache))
		}

		let { metaData, rows } = await ProductsRepository.findBySupplier(code)

		if(!rows.length) {
			await client.set(fullUrl, JSON.stringify({error: 'Fornecedor não encontrado'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Fornecedor não encontrado'})
		}
		let products = []

		rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[metaData[index].name] = value
			})
			products.push(prod)
		})
		await client.set(fullUrl, JSON.stringify(products), { EX: process.env.EXPIRATION})
		return res.json(products)

	}

	async showMoreCodAuxiliar(req, res) {

		let { code } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let productFromCache = await client.get(fullUrl)

		if (productFromCache) {
			return res.json(JSON.parse(productFromCache))
		}

		let { metaData, rows } = await ProductsRepository.findMoreCodAuxiliar(code)

		let [row] = rows

		if (!row) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		let product = {}
		row.forEach((item, index) => {
			product[metaData[index].name] = item
		})

		await client.set(fullUrl, JSON.stringify(product), { EX: process.env.EXPIRATION })
		res.json(product)
	}
}


module.exports = new ProductsController();
