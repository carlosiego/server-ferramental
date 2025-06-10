const getConnection = require('./dbConnection');
const oracledb = require('oracledb')

async function executeQuery(query, binds = []) {
	const connection = await getConnection();

	try {

		let result = await connection.execute(query, binds, { outFormat: oracledb.OBJECT });

		return result;

	} catch (error) {
		console.error('Error executing query:', error);
		return error;
	} finally {
		if (connection) {
			try {
				await connection.close();
			} catch (error) {
				console.error('Error closing connection:', error);
			}
		}
	}
}

module.exports = executeQuery;
