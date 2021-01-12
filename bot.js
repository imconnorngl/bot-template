(async () => {
    const init = require('./utils/init');
    const { token } = require('./config.json')
    const Discord = require('discord.js');

    const bot = await init(new Discord.Client())

    bot.commands = new Discord.Collection();

    const eventFiles = bot.getAllFiles('./events')
    for (const file of eventFiles) {
        if (!file.endsWith(".js")) return;
        const event = require(`./${file}`);
        bot.on(file.split('\\')[1].slice(0, -3), event.bind(null, bot)); // If running on a windows system replace / with \\
    }

    const commandFiles = bot.getAllFiles('./commands')
    for (const file of commandFiles) {
        if (!file.endsWith(".js")) return;
        let commands = require(`./${file}`);
        bot.commands.set(commands.name, commands);
    }

    bot.login(token);
})()