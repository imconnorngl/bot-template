const { Message, MessageEmbed, APIMessage, StringResolveable, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const path = require('path');

const { colors } = require('../../config/config.json');
const assets = require('../../config/assets.json');

/**
 * 
 * @param {string} description 
 * @param {string} image 
 */
Message.prototype.error = function (description, image) {
    const embed = new MessageEmbed()
        .setDescription(description)
        .setColor(colors.error)
        .setThumbnail(assets.icons.error);

    if (image) {
        if (fs.existsSync(image)) {
            const attachment = new MessageAttachment(image, path.basename(image))
            embed.attachFiles([attachment])
            embed.setImage(`attachment://${path.basename(image)}`)
        } else {
            embed.setImage(image)
        }
    }

    this.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false }
    });
}

/**
 * 
 * @param {[
 * {
 *  emote: string
 *  name: string
 *  value: any
 * }
 * ]} choices 
 * @param {{
 *  submitted?: string
 *  cancelled?: string
 *  timeout?: string
 *  cancellable?: boolean
 *  time?: number
 *  max?: number
 * }} options 
 */

Message.prototype.menu = function (choices, options) {
    options = {
        message: undefined,
        question: `Which option would you like to pick?`,
        prompt: `Select from the following`,
        access: [],
        time: 15000,
        allowedMentions: {
            repliedUser: false
        },
        ...options
    }

    return new Promise(async res => {
        const rows = Array.from({ length: Math.ceil(choices.length / 3) }, (_, i) => choices.slice(i * 3, (i + 1) * 3)).map(r => {
            return new MessageActionRow()
                .addComponents(r.map(p => {
                    return new MessageButton()
                        .setEmoji(p.emote)
                        .setLabel(p.short || "")
                        .setStyle("SECONDARY")
                        .setCustomID(p.id)
                        .setDisabled(p.disabled)
                }))
        })

        const content = {
            content: [
                `**${options.question}**`,
                `*${options.prompt}*`,
                "",
                ...choices.map(r => `${r.emote} - \`${r.prompt}\``)
            ].join("\n"),
            components: rows,
            allowedMentions: options.allowedMentions
        }

        if (options.message) var msg = await options.message.edit(content)
        else var msg = await this.reply(content)

        const filter = (interaction) => {
            interaction.deferUpdate()
            return choices.map(p => p.id).includes(interaction.customID) && (!options.access || options.access.includes(interaction.user.id))
        }

        msg.awaitMessageComponentInteraction(filter, { time: options.time })
            .then(interaction => res({ success: true, choice: interaction.customID, message: msg }))
            .catch(_ => res({ success: false, choice: null, message: msg }))
    })
}

/**
 * 
 * @param {StringResolveable | APIMessage} content 
 * @param {{
 *  page?: number,
 *  time?: number
 * }} options 
 */

Message.prototype.post = async function (content, options) {
    options = {
        page: 1,
        time: 120000,
        allowedMentions: {
            repliedUser: false
        },
        ...options
    }

    if (typeof content === "string") return this.reply(content, options);

    if (typeof content === "object" && !content.pages && !Array.isArray(content)) {
        if (content.type) return this.reply({
            embeds: [content],
            allowedMentions: options.allowedMentions
        })

        return this.reply({
            ...content,
            allowedMentions: options.allowedMentions
        })
    }

    let sending = [];

    if (Array.isArray(content)) sending = content;
    else {
        content.pages.forEach((page, index) => {
            if (content.footer) {
                const { text } = content.footer;
                if (text) {
                    const temp = {
                        ...content.footer,
                        text: `『 Page ${index + 1}/${content.pages.length} 』${text}`
                    }

                    page.setFooter(temp)
                }
            } else {
                page.setFooter({ text: `『 Page ${index + 1}/${content.pages.length} 』` })
            }

            Object.keys(content).forEach(key => {
                if (typeof key !== 'string' || key === 'pages') return;
                if (!page[key]) page[key] = content[key]
                if (key === 'author' && content[key] && content[key].iconURL && !page[key].iconURL)
                    page[key].iconURL = content[key].iconURL
                if (key === 'fields')
                    page[key].unshift(content[key])
            })
        })

        sending = content.pages.map(page => ({
            embeds: [page],
            files: content.files || [],
            allowedMentions: {
                repliedUser: false
            }
        }))
    }

    let { page, time } = options;

    const msg = await this.reply(sending[page - 1]);

    if (sending.length === 1) return;

    const stopFilter = (reaction, user) => reaction.emoji.name === "⏹️" && user.id == this.author.id;
    const backwardsFilter = (reaction, user) => reaction.emoji.name === "◀️" && user.id == this.author.id;
    const forwardsFilter = (reaction, user) => reaction.emoji.name === "▶️" && user.id == this.author.id;

    const backwards = msg.createReactionCollector(backwardsFilter, { time });
    const forwards = msg.createReactionCollector(forwardsFilter, { time });
    const stop = msg.createReactionCollector(stopFilter, { time });

    stop.on("collect", r => msg.reactions.removeAll());
    stop.on("end", r => msg.reactions.removeAll().catch(e => e));

    forwards.on("collect", r => {
        if (page === sending.length) page = 1;
        else page++;

        sending[page - 1].content = sending[page - 1].content || "\u200b"

        msg.edit(sending[page - 1]);
        r.users.remove(this.author.id)
    });

    backwards.on("collect", r => {
        if (page === 1) page = sending.length;
        else page--

        sending[page - 1].content = sending[page - 1].content || "\u200b"

        msg.edit(sending[page - 1]);
        r.users.remove(this.author.id)
    });

    await msg.react("◀️");
    await msg.react("▶️");
    await msg.react("⏹️");
}