const Discord = require('discord.js');
const Chalk = require('chalk');
const moment = require('moment');

const { prefix, developers } = require('../config/config.json');

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 */
module.exports = async (bot, message) => {
    if (!["GUILD_TEXT", "GUILD_NEWS"].includes(message.channel.type)) return;
    if (message.author.bot) return;

    message.prefix = prefix

    if (message.content.match(new RegExp(`^<@!?${bot.user.id}>`))) return message.post(`Hey ${message.member}! For a list of commands please use \`${message.prefix}help\`.`);
    if (!message.content.toLowerCase().startsWith(message.prefix.toLowerCase())) return;

    const args = message.content.slice(message.prefix.length).split(/ +/);
    const commandName = args.shift().toLocaleLowerCase();
    let command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    
    if (command.channels?.whitelist && !command.channels?.whitelist.includes(message.channel.id) && !developers.includes(message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return;
    else if (command.channels?.blacklist && command.channels?.blacklist.includes(message.channel.id) && !developers.includes(message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return;

    if (command.access.length && !message.member.roles.cache.some(r => command.access.includes(r.id)) && !developers.includes(message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return message.error(`This command is locked to the following roles:\n\n${command.access.filter(a => message.guild.roles.cache.get(a)).map(a => `\`•\` ${message.guild.roles.cache.get(a).name}`).join("\n")}`)
    if (command.devOnly && !developers.includes(message.author.id)) return message.error(`This command requires you to be part of our development team.`);
    
    console.log(Chalk.blue(`[CMD] [${new moment().format('LTS')}] ${message.author.tag} in #${message.channel.name} used: ${message.content}`));

    command.run(message, args, bot).catch(err => {
        console.log(err)
        message.error(`An unexpected error has occured, please report this issue if it continues.\n\n\`\`\`diff\n- ${err.toString().split('\n')[0]}\n\`\`\``)
    });
}
