const executeQuery = require('../database/executeQuery')

class SalesOrdersRepository {

	async findByNumOrder(numberOrder) {

		let headerOrder = await executeQuery(`
      SELECT
        PCPEDC.NUMPED,
				PCPEDC.DTFINALCHECKOUT,
        PCPEDC.ORIGEMPED,
        PCUSUARI.NOME,
        NVL(PCUSUARI.USURDIRFV, 'not-found.png') AS USURDIRFV,
        PCPEDC.DATA,
				PCPEDC.VLATEND,
        PCPEDC.VLTOTAL,
				PCPEDC.VLTABELA,
				ROUND(PCPEDC.PERDESC, 2) AS PERDESC,
        PCPEDC.CODCLI,
        PCCLIENT.CLIENTE,
				NVL(REGEXP_SUBSTR(PCCLIENT.DIRETORIOCLIENTE, '[^\\]+$'), 'not-found.png') AS DIRETORIOCLIENTE,
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
			JOIN PCUSUARI ON PCUSUARI.CODUSUR = PCPEDC.CODUSUR
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
		PCPEDI.PERDESC,
		PCPEDI.VLSUBTOTITEM,
		PCPEDI.UNIDADE,
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

	async findByNumOrderToConfer(numberOrder) {

		let headerOrder = await executeQuery(`
      SELECT
        PCPEDC.NUMPED,
				PCPEDC.DTFINALCHECKOUT,
        PCPEDC.ORIGEMPED,
        PCUSUARI.NOME,
        NVL(PCUSUARI.USURDIRFV, 'not-found.png') AS USURDIRFV,
        PCPEDC.DATA,
				PCPEDC.VLATEND,
        PCPEDC.VLTOTAL,
				PCPEDC.VLTABELA,
				ROUND(PCPEDC.PERDESC, 2) AS PERDESC,
        PCPEDC.CODCLI,
        PCCLIENT.CLIENTE,
				NVL(REGEXP_SUBSTR(PCCLIENT.DIRETORIOCLIENTE, '[^\\]+$'), 'not-found.png') AS DIRETORIOCLIENTE,
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
			JOIN PCUSUARI ON PCUSUARI.CODUSUR = PCPEDC.CODUSUR
      WHERE PCPEDC.NUMPED = :numberOrder
      `, { numberOrder })

		if(headerOrder.rows.length === 0) {
			return []
		}

		let prodsOrder = await executeQuery(`
      SELECT
			PCPEDI.CODPROD,
			PCPRODUT.DESCRICAO,
			PCPEDI.QT,
			PCPEDI.PVENDA,
			PCPEDI.PTABELA,
			PCPEDI.PERDESC,
			PCPEDI.VLSUBTOTITEM,
			PCPEDI.UNIDADE,
			NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD,
			    (
        SELECT LISTAGG(PCEMB.CODAUXILIAR, ',') WITHIN GROUP (ORDER BY PCEMB.CODAUXILIAR)
        FROM PCEMBALAGEM PCEMB
        WHERE PCEMB.CODPROD = PCPEDI.CODPROD
    ) AS CODAUXILIARES,
			0 AS QTCONFER
			FROM PCPEDI
			JOIN PCPRODUT ON PCPEDI.CODPROD = PCPRODUT.CODPROD
      WHERE PCPEDI.NUMPED = :numberOrder
      `, { numberOrder })

		return { headerOrder, prodsOrder };
	}

	async findByNumNotaToConfer(numnota, serie) {

		let headerOrder = await executeQuery(`
      SELECT
        PCPEDC.NUMPED,
				PCPEDC.DTFINALCHECKOUT,
        PCPEDC.ORIGEMPED,
        PCUSUARI.NOME,
        NVL(PCUSUARI.USURDIRFV, 'not-found.png') AS USURDIRFV,
        PCPEDC.DATA,
				PCPEDC.VLATEND,
        PCPEDC.VLTOTAL,
				PCPEDC.VLTABELA,
				ROUND(PCPEDC.PERDESC, 2) AS PERDESC,
        PCPEDC.CODCLI,
        PCCLIENT.CLIENTE,
				NVL(REGEXP_SUBSTR(PCCLIENT.DIRETORIOCLIENTE, '[^\\]+$'), 'not-found.png') AS DIRETORIOCLIENTE,
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
			JOIN PCUSUARI ON PCUSUARI.CODUSUR = PCPEDC.CODUSUR
			JOIN PCNFSAID ON PCPEDC.NUMTRANSVENDA = PCNFSAID.NUMTRANSVENDA
      WHERE PCNFSAID.NUMNOTA = :numnota AND PCNFSAID.SERIE = :serie
      `, { numnota, serie })

		if(headerOrder.rows.length === 0) {
			return []
		}

		let prodsOrder = await executeQuery(`
      SELECT
			PCPEDI.CODPROD,
			PCPRODUT.DESCRICAO,
			PCPEDI.QT,
			PCPEDI.PVENDA,
			PCPEDI.PTABELA,
			PCPEDI.PERDESC,
			PCPEDI.VLSUBTOTITEM,
			PCPEDI.UNIDADE,
			NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD,
			(
        SELECT LISTAGG(PCEMB.CODAUXILIAR, ',') WITHIN GROUP (ORDER BY PCEMB.CODAUXILIAR)
        FROM PCEMBALAGEM PCEMB
        WHERE PCEMB.CODPROD = PCPEDI.CODPROD
    	) AS CODAUXILIARES,
			0 AS QTCONFER
			FROM PCPEDI
			JOIN PCPRODUT ON PCPEDI.CODPROD = PCPRODUT.CODPROD
      WHERE PCPEDI.NUMPED = :numberOrder
      `, { numberOrder : headerOrder.rows[0][0] })

		return { headerOrder, prodsOrder };
	}

	async changePositionOfTelemarketingBtoL({ numberOrder, hours, minutes, seconds, date }){

		let result = await executeQuery(`
			BEGIN

				UPDATE PCEST
				SET QTRESERV = QTRESERV +
				(SELECT PCPEDI.QT
				FROM PCPEDI
				WHERE PCEST.CODPROD = PCPEDI.CODPROD
				AND PCPEDI.NUMPED = :numberOrder)
				WHERE EXISTS (
				SELECT 1
				FROM PCPEDI
				WHERE PCEST.CODPROD = PCPEDI.CODPROD
				AND PCPEDI.NUMPED = :numberOrder);

				UPDATE PCPEDC
				SET POSICAO = 'L',
				DTLIBERA = to_date('${date} ${hours}:${minutes}:${seconds}', 'YYYY-MM-DD HH24:MI:SS'),
				CODFUNCLIBERA = 48,
				HORALIBERA = :hours,
				MINUTOLIBERA = :minutes
				WHERE NUMPED = :numberOrder;

				UPDATE PCPEDI
				SET POSICAO = 'L'
				WHERE NUMPED = :numberOrder;

				COMMIT;
			END;
		`, { hours, minutes, numberOrder })

		return result;
	}

	async changePositionOfBalcaoReservaBtoM({ numberOrder, hours, minutes, seconds, date }){

		let result = await executeQuery(`
		BEGIN

			UPDATE PCEST
			SET QTRESERV = QTRESERV +
			(SELECT PCPEDI.QT
			FROM PCPEDI
			WHERE PCEST.CODPROD = PCPEDI.CODPROD
			AND PCPEDI.NUMPED = :numberOrder)
			WHERE EXISTS (
			SELECT 1
			FROM PCPEDI
			WHERE PCEST.CODPROD = PCPEDI.CODPROD
			AND PCPEDI.NUMPED = :numberOrder);

			UPDATE PCPEDC
			SET POSICAO = 'M',
			DTLIBERA = to_date('${date} ${hours}:${minutes}:${seconds}', 'YYYY-MM-DD HH24:MI:SS'),
			CODFUNCLIBERA = 48,
			HORALIBERA = :hours,
			MINUTOLIBERA = :minutes,
			IMPORTADO = 'N',
			NUMCAR = (SELECT PROXNUMCAR FROM PCCONSUM)
			WHERE NUMPED = :numberOrder;

			UPDATE PCPEDI
			SET POSICAO = 'M'
			WHERE NUMPED = :numberOrder;

			UPDATE PCBLOQUEIOSPEDIDO
			SET DTLIBERA = to_date('${date} ${hours}:${minutes}:${seconds}', 'YYYY-MM-DD HH24:MI:SS'),
			STATUS = 'L',
			CODFUNCLIBERA = 48
			WHERE NUMPED = :numberOrder;

			INSERT INTO PCCARREG (NUMCAR, DTSAIDA, CODMOTORISTA, CODVEICULO, TOTPESO, TOTVOLUME, VLTOTAL, DTFECHA, DESTINO, NUMNOTAS, CODCAIXA, PERCOM, NUMENT, NUMCID, PREVCHEG, DTRETORNO, CODCONF, DT_CANCEL, DATAMON, CODFUNCMON, DATAMAPA, CODFUNCMAPA, NUMVIASMAPA, DTCAIXA, DTFAT, CODFUNCFAT, CODFUNCCANCEL, DATACONF, QTITENS, OBSFATUR, TIPOCARGA, KMINICIAL, KMFINAL, DTSAIDAVEICULO, CODROTAPRINC, NUMDIARIAS, CODFUNCAJUD, PAGCOMMOTMIN, VLVALERETENCAO, HORAFECHA, MINUTOFECHA, NUMCAROL, CONHECFRETE, NUMCAROPERLOG, DTFECHACOMISSMOT, QTCOMBUSTIVEL, BALCAOBAIXADO, OBSDESTINO, VLFRETE, ABASTECIDO, MAPAGERADOWMS, CONHECGERADO, MAPAGERADOWMSPAL, HORAMON, MINUTOMON, QTCAIXAS, NUMCARWMS, VLCOMBUSTIVEL, DTINICIOCHECKOUT, DTFIMCHECKOUT, DATAHORAMAPA, CARGASECUNDARIA, NUMLANCDIARIA, NUMCARBROKER, PERCOMTERC, PERCOMAJUD, TIPOCOMISSAO, VLDIARIA, VLDESPAJUDANTE, LACRE, GEOVOLUMETOTAL, FROTA_PESO, DATACONFFIM, DTINICIALPEND, DTFINALPEND, SEGURADA, CODFILIALSAIDA, CODFUNCMAPACARAGRUPADO, DATAHORAMAPACARAGRUPADO, NUMCARAGRUPADO, NUMVIASCARAGRUPADO, CODMOTORISTACARAGRUPADO, CODVEICULCARAGRUPADO, DATACARAGRUPADO, TRANSFERENCIA, LANCTOCPAGARFECHCOMISS414, DTFECHACOMMOTTRANSB, DTFECHACOMAJUDTRANSB, DTFECHACOMAJUD, CODMOTTRANSBORDO, CODAJUDTRANSBORDO, OBSDESTINOAGRUP, DESTINOAGRUP, OBSACERTO, PERCFRETERETIDO, VLFIXO, VLPED, PERGRIS, VALORKG, CODFUNCCONF, LANCARDESPDESCFINAUTOMATIC, CODFUNCSAIDACAR, CODFUNCRETORNOCAR, SEGUNDOMON, DTEXPORTACAO, OBSEXPORTACAO, CODFUNCAJUD2, CODFUNCAJUD3, CODVEICULO1, CODVEICULO2, NUMONUCARGA, NOMEAPROPRIADOCARGA, DIVISAOCARGA, GRUPOEMBCARGA, QTDTOTALPRODCARGA, PONTOFUGORCARGA, SEGUNDOSFECHA, IDINTEGRACAOMYFROTA, CODTIPOVEICULO, CODPERFILVEICULO, TIPOCALCULOCOMISSAOFRETISTA, CODFUNTIPOCALCCOMISSAOFRETISTA, LIBERA_RETAGUARDA, CODFUNCLIBEROURET, DATALIBEROURET, NUMCARMANIFCONCLUIDOFV, CODFUNCFECHA, OBSFRETE, LANCIMPPRIMPARC, NUMONDA, ORDEMSEP, ORDEMCONF, IDSOFITVIEW, ULTIMASITUACAOCFAT, DATAULTIMASITUACAOCFAT, MAPAPORCARREG, CODBOX, DTULTALTER, DTULTALTERSOFITVIEW)
			VALUES ((SELECT PROXNUMCAR FROM PCCONSUM), to_date('${date}', 'YYYY-MM-DD'), NULL, 0, (SELECT TOTPESO FROM PCPEDC WHERE NUMPED = :numberOrder), 0, (SELECT VLTOTAL FROM PCPEDC WHERE NUMPED = :numberOrder), NULL, 'VENDA BALCAO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, to_date('${date}', 'YYYY-MM-DD'), (SELECT CODEMITENTE FROM PCPEDC WHERE NUMPED = :numberOrder), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, :hours, :minutes, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', NULL, NULL, NULL);

			UPDATE PCCONSUM
			SET PROXNUMCAR = (SELECT PROXNUMCAR FROM PCCONSUM) + 1;

			COMMIT;
		END;
		`, { hours, minutes, numberOrder })

		return result;

	}

	async blockPosition({ numberOrder }){

		let result = await executeQuery(`
		BEGIN

			UPDATE PCEST
			SET QTRESERV = QTRESERV -
			(SELECT PCPEDI.QT
			FROM PCPEDI
			WHERE PCEST.CODPROD = PCPEDI.CODPROD
			AND PCPEDI.NUMPED = :numberOrder)
			WHERE EXISTS (
			SELECT 1
			FROM PCPEDI
			WHERE PCEST.CODPROD = PCPEDI.CODPROD
			AND PCPEDI.NUMPED = :numberOrder);

			UPDATE PCPEDC
			SET POSICAO = 'B'
			WHERE NUMPED = :numberOrder;

			UPDATE PCPEDI
			SET POSICAO = 'B'
			WHERE NUMPED = :numberOrder;

			UPDATE PCPEDI
			SET PERDESC = TRUNC((PTABELA - PVENDA) * 100 / PTABELA, 2)
			WHERE NUMPED = :numberOrder;

			COMMIT;
		END;
		`, { numberOrder })

		return result;

	}

	async modifyAndFix({ numberOrder, position }){

		let result = await executeQuery(`
		BEGIN

			UPDATE PCPEDC
			SET POSICAO = :position
			WHERE NUMPED = :numberOrder;

			UPDATE PCPEDI
			SET POSICAO = :position
			WHERE NUMPED = :numberOrder;

			UPDATE PCPEDI
			SET PERDESC = TRUNC((PTABELA - PVENDA) * 100 / PTABELA, 2)
			WHERE NUMPED = :numberOrder;

			COMMIT;
		END;
		`, { position, numberOrder })

		return result;

	}

	async findByRca({ rca, initialDate, finalDate, position }) {

		let salesOrder;

		if(rca !== 9999) {

			salesOrder = await executeQuery(`
				SELECT
				PCPEDC.NUMPED,
				PCPEDC.ORIGEMPED,
        PCUSUARI.NOME,
        NVL(PCUSUARI.USURDIRFV, 'not-found.png') AS USURDIRFV,
				PCPEDC.DATA,
				PCPEDC.VLATEND,
				PCPEDC.VLTOTAL,
				PCPEDC.VLTABELA,
				ROUND(PCPEDC.PERDESC, 2) AS PERDESC,
				PCPEDC.CODCLI,
				PCCLIENT.CLIENTE,
				NVL(REGEXP_SUBSTR(PCCLIENT.DIRETORIOCLIENTE, '[^\\]+$'), 'not-found.png') AS DIRETORIOCLIENTE,
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
				JOIN PCUSUARI ON PCUSUARI.CODUSUR = PCPEDC.CODUSUR
				WHERE DATA BETWEEN (TO_DATE (:initialDate, 'YYYY-MM-DD')) AND (TO_DATE (:finalDate, 'YYYY-MM-DD'))
				AND PCPEDC.CODUSUR = :rca
				AND POSICAO = :position
			`, { rca, initialDate, finalDate, position })

			return salesOrder
		}

		salesOrder = await executeQuery(`
			SELECT
			PCPEDC.NUMPED,
			PCPEDC.ORIGEMPED,
			PCUSUARI.NOME,
			NVL(PCUSUARI.USURDIRFV, 'not-found.png') AS USURDIRFV,
			PCPEDC.DATA,
			PCPEDC.VLATEND,
			PCPEDC.VLTOTAL,
			PCPEDC.VLTABELA,
			ROUND(PCPEDC.PERDESC, 2) AS PERDESC,
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
			JOIN PCUSUARI ON PCUSUARI.CODUSUR = PCPEDC.CODUSUR
			WHERE DATA BETWEEN (TO_DATE (:initialDate, 'YYYY-MM-DD')) AND (TO_DATE (:finalDate, 'YYYY-MM-DD'))
			AND POSICAO = :position
		`, { initialDate, finalDate, position })

		return salesOrder

	}

	async conferSalesOrder({ numberOrder, dtinitcheckout, dtfinishcheckout, codfunc, codprodsStr }) {

		try {

			await executeQuery(`
				BEGIN

					UPDATE PCPEDC
						SET DTINICIALCHECKOUT = TO_DATE(:dtinitcheckout, 'DD/MM/YYYY HH24:MI:SS'),
						DTFINALCHECKOUT = TO_DATE(:dtfinishcheckout, 'DD/MM/YYYY HH24:MI:SS'),
						DTINICIALSEP = CASE WHEN DTINICIALSEP IS NULL THEN TO_DATE(:dtinitcheckout, 'DD/MM/YYYY HH24:MI:SS') ELSE DTINICIALSEP END,
						DTFINALSEP = CASE WHEN DTFINALSEP IS NULL THEN TO_DATE(:dtfinishcheckout, 'DD/MM/YYYY HH24:MI:SS') ELSE DTFINALSEP END,
						CODFUNCCONF = :codfunc,
						CODFUNCSEP = CASE WHEN CODFUNCSEP IS NULL THEN :codfunc ELSE CODFUNCSEP END
					WHERE PCPEDC.NUMPED = :numberOrder;

					UPDATE PCPEDI
						SET CODFUNCCONF = :codfunc,
						CODFUNCSEP = CASE WHEN CODFUNCSEP IS NULL THEN :codfunc ELSE CODFUNCSEP END,
						DATACONF = TO_DATE(:dtfinishcheckout, 'DD/MM/YYYY HH24:MI:SS'),
						QTSEPARADA = CASE WHEN PCPEDI.CODPROD IN (${codprodsStr}) THEN PCPEDI.QT ELSE 0 END
					WHERE NUMPED = :numberOrder;

					COMMIT;
				END;
			`, { numberOrder, dtinitcheckout, dtfinishcheckout, codfunc });

			return true

	} catch (err) {
		console.error(`ERRO NA CONFERÊNCIA DO PEDIDO ${numberOrder}:`, err);
		return false
	}

	}
}

module.exports = new SalesOrdersRepository()
