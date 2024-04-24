const executeQuery = require('../database/executeQuery')

class SalesOrdersRepository {

	async findByNumOrder(numberOrder) {

		let headerOrder = await executeQuery(`
      SELECT
        PCPEDC.NUMPED,
        PCPEDC.ORIGEMPED,
        PCPEDC.DATA,
        PCPEDC.VLTOTAL,
				PCPEDC.VLTABELA,
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

		if(headerOrder.rows.length === 0) {
			return []
		}

		let prodsOrder = await executeQuery(`
      SELECT
        PCPRODUT.DESCRICAO,
        PCPEDI.CODPROD,
        PCPEDI.QT,
        PCPEDI.PVENDA,
				PCPEDI.PTABELA,
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

		return { headerOrder, prodsOrder };
	}

	async changePositionOfTelemarketing({ numberOrder, hours, minutes, seconds, date, position }){

		await executeQuery(`
			UPDATE PCPEDC
			SET POSICAO = :position,
			DTLIBERA = to_date('${date} ${hours}:${minutes}:${seconds}', 'YYYY-MM-DD HH24:MI:SS'),
			CODFUNCLIBERA = 48,
			HORALIBERA = :hours,
			MINUTOLIBERA = :minutes
			WHERE NUMPED = :numberOrder
		`, { position, hours, minutes, numberOrder })

		await executeQuery(`
			UPDATE PCPEDI
			SET POSICAO = :position
			WHERE NUMPED = :numberOrder
		`, { numberOrder, position })

	}

	async changePositionOfBalcaoReserva({ numberOrder, hours, minutes, seconds, date, position }){

		await executeQuery(`
			UPDATE PCPEDC
			SET POSICAO = :position,
			DTLIBERA = to_date('${date} ${hours}:${minutes}:${seconds}', 'YYYY-MM-DD HH24:MI:SS'),
			CODFUNCLIBERA = 48,
			HORALIBERA = :hours,
			MINUTOLIBERA = :minutes,
			IMPORTADO = 'N',
			NUMCAR = (SELECT * FROM (SELECT NUMCAR FROM PCPEDC ORDER BY NUMCAR DESC) WHERE ROWNUM = 1) + 1
			WHERE NUMPED = :numberOrder
		`, { position, hours, minutes, numberOrder })

		await executeQuery(`
			UPDATE PCBLOQUEIOSPEDIDO
			SET DTLIBERA = to_date(':date ${hours}:${minutes}:${seconds}', 'YYYY-MM-DD HH24:MI:SS'),
			STATUS = 'L',
			CODFUNCLIBERA = 48
			WHERE NUMPED = :numberOrder;
		`, { date, numberOrder})

		await executeQuery(`
			UPDATE PCPEDI
			SET POSICAO = :position
			WHERE NUMPED = :numberOrder
		`, { numberOrder, position })

	}

	async findByRca({ rca, initialDate, finalDate, position }) {

		let salesOrder = await executeQuery(`
			SELECT
			PCPEDC.NUMPED,
			PCPEDC.ORIGEMPED,
			PCPEDC.DATA,
			PCPEDC.VLTOTAL,
			PCPEDC.VLTABELA,
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
			WHERE DATA BETWEEN (TO_DATE (:initialDate, 'YYYY-MM-DD')) AND (TO_DATE (:finalDate, 'YYYY-MM-DD'))
			AND CODUSUR = :rca
			AND POSICAO = :position
		`, { rca, initialDate, finalDate, position })

		return salesOrder

	}
}

module.exports = new SalesOrdersRepository()
