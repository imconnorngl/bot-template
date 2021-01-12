module.exports = {
    name: 'ping',
    aliases: [],
    usage: 'ping',
    description: 'Pings the bot.',

    run: async (message, args, bot) => {
        message.channel.send("Pong!")
    }
}