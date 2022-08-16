const express = require('express')
const app = express()
const paco = require('./scrapers');
const static = require('./static');
const fs = require('fs');

let port = process.env.PORT || static.PORT;

// login and put secretaria virtual in req
function login(req, res, next) {
    const now = new Date().toISOString();
    if (req.method == "POST") {
        let body = [];
        req.on('data', chunk => body.push(chunk))
            .on('end', () => {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                    if (body["email"] && body["password"]) {
                        paco.secretariaVirtual(body["email"], body["password"])
                            .then(async page => {
                                req.page = page;
                                next();
                            });
                    }
                    else {
                        res.status(400).json({
                            "error": "Email or Password missing!",
                            "timestamp": now
                        });
                    }
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        res.status(400).json({
                            "error": "JSON missing or bad format!",
                            "timestamp": now
                        });
                    }
                }
            });
    }
    else {
        res.status(400).json({
            "error": "This API only works over POST Requests",
            "timestamp": now
        });
    }
}

// middleware to automatically login upon every request
app.use(login);

app.post("/", (req, res) => {
    res.status(200).json({
        "message":"No data to show here!",
        "timestamp": new Date().toISOString()
    });
});

//setup routes
fs.readdir(static.ROUTERS_DIR, (err, files) => files.forEach(file => app.use(`/${file.replace(".js", "")}`, require(static.ROUTERS_DIR+file.replace(".js", "")))));

app.listen(port, () => console.log('Node server running on port '+port));