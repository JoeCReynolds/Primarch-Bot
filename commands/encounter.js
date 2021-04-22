const BOSSES = require("../utils/ERT_Parser/ERT_Bosses.json");
const discordTTS = require("discord-tts");

/**
 * Looks through the ERT_Bosses.json file for the boss encounter
 * @param {string} boss The boss name
 * @returns {JSON} Object with the boss timings and CDs
 */
module.exports = {
    name: "encounter",
    async execute(boss, message, client) {
        boss = boss.toLowerCase();
        try {
            if (BOSSES.hasOwnProperty(boss)) {
                let bossEncounter = BOSSES[boss];
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
}