const executeQuery = require('../database/executeQuery')

class SalesOrdersRepository {

	async findByNumOrder(numberOrder) {

		let headerOrder = await executeQuery(`
      SELECT
        PCPEDC.NUMPED,
        PCPEDC.ORIGEMPED,
				PCUSUARI.CODUSUR,
        PCUSUARI.NOME,
        NVL(PCUSUARI.USURDIRFV, 'not-found.png') AS USURDIRFV,
        PCPEDC.DATA,
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

			INSERT INTO FMETAL.PCCARREG (NUMCAR, DTSAIDA, CODMOTORISTA, CODVEICULO, TOTPESO, TOTVOLUME, VLTOTAL, DTFECHA, DESTINO, NUMNOTAS, CODCAIXA, PERCOM, NUMENT, NUMCID, PREVCHEG, DTRETORNO, CODCONF, DT_CANCEL, DATAMON, CODFUNCMON, DATAMAPA, CODFUNCMAPA, NUMVIASMAPA, DTCAIXA, DTFAT, CODFUNCFAT, CODFUNCCANCEL, DATACONF, QTITENS, OBSFATUR, TIPOCARGA, KMINICIAL, KMFINAL, DTSAIDAVEICULO, CODROTAPRINC, NUMDIARIAS, CODFUNCAJUD, PAGCOMMOTMIN, VLVALERETENCAO, HORAFECHA, MINUTOFECHA, NUMCAROL, CONHECFRETE, NUMCAROPERLOG, DTFECHACOMISSMOT, QTCOMBUSTIVEL, BALCAOBAIXADO, OBSDESTINO, VLFRETE, ABASTECIDO, MAPAGERADOWMS, CONHECGERADO, MAPAGERADOWMSPAL, HORAMON, MINUTOMON, QTCAIXAS, NUMCARWMS, VLCOMBUSTIVEL, DTINICIOCHECKOUT, DTFIMCHECKOUT, DATAHORAMAPA, CARGASECUNDARIA, NUMLANCDIARIA, NUMCARBROKER, PERCOMTERC, PERCOMAJUD, TIPOCOMISSAO, VLDIARIA, VLDESPAJUDANTE, LACRE, GEOVOLUMETOTAL, FROTA_PESO, DATACONFFIM, DTINICIALPEND, DTFINALPEND, SEGURADA, CODFILIALSAIDA, CODFUNCMAPACARAGRUPADO, DATAHORAMAPACARAGRUPADO, NUMCARAGRUPADO, NUMVIASCARAGRUPADO, CODMOTORISTACARAGRUPADO, CODVEICULCARAGRUPADO, DATACARAGRUPADO, TRANSFERENCIA, LANCTOCPAGARFECHCOMISS414, DTFECHACOMMOTTRANSB, DTFECHACOMAJUDTRANSB, DTFECHACOMAJUD, CODMOTTRANSBORDO, CODAJUDTRANSBORDO, OBSDESTINOAGRUP, DESTINOAGRUP, OBSACERTO, PERCFRETERETIDO, VLFIXO, VLPED, PERGRIS, VALORKG, CODFUNCCONF, LANCARDESPDESCFINAUTOMATIC, CODFUNCSAIDACAR, CODFUNCRETORNOCAR, SEGUNDOMON, DTEXPORTACAO, OBSEXPORTACAO, CODFUNCAJUD2, CODFUNCAJUD3, CODVEICULO1, CODVEICULO2, NUMONUCARGA, NOMEAPROPRIADOCARGA, DIVISAOCARGA, GRUPOEMBCARGA, QTDTOTALPRODCARGA, PONTOFUGORCARGA, SEGUNDOSFECHA, IDINTEGRACAOMYFROTA, CODTIPOVEICULO, CODPERFILVEICULO, TIPOCALCULOCOMISSAOFRETISTA, CODFUNTIPOCALCCOMISSAOFRETISTA, LIBERA_RETAGUARDA, CODFUNCLIBEROURET, DATALIBEROURET, NUMCARMANIFCONCLUIDOFV, CODFUNCFECHA, OBSFRETE, LANCIMPPRIMPARC, NUMONDA, ORDEMSEP, ORDEMCONF, IDSOFITVIEW, ULTIMASITUACAOCFAT, DATAULTIMASITUACAOCFAT, MAPAPORCARREG, CODBOX, DTULTALTER, DTULTALTERSOFITVIEW)
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
				PCPEDC.DATA,
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
				WHERE DATA BETWEEN (TO_DATE (:initialDate, 'YYYY-MM-DD')) AND (TO_DATE (:finalDate, 'YYYY-MM-DD'))
				AND CODUSUR = :rca
				AND POSICAO = :position
			`, { rca, initialDate, finalDate, position })

			return salesOrder
		}

		salesOrder = await executeQuery(`
			SELECT
			PCPEDC.NUMPED,
			PCPEDC.ORIGEMPED,
			PCPEDC.DATA,
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
			WHERE DATA BETWEEN (TO_DATE (:initialDate, 'YYYY-MM-DD')) AND (TO_DATE (:finalDate, 'YYYY-MM-DD'))
			AND POSICAO = :position
		`, { initialDate, finalDate, position })

		return salesOrder

	}
}

module.exports = new SalesOrdersRepository()
