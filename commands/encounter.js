const BOSSES = require("../utils/ERT_Parser/ERT_Bosses.json");
const discordTTS = require("discord-tts");

/**
 * Checks ERT_Bosses.json for the given boss name, if found then will have
 * the bot join the voice channel and begin calling CDs according to the times
 * attached to that specific boss.
 * @param {string} bossName The name of the boss to search for
 * @param {Object} message The message object from discord.js
 * @param {Object} client The client object from discord.js
 */

async function execute(bossName, message, client) {
    bossName = bossName.toLowerCase();
    try {
        if (BOSSES.hasOwnProperty(bossName)) {
            let bossEncounter = BOSSES[bossName];
            const broadcast = client.voice.createBroadcast();
            let channelId = message.member.voice.channelID;
            let channel = client.channels.cache.get(channelId);
            let connection = await channel.join();
            for (let [key, value] of Object.entries(bossEncounter)) {
                setTimeout(async () => {
                    let cooldowns = value.join(" ");
                    broadcast.play(discordTTS.getVoiceStream(cooldowns));
                    const dispatcher = await connection.play(broadcast);
                }, key);
            }
        } else {
            message.channel.send("That boss does not exist on memory.");
        }
    } catch (error) {
        message.channel.send("Something went wrong :(");
        console.log(error);
    }
}

module.exports = {
    name: "encounter",
    execute
}