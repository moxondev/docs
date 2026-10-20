import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "personal",
    kind: "endpoint",
    title: { en: "Personal Information Generation", fr: "Génération d'informations personnelles" },
    lead: {
        en: "The `/personal` endpoint generates random information about a person. Name, email, location, phone number, profession and much more are generated. This endpoint does not require any options.",
        fr: "L'endpoint `/personal` génère des informations aléatoires sur une personne. Nom, email, localisation, numéro de téléphone, profession et bien plus sont générés. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-04-08",
    operations: [{ id: "default", method: "get", path: "/personal", try: false, params: [] }],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Paramètres" },
            aliases: ["parametres"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "This endpoint does not require any parameters.",
                        fr: "Cet endpoint ne nécessite aucun paramètre.",
                    },
                },
            ],
        },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [{ type: "code", text: "GET /v3/personal", role: "request" }],
        },
        {
            id: "response",
            level: 2,
            title: { en: "Response", fr: "Réponse" },
            aliases: ["reponse"],
            blocks: [
                {
                    type: "code",
                    lang: "json",
                    text: {
                        en: '{\n    "name": "Jane Martin",\n    "email": "jane@example.com",\n    "localisation": "FR",\n    "phone": "+33 06 78 90 12 34",\n    "job": "Engineer",\n    "hobbies": "Reading",\n    "language": "French",\n    "card": "3231 5443 9131 6887",\n    "cvc": 673,\n    "expiration": "09/24",\n    "address": "4 rue des pres, Paris",\n    "birthday": "1985-08-07T18:29:38.213Z",\n    "civil_status": "Single",\n    "children": 0,\n    "vehicle": ["Motorcycle", "Bus", "Bike"],\n    "social_profiles": {\n        "twitter": "@jane_martin",\n        "facebook": "facebook.com/jane_martin",\n        "linkedin": "linkedin.com/in/jane_martin",\n        "instagram": "instagram.com/jane_martin"\n    },\n    "year_income": "88014 USD/year",\n    "month_income": "7334.50 USD/month",\n    "education": "Bachelor\'s",\n    "work_experience": "5 years",\n    "health_status": "Healthy",\n    "emergency_contacts": [\n        {\n            "name": "John Doe",\n            "relationship": "Sibling",\n            "phone": "+33 06 78 90 12 34"\n        }\n    ],\n    "subscriptions": ["Netflix", "Spotify"],\n    "pets": ["Fish", "Dog"]\n}',
                        fr: '{\n    "name": "Jane Martin",\n    "email": "jane@example.com",\n    "localisation": "FR",\n    "phone": "+33 06 78 90 12 34",\n    "job": "Engineer",\n    "hobbies": "Reading",\n    "language": "French",\n    "card": "3231 5443 9131 6887",\n    "cvc": 673,\n    "expiration": "09/24",\n    "address": "4 rue des prés, Paris",\n    "birthday": "1985-08-07T18:29:38.213Z",\n    "civil_status": "Single",\n    "children": 0,\n    "vehicle": ["Motorcycle", "Bus", "Bike"],\n    "social_profiles": {\n        "twitter": "@jane_martin",\n        "facebook": "facebook.com/jane_martin",\n        "linkedin": "linkedin.com/in/jane_martin",\n        "instagram": "instagram.com/jane_martin"\n    },\n    "year_income": "88014 USD/year",\n    "month_income": "7334.50 USD/month",\n    "education": "Bachelor\'s",\n    "work_experience": "5 years",\n    "health_status": "Healthy",\n    "emergency_contacts": [\n        {\n            "name": "John Doe",\n            "relationship": "Sibling",\n            "phone": "+33 06 78 90 12 34"\n        }\n    ],\n    "subscriptions": ["Netflix", "Spotify"],\n    "pets": ["Fish", "Dog"]\n}',
                    },
                    role: "response",
                },
            ],
        },
        {
            id: "response-fields",
            level: 2,
            title: { en: "Response Fields", fr: "Champs de réponse" },
            aliases: ["champs-de-reponse"],
            blocks: [
                {
                    type: "table",
                    head: { en: ["Field", "Description"], fr: ["Champ", "Description"] },
                    rows: [
                        ["`name`", { en: "Full name", fr: "Nom complet" }],
                        ["`email`", { en: "Email address", fr: "Adresse email" }],
                        ["`localisation`", { en: "Country code", fr: "Code pays" }],
                        ["`phone`", { en: "Phone number", fr: "Numéro de téléphone" }],
                        ["`job`", "Profession"],
                        ["`hobbies`", { en: "Hobbies/interests", fr: "Loisirs/intérêts" }],
                        ["`language`", { en: "Spoken language", fr: "Langue parlée" }],
                        ["`card`", { en: "Credit card number", fr: "Numéro de carte de crédit" }],
                        ["`cvc`", { en: "Card security code", fr: "Code de sécurité de la carte" }],
                        [
                            "`expiration`",
                            { en: "Card expiration date", fr: "Date d'expiration de la carte" },
                        ],
                        ["`address`", { en: "Street address", fr: "Adresse postale" }],
                        ["`birthday`", { en: "Date of birth", fr: "Date de naissance" }],
                        ["`civil_status`", { en: "Marital status", fr: "Situation matrimoniale" }],
                        ["`children`", { en: "Number of children", fr: "Nombre d'enfants" }],
                        [
                            "`vehicle`",
                            { en: "Array of vehicles owned", fr: "Tableau des véhicules possédés" },
                        ],
                        [
                            "`social_profiles`",
                            {
                                en: "Social media profiles object",
                                fr: "Objet des profils de réseaux sociaux",
                            },
                        ],
                        ["`year_income`", { en: "Annual income", fr: "Revenu annuel" }],
                        ["`month_income`", { en: "Monthly income", fr: "Revenu mensuel" }],
                        ["`education`", { en: "Education level", fr: "Niveau d'éducation" }],
                        [
                            "`work_experience`",
                            {
                                en: "Years of work experience",
                                fr: "Années d'expérience professionnelle",
                            },
                        ],
                        ["`health_status`", { en: "Health status", fr: "État de santé" }],
                        [
                            "`emergency_contacts`",
                            {
                                en: "Array of emergency contacts",
                                fr: "Tableau des contacts d'urgence",
                            },
                        ],
                        [
                            "`subscriptions`",
                            { en: "Array of subscriptions", fr: "Tableau des abonnements" },
                        ],
                        ["`pets`", { en: "Array of pets", fr: "Tableau des animaux de compagnie" }],
                    ],
                    kind: "definition",
                },
            ],
        },
        {
            id: "curl",
            level: 2,
            title: { en: "cURL", fr: "cURL" },
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X GET "https://api.moxon.dev/v3/personal"',
                    role: "curl",
                },
                {
                    type: "callout",
                    kind: "warning",
                    title: "Note",
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "All generated data is fictional and randomly created. Credit card numbers are not valid for transactions.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Toutes les données générées sont fictives et créées de manière aléatoire. Les numéros de carte de crédit ne sont pas valides pour les transactions.",
                            },
                        ],
                    },
                },
            ],
        },
    ],
};
