# Wampierz Discord Bot

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-1.1.0-blue.svg)
![Node.js Version](https://img.shields.io/badge/Node.js-v14.0-green)

Wampierz is a Discord bot designed to fetch and display SteamID information for V Rising servers using the [CeloAPI](https://github.com/Celofyz/vrising-server-api). This bot allows server administrators to set the update channel,
update interval, and API URL via Discord commands.

## Features

- **Set Update Channel**: Administrators can specify a channel where server update notifications will be posted.
- **Set Update Interval**: Configurable update interval to fetch server data from the API.
- **Set API URL**: Allows setting the URL for the API to fetch server data.
- **Restart Command**: Supports restarting the bot (requires appropriate permissions).

## Commands

- `/setchannel`: Set the update channel for server notifications.
- `/setinterval`: Set the update interval in seconds (minimum 10 seconds).
- `/setapiurl`: Set the API URL for fetching server data.
- `/restart`: Restart the bot (requires appropriate permissions).

## Prerequisites

- Node.js >= 14.0.0
- Discord Bot Token
- Discord Server ID
- Role with appropriate permissions (e.g., 'Wampyr' role)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Decaded/wampierz.git
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory with the following variables:

```dotenv
BOT_TOKEN=your_discord_bot_token_here
GUILD_ID=your_discord_server_id_here
CLIENT_ID=your_discord_bot_client_id_here
```

4. Start the bot:

```bash
npm start
```

## Configuration

The bot uses `.env` file for configuration. Ensure you have set the following variables:

`BOT_TOKEN`: Your Discord bot token. `GUILD_ID`: Your Discord server ID. `CLIENT_ID`: Your Discord bot client ID.

## Contributing

Contributions are welcome! If you have suggestions or found a bug, please [open an issue](https://github.com/Decaded/wampierz/issues).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
