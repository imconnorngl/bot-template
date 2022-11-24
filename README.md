# Getting Started

Here's a simple guide to get started with this bot template.

## Requirements
* `git` command line ([Windows](https://git-scm.com/download/win) | [Linux](https://git-scm.com/download/linux) | [MacOS](https://git-scm.com/download/mac)) installed.
* `node` [Version 16.x](https://nodejs.org).

## Create your bot
* Go to the [Discord Application Page](https://discord.com/developers/applications).
* Create a **New Application**.
* Click **Bot**, **Add Bot**, then click **Yes, do it**.
* Visit `https://discord.com/oauth2/authorize?client_id=APP_ID&permissions=8&scope=bot%20applications.commands`, replacing **APP_ID** with the **Application ID** from the app page, to add the bot to your server.
* Copy your bot's **Token** and keep it for later.

## Intents
* Visit the same bot page where you got your token from.
* Under **Privileged Gateway Intents**, enable **Presence Intent**, **Server Members Intent**, and **Message Content Intent**.
* Click **Save Changes** at the bottom.


## Run the bot
* Create a local folder to store your bot's source code in.
* Run `git clone https://github.com/imconnorngl/bot-template.git .` in the folder directory.
* Run `npm i` to install all required packages.
* Rename the `.env.example` file to `.env` and paste your bot's token after the equals sign.
* Run `npm run start`.