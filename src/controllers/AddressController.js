const AddressesRepository = require('../repositories/AddressesRepository.js');
const client = require('../redis/index.js')

class AddressController {

	async showAllAddresses(req, res) {

		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let addressesFromCache = await client.get(fullUrl)

		if (addressesFromCache) {
			return res.json(JSON.parse(addressesFromCache))
		}

		let { rows: addresses } = await AddressesRepository.findAllAddresses();

		if(!addresses?.length) {
			return res.status(404).json({ error: 'Endereços não encontrado' })
		}

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

		let { rows: [ address ] } = await AddressesRepository.findAddress({ storehouse, street, numberaddress, apartment, typeaddress });

		if(!address) {
			return res.status(404).json({ error: 'Endereço não encontrado' })
		}

		await client.set(fullUrl, JSON.stringify(address), { EX: process.env.EXPIRATION})
		res.json(address)

	}

	async bindAddress(req, res) {

		let { code } = req.params

		let { storehouse, street, numberaddress, apartment, typeaddress } = req.body

		console.log(`Vincular endereço ao produto ${code} ao endereço ${storehouse}.${street}.${numberaddress}.${apartment}.${typeaddress}`)

		function isEmpty(value) {
			return value === null || value === undefined || value === '';
		}

		if(isEmpty(code) || isEmpty(storehouse) || isEmpty(street) || isEmpty(numberaddress) || isEmpty(apartment) || isEmpty(typeaddress)) {
			console.log('Erro ao vincular endereço, parâmetros inválidos');
			return res.status(400).json({ error: 'Erro ao vincular endereço, parâmetros inválidos' });
		}

		let { rows: [ address ]} = await AddressesRepository.findAddress({ storehouse, street, numberaddress, apartment, typeaddress });

		if(!address) {
			console.log('Endereço não encontrado')
			return res.status(404).json({ error: 'Endereço não encontrado' })
		}

		await AddressesRepository.updateAddress({ code, storehouse, street, numberaddress, apartment, typeaddress });
		console.log('Endereço atualizado com sucesso')
		res.json({ message: 'Endereço atualizado com sucesso' })

	}

}

module.exports = new AddressController();
