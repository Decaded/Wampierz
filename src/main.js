const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const NyaDB = require('@decaded/nyadb');
const axios = require('axios');
const dotenv = require('dotenv-safe');
dotenv.config({
	example: '.env.example',
	allowEmptyValues: true,
});

const guildId = process.env.GUILD_ID;
const clientId = process.env.CLIENT_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

// Initialize the database
const db = new NyaDB();

// Create and/or retrieve databases
if (!db.getList().includes('settings')) {
	db.create('settings');
	db.set('settings', { updateChannel: null, interval: null, apiUrl: null, requiredRole: null });
}
if (!db.getList().includes('steamId')) {
	db.create('steamId');
	db.set('steamId', { steamId: null });
}
if (!db.getList().includes('errorState')) {
	db.create('errorState');
	db.set('errorState', { hasError: false });
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const commands = [
	{
		name: 'setchannel',
		description: 'Set the update channel',
		options: [
			{
				name: 'channel',
				type: 7,
				description: 'The channel to post updates in',
				required: true,
			},
		],
	},
	{
		name: 'setinterval',
		description: 'Set the update interval in seconds',
		options: [
			{
				name: 'interval',
				type: 4,
				description: 'The interval in seconds (minimum 10)',
				required: true,
			},
		],
	},
	{
		name: 'setapiurl',
		description: 'Set the API URL for server data',
		options: [
			{
				name: 'apiurl',
				type: 3,
				description: 'The URL for the API to fetch server data',
				required: true,
			},
		],
	},
	{
		name: 'setrole',
		description: 'Set the role required to use commands',
		options: [
			{
				name: 'role',
				type: 8,
				description: 'The role required to use certain commands',
				required: true,
			},
		],
	},
	{
		name: 'restart',
		description: 'Restart the bot (required role required)',
	},
];

async function registerCommands(guildId) {
	const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

	try {
		console.log(`Started refreshing application (/) commands for guild ${guildId}.`);
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
		console.log(`Successfully reloaded application (/) commands for guild ${guildId}.`);
	} catch (error) {
		console.error(`Error refreshing application (/) commands for guild ${guildId}:`, error);
	}
}

// Interaction event handling
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName, options, guildId, member } = interaction;

	const settings = db.get('settings');
	const requiredRole = settings.requiredRole;

	if (requiredRole && !member.roles.cache.has(requiredRole)) {
		await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
		return;
	}

	if (commandName === 'setchannel') {
		const channel = options.getChannel('channel');
		settings.updateChannel = channel.id;
		db.set('settings', settings);
		await interaction.reply(`Update channel set to ${channel.name}`);
	} else if (commandName === 'setinterval') {
		const interval = options.getInteger('interval');

		if (interval !== null && interval < 10) {
			await interaction.reply('Interval must be at least 10 seconds.');
			return;
		}

		settings.interval = interval !== null ? interval * 1000 : null; // Convert seconds to milliseconds or set to null
		db.set('settings', settings);

		if (interval === null) {
			await interaction.reply(`Update interval disabled.`);
		} else {
			await interaction.reply(`Update interval set to ${interval} seconds`);
		}
	} else if (commandName === 'setapiurl') {
		const apiUrl = options.getString('apiurl');

		// Validate the URL (optional step)
		try {
			new URL(apiUrl); // Will throw an error if URL is invalid
		} catch (error) {
			await interaction.reply('Invalid URL provided.');
			return;
		}

		settings.apiUrl = apiUrl;
		db.set('settings', settings);

		await interaction.reply(`API URL set to: ${apiUrl}`);
	} else if (commandName === 'setrole') {
		const role = options.getRole('role');
		settings.requiredRole = role.id;
		db.set('settings', settings);
		await interaction.reply(`Required role set to ${role.name}`);
	} else if (commandName === 'restart') {
		await interaction.reply('Restarting bot...');

		// Restart the bot
		process.exit();
	}
});

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

	registerCommands(guildId);

	const settings = db.get('settings');
	if (settings.interval !== null) {
		setInterval(() => {
			checkForUpdates();
		}, settings.interval);
	}

	// Initial presence status
	setStatus('Starting up...', 'idle');
});

async function setStatus(name, status) {
	await client.user.setPresence({
		activities: [{ name: name, type: 'PLAYING' }],
		status: status,
	});
}

async function checkForUpdates() {
	try {
		const settings = db.get('settings');
		const apiUrl = settings.apiUrl;
		if (!apiUrl) {
			throw new Error('API URL is not set. Please set it using the setapiurl command.');
		}
		const response = await axios.get(apiUrl);
		const serverData = response.data;
		if (!serverData || !serverData.steamId) {
			throw new Error('Invalid API response: Missing or invalid server data');
		}
		const currentData = db.get('steamId');
		if (currentData.steamId !== serverData.steamId) {
			currentData.steamId = serverData.steamId;
			db.set('steamId', currentData);
			const errorState = db.get('errorState');
			if (!errorState.hasError && settings.updateChannel) {
				const channel = await client.channels.fetch(settings.updateChannel);
				channel.send(`@everyone \nServer SteamID updated: **${serverData.steamId}**`);
				await setStatus(`SteamID: ${serverData.steamId}`, 'online');
			}
		}
		if (db.get('errorState').hasError) {
			db.set('errorState', { hasError: false });
			if (settings.updateChannel) {
				const channel = await client.channels.fetch(settings.updateChannel);
				channel.send(`@everyone Error fetching data has been resolved. \nServer SteamID: **${serverData.steamId}**`);
				await setStatus(`SteamID: ${serverData.steamId}`, 'online');
			}
		}
	} catch (error) {
		console.error('Error fetching or processing data:', error);
		if (!db.get('errorState').hasError) {
			db.set('errorState', { hasError: true });
			const settings = db.get('settings');
			if (settings.updateChannel) {
				const channel = await client.channels.fetch(settings.updateChannel);
				channel.send(`Error fetching data from API: ${error.message}`);
				await setStatus('Error fetching data from API', 'dnd');
			}
		}
	}
}

client.login(BOT_TOKEN);
