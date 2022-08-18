const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

const setup = {
    "url": static.SCHEDULE_URL,
    "title": static.SCHEDULE_TITLE
}

router.post("/", async (req, res) => {  
    handleResponse(req, res, paco.schedule, setup);
});

module.exports = router;