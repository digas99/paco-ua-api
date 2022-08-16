# paco-ua-api


## API for Portal Académico Online - Universidade de Aveiro

This API uses [Puppeteer](https://pptr.dev/) to, through a headless browser, log in and scrape the page **Secretaria Virtual** from [paco.ua.pt](https://paco.ua.pt). The results are routed with [Express.js](https://expressjs.com/).

![logo](/images/paco-api-logo.png)

### [API Documentation](docs/README.md)

### Table of Contents
1. [Setup](#setup)
2. [Usage](#usage)
3. [Progress](#progress)

## Setup

To setup the server locally:

- Install the node modules
```
$ npm install
```

- Run the app
```
$ npm run devStart
```

The server will be running at http://127.0.0.1:8000

(To run on a different port, change the value of **PORT** in the file static.js)

## Usage
Every endpoint has to be accessed through a POST HTTP Request, with your institutional email credentials in the request body.

```POST /schedule```
```json5
// POST REQUEST BODY
{
    "email": "student@ua.pt",
    "password": "your password" 
}
```
If everything is correct, this should be the response:
```json5
// RESPONSE
{
    "data": {
        "schedule": {
            "Segunda": [
                {
                    "class": {
                        "name": "SEGURANÇA INFORMÁTICA E NAS ORGANIZAÇÕES",
                        "abbrev": "SIO"
                    },
                    "start": "9h",
                    "duration": "2h",
                    "capacity": "24",
                    "class_group": "P8",
                    "room": "04.2.03"
                },
                {
                    "class": {
                        "name": "ARQUITETURA DE COMPUTADORES I",
                        "abbrev": "AC-I"
                    },
                    "start": "14h",
                    "duration": "1h",
                    "capacity": "98",
                    "class_group": "TP1",
                    "room": "ANF. V"
                },
                ...
            ],
            "Terça": [
                {
                    "class": {
                        "name": "ARQUITETURA DE COMPUTADORES I",
                        "abbrev": "AC-I"
                    },
                    "start": "9h",
                    "duration": "2h",
                    "capacity": "18",
                    "class_group": "P07",
                    "room": "04.2.17"
                },
                ...
            ],
            ...
        },
        "school_year": "2021/2022",
        "semester": "1"
    },
    "url": "https://paco.ua.pt/secvirtual/horarios/c_horario_aluno.asp",
    "title": "Horário",
    "timestamp": "2022-08-16T01:51:09.193Z"
}
```
The same applies for all the other endpoints.

## Progress
- [x] Dados Pessoais &nbsp;&nbsp;```POST /personal```  
- [ ] Situação de prescrição
- [x] Histórico Notas &nbsp;&nbsp;```POST /classes/history```
- [x] Disciplinas Inscritas &nbsp;&nbsp;```POST /classes/current```
- [x] Estados das Propinas &nbsp;&nbsp;```POST /tuition_fees```
- [ ] Plano Curricular 
- [ ] Calendário de Exames do Aluno &nbsp;&nbsp;```POST /exams```
- [ ] Calendário de Exames por Disciplina &nbsp;&nbsp;```POST /exams?classes=...```
- [ ] Apoio às Aulas
- [x] Horário &nbsp;&nbsp;```POST /schedule```
- [ ] Avisos
- [ ] Requerimentos
