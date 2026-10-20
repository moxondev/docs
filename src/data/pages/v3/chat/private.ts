import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "chat/private",
    kind: "endpoint",
    title: { en: "Private Chat", fr: "Chat Privé" },
    lead: {
        en: "The `/chat/private` endpoint retrieves all messages sent during the last hour, belonging to a private chat.",
        fr: "L'endpoint `/chat/private` récupère tous les messages envoyés durant la dernière heure, appartenant à un chat privé.",
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
                        en: 'curl -X POST -d "username=User3&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v3/chat/private"',
                        fr: 'curl -X POST -d "username=Utilisateur3&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v3/chat/private"',
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
                        en: '[\n    {\n        "username": "User1",\n        "message": "Hi!",\n        "timestamp": "2025-01-21T08:27:11.068Z"\n    },\n    {\n        "username": "User3",\n        "message": "How are you?",\n        "timestamp": "2025-01-21T08:28:43.070Z"\n    }\n]',
                        fr: '[\n    {\n        "username": "Utilisateur1",\n        "message": "Salut !",\n        "timestamp": "2025-01-21T08:27:11.068Z"\n    },\n    {\n        "username": "Utilisateur3",\n        "message": "Comment ça va ?",\n        "timestamp": "2025-01-21T08:28:43.070Z"\n    }\n]',
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
                            message: "Please provide a valid token (&token={key}).",
                            description: {
                                en: "The `token` parameter is missing or invalid",
                                fr: "Le paramètre `token` est manquant ou invalide",
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
                            en: "[/v3/chat](ref:chat) - Main chat endpoint for sending and receiving messages",
                            fr: "[/v3/chat](ref:chat) - Endpoint principal du chat pour envoyer et recevoir des messages",
                        },
                    ],
                },
            ],
        },
    ],
};
