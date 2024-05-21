const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('restart').setDescription('Restart the bot'),
	async execute(interaction) {
		await interaction.reply('Restarting bot...');
		process.exit();
	},
};
