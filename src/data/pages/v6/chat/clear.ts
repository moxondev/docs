import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "chat/clear",
    kind: "endpoint",
    title: { en: "Chat Clear", fr: "Chat Effacer" },
    lead: {
        en: "The `/chat/clear` endpoint clears all messages from a private chat.",
        fr: "L'endpoint `/chat/clear` efface tous les messages d'un chat privé.",
    },
    updated: "2026-09-13",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/chat/clear",
            try: true,
            params: [
                {
                    name: "token",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "41a43360-9874-4c7a-9ca8-eec29e765a0e",
                },
                {
                    name: "username",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "alice",
                },
                {
                    name: "session",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "abc123",
                },
            ],
        },
    ],
    sections: [
        {
            id: "",
            blocks: [
                { type: "endpoint", op: "default" },
                {
                    type: "callout",
                    kind: "warning",
                    title: { en: "Changed in 6.0.0", fr: "Changement en 6.0.0" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "This endpoint moved from `DELETE` to `POST`, and its identifier left the URL: `token` is now sent in the JSON body. `PATCH` and `DELETE` no longer exist anywhere in the API.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Cet endpoint passe de `DELETE` à `POST`, et son identifiant sort de l'URL : `token` est désormais envoyé dans le corps JSON. Les méthodes `PATCH` et `DELETE` n'existent plus nulle part dans l'API.",
                            },
                        ],
                    },
                },
            ],
        },
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
                            name: "token",
                            required: true,
                            description: {
                                en: "The private chat token",
                                fr: "Le token du chat privé",
                            },
                        },
                        {
                            name: "username",
                            required: true,
                            description: { en: "The username", fr: "Le nom de l'utilisateur" },
                        },
                        {
                            name: "session",
                            required: true,
                            description: {
                                en: "The user's session identifier",
                                fr: "L'identifiant de session de l'utilisateur",
                            },
                        },
                    ],
                },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Good to know", fr: "À savoir" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "All parameters are sent as a JSON body with `Content-Type: application/json`.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Tous les paramètres sont envoyés dans un body JSON avec `Content-Type: application/json`.",
                            },
                        ],
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
                            name: "message",
                            type: "`string`",
                            description: {
                                en: "Confirmation message",
                                fr: "Message de confirmation",
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
                {
                    type: "examples",
                    op: "default",
                    body: {
                        token: "41a43360-9874-4c7a-9ca8-eec29e765a0e",
                        username: "alice",
                        session: "abc123",
                    },
                },
                { type: "try", op: "default" },
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
                            message: "Invalid or expired token",
                            description: {
                                en: "The token is invalid or has expired",
                                fr: "Le token est invalide ou a expiré",
                            },
                            status: 400,
                        },
                        {
                            message: "Session ID mismatch",
                            description: {
                                en: "Session does not match the user",
                                fr: "La session ne correspond pas à l'utilisateur",
                            },
                            status: 400,
                        },
                        {
                            message: "Rate limit exceeded",
                            description: {
                                en: "Too many requests in a short period",
                                fr: "Limite de requêtes atteinte",
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
                    type: "related",
                    items: [
                        {
                            label: "/v6/chat",
                            to: "chat",
                            description: { en: "Send a message", fr: "Envoyer un message" },
                        },
                        {
                            label: "/v6/chat",
                            to: "chat/messages",
                            description: {
                                en: "Retrieve all recent messages",
                                fr: "Récupérer les messages récents",
                            },
                        },
                        {
                            label: "/v6/chat/private",
                            to: "chat/private",
                            description: {
                                en: "Create and manage private chat channels",
                                fr: "Créer et gérer des canaux de chat privés",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
