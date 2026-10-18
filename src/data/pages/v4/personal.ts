import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "personal",
    kind: "endpoint",
    title: { en: "Personal Information Generation", fr: "Génération d'informations personnelles" },
    lead: {
        en: "The `/personal` endpoint generates random information about a person. Name, email, location, phone number, profession and much more are generated. This endpoint does not require any options.",
        fr: "L'endpoint `/personal` génère des informations aléatoires sur une personne. Nom, email, localisation, numéro de téléphone, profession et bien plus sont générés. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-05-12",
    operations: [{ id: "default", method: "get", path: "/personal", try: true, params: [] }],
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
                        en: "This endpoint does not require any parameters. It returns a randomly generated identity with name, email, address, phone number, profession and more.",
                        fr: "Cet endpoint ne nécessite aucun paramètre. Il retourne une identité fictive générée aléatoirement avec nom, email, adresse, téléphone, profession et plus.",
                    },
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
                    type: "fields",
                    rows: [
                        {
                            name: "name",
                            type: "`string`",
                            description: { en: "Full name", fr: "Nom complet" },
                        },
                        {
                            name: "email",
                            type: "`string`",
                            description: { en: "Email address", fr: "Adresse email" },
                        },
                        {
                            name: "localisation",
                            type: "`string`",
                            description: { en: "Country code", fr: "Code pays" },
                        },
                        {
                            name: "phone",
                            type: "`string`",
                            description: { en: "Phone number", fr: "Numéro de téléphone" },
                        },
                        { name: "job", type: "`string`", description: "Profession" },
                        {
                            name: "hobbies",
                            type: "`string`",
                            description: { en: "Hobbies/interests", fr: "Loisirs/intérêts" },
                        },
                        {
                            name: "language",
                            type: "`string`",
                            description: { en: "Spoken language", fr: "Langue parlée" },
                        },
                        {
                            name: "card",
                            type: "`string`",
                            description: {
                                en: "Luhn-valid credit card number (see [Credit](ref:credit))",
                                fr: "Numéro de carte Luhn-valide (voir [Credit](ref:credit))",
                            },
                        },
                        {
                            name: "cvc",
                            type: "`string`",
                            description: {
                                en: "Card security code",
                                fr: "Code de sécurité de la carte",
                            },
                        },
                        {
                            name: "expiration",
                            type: "`string`",
                            description: {
                                en: "Card expiration date",
                                fr: "Date d'expiration de la carte",
                            },
                        },
                        {
                            name: "address",
                            type: "`object`",
                            description: {
                                en: "Full address object (see [Address](ref:address#response-fields))",
                                fr: "Objet adresse complet (voir [Address](ref:address#response-fields))",
                            },
                        },
                        {
                            name: "birthday",
                            type: "`string`",
                            description: { en: "Date of birth", fr: "Date de naissance" },
                        },
                        {
                            name: "civil_status",
                            type: "`string`",
                            description: { en: "Marital status", fr: "Situation matrimoniale" },
                        },
                        {
                            name: "children",
                            type: "`number`",
                            description: { en: "Number of children", fr: "Nombre d'enfants" },
                        },
                        {
                            name: "vehicle",
                            type: "`string[]`",
                            description: {
                                en: "Array of vehicles owned",
                                fr: "Tableau des véhicules possédés",
                            },
                        },
                        {
                            name: "social_profiles",
                            type: "`object`",
                            description: {
                                en: "Social media profiles (`twitter`, `facebook`, `linkedin`, `instagram`)",
                                fr: "Objet des profils de réseaux sociaux",
                            },
                        },
                        {
                            name: "year_income",
                            type: "`string`",
                            description: { en: "Annual income", fr: "Revenu annuel" },
                        },
                        {
                            name: "month_income",
                            type: "`string`",
                            description: { en: "Monthly income", fr: "Revenu mensuel" },
                        },
                        {
                            name: "education",
                            type: "`string`",
                            description: { en: "Education level", fr: "Niveau d'éducation" },
                        },
                        {
                            name: "work_experience",
                            type: "`string`",
                            description: {
                                en: "Years of work experience",
                                fr: "Années d'expérience professionnelle",
                            },
                        },
                        {
                            name: "health_status",
                            type: "`string`",
                            description: { en: "Health status", fr: "État de santé" },
                        },
                        {
                            name: "emergency_contacts",
                            type: "`object[]`",
                            description: {
                                en: "Array of emergency contacts (`name`, `relationship`, `phone`)",
                                fr: "Tableau des contacts d'urgence",
                            },
                        },
                        {
                            name: "subscriptions",
                            type: "`string[]`",
                            description: {
                                en: "Array of subscriptions",
                                fr: "Tableau des abonnements",
                            },
                        },
                        {
                            name: "pets",
                            type: "`string[]`",
                            description: {
                                en: "Array of pets",
                                fr: "Tableau des animaux de compagnie",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [
                { type: "examples", op: "default" },
                { type: "try", op: "default" },
                {
                    type: "callout",
                    kind: "warning",
                    title: "Note",
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "All generated data is fictional and randomly created. Credit card numbers are Luhn-valid but do not correspond to any real account.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Toutes les données générées sont fictives et créées de manière aléatoire. Les numéros de carte sont Luhn-valides mais ne correspondent à aucun compte réel.",
                            },
                        ],
                    },
                },
            ],
        },
    ],
};
