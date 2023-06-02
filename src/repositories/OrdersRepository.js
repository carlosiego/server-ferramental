const dbConfig = require('../dbConfig')
const oracledb = require('oracledb')

class OrdersRepository {

    async findByNumOrder(numberOrder) {
      
        let connection; 
        
        try {
      
            connection = await oracledb.getConnection(dbConfig);
        
            let orderInfosMain = await connection.execute(`
            SELECT 
                PCPEDC.NUMPED,
                PCPEDC.DATA,
                PCPEDC.VLTOTAL,
                PCPEDC.CODCLI,
                PCPEDC.POSICAO,
                PCPEDC.OBS,
                PCPEDC.OBS1,
                PCPEDC.OBS2,
                PCPEDC.OBSENTREGA1,
                PCPEDC.OBSENTREGA2,
                PCPEDC.OBSENTREGA3,
                PCPEDC.NUMITENS,
                PCPEDC.CODUSUR,
                PCPEDC.CODCOB,
                PCPEDC.PRAZO1,
                PCPEDC.PRAZO2,
                PCPEDC.PRAZO3,
                PCPEDC.PRAZO4,
                PCPEDC.PRAZO5
            FROM PCPEDC 
            WHERE PCPEDC.NUMPED = ${numberOrder}
            `)

            let orderInfosProducts = await connection.execute(`
            SELECT
                PCPRODUT.DESCRICAO,
                PCPEDI.CODPROD,
                PCPEDI.QT,
                PCPEDI.PVENDA,
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
            
            return [ orderInfosMain.rows, orderInfosProducts.rows ];
        
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

module.exports = new OrdersRepository()