const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');

router.post("/", async (req, res) => {
    const now = new Date().toISOString();
    paco.standardScrape(res, req.page, static.CURRICULUM_URL, paco.curriculum, result => ({
        "data": result,
        "size": result["subjects"].length,
        "url": static.CURRICULUM_URL,
        "title": static.CURRICULUM_TITLE,
        "timestamp": now
    }), error => ({
        "error":"Server error",
        "url": static.CURRICULUM_URL,
        "title": static.CURRICULUM_TITLE,
        "timestamp": now
    }));
});

router.post("/history", async (req, res) => {
    const now = new Date().toISOString();
    paco.standardScrape(res, req.page, static.HISTORY_URL, paco.subjectsHistory, result => ({
        "data": result,
        "size": result["subjects"].length,
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
    paco.standardScrape(res, req.page, static.CURRENT_URL, paco.subjectsCurrent, result => ({
        "data": result,
        "size": result["subjects"].length,
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