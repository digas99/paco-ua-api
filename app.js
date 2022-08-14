const express = require('express')
const app = express()
const scrape = require('./scrape');

// login and put secretaria virtual in req
function login(req, res, next) {
    if (req.method == "POST") {
        let body = [];
        req.on('data', chunk => body.push(chunk))
            .on('end', () => {
                body = JSON.parse(Buffer.concat(body).toString());
                if (body["email"] && body["password"]) {
                    scrape.getSecretariaVirtual(body["email"], body["password"])
                        .then(async page => {
                            req.page = page;
                            console.log("Welcome to Secretaria Virtual");
                            next();
                        });
                }
            });
    }
    else {
        res.status(400).json({
            "error":"This API only works over POST Requests",
            "timestamp": new Date().toISOString()
        });
        next();
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

app.use("/personal-data", require('./routers/personal-data'))

app.listen(3001);
console.log('Node server running on port 3001');