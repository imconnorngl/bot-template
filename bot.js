const Discord = require('discord.js');

const assets = require('./config/assets.json');
const { colors } = require('./config/config.json');
const allFiles = require('./utils/allFiles');

require('dotenv').config();

(async () => {
    const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_EMOJIS_AND_STICKERS"] });

    bot.colors = colors;
    bot.assets = assets;

    bot.commands = new Discord.Collection();

    allFiles('./utils/extenders')
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            file = file.replace(/\\/g, "/")
            require(`./${file}`);
        })

    allFiles('./events')
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            file = file.replace(/\\/g, "/")
            const event = require(`./${file}`);
            bot.on(file.split('/').pop().split('.')[0], event.bind(null, bot))
            delete require.cache[require.resolve(`./${file}`)];
        })

    allFiles('./commands')
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            file = file.replace(/\\/g, "/")
            const command = require(`./${file}`);
            const c = new command()
            bot.commands.set(c.name, c);
            delete require.cache[require.resolve(`./${file}`)];
        })

    bot.login(process.env.DISCORD_BOT_TOKEN);
})()
