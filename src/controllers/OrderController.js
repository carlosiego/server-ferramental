const OrderRepository = require('../repositories/OrdersRepository')

class OrderController {

    async showByNum(req, res) {

        let numberOrder = req.params.numberorder

        await OrderRepository.findByNumOrder(numberOrder)
        .then((order) => {
            if(order.length > 0){
                order = order.map((item) => {
                    return {
                        description: item[0],
                        codprod: item[1],
                        quantity: item[2],
                        value: item[3],
                        codst: item[4],
                        aliq_icms: item[5],
                        ncm: item[6]
                    }
                })
                res.json({
                    error: false,
                    order
                })
            }else{
                res.status(404).json({
                    error: true,
                    message: 'Não existe pedido com o número ' + numberOrder
                })
            }
        }).catch(() => {
            res.status(400).json({
                error: true,
                message: 'Não foi possível conectar ao banco de dados'
            })
        })
    }
}

module.exports = new OrderController()