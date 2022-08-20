const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

const setup = {
    "url": static.EXPIRATION_URL,
    "title": static.EXAMS_TITLE,
    "key": "expiration"
}

/**
 * @swagger
 * /expiration:
 *  get:
 *      summary: Returns a list of years with their expiration status
 *      tags: [Expiration]
 *      security:
 *          - basicAuth: []
 *      responses:
 *          200:
 *              description: List of years with their expiration status
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Expiration'
 */

router.get("/", async (req, res) => {
    handleResponse(req, res, paco.expiration, setup);
});

module.exports = router;