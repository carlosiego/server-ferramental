const BonusRepository = require('../repositories/BonusRepository')

class BonusController {

	async showBonus(req, res) {

		let { rows: bonus } = await BonusRepository.findBonus()

		if(!bonus?.length) {
			return res.status(404).json({message: 'Sem bônus disponíveis'})
		}

		return res.json(bonus)

	}

	async showItensByNumBonus(req, res) {

		let { numbonus } = req.params

		let { rows: products } = await BonusRepository.findBonusItens({ numbonus })

		if(!products?.length) {
			return res.status(404).json({ message: 'Bônus não encontrado' })
		}

		return res.json(products)

	}

	async conferBonus(req, res) {

		let { numbonus } = req.params

		let { rows: products } = await BonusRepository.findBonusItens({ numbonus })

		if(!products?.length) {
			return res.status(404).json({ message: 'Bônus não encontrado' })
		}

		console.log('Iniciando conferência do bônus: ', numbonus)
		let bonusConfer = await BonusRepository.saveConferBonus({ numbonus })

		if(!bonusConfer) {
			return res.status(500).json({
				message: 'Erro ao conferir o bônus'
			})
		}

		return res.json({ message: `Bônus ${numbonus} conferido`})

	}

}

module.exports = new BonusController()
