const Discord = require('discord.js');

const { prefix, developers } = require('../config/config.json');
const Levelling = require('../utils/levelling')

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 */
module.exports = async (bot, message) => {
    if (message.channel.type !== 'text') return;
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

    command.run(message, args, bot).catch(err => console.log(err));
}