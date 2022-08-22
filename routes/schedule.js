const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

const setup = {
    "url": static.SCHEDULE_URL,
    "title": static.SCHEDULE_TITLE
}

/**
 * @swagger
 * /schedule:
 *  get:
 *      summary: Returns a list of days of the week with the classes on that day
 *      tags: [Schedule]
 *      security:
 *          - basicAuth: []
 *      responses:
 *          200:
 *              description: List of days of the week with the classes on that day
 *              content:
 *                  application/json:
 *                      schema:
 *                          allOf:
 *                              - $ref: '#/components/schemas/Schedule'
 *                              - type: object
 *                                properties:
 *                                  school_year:
 *                                      type: string
 *                                      description: School year in the schedule
 *                                  semester:
 *                                      type: string
 *                                      description: Semester in the schedule
 */

router.get("/", async (req, res) => {  
    handleResponse(req, res, async page => paco.schedule(page, "#template_main > table"), setup);
});

/**
 * @swagger
 * /schedule/subject/{subject}:
 *  get:
 *      summary: Returns the schedule for a specific subject
 *      tags: [Schedule]
 *      security:
 *          - basicAuth: []
 *      parameters:
 *          - in: path
 *            name: subject
 *            schema:
 *              type: string
 *            required: true
 *            description: Code of the subject
 *      responses:
 *          200:
 *              description: List of days of the week with the classes on that day
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Schedule'
 */

router.get("/subject/:subject", async (req, res) => {
    // go to classes page
    const secretariaVirtual = req.page;
    await secretariaVirtual.goto(static.CLASSES_URL);
    await secretariaVirtual.waitForSelector("body");

    // fetch link to subject's schedule page
    const subjectData = await secretariaVirtual.$$eval("#template_main table > tbody > .table_cell_impar, #template_main table > tbody > .table_cell_par", (lines, subjectCode) => {
        if (lines) {
            for (let line of lines) {
                const code = line.children[3].children[0].href.split(/[,(]/g)[1];
                if (subjectCode == code)
                    return {
                        "url": line.children[1].children[0].href,
                        "name": line.children[3].innerText.trim()
                    };
            };
        }
        
        return {};
    }, req.params.subject);

    if (subjectData["url"]) {
        handleResponse(req, res, async page => paco.schedule(page, "table"), {
            "url": subjectData["url"],
            "title": static.SCHEDULE_TITLE+" de "+subjectData["name"]
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
});

module.exports = router;