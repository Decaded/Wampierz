const axios = require('axios');
const setStatus = require('./setStatus');
const hasDataChanged = require('./hasDataChanged');
const createStatusEmbed = require('./createStatusEmbed');
const updateStatusMessage = require('./updateStatusMessage');
const convertStartTime = require('./convertStartTime');

async function checkForUpdates(client) {
	try {
		const settings = client.db.get('settings');
		const apiUrl = settings.apiUrl;

		const updateChannel = settings.updateChannel ? await client.channels.fetch(settings.updateChannel) : null;

		if (!apiUrl) {
			const embed = await createStatusEmbed('Server Status', 'API URL is not set. Please set it using the `/setapiurl` command.', [], 0xff0000);
			await updateStatusMessage(updateChannel, embed, settings, client);
			return;
		}

		const response = await axios.get(apiUrl);
		const serverData = response.data;

		if (!serverData || !serverData.steamId) {
			const embed = await createStatusEmbed('Server Status', 'Invalid API response: Missing or invalid server data.', [], 0xff0000);
			await updateStatusMessage(updateChannel, embed, settings, client);
			return;
		}

		const currentData = client.db.get('steamId') || {};
		let { updated, currentData: updatedData } = hasDataChanged(currentData, serverData);

		if (client.db.get('errorState').hasError) {
			client.db.set('errorState', { hasError: false });
			updated = true;
		}

		// Update the database if anything has changed
		if (updated) {
			client.db.set('steamId', updatedData);

			const readableStartTime = convertStartTime(serverData.startTime);

			const embed = await createStatusEmbed(
				'Server Status',
				' ',
				[
					{ name: 'Status', value: serverData.serverStatus, inline: true },
					{ name: 'Steam ID', value: serverData.steamId, inline: true },
					{ name: '\u200B', value: '\u200B', inline: false },
					{ name: 'Start Time', value: readableStartTime, inline: true },
					{ name: 'Users Online', value: serverData.userCount, inline: true },
					{ name: '\u200B', value: '\u200B', inline: false },
					{ name: 'Server Version', value: serverData.version, inline: false },
				],
				serverData.serverStatus === 'ONLINE' ? 0x00ff00 : 0xff0000,
			);
			await updateStatusMessage(updateChannel, embed, settings, client);

			await setStatus(client, `SteamID: ${serverData.steamId}`, 'online');
		}
	} catch (error) {
		console.error('Error fetching or processing data:', error);
		const settings = client.db.get('settings');
		if (!client.db.get('errorState').hasError) {
			client.db.set('errorState', { hasError: true });
			if (settings.updateChannel) {
				const channel = await client.channels.fetch(settings.updateChannel);
				const embed = await createStatusEmbed('Server Status', `Error fetching data from API: ${error.message}`, [], 0xff0000);
				await updateStatusMessage(channel, embed, settings, client);
			}
		}
		await setStatus(client, 'Error fetching data from API', 'dnd');
	}
}

module.exports = checkForUpdates;
