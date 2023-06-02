const ProductsRepository = require('../repositories/ProductsRepository.js');

class ProductsController {
    
    async showByCode(req, res) {
        let { code } = req.params
        await ProductsRepository.findByCode(code)
        .then((product) => {
            if(product.length !== 0 ){
                product = product.map((item) => {
                    return {
                        description: item[0],
                        value: item[1],
                        quantity: item[2],
                        embalagem: item[3],
                        codprod: item[4],
                        codebar: item[5]
                    }
                })
                res.json({
                    error: false,
                    product: product
                })
            }else{
                res.status(404).json({
                    error: true,
                    message: `Não existe produto com o código ${code}`,
                })
            }
        }).catch(() => {
            res.status(400).json({
                error: true,
                message: 'Não foi possível conectar ao banco de dados'
            })  
        })
    }

    async showByDescription(req, res) {
        let { description } = req.params
        await ProductsRepository.findByDescription(description)
        .then((products) => {
            if(products.length > 0){
                products = products.map(item => {
                    return {
                        description: item[0],
                        value: item[1],
                        quantity: item[2],
                        embalagem: item[3],
                        codprod: item[4],
                        codebar: item[5]
                    }
                })
                res.json({
                    error: false,
                    products
                })
            }else{
                res.status(404).json({
                    error: true,
                    message: `Não existe produto com a descrição ${description}`,
                })  
            }
        }).catch(() => {
            res.status(400).json({
                error: true,
                message: 'Não foi possível conectar ao banco de dados'
            })  
        })
    }

    async showByCodeBar(req, res) {
        let codeBar = req.params.codebar

        await ProductsRepository.findByCodeBar(codeBar)
        .then((product) => {
            if(product.length > 0) {
                product = product.map(item => {
                    return {
                        description: item[0],
                        value: item[1],
                        quantity: item[2],
                        embalagem: item[3],
                        codprod: item[4],
                        codebar: item[5]
                    }
                })
                res.json(({
                    error: false,
                    product,                   
                }))
            }else {
                res.status(404).json({
                    error: true,
                    message: `Não existe produto com o código de barras ${codeBar}`,                   
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


module.exports = new ProductsController();