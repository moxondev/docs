import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "chat/private",
    kind: "endpoint",
    title: { en: "Private Chat", fr: "Chat Privé" },
    lead: {
        en: "The `/chat/private` endpoint retrieves the messages sent during the last hour, up to the 200 most recent, belonging to a private chat.",
        fr: "L'endpoint `/chat/private` récupère les messages envoyés durant la dernière heure, dans la limite des 200 plus récents, appartenant à un chat privé.",
    },
    updated: "2026-11-14",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/chat/private",
            try: true,
            params: [
                {
                    name: "username",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "john",
                },
                {
                    name: "token",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "abc123",
                },
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
                                en: "The username of the user who sends the message (max 100 characters)",
                                fr: "Le nom d'utilisateur qui a envoyé le message (max 100 caractères)",
                            },
                        },
                        {
                            name: "token",
                            required: true,
                            description: {
                                en: "The key used to connect to the desired private chat (max 256 characters)",
                                fr: "La clé permettant la connexion au chat privé désiré (max 256 caractères)",
                            },
                        },
                    ],
                },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Bounded inputs", fr: "Entrées bornées" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Since 6.2.0, `username` is limited to 100 characters and `token` to 256. A longer value, or one that is an object or an array, is refused with the usual `400` error.",
                            },
                            {
                                type: "p",
                                text: "A private chat keeps its 200 most recent messages: when a new message goes beyond that, the oldest one is dropped, even before its hour is up, so the response never holds more than 200 messages. A token named like `constructor` or `__proto__` is an ordinary token: if it was never used, it is reported as invalid or expired like any other.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Depuis la 6.2.0, `username` est limité à 100 caractères et `token` à 256. Une valeur plus longue, ou qui est un objet ou un tableau, est refusée avec l'erreur `400` habituelle.",
                            },
                            {
                                type: "p",
                                text: "Un chat privé conserve ses 200 messages les plus récents : quand un nouveau message dépasse cette limite, le plus ancien est supprimé, même avant la fin de son heure, de sorte que la réponse ne contient jamais plus de 200 messages. Un token nommé `constructor` ou `__proto__` est un token ordinaire : s'il n'a jamais été utilisé, il est signalé comme invalide ou expiré, comme les autres.",
                            },
                        ],
                    },
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
                        en: { username: "User3", token: "41a43360-9874-4c7a-9ca8-eec29e765a0e" },
                        fr: {
                            username: "Utilisateur3",
                            token: "41a43360-9874-4c7a-9ca8-eec29e765a0e",
                        },
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
                    type: "split",
                    en: [],
                    fr: [{ type: "p", text: "Retourne un tableau d'objets message." }],
                },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "username",
                            type: "`string`",
                            description: {
                                en: "Username of the message sender",
                                fr: "Nom d'utilisateur de l'expéditeur",
                            },
                        },
                        {
                            name: "message",
                            type: "`string`",
                            description: { en: "Content of the message", fr: "Contenu du message" },
                        },
                        {
                            name: "timestamp",
                            type: "`string`",
                            description: {
                                en: "ISO 8601 timestamp of the message",
                                fr: "Horodatage du message (ISO 8601)",
                            },
                        },
                    ],
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
                        {
                            message: "Invalid or expired token",
                            description: {
                                en: "The token is invalid or has expired",
                                fr: "Le token est invalide ou expiré",
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
                            label: "/v4/chat",
                            to: "chat",
                            description: { en: "Send a message", fr: "Envoyer un message" },
                        },
                        {
                            label: "/v4/chat",
                            to: "chat/messages",
                            description: {
                                en: "Retrieve all recent messages",
                                fr: "Récupérer les messages récents",
                            },
                        },
                        {
                            label: "/v4/chat/:token",
                            to: "chat/clear",
                            description: {
                                en: "Clear all messages from a private chat",
                                fr: "Effacer les messages d'un chat privé",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
