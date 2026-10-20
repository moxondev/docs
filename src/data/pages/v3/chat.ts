import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "chat",
    kind: "endpoint",
    title: { en: "Online Chat", fr: "Chat en ligne" },
    lead: {
        en: "The `/chat` endpoint provides a real-time messaging system with support for public and private channels.",
        fr: "L'endpoint `/chat` fournit un système de messagerie en temps réel avec support pour les canaux publics et privés.",
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
            id: "get-v3-chat",
            level: 2,
            title: { en: "GET /v3/chat", fr: "GET /v3/chat" },
            blocks: [
                { type: "endpoint", op: "get" },
                {
                    type: "p",
                    text: {
                        en: "Retrieves all messages sent during the last hour. This endpoint does not require any options.",
                        fr: "Récupère tous les messages envoyés durant la dernière heure. Cet endpoint ne nécessite aucune option.",
                    },
                },
            ],
        },
        {
            id: "request-example",
            level: 3,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [{ type: "code", text: "GET /v3/chat", role: "request" }],
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
                        fr: '[\n    {\n        "username": "Utilisateur1",\n        "message": "Salut !",\n        "timestamp": "2025-01-21T08:27:11.068Z"\n    },\n    {\n        "username": "Utilisateur3",\n        "message": "Comment ça va ?",\n        "timestamp": "2025-01-21T08:28:43.070Z"\n    },\n    {\n        "username": "Utilisateur8",\n        "message": "Très bien, et toi ?",\n        "timestamp": "2025-01-21T08:32:07.215Z"\n    }\n]',
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
                    text: 'curl -X GET "https://api.moxon.dev/v3/chat"',
                    role: "curl",
                },
                { type: "rule" },
            ],
        },
        {
            id: "post-v3-chat",
            level: 2,
            title: { en: "POST /v3/chat", fr: "POST /v3/chat" },
            blocks: [
                { type: "endpoint", op: "post" },
                {
                    type: "p",
                    text: {
                        en: "Allows sending a message to the global chat or a private chat.",
                        fr: "Permet d'envoyer un message au chat global ou à un chat privé.",
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
                                fr: "Le nom d'utilisateur de l'utilisateur qui envoie le message",
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
                                fr: "La clé utilisée pour se connecter à un chat privé. Si non fournie, le message sera envoyé au chat global",
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
                        en: 'curl -X POST -d "username=User3&message=How are you?&session=abc123&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v3/chat"',
                        fr: 'curl -X POST -d "username=Utilisateur3&message=Comment ça va ?&session=abc123&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v3/chat"',
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
                        en: "If parameters are missing or invalid, the API will return an error:",
                        fr: "Si les paramètres sont manquants ou invalides, l'API retournera une erreur :",
                    },
                },
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Please provide a username (?username={username})",
                            description: {
                                en: "The `username` parameter is missing",
                                fr: "Le paramètre `username` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a message (&message={message})",
                            description: {
                                en: "The `message` parameter is missing",
                                fr: "Le paramètre `message` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid session ID (&session={ID})",
                            description: {
                                en: "The `session` parameter is missing or invalid",
                                fr: "Le paramètre `session` est manquant ou invalide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
        {
            id: "related-endpoints",
            level: 2,
            title: { en: "Related Endpoints", fr: "Endpoints associés" },
            aliases: ["endpoints-associes"],
            blocks: [
                {
                    type: "list",
                    items: [
                        {
                            en: "[/v3/chat/private](ref:chat/private) - Create and manage private chat channels",
                            fr: "[/v3/chat/private](ref:chat/private) - Créer et gérer des canaux de chat privés",
                        },
                    ],
                },
            ],
        },
    ],
};
