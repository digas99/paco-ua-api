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
                let lines;

                // Dados Pessoais
                let personalData = {};
                if (tables[0]) {
                    lines = tables[0].getElementsByClassName("table_line");

                    let nmecName = lines[0].children[1].innerText.split(" - ");
                    
                    personalData = {
                        "nmec": nmecName[0],
                        "name": nmecName[1],
                        "picture": lines[0].querySelector("img").src,
                        "father": lines[1].children[1].innerText,
                        "mother": lines[2].children[1].innerText,
                        "cc": lines[3].children[1].innerText,
                        "birth": lines[4].children[1].innerText,
                        "country": lines[4].children[2].querySelector("img").alt,
                        "gender": lines[4].children[3].innerText
                    }              
                }

                // Dados de Contacto & Moradas
                let contactData = {}, schoolAddress = {}, permanentAddress = {};
                if (tables[1]) {
                    lines = tables[1].getElementsByClassName("table_line");

                    contactData = {
                        "telephone": lines[0].children[1].innerText,
                        "mobile": lines[1].children[1].innerText,
                        "email": lines[2].children[1].innerText
                    }

                    schoolAddress = {
                        "address": lines[3].children[1].innerText,
                        "place": lines[4].children[1].innerText,
                        "postal_code": lines[5].children[1].innerText
                    }

                    permanentAddress = {
                        "address": lines[7].children[1].innerText,
                        "place": lines[8].children[1].innerText,
                        "postal_code": lines[9].children[1].innerText
                    }
                }

                // Outros Dados
                let otherData = {};
                if (tables[2]) {
                    lines = tables[2].getElementsByClassName("table_line");

                    otherData = {
                        "NIF": lines[0].children[1].innerText,
                        "NIB": lines[1].children[1].innerText
                    }
                }

                return ({
                    "personal_data": personalData,
                    "contact_data": contactData,
                    "school_address": schoolAddress,
                    "permanent_address": permanentAddress,
                    "other": otherData
                });
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