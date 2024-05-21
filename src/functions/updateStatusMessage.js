async function updateStatusMessage(updateChannel, embed, settings, client) {
	let statusMessage;
	if (updateChannel) {
		const statusMessageId = settings.statusMessageId;
		if (statusMessageId) {
			try {
				statusMessage = await updateChannel.messages.fetch(statusMessageId);
			} catch (error) {
				console.log('Status message not found, will create a new one.');
			}
		}

		if (!statusMessage) {
			statusMessage = await updateChannel.send({ embeds: [embed] });
			settings.statusMessageId = statusMessage.id;
			client.db.set('settings', settings);
		} else {
			await statusMessage.edit({ embeds: [embed] });
		}

		// Delete other messages in the channel except the status message
		const messages = await updateChannel.messages.fetch({ limit: 100 });
		messages.forEach(async msg => {
			if (msg.id !== statusMessage.id) {
				await msg.delete();
			}
		});
	}
}

module.exports = updateStatusMessage;
