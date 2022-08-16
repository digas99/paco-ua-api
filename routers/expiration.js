const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');

router.post("/", async (req, res) => {
    const now = new Date().toISOString();
    paco.standardScrape(res, req.page, static.EXPIRATION_URL, paco.expiration, result => ({
        "data": result,
        "size": result["expiration"].length,
        "url": static.EXPIRATION_URL,
        "title": static.EXPIRATION_TITLE,
        "timestamp": now
    }), error => ({
        "error":"Server error",
        "url": static.EXPIRATION_URL,
        "title": static.EXPIRATION_TITLE,
        "timestamp": now
    }));
});

module.exports = router;