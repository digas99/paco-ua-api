const puppeteer = require('puppeteer');

// Secretaria Virtual (login)
// https://paco.ua.pt/secvirtual
async function secretariaVirtual (email, password, headless=true) {
    const browser = await puppeteer.launch({
        headless: headless
    });
    
    const page = await browser.newPage();
    const url = "https://paco.ua.pt/secvirtual";
    
    await page.goto(url);

    // wait for idp login page to load
    await page.waitForSelector("#loginForm");

    // fill log in form
    await page.type("#username", email);
    await page.type("#password", password);

    // submit
    await page.click("#btnLogin");

    return page;
}

// Dados Pessoais
// https://paco.ua.pt/secvirtual/c_dadospess.asp
async function personalData(page) {
    return await page.$$eval('#template_main > div', tables => {
        let lines;
    
        // Dados Pessoais
        let mainData = {};
        if (tables[0]) {
            lines = tables[0].getElementsByClassName("table_line");
            if (lines.length > 0) {
                const [nmec, name] = lines[0].children[1].innerText.split(" - ");
            
                mainData = {
                    "nmec": nmec.trim(),
                    "name": name,
                    "picture": lines[0].querySelector("img").src,
                    "father": lines[1].children[1].innerText.trim(),
                    "mother": lines[2].children[1].innerText.trim(),
                    "cc": lines[3].children[1].innerText,
                    "birth": lines[4].children[1].innerText,
                    "country": lines[4].children[2].querySelector("img").alt,
                    "gender": lines[4].children[3].innerText
                }    
            }          
        }
    
        // Dados de Contacto & Moradas
        let contactData = {}, schoolAddress = {}, permanentAddress = {};
        if (tables[1]) {
            lines = tables[1].getElementsByClassName("table_line");
            if (lines.length > 0) {
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
        }
    
        // Outros Dados
        let otherData = {};
        if (tables[2]) {
            lines = tables[2].getElementsByClassName("table_line");
            if (lines.length > 0) {
                otherData = {
                    "NIF": lines[0].children[1].innerText,
                    "NIB": lines[1].children[1].innerText
                }
            }
        }
    
        return ({
            "personal_data": mainData,
            "contact_data": contactData,
            "school_address": schoolAddress,
            "permanent_address": permanentAddress,
            "other": otherData
        });
    });
}

// Histórico Notas
// https://paco.ua.pt/secvirtual/c_historiconotas.asp
async function classesHistory(page) {
    return await page.$eval('#historico', table => {
        if (table) {
            const lines = Array.from(table.querySelectorAll("tbody > tr"));
            return lines.filter(line => line.classList.length > 0)
                .map(line => ({
                    "code": line.children[0].innerText,
                    "class": line.children[1].innerText,
                    "completed": line.children[2].innerText,
                    "grade": line.children[3].innerText
                }));
        }
    });
}

module.exports = { secretariaVirtual, personalData, classesHistory }