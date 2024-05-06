const getConnection = require('./dbConnection');

async function executeQuery(query, binds) {
	const connection = await getConnection();

	try {
		let result;
		if(binds){
			result = await connection.execute(query, binds);
		}else{
			result = await connection.execute(query);
		}
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
