const express = require('express');
const router = express.Router();
const paco = require('../paco-scrapers')

const URL = "https://paco.ua.pt/secvirtual/c_dadospess.asp";
const TITLE = "Dados Pessoais";

router.post("/", async (req, res) => {
    const secVirtual = req.page;
    await secVirtual.waitForSelector("#template_menu");
    await secVirtual.click(`td[title="${TITLE}"] > a`);
    await secVirtual.waitForSelector("#template_main");
    paco.personalData(secVirtual)
        .then(result => res.status(200).json({
            "data": result,
            "url": URL,
            "title": TITLE,
            "timestamp": new Date().toISOString()
        }))
        .catch(error => res.status(500).json({
            "error":"Server error",
            "url": URL,
            "title": TITLE,
            "timestamp": new Date().toISOString()
        }));
});

module.exports = router;