import app from './app.js'

app.listen(process.env.PORT, () => {
    console.log(`Servidor escutando em http://${process.env.SERVER_ADDRESS}:${process.env.PORT}`)
})