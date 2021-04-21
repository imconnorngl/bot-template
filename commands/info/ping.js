const Discord = require('discord.js');
const Command = require('../../utils/structures/Command');

const ms = require("ms")

const { developers } = require('../../config/config.json')

module.exports = class extends Command {
    constructor(bot) {
        super(bot, {
            name: "ping",
            aliases: ["invite"],
            description: "Sends information and statistics about the bot.",
            usage: "",
            example: "",
            category: "info"
        })
    }

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} bot 
     */
    async run(message, args, bot) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Championship Series - Information`, bot.user.displayAvatarURL())
            .setDescription(`:link: You can invite the bot [here](https://discord.com/api/oauth2/authorize?client_id=830469682863013930&permissions=8&scope=bot).`)
            .addFields({
                name: `Credits`,
                value: `:desktop: ${(await Promise.all(developers.map(async d => `\`${(await bot.users.fetch(d))?.tag}\``))).join(", ")}`,
            }, {
                name: `Ping`,
                value: `:hourglass_flowing_sand: \`${Math.round(bot.ws.ping)}ms\``,
                options: {
                    inline: true
                }
            }, {
                name: `Uptime`,
                value: ` :alarm_clock:  \`${ms(Number(bot.uptime), { long: true })}\``,
                options: {
                    inline: true
                }
            }, {
                name: `Memory Used`,
                value: `:dna: \`${((JSON.stringify(process.memoryUsage().heapUsed)) / 1024 / 1024).toFixed(2)} MB\``,
                options: {
                    inline: true
                }
            }, {
                name: `Servers`,
                value: `:speech_left: \`${bot.guilds.cache.size.toLocaleString()}\``,
                options: {
                    inline: true
                }
            }, {
                name: `Channels`,
                value: `:hash: \`${bot.channels.cache.size.toLocaleString()}\``,
                options: {
                    inline: true
                }
            }, {
                name: `Users`,
                value: `:busts_in_silhouette: \`${bot.guilds.cache.reduce((a, c) => a + c.memberCount, 0).toLocaleString()}\``,
                options: {
                    inline: true
                }
            }, {
                name: `Registered`,
                value: `:ballot_box_with_check: \`${0}\``,
                options: {
                    inline: true
                }
            },
            {
                name: `Teams`,
                value: `:family: \`${0}\``,
                options: {
                    inline: true
                }
            })
            .setColor(bot.colors.main);

        return message.post(embed);
    }
}