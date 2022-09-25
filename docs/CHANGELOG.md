# [Changelog v1.0.7](https://github.com/digas99/paco-ua-api/releases/tag/v1.0.7)
Released on 25/09/2022

## Bug Fixes
- Fixed the way the abbreviation of a subject is created when fetching the schedule of a specific subject

# [Changelog v1.0.6](https://github.com/digas99/paco-ua-api/releases/tag/v1.0.6)
Released on 25/09/2022

## Bug Fixes
- Changed EventEmitter max listeners to prevent heroku from crashing server when multiple concurrent requests are made to the API

# [Changelog v1.0.5](https://github.com/digas99/paco-ua-api/releases/tag/v1.0.5)
Released on 25/09/2022

## Content
- Added subjects codes to /schedule endpoint

# [Changelog v1.0.4](https://github.com/digas99/paco-ua-api/releases/tag/v1.0.4)
Released on 23/09/2022

## Content
- Possibility to filter endpoint /tuition_fees by year
- Added Exams and Classes endpoints to swagger documentation

# [Changelog v1.0.3](https://github.com/digas99/paco-ua-api/releases/tag/v1.0.3)
Released on 07/09/2022

## Bug Fixes
- Updated Schedule Parser to fix bug in the /schedule endpoint

# [Changelog v1.0.2](https://github.com/digas99/paco-ua-api/releases/tag/v1.0.2)
Released on 04/09/2022

## Content
- Added Server Timeout (504) HTTP response to avoid crashing the app
- Added Forbidden Access (403) when the credentials provided in the GET Requests header are wrong 

# [Changelog v1.0.1](https://github.com/digas99/paco-ua-api/releases/tag/v1.0.1)
Released on 26/08/2022

## Bug Fixes
- Missing enabling CORS for preflight operations

# [Changelog v1.0.0](https://github.com/digas99/paco-ua-api/releases/tag/v1.0.0)
Released on 23/08/2022

## Content
- API endpoints are accessbile through https://pacoua-api.pt
- API covers all the main sections from PACO-UA:
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
- Interactive API documentation with Swagger is accessible through https://pacoua-api.pt/docs