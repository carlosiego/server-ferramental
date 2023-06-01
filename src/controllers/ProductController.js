const ProductsRepository = require('../repositories/ProductsRepository.js')

class ProductsController {
    
    static showByCode = async (req, res) => {
        let { code } = req.params
        await ProductsRepository.findByCode(code)
        .then((product) => {
            if(product.length !== 0 ){
                res.json({
                    error: false,
                    product: product
                })
            }else{
                res.status(404).json({
                    error: true,
                    message: `Erro, não existe produto com o código ${code}`,
                })
            }
        }).catch(() => {
            res.status(400).json({
                error: true,
                message: 'Erro, não foi possível conectar ao banco de dados'
            })  
        })
    }

    static showByDescription = async (req, res) => {
        let { description } = req.params
        await ProductsRepository.findByDescription(description)
        .then((products) => {
            if(products.length > 0){
                res.json({
                    error: false,
                    products
                })
            }else{
                res.status(404).json({
                    error: true,
                    message: `Erro, não existe produto com a descrição ${description}`,
                })  
            }
        }).catch(() => {
            res.status(400).json({
                error: true,
                message: 'Erro, não foi possível conectar ao banco de dados'
            })  
        })
    }

    static showByCodeBar = async (req, res) => {
        const codeBar = req.params.codebar

        await ProductsRepository.findByCodeBar(codeBar)
        .then((product) => {
            if(product.length > 0) {
                res.json(({
                    error: false,
                    product,                   
                }))
            }else {
                res.status(404).json({
                    error: true,
                    message: `Erro, não existe produto com o código de barras ${codeBar}`,                   
                })
            }
        }).catch(() => {
            res.status(400).json({
                error: true,
                message: 'Erro, não foi possível conectar ao banco de dados'
            })
        })
    }
}


module.exports = ProductsController