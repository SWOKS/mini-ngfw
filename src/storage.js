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


    const rule = rules.find(rule => rule.id === id);
    if (!rule) {
        return null;
    }

    const updatedRule = { ...rule, action };
    const updatedRules = rules.map((item) =>
        item.id === id ? updatedRule : item
    );

    await saveRules(updatedRules);
    return updatedRule;
}

async function createRule(input) {
    const rules = await loadRules();
    const newId = rules.reduce((max, rule) => Math.max(max, rule.id), 0) + 1;
    const newRule =     {
        id: newId,
        src: input.src,
        dst: input.dst,
        port: input.port,
        protocol: input.protocol,
        action: input.action
    };
    const newRules = [...rules, newRule];
    await saveRules(newRules);
};

module.exports = {
    loadRules,
    saveRules,
    changeRuleAction,
    createRule
};