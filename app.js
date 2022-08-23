const express = require('express')
const app = express()
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require('cors');
const path = require('path');

const paco = require('./scrapers');
const static = require('./static');

const package = require('./package.json');

const PORT = process.env.PORT || static.PORT;
const IP = process.env.IP || "127.0.0.1";
const PROTOCOL = process.env.IP ? "https" : "http";
const URL = PROTOCOL+"://"+IP+(process.env.PORT ? "" : ":"+PORT);

app.enable('trust proxy');

// middleware to force https
app.use((req, res, next) => {
    // only force when in production and not secure
    if (process.env.PORT && !req.secure)
        res.redirect("https://"+ req.headers.host + req.url);
    
    next();
});

// expose static content
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cors()); // cors middlware

// setup swagger docs
const swagger_options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: package["name"],
            version: package["version"],
            description: package["description"],
            contact: {
                name: "Diogo Correia",
                email: "diogo.correia99@ua.pt"
            }
        },
        servers: [
            {
                url: URL,
                description: "API Main Server"
            }
        ],
        externalDocs: {
            description: "Written down documentation",
            url: "https://github.com/digas99/paco-ua-api/tree/main/docs/README.md"
        }
    },
    apis: ["./routes/*.js", "./docs/paco-ua-api.yml"],
}

const swagger_specs = swaggerJsDoc(swagger_options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swagger_specs, {
    customSiteTitle: "PACO-UA API",
    customCssUrl: "/public/swagger-ui-custom.css",
    customfavIcon: "/public/paco-api-logo.png"
}));

app.get("/", (req, res) => {
    // temporarily redirect to /docs
    res.redirect('/docs'); 
});

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

// middleware to automatically login upon every request
app.use(login);

//setup routes
fs.readdir(static.ROUTES_DIR, (err, files) => {
    files.forEach(file => app.use(`/${file.replace(".js", "")}`, require(static.ROUTES_DIR+file.replace(".js", ""))))

    // middleware to handle 404 when nothing else responded
    app.use((req, res, next) => {
        res.status(404).json({
            "message": `404 | Endpoint ${req.url} Not Found!`,
            "url": URL+req.url,
            "timestamp": new Date().toISOString()
        });
        
        return;
    });
});

app.listen(PORT, () => console.log('Node server running on port '+PORT));