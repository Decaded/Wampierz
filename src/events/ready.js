const checkForUpdates = require('../functions/checkForUpdates');
const registerCommands = require('../functions/registerCommands');
const setStatus = require('../functions/setStatus');
const { GUILD_ID } = require('../config');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Logged in as ${client.user.tag}!`);

		const settings = client.db.get('settings');
		await registerCommands(GUILD_ID);

		if (settings.interval !== null) {
			setInterval(() => {
				checkForUpdates(client);
			}, settings.interval);
		}

		// Initial presence status
		await setStatus(client, 'Starting up...', 'idle');
	},
};
