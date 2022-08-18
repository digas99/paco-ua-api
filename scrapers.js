const puppeteer = require('puppeteer');
const static = require('./static');

module.exports = {
    standardScrape: async (response, secretaria_virtual, section_url, scraper, success, error) => {
        // go to section within Secretaria Virtual
        await secretaria_virtual.goto(section_url);
        await secretaria_virtual.waitForSelector("body");
        
        // run the scraper for that section
        scraper(secretaria_virtual)
            .then(result => {
                if (result["size"] && result["size"] == null)
                    delete result["size"];
                response.status(200).json(success(result));
            })
            .catch(err => response.status(500).json(error(err)));
    },
    // Secretaria Virtual (login)
    // https://paco.ua.pt/secvirtual
    secretariaVirtual: async (email, password, headless=true) => {
        const browser = await puppeteer.launch({
            headless: headless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
        });
        
        const page = await browser.newPage();
        
        console.log("New Page");
        await htmlOnly(page);
        await page.goto("https://paco.ua.pt/secvirtual");

        // wait for idp login page to load
        await page.waitForSelector("#loginForm");

        // fill log in form
        await page.type("#username", email);
        await page.type("#password", password);

        // submit
        await page.click("#btnLogin");

        await page.waitForNavigation({waitUntil: 'networkidle2'});
        console.log("Welcome to Secretaria Virtual");

        return page;
    },
    // Dados Pessoais
    // https://paco.ua.pt/secvirtual/c_dadospess.asp
    personalData: async (page, section) => {
        return await page.$$eval('#template_main > div', (tables, section) => {
            let lines, key, result = {};

            // Dados Pessoais
            if (tables[0]) {
                key = "personal_data";
                if (!section || section == key) {
                    lines = tables[0].getElementsByClassName("table_line");
                    if (lines.length > 0) {
                        const [nmec, name] = lines[0].children[1].innerText.split(" - ");
                    
                        result[key] = {
                            "nmec": nmec.trim(),
                            "name": name,
                            "picture": lines[0].querySelector("img").src,
                            "father": lines[1].children[1].innerText.trim(),
                            "mother": lines[2].children[1].innerText.trim(),
                            "cc": lines[3].children[1].innerText.trim(),
                            "birth": lines[4].children[1].innerText.trim(),
                            "country": lines[4].children[2].querySelector("img").alt,
                            "gender": lines[4].children[3].innerText
                        }    
                    }          
                }
            }
        
            // Dados de Contacto & Moradas
            if (tables[1]) {
                lines = tables[1].getElementsByClassName("table_line");

                if (lines.length > 0) {
                    key = "contact_data";
                    if (!section || section == key) {
                        result[key] = {
                            "telephone": lines[0].children[1].innerText,
                            "mobile": lines[1].children[1].innerText,
                            "email": lines[2].children[1].innerText
                        }
                    }
                    key = "school_address";
                    if (!section || section == key) {
                        result[key] = {
                            "address": lines[3].children[1].innerText,
                            "place": lines[4].children[1].innerText,
                            "postal_code": lines[5].children[1].innerText
                        }
                    }
                    key = "permanent_address";
                    if (!section || section == key) {
                        result[key] = {
                            "address": lines[7].children[1].innerText,
                            "place": lines[8].children[1].innerText,
                            "postal_code": lines[9].children[1].innerText
                        }
                    }
                }
            }
        
            // Outros Dados
            if (tables[2]) {
                key = "other";
                if (!section || section == key) {
                    lines = tables[2].getElementsByClassName("table_line");
                    if (lines.length > 0) {
                        result[key] = {
                            "NIF": lines[0].children[1].innerText,
                            "NIB": lines[1].children[1].innerText
                        }
                    }
                }
            }
        
            return result;
        }, section);
    },
    // Histórico Notas
    // https://paco.ua.pt/secvirtual/c_historiconotas.asp
    subjectsHistory: async page => {
        return await page.$eval('#historico', table => {
            if (table) {
                const lines = Array.from(table.querySelectorAll("tbody > tr"));
                return {"subjects" :lines.filter(line => line.classList.length > 0)
                    .map(line => ({
                        "code": line.children[0].innerText,
                        "name": line.children[1].innerText,
                        "completed_date": line.children[2].innerText,
                        "grade": line.children[3].innerText
                    }))};
            }
        });
    },
    // Disciplinas Inscritas
    // https://paco.ua.pt/secvirtual/c_examesInscr.asp
    subjectsCurrent: async page => {
        return await page.$eval('#template_main > table', table => {
            if (table) {
                const lines = Array.from(table.querySelectorAll("tbody > tr"));
                const data = lines.filter(line => line.children[6].innerText == "Normal")
                    .map(line => ({
                        "code": line.children[0].innerText,
                        "name": line.children[1].innerText,
                        "year": line.children[2].innerText,
                        "semester": line.children[3].innerText,
                        "ects": line.children[4].innerText,
                        "new": line.children[5].innerText == "Sim",
                        "started_date": line.children[7].innerText
                    }));

                // add recurso and especial
                ["Recurso", "Especial"].forEach(type => {
                    const exams = lines.filter(line => line.children[6].innerText == type);
                    exams.forEach(exam => {
                        const normal = data.filter(line => line["code"] == exam.children[0].innerText)[0];
                        if (normal) normal[type.toLowerCase()] = exam.children[7].innerText;
                    }); 
                });

                return {"subjects": data};
            }
        });
    },
    // Horário
    // https://paco.ua.pt/secvirtual/horarios/c_horario_aluno.asp
    schedule: async (page, selector) => {
        return await page.$eval(selector, table => {
            const data = {
                "schedule": {
                    "Segunda": [],"Terça": [],"Quarta": [],"Quinta": [],"Sexta": [],"Sábado": []
                }
            };

            if (table) {
                // info
                const scheduleInfoElem = table.querySelector("tr").children[0];
                // subject schedule
                if (scheduleInfoElem.childNodes.length == 1) {
                    const scheduleInfo = scheduleInfoElem.childNodes[0].wholeText;
                    data["school_year"] = scheduleInfo.split(" - ")[3],
                    data["semester"] = scheduleInfo.split(" - ")[2].split("º")[0];
                }
                // student schedule
                else {
                    const scheduleInfo = scheduleInfoElem.childNodes[2].wholeText;
                    data["school_year"] = scheduleInfo.split(" - ")[1].split("AnoLectivo: ")[1];
                    data["semester"] = scheduleInfo.split(" - ")[2].split("º")[0];
                }

                // subjects
                Array.from(table.querySelectorAll(".horario_turma")).forEach(elem => {
                    const titleData = elem.title.split("\n");
                    const weekday = data["schedule"][titleData[1].split("DIA DA SEMANA: ")[1]];
                    weekday.push({
                        "subject": {
                            "name": titleData[0],
                            "abbrev": elem.childNodes[0].wholeText.split(" ")[0].replace("\n", "")
                        },
                        "start": titleData[2].split("INÍCIO: ")[1],
                        "duration": titleData[3].split("DURAÇÃO: ")[1],
                        "capacity": titleData[4].split("LOTAÇÃO: ")[1].split(" alunos")[0],
                        "class": elem.childNodes[0].wholeText.split(" ")[2],
                        "room": elem.childNodes[4].wholeText.replace(/[()]/g, "")
                    });
                });    
            }

            return data;
        });
    },
    // Estado das Propinas
    // https://paco.ua.pt/secvirtual/c_estadoDasProprinas.asp
    tuitionFees: async page => {
        return await page.$$eval('#template_main .table_line:not(:nth-child(2))', lines => {
            if (lines) {
                const data = {};
                
                // get years offset
                const lastFeeYear = Number(lines[0].children[2].innerText);
                const firstFeeYear = Number(lines[lines.length-4].children[2].innerText);
                console.log(lastFeeYear, firstFeeYear);
                for (let i=0; i<=(lastFeeYear-firstFeeYear); i++) {
                    data[[firstFeeYear+i]] = [];
                }
    
                Array.from(lines).filter(line => line.children.length > 1)
                    .sort((a, b) => Number(a.children[0].innerText.split("ª")[0]) - Number(b.children[0].innerText.split("ª")[0]))
                    .forEach(line => {
                        const year = data[line.children[2].innerText];
                        year.push({
                            "instalment": line.children[0].innerText.split("ª")[0],
                            "value": line.children[1].innerText.split(" Euros")[0],
                            "course-code": line.children[3].innerText,
                            "payment": {
                                "deadline": line.children[4].innerText,
                                "paid": line.children[5].innerText,
                                "status": line.children[6].innerText
                            }
                        });
                    });
                
                return {
                    "fees": data,
                    "last_updated": lines[lines.length-1].innerText.split("Última actualização: ")[1].replace("\n", "")
                };
            }
        });
    },
    // Calendário de Exames do Aluno
    // https://paco.ua.pt/secvirtual/c_calendarioDeExames.asp
    exams: async (page, selector) => {
        return await page.$$eval(selector, lines => {                
            const keys = {
                "FN": "Final",
                "RE": "Recurso",
                "DZ": "Especial"
            }

            const subjects_lines = lines.filter(line => line.classList[0]?.includes("table_cell"))
            // check for table type
            const userExams = subjects_lines[0].children.length == 9 ? true : false;

            const data = subjects_lines.map(line => ({
                    "subject": {
                        "code": line.children[1].innerText,
                        "name": line.children[2].innerText
                    },
                    "date": line.children[0].innerText,
                    "time": line.children[3].innerText,
                    "room": line.children[4].innerText,
                    "type": line.children[5].innerText,
                    "season": keys[line.children[6].innerText.trim()],
                    "department" : !userExams ? line.children[7].innerText : '',
                    "notes": line.children[userExams ? 7 : 8].innerText,
                    "changes": line.children[userExams ? 8 : 9].innerText
                }));
            
            return {
                "exams": data,
                "last_updated": lines[lines.length-2].innerText.split("Data última actualização: ")[1]
            };
        });
    },
    // Requerimentos
    // https://paco.ua.pt/secvirtual/pedidos_requerimentos_consultas_new.asp
    requests: async page => {
        return await page.$eval("iframe", iframe => {          
            const doc = iframe.contentWindow.document;
            const data = {};
            data["requests"] = Array.from(doc.querySelectorAll("#gvRequerimentos tr:not(:nth-child(1))"))
                .map(line => ({
                    "date": line.children[0].innerText,
                    "state": line.children[1].innerText
                }));

            return data;
        });
    },
    // Situação de prescrição
    // https://paco.ua.pt/secvirtual/c_situacaoprescricao.asp
    expiration: async page => {
        return await page.$eval("iframe", iframe => {          
            const doc = iframe.contentWindow.document;
            const data = {};
            data["expiration"] = Array.from(doc.querySelectorAll("#gvListaResumoPrescricao tr:not(:nth-child(1))"))
                .map(line => ({
                    "school_year": line.children[0].innerText.trim(),
                    "ects": {
                        "cumulative": Number(line.children[1].innerText),
                        "done": Number(line.children[2].innerText),
                        "missing": Number(line.children[6].innerText),
                        "total": Number(line.children[7].innerText) 
                    },
                    "enrollment_cumulative": Number(line.children[3].innerText),
                    "coefficient": Number(line.children[4].innerText),
                    "type": line.children[5].innerText,
                    "state": line.children[8].innerText
                }));

            data["info"] = Array.from(doc.querySelectorAll(".prescricaoInfo > p")).map(p => p.innerText);
            
            return data;
        });
    },
    // Plano Curricular
    // https://paco.ua.pt/secvirtual/c_planocurr.asp
    curriculum: async page => {
        return await page.$$eval("#template_main > table:nth-of-type(1) > tbody > .table_cell_impar, #template_main > table:nth-of-type(1) > tbody > .table_cell_par", (lines, months) => {
            const data = {};
            if (lines) {
                const fetchSubject = elem => ({
                    "code": elem.children[1].innerText.replaceAll(/[\n\t]/g, ""),
                    "name": elem.children[2].innerText.replaceAll(/[\n\t]/g, ""),
                    "year": elem.children[3].innerText.replaceAll(/[\n\t]/g, ""),
                    "semester": elem.children[4].innerText.replaceAll(/[\n\t]/g, ""),
                    "credits": parseInt(elem.children[5].innerText.replaceAll(/[\n\t]/g, "")),
                    "ects": parseInt(elem.children[6].innerText.replaceAll(/[\n\t]/g, "")),
                    "grade": Number(elem.children[7].innerText.replaceAll(/[\n\t]/g, ""))
                });

                data["subjects"] = Array.from(lines).map(line => {
                    const values = fetchSubject(line);

                    // if it is a subject with options
                    if (line.children[0].children.length > 1)
                        values["options"] = Array.from(line.nextElementSibling.querySelectorAll(".table_cell_impar, .table_cell_par"))
                            .map(option => fetchSubject(option));

                    return values;
                });
            }

            const overview = document.querySelectorAll("#template_main > table:nth-of-type(2) .table_cell_impar > td[align='right'], #template_main > table:nth-of-type(2) .table_cell_par > td[align='right']");
            data["overview"] =  {
                "done": {
                    "ects": parseInt(overview[0].innerText),
                    "subjects": Number(overview[3].innerText)
                },
                "left": {
                    "ects": parseInt(overview[1].innerText),
                    "subjects": Number(overview[5].innerText)
                },
                "credited": {
                    "ects": parseInt(overview[2].innerText),
                    "subjects": Number(overview[4].innerText) 
                }
            }
            
            // highest and lowest grade
            data["overview"]["lowest_grade"] = 0;
            data["overview"]["highest_grade"] = 0;

            // Σ(grade*ect)
            let grades = [];
            const sumGradeXECTs = data["subjects"].reduce((acc, cur, i) => {
                let grade = cur["grade"] ? cur["grade"] : 0;
                const ects = cur["ects"] ? cur["ects"] : 0;

                // consider options
                const options = cur["options"];
                if (options) {
                    // mean of grade from options
                    const optionsGradesSum = options.reduce((opt_acc, opt_cur) => opt_acc + (opt_cur["grade"] ? opt_cur["grade"] : 0), 0);
                    const numberCompletedOptions = options.filter(option => option["grade"] > 0).length;
                    grade = Math.round(optionsGradesSum/numberCompletedOptions);
                }

                // highest grade
                if (grade > data["overview"]["highest_grade"]) data["overview"]["highest_grade"] = grade;
                // lowest grade
                if (grade > 0) {
                    if (i == 0) data["overview"]["lowest_grade"] = grade;
                    else if (grade < data["overview"]["lowest_grade"]) data["overview"]["lowest_grade"] = grade;
                }

                grades.push(grade);
                return acc + (grade * ects);
            }, 0);
            
            // weighted mean = Σ(grade*ects)/Σ(ects)
            data["overview"]["weigted_mean"] = Number((sumGradeXECTs/data["overview"]["done"]["ects"]).toFixed(2));
            
            // standard deviation = √((Σ(grade - mean)²)/n_subjects)
            const sumGradesMinusMeanSquared = grades.reduce((acc, cur) => acc + Math.pow(cur - data["overview"]["weigted_mean"], 2), 0);
            data["overview"]["standard_deviation"] = Number(Math.sqrt(sumGradesMinusMeanSquared/data["overview"]["done"]["subjects"]).toFixed(2));

            const dateValues = document.querySelector("#template_main > table:nth-of-type(3) tr:nth-of-type(2)").innerText.split("Última actualização: ")[1].split(" às")[0].split(" de ");
            data["last_updated"] = `${dateValues[0]}-${months[dateValues[1]]}-${dateValues[2]}`; 
            return data;
        }, static.MONTHS);
    },
    // Apoio às Aulas
    // https://paco.ua.pt/secvirtual/aulas/lista_turmas_aluno.asp
    classes: async (page, fetch_teachers=false, subject_code) => {
        const data = await page.$$eval("#template_main table > tbody > .table_cell_impar, #template_main table > tbody > .table_cell_par", (lines, subject_code) => {
            const subjects = [], line_targets = [];
            if (lines) {
                Array.from(lines).forEach((line, i) => {
                    const name = line.children[3].innerText.trim();
                    const code = line.children[3].children[0].href.split(/[,(]/g)[1];
                    let subject;
                    if (!subject_code || (subject_code && subject_code == code)) {
                        if (subject_code && subject_code == code) line_targets.push(i);

                        for (let s of subjects) {
                            if (s["name"] === name) {
                                subject = s;
                                break;
                            }
                        }
    
                        if (!subject) {
                            subjects.push({
                                "code": code,
                                "name": name,
                                "urls": {
                                    "elearning": line.children[0].children[0].href,
                                    "schedule": line.children[1].children[0].href
                                },
                                "classes": [
                                    {
                                        "name": line.children[2].innerText,
                                        "type": line.children[4].innerText.trim(),
                                        "summaries": Number(line.children[5].innerText)
                                    }
                                ]
                            });
                        }
                        else {
                            subject["classes"].push({
                                "name": line.children[2].innerText,
                                "type": line.children[4].innerText.trim(),
                                "summaries": Number(line.children[5].innerText)
                            });
                        }   
                    }
                });
            }

            return {"subjects": subjects, "size": lines.length, "targets": line_targets};
        }, subject_code);

        if (fetch_teachers) {
            const teachers = [];

            const fetchTeachers = async (page, index) => {
                await page.click(`#template_main table > tbody > tr:nth-of-type(${index}) > :last-child > a:first-child`);
                await page.waitForSelector("#template_main");
                const teacher = await page.$$eval("#template_main table > tbody > .table_cell_impar, #template_main table > tbody > .table_cell_par", lines => {
                    if (lines) {
                        return Array.from(lines).map(line => ({
                            "name": line.children[1].innerText,
                            "department": line.children[2].innerText
                        }));
                    }
                });
                await page.goBack();
                return teacher;
            }
            
            if (data["targets"].length > 0)
                for (let target of data["targets"])
                    teachers.push(await fetchTeachers(page, target+2));
            else
                for (let i = 2; i <= data["size"]+1; i++)
                    teachers.push(await fetchTeachers(page, i));
    
            let counter = 0;
            // assign teachers to classes
            data["subjects"].forEach(subject => subject["classes"].forEach(result => result["teacher"] = teachers[counter++]));    
        }

        delete data["size"];
        delete data["targets"];

        return data;
    }
}

async function htmlOnly(page) {
    await page.setRequestInterception(true); // enable request interception
    return page.on('request', req => !["document", "xhr", "fetch", "script"].includes(req.resourceType()) ? req.abort() : req.continue());
}