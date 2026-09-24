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

// function getAllowedPorts(rules) {
//     return rules
//         .filter(rule => rule.action === "allow")
//         .map(rule => rule.port);
// }

// function getRulesByProtocol(rules, protocol) {
//     return rules.filter(rule => rule.protocol === protocol);
// }

// function findRuleById(rules, id) {
//     const rule = rules.find(rule => rule.id === id);
//     return rule ?? null;
// }

// function toggleRuleAction(rule) {
//     return {
//         ...rule,
//         action: rule.action === "allow" ? "deny" : "allow"
//     };
// }

// function updateRuleAction(rules, id, action) {
//     if (action !== "allow" && action !== "deny") {
//         return null;
//     }

//     return rules.map(rule => {
//         if (rule.id === id) {
//             return {
//                 ...rule,
//                 action: action
//             }
//         }
//         return rule;
//     });
// }

// function formatRule({ id, action, protocol, src, dst, port }) {
//     return `#${id} ${(action).toUpperCase()} ${protocol} ${src}:${port} -> ${dst}:${port}`;
// }

// function countRulesByAction(rules){
//     return rules.reduce((acc, rule) => {
//         if (rule.action === "allow") {
//             acc.allow++;
//         } else if (rule.action === "deny") {
//             acc.deny++;
//         }
//         return acc;
//     }, { allow: 0, deny: 0 })
// }

// function getRuleStats(rules) {
//     return rules.reduce((acc, rule) => { 
//         acc.total++;

//         if (rule.action === "allow") {
//             acc.allow++;
//         } else if (rule.action === "deny") {
//             acc.deny++;
//         }

//         if (rule.protocol === "tcp") {
//             acc.tcp++;
//         } else if (rule.protocol === "udp") {
//             acc.udp++;
//         }

//         return acc;
//     },  { total: 0, allow: 0, deny: 0, tcp: 0, udp: 0 })
// }

// // console.log(getAllowedPorts(rules), "\n");
// // console.log(getRulesByProtocol(rules, "tcp"), "\n");
// // console.log(findRuleById(rules, 2));
// // console.log(toggleRuleAction(findRuleById(rules, 2)));
// // console.log(updateRuleAction(rules, 1, "block")); 
// // console.log(formatRule(findRuleById(rules, 1)));
// // console.log(countRulesByAction(rules));
// // console.log(getRuleStats(rules));

// function applyRule(rule, callback) {
//     if (rule.action !== "allow" && rule.action !== "deny") {
//         callback(new Error("Invalid rule action"), null);
//         return;
//     }

//     setTimeout(() => callback(null, `Rule #${rule.id} applied`), 500);
// }

// applyRule(rules[0], (error, message) => {
//     if (error) {
//         console.error(error);
//         return;
//     }

//     console.log(message);
// });
// console.log("Applying rule...");

// function applyRuleAsync(rule) {
//     return new Promise((resolve, reject) => {
//         if (rule.action !== "allow" && rule.action !== "deny") {
//             reject(new Error("Invalid rule action"));
//             return;
//         } else if ((rule.id < 1) || (rule.id > 5)) {
//             reject(new Error("Invalid rule id"));
//             return;
//         }

//         setTimeout(() => resolve(`Rule #${rule.id} applied`), 1000);
//     })
// }

// // applyRuleAsync(rules[0])
// //     .then((message) => {
// //         console.log(message);
// //     })
// //     .catch((error) => {
// //         console.error(error.message);
// //     });
// // console.log("Applying rule...");

// async function testApplyRule(rule) {
//     try {
//         const result = await applyRuleAsync(rule);
//         console.log(result);
//         return result;
//     } catch (error) {
//         console.log(error.message);
//         throw error;
//     }
// }

// // testApplyRule(rules[0]);
// // console.log("Applying rule...");

// async function applyRulesSequentially(rules) {
//     for (const rule of rules) {
//         await testApplyRule(rule);
//     }

//     return "All rules applied";
// }

// // console.time("sequential");
// // console.log("Applying rule...");
// // applyRulesSequentially(rules)
// //     .then((message) => {
// //         console.log(message);
// //         console.timeEnd("sequential");
// //     })
// //     .catch((error) => {
// //         console.log(error.message);
// //     });

// async function applyRulesParallel(rules) {
//     return Promise.all([
//         testApplyRule(rules[0]),
//         testApplyRule(rules[1]),
//         testApplyRule(rules[2]),
//         testApplyRule(rules[3]),
//         testApplyRule(rules[4])
//     ])
// }

// console.time("parallel");
// console.log("Applying rule...");
// applyRulesParallel(rules)
//     .then((message) => {
//         console.log(message);
//         console.timeEnd("parallel");
//     })
//     .catch((error) => {
//         console.log(error.message)
//     });


// // console.log("1");
// // Promise.resolve().then(() => {
// //     console.log("2");
// // });
// // setTimeout(() => {
// //     console.log("3");
// // }, 0);
// // console.log("4");

// // console.log("A");
// // setTimeout(() => {
// //     console.log("B");
// // }, 0);
// // Promise.resolve()
// //     .then(() => {
// //         console.log("C");
// //     })
// //     .then(() => {
// //         console.log("D");
// //     });
// // console.log("E");

// // async function test() {
// //     console.log("B");
// //     await Promise.resolve();
// //     console.log("C");
// // }
// // console.log("A");
// // test();
// // console.log("D");

const { loadRules, saveRules, changeRuleAction } = require("./storage.js");

async function main() {
    saveRules(rules)
        .then(() => {
            console.log("Rules saved successfully.");
        })
        .catch((error) => {
            console.error("Error saving rules:", error.message);
        });

    changeRuleAction(2, "allow")
        .then(() => {
            console.log("Rule action changed successfully.");
        })
        .catch((error) => {
            console.error("Error changing rule action:", error.message);
        });

    loadRules()
        .then((rules) => {
            console.log("Rules loaded:", rules);
        })
        .catch((error) => {
            console.error("Error loading rules:", error.message);
        });
}

main();