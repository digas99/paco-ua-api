const express = require('express')
const app = express()
const paco = require('./scrapers');

// login and put secretaria virtual in req
function login(req, res, next) {
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
                                console.log("Welcome to Secretaria Virtual");
                                next();
                            });
                    }
                    else {
                        res.status(400).json({
                            "error": "Email or Password missing!",
                            "timestamp": new Date().toISOString()
                        });
                    }
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        res.status(400).json({
                            "error": "JSON missing or bad format!",
                            "timestamp": new Date().toISOString()
                        });
                    }
                }
            });
    }
    else {
        res.status(400).json({
            "error": "This API only works over POST Requests",
            "timestamp": new Date().toISOString()
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

app.use("/personal", require('./routers/personal'))
app.use("/classes", require('./routers/classes'))
app.use("/schedule", require('./routers/schedule'))

app.listen(3001);
console.log('Node server running on port 3001');