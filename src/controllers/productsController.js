import { getProductsByDescription } from './getProductsByDescription.js'
import { getProductsByCode } from './getProductsByCode.js'

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
        }).catch((pd) => {
            res.status(400).json({
                error: true,
                message: 'Erro, não foi possível conectar ao banco de dados'

            })  
        })
        // console.log(description)
        // console.log(productsByDescription)
        // if(productsByDescription.length !== 0) {
        //     res.json({
        //         error: false,
        //         products: productsByDescription
        //     })
        // }else{
        //     res.status(400).json({
        //         error: true,
        //         products: []
        //     })  
        // }
    }

    static showProductsByCode = async(req, res) => {
        let code = req.params.code
        let productsByCode = await getProductsByCode(code)
        if(productsByCode.length !== 0 ){
            res.json({
                error: false,
                products: productsByCode
            })
        }else{
            res.status(400).json({
                error: true,
                products: []
            })
        }
        
    }
}


export default productsController