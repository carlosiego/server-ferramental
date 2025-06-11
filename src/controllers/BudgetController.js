const BudgetsRepository = require('../repositories/BudgetsRepository')
const client = require('../redis')

class BudgetController {

	async showByNum(req, res) {

		let numberBudget = req.params.numberbudget
		let fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

		let budgetFromCache = await client.get(fullUrl)

		if (budgetFromCache) {
			return res.json(JSON.parse(budgetFromCache))
		}

		let { headers, products } = await BudgetsRepository.findByNumber(numberBudget)

		if (!products?.length) {
			await client.set(fullUrl, JSON.stringify({ error: 'Orçamento não encontrado' }), { EX: process.env.EXPIRATION })
			return res.status(404).json({ error: 'Orçamento não encontrado' })
		}

		await client.set(fullUrl, JSON.stringify({ headers, products }), { EX: process.env.EXPIRATION })
		res.json({ headers, products })

	}

}

module.exports = new BudgetController()
