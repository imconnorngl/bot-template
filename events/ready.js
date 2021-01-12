const chalk = require('chalk')

module.exports = async bot => {
    console.log(chalk.blueBright(chalk.bold(`Successfully launched ${bot.user.tag}`)))
};