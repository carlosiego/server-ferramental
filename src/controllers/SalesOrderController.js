const SalesOrdersRepository = require('../repositories/SalesOrdersRepository')

class SalesOrderController {

	async showByNum(req, res) {

		let numberOrder = req.params.numberorder

		let [headerOrder, prodsOrder] = await SalesOrdersRepository.findByNumOrder(numberOrder)

		if (!prodsOrder.rows.length) {
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

		res.json({ headers, products })

	}
}

module.exports = new SalesOrderController()
