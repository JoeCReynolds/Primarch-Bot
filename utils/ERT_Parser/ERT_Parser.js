const fs = require('fs');
const SPELLS = require('./spells.json');
const BOSSES = require('./ERT_Bosses.json');

async function parseErtNote(bossName) {
    // This will eventually read a file from Discord
    let rawFile = fs.readFileSync("./utils/ERT_Parser/temp.txt", {encoding: "utf8", flag: "r"});
    let fileArray = rawFile.split("\r\n");
    let cooldownsMap = new Map();
    for (let line of fileArray) {
        if (line.includes("time")) {
            let time = line.match(/(\d{2}:\d{2})/);
            let timeInMs = convertToMs(time[0]);
            let spellIds = line.match(/(:\d{5,})+/g);
            if (spellIds !== null) {
                for (let i = 0; i < spellIds.length; i++) {
                    spellIds[i] = spellIds[i].substring(1);
                    if (SPELLS.hasOwnProperty(spellIds[i])) { // If the spell ID exists in spells.json, get the actual name for it
                        spellIds[i] = SPELLS[spellIds[i]];
                    }
                }
                cooldownsMap.set(timeInMs, spellIds);
            }
        }
    }
    try {
        BOSSES[bossName] = Object.fromEntries(cooldownsMap);
        fs.writeFileSync("./utils/ERT_Parser/ERT_Bosses.json", JSON.stringify(BOSSES, null, 4));
        // Delete the file when we are done with it
        fs.unlink("./utils/ERT_Parser/temp.txt", error => {
            if (error) {
                console.log("Error: " + error);
            }
        });
    } catch (error) {
        console.log("Error: " + error);
    }
}

/**
 * Converts the time to milliseconds
 * @param {String} time 
 * @returns {Number} Time in MS
 */
function convertToMs(time) {
    let timeArr = time.split(":");
    // 1st index is minutes, 2nd is seconds
    let minutes = timeArr[0] * 60000;
    let seconds = timeArr[1] * 1000;
    return minutes + seconds;
}

module.exports = {
    parseErtNote
};