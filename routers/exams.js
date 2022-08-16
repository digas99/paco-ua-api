const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');

router.post("/", async (req, res) => {
    const now = new Date().toISOString();
    paco.standardScrape(res, req.page, static.EXAMS_URL, paco.exams, result => ({
        "data": result,
        "size": result["exams"].length,
        "url": static.EXAMS_URL,
        "title": static.EXAMS_TITLE,
        "timestamp": now
    }), error => ({
        "error":"Server error",
        "url": static.EXAMS_URL,
        "title": static.EXAMS_TITLE,
        "timestamp": now
    }));
});

module.exports = router;