const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');

router.post("/", async (req, res) => {
    const now = new Date().toISOString();
    if (!req.query["classes"]) {
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
        }), "#template_main > form tr");
    }
    else {
        paco.standardScrape(res, req.page, static.EXAMS_CLASSES_URL, async page => {
            // search for classes
            await page.waitForSelector("#listaDisciplinas");
            await page.type("#listaDisciplinas", req.query["classes"]);
            await page.click("input[value='Pesquisar']");

            // fetch the search result
            await page.waitForSelector("#form2");
            return paco.exams(page, "#form2 tr");
        }, result => ({
            "data": result,
            "size": result["exams"].length,
            "url": static.EXAMS_CLASSES_URL,
            "title": static.EXAMS_CLASSES_TITLE,
            "timestamp": now
        }), error => ({
            "error":"Server error",
            "url": static.EXAMS_CLASSES_URL,
            "title": static.EXAMS_CLASSES_TITLE,
            "timestamp": now
        }));
    }
});

module.exports = router;