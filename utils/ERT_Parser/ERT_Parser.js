const fs = require('fs');

function parseErtNote() {
    let rawFile = fs.readFileSync("./utils/ERT_Parser/ert.txt", {encoding: "utf8", flag: "r"});
    let fileArray = rawFile.split("\r\n");
    let cooldownsMap = new Map();
    for (let line of fileArray) {
        if (line.includes("time")) {
            let time = line.match(/(\d{2}:\d{2})/);
            let timeInMs = convertToMs(time[0]);
            let spellIds = line.match(/(:\d{5,})+/);
            if (spellIds !== null) {
                for (let i = 0; i < spellIds.length; i++) {
                    spellIds[i] = spellIds[i].substring(1);
                }
                cooldownsMap.set(timeInMs, spellIds);
            }
        }
    }
    for (let [key, value] of cooldownsMap) {
        console.log("Time: " + key + " -> Spell IDs: " + value);
    }
}

function convertToMs(time) {
    let timeArr = time.split(":");
    // 1st index is minutes, 2nd is seconds
    let minutes = timeArr[0] * 60000;
    let seconds = timeArr[1] * 1000;
    return minutes + seconds;
}

parseErtNote();