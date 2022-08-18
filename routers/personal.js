const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const handleResponse = require('../responses').handleResponse;

const setup = {
    "url": static.PERSONAL_URL,
    "title": static.PERSONAL_TITLE
}

router.post("/", async (req, res) => {
    handleResponse(req, res, paco.personalData, setup);
});

router.post("/:section", async (req, res) => {
    handleResponse(req, res, async page => paco.personalData(page, req.params.section), setup);
});

module.exports = router;