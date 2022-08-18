const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');

router.post("/", async (req, res) => {
    const now = new Date().toISOString();
    if (!req.query["subjects"]) {
        paco.standardScrape(res, req.page, static.EXAMS_URL, async page => paco.exams(page, "#template_main > form tr"), result => ({
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
        }));
    }
    else {
        paco.standardScrape(res, req.page, static.EXAMS_SUBJECTS_URL, async page => {
            // search for subjects
            await page.waitForSelector("#listaDisciplinas");
            console.log(req.query["subjects"]);
            await page.type("#listaDisciplinas", req.query["subjects"]);
            await page.click("input[value='Pesquisar']");

            // fetch the search result
            await page.waitForSelector("#form2");
            return paco.exams(page, "#form2 tr");
        }, result => ({
            "data": result,
            "size": result["exams"].length,
            "url": static.EXAMS_SUBJECTS_URL,
            "title": static.EXAMS_SUBJECTS_TITLE,
            "timestamp": now
        }), error => ({
            "error":"Server error",
            "url": static.EXAMS_SUBJECTS_URL,
            "title": static.EXAMS_SUBJECTS_TITLE,
            "timestamp": now
        }));
    }
});

module.exports = router;