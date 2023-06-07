const dbConfig = require('../database/config')
const oracledb = require('oracledb')


class BudgetsRepository {

    async findByNumber(numberBudget) {

        let connection;

        try {
            connection = await oracledb.getConnection(dbConfig)

            let budgetInfosMain = await connection.execute(`
            SELECT 
                PCORCAVENDAC.CODCLI,
                PCORCAVENDAC.DATA,
                PCORCAVENDAC.VLTOTAL,
                PCORCAVENDAC.CLIENTE,
                PCORCAVENDAC.CNPJ,
                PCORCAVENDAC.OBS
            FROM PCORCAVENDAC 
            WHERE PCORCAVENDAC.NUMORCA = ${numberBudget}
            `)

            let budgetInfosProds = await connection.execute(`
            SELECT 
                PCORCAVENDAI.CODPROD,
                PCPRODUT.DESCRICAO,
                PCORCAVENDAI.QT,
                PCPRODUT.EMBALAGEM,
                PCORCAVENDAI.PVENDA,
                PCORCAVENDAI.CODST,
                (CASE WHEN(PCORCAVENDAI.CODST IN (5)) THEN 19
                  WHEN(PCORCAVENDAI.CODST IN (6)) THEN 12
                  WHEN(PCORCAVENDAI.CODST IN (8)) THEN 0
                  WHEN(PCORCAVENDAI.CODST IN (7)) THEN 0.4
                  WHEN(PCORCAVENDAI.CODST IN (9)) THEN 0.0
                  WHEN(PCORCAVENDAI.CODST IN (10)) THEN 0.19
                  WHEN(PCORCAVENDAI.CODST IN (11)) THEN 18
                  WHEN(PCORCAVENDAI.CODST IN (13)) THEN 17
                  WHEN(PCORCAVENDAI.CODST IN (12)) THEN 19
                  WHEN(PCORCAVENDAI.CODST IN (15)) THEN 0
                  ELSE 0 END) AS ALIQ_ICMS,
                  PCPRODUT.CODNCMEX
            FROM PCORCAVENDAI 
            JOIN PCPRODUT ON PCPRODUT.CODPROD = PCORCAVENDAI.CODPROD
            WHERE PCORCAVENDAI.NUMORCA = ${numberBudget}
            `)

            return [budgetInfosMain.rows, budgetInfosProds.rows];

        }catch{
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

module.exports = new BudgetsRepository()