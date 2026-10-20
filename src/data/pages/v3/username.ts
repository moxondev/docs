import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "username",
    kind: "endpoint",
    title: { en: "Username Generation", fr: "Génération de noms d'utilisateur" },
    lead: {
        en: "The `/username` endpoint generates random usernames. This endpoint is useful for creating placeholder usernames or suggesting names to users.",
        fr: "L'endpoint `/username` renvoie une liste d'adjectifs, une autre avec des noms d'animaux et la dernière avec des métiers. Un nombre ainsi qu'un nom d'utilisateur aléatoire est généré à partir de toutes les informations. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-04-08",
    operations: [{ id: "default", method: "get", path: "/username", try: false, params: [] }],
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
            blocks: [{ type: "code", text: "GET /v3/username", role: "request" }],
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
                        en: '{\n    "username": "CoolDragon42"\n}',
                        fr: '{\n  "adjective": [\n    "Happy",\n    "Silly",\n    "Clever",\n    "Creative",\n    "Brave",\n    ...\n  ],\n  "animal": [\n    "Cat",\n    "Dog",\n    "Tiger",\n    "Elephant",\n    "Monkey",\n    ...\n  ],\n  "job": [\n    "Writer",\n    "Artist",\n    "Musician",\n    "Explorer",\n    "Scientist",\n    ...\n  ],\n  "number": "99",\n  "username": "HappyCat99"\n}',
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
                    type: "split",
                    en: [
                        {
                            type: "table",
                            head: ["Field", "Description"],
                            rows: [["`username`", "A randomly generated username"]],
                            kind: "definition",
                        },
                    ],
                    fr: [
                        {
                            type: "table",
                            head: ["Champ", "Description"],
                            rows: [
                                ["`adjective`", "Liste d'adjectifs"],
                                ["`animal`", "Liste de noms d'animaux"],
                                ["`job`", "Liste de métiers"],
                                ["`number`", "Nombre généré aléatoirement"],
                                ["`username`", "Nom d'utilisateur généré aléatoirement"],
                            ],
                            kind: "definition",
                        },
                    ],
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
                    text: 'curl -X GET "https://api.moxon.dev/v3/username"',
                    role: "curl",
                },
            ],
        },
        {
            id: "use-cases",
            level: 2,
            title: { en: "Use Cases", fr: "Cas d'utilisation" },
            aliases: ["cas-d-utilisation"],
            blocks: [
                {
                    type: "list",
                    items: [
                        {
                            en: "**User registration**: Suggest usernames during sign-up",
                            fr: "**Inscription utilisateur** : Suggérer des noms d'utilisateur lors de l'inscription",
                        },
                        {
                            en: "**Gaming**: Generate player names",
                            fr: "**Jeux** : Générer des noms de joueurs",
                        },
                        {
                            en: "**Testing**: Create test user data",
                            fr: "**Tests** : Créer des données d'utilisateurs de test",
                        },
                        {
                            en: "**Placeholder content**: Fill in sample data",
                            fr: "**Contenu de remplacement** : Remplir des données d'exemple",
                        },
                    ],
                },
            ],
        },
        {
            id: "note",
            level: 2,
            title: { en: "", fr: "Note" },
            only: "fr",
            blocks: [
                {
                    type: "p",
                    text: "Le nom d'utilisateur peut être composé d'un ou plusieurs éléments choisis parmi les listes ou du nombre généré.",
                },
            ],
        },
    ],
};
