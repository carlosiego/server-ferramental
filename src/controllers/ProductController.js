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
		let { rows: [ product ] } = await ProductsRepository.findByCode(code)

		if (!product) {
			await client.set(fullUrl, JSON.stringify({ error: 'Produto não encontrado' }), { EX: process.env.EXPIRATION })
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

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

		let { rows: products } = await ProductsRepository.findByDescription(description, orderBy)

		if(!products.length) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

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

		let { rows: products } = await ProductsRepository.findMinimumByDescription(description, orderBy)

		if(!products.length) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

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

		let { rows: [ product ] } = await ProductsRepository.findByCodeBar(codeBar)

		if (!product) {
			await client.set(fullUrl, JSON.stringify({ error: 'Produto não encontrado' }), { EX: process.env.EXPIRATION })
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		await client.set(fullUrl, JSON.stringify(product), { EX: process.env.EXPIRATION})

		res.json(product)

	}

	async showMinimumByCodeBar(req, res) {

		let { codebar: codeBar } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let productsFromCache = await client.get(fullUrl)

		if(productsFromCache) {
			return res.json(JSON.parse(productsFromCache))
		}

		let { rows: [ product ] } = await ProductsRepository.findMinimumByCodeBar(codeBar)

		if (!product) {
			await client.set(fullUrl, JSON.stringify({ error: 'Produto não encontrado' }), { EX: process.env.EXPIRATION })
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		await client.set(fullUrl, JSON.stringify(product), { EX: process.env.EXPIRATION})

		res.json(product)

	}

	async showBySection(req, res) {

		let { codesection: codeSection } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let productsFromCache = await client.get(fullUrl)

		if(productsFromCache) {
			return res.json(JSON.parse(productsFromCache))
		}

		let { rows: products } = await ProductsRepository.findBySection(codeSection)

		if(!products.length) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

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

		let { rows: products } = await ProductsRepository.findMinimumBySection(codeSection)

		if(!products.length) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		await client.set(fullUrl, JSON.stringify(products), { EX: process.env.EXPIRATION})
		res.json(products)
	}

	async showPromotions(req, res) {

		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let promotionsFromCache = await client.get(fullUrl)

		if(promotionsFromCache) {
			return res.json(JSON.parse(promotionsFromCache))
		}

		let { rows: promotions } = await ProductsRepository.findPromotions()

		if(!promotions?.length) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		if(!promotions) return res.json([])

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

		let { rows: products } = await ProductsRepository.findBySupplier(code)

		if(!products?.length) {
			await client.set(fullUrl, JSON.stringify({error: 'Fornecedor não encontrado'}), { EX: process.env.EXPIRATION})
			return res.status(404).json({error: 'Fornecedor não encontrado'})
		}

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

		let { rows: [product] } = await ProductsRepository.findMoreCodAuxiliar(code)

		if (!product) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}

		await client.set(fullUrl, JSON.stringify(product), { EX: process.env.EXPIRATION })
		res.json(product)
	}
}


module.exports = new ProductsController();
