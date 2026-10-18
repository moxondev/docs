import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "chat",
    kind: "endpoint",
    title: { en: "Online Chat", fr: "Chat en ligne" },
    lead: {
        en: "The `/chat` endpoint provides a real-time messaging system with support for public and private channels. Messages are stored for 1 hour.",
        fr: "L'endpoint `/chat` fournit un système de messagerie en temps réel avec support pour les canaux publics et privés. Les messages sont stockés pendant 1 heure.",
    },
    updated: "2026-05-25",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/chat",
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
                    name: "message",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "Hello!",
                },
                {
                    name: "session",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "my-session",
                },
                {
                    name: "token",
                    type: "string",
                    in: "body",
                    required: false,
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
                                en: "The username of the user who sends the message",
                                fr: "Le nom d'utilisateur de l'expéditeur",
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
                                fr: "La clé utilisée pour se connecter à un chat privé. Si non fourni, le message sera envoyé dans le chat global",
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
                        en: { username: "User3", message: "How are you?", session: "abc123" },
                        fr: {
                            username: "Utilisateur3",
                            message: "Comment ça va ?",
                            session: "abc123",
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
            id: "error-responses",
            level: 2,
            title: { en: "Error Responses", fr: "Réponses d'erreur" },
            aliases: ["reponses-d-erreur"],
            blocks: [
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Global rate limit exceeded.",
                            description: {
                                en: "Global API rate limit reached",
                                fr: "Limite globale de l'API atteinte",
                            },
                            status: 429,
                        },
                        {
                            message: "You have exceeded the limit of X requests per hour.",
                            description: {
                                en: "Hourly IP/token limit reached",
                                fr: "Limite horaire IP/token atteinte",
                            },
                            status: 429,
                        },
                        {
                            message: "Rate limit exceeded. Try again in X seconds.",
                            description: {
                                en: "Per-user short-window limit",
                                fr: "Limite courte durée par utilisateur",
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
                    ],
                    short: true,
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
                    type: "related",
                    items: [
                        {
                            label: "/v5/chat",
                            to: "chat/messages",
                            description: {
                                en: "Retrieve all recent messages",
                                fr: "Récupérer les messages récents",
                            },
                        },
                        {
                            label: "/v5/chat/private",
                            to: "chat/private",
                            description: {
                                en: "Create and manage private chat channels",
                                fr: "Créer et gérer des canaux de chat privés",
                            },
                        },
                        {
                            label: "/v5/chat/:token",
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
