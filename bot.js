require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const {translate} = require('./commands/translate');
const {getBossEncounter} = require('./commands/encounter');

const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));

// Store commands in this
client.commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

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

    switch (command) {
        case "translate":
            const targetLanguage = args[0];
            let toBeTranslated = withoutPrefix.substring((command.length+targetLanguage.length)+2, withoutPrefix.length);
            let translatedText = await client.commands.get("translate").execute(toBeTranslated, targetLanguage);
            message.channel.send(translatedText);
            break;
        case "encounter":
            let boss = "";
            if (args[0]) {
                boss = args[0];
            } else {
                message.channel.send("You need to specify a boss name.");
                return;
            }
            client.commands.get("encounter").execute(boss, message, client); // Returns a JSON object with timings and CDs
            break;
        case "addboss":
            let bossToAdd = "";
            if (args[0]) {
                bossToAdd = args[0];
            } else {
                message.channel.send("You need to specify a boss name for me to add.");
                return;
            }
            client.commands.get("addboss").execute(bossToAdd, message); //TODO: Look into how to do the file stuff
            break;
    }

    if (message.content.includes("wago.io") && message.author.id === "160871821762101249") {
        const excusemeEmoji = client.emojis.cache.get(process.env.EXCUSEME_EMOJI);
        message.react(excusemeEmoji);
    }
});

client.login(process.env.TOKEN);