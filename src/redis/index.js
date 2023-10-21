const { createClient } = require('redis')
const client = createClient()

const startup = async () => await client.connect()
    client.on('error', (err) => {
        console.error('Erro no client Redis: ' + err)
        process.exit(1)
})

startup()

module.exports = client