const executeQuery = require('../database/executeQuery');

class ProductsRepository {

	async findByCode(code) {

		let product = await executeQuery(`
      SELECT
        PCPRODUT.CODPROD,
        PCPRODUT.DESCRICAO,
        PCTABPR.PTABELA,
				PCPRODUT.CODTABLIT,
        PCEST.DTULTENT,
        PCEST.DTULTSAIDA,
        PCEST.QTULTENT,
        (PCEST.QTESTGER - PCEST.QTBLOQUEADA - PCEST.QTRESERV ) AS QTDISPONIVEL,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN TRUNC((PCTABPR.PTABELA - (PCTABPR.PTABELA * (PCDESCONTO.PERCDESC / 100))), 2)
					ELSE NULL
				END AS VALORCOMDESCONTO,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN TRUNC(PCDESCONTO.PERCDESC, 2)
					ELSE NULL
				END AS DESCONTO,
				PCEST.ESTMIN,
        PCEST.QTESTGER,
        PCEST.QTRESERV,
        PCPRODUT.EMBALAGEM,
        PCPRODUT.CODAUXILIAR,
				PCPRODUT.CODFAB,
				PCPRODUT.CODNCMEX,
        PCDESCONTO.DTINICIO AS DTINICIODESCONTO,
        PCDESCONTO.DTFIM AS DTFIMDESCONTO,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN 1
					ELSE 0
				END AS TEMPROMOCAO,
        PCPRODUT.INFORMACOESTECNICAS,
		PCPRODUT.CODFORNEC,
		PCFORNEC.FORNECEDOR,
		NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD
      FROM PCPRODUT
        JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
        JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
				JOIN PCFORNEC ON PCFORNEC.CODFORNEC = PCPRODUT.CODFORNEC
        LEFT JOIN PCDESCONTO ON PCDESCONTO.CODPROD = PCPRODUT.CODPROD
      	WHERE PCPRODUT.CODPROD = :code AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL' ORDER BY PCDESCONTO.DTFIM DESC
      `, { code })

		return product;
	}

	async findByDescription(description, orderBy = 'ASC') {

		description = description.toUpperCase()
		description = description.replaceAll(' ', '%')
		description = description.endsWith('%') ? description : description + '%'

		let direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

		let products = await executeQuery(`
			SELECT
				PCPRODUT.CODPROD,
				PCPRODUT.DESCRICAO,
				PCTABPR.PTABELA,
				PCEST.DTULTENT,
				PCPRODUT.CODTABLIT,
				PCEST.DTULTSAIDA,
				PCEST.QTULTENT,
				(PCEST.QTESTGER - PCEST.QTBLOQUEADA - PCEST.QTRESERV ) AS QTDISPONIVEL,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN TRUNC((PCTABPR.PTABELA - (PCTABPR.PTABELA * (PCDESCONTO.PERCDESC / 100))), 2)
					ELSE NULL
				END AS VALORCOMDESCONTO,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN TRUNC(PCDESCONTO.PERCDESC, 2)
					ELSE NULL
				END AS DESCONTO,
				PCEST.ESTMIN,
				PCEST.QTESTGER,
				PCEST.QTRESERV,
				PCPRODUT.EMBALAGEM,
				PCPRODUT.CODAUXILIAR,
				PCPRODUT.CODFAB,
				PCPRODUT.CODNCMEX,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN 1
					ELSE 0
				END AS TEMPROMOCAO,
				PCDESCONTO.DTINICIO AS DTINICIODESCONTO,
				PCDESCONTO.DTFIM AS DTFIMDESCONTO,
				PCPRODUT.INFORMACOESTECNICAS,
				PCPRODUT.CODFORNEC,
				PCFORNEC.FORNECEDOR,
				NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD
			FROM PCPRODUT
				JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
				JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
				JOIN PCFORNEC ON PCFORNEC.CODFORNEC = PCPRODUT.CODFORNEC
				LEFT JOIN PCDESCONTO ON PCDESCONTO.CODPROD = PCPRODUT.CODPROD
				WHERE PCPRODUT.DESCRICAO LIKE :description AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL'
				ORDER BY PCPRODUT.DESCRICAO ${direction}
			`, { description })

		return products;
	}

