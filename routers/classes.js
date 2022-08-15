const express = require('express');
const router = express.Router();
const paco = require('../scrapers')

const CURRICULUM_URL = "https://paco.ua.pt/secvirtual/c_planocurr.asp";
const CURRICULUM_TITLE = "Plano Curricular";
const HISTORY_URL = "https://paco.ua.pt/secvirtual/c_historiconotas.asp";
const HISTORY_TITLE = "Histórico Notas";

router.post("/history", async (req, res) => {
    const secVirtual = req.page;
    await secVirtual.waitForSelector("#template_menu");
    await secVirtual.click(`td[title="${HISTORY_TITLE}"] > a`);
    await secVirtual.waitForSelector("#template_main");
    paco.classesHistory(secVirtual)
        .then(result => res.status(200).json({
            "data": result,
            "size": result.length,
            "url": HISTORY_URL,
            "title": HISTORY_TITLE,
            "timestamp": new Date().toISOString()
        }))
        .catch(error => res.status(500).json({
            "error":"Server error",
            "url": HISTORY_URL,
            "title": HISTORY_TITLE,
            "timestamp": new Date().toISOString()
        }));
});

module.exports = router;