const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const { handleResponse } = require('../responses');

const setup = {
    "url": static.TUITION_FEES_URL,
    "title": static.TUITION_FEES_TITLE,
    "key": "fees"
}

/**
 * @swagger
 * /tuition_fees:
 *  get:
 *      summary: Returns a list of all tuition fees instalments for each year
 *      tags: [TuitionFees]
 *      security:
 *          - basicAuth: []
 *      responses:
 *          200:
 *              description: List of tuition fees instalments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/TuitionFee'
 */

/**
 * @swagger
 * /tuition_fees?years={year}:
 *  get:
 *      summary: Returns a list of all tuition fees instalments for the specified year
 *      tags: [TuitionFees]
 *      security:
 *          - basicAuth: []
 *      parameters:
 *          - in: query
 *            name: years
 *            schema:
 *              type: string
 *            required: true
 *            description: Years to show on the result
 *      responses:
 *          200:
 *              description: List of tuition fees instalments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/TuitionFee'
 */

router.get("/", async (req, res) => {
    if (!req.query["years"])
        handleResponse(req, res, paco.tuitionFees, setup);
    else
        handleResponse(req, res, async page => paco.tuitionFees(page, req.query["years"].split(",")), setup);
});

module.exports = router;