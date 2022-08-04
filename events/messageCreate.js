const { Client, Message, ChannelType } = require('discord.js');
const Chalk = require('chalk');
const moment = require('moment');

const { prefix, developers } = require('../config/config.json');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */
module.exports = async (client, message) => {
    if (![ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildVoice].includes(message.channel.type)) return;
    if (message.author.bot) return;

    message.prefix = prefix

    if (message.content.match(new RegExp(`^<@!?${client.user.id}>`))) return message.post(`Hey ${message.member}! For a list of commands please use \`${message.prefix}help\`.`);
    if (!message.content.toLowerCase().startsWith(message.prefix.toLowerCase())) return;

    const args = message.content.slice(message.prefix.length).split(/ +/);
    const commandName = args.shift().toLocaleLowerCase();
    const commandHandler = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!commandHandler) return;
    
    if (commandHandler.channels?.whitelist && !commandHandler.channels?.whitelist.includes(message.channel.id) && !developers.includes(message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return;
    else if (commandHandler.channels?.blacklist && commandHandler.channels?.blacklist.includes(message.channel.id) && !developers.includes(message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return;

    if (commandHandler.access.length && !message.member.roles.cache.some(r => commandHandler.access.includes(r.id)) && !developers.includes(message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return message.error(`This command is locked to the following roles:\n\n${command.access.filter(a => message.guild.roles.cache.get(a)).map(a => `\`•\` ${message.guild.roles.cache.get(a).name}`).join("\n")}`)
    if (commandHandler.devOnly && !developers.includes(message.author.id)) return message.error(`This command requires you to be part of our development team.`);
    
    console.log(Chalk.blue(`[CMD] [${new moment().format('LTS')}] ${message.author.tag} in #${message.channel.name} used: ${message.content}`));

    commandHandler.run(client, message, args).catch(err => {
        console.log(err)
        message.error(`An unexpected error has occured, please report this issue if it continues.\n\n\`\`\`diff\n- ${err.toString().split('\n')[0]}\n\`\`\``)
    });
}
