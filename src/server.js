const http = require("node:http");
const {getRuleById, getRules, changeRuleAction, createRule, deleteRule} = require("./rules-service.js");
const {readBody, sendJson} = require("./http-utils.js");


const server = http.createServer(async (req, res) => {
    console.log(req.method, req.url);
    const pathname = new URL(req.url, "http://localhost").pathname;
    const parts = pathname.split("/");

    if (req.method === "GET" && pathname === "/health") {
        return sendJson(res, 200, {status:"ok"});
    }

    if (req.method === "GET" && pathname === "/rules") {
        try {
            const rules = await getRules();
            return sendJson(res, 200, rules);
        } catch (err) {
            console.error(err);
            return sendJson(res, 500, {error:"Internal server error"});
        }
    }

    if (req.method === "GET" && parts.length === 3 && parts[1] === "rules") {
        const id = Number(parts[2]);
        if (!Number.isInteger(id) || id <= 0) {
            return sendJson(res, 400, {error:"Invalid rule ID"});
        }

        try {
            const rule = await getRuleById(id);
            if (!rule) {
                return sendJson(res, 404, {error:"Rule not found"});
            }
            return sendJson(res, 200, rule);
        } catch (err) {
            console.error(err);
            return sendJson(res, 500, {error:"Internal server error"});
        }
    }

    if (req.method === "PATCH" && parts.length === 3 && parts[1] === "rules") {
        const id = Number(parts[2]);
        if (!Number.isInteger(id) || id <= 0) {
            return sendJson(res, 400, {error:"Invalid rule ID"});
        }

        let data;
        try{
            const text = await readBody(req);
            data = JSON.parse(text);
        } catch (err) {
            console.error(err);
            return sendJson(res, 400, {error:"Invalid JSON body"});
        }

        if (
                data === null || 
                typeof data !== "object" || 
                Array.isArray(data) || 
                (data.action !== "allow" && data.action !== "deny")
            ) {
                return sendJson(res, 400, {error:"Invalid rule action"});
            }

        try {
            const updateRule = await changeRuleAction(id, data.action);

            if (updateRule === null) {
                return sendJson(res, 404, {error:"Rule not found"});
            }
            return sendJson(res, 200, updateRule);
        } catch (err) {
            console.error(err);
            return sendJson(res, 500, {error:"Internal server error"});
        }
    }

    if (req.method === "POST" && pathname === "/rules") {
        let data;
        try{
            const text = await readBody(req);
            data = JSON.parse(text);
        } catch (err) {
            console.error(err);
            return sendJson(res, 400, {error:"Invalid JSON body"});
        }

        if (typeof data !== "object" || data === null || Array.isArray(data)) {
            return sendJson(res, 400, {error:"Invalid JSON body"});
        }

        if (typeof data.src !== "string" || typeof data.dst !== "string" ||
            !data.src.trim() || !data.dst.trim() || 
            data.port < 1 || data.port > 65535 || !Number.isInteger(data.port) ||
            (data.protocol !== "tcp" && data.protocol !== "udp") ||
            (data.action !== "allow" && data.action !== "deny")
        ) {
            return sendJson(res, 400, {error:"Invalid firewall rule"});
        }

        try{
            const newRule = await createRule(data);
            res.setHeader("Location", `/rules/${newRule.id}`);
            return sendJson(res, 201, newRule);
        } catch (err) {
            console.error(err);
            return sendJson(res, 500, {error:"Internal server error"});
        }
    }

    if (req.method === "DELETE" && parts.length === 3 && parts[1] == "rules") {
        const id = Number(parts[2]);
        if (!Number.isInteger(id) || id <= 0) {
            return sendJson(res, 400, {error:"Invalid rule ID"});
        }

        try {
            const flag = await deleteRule(id);
            if (!flag) {
                return sendJson(res, 404, {error:"Rule not found"});
            }
            res.statusCode = 204;
            res.end();
            return;
        } catch (err) {
            console.error(err);
            return sendJson(res, 500, {error:"Internal server error"});
        }
    }

    return sendJson(res, 404, {error:"Route not found"});
});

server.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});