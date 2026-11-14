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
    updated: "2026-11-14",
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
                                en: "The private chat token (max 256 characters)",
                                fr: "Le token du chat privé (max 256 caractères)",
                            },
                        },
                        {
                            name: "username",
                            required: true,
                            description: {
                                en: "The username (max 100 characters)",
                                fr: "Le nom de l'utilisateur (max 100 caractères)",
                            },
                        },
                        {
                            name: "session",
                            required: true,
                            description: {
                                en: "The user's session identifier (max 256 characters)",
                                fr: "L'identifiant de session de l'utilisateur (max 256 caractères)",
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
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Bounded inputs", fr: "Entrées bornées" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Since 6.2.0, `username` is limited to 100 characters, `session` and `token` to 256. A longer value, or one that is an object or an array, is refused with the usual `400` error.",
                            },
                            {
                                type: "p",
                                text: "A token named like `constructor` or `__proto__` is an ordinary token: if it was never used, it is reported as invalid or expired like any other.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Depuis la 6.2.0, `username` est limité à 100 caractères, `session` et `token` à 256. Une valeur plus longue, ou qui est un objet ou un tableau, est refusée avec l'erreur `400` habituelle.",
                            },
                            {
                                type: "p",
                                text: "Un token nommé `constructor` ou `__proto__` est un token ordinaire : s'il n'a jamais été utilisé, il est signalé comme invalide ou expiré, comme les autres.",
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
                        {
                            message: "Username cannot exceed 100 characters",
                            description: {
                                en: "The `username` parameter is longer than 100 characters (since 6.2.0)",
                                fr: "Le paramètre `username` dépasse 100 caractères (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                        {
                            message: "Session ID cannot exceed 256 characters",
                            description: {
                                en: "The `session` parameter is longer than 256 characters (since 6.2.0)",
                                fr: "Le paramètre `session` dépasse 256 caractères (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                        {
                            message: "Token cannot exceed 256 characters",
                            description: {
                                en: "The `token` parameter is longer than 256 characters (since 6.2.0)",
                                fr: "Le paramètre `token` dépasse 256 caractères (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid username",
                            description: {
                                en: "The `username` parameter is an object or an array (since 6.2.0)",
                                fr: "Le paramètre `username` est un objet ou un tableau (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid session ID",
                            description: {
                                en: "The `session` parameter is an object or an array (since 6.2.0)",
                                fr: "Le paramètre `session` est un objet ou un tableau (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid token",
                            description: {
                                en: "The `token` parameter is an object or an array (since 6.2.0)",
                                fr: "Le paramètre `token` est un objet ou un tableau (depuis la 6.2.0)",
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
