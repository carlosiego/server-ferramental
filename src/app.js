import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import routes from './routes/index.js'
import oracledb from 'oracledb'

let libPath = 'C:\\instantclient';
oracledb.initOracleClient({ libDir: libPath })

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

routes(app)

export default app