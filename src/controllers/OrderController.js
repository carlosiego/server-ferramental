const OrdersRepository = require('../repositories/OrdersRepository')

class OrderController {

    async showByNum(req, res) {
        
        let numberOrder = req.params.numberorder

        await OrdersRepository.findByNumOrder(numberOrder)
        .then(([ orderInfosMain, orderInfosProducts ]) => {
            if(orderInfosMain.length > 0){

                orderInfosMain = orderInfosMain.map((item) => {
                    return {
                        numped: item[0],
                        data: item[1],
                        valueTotal: item[2],
                        codcli: item[3],
                        position: item[4],
                        obs: item[5],
                        obs1: item[6],
                        obs2: item[7],
                        obsdelivery1: item[8],
                        obsdelivery2: item[9],
                        obsdelivery3: item[10],
                        numitens: item[11],
                        codseller: item [12],
                        codcob: item[13],
                        terms: [item[14], item[15], item[16], item[17], item[18]],
                    }
                })

                orderInfosProducts = orderInfosProducts.map((item) => {
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
                    orderInfosMain,
                    orderInfosProducts
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