const { EmbedBuilder } = require('discord.js');
const CommandHandler = require('../../utils/structures/CommandHandler');

const ms = require("ms");

const { developers } = require('../../config/config.json');

module.exports = class extends CommandHandler {
    constructor() {
        super({
            name: "ping",
            aliases: ["invite"],
            description: "Sends information and statistics about the client.",
            usage: "",
            example: "",
            category: "info"
        })
    }

    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    async run(client, message, args) {
        const embed = new EmbedBuilder()
            .addFields({
                name: `Credits`,
                value: `:desktop: ${(await Promise.all(developers.map(async d => `\`${(await client.users.fetch(d))?.tag}\``))).join(", ")}`,
            }, {
                name: `Ping`,
                value: `:hourglass_flowing_sand: \`${Math.round(client.ws.ping)}ms\``,
                options: {
                    inline: true
                }
            }, {
                name: `Uptime`,
                value: ` :alarm_clock:  \`${ms(Number(client.uptime), { long: true })}\``,
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
                value: `:speech_left: \`${client.guilds.cache.size.toLocaleString()}\``,
                options: {
                    inline: true
                }
            }, {
                name: `Channels`,
                value: `:hash: \`${client.channels.cache.size.toLocaleString()}\``,
                options: {
                    inline: true
                }
            }, {
                name: `Users`,
                value: `:busts_in_silhouette: \`${client.guilds.cache.reduce((a, c) => a + c.memberCount, 0).toLocaleString()}\``,
                options: {
                    inline: true
                }
            })
            .setColor(client.colors.main);

        return message.post(embed);
    }
}