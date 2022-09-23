const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

/**
 * @swagger
 * /exams:
 *  get:
 *      summary: Returns a list of the student's exams
 *      tags: [Exams]
 *      security:
 *          - basicAuth: []
 *      responses:
 *          200:
 *              description: List of of exams
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Exam'
 */

/**
 * @swagger
 * /exams?subjects={code}:
 *  get:
 *      summary: Returns a list of the student's exams
 *      tags: [Exams]
 *      security:
 *          - basicAuth: []
 *      parameters:
 *          - in: query
 *            name: subjects
 *            schema:
 *              type: integer
 *            required: true
 *            description: Code of the subject to get exams from
 *      responses:
 *          200:
 *              description: List of of exams
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Exam'
 */

router.get("/", async (req, res) => {
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