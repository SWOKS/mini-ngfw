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
}

async function changeRuleAction(id, action) {
    const rules = await loadRules();
    const ruleIndex = rules.findIndex(rule => rule.id === id);
    if (ruleIndex === -1) {
        throw new Error(`Rule with id ${id} not found`);
    }
    rules[ruleIndex].action = action;
    await saveRules(rules);
}

module.exports = {
    loadRules,
    saveRules,
    changeRuleAction
};