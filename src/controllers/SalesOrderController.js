const SalesOrdersRepository = require('../repositories/SalesOrdersRepository');
const client = require('../redis');
const { isDate, isValidDateTimeFormat } = require('../utils/isDate')
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

	async showByNumToConfer(req, res) {

		let numberOrder = req.params.numberorder
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let salesOrderFromCache = await client.get(fullUrl)
		if (salesOrderFromCache) {
			return res.json(JSON.parse(salesOrderFromCache))
		}

		let saleOrder = await SalesOrdersRepository.findByNumOrderToConfer(numberOrder)

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

	async showByNumNotaToConfer(req, res) {

		let numnota = req.params.numnota
		let { serie } = req.query
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let salesOrderFromCache = await client.get(fullUrl)
		if (salesOrderFromCache) {
			return res.json(JSON.parse(salesOrderFromCache))
		}

		if(!serie) {
			return res.status(400).json({ message: 'Série não informada!'})
		}

		let saleOrder = await SalesOrdersRepository.findByNumNotaToConfer(numnota, serie)

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

		let { metaData , rows } = await SalesOrdersRepository.findByRca({ rca, initialDate, finalDate, position })

		let sales = []

		rows.forEach(item => {
			let prop = {}
			item.forEach((value, index) => {
				prop[metaData[index].name] = value
			})
			sales.push(prop)
		})

		return res.json(sales);
	}

	async modifyPositionOfTelemarketingBtoL(req, res) {

		let numberOrder = req.params.numberorder
		let { hours, minutes, seconds, date } = req.query
		let regexDate = /^\d{4}-\d{2}-\d{2}$/

		if (!hours || !minutes || !seconds || !regexDate.test(date)) {
			return res.status(400).json({ message: 'Informações incompletas!'})
		}

		hours = Number(hours)
		minutes = Number(minutes)
		seconds = Number(seconds)

		if(typeof(hours) !== 'number' || typeof(minutes) !== 'number' || typeof(seconds) !== 'number') {
			return res.json({ message: 'Dados inválidos!'})
		}

		let salesOrder = await SalesOrdersRepository.findByNumOrder(numberOrder)

		if (salesOrder.length === 0) {
			return res.status(404).json({ error: 'Pedido de venda não encontrado!' })
		}

		let indexOfOrigemPed = salesOrder.headerOrder.metaData.findIndex(item => item.name === 'ORIGEMPED')
		let origemPed = salesOrder.headerOrder.rows[0][indexOfOrigemPed]

		if(origemPed !== 'T') return res.status(400).json({ message: 'Erro, pedido tem que ser de origem Telemarketing!' })

		let indexOfPosicao = salesOrder.headerOrder.metaData.findIndex(item => item.name === 'POSICAO')
		let posicao = salesOrder.headerOrder.rows[0][indexOfPosicao]

		if(posicao !== 'B') return res.status(400).json({ message: 'Erro, pedido não está bloqueado!' })

		let result = await SalesOrdersRepository.changePositionOfTelemarketingBtoL({ numberOrder, hours, minutes, seconds, date })

		if(result.errorNum) {
			return res.status(400).json({ message: `Error oracle ${result.errorNum}`})
		}

		res.json({ message: 'Pedido liberado com sucesso'})
	}

	async modifyPositionOfBalcaoReservaBtoM(req, res) {

		let numberOrder = req.params.numberorder
		let { hours, minutes, seconds, date } = req.query

		let regexDate = /^\d{4}-\d{2}-\d{2}$/

		if (!hours || !minutes || !seconds || !regexDate.test(date) ) {
			return res.status(400).json({ message: 'Informações incompletas'})
		}

		hours = Number(hours)
		minutes = Number(minutes)
		seconds = Number(seconds)

		if(typeof(hours) !== 'number' || typeof(minutes) !== 'number' || typeof(seconds) !== 'number') {
			return res.json({ message: 'Dados inválidos!'})
		}

		let salesOrder = await SalesOrdersRepository.findByNumOrder(numberOrder)
		if (salesOrder.length === 0) {
			return res.status(404).json({ error: 'Pedido de venda não encontrado!' })
		}

		let indexOfOrigemPed = salesOrder.headerOrder.metaData.findIndex(item => item.name === 'ORIGEMPED')
		let origemPed = salesOrder.headerOrder.rows[0][indexOfOrigemPed]

		if(origemPed !== 'R') return res.status(400).json({ message: 'Erro, pedido tem que ser de origem Balcão reserva!' })

		let indexOfPosicao = salesOrder.headerOrder.metaData.findIndex(item => item.name === 'POSICAO')
		let posicao = salesOrder.headerOrder.rows[0][indexOfPosicao]

		if(posicao !== 'B') return res.status(400).json({ message: 'Erro, pedido não está bloqueado!' })

		let result = await SalesOrdersRepository.changePositionOfBalcaoReservaBtoM({ numberOrder, hours, minutes, seconds, date })

		if(result.errorNum) {
			return res.status(400).json({ message: `Error oracle ${result.errorNum}`})
		}

		res.status(201).json({ message: 'Pedido desbloqueado com sucesso!'})
	}

	async blockSalesOrder(req, res) {

		let numberOrder = req.params.numberorder

		let salesOrder = await SalesOrdersRepository.findByNumOrder(numberOrder)

		if (salesOrder.length === 0) {
			return res.status(404).json({ error: 'Pedido de venda não encontrado!' })
		}

		let result = await SalesOrdersRepository.blockPosition({ numberOrder })

		if(result.errorNum) {
			return res.status(400).json({ message: `Error oracle ${result.errorNum}`})
		}
		console.log(result)
		res.status(201).json({ message: 'Pedido bloqueado com sucesso!'})
	}

	async fixSalesOrder(req, res) {

		let numberOrder = req.params.numberorder
		let { origemped } = req.query

		let position = origemped === 'R' ? 'M' : 'L'

		console.log({ numberOrder, position })

		let salesOrder = await SalesOrdersRepository.findByNumOrder(numberOrder)

		if (salesOrder.length === 0) {
			return res.status(404).json({ error: 'Pedido de venda não encontrado!' })
		}

		let result = await SalesOrdersRepository.modifyAndFix({ numberOrder, position })

		if(result.errorNum) {
			return res.status(400).json({ message: `Error oracle ${result.errorNum}`})
		}
		console.log(result)
		res.status(201).json({ message: 'Pedido modificado com sucesso!'})
	}

	async conferSalesOrder(req,res) {

		let	numberOrder = req.params.numberorder
		let { dtinitcheckout, dtfinishcheckout, codfunc } = req.body

		if (!isValidDateTimeFormat(dtinitcheckout) ||
		!isValidDateTimeFormat(dtfinishcheckout) || !codfunc) {
			return res.status(400).json({ message: 'Informações incompletas!'})
		}

		await SalesOrdersRepository.conferSalesOrder({ numberOrder, dtinitcheckout, dtfinishcheckout, codfunc })

		return res.json('Pedido conferido com sucesso!')
	}

}

module.exports = new SalesOrderController()
