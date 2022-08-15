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
$ node app.js
```

The server will be running at http://127.0.0.1:8000

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