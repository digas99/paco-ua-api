const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

/**
 * @swagger
 * /subjects:
 *  get:
 *      summary: Returns a list of all subjects information, completed or not
 *      tags: [Subjects]
 *      security:
 *          - basicAuth: []
 *      responses:
 *          200:
 *              description: List of subjects information
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              subjects:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/SubjectOptions'
 *                              overview:
 *                                  type: object
 *                                  properties:
 *                                      done:
 *                                          type: object
 *                                          properties:
 *                                              ects:
 *                                                  type: integer
 *                                                  description: Number of credits of all completed subjects (European Credit Transfer and Accumulation System)
 *                                              subjects:
 *                                                  type: integer
 *                                                  description: Number of completed subjects
 *                                      left:
 *                                          type: object
 *                                          properties:
 *                                              ects:
 *                                                  type: integer
 *                                                  description: Number of credits of all subjects yet to be completed (European Credit Transfer and Accumulation System)
 *                                              subjects:
 *                                                  type: integer
 *                                                  description: Number of subjects yet to be completed
 *                                      credited:
 *                                          type: object
 *                                          properties:
 *                                              ects:
 *                                                  type: integer
 *                                              subjects:
 *                                                  type: integer
 *                                      lowest_grade:
 *                                          type: integer
 *                                          description: Lowest grade of all completed subjects
 *                                      highest_grade:
 *                                          type: integer
 *                                          description: Highest grade of all completed subjects
 *                                      weighted_mean:
 *                                          type: integer
 *                                      standard_deviation:
 *                                          type: integer
 *                              last_updated:
 *                                  type: string
 *                                  description: Date of the last time the information was updated on PACO
 */

router.get("/", async (req, res) => {
    handleResponse(req, res, paco.curriculum, {
        "url": static.CURRICULUM_URL,
        "title": static.CURRICULUM_TITLE,
        "key": "subjects"
    });
});

/**
 * @swagger
 * /subjects/history:
 *  get:
 *      summary: Returns a list of all completed subjects information
 *      tags: [Subjects]
 *      security:
 *          - basicAuth: []
 *      responses:
 *          200:
 *              description: List of subjects information
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/SubjectHistory'
 */

router.get("/history", async (req, res) => {
    handleResponse(req, res, paco.subjectsHistory, {
        "url": static.HISTORY_URL,
        "title": static.HISTORY_TITLE,
        "key": "subjects"
    });
});

/**
 * @swagger
 * /subjects/current:
 *  get:
 *      summary: Returns a list of all subjects information that the student is taking this year (1st and 2nd semesters)
 *      tags: [Subjects]
 *      security:
 *          - basicAuth: []
 *      responses:
 *          200:
 *              description: List of subjects information
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/SubjectCurrent'
 */

router.get("/current", async (req, res) => {
    handleResponse(req, res, paco.subjectsCurrent, {
        "url": static.CURRENT_URL,
        "title": static.CURRENT_TITLE,
        "key": "subjects"
    });
});

module.exports = router;