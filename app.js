const express = require('express')
const app = express()
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require('cors');

const paco = require('./scrapers');
const static = require('./static');

const package = require('./package.json');

let PORT = process.env.PORT || static.PORT;
let IP = process.env.IP || "127.0.0.1";
let PROTOCOL = process.env.IP ? "https" : "http";

const path = require('path')
app.use('/public', express.static(path.join(__dirname, 'public')));

//app.use(express.static("public"));

// setup swagger docs
const swagger_options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: package["name"],
            version: package["version"],
            description: package["description"],
            contact: {
                email: "diogo.correia99@ua.pt"
            }
        },
        servers: [
            {
                url: PROTOCOL+"://"+IP+(process.env.PORT ? "" : ":"+PORT),
            }
        ],
    },
    apis: ["./routes/*.js", "./docs/paco-ua-api.yml"],
}

const swagger_specs = swaggerJsDoc(swagger_options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swagger_specs, {
    customSiteTitle: "PACO-UA API",
    customCssUrl: "/public/swagger-ui-custom.css",
    customfavIcon: "/public/paco-api-logo.png"
}));

// login and put secretaria virtual in req
function login(req, res, next) {
    const now = new Date().toISOString();
    const authorization = req.headers.authorization;
    if (authorization && authorization.split(" ")[0] === "Basic") {
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

// setup routes
app.use(cors()); // cors middlware

app.use(login); // middleware to automatically login upon every request

app.post("/", (req, res) => {
    res.status(200).json({
        "message":"No data to show here!",
        "timestamp": new Date().toISOString()
    });
});

//setup routes
fs.readdir(static.ROUTES_DIR, (err, files) => files.forEach(file => app.use(`/${file.replace(".js", "")}`, require(static.ROUTES_DIR+file.replace(".js", "")))));

app.listen(PORT, () => console.log('Node server running on port '+PORT));