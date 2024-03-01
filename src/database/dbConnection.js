const oracledb = require('oracledb')
const dbConfig = require('./config')

async function getConnection() {
	try {
		await oracledb.createPool(dbConfig)

		const connection = await oracledb.getConnection();
		return connection;
	} catch (error) {
		console.error('Erro ao estabelecer conexão com o banco de dados: ', error);
	}
}

module.exports = getConnection;
