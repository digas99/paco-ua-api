const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

const setup = {
    "url": static.REQUESTS_URL,
    "title": static.REQUESTS_TITLE,
    "key": "requests"
}

/**
 * @swagger
 * /requests:
 *  post:
 *      summary: Returns the student's requests to Reitoria - Universidade de Aveiro
 *      tags: [Requests]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Credentials'
 *      responses:
 *          200:
 *              description: Requests to Reitoria - Universidade de Aveiro
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Request'
 */

router.post("/", async (req, res) => {
    handleResponse(req, res, paco.requests, setup);
});

module.exports = router;