const BudgetsRepository = require('../repositories/BudgetsRepository')

class BudgetController {

	async showByNum(req, res) {

		let numberBudget = req.params.numberbudget

		let [headersBudget, prodsBudget] = await BudgetsRepository.findByNumber(numberBudget)

		if (!prodsBudget.rows.length) {
			return res.status(404).json({ error: 'Orçamento não encontrado' })
		}

		let headers = {}
		let products = []

		headersBudget.metaData.forEach((item, index) => {
			headers[item.name] = headersBudget.rows[0][index]
		})

		prodsBudget.rows.forEach((item) => {
			let prod = {}
			item.forEach((value, index) => {
				prod[prodsBudget.metaData[index].name] = value
			})
			products.push(prod)
		})

		res.json({ headers, products })

	}

}

module.exports = new BudgetController()
