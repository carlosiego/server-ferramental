const dbConfig = require('../dbConfig.js');
const oracledb = require( 'oracledb');

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

        let connection;
      
        try {
      
          connection = await oracledb.getConnection(dbConfig);
      
          let produtcs = await connection.execute(`
          SELECT
            PCPRODUT.DESCRICAO,
            PCTABPR.PTABELA,
            PCEST.QTESTGER,
            PCPRODUT.EMBALAGEM,
            PCPRODUT.CODPROD
          FROM PCPRODUT
            JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
            JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
          WHERE PCPRODUT.CODPROD = ${code}
          `)
          
          return produtcs.rows;
      
        }catch (err) {
          console.error(err);
        }finally {
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.log(err);
            }
          }
        }
    }

    async findByDescription(description) {

        let connection;
        let descriptionMod = transformReqString(description)
        console.log(descriptionMod)
        try {
      
          connection = await oracledb.getConnection(dbConfig);
      
          let produtcs = await connection.execute(`
          SELECT
            PCPRODUT.DESCRICAO,
            PCTABPR.PTABELA,
            PCEST.QTESTGER,
            PCPRODUT.EMBALAGEM,
            PCPRODUT.CODPROD
          FROM PCPRODUT
            JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
            JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
          WHERE PCPRODUT.DESCRICAO LIKE '${descriptionMod}'
          `)
      
          return produtcs.rows;
      
        }catch (err) {
          console.error(err);
        }finally {
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.log(err);
            }
          }
        }
    }
    
    async findByCodeBar(codebar) {
        let connection;
        let n = 'a'
        try {

            connection = await oracledb.getConnection(n);

            let produtcs = await connection.execute(`
          SELECT
            PCPRODUT.DESCRICAO,
            PCTABPR.PTABELA,
            PCEST.QTESTGER,
            PCPRODUT.EMBALAGEM,
            PCPRODUT.CODPROD
          FROM PCPRODUT
            JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
            JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
          WHERE PCPRODUT.CODAUXILIAR = ${codebar}
          `)
      
          return produtcs.rows;

        } catch(err) {
            console.error(err);
        }finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
};

module.exports = new ProductsRepository();