# PACO UA API


API for Portal Académico Online - Universidade de Aveiro.

This API uses a headless browser to fetch data directly from [paco.ua.pt](https://paco.ua.pt), so its uptime and latency may be impacted by the website itself.

![logo](/images/paco-api-logo.png)

## API Documentation

1. [Make a HTTP Rrquest](#make-a-http-request)
1. [Best Practices](#best-practices)
    1. [Cache](#cache)
    1. [Selective Fetching](#selective-fetching)
1. [Dados Pessoais](#dados-pessoais) &nbsp;&nbsp;```POST /personal```
1. [Situação de Prescrição](#situação-de-prescrição) &nbsp;&nbsp;```POST /expiration```
1. [Histórico Notas](#histórico-notas) &nbsp;&nbsp;```POST /classes/history```
1. [Disciplinas Inscritas](#disciplinas-inscritas) &nbsp;&nbsp;```POST /classes/current```
1. [Estado das Propinas](#estado-das-propinas) &nbsp;&nbsp;```POST /tuition_fees```
1. [Plano Curricular](#plano-curricular) &nbsp;&nbsp;```POST /classes```
1. [Calendário de Exames do Aluno](#calendário-de-exames-do-aluno) &nbsp;&nbsp;```POST /exams```
1. [Calendário de Exames por Disciplina](#calendário-de-exames-por-disciplina) &nbsp;&nbsp;```POST /exams?classes=...```
1. ~~Apoio às Aulas~~
1. [Horário](#horário) &nbsp;&nbsp;```POST /schedule```
1. [Requerimentos](#requerimentos) &nbsp;&nbsp;```POST /requests``` 

---

## Make a HTTP Request

Every endpoint has to be accessed through a POST HTTP Request, with your institutional email credentials in the request body.

```POST /<endpoint>```
```json5
// POST REQUEST BODY
{
    "email": "student@ua.pt",
    "password": "your password" 
}
```

The Responses to any Request is always a JSON.

If the Request is successfull (200), then the result will have the following structure:
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

If the Request fails (400 / 500), then the result will have the following structure:
```json5
// RESPONSE example
{
    "error": "...",
    "url": "...",
    "title": "...", // OPTIONAL
    "timestamp": "..."
}
```

### Fields
| ID | Data Type | Description |
|----|-----------|-------------|
| **data** | object | Data extracted from the website | 
| **error** | string | Message briefly explaining what went wrong |
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

## Dados Pessoais

```POST /personal```
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

---

## Situação de Prescrição

```POST /expiration```
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

```POST /classes/history```
```json5
// RESPONSE example
{
    "data": {
        "classes": [
            {
                "code": "40332",
                "class": "INTRODUÇÃO AOS SISTEMAS DIGITAIS",
                "completed_date": "...",
                "grade": "..."
            },
            {
                "code": "40333",
                "class": "LABORATÓRIO DE SISTEMAS DIGITAIS",
                "completed_date": "...",
                "grade": "..."
            },
            {
                "code": "40337",
                "class": "MÉTODOS PROBABILÍSTICOS PARA ENGENHARIA INFORMÁTICA",
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

```POST /classes/current```
```json5
// RESPONSE example
{
    "data": {
        "classes": [
            {
                "code": "41951",
                "class": "ANÁLISE DE SISTEMAS",
                "year": "2",
                "semester": "2",
                "ects": "6",
                "new": true,
                "started_date": "..."
            },
            {
                "code": "41948",
                "class": "ARQUITETURA DE COMPUTADORES I",
                "year": "2",
                "semester": "1",
                "ects": "6",
                "new": true,
                "started_date": "...",
                "recurso": "..."
            },
            {
                "code": "41952",
                "class": "ARQUITETURA DE COMPUTADORES II",
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

```POST /tuition_fees```
```json5
// RESPONSE example
{
    "data": {
        "fees": {
            "2017": [
                {
                    "instalment": "1",
                    "value": "...",
                    "course-code": "...",
                    "payment": {
                        "deadline": "...",
                        "paid": "...",
                        "status": "..."
                    }
                },
                {
                    "instalment": "2",
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
                    "instalment": "1",
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

The classes represented here either have grade 0 or a value greater than 10.  
If the grade is 0, then it doesn't apply to that class or the class hasn't been completed yet.

Classes with *options* will have grade 0 (as in "it doesn't apply") and will show all options. The options the student **didn't** take will have grade 0 as well (as in "it doesn't apply").  
This classes with options are considered in the calculation of the **weighted mean**, but since they don't have a grade, the mean of the grades of their options weigh in instead.

```POST /classes```
```json5
// RESPONSE example
{
    "data": {
        "classes": [
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
                "classes": "..."
            },
            "left": {
                "ects": "...",
                "classes": "..."
            },
            "credited": {
                "ects": 0,
                "classes": 0
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

```POST /exams```
```json5
// RESPONSE example
{
    "data": {
        "exams": [
            {
                "class": {
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
                "class": {
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
                "class": {
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

This endpoint is, in a way, a specification of the endpoint **/exams**. Instead of getting the exams of the user, the code of any classes can be passed in the URL Parameter **classes**, and the exams from that class will be returned. To specify multiple classes at once, separate the code of the classes with a comma. If an invalid class code is provided, it will be ignored.
In the example below, the query is ```/exams?classes=40292,42000```.

```POST /exams?classes=...```
```json5
// RESPONSE example
{
    "data": {
        "exams": [
            {
                "class": {
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
                "class": {
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

## Horário

```POST /schedule```
```json5
// RESPONSE example
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

---

## Requerimentos

```POST /requests```
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