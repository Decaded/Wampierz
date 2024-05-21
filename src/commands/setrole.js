const { Client, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setrole')
		.setDescription('Set the role required to use commands')
		.addRoleOption(option => option.setName('role').setDescription('The role required to use certain commands').setRequired(true)),
	async execute(interaction, client) {
		const role = interaction.options.getRole('role');
		const settings = client.db.get('settings');
		settings.requiredRole = role.id;
		client.db.set('settings', settings);
		await interaction.reply(`Required role set to ${role.name}`);
	},
};