	async findMinimumByDescription(description, orderBy = 'ASC') {

		description = description.toUpperCase()
		description = description.replaceAll(' ', '%')
		description = description.endsWith('%') ? description : description + '%'

		let direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

		let products = await executeQuery(`
			SELECT
				PCPRODUT.CODPROD,
				PCPRODUT.DESCRICAO,
				PCPRODUT.CODAUXILIAR,
				PCPRODUT.CODTABLIT,
				PCTABPR.PTABELA,
				(PCEST.QTESTGER - PCEST.QTBLOQUEADA - PCEST.QTRESERV ) AS QTDISPONIVEL,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN TRUNC((PCTABPR.PTABELA - (PCTABPR.PTABELA * (PCDESCONTO.PERCDESC / 100))), 2)
					ELSE NULL
				END AS VALORCOMDESCONTO,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN TRUNC(PCDESCONTO.PERCDESC, 2)
					ELSE NULL
				END AS DESCONTO,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN 1
					ELSE 0
				END AS TEMPROMOCAO,
				PCPRODUT.EMBALAGEM,
				NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD
			FROM PCPRODUT
				JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
				JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
				LEFT JOIN PCDESCONTO ON PCDESCONTO.CODPROD = PCPRODUT.CODPROD
				WHERE PCPRODUT.DESCRICAO LIKE :description AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL'
				ORDER BY PCPRODUT.DESCRICAO ${direction}
			`, { description })

		return products;
	}

	async findByCodeBar(codeBar) {

		let produtc = await executeQuery(`
      SELECT
				PCPRODUT.CODPROD,
        PCPRODUT.DESCRICAO,
        PCTABPR.PTABELA,
				PCPRODUT.CODTABLIT,
        PCEST.DTULTENT,
        PCEST.DTULTSAIDA,
        PCEST.QTULTENT,
        (PCEST.QTESTGER - PCEST.QTBLOQUEADA - PCEST.QTRESERV ) AS QTDISPONIVEL,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN TRUNC((PCTABPR.PTABELA - (PCTABPR.PTABELA * (PCDESCONTO.PERCDESC / 100))), 2)
					ELSE NULL
				END AS VALORCOMDESCONTO,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN TRUNC(PCDESCONTO.PERCDESC, 2)
					ELSE NULL
				END AS DESCONTO,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN 1
					ELSE 0
				END AS TEMPROMOCAO,
				PCEST.ESTMIN,
        PCEST.QTESTGER,
        PCEST.QTRESERV,
        PCPRODUT.EMBALAGEM,
        PCPRODUT.CODAUXILIAR,
				PCPRODUT.CODFAB,
				PCPRODUT.CODNCMEX,
				PCDESCONTO.DTINICIO AS DTINICIODESCONTO,
				PCDESCONTO.DTFIM AS DTFIMDESCONTO,
				PCPRODUT.INFORMACOESTECNICAS,
				PCPRODUT.CODFORNEC,
				PCFORNEC.FORNECEDOR,
				NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD
      FROM PCEMBALAGEM
      JOIN PCPRODUT ON PCPRODUT.CODPROD = PCEMBALAGEM.CODPROD
			JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
			JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
			JOIN PCFORNEC ON PCFORNEC.CODFORNEC = PCPRODUT.CODFORNEC
			LEFT JOIN PCDESCONTO ON PCDESCONTO.CODPROD = PCPRODUT.CODPROD
      WHERE PCEMBALAGEM.CODAUXILIAR = :codebar AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL' ORDER BY PCDESCONTO.DTFIM DESC
    `, { codeBar })

		return produtc;
	}

