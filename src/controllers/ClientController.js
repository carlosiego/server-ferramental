const ClientsRepository = require('../repositories/ClientsRepository.js');
const client = require('../redis')

class ClientController {

	async showByCodcli(req, res) {

		let { codcli } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let clientFromCache = await client.get(fullUrl)

		if(clientFromCache) {
			return res.json(JSON.parse(clientFromCache))
		}

		let { metaData, rows } = await ClientsRepository.findByCodcli(codcli)
		let [row] = rows

		if (!row) {
			await client.set(fullUrl, JSON.stringify({ error: 'Cliente não encontrado' }), { EX: process.env.EXPIRATION })
			return res.status(404).json({ error: 'Cliente não encontrado' })
		}

		let cli = {}
		row.forEach((item, index) => {
			cli[metaData[index].name] = item
		})

		await client.set(fullUrl, JSON.stringify(cli), { EX: process.env.EXPIRATION})
		res.json(cli)
	}

	async showByCnpj(req, res) {

		let { cnpj } = req.params
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let clientFromCache = await client.get(fullUrl)

		if(clientFromCache) {
			return res.json(JSON.parse(clientFromCache))
		}

		let { metaData, rows } = await ClientsRepository.findByCnpj(cnpj)
		let [row] = rows

		if (!row) {
			await client.set(fullUrl, JSON.stringify({ error: 'Cliente não encontrado' }), { EX: process.env.EXPIRATION })
			return res.status(404).json({ error: 'Cliente não encontrado' })
		}

		let cli = {}
		row.forEach((item, index) => {
			cli[metaData[index].name] = item
		})

		await client.set(fullUrl, JSON.stringify(cli), { EX: process.env.EXPIRATION})
		res.json(cli)
	}

	async showByNameOrFantasy(req, res) {

		let { nameorfantasy } = req.params
		let { orderBy } = req.query
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;
		let clientsFromCache = await client.get(fullUrl)
		if(clientsFromCache) {
			return res.json(JSON.parse(clientsFromCache))
		}

		let { metaData, rows } = await ClientsRepository.findByNameOrFantasy(nameorfantasy, orderBy)

		if(!rows.length) {
			return res.status(404).json({ error: 'Cliente não encontrado' })
		}

		let clients = []

		rows.forEach((item) => {
			let client = {}
			item.forEach((value, index) => {
				client[metaData[index].name] = value
			})
			clients.push(client)
		})

		await client.set(fullUrl, JSON.stringify(clients), { EX: process.env.EXPIRATION})
		res.json(clients)
	}

}

module.exports = new ClientController();
