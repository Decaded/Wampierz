const { REST, Routes } = require('discord.js');
const { CLIENT_ID, GUILD_ID, BOT_TOKEN } = require('../config');
const fs = require('fs');
const path = require('path');

async function registerCommands(client) {
	const commands = [];
	const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`../commands/${file}`);
		commands.push(command.data.toJSON());
	}

	const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

	try {
		console.log(`Started refreshing application (/) commands for guild ${GUILD_ID}.`);
		await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
		console.log(`Successfully reloaded application (/) commands for guild ${GUILD_ID}.`);
	} catch (error) {
		console.error(`Error refreshing application (/) commands for guild ${GUILD_ID}:`, error);
	}
}

module.exports = registerCommands;
