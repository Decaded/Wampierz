const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setapiurl')
		.setDescription('Set the API URL for server data')
		.addStringOption(option => option.setName('apiurl').setDescription('The URL for the API to fetch server data').setRequired(true)),
	async execute(interaction, client) {
		const apiUrl = interaction.options.getString('apiurl');
		const settings = client.db.get('settings');

		// Validate the URL
		try {
			new URL(apiUrl);
		} catch (error) {
			await interaction.reply('Invalid URL provided.');
			return;
		}

		settings.apiUrl = apiUrl;
		client.db.set('settings', settings);
		await interaction.reply(`API URL set to: ${apiUrl}`);
	},
};
