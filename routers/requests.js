const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

const setup = {
    "url": static.REQUESTS_URL,
    "title": static.REQUESTS_TITLE,
    "key": "requests"
}

router.post("/", async (req, res) => {
    handleResponse(req, res, paco.requests, setup);
});

module.exports = router;