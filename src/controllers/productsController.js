import { getProductsByDescription } from './getProductsByDescription.js'
import { getProductsByCode } from './getProductsByCode.js'

class productsController {

// ================================== READ =============================================================================

    static showProductsByDescription = async (req, res) => {
        let description = req.params.description
        let productsByDescription = await getProductsByDescription(description)
        res.status(200).json(productsByDescription)
    }

    static showProductsByCode = async(req, res) => {
        let code = req.params.code
        let productsByCode = await getProductsByCode(code)
        console.log(productsByCode)
        res.status(200).json(productsByCode)
        
    }
}


export default productsController