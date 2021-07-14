const Discord = require('discord.js');
const Command = require('../../utils/structures/Command');

module.exports = class extends Command {
    constructor() {
        super({
            name: "",
            aliases: [],
            description: "",
            usage: "",
            example: "",
            category: "misc"
        })
    }

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} bot 
     */
    async run(message, args, bot) {
        return message.post(`Pong`)
    }
}