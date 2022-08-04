const { Client, Message, EmbedBuilder } = require('discord.js');
const CommandHandler = require('../../utils/structures/CommandHandler');

const util = require('util');

module.exports = class extends CommandHandler {
    constructor() {
        super({
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
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    async run(client, message, args) {
        let code = args.join(" ")
        if (!code.includes('return')) code = `return ${code}`

        const embed = new EmbedBuilder()
            .setColor(client.colors.main);

        try {
            embed.setAuthor({ name: `Successful Evaluation` })
            embed.addFields({
                name: `:outbox_tray: Output:`,
                value: `\`\`\`js\n${util.inspect(await eval(`(async () => {${code}})()`)).split("").slice(0, 1000).join("")}\n\`\`\``
            })
        } catch (e) {
            embed.setAuthor({ name: `Unsuccessful Evaluation` })
            embed.addFields({
                name: `:outbox_tray: Error:`,
                value: `\`\`\`js\n${e}\n\`\`\``
            })
        }

        return message.post(embed)
    }
}