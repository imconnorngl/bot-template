const chalk = require('chalk')

const { prefix } = require('../config.json')
const xpGenerator = require('../utils/methods/xpGenerator.js')

module.exports = async (bot, message) => {

    message.prefix = prefix

    if (message.author.bot) return;
    if (message.channel.type != "text") return;
    
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

    const args = message.content.slice(prefix.length).split(" ")
    let commandName = args.shift().toLowerCase()
    const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))


    if (!command) return;

    console.log(chalk.blue(`[CMD] [${new Date().toDateString()}] - [${message.guild.name}] ${message.author.tag}: ${message.content}`))

    try {
        command.run(message, args, bot)
    } catch {
        bot.error(message, `An unexpected error occured.`)
    }

}