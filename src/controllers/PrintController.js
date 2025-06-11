const net = require('net');
const ProductsRepository = require('../repositories/ProductsRepository.js');

class PrintController {

 async printWithPrice(req, res) {

	const { product: prod, numberOfPrints, printer } = req.body;

	const printerIP = {
		store: '192.168.1.114', // LOJA
		warehouse: '192.168.1.113' // DEPOSITO
	}

	let { rows: [ product ]} = await ProductsRepository.findByCode(prod?.CODPROD);

	if(!product) {
		return res.status(404).json({ error: 'Produto não encontrado' });
	}

	product.DESCRICAO = product?.DESCRICAO.replaceAll('"', "'");

	const printerPort = 9100; // Porta padrão para impressoras de rede

	try {
		// Criar uma conexão com a impressora via socket
		const client = new net.Socket();
		client.connect(printerPort, printerIP[printer], () => {
			console.log('Conectado à impressora.');
			client.write(
				`SIZE 2.76,1.18\n
				GAP 0.12,0\n
				DIRECTION 1\n
				CLS\n
				BAR 0,20,700,2\n
				TEXT 20,40,"2",0,1,1,"${product?.DESCRICAO}"\n
				BAR 0,65,700,2\n
				BARCODE 20,90,"128",100,1,0,2,2,"${product?.CODAUXILIAR}"\n
				TEXT 280,110,"2",0,2,2,"R"\n
				TEXT 310,105,"2",0,2,2,"$"\n
				TEXT 340,100,"2",0,2,3,"${product?.PTABELA.toFixed(2).replaceAll('.', ',')}"\n
				TEXT 342,100,"2",0,2,3,"${product?.PTABELA.toFixed(2).replaceAll('.', ',')}"\n
				TEXT 280,170,"3",0,1,1,"CODIGO:${product?.CODPROD}"\n
				TEXT 281,170,"3",0,1,1,"CODIGO:${product?.CODPROD}"\n
				TEXT 280,200,"3",0,1,1,"${product?.EMBALAGEM}"\n
				PRINT ${numberOfPrints}\n`
			, () => {
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

 async printWithoutPrice(req, res) {

	const { product: prod, numberOfPrints, printer } = req.body;

	const printerIP = {
		store: '192.168.1.114', // LOJA
		warehouse: '192.168.1.113' // DEPOSITO
	}

	let { rows: [ product ]} = await ProductsRepository.findByCode(prod?.CODPROD);

	if(!product) {
		return res.status(404).json({ error: 'Produto não encontrado' });
	}

	product.DESCRICAO = product?.DESCRICAO.replaceAll('"', "'");

	const printerPort = 9100; // Porta padrão para impressoras de rede

	try {
		// Criar uma conexão com a impressora via socket
		const client = new net.Socket();
		client.connect(printerPort, printerIP[printer], () => {
			console.log('Conectado à impressora.');
			client.write(
				`SIZE 2.76,1.18\n
				GAP 0.12,0\n
				DIRECTION 1\n
				CLS\n
				TEXT 15,20,"2",0,1,2,"${product?.DESCRICAO}"\n
				BAR 0,65,700,2\n
				BARCODE 25,100,"128",100,1,0,2,2,"${product?.CODAUXILIAR}"\n
				TEXT 290,100,"2",0,2,4,"COD:${product?.CODPROD}"\n
				TEXT 290,180,"3",0,1,1,"${product?.EMBALAGEM}"\n
				PRINT ${numberOfPrints}\n`
			, () => {
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
