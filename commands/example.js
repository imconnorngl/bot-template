const { EmbedBuilder } = require('discord.js');
const CommandHandler = require('../utils/structures/CommandHandler');

module.exports = class extends CommandHandler {
    constructor() {
        super({
            name: "example",
            aliases: [],
            description: "Example Command",
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
        if (args.length < 1) return message.error("You must provide an input parameter to show.");

        const embed = new EmbedBuilder()
            .setAuthor({ name: `This is an example command` })
            .addPages(
                new EmbedBuilder()
                    .setTitle("Page 1")
                    .setDescription(`Option is \`${args[0]}\``)
                    .addFields(
                        { name: `Test Field`, value: `Hello World` },
                        { name: `Test Field`, value: `\`Hello World\`` },
                        { name: `Test List`, list: [`Hello`, `World`] }
                    ),
                new EmbedBuilder()
                    .setTitle("Page 2")
                    .addFields(
                        { name: `Test Bullets`, bullets: [
                            { name: `Hello`, value: `World` },
                            { name: `World`, value: `Hello` },
                        ]}
                    )  
            )

        message.post(embed);
    }
}