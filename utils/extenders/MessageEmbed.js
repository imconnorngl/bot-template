const { MessageEmbed, MessageEmbedFooter } = require('discord.js');
const { handleValue } = require('../misc');

/**
 * 
 * @param {MessageEmbedFooter} footer 
 */
MessageEmbed.prototype.setFooter = function (footer) {
    this.footer = footer;
    return this;
}

/**
 * @typedef {({
 *  name?: string,
 *  value?: string,
 *  bullets?: string[],
 *  options?: {
 *      inline?: boolean,
 *      markdown?: boolean,
 *      bullet?: string,
 *      bulletName?: (string): string,
 *      bulletValue?: (string): string,
 *  }
 * })} Field
 */
/**
 * 
 * @param {Field} field 
 */
MessageEmbed.prototype.addField = function (field) {
    this.fields = this.fields || []

    const options = {
        bullet: '\`•\`',
        bulletName: (n) => `**${n}**`,
        bulletValue: (n) => `\`${n}\``,
        markdown: false,
        inline: false,
        blank: false,
        ...field.options,
    }

    const inline = typeof field.inline === 'boolean' ? field.inline : options.inline;

    let value = handleValue(field.value, options)
    if (field.bullets) {
        value = field.bullets
            .filter(i => i)
            .map((bullet) => {
                const { name, value } = bullet;
                const bulletOptions = {
                    ...options,
                    ...bullet.options
                }

                if (bulletOptions.blank) return ``
                if (bulletOptions.title) return `${bulletOptions.bulletName(name)}`
                return `${bulletOptions.bullet} ${bulletOptions.bulletName(name)}: ${bulletOptions.bulletValue(handleValue(value, bulletOptions))}`
            })
            .join('\n') || "\u200b"
    }

    if (field.list) {
        value = field.list
            .filter(i => i)
            .map(item => {
                const itemOptions = {
                    ...options,
                    ...item.options
                }

                if (itemOptions.blank) return ``
                return `${itemOptions.bullet} ${item}`
            })
            .join('\n') || "\u200b"
    }

    const obj = {
        name: field.name || "\u200b",
        value,
        inline: typeof inline === "boolean" ? inline : true
    }

    this.fields.push(obj);

    return this;
}

/**
 * 
 * @param  {...Field} fields 
 */

MessageEmbed.prototype.addFields = function (...fields) {
    fields
        .filter(field => field)
        .forEach(field => this.addField(field))

    return this;
}

/**
 * 
 * @param {MessageEmbed} page 
 */

MessageEmbed.prototype.addPage = function (page) {
    this.pages = this.pages || []
    this.pages.push(page)

    return this
}

/**
 * 
 * @param  {...MessageEmbed} pages 
 */

MessageEmbed.prototype.addPages = function (...pages) {
    this.pages = this.pages || [];
    pages.forEach(page => this.pages.push(page))

    return this
}