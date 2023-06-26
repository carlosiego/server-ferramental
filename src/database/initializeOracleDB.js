const oracledb = require('oracledb')
const fs = require('fs')
const path = require('path')

function initializeOracleDB() {
    let libPath;
    if (process.platform === 'win32') {           // Windows
      libPath = path.resolve('C:', 'oracle', 'instantclient');
    } else if (process.platform === 'linux') {   // Linux
      libPath = path.resolve('/', 'home', process.env.USER_SERVER, 'oracle', 'instantclient_linux');
    }
  
    if (libPath && fs.existsSync(libPath)) {
      oracledb.initOracleClient({ libDir: libPath });
      console.log('Instant oracle inited with success!');
    }
}

module.exports = initializeOracleDB
