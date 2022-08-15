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
                    "class": "SEGURANÇA INFORMÁTICA E NAS ORGANIZAÇÕES",
                    "begin": "9h",
                    "duration": "2h",
                    "capacity": "24",
                    "class-group": "P8",
                    "room": "04.2.03"
                },
                {
                    "class": "ARQUITETURA DE COMPUTADORES I",
                    "begin": "14h",
                    "duration": "1h",
                    "capacity": "98",
                    "class-group": "TP1",
                    "room": "ANF. V"
                },
                {
                    "class": "REDES DE COMUNICAÇÕES I",
                    "begin": "16h",
                    "duration": "2h",
                    "capacity": "19",
                    "class-group": "P8",
                    "room": "04.3.30"
                }
            ],
            "Terça": [
                {
                    "class": "ARQUITETURA DE COMPUTADORES I",
                    "begin": "9h",
                    "duration": "2h",
                    "capacity": "18",
                    "class-group": "P07",
                    "room": "04.2.17"
                },
                {
                    "class": "SEGURANÇA INFORMÁTICA E NAS ORGANIZAÇÕES",
                    "begin": "11h",
                    "duration": "2h",
                    "capacity": "120",
                    "class-group": "TP2",
                    "room": "ANF. IV"
                }
            ],
            "Quarta": [
                {
                    "class": "REDES DE COMUNICAÇÕES I",
                    "begin": "11h",
                    "duration": "1,5h",
                    "capacity": "112",
                    "class-group": "TP1",
                    "room": "ANF. V"
                }
            ],
            "Quinta": [
                {
                    "class": "ARQUITETURA DE COMPUTADORES I",
                    "begin": "12h",
                    "duration": "1h",
                    "capacity": "98",
                    "class-group": "TP1",
                    "room": "ANF. V"
                }
            ],
            "Sexta": [
                {
                    "class": "PROJETO EM ENGENHARIA DE COMPUTADORES E INFORMÁTICA",
                    "begin": "11h",
                    "duration": "2h",
                    "capacity": "80",
                    "class-group": "TP1",
                    "room": "04.1.02"
                }
            ],
            "Sábado": []
        },
        "school-year": "2021/2022",
        "semester": "1"
    },
    "url": "https://paco.ua.pt/secvirtual/horarios/c_horario_aluno.asp",
    "title": "Horário",
    "timestamp": "2022-08-15T20:24:42.741Z"
}
```
The same applies for all the other endpoints.

## Progress
- [x] Dados Pessoais &nbsp;&nbsp;```POST /personal```  
- [ ] Situação de prescrição
- [x] Histórico Notas &nbsp;&nbsp;```POST /classes/history```
- [x] Disciplinas Inscritas &nbsp;&nbsp;```POST /classes/current```
- [ ] Estados das Propinas
- [ ] Plano Curricular 
- [ ] Calendário de Exames do Aluno
- [ ] Calendário de Exames por Disciplina
- [ ] Apoio às Aulas
- [x] Horário &nbsp;&nbsp;```POST /schedule```
- [ ] Avisos
- [ ] Requerimentos
