function hasDataChanged(currentData, newData) {
	let updated = false;

	if (currentData.steamId !== newData.steamId) {
			currentData.steamId = newData.steamId;
			updated = true;
	}

	if (currentData.serverStatus !== newData.serverStatus) {
			currentData.serverStatus = newData.serverStatus;
			updated = true;
	}

	if (currentData.startTime !== newData.startTime) {
			currentData.startTime = newData.startTime;
			updated = true;
	}

	if (currentData.version !== newData.version) {
			currentData.version = newData.version;
			updated = true;
	}

	return { updated, currentData };
}

module.exports = hasDataChanged;
