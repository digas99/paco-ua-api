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

router.get("/", async (req, res) => {
    if (!req.query["include"])
        handleResponse(req, res, paco.classes, setup);
    else if (req.query["include"] === "teachers")
        handleResponse(req, res, async page => paco.classes(page, true), setup);
});

router.get("/:subject", async (req, res) => {
    if (!req.query["include"])
        handleResponse(req, res, async page => paco.classes(page, false, req.params.subject), setup);
    else if (req.query["include"] === "teachers")
        handleResponse(req, res, async page => paco.classes(page, true, req.params.subject), setup);
});

router.get("/:subject/program", classesProgram);
router.get("/:subject/program/:section", classesProgram);

async function classesProgram (req, res) {
    // go to classes
    const secretariaVirtual = req.page;
    await secretariaVirtual.goto(static.CLASSES_URL);
    await secretariaVirtual.waitForSelector("body");

    // get subject index on list
    const subjectIndex = await secretariaVirtual.$$eval("#template_main table > tbody > .table_cell_impar, #template_main table > tbody > .table_cell_par", (lines, subjectCode) => {
        if (lines) {
            for (let [i, line] of lines.entries()) {
                const code = line.children[3].children[0].href.split(/[,(]/g)[1];
                if (subjectCode == code) return i;
            };
        }
    }, req.params.subject);

    if (!isNaN(subjectIndex)) {
        // click the link to the program
        await secretariaVirtual.click(`#template_main table > tbody > tr:nth-of-type(${subjectIndex+2}) > :nth-child(4) > a:first-child`);
        await secretariaVirtual.waitForSelector("#template_main");

        // fetch program
        const callback = !req.params.section ? paco.classProgram : async page => paco.classProgram(page, req.params.section);
        handleResponse(req, res, callback, {
            "url": null,
            "title": static.CLASSES_TITLE
        });
    }
    else {
        res.status(400).json({
            "message": "Invalid subject code. Please provide a code from one of your current classes!",
            "url": static.CLASSES_URL,
            "title": setup["title"],
            "timestamp": new Date().toISOString()
        });
    }
}

router.get("/:subject/absence", async (req, res) => {

});

router.get("/:subject/lessons", async (req, res) => {

});

module.exports = router;