const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");

const dataFile = path.join(
    __dirname,
    "..",
    "data",
    "rules.json"
);
const baseUrl = "http://localhost:3000";

test("GET /health возвращает 200 и статус ok", async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.deepEqual(data, { status: "ok" });
});

test("GET /rules?test=1 возвращает 200 и массив правил", async () => {
    const response = await fetch(`${baseUrl}/rules?test=1`);

    assert.equal(response.status, 200);

    const data = await response.json();

    const text = await fs.readFile(dataFile, "utf8");
    const rules = JSON.parse(text);

    assert.deepEqual(data, rules);
});

test("GET /rules возвращает 200 и массив правил", async () => {
    const response = await fetch(`${baseUrl}/rules`);

    assert.equal(response.status, 200);

    const data = await response.json();

    const text = await fs.readFile(dataFile, "utf8");
    const rules = JSON.parse(text);

    assert.deepEqual(data, rules);
});

test("GET /rules/1 возвращает 200 и правило с ID = 1", async () => {
    const response = await fetch(`${baseUrl}/rules/1`);

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.strictEqual(data.id, 1);
});

test("PATCH /rules/1 возвращает 200 и измененное правило", async () => {
    const body = {
        action: "allow"
    };

    const response = await fetch(`${baseUrl}/rules/1`, {
                                method: "PATCH",
                                headers: {"Content-Type": "application/json; charset=utf-8"},
                                body: JSON.stringify(body)
                            });                 

    assert.equal(response.status, 200);

    const data = await response.json();

    const text = await fs.readFile(dataFile, "utf8");
    const rule = JSON.parse(text).find((rule) => rule.id === 1);

    assert.ok(rule);

    assert.strictEqual(body.action, rule.action);

    assert.strictEqual(body.action, data.action);
});

test("POST /rules возвращает 201 и созданное правило с новым ID", async () => {
    const body = {
        src:"any",
        dst:"10.0.0.99",
        port:443,
        protocol:"tcp",
        action: "deny"
    };

    const response = await fetch(`${baseUrl}/rules`, {
                                method: "POST",
                                headers: {"Content-Type": "application/json; charset=utf-8"},
                                body: JSON.stringify(body)
                            });                 

    assert.equal(response.status, 201);

    const data = await response.json();

    const text = await fs.readFile(dataFile, "utf8");
    const newRule = JSON.parse(text).find((rule) => rule.id === data.id);

    assert.ok(newRule);

    const { id, ...bodyNewRule } = newRule;

    assert.deepEqual(body, bodyNewRule);

    assert.deepEqual(newRule, data);
});

test("DELETE /rules/:id возвращает 204 и пустое тело", async () => {
    const body = {
        src: "192.168.10.0/24",
        dst: "10.0.0.25",
        port: 8080,
        protocol: "tcp",
        action: "allow"
    };

    const newRule = await fetch(`${baseUrl}/rules`, {
                                method: "POST",
                                headers: {"Content-Type": "application/json; charset=utf-8"},
                                body: JSON.stringify(body)
                            });

    assert.equal(newRule.status, 201);
    
    const data = await newRule.json();

    const response = await fetch(`${baseUrl}/rules/${data.id}`, {
                                method: "DELETE"
                            });

    assert.equal(response.status, 204);

    assert.equal(await response.text(), "");
});
