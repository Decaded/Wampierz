async function setStatus(client, name, status) {
  await client.user.setPresence({
      activities: [{ name: name, type: 'PLAYING' }],
      status: status,
  });
}

module.exports = setStatus;
