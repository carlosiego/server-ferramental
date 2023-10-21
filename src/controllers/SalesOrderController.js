const SalesOrdersRepository = require('../repositories/SalesOrdersRepository')
const client = require('../redis')

class SalesOrderController {

	async showByNum(req, res) {

		let numberOrder = req.params.numberorder
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let salesOrderFromCache = await client.get(fullUrl)
		if (salesOrderFromCache) {
			return res.json(JSON.parse(salesOrderFromCache))
		}

		let [headerOrder, prodsOrder] = await SalesOrdersRepository.findByNumOrder(numberOrder)

		if (!prodsOrder.rows.length) {
			await client.set(fullUrl, JSON.stringify({ error: 'Pedido de venda não encontrado' }), { EX: process.env.EXPIRATION})
			return res.status(404).json({ error: 'Pedido de venda não encontrado' })
		}

		let headers = {}
		let products = []

		headerOrder.metaData.forEach((item, index) => {
			headers[item.name] = headerOrder.rows[0][index]
		})

		prodsOrder.rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[prodsOrder.metaData[index].name] = value
			})
			products.push(prod)
		})

		await client.set(fullUrl, JSON.stringify({ headers, products }), { EX: process.env.EXPIRATION})
		res.json({ headers, products })

	}
}

module.exports = new SalesOrderController()
