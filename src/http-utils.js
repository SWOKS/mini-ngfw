async function readBody(req) {
    req.setEncoding("utf8");

    let text = "";

    for await (const chunk of req) {
        text += chunk;
    }

    return text;
};

function sendJson(res, statusCode, data) {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(data));
};

module.exports = {
    readBody,
    sendJson
};