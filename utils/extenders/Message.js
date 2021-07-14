const { Message, MessageEmbed, APIMessage, StringResolveable, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const path = require('path');

const { colors } = require('../../config/config.json');
const assets = require('../../config/assets.json');

Message.prototype.reacts = async function (...reactions) {
    reactions.forEach(r => this.react(r))
}

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

    if (typeof content === "string") return this.reply({
        content: content, 
        ...options
    });

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

    const filter = (reaction, user) => ["◀️", "▶️", "⏹️"].includes(reaction.emoji.name) && user.id == this.author.id;
    const collector = msg.createReactionCollector({ filter, time });

    collector.on("collect", async r => {
        switch (r.emoji.name) {
            case "◀️":
                if (page === 1) page = sending.length;
                else page--;
                break;
            case "▶️":
                if (page === sending.length) page = 1;
                else page++;
                break;
            case "⏹️":
                return msg.reactions.removeAll()
        }

        r.users.remove(this.author.id)
        sending[page - 1].content = sending[page - 1].content || "\u200b"
        msg.edit(sending[page - 1]);
    });

    collector.on("end", _ => msg.reactions.removeAll().catch(e => e));

    await msg.reacts("◀️", "▶️", "⏹️");
}