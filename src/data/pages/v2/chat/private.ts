import type { Page } from "@/types/content";

export const page: Page = {
    version: "v2",
    id: "chat/private",
    kind: "endpoint",
    title: { en: "Private Chats", fr: "Chats privés" },
    lead: {
        en: "The `/chat/private` endpoint retrieves all messages sent during the last hour, belonging to a private chat.",
        fr: "L'endpoint `/chat/private` récupère tous les messages envoyés durant la dernière heure, faisant partie d'un chat privé.",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/chat/private",
            try: false,
            params: [
                { name: "username", type: "string", in: "body", required: true },
                { name: "token", type: "string", in: "body", required: true },
            ],
        },
    ],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Paramètres" },
            aliases: ["parametres"],
            blocks: [
                {
                    type: "params",
                    rows: [
                        {
                            name: "username",
                            required: true,
                            description: {
                                en: "The username of the user who sends the message",
                                fr: "Le nom d'utilisateur qui a envoyé le message",
                            },
                        },
                        {
                            name: "token",
                            required: true,
                            description: {
                                en: "The key used to connect to the desired private chat",
                                fr: "La clé permettant la connexion au chat privé désiré",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: {
                        en: 'curl -X POST -d "username=User3&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v2/chat/private"',
                        fr: 'curl -X POST -d "username=Utilisateur3&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v2/chat/private"',
                    },
                    role: "request",
                },
            ],
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
                        en: '[\n    {\n        "username": "User1",\n        "message": "Hi!",\n        "timestamp": "2025-01-21T08:27:11.068Z"\n    },\n    {\n        "username": "User3",\n        "message": "How are you?",\n        "timestamp": "2025-01-21T08:28:43.070Z"\n    },\n    {\n        "username": "User8",\n        "message": "Yeah great, and you?",\n        "timestamp": "2025-01-21T08:32:07.215Z"\n    }\n]',
                        fr: '[\n    {\n        "username": "Utilisateur1",\n        "message": "Salut !",\n        "timestamp": "2025-01-21T08:27:11.068Z"\n    },\n    {\n        "username": "Utilisateur3",\n        "message": "Ça va ?",\n        "timestamp": "2025-01-21T08:28:43.070Z"\n    },\n    {\n        "username": "Utilisateur8",\n        "message": "Ouais super et vous ?",\n        "timestamp": "2025-01-21T08:32:07.215Z"\n    }\n]',
                    },
                    role: "response",
                },
            ],
        },
        {
            id: "error-handling",
            level: 2,
            title: { en: "Error Handling", fr: "Gestion des erreurs" },
            aliases: ["gestion-des-erreurs"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "If the value of `username` or `token` is empty, the token is invalid or the chat doesn't exist, an error will be returned.",
                        fr: "Si la valeur de `username` ou `token` est vide, que le token est invalide ou que le chat n'existe pas, une erreur sera renvoyée.",
                    },
                },
            ],
        },
    ],
};
