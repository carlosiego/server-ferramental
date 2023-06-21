const executeQuery = require('../database/executeQuery');

const transformReqString = (description) => {
    let descriptionMod = description.toUpperCase()
    descriptionMod = descriptionMod.replaceAll(' ', '%')
    if(descriptionMod.slice(-1) != '%'){
        descriptionMod = descriptionMod + '%'
    }
    return descriptionMod
};

class ProductsRepository {

    async findByCode(code) {

      let product = await executeQuery(`
      SELECT
        PCPRODUT.DESCRICAO,
        PCTABPR.PTABELA,
        PCEST.DTULTENT,
        PCEST.DTULTSAIDA,
        PCEST.QTULTENT,
        PCEST.QTESTGER,
        PCEST.QTRESERV,
        PCPRODUT.EMBALAGEM,
        PCPRODUT.CODPROD,
        PCPRODUT.CODAUXILIAR
      FROM PCPRODUT
        JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
        JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
      WHERE PCPRODUT.CODPROD = :code AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL'
      `, { code })
      
      return product;
    }

    async findByDescription(description, orderBy= 'ASC') {

        let descriptionMod = transformReqString(description)
        let direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
        console.log(descriptionMod)
    
          let produtcs = await executeQuery(`
          SELECT
            PCPRODUT.DESCRICAO,
            PCTABPR.PTABELA,
            PCEST.DTULTENT,
            PCEST.DTULTSAIDA,
            PCEST.QTULTENT,
            PCEST.QTESTGER,
            PCEST.QTRESERV,
            PCPRODUT.EMBALAGEM,
            PCPRODUT.CODPROD,
            PCPRODUT.CODAUXILIAR
          FROM PCPRODUT
            JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
            JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
          WHERE PCPRODUT.DESCRICAO LIKE :descriptionMod AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL'
          ORDER BY PCPRODUT.DESCRICAO ${direction}
          `, { descriptionMod })

          return produtcs;
    }

    async findByCodeBar(codeBar) {

      let produtc = await executeQuery(`
      SELECT
        PCPRODUT.DESCRICAO,
        PCTABPR.PTABELA,
        PCEST.DTULTENT,
        PCEST.DTULTSAIDA,
        PCEST.QTULTENT,
        PCEST.QTESTGER,
        PCEST.QTRESERV,
        PCPRODUT.EMBALAGEM,
        PCPRODUT.CODPROD,
        PCPRODUT.CODAUXILIAR
      FROM PCPRODUT
      JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
      JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
      WHERE PCPRODUT.CODAUXILIAR = :codebar AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL'
    `, { codeBar })

      return produtc;
    }
    
};

module.exports = new ProductsRepository();