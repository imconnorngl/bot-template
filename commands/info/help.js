const Discord = require('discord.js');
const Command = require('../../utils/structures/Command');

const { prettify } = require('../../utils/misc')

module.exports = class extends Command {
    constructor() {
        super({
            name: "help",
            aliases: [],
            description: "Shows information on all the commands within the bot.",
            usage: "",
            example: "",
            category: "info",
        })
    }

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} bot 
     */
    async run(message, args, bot) {
        const commands = Array.from(bot.commands).map(command => command[1].options)

        if (!args[0]) {
            var categories = {}
            commands.forEach(c => {
                categories[c.category] ? categories[c.category].push(c) : categories[c.category] = [c]
            })

            const embed = new Discord.MessageEmbed()
                .setTitle(`Command Help`)
                .setDescription(`For more information on each command do \`${message.prefix}help <command>\`. This will show additional information such as aliases, description, usage and access.`)

            Object.keys(categories).forEach(c => {
                embed.addFields({
                    name: prettify(c),
                    value: categories[c].map(c => `\`${c.name}\``).join(", "),
                    inline: false
                })
            })

            return message.post(embed)
        } else {
            const command = commands.find(c => c.name == args[0] || c.aliases.includes(args[0]))
            if (!command) return message.error(`Could not locate a command with the name or aliase of \`${args[0]}\`. Try doing \`${message.prefix}help\` for a full list of commands.`)

            const embed = new Discord.MessageEmbed()
                .setTitle(`Command Help - ${prettify(command.name)}`)
                .setDescription(`${command.description || "No Description Provided."}\n\u200b`)
                .addFields({
                    name: `Aliases`,
                    value: command.aliases.length ? command.aliases.map(a => `\`${a}\``).join(", ") : `\u200b`
                }, {
                    name: `Usage`,
                    value: `\`${message.prefix}${command.name}${command.usage ? ` ${command.usage}` : ``}\``
                }, {
                    name: `Example`,
                    value: `\`${message.prefix}${command.name}${command.example ? ` ${command.example}` : ``}\``
                }, {
                    name: `Category`,
                    value: `\`${prettify(command.category)}\``
                })

            if (command.devOnly || command.access.length) embed.addFields({
                name: `Access`,
                value: command.devOnly ? `\`•\` Developers` : command.access.filter(a => message.guild.roles.cache.get(a)).map(a => `\`•\` ${message.guild.roles.cache.get(a).name}`).join("\n")
            })

            return message.post(embed)
        }
    }
}