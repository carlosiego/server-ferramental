const getProductsByDescription = require('./getProductsByDescription.js')
const getProductsByCode = require('./getProductsByCode.js')

class productsController {

// ================================== READ =============================================================================

    static showProductsByDescription = async (req, res) => {
        let description = req.params.description
        await getProductsByDescription(description)
        .then((productsByDescription) => {
            if(productsByDescription.length > 0){
                res.json({
                    error: false,
                    products: productsByDescription
                })
            }else{
                res.status(400).json({
                    error: true,
                    products: []
                })  
            }
        }).catch(() => {
            res.status(400).json({
                error: true,
                message: 'Erro, não foi possível conectar ao banco de dados'

            })  
        })
    }

    static showProductsByCode = async(req, res) => {
        let code = req.params.code
        await getProductsByCode(code)
        .then((productsByCode) => {
            if(productsByCode.length !== 0 ){
                res.json({
                    error: false,
                    products: productsByCode
                })
            }else{
                res.status(400).json({
                    error: true,
                    message: `Erro, não existe produto com o código ${code}`,
                    products: []
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


module.exports = productsController