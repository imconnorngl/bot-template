const Discord = require('discord.js');

const assets = require('./config/assets.json');
const config = require('./config/config.json');
const { colors, credentials } = config
const allFiles = require('./utils/allFiles');

(async () => {
    const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_EMOJIS"] });

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
        })

    allFiles('./commands')
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            file = file.replace(/\\/g, "/")
            const command = require(`./${file}`);
            const c = new command()
            bot.commands.set(c.name, c);
        })

    bot.login(credentials.token);
})()
