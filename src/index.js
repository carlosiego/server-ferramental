require('dotenv').config()
require('express-async-errors')
const express = require('express')
const initializeOracleDB = require('./database/initializeOracleDB')
initializeOracleDB()
const compression = require('compression')
const productsRouter = require('./routes/productsRoutes')
const salesOrdersRouter = require('./routes/salesOrdersRoutes')
const budgetsRouter = require('./routes/budgetsRoutes')
const limit = require('./rateLimit')
const limiter = require('./rateLimit')
const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(limiter)
app.use(compression())
app.use(productsRouter, salesOrdersRouter, budgetsRouter)

app.use((error, req, res, next) => {

  console.log('============= ERROR HANDLER =============')
  console.log(error)
  res.sendStatus(500)

})

app.listen(process.env.PORT, () => {
  console.log(`Servidor escutando em http://${process.env.SERVER_ADDRESS}:${process.env.PORT}`)
})
