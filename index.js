const { Client, Collection, GatewayIntentBits } = require('discord.js');

const allFiles = require('./utils/allFiles');

const assets = require('./config/assets.json');
const { colors } = require('./config/config.json');

require('dotenv').config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers
    ] 
});



client.commands = new Collection();
client.interactions = new Collection();

client.colors = colors;
client.assets = assets;

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
        client.on(file.split('/').pop().split('.')[0], event.bind(null, client))
        delete require.cache[require.resolve(`./${file}`)];
    });

allFiles('./commands')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        file = file.replace(/\\/g, "/")
        const command = require(`./${file}`);
        const c = new command()
        client.commands.set(c.name, c);
        delete require.cache[require.resolve(`./${file}`)];
    });

allFiles('./interactions')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        file = file.replace(/\\/g, "/")
        const interaction = require(`./${file}`);
        const i = new interaction()
        client.interactions.set(i.name, i);
        delete require.cache[require.resolve(`./${file}`)];
    });

client.login(process.env.DISCORD_BOT_TOKEN);