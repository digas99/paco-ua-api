const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');

router.post("/", async (req, res) => {
    const now = new Date().toISOString();
    if (!req.query["include"]) {
        paco.standardScrape(res, req.page, static.CLASSES_URL, paco.classes, result => ({
            "data": result,
            "size": result["subjects"].length,
            "url": static.CLASSES_URL,
            "title": static.CLASSES_TITLE,
            "timestamp": now
        }), error => ({
            "error":"Server error",
            "url": static.CLASSES_URL,
            "title": static.CLASSES_TITLE,
            "timestamp": now
        }));
    }
    else if (req.query["include"] === "teachers") {
        paco.standardScrape(res, req.page, static.CLASSES_URL, async page => paco.classes(page, true), result => ({
            "data": result,
            "size": result["subjects"].length,
            "url": static.CLASSES_URL,
            "title": static.CLASSES_TITLE,
            "timestamp": now
        }), error => ({
            "error":"Server error",
            "url": static.CLASSES_URL,
            "title": static.CLASSES_TITLE,
            "timestamp": now
        }));
    }
});

router.post("/:class_code", async (req, res) => {
    const now = new Date().toISOString();
    if (!req.query["include"]) {
        paco.standardScrape(res, req.page, static.CLASSES_URL, async page => paco.classes(page, false, req.params.class_code), result => ({
            "data": result,
            "size": result["subjects"].length,
            "url": static.CLASSES_URL,
            "title": static.CLASSES_TITLE,
            "timestamp": now
        }), error => ({
            "error":"Server error",
            "url": static.CLASSES_URL,
            "title": static.CLASSES_TITLE,
            "timestamp": now
        }));
    }
    else if (req.query["include"] === "teachers") {
        paco.standardScrape(res, req.page, static.CLASSES_URL, async page => paco.classes(page, true, req.params.class_code), result => ({
            "data": result,
            "size": result["subjects"].length,
            "url": static.CLASSES_URL,
            "title": static.CLASSES_TITLE,
            "timestamp": now
        }), error => ({
            "error":"Server error",
            "url": static.CLASSES_URL,
            "title": static.CLASSES_TITLE,
            "timestamp": now
        }));
    }
});

module.exports = router;