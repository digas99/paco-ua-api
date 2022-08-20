const express = require('express');
const router = express.Router();
const paco = require('../scrapers');
const static = require('../static');
const handleResponse = require('../responses').handleResponse;

const setup = {
    "url": static.PERSONAL_URL,
    "title": static.PERSONAL_TITLE
}

/**
 * @swagger
 * /personal:
 *  get:
 *      summary: Returns the student's personal data
 *      tags: [PersonalData]
 *      security:
 *          - basicAuth: []
 *      responses:
 *          200:
 *              description: Student's personal data
 *              content:
 *                  application/json:
 *                      schema:
 *                          allOf:
 *                              - $ref: '#/components/schemas/PersonalData'
 *                              - $ref: '#/components/schemas/ContactData'
 *                              - type: object
 *                                properties:
 *                                  school_addres:
 *                                      $ref: '#/components/schemas/Address'
 *                                  permanent_address:
 *                                      $ref: '#/components/schemas/Address'
 *                                  other:
 *                                      type: object
 *                                      properties:
 *                                          NIF:
 *                                              type: string
 *                                              description: VAT identification number (Número de identificação fiscal)
 *                                          NIB:
 *                                              type: string
 *                                              description: (Número de Identificação Bancária)
 */

router.get("/", async (req, res) => {
    handleResponse(req, res, paco.personalData, setup);
});

/**
 * @swagger
 * /personal/{section}:
 *  get:
 *      summary: Returns a section of the student's personal data
 *      tags: [PersonalData]
 *      security:
 *          - basicAuth: []
 *      parameters:
 *          - in: path
 *            name: section
 *            schema:
 *              type: string
 *            required: true
 *            description: Section from personal data
 *      responses:
 *          200:
 *              description: Student's personal data
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/schemas/PersonalData'
 *                              - $ref: '#/components/schemas/ContactData'
 *                              - type: object
 *                                properties:
 *                                  school_addres:
 *                                      $ref: '#/components/schemas/Address'
 *                                  permanent_address:
 *                                      $ref: '#/components/schemas/Address'
 *                                  other:
 *                                      type: object
 *                                      properties:
 *                                          NIF:
 *                                              type: string
 *                                              description: VAT identification number (Número de identificação fiscal)
 *                                          NIB:
 *                                              type: string
 *                                              description: (Número de Identificação Bancária)
 */

router.get("/:section", async (req, res) => {
    handleResponse(req, res, async page => paco.personalData(page, req.params.section), setup);
});

module.exports = router;