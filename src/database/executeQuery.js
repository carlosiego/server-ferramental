const getConnection = require('./dbConnection');

async function executeQuery(query, binds) {
  const connection = await getConnection();

  try {
    const result = await connection.execute(query, binds);
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
