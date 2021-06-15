const { Message, MessageEmbed, APIMessage, StringResolveable, MessageAttachment } = require('discord.js');
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

Message.prototype.menu = async function (choices, options) {
    options = {
        message: undefined,
        prompt: `Select from the following options:`,
        submitted: `You have successfully selected the following option:`,
        cancelled: `You have successfully cancelled the selection.`,
        timeout: `You did not complete the selection in time.`,
        permitted: [],
        time: 15000,
        max: 1,
        cancellable: true,
        allowedMentions: {
            repliedUser: false
        },
        ...options
    }

    if(options.cancellable) choices.push({ emote: "❌", name: "Cancel", value: null })

    var choice = { 
        string: choices.map(c => `${this.client.emojis.cache.get(c.emote) || c.emote} - \`${c.name}\``).join("\n"), 
        emotes: choices.map(c => c.emote)
    }

    if (typeof options.prompt === "string") {
        if(options.message) var msg = await options.message.edit(`${options.prompt}\n\n${choice.string}`, options);
        else var msg = await this.reply(`${options.prompt}\n\n${choice.string}`, options);
    } 

    if (typeof options.prompt === "object") {
        if (options.prompt.type) {
            options.prompt.setDescription(`${options.prompt.description || `Select from the following options:`}\n\n${choice.string}`)
            if(options.message) {
                var msg = await options.message.edit({
                    embeds: [options.prompt],
                    allowedMentions: options.allowedMentions
                })
            } else {
                var msg = await this.reply({
                    embeds: [options.prompt],
                    allowedMentions: options.allowedMentions
                })
            }
        }
    }

    choice.emotes.forEach(e => msg.react(e).catch(err => err))

    const filter = (reaction, user) => choice.emotes.includes(reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name) && (options.permitted?.length ? options.permitted.includes(user.id) : user.id == this.author.id)
    const collected = await msg.awaitReactions(filter, { max: options.max, time: options.time }).catch(err => err)

    await msg.reactions.removeAll()
    if(collected.size < 1){
        if (typeof options.timeout === "string") var msg = await msg.edit(options.timeout, options);

        if (typeof options.timeout === "object") {
            if (options.prompt.type) {
                var msg = await msg.edit({
                    embeds: [options.timeout],
                    allowedMentions: options.allowedMentions
                })
            }
        }
    
        return { message: msg, choice: [] }
    }
    if(collected.some(c => c.emoji.name == "❌") && options.cancellable){
        if (typeof options.cancelled === "string") var msg = await msg.edit(options.cancelled, options);

        if (typeof options.cancelled === "object") {
            if (options.cancelled.type) {
                var msg = await msg.edit({
                    embeds: [options.cancelled],
                    allowedMentions: options.allowedMentions
                })
            }
        }

        return { message: msg, choice: [] }
    }

    const ch = collected.map(co => choices.find(ch => ch.emote == (co.emoji.id ? co.emoji.id : co.emoji.name)))
    if (typeof options.submitted === "string") var msg = await msg.edit(`${options.submitted}\n\n${ch.map(c => `${this.client.emojis.cache.get(c.emote) || c.emote} - \`${c.name}\``).join("\n")}`, options);

    if (typeof options.submitted === "object") {
        if (options.submitted.type) {
            options.submitted.setDescription(`${options.submitted.description || `You have successfully selected the following option:`}\n\n${ch.map(c => `${this.client.emojis.cache.get(c.emote) || c.emote} - \`${c.name}\``).join("\n")}`)
            var msg = await msg.edit({
                embeds: [options.submitted],
                allowedMentions: options.allowedMentions
            })
        }
    }

    return { message: msg, choice: ch.map(c => c.value) }
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