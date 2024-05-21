const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { BOT_TOKEN } = require('./config');
const NyaDB = require('@decaded/nyadb');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();
client.db = new NyaDB();

// Create and/or retrieve databases
if (!client.db.getList().includes('settings')) {
	client.db.create('settings');
	client.db.set('settings', { updateChannel: null, interval: null, apiUrl: null, requiredRole: null });
}
if (!client.db.getList().includes('steamId')) {
	client.db.create('steamId');
	client.db.set('steamId', { steamId: null });
}
if (!client.db.getList().includes('errorState')) {
	client.db.create('errorState');
	client.db.set('errorState', { hasError: false });
}

// Load commands
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Load events
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.login(BOT_TOKEN);
