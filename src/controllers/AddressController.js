const AddressesRepository = require('../repositories/AddressesRepository.js');
const client = require('../redis/index.js')

class AddressController {

	async showAllAddresses(req, res) {

		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let addressesFromCache = await client.get(fullUrl)

		if (addressesFromCache) {
			return res.json(JSON.parse(addressesFromCache))
		}

		let { metaData, rows} = await AddressesRepository.findAllAddresses();

		if(!rows.length) {
			return res.status(404).json({ error: 'Endereços não encontrado' })
		}

		const addresses = rows.map(row =>
  		row.reduce((acc, value, index) => {
    		acc[metaData[index].name] = value
    		return acc
  		}, {})
		)

		await client.set(fullUrl, JSON.stringify(addresses), { EX: process.env.EXPIRATION})
		res.json(addresses)
	}

	async showAddress(req, res) {

		let { storehouse, street, numberaddress, apartment, typeaddress } = req.query

		if (!storehouse || !street || !numberaddress || !apartment || !typeaddress) {
			return res.status(400).json({ error: 'Parâmetros inválidos' })
		}

		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let addressFromCache = await client.get(fullUrl)

		if (addressFromCache) {
			return res.json(JSON.parse(addressFromCache))
		}

		let { metaData, rows} = await AddressesRepository.findAddress({ storehouse, street, numberaddress, apartment, typeaddress });

		let [row] = rows

		if(!row) {
			return res.status(404).json({ error: 'Endereço não encontrado' })
		}

		let address = {}

		row.forEach((item, index) => {
			address[metaData[index].name] = item
		})

		await client.set(fullUrl, JSON.stringify(address), { EX: process.env.EXPIRATION})
		res.json(address)

	}

	async bindAddress(req, res) {

		let { code } = req.params

		let { storehouse, street, numberaddress, apartment, typeaddress } = req.body

		if (!code || !storehouse || !street || !numberaddress || !apartment || !typeaddress) {
			return res.status(400).json({ error: 'Parâmetros inválidos' })
		}

		let { metaData, rows} = await AddressesRepository.findAddress({ storehouse, street, numberaddress, apartment, typeaddress });

		let [row] = rows

		if(!row) {
			return res.status(404).json({ error: 'Endereço não encontrado' })
		}

		await AddressesRepository.updateAddress({ code, storehouse, street, numberaddress, apartment, typeaddress });

		res.json({ message: 'Endereço atualizado com sucesso' })

	}

}


module.exports = new AddressController();
