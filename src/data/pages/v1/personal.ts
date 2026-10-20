import type { Page } from "@/types/content";

export const page: Page = {
    version: "v1",
    id: "personal",
    kind: "endpoint",
    title: { en: "Personal Information Generation", fr: "Génération d'informations personnelles" },
    lead: {
        en: "The `/personal` endpoint generates random information about a person. Name, email, location, phone number, profession and much more are generated. This endpoint does not require any options.",
        fr: "L'endpoint `/personal` génère des informations aléatoires à propos d'une personne. Un nom, un email, une localisation, un numéro de téléphone, un métier, et bien d'autres informations sont générées. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-04-08",
    operations: [{ id: "default", method: "get", path: "/personal", try: false, params: [] }],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [{ type: "code", text: "GET /v1/personal", role: "request" }],
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
            id: "curl",
            level: 2,
            title: { en: "cURL", fr: "cURL" },
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X GET "https://api.moxon.dev/v1/personal"',
                    role: "curl",
                },
            ],
        },
    ],
};
