const Discord = require('discord.js');
const Command = require('../../utils/structures/Command');

const path = require('path')
const allFiles = require('../../utils/allFiles');

module.exports = class extends Command {
    constructor(bot) {
        super(bot, {
            name: "reload",
            aliases: ["r", "rl"],
            description: "Allows our development team to reload a command on the bot.",
            usage: "[command/alias]",
            example: "help",
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
        if(!args.length) return message.error(`You did not include a command to reload.`)
        const command = bot.commands.get(args[0]?.toLowerCase()) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]?.toLowerCase()));
        if (!command) return message.error(`There is no command with name or alias \`${args[0]?.toLowerCase()}\``);

        allFiles('./commands').forEach(file => {
            if (path.basename(file) == `${command.name}.js`) {
                var formattedPath = path.join(__dirname, '..', '..', file).replace(/\\/g, '\\\\')
                try {
                    const startTime = Date.now()
                    delete require.cache[require.resolve(formattedPath)];
                    const newCommand = new (require(formattedPath))(bot)
                    bot.commands.set(newCommand.name, newCommand);

                    let embed = new Discord.MessageEmbed()
                        .setTitle(`Command Reloaded`)
                        .addFields(
                            { name: `Command`, value: `\`${command.name}\`` },
                            { name: `Aliases`, value: `\`${(command.aliases || []).length ? command.aliases.join(", ") : "No Aliases."}\`` },
                            { name: `Description`, value: `\`${command.description || "No Description."}\`` },
                            { name: `Reload time`, value: `\`${Date.now() - startTime} ms\`` })
                        .setColor(bot.colors.main)
                    return message.post(embed)

                } catch (error) {
                    return message.error(`There was an error while reloading command \`${command.name}\`\n\n\`\`\`${error.message}\`\`\``);
                }
            }
        })
    }
}