function isDate(dataStr) {
	let isDate = /\d{4}-\d{2}-\d{2}/.test(dataStr);
	return isDate;
}

function isValidDateTimeFormat(dateTimeStr) {
	const regex = /^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4} ([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
	return regex.test(dateTimeStr);
}

module.exports = { isDate, isValidDateTimeFormat }
