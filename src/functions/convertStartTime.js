function convertStartTime(startTime) {
	const date = new Date(startTime);
	return date.toLocaleString('en-US', {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});
}

module.exports = convertStartTime;
