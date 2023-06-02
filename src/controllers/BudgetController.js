const BudgetsRepository = require('../repositories/BudgetsRepository')

class BudgetController {

    async showByNum(req, res){

        let numberBudget = req.params.numberbudget

        await BudgetsRepository.findByNumber(numberBudget)
        .then(([budgetInfosMain, budgetInfosProds]) => {
            if(budgetInfosMain.length > 0){
                budgetInfosMain = budgetInfosMain.map(item => {
                    return {
                        codcli: item[0],
                        data: item[1],
                        vltotal: item[2],
                        client: item[3],
                        cnpj: item[4],
                        obs: item[5]
                    }
                })
                budgetInfosProds = budgetInfosProds.map(item => {
                    return {
                        codprod: item[0],
                        description: item[1],
                        quantity: item[2],
                        package: item[3],
                        value: item[4],
                        codst: item[5],
                        alq_icms: item[6],
                        ncm: item[7]
                    }
                })
                res.json({
                    error: false,
                    budgetInfosMain,
                    budgetInfosProds
                })
            }else {
                res.status(404).json({
                    error: true,
                    message: 'Não existe orçamento com o número ' + numberBudget
                })
            }
        }).catch(() => {
            res.status(400).json({
                error: true,
                message: `Não foi possível conectar ao banco de dados!`
            })
        })
    }

}

module.exports = new BudgetController()