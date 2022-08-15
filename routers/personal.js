const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');

router.post("/", async (req, res) => {
    const now = new Date().toISOString();
    paco.standardScrape(res, req.page, static.PERSONAL_TITLE, paco.personalData, result => ({
        "data": result,
        "url": static.PERSONAL_URL,
        "title": static.PERSONAL_TITLE,
        "timestamp": now
    }), error => ({
        "error":"Server error",
        "url": static.PERSONAL_URL,
        "title": static.PERSONAL_TITLE,
        "timestamp": now
    }));
});

module.exports = router;