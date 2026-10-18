import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "chat/messages",
    kind: "endpoint",
    title: { en: "Chat Messages", fr: "Chat Messages" },
    lead: {
        en: "The `/chat` endpoint retrieves all messages sent during the last hour. This endpoint does not require any options.",
        fr: "L'endpoint `/chat` récupère tous les messages envoyés durant la dernière heure. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-04-21",
    operations: [{ id: "default", method: "get", path: "/chat", try: true, params: [] }],
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
                        en: "This endpoint does not require any parameters. It returns all messages from the last hour.",
                        fr: "Cet endpoint ne nécessite aucun paramètre. Il retourne tous les messages de la dernière heure.",
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
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [
                { type: "examples", op: "default" },
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
                            message: "No messages stored",
                            description: {
                                en: "No messages have been sent in the last hour",
                                fr: "Aucun message stocké dans le chat",
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
                            label: "/v4/chat/private",
                            to: "chat/private",
                            description: {
                                en: "Create and manage private chat channels",
                                fr: "Créer et gérer des canaux de chat privés",
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
