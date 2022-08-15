const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');

router.post("/history", async (req, res) => {
    const now = new Date().toISOString();
    paco.standardScrape(res, req.page, static.HISTORY_TITLE, paco.classesHistory, result => ({
        "data": result,
        "size": result["classes"].length,
        "url": static.HISTORY_URL,
        "title": static.HISTORY_TITLE,
        "timestamp": now
    }), error => ({
        "error":"Server error",
        "url": static.HISTORY_URL,
        "title": static.HISTORY_TITLE,
        "timestamp": now
    }));
});

router.post("/current", async (req, res) => {
    const now = new Date().toISOString();
    paco.standardScrape(res, req.page, static.CURRENT_TITLE, paco.classesCurrent, result => ({
        "data": result,
        "size": result["classes"].length,
        "url": static.CURRENT_URL,
        "title": static.CURRENT_TITLE,
        "timestamp": now
    }), error => ({
        "error":"Server error",
        "url": static.CURRENT_URL,
        "title": static.CURRENT_TITLE,
        "timestamp": now
    }));
});

module.exports = router;