require('dotenv').config()
require('express-async-errors')
const express = require('express')
const oracledb = require('oracledb')
const fs = require('fs')

const productsRouter = require('./routes/productsRoutes')
const salesOrdersRouter = require('./routes/salesOrdersRoutes')
const budgetsRouter = require('./routes/budgetsRoutes')

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
app.use(productsRouter, salesOrdersRouter, budgetsRouter)
app.use((error, req, res, next) => {
  console.log('============= ERROR HANDLER =============')
  console.log(error)
  res.sendStatus(500)
})

app.listen(process.env.PORT, () => {
  console.log(`Servidor escutando em http://${process.env.SERVER_ADDRESS}:${process.env.PORT}`)
})
