const dbConfig = require('../dbConfig')
const oracledb = require('oracledb')

class OrderRepository {

    async findByNumOrder(numberOrder) {
        
        let connection; 
        
        try {
      
            connection = await oracledb.getConnection(dbConfig);
        
            let order = await connection.execute(`
            SELECT
                PCPRODUT.DESCRICAO,
                PCPEDI.CODPROD,
                PCPEDI.QT,
                PCPEDI.PVE
                PCPEDI.CODST,
                (CASE WHEN(PCPEDI.CODST IN (5)) THEN 19
                WHEN(PCPEDI.CODST IN (6)) THEN 12
                WHEN(PCPEDI.CODST IN (8)) THEN 0
                WHEN(PCPEDI.CODST IN (7)) THEN 0.4
                WHEN(PCPEDI.CODST IN (9)) THEN 0.0
                WHEN(PCPEDI.CODST IN (10)) THEN 0.19
                WHEN(PCPEDI.CODST IN (11)) THEN 18
                WHEN(PCPEDI.CODST IN (13)) THEN 17
                WHEN(PCPEDI.CODST IN (12)) THEN 19
                WHEN(PCPEDI.CODST IN (15)) THEN 0
                ELSE 0 END) AS ALIQ_ICMS,
                PCPRODUT.CODNCMEX
            FROM PCPEDI
            JOIN PCCLIENT ON PCCLIENT.CODCLI = PCPEDI.CODCLI 
            JOIN PCPRODUT ON PCPRODUT.CODPROD = PCPEDI.CODPROD
            WHERE PCPEDI.NUMPED = ${numberOrder}
            `)
            
            return order.rows;
        
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
}

module.exports = new OrderRepository()