const express = require('express');
const router = express.Router();
const paco = require('../scrapers')

const SCHEDULE_URL = "https://paco.ua.pt/secvirtual/horarios/c_horario_aluno.asp";
const SCHEDULE_TITLE = "Horário";

router.post("/", async (req, res) => {
    const secVirtual = req.page;
    await secVirtual.waitForSelector("#template_menu");
    await secVirtual.click(`td[title="${SCHEDULE_TITLE}"] > a`);
    await secVirtual.waitForSelector("#template_main");
    paco.schedule(secVirtual)
        .then(result => res.status(200).json({
            "data": result,
            "size": result.length,
            "url": SCHEDULE_URL,
            "title": SCHEDULE_TITLE,
            "timestamp": new Date().toISOString()
        }))
        .catch(error => res.status(500).json({
            "error":"Server error",
            "url": SCHEDULE_URL,
            "title": SCHEDULE_TITLE,
            "timestamp": new Date().toISOString()
        }));
});

module.exports = router;