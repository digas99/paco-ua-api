# PACO UA API

API for Portal Académico Online - Universidade de Aveiro.

This API uses a headless browser to fetch data directly from [paco.ua.pt](https://paco.ua.pt), so its uptime and latency may be impacted by the website itself.

![logo](/public/paco-api-logo.png)

***Try and explore it with Swagger in [https://pacoua-api.pt/docs](https://pacoua-api.pt/docs)***  
(explore the endpoints and make HTTP Requests)

## API Documentation

1. [Make a HTTP Rrquest](#make-a-http-request)
1. [Best Practices](#best-practices)
    1. [Cache](#cache)
    1. [Selective Fetching](#selective-fetching)
1. [Response Times](#response-times)
1. [Dados Pessoais](#dados-pessoais) &nbsp;&nbsp;```GET /personal```
    1. [Specify Section](#specify-section)
1. [Situação de Prescrição](#situação-de-prescrição) &nbsp;&nbsp;```GET /expiration```
1. [Histórico Notas](#histórico-notas) &nbsp;&nbsp;```GET /subjects/history```
1. [Disciplinas Inscritas](#disciplinas-inscritas) &nbsp;&nbsp;```GET /subjects/current```
1. [Estado das Propinas](#estado-das-propinas) &nbsp;&nbsp;```GET /tuition_fees```
1. [Plano Curricular](#plano-curricular) &nbsp;&nbsp;```GET /subjects```
1. [Calendário de Exames do Aluno](#calendário-de-exames-do-aluno) &nbsp;&nbsp;```GET /exams```
1. [Calendário de Exames por Disciplina](#calendário-de-exames-por-disciplina) &nbsp;&nbsp;```GET /exams?subjects=...```
1. [Apoio às Aulas](#apoio-às-aulas) &nbsp;&nbsp;```GET /classes```
    1. [Classes by Subject](#classes-by-subject)
    1. [Include Teachers](#include-teachers)
    1. [Subject Program](#subject-program)
1. [Horário](#horário) &nbsp;&nbsp;```GET /schedule```
    1. [Subject Schedule](#subject-schedule)
1. [Requerimentos](#requerimentos) &nbsp;&nbsp;```GET /requests``` 

---

## Make a HTTP Request

Every endpoint is accessed through a GET HTTP Request, with your institutional email credentials in the **Basic Authorization** Header (encrypted in base64). [More Information](https://en.wikipedia.org/wiki/Basic_access_authentication#:~:text=password%20(see%20below).-,Client%20side,-%5Bedit%5D)

```shell
GET /schedule
  -H 'accept: application/json'
  -H 'Authorization: Basic {base64_encrypted_credentials}'
```

The Responses to any Request is always a JSON.

The result will have the following structure:

- If the Request is successfull (200): 
```json5
// RESPONSE example
{
    "data": {...},
    "size": ..., // OPTIONAL
    "url": "...",
    "title": "...",
    "timestamp": "..."
}
```

- If the Request fails (400 / 500):
```json5
// RESPONSE example
{
    "message": "...",
    "url": "...",
    "title": "...", // OPTIONAL
    "timestamp": "..."
}
```

- If the credentials are missing (401):
```json5
// RESPONSE example
{
    "message": "...",
    "timestamp": "..."
}
```

### Fields
| ID | Data Type | Description |
|----|-----------|-------------|
| **data** | object | Data extracted from the website | 
| **message** | string | Message briefly explaining what went wrong |
| **size** | number | Size of data structure of interest from within data | 
| **url** | string | URL of the web page from which the data was extracted |
| **title** | string | Section of PACO-UA from where the data was extracted |
| **timestamp** | ISO-8061 | Timestamp of the time of the Response |

---

## Best Practices

The Requests to the API have an inherent unavoidable delay, from both the PACO website and the headless browser from Puppeteer. This causes an average delay response of 3.5s for most of the endpoints.

### Cache

When building your app, the best way to compensate for the delay is to initially fetch all the data and save it in some sort of local storage, **cache** it.  
Then, the next time the user enters the app, you can show the cached outdated data immediately while fetching the updated data in the background.

### Selective Fetching

Fetching everything at once might not always be the best approach. When everything is already cached, might be better to make use of the various endpoints to only fetch certain data that the user might need updated for that specific section of your app.

---

## Response Times

Because the web scraping is done with a headless browser, some data might be fetched by navigating through **several** web pages, which increases the response time significantly.  
With this in mind, the endpoints throughout this document will have an estimate time, in seconds, for its response, accompanied by a color key (this values are a very rough estimate, and are better seen as comparative terms).

🟢 &nbsp; Normal response (> 3s)  
🟡 &nbsp; Slow response (> 5s)  
🟠 &nbsp; Turtle response (> 8s)  
🔴 &nbsp; Sloth response (> 12s)  

---

## Dados Pessoais

RESPONSE: 3.5s 🟢

```GET /personal```
```json5
// RESPONSE example
{
    "data": {
        "personal_data": {
            "nmec": "...",
            "name": "...",
            "picture": "...",
            "father": "...",
            "mother": "...",
            "cc": "...",
            "birth": "...",
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
    "timestamp": "2022-08-16T01:19:28.099Z"
}

// sensitive information hidden with "..."
```

### Specify Section

RESPONSE: 3.5s 🟢

```GET /personal/<section>```
```json5
// GET /personal/contact_data

// RESPONSE example
{
    "data": {
        "contact_data": {
            "telephone": "...",
            "mobile": "...",
            "email": "..."
        }
    },
    "url": "https://paco.ua.pt/secvirtual/c_dadospess.asp",
    "title": "Dados Pessoais",
    "timestamp": "2022-08-16T01:19:28.099Z"
}

// sensitive information hidden with "..."
```

---

## Situação de Prescrição

RESPONSE: 3.5s 🟢

```GET /expiration```
```json5
// RESPONSE example
{
    "data": {
        "expiration": [
            {
                "school_year": "2021/2022",
                "ects": {
                    "cumulative": ...,
                    "done": ...,
                    "missing": 0,
                    "total": 60
                },
                "enrollment_cumulative": 3,
                "coefficient": 1,
                "type": "Freq. Normal",
                "state": "Não Prescrito"
            },
            {
                "school_year": "2020/2021",
                "ects": {
                    "cumulative": ...,
                    "done": ...,
                    "missing": 0,
                    "total": 58
                },
                "enrollment_cumulative": 2,
                "coefficient": 0,
                "type": "Situação Especial",
                "state": "Não Prescrito"
            },
            ...
        ],
        "info": [
            "Regulamento de prescrições da UA ...",
            "Aplicação do conceito de prescrição – alunos...",
            ...
        ]
    },
    "size": 5,
    "url": "https://paco.ua.pt/secvirtual/c_situacaoprescricao.asp",
    "title": "Situação de prescrição",
    "timestamp": "2022-08-16T23:26:01.623Z"
}

// sensitive information hidden with "..."
```

---

## Histórico Notas

RESPONSE: 3.5s 🟢

```GET /subjects/history```
```json5
// RESPONSE example
{
    "data": {
        "subjects": [
            {
                "code": "40332",
                "name": "INTRODUÇÃO AOS SISTEMAS DIGITAIS",
                "completed_date": "...",
                "grade": "..."
            },
            {
                "code": "40333",
                "name": "LABORATÓRIO DE SISTEMAS DIGITAIS",
                "completed_date": "...",
                "grade": "..."
            },
            {
                "code": "40337",
                "name": "MÉTODOS PROBABILÍSTICOS PARA ENGENHARIA INFORMÁTICA",
                "completed_date": "...",
                "grade": "..."
            },
            ...
        ]
    },
    "size": ...,
    "url": "https://paco.ua.pt/secvirtual/c_historiconotas.asp",
    "title": "Histórico Notas",
    "timestamp": "2022-08-16T01:23:42.552Z"
}

// sensitive information hidden with "..."
```

---


## Disciplinas Inscritas

RESPONSE: 3.5s 🟢

```GET /subjects/current```
```json5
// RESPONSE example
{
    "data": {
        "subjects": [
            {
                "code": "41951",
                "name": "ANÁLISE DE SISTEMAS",
                "year": "2",
                "semester": "2",
                "ects": "6",
                "new": true,
                "started_date": "..."
            },
            {
                "code": "41948",
                "name": "ARQUITETURA DE COMPUTADORES I",
                "year": "2",
                "semester": "1",
                "ects": "6",
                "new": true,
                "started_date": "...",
                "recurso": "..."
            },
            {
                "code": "41952",
                "name": "ARQUITETURA DE COMPUTADORES II",
                "year": "2",
                "semester": "2",
                "ects": "6",
                "new": true,
                "started_date": "..."
            },
            ...
        ]
    },
    "size": ...,
    "url": "https://paco.ua.pt/secvirtual/c_examesInscr.asp",
    "title": "Disciplinas Inscritas",
    "timestamp": "2022-08-16T01:43:47.969Z"
}

// sensitive information hidden with "..."
```

---

## Estado das Propinas

RESPONSE: 3.5s 🟢

```GET /tuition_fees```
```json5
// RESPONSE example
{
    "data": {
        "fees": {
            "2017": [
                {
                    "instalment": 1,
                    "value": "...",
                    "course-code": "...",
                    "payment": {
                        "deadline": "...",
                        "paid": "...",
                        "status": "..."
                    }
                },
                {
                    "instalment": 2,
                    "value": "...",
                    "course-code": "...",
                    "payment": {
                        "deadline": "...",
                        "paid": "...",
                        "status": "..."
                    }
                },
                ...
            ],
            "2018": [
                {
                    "instalment": 1,
                    "value": "...",
                    "course-code": "...",
                    "payment": {
                        "deadline": "...",
                        "paid": "...",
                        "status": "..."
                    }
                },
                ...
            ],
            ...
        },
        "last_updated": "..."
    },
    "url": "https://paco.ua.pt/secvirtual/c_estadoDasProprinas.asp",
    "title": "Estados das Propinas",
    "timestamp": "2022-08-16T01:47:30.522Z"
}

// sensitive information hidden with "..."
```

---

## Plano Curricular

RESPONSE: 3.5s 🟢

The subjects represented here either have grade 0 or a value greater than 10.  
If the grade is 0, then it doesn't apply to that subject or the subject hasn't been completed yet.

Subjects with *options* will have grade 0 (as in "it doesn't apply") and will show all options. The options the student **didn't** take will have grade 0 as well (as in "it doesn't apply").  
This subjects with options are considered in the calculation of the **weighted mean**, but since they don't have a grade, the mean of the grades of their options weigh in instead.

```GET /subjects```
```json5
// RESPONSE example
{
    "data": {
        "subjects": [
            {
                "code": "40338",
                "name": "LABORATÓRIOS DE INFORMÁTICA",
                "year": "1",
                "semester": "0",
                "credits": 5,
                "ects": 8,
                "grade": "..."
            },
            {
                "code": "40332",
                "name": "INTRODUÇÃO AOS SISTEMAS DIGITAIS",
                "year": "1",
                "semester": "1",
                "credits": 3,
                "ects": 6,
                "grade": "..."
            },
            ...
            {
                "code": "41994",
                "name": "COMPETÊNCIAS TRANSFERÍVEIS II",
                "year": "2",
                "semester": "2",
                "credits": 3,
                "ects": 6,
                "grade": 0,
                "options": [
                    {
                        "code": "42294",
                        "name": "MICROCONTROLOLADORES E INTERAÇÃO COM SENSORES E ATUADORES",
                        "year": "2",
                        "semester": "2",
                        "credits": 0,
                        "ects": 0,
                        "grade": 0
                    },
                    {
                        "code": "42296",
                        "name": "VISUALIZAÇÃO DE DADOS",
                        "year": "2",
                        "semester": "2",
                        "credits": 0,
                        "ects": 0,
                        "grade": "..."
                    },
                    ...
                ]
            },
            ...
        ],
        "overview": {
            "done": {
                "ects": "...",
                "subjects": "..."
            },
            "left": {
                "ects": "...",
                "subjects": "..."
            },
            "credited": {
                "ects": 0,
                "subjects": 0
            },
            "lowest_grade": "...",
            "highest_grade": "...",
            "weigted_mean": "...",
            "standard_deviation": "..."
        },
        "last_updated": "17-08-2022"
    },
    "size": 41,
    "url": "https://paco.ua.pt/secvirtual/c_planocurr.asp",
    "title": "Plano Curricular",
    "timestamp": "2022-08-17T14:16:24.983Z"
}

// sensitive information hidden with "..."
```

---

## Calendário de Exames do Aluno

RESPONSE: 3.5s 🟢

```GET /exams```
```json5
// RESPONSE example
{
    "data": {
        "exams": [
            {
                "subject": {
                    "code": "41948",
                    "name": "ARQUITETURA DE COMPUTADORES I"
                },
                "date": "02/09/2022",
                "time": "9:00",
                "room": "",
                "type": "NM",
                "season": "Especial",
                "notes": "",
                "changes": ""
            },
            {
                "subject": {
                    "code": "41950",
                    "name": "REDES DE COMUNICAÇÕES I"
                },
                "date": "05/09/2022",
                "time": "10:00",
                "room": "",
                "type": "NM",
                "season": "Especial",
                "notes": "",
                "changes": ""
            },
            {
                "subject": {
                    "code": "42299",
                    "name": "INTERAÇÃO HUMANO-COMPUTADOR"
                },
                "date": "06/09/2022",
                "time": "16:00",
                "room": "",
                "type": "NM",
                "season": "Especial",
                "notes": "MÓDULO DE 41994 COMPETÊNCIAS TRANSFERÍVEIS II",
                "changes": ""
            },
            ...
        ],
        "last_updated": "29-07-2022"
    },
    "size": 10,
    "url": "https://paco.ua.pt/secvirtual/c_calendarioDeExames.asp",
    "title": "Calendário de Exames do Aluno",
    "timestamp": "2022-08-16T12:58:34.994Z"
}
```

---

## Calendário de Exames por Disciplina

RESPONSE: 4.5s 🟢

This endpoint is, in a way, a specification of the endpoint **/exams**. Instead of getting the exams of the user, the code of any subjects can be passed in the URL Parameter **subjects**, and the exams from that subject will be returned. To specify multiple subjects at once, separate the code of the subjects with a comma. If an invalid subject code is provided, it will be ignored.

```GET /exams?subjects=...```
```json5
// GET /exams?subjects=40292,42000

// RESPONSE example
{
    "data": {
        "exams": [
            {
                "subject": {
                    "code": "40292",
                    "name": "ALEMÃO II - PRÁTICAS AVANÇADAS DE TRADUÇÃO"
                },
                "date": "08/07/2022",
                "time": "10:00",
                "room": "2.1.15",
                "type": "NM",
                "season": "Final",
                "department": "DLC",
                "notes": "C/ ALEMÃO – PRÁTICAS AVANÇADAS DE TRADUÇÃO",
                "changes": ""
            },
            {
                "subject": {
                    "code": "42000",
                    "name": "DISPOSITIVOS BIOMECÂNICOS"
                },
                "date": "13/09/2022",
                "time": "14:00",
                "room": "",
                "type": "NM",
                "season": "Especial",
                "department": "MEC",
                "notes": "",
                "changes": ""
            }
        ],
        "last_updated": "18-07-2022"
    },
    "size": 2,
    "url": "https://paco.ua.pt/secvirtual/c_calendarioDeExamesPorDisciplina.asp",
    "title": "Calendário de Exames por Disciplina",
    "timestamp": "2022-08-16T18:19:47.998Z"
}
```

---

## Apoio às Aulas

RESPONSE: 3.5s 🟢

```GET /classes```
```json5
// RESPONSE example
{
    "data": {
        "subjects": [
            {
                "code": "41951",
                "name": "ANÁLISE DE SISTEMAS",
                "urls": {
                    "elearning": "https://paco.ua.pt/secvirtual/aulas/moodle.asp?idnumber=41951-AS",
                    "schedule": "https://paco.ua.pt/secvirtual/horarios/desenho_horario.asp?tipo=1&value=-209420212"
                },
                "classes": [
                    {
                        "name": "P1",
                        "type": "Prática",
                        "summaries": 10
                    },
                    {
                        "name": "TP1",
                        "type": "Teórico-Prática",
                        "summaries": 0
                    }
                ]
            },
            {
                "code": "41952",
                "name": "ARQUITETURA DE COMPUTADORES II",
                "urls": {
                    "elearning": "https://paco.ua.pt/secvirtual/aulas/moodle.asp?idnumber=41952-AC-II",
                    "schedule": "https://paco.ua.pt/secvirtual/horarios/desenho_horario.asp?tipo=1&value=-209520212"
                },
                "classes": [
                    {
                        "name": "P1",
                        "type": "Prática",
                        "summaries": 13
                    },
                    {
                        "name": "TP2",
                        "type": "Teórico-Prática",
                        "summaries": 26
                    }
                ]
            },
            ...
        ]
    },
    "size": 8,
    "url": "https://paco.ua.pt/secvirtual/aulas/lista_turmas_aluno.asp",
    "title": "Apoio às Aulas",
    "timestamp": "2022-08-18T00:07:09.458Z"
}
```

### Classes by Subject

RESPONSE: 3.5s 🟢  

```GET /classes/<subject_code>```

```json5
// GET /classes/42296

// RESPONSE example
{
    "data": {
        "subjects": [
            {
                "code": "42296",
                "name": "VISUALIZAÇÃO DE DADOS",
                "urls": {
                    "elearning": "https://paco.ua.pt/secvirtual/aulas/moodle.asp?idnumber=42296-VD",
                    "schedule": "https://paco.ua.pt/secvirtual/horarios/desenho_horario.asp?tipo=1&value=-208620212"
                },
                "classes": [
                    {
                        "name": "TP9-3",
                        "type": "Teórico-Prática",
                        "summaries": 9
                    }
                ]
            }
        ]
    },
    "size": 1,
    "url": "https://paco.ua.pt/secvirtual/aulas/lista_turmas_aluno.asp",
    "title": "Apoio às Aulas",
    "timestamp": "2022-08-18T01:53:03.351Z"
}
```


### Include Teachers

RESPONSE: * 🔴  

\* Highly dependent on the number of classes the student has:
- 1 class: 5s,  
- 4 classes: 7s,  
- 12 classes: 15s,
- ...

```GET /classes?include=teachers```

RESPONSE: 4.5s 🟢  

```GET /classes/<subject_code>?include=teachers```

```json5

// RESPONSE example
{
    "data": {
        "subjects": [
            {
                "code": "41951",
                "name": "ANÁLISE DE SISTEMAS",
                "urls": {
                    "elearning": "https://paco.ua.pt/secvirtual/aulas/moodle.asp?idnumber=41951-AS",
                    "schedule": "https://paco.ua.pt/secvirtual/horarios/desenho_horario.asp?tipo=1&value=-209420212"
                },
                "classes": [
                    {
                        "name": "P1",
                        "type": "Prática",
                        "summaries": 10,
                        "teacher": [
                            {
                                "name": "ILÍDIO FERNANDO DE CASTRO OLIVEIRA",
                                "department": "DET"
                            }
                        ]
                    },
                    {
                        "name": "TP1",
                        "type": "Teórico-Prática",
                        "summaries": 0,
                        "teacher": [
                            {
                                "name": "ILÍDIO FERNANDO DE CASTRO OLIVEIRA",
                                "department": "DET"
                            }
                        ]
                    }
                ]
            },
            {
                "code": "41952",
                "name": "ARQUITETURA DE COMPUTADORES II",
                "urls": {
                    "elearning": "https://paco.ua.pt/secvirtual/aulas/moodle.asp?idnumber=41952-AC-II",
                    "schedule": "https://paco.ua.pt/secvirtual/horarios/desenho_horario.asp?tipo=1&value=-209520212"
                },
                "classes": [
                    {
                        "name": "P1",
                        "type": "Prática",
                        "summaries": 13,
                        "teacher": [
                            {
                                "name": "ANTÓNIO JOSÉ NUNES NAVARRO RODRIGUES",
                                "department": "DET"
                            }
                        ]
                    },
                    {
                        "name": "TP2",
                        "type": "Teórico-Prática",
                        "summaries": 26,
                        "teacher": [
                            {
                                "name": "TOMÁS ANTÓNIO MENDES OLIVEIRA E SILVA",
                                "department": "DET"
                            }
                        ]
                    }
                ]
            },
            ...
        ]
    },
    "size": 8,
    "url": "https://paco.ua.pt/secvirtual/aulas/lista_turmas_aluno.asp",
    "title": "Apoio às Aulas",
    "timestamp": "2022-08-18T00:14:41.418Z"
}
```

### Subject Program

RESPONSE: 4.5s 🟢

```GET /classes/<subject_code>/program```

```GET /classes/<subject_code>/program/<section>```

```json5
// /classes/41949/program

// RESPONSE example
{
    "data": {
        "learning_objectives": {
            "title": "Objetivos de aprendizagem",
            "text": {
                "plain": "Pretende-se que no fim da cadeira, os alu...",
                "html": "\n\t\t<td class=\"table_line_value\" colspan=\"4\" align=\...",
                "lines": [
                    "Pretende-se que no fim da cadeira, os alunos:",
                    "Tenham uma compreensão dos fundamentos subjacentes a redes de comunicação.",
                    ...
                ]
            }
        },
        "program": {
            "title": "Conteúdos programáticos",
            "text": {
                "plain": "* Redes Locais (LAN)\n   - LAN...",
                "html": "\n\t\t<td class=\"table_line_value\" colspan=\"4\" align...",
                "lines": [
                    "* Redes Locais (LAN)",
                    "   - LAN Virtual: finalidade, implementação, modelos...",
                    ...
                ]
            }
        },
        ...
    },
    "url": null,
    "title": "Apoio às Aulas",
    "timestamp": "2022-08-18T20:28:37.053Z"
}
```

---

## Horário

RESPONSE: 5s 🟡

```GET /schedule```
```json5
// RESPONSE example
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

## Subject Schedule

RESPONSE: 4.5s 🟢

```GET /schedule/subject/<subject_code>```
```json5
// GET /schedule/subject/41949

// RESPONSE example
{
    "data": {
        "schedule": {
            "Segunda": [
                {
                    "subject": {
                        "name": "REDES DE COMUNICAÇÕES II",
                        "abbrev": "T1"
                    },
                    "start": "12h",
                    "duration": "1,5h",
                    "capacity": "101",
                    "room": "ANF. IV"
                },
                {
                    "subject": {
                        "name": "REDES DE COMUNICAÇÕES II",
                        "abbrev": "P1"
                    },
                    "start": "14,5h",
                    "duration": "2h",
                    "capacity": "18",
                    "room": "04.2.16"
                },
                ...
            ],
            "Terça": [],
            "Quarta": [
                {
                    "subject": {
                        "name": "REDES DE COMUNICAÇÕES II",
                        "abbrev": "P5"
                    },
                    "start": "14h",
                    "duration": "2h",
                    "capacity": "19",
                    "room": "04.3.30"
                }
            ],
            ...
        },
        "school_year": "2021/2022",
        "semester": "2"
    },
    "url": "https://paco.ua.pt/secvirtual/horarios/desenho_horario.asp?tipo=1&value=-210320212",
    "title": "Horário de REDES DE COMUNICAÇÕES II",
    "timestamp": "2022-08-18T16:40:10.748Z"
}
```

---

## Requerimentos

RESPONSE: 3.8s 🟢

```GET /requests```
```json5
// RESPONSE example
{
    "data": {
        "requests": [
            {
                "date": "2021-10-04 10:48:10",
                "state": "Despachado"
            }
        ]
    },
    "size": 1,
    "url": "https://paco.ua.pt/secvirtual/pedidos_requerimentos_consultas_new.asp",
    "title": "Requerimentos",
    "timestamp": "2022-08-16T22:35:55.883Z"
}
```