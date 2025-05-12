const executeQuery = require('../database/executeQuery');

class AddressesRepository {

	async findAllAddresses() {

		let addresses = await executeQuery(`
      SELECT MODULO, RUA, NUMERO, APTO, TIPOENDER, STATUS FROM PCESTEND
    `)

		return addresses;
	}

	async findAddress({ storehouse, street, numberaddress, apartment, typeaddress }) {

		let address = await executeQuery(`
      SELECT MODULO, RUA, NUMERO, APTO, TIPOENDER, STATUS
			FROM PCESTEND
			WHERE MODULO = :storehouse
			AND RUA = :street AND NUMERO = :numberaddress
			AND APTO = :apartment AND TIPOENDER = :typeaddress
    `, { storehouse, street, numberaddress, apartment, typeaddress })

		return address;
	}

	async updateAddress({ code, storehouse, street, numberaddress, apartment, typeaddress }) {

		let result;

		if(typeaddress === 'AP') {

			result = await executeQuery(`
			BEGIN

				UPDATE PCPRODUT
				SET MODULO = :storehouse,
				RUA = :street,
				NUMERO = :numberaddress,
				APTO = :apartment
				WHERE CODPROD = :code;

				COMMIT;
			END;
			`, { code, storehouse, street, numberaddress, apartment })

			return result
		}

		if(typeaddress === 'AE') {

			result = await executeQuery(`
			BEGIN

				UPDATE PCPRODUT
				SET MODULOCX = :storehouse,
				RUACX = :street,
				NUMEROCX = :numberaddress,
				APTOCX = :apartment
				WHERE CODPROD = :code;

				COMMIT;
			END;
			`, { code, storehouse, street, numberaddress, apartment })

			return result
		}
	}

};

module.exports = new AddressesRepository();