	async findMinimumByCodeBar(codeBar) {

		let produtc = await executeQuery(`
      SELECT
				PCPRODUT.CODPROD,
        PCPRODUT.DESCRICAO,
        PCTABPR.PTABELA,
				PCPRODUT.CODTABLIT,
				PCPRODUT.CODAUXILIAR,
        (PCEST.QTESTGER - PCEST.QTBLOQUEADA - PCEST.QTRESERV ) AS QTDISPONIVEL,
        PCPRODUT.EMBALAGEM,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN TRUNC((PCTABPR.PTABELA - (PCTABPR.PTABELA * (PCDESCONTO.PERCDESC / 100))), 2)
					ELSE NULL
				END AS VALORCOMDESCONTO,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN TRUNC(PCDESCONTO.PERCDESC, 2)
					ELSE NULL
				END AS DESCONTO,
				CASE
					WHEN CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM THEN 1
					ELSE 0
				END AS TEMPROMOCAO,
				NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD
      FROM PCEMBALAGEM
      JOIN PCPRODUT ON PCPRODUT.CODPROD = PCEMBALAGEM.CODPROD
			JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
			JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
			LEFT JOIN PCDESCONTO ON PCDESCONTO.CODPROD = PCPRODUT.CODPROD
      WHERE PCEMBALAGEM.CODAUXILIAR = :codebar AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL'
    `, { codeBar })

		return produtc;
	}

	async findBySection(codeSection) {

		let products = await executeQuery(`
		SELECT
			PCPRODUT.CODPROD,
			PCPRODUT.DESCRICAO,
			PCTABPR.PTABELA,
			PCPRODUT.CODTABLIT,
			PCEST.DTULTENT,
			PCEST.DTULTSAIDA,
			PCEST.QTULTENT,
			(PCEST.QTESTGER - PCEST.QTBLOQUEADA - PCEST.QTRESERV ) AS QTDISPONIVEL,
			TRUNC((PCTABPR.PTABELA - (PCTABPR.PTABELA * (PCDESCONTO.PERCDESC / 100))), 2) AS VALORCOMDESCONTO,
			PCEST.ESTMIN,
			PCEST.QTESTGER,
			PCEST.QTRESERV,
			PCPRODUT.EMBALAGEM,
			PCPRODUT.CODAUXILIAR,
			PCPRODUT.CODFAB,
			PCPRODUT.CODNCMEX,
			TRUNC(PCDESCONTO.PERCDESC, 2) AS DESCONTO,
			PCDESCONTO.DTINICIO AS DTINICIODESCONTO,
			PCDESCONTO.DTFIM AS DTFIMDESCONTO,
			PCPRODUT.INFORMACOESTECNICAS,
			PCPRODUT.CODFORNEC,
			PCFORNEC.FORNECEDOR
		FROM PCPRODUT
		JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
		JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
		JOIN PCFORNEC ON PCFORNEC.CODFORNEC = PCPRODUT.CODFORNEC
		LEFT JOIN PCDESCONTO ON PCDESCONTO.CODPROD = PCPRODUT.CODPROD
		WHERE PCPRODUT.CODSEC = :codesection AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL'
	`, { codeSection })

	return products;
	}

	async findMinimumBySection(codeSection) {

		let products = await executeQuery(`
		SELECT
			PCPRODUT.CODPROD,
			PCPRODUT.DESCRICAO,
			PCPRODUT.CODAUXILIAR,
			PCTABPR.PTABELA,
			PCPRODUT.CODTABLIT,
			(PCEST.QTESTGER - PCEST.QTBLOQUEADA - PCEST.QTRESERV ) AS QTDISPONIVEL,
			PCPRODUT.EMBALAGEM,
			NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD
		FROM PCPRODUT
		JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
		JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
		WHERE PCPRODUT.CODSEC = :codesection AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL'
	`, { codeSection })

	return products;
	}

