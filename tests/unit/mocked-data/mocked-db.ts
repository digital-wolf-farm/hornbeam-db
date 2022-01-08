import { DBData } from '../../../src/models/interfaces';

export const mockedDB: DBData = {
    "authors": [
        {
            "_id": 1,
            "name": "William",
            "surname": "Shakespeare",
            "country": "gb"
        },
        {
            "_id": 2,
            "name": "Homer",
            "surname": "",
            "country": "gr"
        },
        {
            "_id": 3,
            "name": "Henryk",
            "surname": "Sienkiewicz",
            "country": "pl"
        },
        {
            "_id": 4,
            "name": "Dariusz",
            "surname": "Kortko",
            "country": "pl"
        },
        {
            "_id": 5,
            "name": "Marcin",
            "surname": "Pietraszewski",
            "country": "pl"
        },
        {
            "name": "Stephen",
            "surname": "King",
            "country": "us",
            "_id": 6
        },
        {
            "name": "Adam",
            "surname": "Mickiewicz",
            "country": "pl",
            "_id": 7
        },
        {
            "name": "Fyodor",
            "surname": "Dostoevsky",
            "country": "ru",
            "_id": 8
        },
        {
            "name": "Charles",
            "surname": "Dickens",
            "country": "gb",
            "_id": 9
        },
        {
            "name": "J. R. R.",
            "surname": "Tolkien",
            "country": "gb",
            "_id": 10
        },
        {
            "name": "Mark",
            "surname": "Twain",
            "country": "gb",
            "_id": 11
        },
        {
            "name": "Bolesław",
            "surname": "Prus",
            "country": "pl",
            "_id": 12
        }
    ],
    "books": [
        {
            "id": 1,
            "titleTranslated": "Iliada",
            "title": "Ἰλιάς Iliás",
            "authors": [
                2
            ],
            "genres": [
                "epicPoetry"
            ]
        },
        {
            "id": 2,
            "titleTranslated": "",
            "title": "W pustyni i w puszczy",
            "authors": [
                3
            ],
            "genres": [
                "novel"
            ]
        },
        {
            "id": 3,
            "titleTranslated": "Romeo i Julia",
            "title": "Romeo and Juliet",
            "authors": [
                1
            ],
            "genres": [
                "drama"
            ]
        },
        {
            "id": 4,
            "titleTranslated": "",
            "title": "Kukuczka. Opowieść o najsłynniejszym polskim himalaiście",
            "authors": [
                4,
                5
            ],
            "genres": [
                "bio"
            ]
        }
    ],
    "publishers": [
        {
            "name": "PWN",
            "founded": 1951,
            "address": {
                "country": "Poland",
                "city": "Warszawa"
            },
            "active": true
        }, {
            "name": "Świat Książki",
            "founded": 1994,
            "address": {
                "country": "Poland",
                "city": "Warszawa"
            },
            "active": true
        }, {
            "name": "Znak",
            "founded": 1959,
            "address": {
                "country": "Poland",
                "city": "Kraków"
            },
            "active": true
        }, {
            "name": "Helion",
            "founded": 1991,
            "address": {
                "country": "Poland",
                "city": "Gliwice"
            },
            "active": true
        }, {
            "name": "Cambridge University Press",
            "founded": 1534,
            "address": {
                "country": "England",
                "city": "Cambridge"
            },
            "active": true
        }, {
            "name": "Harvard University Press",
            "founded": 1913,
            "address": {
                "country": "United States",
                "city": "Cambridge"
            },
            "active": true
        }, {
            "name": "Macmillan Inc.",
            "founded": 1869,
            "address": {
                "country": "United States",
                "city": "New York"
            },
            "active": false
        }
    ],
    "team" : [
        {
            "_id": 1,
            "nickname": "Zebra",
            "age": 40,
            "supervisor": null,
            "project": "Alpha",
            "isManager": true,
            "hobbies": ["biking"],
            "pets": 10
        }, {
            "_id": 2,
            "nickname": "Alex",
            "age": 29,
            "supervisor": "Zebra",
            "project": "Theta",
            "isManager": false,
            "hobbies": ["reading", "movies"],
            "pets": null
        }, {
            "_id": 3,
            "nickname": "Italiano",
            "age": 64,
            "supervisor": null,
            "project": undefined,
            "isManager": true,
            "hobbies": ["fishing"],
            "pets": undefined
        }, {
            "_id": 4,
            "nickname": "Headshot",
            "age": 22,
            "supervisor": "Italiano",
            "project": "Theta",
            "isManager": false,
            "hobbies": ["clubbing", "dancing"],
            "pets": 2
        }, {
            "_id": 5,
            "nickname": "Egg",
            "age": 40,
            "supervisor": "Italiano",
            "project": "Theta",
            "isManager": false,
            "hobbies": ["cooking", "movies"],
            "pets": 0
        }
    ],
    "contractors": [
        {
            "_id": 1,
            "name": "Building Inc.",
            "address": {
                "city": "London",
                "street": "Oxford Street"
            }
        }, {
            "_id": 2,
            "name": "Gut Auto GMBH",
            "address": {
                "city": "Berlin",
                "street": "Kurfürstendamm"
            }
        }
    ]
};
