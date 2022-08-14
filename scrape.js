const puppeteer = require('puppeteer');

async function scrape(email, password) {
    const browser = await puppeteer.launch({
        headless: true
    });

    return await getSecVir(browser, email, password)
        .then(async page => {
            console.log("Welcome to Secretaria Virtual");
            await page.waitForSelector("#template_menu");

            await page.click('td[title="Dados Pessoais"] > a');

            await page.waitForSelector("#template_main");
            return await page.$$eval('#template_main > div', tables => {
                const table = tables[0];
                if (table) {
                    const lines = table.getElementsByClassName("table_line");
                    if (lines) {
                        let data = [];

                        // nome | nmec
                        let line1Data = {};
                        [line1Data["nmec"], line1Data["name"]] = lines[0].children[1].innerText.split(" - ");

                        return line1Data;
                    }                    
                }
            });
        });
}

async function getSecVir (browser, email, pwd) {
    const page = await browser.newPage();
    const url = "https://paco.ua.pt/secvirtual";
    
    await page.goto(url);

    // wait for idp login page to load
    await page.waitForSelector("#loginForm");

    // fill log in form
    await page.type("#username", email);
    await page.type("#password", pwd);

    // submit
    await page.click("#btnLogin");

    return page;
}

module.exports = { scrape }