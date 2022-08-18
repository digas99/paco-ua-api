const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

router.post("/", async (req, res) => {
    if (!req.query["subjects"]) {
        handleResponse(req, res, async page => paco.exams(page, "#template_main > form tr"), {
            "url": static.EXAMS_URL,
            "title": static.EXAMS_TITLE,
            "key": "exams"
        });
    }
    else {
        handleResponse(req, res, async page => {
            // search for subjects
            await page.waitForSelector("#listaDisciplinas");
            await page.type("#listaDisciplinas", req.query["subjects"]);
            await page.click("input[value='Pesquisar']");

            // fetch the search result
            await page.waitForSelector("#form2");
            return paco.exams(page, "#form2 tr");
        }, {
            "url": static.EXAMS_SUBJECTS_URL,
            "title": static.EXAMS_SUBJECTS_TITLE,
            "key": "exams"
        });
    }
});

module.exports = router;