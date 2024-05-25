function hasDataChanged(currentData, newData) {
	let updated = false;

	// Check if each relevant field has changed
	const fieldsToCheck = ['steamId', 'serverStatus', 'startTime', 'version', 'userCount'];
	const updatedData = { ...currentData };

	fieldsToCheck.forEach(field => {
		if (currentData[field] !== newData[field]) {
			updated = true;
			updatedData[field] = newData[field];
		}
	});

	return { updated, currentData: updatedData };
}

module.exports = hasDataChanged;
