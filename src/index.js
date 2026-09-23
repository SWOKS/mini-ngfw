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

console.log(getAllowedPorts(rules), "\n");
console.log(getRulesByProtocol(rules, "tcp"), "\n");
console.log(findRuleById(rules, 2));


