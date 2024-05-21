module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			const settings = client.db.get('settings');
			const requiredRole = settings.requiredRole;

			if (requiredRole && !interaction.member.roles.cache.has(requiredRole)) {
				await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
				return;
			}

			await command.execute(interaction, client);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
