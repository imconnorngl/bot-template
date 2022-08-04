const fs = require('fs');
const path = require('path');
const { BaseInteraction, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

const { colors } = require('../../config/config.json');
const assets = require('../../config/assets.json');

BaseInteraction.prototype.error = async function (description, image) {
    const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor(colors.warning)
        .setThumbnail(assets.icons.error);

    if (image) {
        if (fs.existsSync(image)) {
            const attachment = new AttachmentBuilder(image, path.basename(image))
            embed.attachFiles([attachment])
            embed.setImage(`attachment://${path.basename(image)}`)
        } else {
            embed.setImage(image)
        }
    }

    const payload = {
        embeds: [embed],
        components: [],
        allowedMentions: { repliedUser: false },
        ephemeral: true
    }

    if (this.replied) {
        if (this.content) payload["content"] = "\u200b"
        this.editReply(payload).catch(err => err)
    } else {
        this.reply(payload).catch(err => err)
    }
}


BaseInteraction.prototype.post = async function (content, options) {
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
        if (content.data) return this.reply({
            embeds: [content],
            allowedMentions: options.allowedMentions
        })

        return this.reply({
            ...content,
            allowedMentions: options.allowedMentions
        })
    }

    if (content.pages) {
        let pages = content.pages.map((page, index) => {
            if (content.footer) {
                const { text } = content.footer;
                if (text) {
                    page.setFooter({
                        ...content.footer,
                        text: `『 Page ${index + 1}/${content.pages.length} 』${text}`
                    })
                }
            } else {
                page.setFooter({ text: `『 Page ${index + 1}/${content.pages.length} 』` })
            }

            Object.keys(content.data).forEach(key => {
                if (typeof key !== 'string' || key === 'pages') return;
                if (!page.data[key]) page.data[key] = content.data[key]
                if (key === 'author' && content.data[key] && content.data[key].iconURL && !page.data[key].iconURL) page.data[key].iconURL = content.data[key].iconURL
                if (key === 'fields') page.data[key].unshift(content.data[key])
            });

            return page
        });

        const sending = pages.map(page => ({
            embeds: [page],
            files: content.files || [],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setEmoji('◀️')
                            .setStyle('Secondary')
                            .setCustomId('prev'),
                        new ButtonBuilder()
                            .setEmoji('▶️')
                            .setStyle('Secondary')
                            .setCustomId('next'),
                        new ButtonBuilder()
                            .setEmoji('⏹️')
                            .setStyle('Secondary')
                            .setCustomId('stop'),
                    )
            ],
            allowedMentions: {
                repliedUser: false
            }
        }));

        let { page, time } = options;

        const msg = await this.reply(sending[page - 1]);

        if (sending.length === 1) return;

        const collector = msg.createMessageComponentCollector({
            filter: (interaction) => interaction.user.id === this.user.id,
            time: time
        });

        collector.on("collect", async (interaction) => {
            interaction.deferUpdate();

            switch (interaction.customId) {
                case "next":
                    page = page < sending.length ? page + 1 : 1;
                    break;
                case "prev":
                    page = page > 1 ? page - 1 : sending.length;
                    break;
                case "stop":
                    collector.stop();
                    return;
            }

            sending[page - 1].content = sending[page - 1].content || "\u200b"
            this.editReply(sending[page - 1]);
        });

        collector.on("end", _ => {
            sending[page - 1].components = []
            this.editReply(sending[page - 1]);
        });
    }
}