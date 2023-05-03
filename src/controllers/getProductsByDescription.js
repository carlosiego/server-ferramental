import dbConfig from '../dbConfig.js'
import oracledb from  'oracledb'
import { transformReqString } from './transformReqString.js'

export const getProductsByDescription = async(description) => {

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
