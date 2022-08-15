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

async function standardScrape(response, secretariaVirtual, section_title, scraper, success, error) {
    // go to section within Secretaria Virtual
    await secretariaVirtual.waitForSelector("#template_menu");
    await secretariaVirtual.click(`td[title="${section_title}"] > a`);
    await secretariaVirtual.waitForSelector("#template_main");
    
    // run the scraper for that section
    scraper(secretariaVirtual)
        .then(result => response.status(200).json(success(result)))
        .catch(err => response.status(500).json(error(err)));
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
            return {"classes" :lines.filter(line => line.classList.length > 0)
                .map(line => ({
                    "code": line.children[0].innerText,
                    "class": line.children[1].innerText,
                    "completed-date": line.children[2].innerText,
                    "grade": line.children[3].innerText
                }))};
        }
    });
}

// Disciplinas Inscritas
// https://paco.ua.pt/secvirtual/c_examesInscr.asp
async function classesCurrent(page) {
    return await page.$eval('#template_main > table', table => {
        if (table) {
            const lines = Array.from(table.querySelectorAll("tbody > tr"));
            const data = lines.filter(line => line.children[6].innerText == "Normal")
                .map(line => ({
                    "code": line.children[0].innerText,
                    "class": line.children[1].innerText,
                    "year": line.children[2].innerText,
                    "semester": line.children[3].innerText,
                    "ects": line.children[4].innerText,
                    "new": line.children[5].innerText == "Sim",
                    "started-date": line.children[7].innerText
                }));

            // add recurso and especial
            ["Recurso", "Especial"].forEach(type => {
                const exams = lines.filter(line => line.children[6].innerText == type);
                exams.forEach(exam => {
                    const normal = data.filter(line => line["code"] == exam.children[0].innerText)[0];
                    if (normal) normal[type.toLowerCase()] = exam.children[7].innerText;
                }); 
            });

            return {"classes": data};
        }
    });
}

async function schedule(page) {
    return await page.$eval('#template_main > table', table => {
        if (table) {
            const data = {
                "schedule": {
                    "Segunda": [],"Terça": [],"Quarta": [],"Quinta": [],"Sexta": [],"Sábado": []
                }
            };
            // info
            const scheduleInfo = table.querySelector("tr").children[0].childNodes[2].wholeText;
            data["school-year"] = scheduleInfo.split(" - ")[1].split("AnoLectivo: ")[1];
            data["semester"] = scheduleInfo.split(" - ")[2].split("º")[0];
            // classes
            Array.from(table.querySelectorAll(".horario_turma")).forEach(elem => {
                const titleData = elem.title.split("\n");
                const weekday = data["schedule"][titleData[1].split("DIA DA SEMANA: ")[1]];
                weekday.push({
                    "class": titleData[0],
                    "begin": titleData[2].split("INÍCIO: ")[1],
                    "duration": titleData[3].split("DURAÇÃO: ")[1],
                    "capacity": titleData[4].split("LOTAÇÃO: ")[1].split(" alunos")[0],
                    "class-group": elem.childNodes[0].wholeText.split(" ")[2],
                    "room": elem.childNodes[4].wholeText.replace(/[()]/g, "")
                });
            });

            return data;
        }
    });
}

module.exports = { secretariaVirtual, standardScrape, personalData, classesHistory, classesCurrent, schedule }