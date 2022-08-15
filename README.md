# paco-ua-api
## API for Portal Académico - Universidade de Aveiro

This API uses [Puppeteer](https://github.com/puppeteer/puppeteer) to, through a headless browser, log in and scrape the page **Secretaria Virtual** from [paco.ua.pt](https://paco.ua.pt). The results are routed with [Express.js](https://expressjs.com/).

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

## Usage
Every endpoint has to be accessed through a POST HTTP Request, with your institutional email credentials in the request body.

```POST /personal```
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
        "personal_data": {
            "nmec": "...",
            "name": "...",
            "picture": "...",
            "father": "...",
            "mother": "...",
            "cc": " ...",
            "birth": " ...",
            "country": "...",
            "gender": "..."
        },
        "contact_data": {
            "telephone": "...",
            "mobile": "...",
            "email": "..."
        },
        "school_address": {
            "address": "...",
            "place": "...",
            "postal_code": "..."
        },
        "permanent_address": {
            "address": "...",
            "place": "...",
            "postal_code": "..."
        },
        "other": {
            "NIF": "...",
            "NIB": "..."
        }
    },
    "url": "https://paco.ua.pt/secvirtual/c_dadospess.asp",
    "title": "Dados Pessoais",
    "timestamp": "2022-08-15T01:08:59.884Z"
}
```
The same applies for all the other endpoints.

## Progress
- [x] Dados Pessoais &nbsp;&nbsp;```POST /personal```  
- [ ] Situação de prescrição
- [x] Histórico Notas &nbsp;&nbsp;```POST /classes/history```
- [ ] Disciplinas Inscritas
- [ ] Estados das Propinas
- [ ] Plano Curricular 
- [ ] Calendário de Exames do Aluno
- [ ] Calendário de Exames por Disciplina
- [ ] Apoio às Aulas
- [ ] Horário
- [ ] Avisos
- [ ] Requerimentos
