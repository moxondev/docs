import type { Page } from "@/types/content";

export const page: Page = {
    version: "v2",
    id: "chat",
    kind: "endpoint",
    title: { en: "Online Chat", fr: "Chat en ligne" },
    lead: {
        en: "The `/chat` endpoint allows retrieving and sending messages in a global or private chat.",
        fr: "L'endpoint `/chat` permet de récupérer et d'envoyer des messages dans un chat global ou privé.",
    },
    updated: "2026-04-08",
    operations: [
        { id: "get", method: "get", path: "/chat", try: false, params: [] },
        {
            id: "post",
            method: "post",
            path: "/chat",
            try: false,
            params: [
                { name: "username", type: "string", in: "body", required: true },
                { name: "message", type: "string", in: "body", required: true },
                { name: "session", type: "string", in: "body", required: true },
                { name: "token", type: "string", in: "body", required: false },
            ],
        },
    ],
    sections: [
        { id: "", blocks: [] },
        {
            id: "get-messages",
            level: 2,
            title: { en: "Get Messages", fr: "Récupérer les messages" },
            aliases: ["recuperer-les-messages"],
            blocks: [
                { type: "endpoint", op: "get" },
                {
                    type: "p",
                    text: {
                        en: "The `/chat` endpoint retrieves all messages sent during the last hour. This endpoint does not require any options.",
                        fr: "L'endpoint `/chat` récupère tous les messages envoyés durant la dernière heure. Cet endpoint ne nécessite aucune option.",
                    },
                },
            ],
        },
        {
            id: "request-example",
            level: 3,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [{ type: "code", text: "GET /v2/chat", role: "request" }],
        },
        {
            id: "response",
            level: 3,
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
            id: "curl",
            level: 3,
            title: { en: "cURL", fr: "cURL" },
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X GET "https://api.moxon.dev/v2/chat"',
                    role: "curl",
                },
                { type: "rule" },
            ],
        },
        {
            id: "send-message",
            level: 2,
            title: { en: "Send Message", fr: "Envoyer un message" },
            aliases: ["envoyer-un-message"],
            blocks: [
                { type: "endpoint", op: "post" },
                {
                    type: "p",
                    text: {
                        en: "The `/chat` endpoint allows sending a message to the global chat or a private chat.",
                        fr: "L'endpoint `/chat` permet l'envoi d'un message vers le chat global ou un chat privé.",
                    },
                },
            ],
        },
        {
            id: "parameters",
            level: 3,
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
                            name: "message",
                            required: true,
                            description: { en: "The message to send", fr: "Le message à envoyer" },
                        },
                        {
                            name: "session",
                            required: true,
                            description: {
                                en: "The session ID of the user",
                                fr: "L'identifiant de session de l'utilisateur",
                            },
                        },
                        {
                            name: "token",
                            required: false,
                            description: {
                                en: "The key used to connect to a private chat. If not provided, the message will be sent to the global chat",
                                fr: "La clé permettant la connexion à un chat privé. Si elle n'est pas fournie, le message sera envoyé dans le chat global",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "request-example-1",
            level: 3,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete-1"],
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: {
                        en: 'curl -X POST -d "username=User3&message=How are you?&session=abc123&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v2/chat"',
                        fr: 'curl -X POST -d "username=Utilisateur3&message=Ça va ?&session=abc123&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v2/chat"',
                    },
                    role: "request",
                },
            ],
        },
        {
            id: "response-1",
            level: 3,
            title: { en: "Response", fr: "Réponse" },
            aliases: ["reponse-1"],
            blocks: [
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "message": "Message sent successfully"\n}',
                    role: "response",
                },
            ],
        },
        {
            id: "error-handling",
            level: 3,
            title: { en: "Error Handling", fr: "Gestion des erreurs" },
            aliases: ["gestion-des-erreurs"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "If the value of `username`, `message` or `session` is empty, an error will be returned.",
                        fr: "Si la valeur de `username`, `message` ou `session` est vide, une erreur sera renvoyée.",
                    },
                },
            ],
        },
    ],
};
