const { InteractionType, SlashCommandBuilder } = require("discord.js");

module.exports = class {
    /**
     * 
     * @param {{
     * name: string,
     * type: InteractionType
     * description: string
     * }} options 
     */
    constructor(options) {
        this.name = options.name.toLowerCase();
        this.type = options.type
        this.description = options.description

        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)

        this.data = this.build(builder)
    }

    build (builder) {
        return builder;
    }
}