const { loadRules, saveRules } = require("./storage.js");

async function getRules() {
    const rules = await loadRules();
    return rules;
};

async function getRuleById(id) {
    const rules = await getRules();
    return rules.find(rule => rule.id === id) || null;
};

async function changeRuleAction(id, action) {
    const rules = await getRules();

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
};

async function createRule(input) {
    const rules = await getRules();
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
    return newRule;
};

async function deleteRule(id) {
    const rules = await getRules();
    const newRules = rules.filter(rule => rule.id !== id);
    if (newRules.length === rules.length) {
        return false;
    }
    
    await saveRules(newRules);
    return true;
};

module.exports = {
    getRules,
    getRuleById,
    changeRuleAction,
    createRule,
    deleteRule
};