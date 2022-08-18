const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

const setup = {
    "url": static.TUITION_FEES_URL,
    "title": static.TUITION_FEES_TITLE,
    "key": "fees"
}

router.post("/", async (req, res) => {
    handleResponse(req, res, paco.tuitionFees, setup);
});

module.exports = router;