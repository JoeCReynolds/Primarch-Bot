const fs = require('fs');
const https = require('https');
const {parseErtNote} = require('../utils/ERT_Parser/ERT_Parser');

/**
 * Looks for file attachments on the message object and temporarily saves the file if found
 * to be parsed and added to ERT_Bosses.json.
 * @param {string} bossToAdd The name of the boss to add
 * @param {Object} message The message object from discord.js
 */
function execute(bossToAdd, message) {
    try {
        if (message.attachments.first()) {
            https.get(message.attachments.first().url, res => {
                // Store the text file temporarily
                const filePath = fs.createWriteStream("./utils/ERT_Parser/temp.txt");
                res.pipe(filePath);
                filePath.on('finish', async () => {
                    filePath.close();
                    console.log('Download Completed');
                    await parseErtNote(bossToAdd); // Add the boss timings/CDs to ERT_Bosses.json
                    message.channel.send(`Added ${bossToAdd} to the boss list.`);
                })
            });
        }
    } catch (error) {
        message.channel.send(`Failed to add ${bossToAdd} to boss list :(`);
        console.log("Error: " + error);
    }
}

module.exports = {
    name: "addboss",
    execute
}