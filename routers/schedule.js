const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');

router.post("/", async (req, res) => {  
    const now = new Date().toISOString();
    paco.standardScrape(res, req.page, static.SCHEDULE_URL, paco.schedule, result => ({
        "data": result,
        "url": static.SCHEDULE_URL,
        "title": static.SCHEDULE_TITLE,
        "timestamp": now
    }), error => ({
        "error":"Server error",
        "url": static.SCHEDULE_URL,
        "title": static.SCHEDULE_TITLE,
        "timestamp": now
    }));
});

module.exports = router;