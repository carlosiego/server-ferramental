const executeQuery = require('../database/executeQuery')

class BudgetsRepository {

	async findByNumber(numberBudget) {

		let headersBudget = await executeQuery(`
      SELECT
        PCORCAVENDAC.CODCLI,
        PCORCAVENDAC.DATA,
        PCORCAVENDAC.VLTOTAL,
        PCORCAVENDAC.VLTABELA,
        PCORCAVENDAC.PERDESC,
        PCORCAVENDAC.CLIENTE,
        PCORCAVENDAC.CNPJ,
        PCORCAVENDAC.OBS
      FROM PCORCAVENDAC
      WHERE PCORCAVENDAC.NUMORCA = :numberBudget
    `, { numberBudget })

		let prodsBudget = await executeQuery(`
      SELECT
        PCORCAVENDAI.CODPROD,
        PCPRODUT.DESCRICAO,
        PCORCAVENDAI.QT,
        PCPRODUT.EMBALAGEM,
				PCORCAVENDAI.PTABELA,
        PCORCAVENDAI.PVENDA,
				PCORCAVENDAI.PERDESC,
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
        PCPRODUT.CODNCMEX,
        NVL(REGEXP_SUBSTR(PCPRODUT.DIRFOTOPROD, '[^\\]+$'), 'not-found.png') AS DIRFOTOPROD
      FROM PCORCAVENDAI
      JOIN PCPRODUT ON PCPRODUT.CODPROD = PCORCAVENDAI.CODPROD
      WHERE PCORCAVENDAI.NUMORCA = :numberBudget
    `, { numberBudget })

		return [headersBudget, prodsBudget];

	}
}

module.exports = new BudgetsRepository()
