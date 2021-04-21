const Discord = require('discord.js');
const chalk = require('chalk')
const moment = require('moment');

/**
 * 
 * @param {Discord.Client} bot 
 */
module.exports = (bot) => {
    console.log(chalk.blueBright(chalk.bold(`Successfully launched ${bot.user.tag} with ${bot.guilds.cache.size || 0} guilds at ${new moment().format('LTS')}`)))
}