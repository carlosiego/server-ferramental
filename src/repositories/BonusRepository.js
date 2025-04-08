const executeQuery = require('../database/executeQuery')

class BonusRepository {

	async findBonus() {

		let bonus = await executeQuery(`
			SELECT
				PCBONUSC.NUMBONUS,
				PCBONUSC.DATABONUS,
				PCBONUSC.VALORTOTAL,
				PCBONUSC.DTMONTAGEM,
				PCNFENTPREENT.NUMNOTA,
				PCFORNEC.FORNECEDOR
			FROM PCBONUSC
			JOIN PCNFENTPREENT ON PCNFENTPREENT.NUMBONUS = PCBONUSC.NUMBONUS
			JOIN PCFORNEC ON PCNFENTPREENT.CODFORNEC = PCFORNEC.CODFORNEC
			WHERE PCBONUSC.DTFECHAMENTO IS NULL AND PCBONUSC.DTCANCEL IS NULL
			ORDER BY PCBONUSC.DTMONTAGEM ASC
		`)

		return bonus
	}

}

module.exports = new BonusRepository()
