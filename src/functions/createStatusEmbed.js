const { EmbedBuilder } = require('discord.js');

async function createStatusEmbed(title, description, fields = [], color = 0x00ff00) {
	// Default to a space if the description is an empty string
	description = description || ' ';
	return new EmbedBuilder().setTitle(title).setDescription(description).addFields(fields).setColor(color).setTimestamp();
}

module.exports = createStatusEmbed;
