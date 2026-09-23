const rules = [
    {
        id: 1,
        src: "192.168.1.0/24",
        dst: "10.0.0.0/5",
        port: 443,
        protocol: "tcp",
        action: "allow"
    },
    {
        id: 2,
        src: "10.0.0.0/8",
        dst: "10.0.0.20",
        port: 22,
        protocol: "tcp",
        action: "deny"
    },
    {
        id: 3,
        src: "any",
        dst: "8.8.8.8",
        port: 53,
        protocol: "udp",
        action: "allow"
    },
    {
        id: 4,
        src: "172.16.0.0/16",
        dst: "192.168.1.100",
        port: 80,
        protocol: "tcp",
        action: "allow"
    },
    {
        id: 5,
        src: "any",
        dst: "10.0.0.50",
        port: 3389,
        protocol: "tcp",
        action: "deny"
    }
];

function getAllowedPorts(rules) {
    return rules
        .filter(rule => rule.action === "allow")
        .map(rule => rule.port);
}

function getRulesByProtocol(rules, protocol) {
    return rules.filter(rule => rule.protocol === protocol);
}

function findRuleById(rules, id) {
    const rule = rules.find(rule => rule.id === id);
    return rule ?? null;
}

function toggleRuleAction(rule) {
    return {
        ...rule,
        action: rule.action === "allow" ? "deny" : "allow"
    };
}

function updateRuleAction(rules, id, action) {
    if (action !== "allow" && action !== "deny") {
        return null;
    }

    return rules.map(rule => {
        if (rule.id === id) {
            return {
                ...rule,
                action: action
            }
        }
        return rule;
    });
}

function formatRule(rule) {
    return `#${rule.id} ${(rule.action).toUpperCase()} ${rule.protocol} ${rule.src} -> ${rule.dst}`;
}

function formatRule({ id, action, protocol, src, dst }) {
    return `#${id} ${(action).toUpperCase()} ${protocol} ${src} -> ${dst}`;
}

function countRulesByAction(rules){
    return rules.reduce((acc, rule) => {
        if (rule.action === "allow") {
            acc.allow++;
        } else if (rule.action === "deny") {
            acc.deny++;
        }
        return acc;
    }, { allow: 0, deny: 0 })
}

function getRuleStatus(rules) {
    return rules.reduce((acc, rule) => { 
        acc.total++;

        if (rule.action === "allow") {
            acc.allow++;
        } else if (rule.action === "deny") {
            acc.deny++;
        }

        if (rule.protocol === "tcp") {
            acc.tcp++;
        } else if (rule.protocol === "udp") {
            acc.udp++;
        }

        return acc;
    },  { total: 0, allow: 0, deny: 0, tcp: 0, udp: 0 })
}

// console.log(getAllowedPorts(rules), "\n");
// console.log(getRulesByProtocol(rules, "tcp"), "\n");
// console.log(findRuleById(rules, 2));
// console.log(toggleRuleAction(findRuleById(rules, 2)));
// console.log(updateRuleAction(rules, 1, "block")); 
// console.log(formatRule(findRuleById(rules, 1)));
// console.log(countRulesByAction(rules));
console.log(getRuleStatus(rules));