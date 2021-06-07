module.exports = class {
    /**
     * 
     * @param {{
     *  name: string,
     *  description?: string,
     *  aliases?: string[],
     *  devOnly?: boolean,
     *  usage?: string,
     *  example?: string
     * }} options 
     */
    constructor(options) {
        options = {
            name: "",
            description: "",
            aliases: null,
            devOnly: false,
            usage: "",
            example: "",
            category: "misc",
            channels: { 
                blacklist:  []
            },
            access: [],
            ...options
        };

        Object.assign(this, options)
        this.name = this.name.toLowerCase();
        this.aliases = this.aliases?.map(c => c.toLowerCase());
    }
}