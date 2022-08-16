const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');

router.post("/", async (req, res) => {
    const now = new Date().toISOString();
    paco.standardScrape(res, req.page, static.TUITION_FEES_URL, paco.tuitionFees, result => ({
        "data": result,
        "size": result["fees"].length,
        "url": static.TUITION_FEES_URL,
        "title": static.TUITION_FEES_TITLE,
        "timestamp": now
    }), error => ({
        "error":"Server error",
        "url": static.TUITION_FEES_URL,
        "title": static.TUITION_FEES_TITLE,
        "timestamp": now
    }));
});

module.exports = router;