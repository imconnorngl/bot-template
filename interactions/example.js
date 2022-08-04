const { Client, Interaction, InteractionType, EmbedBuilder } = require('discord.js');
const InteractionHandler = require('../utils/structures/InteractionHandler');

module.exports = class extends InteractionHandler {
    constructor() {
        super({
            name: "example",
            type: InteractionType.ApplicationCommand,
            description: "Example Command"
        })
    }

    build(builder) {
        return builder
            .addStringOption(option =>
                option
                    .setName("input")
                    .setDescription("Input Text")
                    .setRequired(true)
            )
    }

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async run(client, interaction) {
        const input = interaction.options.getString("input");

        const embed = new EmbedBuilder()
            .setAuthor({ name: `This is an example command` })
            .addPages(
                new EmbedBuilder()
                    .setTitle("Page 1")
                    .setDescription(`Option is \`${input}\``)
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

        interaction.post(embed);
    }
}