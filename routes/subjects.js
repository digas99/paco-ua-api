const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

router.post("/", async (req, res) => {
    handleResponse(req, res, paco.curriculum, {
        "url": static.CURRICULUM_URL,
        "title": static.CURRICULUM_TITLE,
        "key": "subjects"
    });
});

router.post("/history", async (req, res) => {
    handleResponse(req, res, paco.subjectsHistory, {
        "url": static.HISTORY_URL,
        "title": static.HISTORY_TITLE,
        "key": "subjects"
    });
});

router.post("/current", async (req, res) => {
    handleResponse(req, res, paco.subjectsCurrent, {
        "url": static.CURRENT_URL,
        "title": static.CURRENT_TITLE,
        "key": "subjects"
    });
});

module.exports = router;