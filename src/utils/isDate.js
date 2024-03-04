function isDate(dataStr) {
	let isDate = /\d{4}-\d{2}-\d{2}/.test(dataStr);
	return isDate;
}

module.exports = isDate
