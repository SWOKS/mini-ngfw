const fs = require("node:fs/promises");
const path = require("node:path");

const dataFile = path.join(
    __dirname,
    "..",
    "data",
    "rules.json"
);

async function loadRules(){
    const text = await fs.readFile(dataFile, "utf8");
    return JSON.parse(text);
}

async function saveRules(rules) {
    const text = JSON.stringify(rules, null, 2);
    await fs.writeFile(dataFile, text, "utf8");
};

module.exports = {
    loadRules,
    saveRules
};