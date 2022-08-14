const puppeteer = require('puppeteer');

// config env variables
require('dotenv').config();
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });

    getSecVir(browser, EMAIL, PASSWORD)
        .then(async page => {
            console.log("Welcome to Secretaria Virtual");
            
            await page.waitForSelector("#template_menu");
            console.log("menu");
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

run();
