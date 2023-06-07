const SalesOrdersRepository = require('../repositories/SalesOrdersRepository')

class SalesOrderController {

    async showByNum(req, res) {
        
        let numberOrder = req.params.numberorder

        let [ headerProds, infosProds ] = await SalesOrdersRepository.findByNumOrder(numberOrder)

        let header = {}
        let products = []

        headerProds.metaData.forEach((item, index) => {
            header[item.name] = headerProds.rows[0][index]
        })

        infosProds.metaData.forEach((item, index) => {
            let prod = {}
            prod[item.name] = infosProds.rows[0][index]
            products.push(prod)
        })

        res.json(products)

    }
}

module.exports = new SalesOrderController()