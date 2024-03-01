const getConnection = require('./dbConnection');

async function executeQuery(query, binds) {
	const connection = await getConnection();
	const options = {
		autoCommit: true
	}

	try {
		let result;
		if(binds){
			result = await connection.execute(query, binds, options);
		}else{
			result = await connection.execute(query, binds, options);
		}
		return result;
	} catch (error) {
		console.error('Error executing query:', error);
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