	async findPromotions() {

		let promotions = await executeQuery(`
			SELECT
				PCPRODUT.CODPROD,
				PCPRODUT.DESCRICAO,
				PCTABPR.PTABELA,
				PCPRODUT.CODTABLIT,
				PCEST.DTULTENT,
				PCEST.DTULTSAIDA,
				PCEST.QTULTENT,
				(PCEST.QTESTGER - PCEST.QTBLOQUEADA - PCEST.QTRESERV ) AS QTDISPONIVEL,
				PCEST.ESTMIN,
				PCEST.QTESTGER,
				PCEST.QTRESERV,
				PCPRODUT.EMBALAGEM,
				PCPRODUT.CODAUXILIAR,
				PCPRODUT.CODFAB,
				PCPRODUT.CODNCMEX,
				TRUNC(PCDESCONTO.PERCDESC, 2) AS DESCONTO,
				TRUNC((PCTABPR.PTABELA - (PCTABPR.PTABELA * (PCDESCONTO.PERCDESC / 100))), 2) AS VALORCOMDESCONTO,
				PCDESCONTO.DTINICIO AS DTINICIODESCONTO,
				PCDESCONTO.DTFIM AS DTFIMDESCONTO,
				1 AS TEMPROMOCAO,
				PCPRODUT.INFORMACOESTECNICAS,
				PCPRODUT.CODFORNEC,
				PCFORNEC.FORNECEDOR,
				NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD
			FROM PCDESCONTO
			JOIN PCTABPR ON PCTABPR.CODPROD = PCDESCONTO.CODPROD
			JOIN PCPRODUT ON PCPRODUT.CODPROD = PCDESCONTO.CODPROD
			JOIN PCEST ON PCEST.CODPROD = PCDESCONTO.CODPROD
			JOIN PCFORNEC ON PCFORNEC.CODFORNEC = PCPRODUT.CODFORNEC
			WHERE PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL' AND CURRENT_DATE BETWEEN PCDESCONTO.DTINICIO AND PCDESCONTO.DTFIM
		`)

		return promotions
	}

	async findEstMinBySupplier(code) {

		let result = await executeQuery(`
		SELECT
			PCPRODUT.CODPROD,
			PCPRODUT.DESCRICAO,
			PCTABPR.PTABELA,
			PCEST.DTULTENT,
			PCPRODUT.CODTABLIT,
			PCEST.DTULTSAIDA,
			PCEST.QTULTENT,
			(PCEST.QTESTGER - PCEST.QTBLOQUEADA - PCEST.QTRESERV ) AS QTDISPONIVEL,
			PCEST.ESTMIN,
			PCEST.QTESTGER,
			PCEST.QTRESERV,
			PCPRODUT.EMBALAGEM,
			PCPRODUT.CODAUXILIAR,
			PCPRODUT.CODFAB,
			PCPRODUT.CODNCMEX,
			TRUNC(PCDESCONTO.PERCDESC, 2) AS DESCONTO,
			PCDESCONTO.DTINICIO AS DTINICIODESCONTO,
			PCDESCONTO.DTFIM AS DTFIMDESCONTO,
			PCPRODUT.INFORMACOESTECNICAS,
			PCPRODUT.CODFORNEC,
			PCFORNEC.FORNECEDOR,
			NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD
		FROM PCPRODUT
			JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
			JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
			JOIN PCFORNEC ON PCFORNEC.CODFORNEC = PCPRODUT.CODFORNEC
			LEFT JOIN PCDESCONTO ON PCDESCONTO.CODPROD = PCPRODUT.CODPROD
			WHERE PCFORNEC.CODFORNEC = :code AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL' AND
			(PCEST.QTESTGER - PCEST.QTRESERV - PCEST.QTPENDENTE) <= PCEST.ESTMIN
		`, { code })

		return result;

	}

	async findMoreCodAuxiliar(code) {
		let result = await executeQuery(`
			SELECT LISTAGG(CODAUXILIAR, ', ') WITHIN GROUP (ORDER BY CODAUXILIAR) AS CODAUXILIAR_CONCATENADO
			FROM PCEMBALAGEM
			WHERE CODPROD = :code
			`, { code })

			return result;
	}

};

module.exports = new ProductsRepository();
