const Discord = require('discord.js');
const Command = require('../../utils/structures/Command');

const util = require('util');

module.exports = class extends Command {
    constructor(bot) {
        super(bot, {
            name: "eval",
            aliases: [],
            description: "Allows our development team to evalutate provided code.",
            usage: "[code]",
            example: "message.channel.send(\"hello\")",
            category: "developer",
            devOnly: true
        })
    }

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} bot 
     */
    async run(message, args, bot) {
        let code = args.join(" ").startsWith("\`\`\`") ? args.join(" ").replace(/\`\`\`\n|\`\`\`\S.*\n|\`\`\`/g, "") : args.join(" ")
        if (!code.includes('return')) code = `return ${code}`

        const embed = new Discord.MessageEmbed()
            .setColor(bot.colors.main);

        try {
            embed.setAuthor(`Successful Evaluation`)
            embed.addFields({
                name: `:outbox_tray: Output:`,
                value: `\`\`\`js\n${util.inspect(await eval(`(async () => {${code}})()`)).split("").slice(0, 1000).join("")}\n\`\`\``
            })
        } catch (e) {
            embed.setAuthor(`Unsuccessful Evaluation`)
            embed.addFields({
                name: `:outbox_tray: Error:`,
                value: `\`\`\`js\n${e}\n\`\`\``
            })
        }

        return message.post(embed)
    }
}