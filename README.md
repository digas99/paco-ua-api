# paco-ua-api

## API for Portal Académico Online - Universidade de Aveiro

This API uses [Puppeteer](https://pptr.dev/) to, through a headless browser, log in and scrape the page **Secretaria Virtual** from [paco.ua.pt](https://paco.ua.pt). The results are routed with [Express.js](https://expressjs.com/).

![logo](/public/paco-api-logo-45.png)

### [API Documentation](docs/README.md)

### Table of Contents

1. [Setup](#setup)
2. [Usage](#usage)
3. [Progress](#progress)

## Setup

### Setup the server locally with Docker:

Make sure to have Docker running on your machine. [[How to here]](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04)

- Build the image

```
docker build --tag pacoua-api .
```

- Run the container

```
docker run -p 8000:8000 --name pacoua-api pacoua-api
```

---

(To run on a different port, change the value of the port on the left side (***8000***:8000) in the command above)

### Setup the server locally manually:

- Install the node modules

```
$ npm install
```

- Run the app

```
$ npm run devStart
```

(To run on a different port, change the value of **PORT** in the file static.js)

After any of the two configurations, the server will be running at http://127.0.0.1:8000

## Usage

Every endpoint is accessed through a GET HTTP Request, with your institutional email credentials in the **Basic Authorization** Header (encrypted in base64). [More Information](https://en.wikipedia.org/wiki/Basic_access_authentication#:~:text=password%20(see%20below).-,Client%20side,-%5Bedit%5D)

```shell
GET /schedule
  -H 'accept: application/json'
  -H 'Authorization: Basic {base64_encrypted_credentials}'
```

If everything is correct, this should be the response:

```json5
// RESPONSE
{
    "data": {
        "schedule": {
            "Segunda": [
                {
                    "subject": {
                        "name": "SEGURANÇA INFORMÁTICA E NAS ORGANIZAÇÕES",
                        "abbrev": "SIO"
                    },
                    "start": "9h",
                    "duration": "2h",
                    "capacity": 24,
                    "class": "P8",
                    "room": "04.2.03"
                },
                {
                    "subject": {
                        "name": "ARQUITETURA DE COMPUTADORES I",
                        "abbrev": "AC-I"
                    },
                    "start": "14h",
                    "duration": "1h",
                    "capacity": 98,
                    "class": "TP1",
                    "room": "ANF. V"
                },
                ...
            ],
            "Terça": [
                {
                    "subject": {
                        "name": "ARQUITETURA DE COMPUTADORES I",
                        "abbrev": "AC-I"
                    },
                    "start": "9h",
                    "duration": "2h",
                    "capacity": 18,
                    "class": "P07",
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

- [x] Dados Pessoais &nbsp;&nbsp;`GET /personal`
- [x] Situação de prescrição &nbsp;&nbsp;`GET /expiration`
- [x] Histórico Notas &nbsp;&nbsp;`GET /subjects/history`
- [x] Disciplinas Inscritas &nbsp;&nbsp;`GET /subjects/current`
- [x] Estados das Propinas &nbsp;&nbsp;`GET /tuition_fees`
- [x] Plano Curricular &nbsp;&nbsp;`GET /subjects`
- [x] Calendário de Exames do Aluno &nbsp;&nbsp;`GET /exams`
- [x] Calendário de Exames por Disciplina &nbsp;&nbsp;`GET /exams?subjects=...`
- [x] Apoio às Aulas &nbsp;&nbsp;`GET /classes`
- [x] Horário &nbsp;&nbsp;`GET /schedule`
- [x] Requerimentos &nbsp;&nbsp;```GET /requests```
