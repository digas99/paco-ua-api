const puppeteer = require('puppeteer');

async function getSecretariaVirtual (email, pwd) {
    const browser = await puppeteer.launch({
        headless: true
    });
    
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

module.exports = { getSecretariaVirtual }