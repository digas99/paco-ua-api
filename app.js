const express = require('express')
const app = express()
const paco = require('./scrapers');
const static = require('./static');
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

let PORT = process.env.PORT || static.PORT;
let IP = process.env.IP || "127.0.0.1";
let PROTOCOL = process.env.IP ? "https" : "http";

// adapt swagger security scheme to http or https depending on the IP
fs.readFile("./docs/paco-ua-api.yml", {encoding: 'utf8'}, (err,data) => {
    let formatted
    if (process.env.IP) formatted = data.replace(/http/g, 'https');
    else formatted = data.replace(/https/g, 'http');
    
    fs.writeFile("./docs/paco-ua-api.yml", formatted, 'utf8', err =>{
        if (err) return console.log(err);
    });
});

// setup swagger docs
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
                url: PROTOCOL+"://"+IP+":"+PORT,
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
    const authorization = req.headers.authorization;
    if ((authorization && authorization.split(" ")[0] === "Basic") || req.url === "/docs") {
        const decoded = Buffer.from(authorization.substring(6), 'base64').toString('ascii');
        const [email, password] = decoded.split(":");
        if (email && password) {
            paco.secretariaVirtual(email, password)
                .then(async page => {
                    req.page = page;
                    next();
                });
        }
    }
    else {
        res.status(401).json({
            "message": "Unauthorized access. Please use Basic Auth with your institutional email credentials.",
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
fs.readdir(static.ROUTES_DIR, (err, files) => files.forEach(file => app.use(`/${file.replace(".js", "")}`, require(static.ROUTES_DIR+file.replace(".js", "")))));

app.listen(PORT, () => console.log('Node server running on port '+PORT));
