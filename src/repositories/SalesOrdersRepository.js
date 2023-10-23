const executeQuery = require('../database/executeQuery')

class SalesOrdersRepository {

	async findByNumOrder(numberOrder) {

		let headerOrder = await executeQuery(`
      SELECT
        PCPEDC.NUMPED,
        PCPEDC.DATA,
        PCPEDC.VLTOTAL,
        PCPEDC.CODCLI,
        PCCLIENT.CLIENTE,
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
      JOIN PCCLIENT ON PCCLIENT.CODCLI = PCPEDC.CODCLI
      WHERE PCPEDC.NUMPED = :numberOrder
      `, { numberOrder })

		let prodsOrder = await executeQuery(`
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
        PCPRODUT.CODNCMEX,
        NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD
      FROM PCPEDI
      JOIN PCCLIENT ON PCCLIENT.CODCLI = PCPEDI.CODCLI
      JOIN PCPRODUT ON PCPRODUT.CODPROD = PCPEDI.CODPROD
      WHERE PCPEDI.NUMPED = :numberOrder
      `, { numberOrder })

		return [headerOrder, prodsOrder];
	}
}

module.exports = new SalesOrdersRepository()
