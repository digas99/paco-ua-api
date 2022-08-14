const http = require('http');
const scrape = require('./scrape').scrape;

let app = http.createServer((req, res) => {
    if (req.method == "POST") {
        let body = [];
        req.on('data', chunk => {
            body.push(chunk);
        }).on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());
            if (body["email"] && body["password"]) {
                scrape(body["email"], body["password"])
                    .then(content => {
                        console.log(content);
                        if (content) {
                            res.setHeader('Content-Type', 'application/json');
                            res.writeHead(200);
                            res.write(JSON.stringify({
                                "data": content,
                                "timestamp": new Date().toISOString()
                            }, null, 3));
                        }
                        else {
                            res.writeHead(500);
                            res.write(JSON.stringify({
                                "error": "Server error",
                                "timestamp":  new Date().toISOString()
                            }, null, 3));
                        }
                        res.end();
                    });
            }
        });
    }
});

app.listen(8000, '127.0.0.1');
console.log('Node server running on port 8000');