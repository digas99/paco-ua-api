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