const net = require('net');

class PrintController {

 async print(req, res) {

	const { labelData } = req.body;

	if (!labelData) {
		return res.status(400).json({ error: 'Parâmetro ausente: labelData é obrigatório.' });
	}

	const printerIP = '192.168.1.114'; // IP da impressora
	const printerPort = 9100; // Porta padrão para impressoras de rede

	try {
		// Criar uma conexão com a impressora via socket
		const client = new net.Socket();
		client.connect(printerPort, printerIP, () => {
			console.log('Conectado à impressora.');
			client.write(labelData, () => {
				console.log('Dados enviados para impressão.');
				client.end();
				res.status(200).json({ message: 'Impressão enviada com sucesso!' });
			});
		});

		client.on('error', (err) => {
			console.error('Erro na conexão com a impressora:', err);
			res.status(500).json({ error: 'Erro ao enviar para a impressora.', details: err.message });
		});

	client.on('close', () => {
		console.log('Conexão com a impressora encerrada.');
	});
	} catch (err) {
		console.error('Erro inesperado:', err);
		res.status(500).json({ error: 'Erro inesperado ao processar a solicitação.' });
	}

	};

}

module.exports = new PrintController();
