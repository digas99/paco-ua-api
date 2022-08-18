const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

const setup = {
    "url": static.CLASSES_URL,
    "title": static.CLASSES_TITLE,
    "key": "subjects"
}

router.post("/", async (req, res) => {
    if (!req.query["include"])
        handleResponse(req, res, paco.classes, setup);
    else if (req.query["include"] === "teachers")
        handleResponse(req, res, async page => paco.classes(page, true), setup);
});

router.post("/:subject_code", async (req, res) => {
    if (!req.query["include"])
        handleResponse(req, res, async page => paco.classes(page, false, req.params.subject_code), setup);
    else if (req.query["include"] === "teachers")
        handleResponse(req, res, async page => paco.classes(page, true, req.params.subject_code), setup);
});

module.exports = router;