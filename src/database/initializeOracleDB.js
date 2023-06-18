const oracledb = require('oracledb')
const fs = require('fs')

function initializeOracleDB() {
    let libPath;
    if (process.platform === 'win32') {           // Windows
      libPath = 'C:\\instantclient';
    } else if (process.platform === 'linux') {   // Linux
      libPath = process.env.HOME + '/Documentos/instantclient_linux';
    }
  
    if (libPath && fs.existsSync(libPath)) {
      oracledb.initOracleClient({ libDir: libPath });
      console.log('Instant oracle inited with success!');
    }
}

module.exports = initializeOracleDB