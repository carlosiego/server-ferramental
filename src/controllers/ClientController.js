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

		let { rows: [ cli ] } = await ClientsRepository.findByCodcli(codcli)

		if (!cli) {
			await client.set(fullUrl, JSON.stringify({ error: 'Cliente não encontrado' }), { EX: process.env.EXPIRATION })
			return res.status(404).json({ error: 'Cliente não encontrado' })
		}

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

		let { rows: [ cli ] } = await ClientsRepository.findByCnpj(cnpj)

		if (!cli) {
			await client.set(fullUrl, JSON.stringify({ error: 'Cliente não encontrado' }), { EX: process.env.EXPIRATION })
			return res.status(404).json({ error: 'Cliente não encontrado' })
		}

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

		let { rows: clients } = await ClientsRepository.findByNameOrFantasy(nameorfantasy, orderBy)

		if(!clients.length) {
			return res.status(404).json({ error: 'Cliente não encontrado' })
		}

		await client.set(fullUrl, JSON.stringify(clients), { EX: process.env.EXPIRATION})
		res.json(clients)
	}

}

module.exports = new ClientController();
