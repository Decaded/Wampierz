const { Client, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setinterval')
		.setDescription('Set the update interval in seconds')
		.addIntegerOption(option => option.setName('interval').setDescription('The interval in seconds (minimum 10)').setRequired(true)),
	async execute(interaction, client) {
		const interval = interaction.options.getInteger('interval');
		const settings = client.db.get('settings');

		if (interval < 10) {
			await interaction.reply('Interval must be at least 10 seconds.');
			return;
		}

		settings.interval = interval * 1000; // Convert seconds to milliseconds
		client.db.set('settings', settings);
		await interaction.reply(`Update interval set to ${interval} seconds`);
	},
};
