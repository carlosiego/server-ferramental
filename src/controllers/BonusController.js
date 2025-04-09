const BonusRepository = require('../repositories/BonusRepository')

class BonusController {

	async showBonus(req, res) {

		let { metaData, rows} = await BonusRepository.findBonus()

		if(!rows.length) {
			return res.status(404).json({message: 'Sem bônus disponíveis'})
		}

		let bonus = []

		rows.forEach(item => {
			let prop = {}
			item.forEach((value, index) => {
				prop[metaData[index].name] = value
			})
			bonus.push(prop)
		})

		return res.json(bonus)

	}

	async showItensByNumBonus(req, res) {

		let { numbonus } = req.params

		let { metaData, rows} = await BonusRepository.findBonusItens({ numbonus })

		if(!rows.length) {
			return res.status(404).json({ message: 'Bônus não encontrado' })
		}

		let itens = []

		rows.forEach(item => {
			let prop = {}
			item.forEach((value, index) => {
				prop[metaData[index].name] = value
			})
			itens.push(prop)
		})

		return res.json(itens)

	}

}

module.exports = new BonusController()
