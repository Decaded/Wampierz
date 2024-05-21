const dotenv = require('dotenv-safe');
dotenv.config({
    example: '.env.example',
    allowEmptyValues: true,
});

module.exports = {
    GUILD_ID: process.env.GUILD_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    BOT_TOKEN: process.env.BOT_TOKEN,
};
