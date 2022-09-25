# paco-ua-api

## API for Portal Académico Online - Universidade de Aveiro

[![Latest Release](https://img.shields.io/github/v/release/digas99/paco-ua-api?label=Latest%20Version)](https://img.shields.io/github/v/release/digas99/paco-ua-api?label=Latest%20Version)

This API uses [Puppeteer](https://pptr.dev/) to, through a headless browser, log in and scrape the page **Secretaria Virtual** from [paco.ua.pt](https://paco.ua.pt). The results are routed with [Express.js](https://expressjs.com/).

This app is a personal project and has no affiliation with Universidade de Aveiro.

![logo](/public/paco-api-logo-45.png)

### [API Documentation](docs/README.md)

### Table of Contents

1. [Setup](#setup)
1. [Usage](#usage)
1. [Features](#features)
1. [Apps](#apps)

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

(To run on a different port, change the value of the port on the left side (***8000***:8000) in the command above. The port on the right ride (8000:***8000***) has to always match the port in the file static.js)

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
                        "abbrev": "SIO",
                        "code": "42573"
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
                        "abbrev": "AC-I",
                        "code": "41948"
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
                        "abbrev": "AC-I",
                        "code": "41948"
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
        "semester": 1
    },
    "url": "https://paco.ua.pt/secvirtual/horarios/c_horario_aluno.asp",
    "title": "Horário",
    "timestamp": "2022-08-16T01:51:09.193Z"
}
```

The same applies for all the other endpoints.

## Features

- Dados Pessoais &nbsp;&nbsp;`GET /personal`
- Situação de prescrição &nbsp;&nbsp;`GET /expiration`
- Histórico Notas &nbsp;&nbsp;`GET /subjects/history`
- Disciplinas Inscritas &nbsp;&nbsp;`GET /subjects/current`
- Estados das Propinas &nbsp;&nbsp;`GET /tuition_fees`
- Plano Curricular &nbsp;&nbsp;`GET /subjects`
- Calendário de Exames do Aluno &nbsp;&nbsp;`GET /exams`
- Calendário de Exames por Disciplina &nbsp;&nbsp;`GET /exams?subjects=...`
- Apoio às Aulas &nbsp;&nbsp;`GET /classes`
- Horário &nbsp;&nbsp;`GET /schedule`
- Requerimentos &nbsp;&nbsp;```GET /requests```

## Apps

If you have an app that uses this API, feel free to contact me or make a pull request of this README with your app, obeying the table format bellow.

| Logo | Name | Contributors | Description |
| ----- | ----- | ----- | ----- |
| <img width="32px" src="https://github.com/digas99/schedule-ua/blob/main/images/logo_32x32.png"></img> | [SchedUA](https://github.com/digas99/schedule-ua) | [@digas99](https://github.com/digas99) | Browser Extension for easy access to your Schedule from Universidade de Aveiro. |