const express = require('express')
const app = express()
const paco = require('./scrapers');
const static = require('./static');
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

let PORT = process.env.PORT || static.PORT;

// setup docs
const swagger_options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "PACO-UA API",
            version: "0.0.1",
            description: "API for Portal Académico Online - Universidade de Aveiro. This API uses a headless browser to fetch data directly from [paco.ua.pt](https://paco.ua.pt), so its uptime and latency may be impacted by the website itself. To see the written down documentation go to [https://github.com/digas99/paco-ua-api/tree/main/docs](https://github.com/digas99/paco-ua-api/tree/main/docs).",
            contact: {
                email: "diogo.correia99@ua.pt"
            }
        },
        servers: [
            {
                url: "http://127.0.0.1:"+PORT,
            }
        ]
    },
    apis: ["./routes/*.js", "./docs/paco-ua-api.yml"]
}

const swagger_specs = swaggerJsDoc(swagger_options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swagger_specs));

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
        // whitelist /docs
        if (req.url !== "/docs") {
            res.status(400).json({
                "error": "This API only works over POST Requests. To see documentation go to /docs.",
                "timestamp": now
            });
        }
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
fs.readdir(static.ROUTES_DIR, (err, files) => files.forEach(file => app.use(`/${file.replace(".js", "")}`, require(static.ROUTES_DIR+file.replace(".js", "")))));

app.listen(PORT, () => console.log('Node server running on port '+PORT));