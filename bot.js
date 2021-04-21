require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const discordTTS = require("discord-tts");

const {translate} = require('./src/translator/language_translator');

client.on("ready", () => {
    console.log("Logged in");
});

client.on("message", async message => {

    // If the message came from the bot, ignore it
    if (message.author.bot) {
        return;
    }
    
    // Grab the message with the prefix and separated from it
    const withoutPrefix = message.content.slice(process.env.PREFIX.length); // String with everything except the command
    const split = withoutPrefix.split(/ +/); // Gives everything after the prefix (including command)
    const args = split.slice(1); // Gives everything after the command as an array

    // Get the boss and budget from the user input
    const command = split[0].toLowerCase();

    if (command === "translate") {
        const targetLanguage = args[0];
        let toBeTranslated = withoutPrefix.substring((command.length+targetLanguage.length)+2, withoutPrefix.length);
        let translatedText = await translate(toBeTranslated, targetLanguage);
        if (translatedText) {
            console.log(translatedText);
            message.channel.send(translatedText);
        }
    } else if (message.content.includes("wago.io") && message.author.id === "160871821762101249") {
        const excusemeEmoji = client.emojis.cache.get(process.env.EXCUSEME_EMOJI);
        message.react(excusemeEmoji);
    } else if (message.content.includes("start encounter")) {
        try {
            const broadcast = client.voice.createBroadcast();
            let channelId = message.member.voice.channelID;
            let channel = client.channels.cache.get(channelId);
            let connection = await channel.join();
            broadcast.play(discordTTS.getVoiceStream("test 123"));
            const dispatcher = await connection.play(broadcast);
        } catch (error) {
            console.log("Error: " + error);
        }
        
    }
});

client.login(process.env.TOKEN);