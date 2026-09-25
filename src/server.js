const http = require("node:http");
const {loadRules, changeRuleAction} = require("./storage.js");

async function readBody(req) {
    req.setEncoding("utf8");

    let text = "";

    for await (const chunk of req) {
        text += chunk;
    }

    return text;
}

const server = http.createServer(async (req, res) => {
    console.log(req.method, req.url);
    const pathname = new URL(req.url, "http://localhost").pathname;
    const parts = pathname.split("/");

    if (req.method === "GET" && req.url === "/health") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({status:"ok"}));

        return;
    }

    if (req.method === "GET" && req.url === "/rules") {
        try {
            const rules = await loadRules();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify(rules));
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({error:"Internal server error"}));
            return;
        }

        return;
    }

    if (req.method === "GET" && parts.length === 3 && parts[1] === "rules") {
        const id = Number(parts[2]);
        if (!Number.isInteger(id) || id <= 0) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({error:"Invalid rule ID"}));
            return;
        }

        try {
            const rules = await loadRules();
            const rule = rules.find((item) => item.id === id);
            if (!rule) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(JSON.stringify({error:"Rule not found"}));
                return;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify(rule));
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({error:"Internal server error"}));
            return;
        }

        return;
    }

    if (req.method === "PATCH" && parts.length === 3 && parts[1] === "rules") {
        const id = Number(parts[2]);
        if (!Number.isInteger(id) || id <= 0) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({error:"Invalid rule ID"}));
            return;
        }

        let data;

        try{
            const text = await readBody(req);
            data = JSON.parse(text);
        } catch (err) {
            console.error(err);
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({error:"Invalid JSON body"}));
            return;
        }

        if (
                data === null || 
                typeof data !== "object" || 
                Array.isArray(data) || 
                (data.action !== "allow" && data.action !== "deny")
            ) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(JSON.stringify({error:"Invalid rule action"}));
                return;
            }

        try {
            const updateRule = await changeRuleAction(id, data.action);

            if (updateRule === null) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(JSON.stringify({error:"Rule not found"}));
                return;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify(updateRule));
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({error:"Internal server error"}));
            return;
        }

        return;
    }

    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({error:"Route not found"}));
});

server.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});