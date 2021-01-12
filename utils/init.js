const { color } = require("../config.json")

const Discord = require("discord.js")
const path = require("path")
const fs = require("fs")

const init = async bot => {
    bot.error = (message, content, dm = false) => {
        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(content)
            .setThumbnail(`https://statsify.net/img/assets/error.gif`)
        return dm ? message.send({ embed: embed }) : message.channel.send({ embed: embed })
    }

    bot.getAllFiles = (dirPath, arrayOfFiles = []) => {
        const files = fs.readdirSync(dirPath)
        files.forEach((file) => {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) arrayOfFiles = bot.getAllFiles(dirPath + "/" + file, arrayOfFiles);
            else arrayOfFiles.push(path.join(dirPath, "/", file))
        });
        return arrayOfFiles;
    }

    return bot;
}

module.exports = init