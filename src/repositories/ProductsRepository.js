const executeQuery = require('../database/executeQuery');

class ProductsRepository {

	async findByCode(code) {

		let product = await executeQuery(`
      SELECT
        PCPRODUT.DESCRICAO,
        PCTABPR.PTABELA,
        PCEST.DTULTENT,
        PCEST.DTULTSAIDA,
        PCEST.QTULTENT,
        (PCEST.QTESTGER - PCEST.QTRESERV - PCEST.QTPENDENTE) AS QTDISPONIVEL,
        PCEST.QTESTGER,
        PCEST.QTRESERV,
        PCPRODUT.EMBALAGEM,
        PCPRODUT.CODPROD,
        PCPRODUT.CODAUXILIAR
      FROM PCPRODUT
        JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
        JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
      WHERE PCPRODUT.CODPROD = :code AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL'
      `, { code })

		return product;
	}

	async findByDescription(description, orderBy = 'ASC') {

		description = description.toUpperCase()
		description = description.replaceAll(' ', '%')
		description = description.endsWith('%') ? description : description + '%'

		let direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
		console.log(description)

		let produtcs = await executeQuery(`
          SELECT
            PCPRODUT.DESCRICAO,
            PCTABPR.PTABELA,
            PCEST.DTULTENT,
            PCEST.DTULTSAIDA,
            PCEST.QTULTENT,
            (PCEST.QTESTGER - PCEST.QTRESERV - PCEST.QTPENDENTE) AS QTDISPONIVEL,
            PCEST.QTESTGER,
            PCEST.QTRESERV,
            PCPRODUT.EMBALAGEM,
            PCPRODUT.CODPROD,
            PCPRODUT.CODAUXILIAR
          FROM PCPRODUT
            JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
            JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
          WHERE PCPRODUT.DESCRICAO LIKE :description AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL'
          ORDER BY PCPRODUT.DESCRICAO ${direction}
          `, { description })

		return produtcs;
	}

	async findByCodeBar(codeBar) {

		let produtc = await executeQuery(`
      SELECT
        PCPRODUT.DESCRICAO,
        PCTABPR.PTABELA,
        PCEST.DTULTENT,
        PCEST.DTULTSAIDA,
        PCEST.QTULTENT,
        (PCEST.QTESTGER - PCEST.QTRESERV - PCEST.QTPENDENTE) AS QTDISPONIVEL,
        PCEST.QTESTGER,
        PCEST.QTRESERV,
        PCPRODUT.EMBALAGEM,
        PCPRODUT.CODPROD,
        PCPRODUT.CODAUXILIAR
      FROM PCPRODUT
      JOIN PCTABPR ON PCTABPR.CODPROD = PCPRODUT.CODPROD
      JOIN PCEST ON PCEST.CODPROD = PCPRODUT.CODPROD
      WHERE PCPRODUT.CODAUXILIAR = :codebar AND PCPRODUT.REVENDA != 'N' AND PCPRODUT.OBS2 != 'FL'
    `, { codeBar })

		return produtc;
	}

};

module.exports = new ProductsRepository();
