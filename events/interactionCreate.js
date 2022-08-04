const { Client, Interaction, InteractionType } = require('discord.js');
const Chalk = require('chalk');
const moment = require('moment');

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 */
module.exports = async (client, interaction) => {
    var interactionName;

    if (interaction.type == InteractionType.MessageComponent) {
        interactionName = interaction.customId;
    } else if (interaction.type == InteractionType.ApplicationCommand) {
        interactionName = interaction.commandName;
    }

    const interactionHandler = client.interactions.find(i => i.name == interactionName && i.type == interaction.type);

    if (!interactionHandler) return;

    console.log(Chalk.blue(`[INTERACTION] [${new moment().format('LTS')}] ${interaction.user.tag} in #${interaction.channel.name} used: ${interactionName}`));

    interactionHandler.run(client, interaction).catch(err => {
        console.log(err)
        interaction.error(`An unexpected error has occured, please report this issue if it continues.\n\n\`\`\`diff\n- ${err.toString().split('\n')[0]}\n\`\`\``)
    });
}
