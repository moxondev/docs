import type { Page } from "@/types/content";

export const page: Page = {
    version: "v2",
    id: "username",
    kind: "endpoint",
    title: { en: "Username Generation", fr: "Génération de noms d'utilisateurs" },
    lead: {
        en: "The `/username` endpoint returns a list of adjectives, another with animal names, and the last with professions. A number and a random username are generated from all the information. This endpoint does not require any options.",
        fr: "L'endpoint `/username` renvoie une liste d'adjectifs, une autre avec des noms d'animaux et la dernière avec des métiers. Un nombre ainsi qu'un nom d'utilisateur aléatoire est généré à partir de toutes les informations. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-04-08",
    operations: [{ id: "default", method: "get", path: "/username", try: false, params: [] }],
    sections: [
        {
            id: "",
            blocks: [
                { type: "endpoint", op: "default" },
                {
                    type: "p",
                    text: {
                        en: "The username can consist of one or more elements chosen from the lists or the generated number.",
                        fr: "Le nom d'utilisateur peut être composé d'un ou plusieurs éléments choisis parmi les listes ou du nombre généré.",
                    },
                },
            ],
        },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [{ type: "code", text: "GET /v2/username", role: "request" }],
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
                    text: '{\n    "adjective": ["Happy", "Silly", "Clever", "Creative", "Brave", "..."],\n    "animal": ["Cat", "Dog", "Tiger", "Elephant", "Monkey", "..."],\n    "job": ["Writer", "Artist", "Musician", "Explorer", "Scientist", "..."],\n    "number": "99",\n    "username": "HappyCat99"\n}',
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
                    text: 'curl -X GET "https://api.moxon.dev/v2/username"',
                    role: "curl",
                },
            ],
        },
    ],
};
