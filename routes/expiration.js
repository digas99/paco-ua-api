const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

const setup = {
    "url": static.EXPIRATION_URL,
    "title": static.EXAMS_TITLE,
    "key": "expiration"
}

router.get("/", async (req, res) => {
    handleResponse(req, res, paco.expiration, setup);
});

module.exports = router;