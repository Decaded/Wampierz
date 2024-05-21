const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setchannel')
		.setDescription('Set the update channel')
		.addChannelOption(option => option.setName('channel').setDescription('The channel to post updates in').setRequired(true)),
	async execute(interaction, client) {
		const channel = interaction.options.getChannel('channel');
		const settings = client.db.get('settings');
		settings.updateChannel = channel.id;
		client.db.set('settings', settings);
		await interaction.reply(`Update channel set to ${channel.name}`);
	},
};
