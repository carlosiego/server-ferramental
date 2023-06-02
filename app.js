require('dotenv').config()
const express = require('express')
const oracledb = require('oracledb')
const fs = require('fs')

const productsRouter = require('./src/routes/productsRoutes')
const ordersRouter = require('./src/routes/ordersRoutes')
const budgetsRouter = require('./src/routes/budgetsRoutes')

let libPath;
if (process.platform === 'win32') {           // Windows
  libPath = 'C:\\instantclient';
} else if (process.platform === 'linux') {   // Linux
  libPath = process.env.HOME + '/Documentos/instantclient_linux';
}

if (libPath && fs.existsSync(libPath)) {
  oracledb.initOracleClient({ libDir: libPath });
  console.log('Instant oracle inited with sucess !')
}

const app = express()

app.use(express.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(productsRouter, ordersRouter, budgetsRouter)

module.exports = app