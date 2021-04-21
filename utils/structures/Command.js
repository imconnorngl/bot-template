const Discord = require('discord.js');

module.exports = class {
    /**
     * 
     * @param {Discord.Client} bot 
     * @param {{
     *  name: string,
     *  description?: string,
     *  aliases?: string[],
     *  devOnly?: boolean,
     *  usage?: string,
     *  example?: string
     * }} options 
     */
    constructor(bot, options) {
        this.bot = bot;
        this.options = {
            name: "",
            description: "",
            aliases: null,
            devOnly: false,
            usage: "",
            example: "",
            category: "misc",
            channels: { 
                blacklist:  []
            },
            access: [],
            ...options
        };

        Object.assign(this, this.options)
        this.name = this.options.name.toLowerCase();
        this.aliases = this.options.aliases?.map(c => c.toLowerCase());
    }
}