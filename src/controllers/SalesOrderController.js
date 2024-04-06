const SalesOrdersRepository = require('../repositories/SalesOrdersRepository');
const client = require('../redis');
const isDate = require('../utils/isDate')
const moment = require('moment')

class SalesOrderController {

	async showByNum(req, res) {

		let numberOrder = req.params.numberorder
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let salesOrderFromCache = await client.get(fullUrl)
		if (salesOrderFromCache) {
			return res.json(JSON.parse(salesOrderFromCache))
		}

		let saleOrder = await SalesOrdersRepository.findByNumOrder(numberOrder)

		if (saleOrder.length === 0) {
			await client.set(fullUrl, JSON.stringify({ error: 'Pedido de venda não encontrado' }), { EX: process.env.EXPIRATION})
			return res.status(404).json({ error: 'Pedido de venda não encontrado' })
		}

		let { headerOrder, prodsOrder } = saleOrder

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

	async showByRca(req, res) {

		let { rca } = req.params
		let { initialDate, finalDate, position } = req.query
		rca = Number(rca)

		if(!isDate(initialDate) || !isDate(finalDate) || !position || !rca) {
			return res.status(400).json({ message: `Informações inválidas ou faltando.`})
		}

		if(moment(initialDate).isAfter(finalDate)){
			return res.status(400).json({ message: 'Data inicial não pode ser maior que a final.'})
		}

		let { headerOrders: { metaData , rows } } = await SalesOrdersRepository.findByRca({ rca, initialDate, finalDate, position })

		console.log({ metaData, rows})

		return res.json({ metaData, rows });
	}

	async changePosition(req, res) {

		let numberOrder = req.params.numberorder

		let salesOrder = await SalesOrdersRepository.findByNumOrder(numberOrder)

		if (salesOrder.length === 0) {
			return res.status(404).json({ error: 'Pedido de venda não encontrado' })
		}

		await SalesOrdersRepository.changePosition(numberOrder)
		res.json({ message: 'Pedido liberado com sucesso'})
	}

}

module.exports = new SalesOrderController()
